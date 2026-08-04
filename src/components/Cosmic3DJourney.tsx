"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import * as Lucide from "lucide-react";
import { MaskedAvatars } from "@/components/ui/masked-avatars";
import { DEFAULT_JOURNEY_NODES, JourneyNodeData } from "@/data/defaultJourneyNodes";

export type { JourneyNodeData };

const FIRST_TEAM_AVATARS = [
  { avatar: "/images/first-team/aashish.jpg", name: "Aashish" },
  { avatar: "/images/first-team/bhargav.jpg", name: "Bhargav" },
  { avatar: "/images/first-team/nagarjuna.jpg", name: "Nagarjuna" },
  { avatar: "/images/first-team/pranay.jpg", name: "Pranay" },
  { avatar: "/images/first-team/purna.jpg", name: "Purna" },
];

// Color themes for 3D crystal nodes
const NODE_THEMES = [
  { primary: "#10b981", secondary: "#34d399", glow: "#059669", accent: "#a7f3d0" }, // Emerald
  { primary: "#06b6d4", secondary: "#22d3ee", glow: "#0891b2", accent: "#cffaff" }, // Cyan
  { primary: "#6366f1", secondary: "#818cf8", glow: "#4f46e5", accent: "#e0e7ff" }, // Indigo
  { primary: "#ec4899", secondary: "#f472b6", glow: "#db2777", accent: "#fce7f3" }, // Pink/Rose
  { primary: "#f59e0b", secondary: "#fbbf24", glow: "#d97706", accent: "#fef3c7" }, // Amber
  { primary: "#8b5cf6", secondary: "#a78bfa", glow: "#7c3aed", accent: "#ede9fe" }, // Violet
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
function createEmptyPlaceholderTexture(title: string, colorHex: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 280);
    grad.addColorStop(0, `${colorHex}40`);
    grad.addColorStop(0.7, "#0d0d0d");
    grad.addColorStop(1, "#050505");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
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

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
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
function CrystalFaceImage({ imageUrl, title, themeColor }: { imageUrl?: string; title: string; themeColor: string }) {
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
          if (isMounted) setTexture(createEmptyPlaceholderTexture(title, themeColor));
        }
      );
    } else {
      setTexture(createEmptyPlaceholderTexture(title, themeColor));
    }
    return () => { isMounted = false; };
  }, [imageUrl, title, themeColor]);

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
function BlinkingStarfield({ count = 750 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, baseColors, phases, speeds] = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);
    const baseColArr = new Float32Array(count * 3);
    const phaseArr = new Float32Array(count);
    const speedArr = new Float32Array(count);

    const colorChoices = [
      new THREE.Color("#10b981"),
      new THREE.Color("#06b6d4"),
      new THREE.Color("#818cf8"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#a7f3d0"),
    ];

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
      speedArr[i] = Math.random() * 3.0 + 1.2;
    }

    return [posArr, baseColArr, phaseArr, speedArr];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.01;

      const time = state.clock.getElapsedTime();
      const geom = pointsRef.current.geometry;
      const colorAttr = geom.attributes.color;

      if (colorAttr) {
        const colorArray = colorAttr.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const twinkle = Math.pow(Math.sin(time * speeds[i] + phases[i]) * 0.5 + 0.5, 2);
          const minLum = 0.15;
          const finalLum = minLum + twinkle * 0.85;

          colorArray[i * 3] = baseColors[i * 3] * finalLum;
          colorArray[i * 3 + 1] = baseColors[i * 3 + 1] * finalLum;
          colorArray[i * 3 + 2] = baseColors[i * 3 + 2] * finalLum;
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
        size={0.16}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── 4. FLOATING BACKGROUND SHARDS ────────────────────────────────────────────
function BackgroundShards({ count = 25 }: { count?: number }) {
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
      color: NODE_THEMES[i % NODE_THEMES.length].primary,
    }));
  }, [count]);

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

// ── 5. CRYSTAL GEMSTONE NODE ─────────────────────────────────────────────────
interface CrystalNodeProps {
  node: JourneyNodeData;
  index: number;
  isActive: boolean;
  isLowEnd: boolean;
  onClick: () => void;
  position: [number, number, number];
  rotOffset: [number, number, number];
}

function CrystalNode({ node, index, isActive, isLowEnd, onClick, position, rotOffset }: CrystalNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const theme = NODE_THEMES[index % NODE_THEMES.length];
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
              roughness={0.2}
              metalness={0.6}
              emissive={theme.glow}
              emissiveIntensity={isActive ? 0.5 : 0.1}
            />
          ) : (
            <meshPhysicalMaterial
              color={isActive || hovered ? theme.secondary : theme.primary}
              flatShading={true}
              roughness={0.15}
              metalness={0.6}
              transmission={0.3}
              ior={1.5}
              clearcoat={0.8}
              emissive={theme.glow}
              emissiveIntensity={isActive ? 0.6 : 0.15}
            />
          )}

          <CrystalFaceImage imageUrl={node.image} title={node.title} themeColor={theme.secondary} />
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

        <pointLight color={theme.primary} intensity={isActive ? 6 : 2} distance={5} />

        <Html position={[0, baseScale * 1.5 + 0.4, 0]} center distanceFactor={15}>
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer whitespace-nowrap shadow-lg flex items-center gap-1.5 border ${
              isActive
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110"
                : "bg-black/70 border-white/20 text-zinc-300 hover:border-emerald-400"
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
}: {
  activeIndex: number;
  nodePositions: Array<{ x: number; y: number; z: number }>;
  mousePos: { x: number; y: number };
}) {
  const { camera } = useThree();

  useFrame(() => {
    const targetNode = nodePositions[activeIndex] || { x: 0, y: 0, z: 0 };

    // Camera targets focused position in front of target active crystal node
    const targetX = targetNode.x + mousePos.x * 1.2;
    const targetY = targetNode.y + 0.2 + mousePos.y * 0.8;
    const targetZ = targetNode.z + 6.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

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
  const [nodes, setNodes] = useState<JourneyNodeData[]>(initialEvents || DEFAULT_JOURNEY_NODES);
  const [activeIndex, setActiveIndex] = useState(0);
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/journey-nodes`);
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
  }, [activeIndex, nodes.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePos({ x, y });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [nodes.length]);

  // Node click redirection / preview
  const handleNodeClick = (index: number) => {
    const targetNode = nodes[index];
    if (index === activeIndex) {
      if (targetNode.link) {
        if (targetNode.link.startsWith("http")) {
          window.open(targetNode.link, "_blank");
        } else {
          router.push(targetNode.link);
        }
      } else if (targetNode.image) {
        setSelectedImage(targetNode.image);
      }
    } else {
      setActiveIndex(index);
    }
  };

  const activeNode = nodes[activeIndex] || nodes[0];
  const activeTheme = NODE_THEMES[activeIndex % NODE_THEMES.length];
  const IconComponent = (Lucide as any)[activeNode.icon || ""] || Lucide.Flag;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[90vh] min-h-[650px] bg-[#050505] overflow-hidden select-none"
    >
      {/* ── 3D CANVAS WORLD ─────────────────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={isLowEnd ? 1 : [1, 1.5]}
        gl={{ antialias: !isLowEnd, alpha: false, powerPreference: isLowEnd ? "low-power" : "high-performance" }}
        className="w-full h-full"
      >
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.8} color={activeTheme.primary} />

        <BlinkingStarfield count={isLowEnd ? 300 : 750} />
        <BackgroundShards count={isLowEnd ? 10 : 25} />

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
        />
      </Canvas>

      {/* ── TOP BAR CONTROLS & TOGGLE ───────────────────────────────────── */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-auto gap-4 flex-wrap">
        <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            3D Cosmic Journey Node
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLowEnd(!isLowEnd)}
            title="Toggle Performance Mode for lower end devices"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-mono font-semibold transition-all backdrop-blur-xl shadow-lg ${
              isLowEnd
                ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                : "bg-white/5 border-white/15 text-zinc-400 hover:text-white"
            }`}
          >
            <Lucide.Zap size={14} className={isLowEnd ? "text-amber-400" : ""} />
            <span>{isLowEnd ? "⚡ Eco / Low-End Mode" : "High Quality"}</span>
          </button>

          {onSwitchTo2D && (
            <button
              onClick={onSwitchTo2D}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-emerald-500/20 border border-white/15 hover:border-emerald-500/50 text-white text-xs font-semibold tracking-wide transition-all shadow-lg backdrop-blur-xl"
            >
              <Lucide.GitCommit size={14} className="text-emerald-400" />
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
              className="p-6 md:p-8 bg-black/85 border border-white/15 rounded-3xl backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] relative overflow-hidden"
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
                      color: activeTheme.secondary,
                    }}
                  >
                    <IconComponent size={16} strokeWidth={2.5} />
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase border"
                    style={{
                      backgroundColor: `${activeTheme.primary}20`,
                      borderColor: `${activeTheme.primary}50`,
                      color: activeTheme.secondary,
                    }}
                  >
                    {activeNode.date}
                  </span>
                </div>
                <span className="text-zinc-500 text-xs font-mono">
                  NODE {activeIndex + 1} OF {nodes.length}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-3">
                {activeNode.title}
              </h2>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 font-light line-clamp-3">
                {activeNode.desc}
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {activeNode.link && (
                  <button
                    onClick={() => {
                      const targetUrl = activeNode.link!;
                      if (targetUrl.startsWith("http")) {
                        window.open(targetUrl, "_blank");
                      } else {
                        router.push(targetUrl);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black transition-transform duration-300 hover:scale-105 shadow-md cursor-pointer"
                    style={{ backgroundColor: activeTheme.primary }}
                  >
                    <span>Explore Milestone Page</span>
                    <Lucide.ExternalLink size={16} />
                  </button>
                )}

                {activeNode.image && (
                  <button
                    onClick={() => setSelectedImage(activeNode.image!)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-md"
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
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl text-zinc-300 text-xs font-mono">
            <Lucide.Sparkles size={14} className="text-emerald-400 animate-pulse" />
            <span>Scroll mouse wheel to fly through nodes</span>
          </div>

          <div className="flex items-center gap-3 bg-black/70 border border-white/15 p-2 rounded-2xl backdrop-blur-xl shadow-xl">
            <button
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 hover:bg-emerald-500/20 text-white disabled:opacity-30 transition-all"
            >
              <Lucide.ChevronLeft size={20} />
            </button>

            {/* Bullets */}
            <div className="flex items-center gap-1.5 px-2">
              {nodes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeIndex
                      ? "w-7 h-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"
                      : "w-2.5 h-2.5 bg-white/20 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, nodes.length - 1))}
              disabled={activeIndex === nodes.length - 1}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 hover:bg-emerald-500/20 text-white disabled:opacity-30 transition-all"
            >
              <Lucide.ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

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
                  className="pointer-events-auto relative max-w-4xl max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
                  <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black/60">
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
