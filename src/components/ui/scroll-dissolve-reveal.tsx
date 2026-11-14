"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coverFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uGrayscale;
  uniform float uEdgeIntensity;
  uniform float uEdgeBrightness;
  varying vec2 vUv;

  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );

  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }

    return sqrt(gx * gx + gy * gy);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }

  void main() {
    float screenAspect = uResolution.x / max(uResolution.y, 1.0);
    float imageAspect = uImageResolution.x / max(uImageResolution.y, 1.0);

    // Fit image cleanly within viewport so people and faces are never cropped out
    float fitFactor = 0.92;
    vec2 scale = vec2(1.0);
    if (screenAspect > imageAspect) {
      scale.x = (imageAspect / screenAspect) * fitFactor;
      scale.y = fitFactor;
    } else {
      scale.y = (screenAspect / imageAspect) * fitFactor;
      scale.x = fitFactor;
    }

    vec2 uv = (vUv - 0.5) / scale + 0.5;
    bool inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;

    if (!inBounds) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 centeredUv = vUv - uCenter;
    float aspect = uResolution.x / uResolution.y;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    
    float angle = atan(centeredUv.y, centeredUv.x);
    
    float noiseScale = 6.0;
    vec2 pixelatedUv = floor(vUv * uResolution / noiseScale) * noiseScale / uResolution;
    float blockNoise = fbm(pixelatedUv * 100.0) * 0.15;
    
    float angularNoise = fbm(vec2(angle * 5.0, 0.0)) * 0.15;
    
    float totalNoise = blockNoise + angularNoise;
    float noisyDist = dist + totalNoise;
    
    float maxDist = length(vec2(aspect * 0.5, 0.5));
    float normalizedDist = noisyDist / maxDist;
    
    float dissolveThreshold = uDissolve * 1.5; 
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    float dissolveMask = smoothstep(dissolveThreshold - 0.03, dissolveThreshold, normalizedDist);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uGrayscale);
    vec3 finalColor = baseColor;
    
    float edgeGlowIntensity = uEdgeIntensity * 2.0;
    float edgeGlow = edge * edgeGlowIntensity * (1.0 + uGrayscale * 3.0);
    finalColor += edgeColor * edgeGlow * uEdgeBrightness;
    
    float edgeZoneWidth = 0.15 * (1.0 - uDissolve) + 0.02;
    float edgeZone = smoothstep(dissolveThreshold - edgeZoneWidth, dissolveThreshold - edgeZoneWidth + 0.04, normalizedDist) * 
                     smoothstep(dissolveThreshold + 0.02, dissolveThreshold - 0.02, normalizedDist);
    float sparkle = hash(floor(vUv * uResolution / 4.0)) * edgeZone;
    
    float edgeBrightness = (1.0 - uDissolve) * uEdgeBrightness * (1.0 + uGrayscale * 2.0);
    finalColor += vec3(sparkle * 3.0 * edgeBrightness);
    
    float alpha = dissolveMask * texColor.a;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const coverFragmentShaderReverse = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uBrightness;
  uniform float uEdgeIntensity;
  uniform float uDarkness;
  uniform float uGrayscale;
  varying vec2 vUv;

  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );

  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }

    return sqrt(gx * gx + gy * gy);
  }

  void main() {
    float screenAspect = uResolution.x / max(uResolution.y, 1.0);
    float imageAspect = uImageResolution.x / max(uImageResolution.y, 1.0);

    // Fit image cleanly within viewport so people and faces are never cropped out
    float fitFactor = 0.92;
    vec2 scale = vec2(1.0);
    if (screenAspect > imageAspect) {
      scale.x = (imageAspect / screenAspect) * fitFactor;
      scale.y = fitFactor;
    } else {
      scale.y = (screenAspect / imageAspect) * fitFactor;
      scale.x = fitFactor;
    }

    vec2 uv = (vUv - 0.5) / scale + 0.5;
    bool inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;

    if (!inBounds) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 darkBase = vec3(0.0);
    vec3 baseColor = mix(texColor.rgb, darkBase, uDarkness);
    
    float edgeGlow = edge * uEdgeIntensity * 2.0;
    baseColor += edgeColor * edgeGlow;
    
    vec3 finalColor = clamp(baseColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

interface SceneProps {
  imageFront: string;
  imageBack: string;
  scrollYProgress: MotionValue<number>;
}

const TwoImageScene = ({ imageFront, imageBack, scrollYProgress }: SceneProps) => {
  const [texture1, texture2] = useTexture([imageFront, imageBack]);
  const material1Ref = useRef<THREE.ShaderMaterial>(null);
  const material2Ref = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", () => invalidate());
    return () => unsubscribe();
  }, [invalidate, scrollYProgress]);

  const uniforms1 = useMemo(
    () => ({
      uTexture: { value: texture1 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: {
        value: new THREE.Vector2((texture1.image as any)?.width || 1920, (texture1.image as any)?.height || 1080),
      },
      uDissolve: { value: 0.0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0.0 },
      uGrayscale: { value: 0.0 },
      uEdgeIntensity: { value: 0.0 },
      uEdgeBrightness: { value: 1.0 },
    }),
    [texture1, size]
  );

  const uniforms2 = useMemo(
    () => ({
      uTexture: { value: texture2 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: {
        value: new THREE.Vector2((texture2.image as any)?.width || 1920, (texture2.image as any)?.height || 1080),
      },
      uDissolve: { value: 0.0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0.0 },
      uBrightness: { value: 0.0 },
      uEdgeIntensity: { value: 0.6 },
      uDarkness: { value: 1.0 },
      uGrayscale: { value: 1.0 },
    }),
    [texture2, size]
  );

  useFrame((state) => {
    const timeInSeconds = state.clock.getElapsedTime();
    const progress = scrollYProgress.get();

    if (material1Ref.current) {
      material1Ref.current.uniforms.uTime.value = timeInSeconds;
      material1Ref.current.uniforms.uResolution.value.set(size.width, size.height);
      material1Ref.current.uniforms.uDissolve.value = progress;
      const grayscaleProgress = Math.min(1.0, progress / 0.4);
      material1Ref.current.uniforms.uGrayscale.value = grayscaleProgress;
      material1Ref.current.uniforms.uEdgeIntensity.value = progress * 0.5;
      material1Ref.current.uniforms.uEdgeBrightness.value = 1.0 - progress;
    }

    if (material2Ref.current) {
      material2Ref.current.uniforms.uTime.value = timeInSeconds;
      material2Ref.current.uniforms.uResolution.value.set(size.width, size.height);
      const acceleratedProgress = Math.min(1.0, progress * 1.1);
      material2Ref.current.uniforms.uEdgeIntensity.value = 0.6 * (1.0 - acceleratedProgress);
      material2Ref.current.uniforms.uDarkness.value = 1.0 - acceleratedProgress;
      material2Ref.current.uniforms.uGrayscale.value = 1.0 - acceleratedProgress;
    }
  });

  return (
    <>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={material2Ref}
          vertexShader={coverVertexShader}
          fragmentShader={coverFragmentShaderReverse}
          uniforms={uniforms2}
          transparent={true}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={material1Ref}
          vertexShader={coverVertexShader}
          fragmentShader={coverFragmentShader}
          uniforms={uniforms1}
          transparent={true}
        />
      </mesh>
    </>
  );
};

interface MultiImageSceneProps {
  images: string[];
  scrollYProgress: MotionValue<number>;
  onIndexChange?: (index: number) => void;
}

const MultiImageScene = ({
  images,
  scrollYProgress,
  onIndexChange,
}: MultiImageSceneProps) => {
  const { size } = useThree();
  const invalidate = useThree((state) => state.invalidate);

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const cacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const resCacheRef = useRef<Map<string, THREE.Vector2>>(new Map());

  const getOrLoadTexture = (url: string) => {
    if (!url) return null;
    if (cacheRef.current.has(url)) {
      return cacheRef.current.get(url)!;
    }
    const tex = textureLoader.load(url, (t) => {
      t.generateMipmaps = false;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      if (t.image) {
        resCacheRef.current.set(
          url,
          new THREE.Vector2((t.image as any).width || 1920, (t.image as any).height || 1080)
        );
      }
      invalidate();
    });
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    cacheRef.current.set(url, tex);
    return tex;
  };

  // Preload first 6 images immediately
  useEffect(() => {
    const preloadCount = Math.min(images.length, 6);
    for (let i = 0; i < preloadCount; i++) {
      getOrLoadTexture(images[i]);
    }
  }, [images]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", () => invalidate());
    return () => unsubscribe();
  }, [invalidate, scrollYProgress]);

  const initialTex1 = useMemo(
    () => getOrLoadTexture(images[0]) || new THREE.Texture(),
    [images]
  );
  const initialTex2 = useMemo(
    () => getOrLoadTexture(images[1] || images[0]) || new THREE.Texture(),
    [images]
  );

  const uniforms1 = useMemo(
    () => ({
      uTexture: { value: initialTex1 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(1920, 1080) },
      uDissolve: { value: 0.0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0.0 },
      uGrayscale: { value: 0.0 },
      uEdgeIntensity: { value: 0.0 },
      uEdgeBrightness: { value: 1.0 },
    }),
    [size]
  );

  const uniforms2 = useMemo(
    () => ({
      uTexture: { value: initialTex2 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(1920, 1080) },
      uDissolve: { value: 0.0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0.0 },
      uBrightness: { value: 0.0 },
      uEdgeIntensity: { value: 0.6 },
      uDarkness: { value: 1.0 },
      uGrayscale: { value: 1.0 },
    }),
    [size]
  );

  const material1Ref = useRef<THREE.ShaderMaterial>(null);
  const material2Ref = useRef<THREE.ShaderMaterial>(null);
  const lastIndexRef = useRef<number>(-1);

  useFrame((state) => {
    if (!images || images.length === 0) return;
    const timeInSeconds = state.clock.getElapsedTime();
    const progress = Math.max(0.0, Math.min(0.99999, scrollYProgress.get()));

    const totalSteps = images.length - 1;
    const scaledProgress = progress * totalSteps;
    const currentIndex = Math.min(Math.floor(scaledProgress), totalSteps - 1);
    const localProgress = scaledProgress - currentIndex; // 0.0 to 1.0

    if (currentIndex !== lastIndexRef.current) {
      lastIndexRef.current = currentIndex;
      onIndexChange?.(currentIndex);

      // Preload window of textures around current index
      for (let offset = -2; offset <= 5; offset++) {
        const targetIdx = currentIndex + offset;
        if (targetIdx >= 0 && targetIdx < images.length) {
          getOrLoadTexture(images[targetIdx]);
        }
      }

      // Memory cleanup: dispose textures more than 16 items away
      if (cacheRef.current.size > 24) {
        for (const [url, tex] of cacheRef.current.entries()) {
          const idx = images.indexOf(url);
          if (idx !== -1 && Math.abs(idx - currentIndex) > 16) {
            tex.dispose();
            cacheRef.current.delete(url);
            resCacheRef.current.delete(url);
          }
        }
      }
    }

    const frontUrl = images[currentIndex];
    const backUrl = images[currentIndex + 1] || images[currentIndex];

    const frontTex = getOrLoadTexture(frontUrl);
    const backTex = getOrLoadTexture(backUrl);

    if (material1Ref.current && frontTex) {
      if (material1Ref.current.uniforms.uTexture.value !== frontTex) {
        material1Ref.current.uniforms.uTexture.value = frontTex;
      }
      const frontRes = resCacheRef.current.get(frontUrl);
      if (frontRes) {
        material1Ref.current.uniforms.uImageResolution.value.copy(frontRes);
      } else if ((frontTex.image as any)?.width) {
        material1Ref.current.uniforms.uImageResolution.value.set(
          (frontTex.image as any).width,
          (frontTex.image as any).height
        );
      }

      material1Ref.current.uniforms.uTime.value = timeInSeconds;
      material1Ref.current.uniforms.uResolution.value.set(size.width, size.height);
      material1Ref.current.uniforms.uDissolve.value = localProgress;
      const grayscaleProgress = Math.min(1.0, localProgress / 0.4);
      material1Ref.current.uniforms.uGrayscale.value = grayscaleProgress;
      material1Ref.current.uniforms.uEdgeIntensity.value = localProgress * 0.5;
      material1Ref.current.uniforms.uEdgeBrightness.value = 1.0 - localProgress;
    }

    if (material2Ref.current && backTex) {
      if (material2Ref.current.uniforms.uTexture.value !== backTex) {
        material2Ref.current.uniforms.uTexture.value = backTex;
      }
      const backRes = resCacheRef.current.get(backUrl);
      if (backRes) {
        material2Ref.current.uniforms.uImageResolution.value.copy(backRes);
      } else if ((backTex.image as any)?.width) {
        material2Ref.current.uniforms.uImageResolution.value.set(
          (backTex.image as any).width,
          (backTex.image as any).height
        );
      }

      material2Ref.current.uniforms.uTime.value = timeInSeconds;
      material2Ref.current.uniforms.uResolution.value.set(size.width, size.height);
      const acceleratedProgress = Math.min(1.0, localProgress * 1.1);
      material2Ref.current.uniforms.uEdgeIntensity.value =
        0.6 * (1.0 - acceleratedProgress);
      material2Ref.current.uniforms.uDarkness.value =
        1.0 - acceleratedProgress;
      material2Ref.current.uniforms.uGrayscale.value =
        1.0 - acceleratedProgress;
    }
  });

  return (
    <>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={material2Ref}
          vertexShader={coverVertexShader}
          fragmentShader={coverFragmentShaderReverse}
          uniforms={uniforms2}
          transparent={true}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={material1Ref}
          vertexShader={coverVertexShader}
          fragmentShader={coverFragmentShader}
          uniforms={uniforms1}
          transparent={true}
        />
      </mesh>
    </>
  );
};

export interface ScrollDissolveRevealProps {
  imageFront?: string;
  imageBack?: string;
  images?: string[];
  className?: string;
  containerClassName?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  children?: React.ReactNode;
  onActiveIndexChange?: (index: number) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function ScrollDissolveReveal({
  imageFront,
  imageBack,
  images,
  className,
  containerClassName,
  scrollContainerRef,
  children,
  onActiveIndexChange,
  containerRef: externalContainerRef,
}: ScrollDissolveRevealProps) {
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = externalContainerRef || internalContainerRef;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    ...(scrollContainerRef && { container: scrollContainerRef }),
  });

  const isMulti = Boolean(images && images.length > 1);

  // Dynamic height for multi-image sequential scrolling (approx 75vh per transition)
  const dynamicHeight = isMulti
    ? `${Math.max(300, (images?.length || 2) * 80)}vh`
    : "300vh";

  return (
    <div
      ref={containerRef}
      style={{ height: dynamicHeight }}
      className={cn("relative w-full", containerClassName)}
    >
      <div className={cn("sticky top-0 h-screen w-full overflow-hidden", className)}>
        <Canvas dpr={[1, 2]} frameloop="demand" gl={{ antialias: false, alpha: false }}>
          <OrthographicCamera
            makeDefault
            manual
            left={-1}
            right={1}
            top={1}
            bottom={-1}
            near={0.1}
            far={10}
            position={[0, 0, 1]}
          />
          <React.Suspense fallback={null}>
            {isMulti && images ? (
              <MultiImageScene
                images={images}
                scrollYProgress={scrollYProgress}
                onIndexChange={onActiveIndexChange}
              />
            ) : imageFront && imageBack ? (
              <TwoImageScene
                imageFront={imageFront}
                imageBack={imageBack}
                scrollYProgress={scrollYProgress}
              />
            ) : null}
          </React.Suspense>
        </Canvas>
        {children}
      </div>
    </div>
  );
}
