"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as Lucide from "lucide-react";
import { MaskedAvatars } from "@/components/ui/masked-avatars";
import { DEFAULT_JOURNEY_NODES, JourneyNodeData } from "@/data/defaultJourneyNodes";
import { API_URL } from "@/lib/api";

export type { JourneyNodeData };

const FIRST_TEAM_AVATARS = [
  { avatar: "/images/first-team/aashish.jpg", name: "Aashish" },
  { avatar: "/images/first-team/bhargav.jpg", name: "Bhargav" },
  { avatar: "/images/first-team/nagarjuna.jpg", name: "Nagarjuna" },
  { avatar: "/images/first-team/pranay.jpg", name: "Pranay" },
  { avatar: "/images/first-team/purna.jpg", name: "Purna" },
];

// Color themes for 3D crystal nodes in Dark Mode
const DARK_NODE_THEMES = [
  { primary: "#10b981", secondary: "#34d399", glow: "#059669", accent: "#a7f3d0" }, // Emerald
  { primary: "#06b6d4", secondary: "#22d3ee", glow: "#0891b2", accent: "#cffaff" }, // Cyan
  { primary: "#6366f1", secondary: "#818cf8", glow: "#4f46e5", accent: "#e0e7ff" }, // Indigo
  { primary: "#ec4899", secondary: "#f472b6", glow: "#db2777", accent: "#fce7f3" }, // Pink/Rose
  { primary: "#f59e0b", secondary: "#fbbf24", glow: "#d97706", accent: "#fef3c7" }, // Amber
  { primary: "#8b5cf6", secondary: "#a78bfa", glow: "#7c3aed", accent: "#ede9fe" }, // Violet
];

// Color themes for 3D crystal nodes in Light Mode
const LIGHT_NODE_THEMES = [
  { primary: "#059669", secondary: "#10b981", glow: "#34d399", accent: "#047857" }, // Emerald
  { primary: "#0891b2", secondary: "#06b6d4", glow: "#22d3ee", accent: "#0e7490" }, // Cyan
  { primary: "#4f46e5", secondary: "#6366f1", glow: "#818cf8", accent: "#4338ca" }, // Indigo
  { primary: "#db2777", secondary: "#ec4899", glow: "#f472b6", accent: "#be185d" }, // Pink/Rose
  { primary: "#d97706", secondary: "#f59e0b", glow: "#fbbf24", accent: "#b45309" }, // Amber
  { primary: "#7c3aed", secondary: "#8b5cf6", glow: "#a78bfa", accent: "#6d28d9" }, // Violet
];

// Deterministic 3D Spatial Layout generator for scattered non-linear placement
function generateNodePositions(count: number) {
  const positions: Array<{ x: number; y: number; z: number; rotOffset: [number, number, number] }> = [];
  
  // Seeded offsets for natural organic 3D scattering
  const offsets = [
    { x: 3.2, y: 1.1, z: 0 },
    { x: -3.8, y: -1.6, z: -14 },
    { x: 2.4, y: -2.2, z: -28 },
    { x: -4.2, y: 2.3, z: -42 },
    { x: 3.9, y: -1.2, z: -56 },
    { x: -2.9, y: 1.9, z: -70 },
    { x: 4.1, y: 2.4, z: -84 },
    { x: -3.5, y: -2.1, z: -98 },
  ];

  for (let i = 0; i < count; i++) {
    const preset = offsets[i % offsets.length];
    const noiseX = Math.sin(i * 3.7) * 0.8;
    const noiseY = Math.cos(i * 2.3) * 0.6;
    positions.push({
      x: preset.x + noiseX,
      y: preset.y + noiseY,
      z: -i * 14 + (Math.sin(i * 1.5) * 2), // Organic depth variation
      rotOffset: [Math.sin(i) * 0.4, Math.cos(i) * 0.4, Math.sin(i * 2) * 0.3],
    });
  }
  return positions;
}

// ── 1. STYLIZED EMPTY PLACEHOLDER FACET TEXTURE ──────────────────────────────
function createEmptyPlaceholderTexture(title: string, colorHex: string, isDark: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 280);
    if (isDark) {
      grad.addColorStop(0, `${colorHex}40`);
      grad.addColorStop(0.7, "#0d0d0d");
      grad.addColorStop(1, "#050505");
    } else {
      grad.addColorStop(0, `${colorHex}30`);
      grad.addColorStop(0.7, "#f1f5f9");
      grad.addColorStop(1, "#e2e8f0");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 2;
    for (let i = 64; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, 464, 464);

    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(176, 160, 160, 120);

    ctx.beginPath();
    ctx.arc(216, 196, 16, 0, Math.PI * 2);
    ctx.fillStyle = colorHex;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(186, 268);
    ctx.lineTo(236, 218);
    ctx.lineTo(266, 248);
    ctx.lineTo(296, 208);
    ctx.lineTo(326, 268);
    ctx.closePath();
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
    ctx.fill();

    ctx.fillStyle = isDark ? "#ffffff" : "#1e293b";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IMAGE PLACEHOLDER", 256, 320);

    ctx.fillStyle = colorHex;
    ctx.font = "14px monospace";
    ctx.fillText(title.substring(0, 24).toUpperCase(), 256, 350);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ── 2. FACET IMAGE / PLACEHOLDER MESH ────────────────────────────────────────
function CrystalFaceImage({ imageUrl, title, themeColor, isDark }: { imageUrl?: string; title: string; themeColor: string; isDark: boolean }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (imageUrl && imageUrl.trim() !== "") {
      const loader = new THREE.TextureLoader();
      loader.load(
        imageUrl,
        (tex) => {
          if (isMounted) {
            tex.colorSpace = THREE.SRGBColorSpace;
            setTexture(tex);
          }
        },
        undefined,
        () => {
          if (isMounted) setTexture(createEmptyPlaceholderTexture(title, themeColor, isDark));
        }
      );
    } else {
      setTexture(createEmptyPlaceholderTexture(title, themeColor, isDark));
    }
    return () => { isMounted = false; };
  }, [imageUrl, title, themeColor, isDark]);

  if (!texture) return null;

  return (
    <group position={[0, 0, 0.95]}>
      <mesh>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.64, 0.69, 32]} />
        <meshBasicMaterial color={themeColor} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ── 3. TWINKLING / BLINKING STARFIELD ────────────────────────────────────────
function BlinkingStarfield({ count = 800, isDark = true }: { count?: number; isDark?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const colorChoices = useMemo(() => {
    return isDark ? [
      new THREE.Color("#10b981"),
      new THREE.Color("#06b6d4"),
      new THREE.Color("#818cf8"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#a7f3d0"),
    ] : [
      new THREE.Color("#059669"),
      new THREE.Color("#0284c7"),
      new THREE.Color("#6d28d9"),
      new THREE.Color("#e11d48"),
      new THREE.Color("#d97706"),
      new THREE.Color("#10b981"),
    ];
  }, [isDark]);

  const [positions, baseColors, phases, speeds] = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);
    const baseColArr = new Float32Array(count * 3);
    const phaseArr = new Float32Array(count);
    const speedArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      posArr[i * 3] = (Math.random() - 0.5) * 90;
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 90;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 150;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      baseColArr[i * 3] = c.r;
      baseColArr[i * 3 + 1] = c.g;
      baseColArr[i * 3 + 2] = c.b;

      colArr[i * 3] = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;

      phaseArr[i] = Math.random() * Math.PI * 2;
      speedArr[i] = Math.random() * 2.5 + 1.2;
    }

    return [posArr, baseColArr, phaseArr, speedArr];
  }, [count, colorChoices]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.008;

      const time = state.clock.getElapsedTime();
      const geom = pointsRef.current.geometry;
      const colorAttr = geom.attributes.color;

      if (colorAttr) {
        const colorArray = colorAttr.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const sinWave = Math.sin(time * speeds[i] + phases[i]);
          const twinkle = Math.pow(sinWave * 0.5 + 0.5, 2.5);

          if (isDark) {
            const finalLum = 0.2 + twinkle * 0.9;
            colorArray[i * 3] = baseColors[i * 3] * finalLum;
            colorArray[i * 3 + 1] = baseColors[i * 3 + 1] * finalLum;
            colorArray[i * 3 + 2] = baseColors[i * 3 + 2] * finalLum;
          } else {
            const finalLum = 0.45 + twinkle * 0.75;
            colorArray[i * 3] = baseColors[i * 3] * finalLum;
            colorArray[i * 3 + 1] = baseColors[i * 3 + 1] * finalLum;
            colorArray[i * 3 + 2] = baseColors[i * 3 + 2] * finalLum;
          }
        }
        colorAttr.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[new Float32Array(count * 3), 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.18 : 0.24}
        vertexColors
        transparent
        opacity={isDark ? 0.9 : 0.85}
        sizeAttenuation={true}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// ── 4. FLOATING BACKGROUND SHARDS ────────────────────────────────────────────
function BackgroundShards({ count = 25, nodeThemes = DARK_NODE_THEMES }: { count?: number; nodeThemes?: typeof DARK_NODE_THEMES }) {
  const groupRef = useRef<THREE.Group>(null!);

  const shards = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 100,
      ] as [number, number, number],
      scale: Math.random() * 0.35 + 0.12,
      rotSpeed: [(Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4],
      color: nodeThemes[i % nodeThemes.length].primary,
    }));
  }, [count, nodeThemes]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        child.rotation.x += shards[idx].rotSpeed[0] * delta;
        child.rotation.y += shards[idx].rotSpeed[1] * delta;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={s.color}
            roughness={0.3}
            metalness={0.7}
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 4.5 EXPLOSION SHARD BURST EFFECT ─────────────────────────────────────────
function CrystalExplosion({
  position,
  theme,
  isDark,
}: {
  position: [number, number, number];
  theme: { primary: string; secondary: string; glow: string };
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  const shards = useMemo(() => {
    return Array.from({ length: 50 }).map(() => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 12 + 6;
      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).multiplyScalar(speed);

      return {
        velocity,
        rotSpeed: [(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 22],
        scale: Math.random() * 0.45 + 0.15,
        geometryType: Math.floor(Math.random() * 3),
      };
    });
  }, []);

  const [progress, setProgress] = useState(0);

  useFrame((_, delta) => {
    if (progress < 1) {
      setProgress((prev) => Math.min(prev + delta * 1.5, 1));
    }

    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const s = shards[idx];
        if (s) {
          child.position.x += s.velocity.x * delta;
          child.position.y += s.velocity.y * delta;
          child.position.z += s.velocity.z * delta;

          child.rotation.x += s.rotSpeed[0] * delta;
          child.rotation.y += s.rotSpeed[1] * delta;
          child.rotation.z += s.rotSpeed[2] * delta;

          const currentScale = s.scale * Math.max(0, 1 - progress);
          child.scale.set(currentScale, currentScale, currentScale);
        }
      });
    }

    if (ringRef.current) {
      const ringScale = 1 + progress * 9;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    if (lightRef.current) {
      lightRef.current.intensity = Math.max(0, (1 - progress) * 45);
    }
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} color={theme.secondary} intensity={45} distance={20} />

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.95, 32]} />
        <meshBasicMaterial
          color={theme.secondary}
          transparent
          opacity={Math.max(0, (1 - progress) * 0.95)}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef}>
        {shards.map((s, i) => (
          <mesh key={i} scale={s.scale}>
            {s.geometryType === 0 ? (
              <tetrahedronGeometry args={[0.5, 0]} />
            ) : s.geometryType === 1 ? (
              <octahedronGeometry args={[0.5, 0]} />
            ) : (
              <icosahedronGeometry args={[0.5, 0]} />
            )}
            <meshStandardMaterial
              color={i % 2 === 0 ? theme.primary : theme.secondary}
              emissive={theme.glow}
              emissiveIntensity={isDark ? 2.5 : 1.5}
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={Math.max(0, 1 - progress * 1.1)}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── 5. CRYSTAL GEMSTONE NODE ─────────────────────────────────────────────────
interface CrystalNodeProps {
  node: JourneyNodeData;
  index: number;
  isActive: boolean;
  isLowEnd: boolean;
  isDark: boolean;
  isExploding: boolean;
  theme: { primary: string; secondary: string; glow: string; accent: string };
  onClick: () => void;
  position: [number, number, number];
  rotOffset: [number, number, number];
}

function CrystalNode({ node, index, isActive, isLowEnd, isDark, isExploding, theme, onClick, position, rotOffset }: CrystalNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const speed = isActive ? 0.3 : 0.15;
      meshRef.current.rotation.y += delta * speed;
      meshRef.current.rotation.x += delta * (speed * 0.4);
    }
    if (haloRef.current) {
      haloRef.current.rotation.z -= delta * 0.5;
    }
  });

  const baseScale = isActive ? 1.85 : hovered ? 1.55 : 1.3;

  if (isExploding) {
    return <CrystalExplosion position={position} theme={theme} isDark={isDark} />;
  }

  return (
    <Float
      speed={isActive ? 2 : 1.2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      position={position}
    >
      <group rotation={rotOffset} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <mesh
          ref={meshRef}
          scale={baseScale}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        >
          {index % 2 === 0 ? (
            <icosahedronGeometry args={[1, 0]} />
          ) : (
            <dodecahedronGeometry args={[1, 0]} />
          )}

          {isLowEnd ? (
            <meshStandardMaterial
              color={isActive || hovered ? theme.secondary : theme.primary}
              flatShading={true}
              roughness={isDark ? 0.2 : 0.3}
              metalness={isDark ? 0.6 : 0.4}
              emissive={theme.glow}
              emissiveIntensity={isActive ? (isDark ? 0.5 : 0.3) : (isDark ? 0.1 : 0.05)}
            />
          ) : (
            <meshPhysicalMaterial
              color={isActive || hovered ? theme.secondary : theme.primary}
              flatShading={true}
              roughness={isDark ? 0.15 : 0.25}
              metalness={isDark ? 0.6 : 0.4}
              transmission={isDark ? 0.3 : 0.2}
              ior={1.5}
              clearcoat={0.8}
              emissive={theme.glow}
              emissiveIntensity={isActive ? (isDark ? 0.6 : 0.35) : (isDark ? 0.15 : 0.08)}
            />
          )}

          <CrystalFaceImage imageUrl={node.image} title={node.title} themeColor={theme.secondary} isDark={isDark} />
        </mesh>

        <mesh scale={baseScale * 1.1}>
          {index % 2 === 0 ? (
            <icosahedronGeometry args={[1, 0]} />
          ) : (
            <dodecahedronGeometry args={[1, 0]} />
          )}
          <meshBasicMaterial
            color={theme.primary}
            wireframe
            transparent
            opacity={isActive ? 0.7 : hovered ? 0.4 : 0.2}
          />
        </mesh>

        {!isLowEnd && (
          <mesh ref={haloRef} scale={baseScale * 1.55} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1, 0.018, 12, 48]} />
            <meshBasicMaterial
              color={theme.secondary}
              transparent
              opacity={isActive ? 0.85 : hovered ? 0.5 : 0.25}
            />
          </mesh>
        )}

        <pointLight color={theme.primary} intensity={isActive ? (isDark ? 6 : 4) : (isDark ? 2 : 1)} distance={5} />

        <Html position={[0, baseScale * 1.5 + 0.4, 0]} center distanceFactor={15}>
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer whitespace-nowrap shadow-lg flex items-center gap-1.5 border ${
              isActive
                ? isDark
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110"
                  : "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-md scale-110"
                : isDark
                  ? "bg-black/70 border-white/20 text-zinc-300 hover:border-emerald-400"
                  : "bg-white/95 border-zinc-300 text-zinc-800 hover:border-emerald-600 shadow-sm"
            }`}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
            {node.date}
          </div>
        </Html>
      </group>
    </Float>
  );
}

// ── 6. CAMERA SPATIAL CONTROLLER ─────────────────────────────────────────────
function CameraRig({
  activeIndex,
  nodePositions,
  mousePos,
  isExploding,
}: {
  activeIndex: number;
  nodePositions: Array<{ x: number; y: number; z: number }>;
  mousePos: { x: number; y: number };
  isExploding: boolean;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const targetNode = nodePositions[activeIndex] || { x: 0, y: 0, z: 0 };

    // Camera targets focused position in front of target active crystal node
    const targetX = targetNode.x + mousePos.x * 1.2;
    const targetY = targetNode.y + 0.2 + mousePos.y * 0.8;
    const targetZ = targetNode.z + (isExploding ? 2.0 : 6.5); // Warp camera close on explosion

    const lerpSpeed = isExploding ? 0.12 : 0.05;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, lerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, lerpSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, lerpSpeed);

    // Look directly at target node center
    camera.lookAt(targetNode.x, targetNode.y, targetNode.z);
  });

  return null;
}

// ── 7. MAIN COSMIC 3D JOURNEY COMPONENT ──────────────────────────────────────
export default function Cosmic3DJourney({
  initialEvents,
  onSwitchTo2D,
}: {
  initialEvents?: JourneyNodeData[];
  onSwitchTo2D?: () => void;
}) {
  const router = useRouter();
  const { resolvedTheme, theme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDark = () => {
      if (typeof document !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [resolvedTheme, theme]);

  const [nodes, setNodes] = useState<JourneyNodeData[]>(initialEvents || DEFAULT_JOURNEY_NODES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [explodingIndex, setExplodingIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isCooldownRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate organic non-linear 3D spatial node positions
  const nodePositions = useMemo(() => generateNodePositions(nodes.length), [nodes.length]);

  // Auto-detect low-end devices
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const lowCores = typeof navigator !== "undefined" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
    if (isMobile || lowCores) setIsLowEnd(true);
  }, []);

  // Fetch journey nodes from API if available
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) return;

    const fetchJourneyNodes = async () => {
      try {
        const res = await fetch(`${API_URL}/journey-nodes`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setNodes(data);
          }
        }
      } catch (err) {
        console.warn("Using default timeline nodes due to fetch error:", err);
      }
    };
    fetchJourneyNodes();
  }, [initialEvents]);

  // ── PINNED STEP-SCROLL HANDLER ─────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (explodingIndex !== null) return;
      const isScrollDown = e.deltaY > 0;
      const isScrollUp = e.deltaY < 0;

      const isAtEnd = activeIndex === nodes.length - 1 && isScrollDown;
      const isAtStart = activeIndex === 0 && isScrollUp;

      if (!isAtEnd && !isAtStart) {
        e.preventDefault();

        if (isCooldownRef.current) return;
        isCooldownRef.current = true;

        if (isScrollDown) {
          setActiveIndex((prev) => Math.min(prev + 1, nodes.length - 1));
        } else if (isScrollUp) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }

        setTimeout(() => {
          isCooldownRef.current = false;
        }, 400);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [activeIndex, nodes.length, explodingIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePos({ x, y });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (explodingIndex !== null) return;
      if (containerRef.current && containerRef.current.offsetParent === null) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActiveIndex((prev) => Math.min(prev + 1, nodes.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes.length, explodingIndex]);

  // Trigger explosion animation and page redirection
  const triggerExplosionAndNavigate = (targetUrl: string, index: number) => {
    if (explodingIndex !== null) return;
    setExplodingIndex(index);

    setTimeout(() => {
      if (targetUrl.startsWith("http")) {
        window.open(targetUrl, "_blank");
      } else {
        router.push(targetUrl);
      }
      setTimeout(() => setExplodingIndex(null), 1000);
    }, 650);
  };

  // Node click redirection / preview
  const handleNodeClick = (index: number) => {
    if (explodingIndex !== null) return;
    const targetNode = nodes[index];
    if (index === activeIndex) {
      if (targetNode.link && targetNode.link.trim() !== "" && targetNode.link !== "#") {
        triggerExplosionAndNavigate(targetNode.link, index);
      } else if (targetNode.image && targetNode.image.trim() !== "") {
        setSelectedImage(targetNode.image);
      }
    } else {
      setActiveIndex(index);
    }
  };

  const nodeThemes = isDark ? DARK_NODE_THEMES : LIGHT_NODE_THEMES;
  const activeNode = nodes[activeIndex] || nodes[0];
  const activeTheme = nodeThemes[activeIndex % nodeThemes.length];
  const IconComponent = (Lucide as any)[activeNode.icon || ""] || Lucide.Flag;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-[90vh] min-h-[650px] overflow-hidden select-none transition-colors duration-500 ${
        isDark ? "bg-[#050505]" : "bg-slate-50"
      }`}
    >
      {/* ── 3D CANVAS WORLD ─────────────────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isLowEnd ? 1 : [1, 1.5]}
        gl={{ antialias: !isLowEnd, alpha: false, powerPreference: isLowEnd ? "low-power" : "high-performance" }}
        className="w-full h-full"
      >
        <color attach="background" args={[isDark ? "#050505" : "#f8fafc"]} />
        <ambientLight intensity={isDark ? 0.5 : 1.3} />
        <directionalLight position={[10, 15, 10]} intensity={isDark ? 1.5 : 2.2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={isDark ? 0.8 : 1.2} color={activeTheme.primary} />

        <BlinkingStarfield count={isLowEnd ? 300 : 750} isDark={isDark} />
        <BackgroundShards count={isLowEnd ? 10 : 25} nodeThemes={nodeThemes} />

        {/* Scattered Non-Linear 3D Crystal Nodes */}
        {nodes.map((node, idx) => {
          const pos = nodePositions[idx] || { x: 0, y: 0, z: -idx * 14, rotOffset: [0, 0, 0] };
          return (
            <CrystalNode
              key={node.id || node.node_id || idx}
              node={node}
              index={idx}
              isActive={idx === activeIndex}
              isLowEnd={isLowEnd}
              isDark={isDark}
              isExploding={explodingIndex === idx}
              theme={nodeThemes[idx % nodeThemes.length]}
              onClick={() => handleNodeClick(idx)}
              position={[pos.x, pos.y, pos.z]}
              rotOffset={pos.rotOffset as [number, number, number]}
            />
          );
        })}

        <CameraRig
          activeIndex={activeIndex}
          nodePositions={nodePositions}
          mousePos={mousePos}
          isExploding={explodingIndex !== null}
        />
      </Canvas>

      {/* ── TOP BAR CONTROLS & TOGGLE ───────────────────────────────────── */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto gap-4 flex-wrap">
        <div className={`flex items-center space-x-3 backdrop-blur-xl border px-4 py-2 rounded-2xl shadow-xl transition-colors ${
          isDark ? "bg-black/60 border-white/10" : "bg-white/80 border-zinc-200"
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className={`text-xs font-mono font-bold tracking-widest uppercase ${
            isDark ? "text-emerald-400" : "text-emerald-700"
          }`}>
            3D Cosmic Journey Node
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLowEnd(!isLowEnd)}
            title="Toggle Performance Mode for lower end devices"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-mono font-semibold transition-all backdrop-blur-xl shadow-lg ${
              isLowEnd
                ? "bg-amber-500/20 border-amber-400/50 text-amber-500"
                : isDark
                  ? "bg-white/5 border-white/15 text-zinc-400 hover:text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            <Lucide.Zap size={14} className={isLowEnd ? "text-amber-500" : ""} />
            <span>{isLowEnd ? "⚡ Eco / Low-End Mode" : "High Quality"}</span>
          </button>

          {onSwitchTo2D && (
            <button
              onClick={onSwitchTo2D}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold tracking-wide transition-all shadow-lg backdrop-blur-xl ${
                isDark
                  ? "bg-white/10 hover:bg-emerald-500/20 border-white/15 text-white"
                  : "bg-white hover:bg-emerald-50 border-zinc-200 text-zinc-900"
              }`}
            >
              <Lucide.GitCommit size={14} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
              <span className="hidden sm:inline">Switch to 2D Map</span>
            </button>
          )}
        </div>
      </div>

      {/* ── HUD OVERLAY CARD WITH PAGE REDIRECTION & IMAGE CTA ─────────────────── */}
      <div className="absolute bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-30 pointer-events-none flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="w-full md:max-w-xl pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id || activeNode.node_id || activeIndex}
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`p-6 md:p-8 border rounded-3xl backdrop-blur-2xl transition-all duration-300 relative overflow-hidden ${
                isDark
                  ? "bg-black/85 border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.85)]"
                  : "bg-white/95 border-zinc-200 shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
              }`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-colors duration-500"
                style={{ backgroundColor: activeTheme.primary }}
              />

              {(activeNode.id === "founder" || activeNode.node_id === "founder") && (
                <div className="mb-4">
                  <MaskedAvatars avatars={FIRST_TEAM_AVATARS} />
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="p-1.5 rounded-lg shrink-0 border"
                    style={{
                      backgroundColor: `${activeTheme.primary}20`,
                      borderColor: `${activeTheme.primary}40`,
                      color: activeTheme.primary,
                    }}
                  >
                    <IconComponent size={16} strokeWidth={2.5} />
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase border"
                    style={{
                      backgroundColor: `${activeTheme.primary}20`,
                      borderColor: `${activeTheme.primary}50`,
                      color: activeTheme.primary,
                    }}
                  >
                    {activeNode.date}
                  </span>
                </div>
                <span className={`text-xs font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                  NODE {activeIndex + 1} OF {nodes.length}
                </span>
              </div>

              <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-3 ${
                isDark ? "text-white" : "text-zinc-900"
              }`}>
                {activeNode.title}
              </h2>

              <p className={`text-sm md:text-base leading-relaxed mb-6 font-light line-clamp-3 ${
                isDark ? "text-zinc-300" : "text-zinc-600"
              }`}>
                {activeNode.desc}
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {activeNode.link && activeNode.link.trim() !== "" && activeNode.link !== "#" && (
                  <button
                    onClick={() => triggerExplosionAndNavigate(activeNode.link!, activeIndex)}
                    disabled={explodingIndex !== null}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-transform duration-300 hover:scale-105 shadow-md cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: activeTheme.primary }}
                  >
                    <span>Explore Milestone Page</span>
                    <Lucide.ExternalLink size={16} />
                  </button>
                )}

                {activeNode.image && activeNode.image.trim() !== "" && (
                  <button
                    onClick={() => setSelectedImage(activeNode.image!)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer shadow-md ${
                      isDark
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300"
                    }`}
                  >
                    <Lucide.Image size={16} />
                    <span>View Photo</span>
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll Hint & Nav Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pointer-events-auto w-full md:w-auto justify-between md:justify-end">
          <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-xl text-xs font-mono ${
            isDark ? "bg-black/60 border-white/10 text-zinc-300" : "bg-white/90 border-zinc-200 text-zinc-700 shadow-sm"
          }`}>
            <Lucide.Sparkles size={14} className="text-emerald-500 animate-pulse" />
            <span>Scroll mouse wheel to fly through nodes</span>
          </div>

          <div className={`flex items-center gap-3 border p-2 rounded-2xl backdrop-blur-xl shadow-xl ${
            isDark ? "bg-black/70 border-white/15" : "bg-white/90 border-zinc-200"
          }`}>
            <button
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0 || explodingIndex !== null}
              className={`w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all ${
                isDark ? "bg-white/5 hover:bg-emerald-500/20 text-white" : "bg-zinc-100 hover:bg-emerald-500/20 text-zinc-800"
              }`}
            >
              <Lucide.ChevronLeft size={20} />
            </button>

            {/* Bullets */}
            <div className="flex items-center gap-1.5 px-2">
              {nodes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  disabled={explodingIndex !== null}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeIndex
                      ? "w-7 h-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                      : isDark
                        ? "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"
                        : "w-2.5 h-2.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, nodes.length - 1))}
              disabled={activeIndex === nodes.length - 1 || explodingIndex !== null}
              className={`w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all ${
                isDark ? "bg-white/5 hover:bg-emerald-500/20 text-white" : "bg-zinc-100 hover:bg-emerald-500/20 text-zinc-800"
              }`}
            >
              <Lucide.ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Screen Explosion Warp Overlay Flash */}
      <AnimatePresence>
        {explodingIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.8, 1, 0], scale: [0.6, 1.4, 2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            <div
              className="w-[120vw] h-[120vh] rounded-full filter blur-2xl opacity-60"
              style={{
                background: `radial-gradient(circle, ${activeTheme.secondary} 0%, ${activeTheme.primary} 40%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal Popup */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
              />

              {/* Modal Dialog */}
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={`pointer-events-auto relative max-w-4xl max-h-[85vh] border rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
                    isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-zinc-200"
                  }`}
                >
                  {/* Header with Close Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all focus:outline-none border border-white/10"
                    >
                      <Lucide.X size={18} />
                    </button>
                  </div>

                  {/* Image Content */}
                  <div className={`w-full h-full flex items-center justify-center overflow-hidden ${
                    isDark ? "bg-black/60" : "bg-zinc-100/80"
                  }`}>
                    <img 
                      src={selectedImage} 
                      alt="Event preview" 
                      className="w-full max-h-[85vh] object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
