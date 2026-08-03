"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// ─── Team data ────────────────────────────────────────────────────────────────
const CORE_TEAM = [
  { id: 1,  name: "Ameena",      role: "President",             image: "/images/team/Testimony_PIcs/Ameena.jpeg" },
  { id: 2,  name: "Kanishka",    role: "Vice President",        image: "/images/team/Testimony_PIcs/Kanishka.jpeg" },
  { id: 3,  name: "Alankrusha",  role: "Secretary",             image: "/images/team/Testimony_PIcs/AlankrushaBhaiyya.jpeg" },
  { id: 4,  name: "Jahnavi",     role: "Treasurer",             image: "/images/team/Testimony_PIcs/Jahnavi.jpeg" },
  { id: 5,  name: "Sathvik Varkula", role: "Project Manager",       image: "/images/team/Testimony_PIcs/Satvik.jpeg" },
  { id: 6,  name: "Charlson",    role: "Project Manager",       image: "/images/team/Testimony_PIcs/Charlson.jpeg" },
  { id: 7,  name: "Bhargav",     role: "Lead R&D",              image: "/images/team/Testimony_PIcs/Bastard.jpeg",  imagePosition: "50% 3%" },
  { id: 8,  name: "Yashashwini", role: "Event Manager",         image: "/images/team/Testimony_PIcs/Yeshashwini.jpeg" },
  { id: 9,  name: "Harshith",    role: "PR Lead",               image: "/images/team/Testimony_PIcs/Harshith.jpeg" },
  { id: 10, name: "Kranthi",     role: "Lead Co-ordinator",     image: "/images/team/Testimony_PIcs/KranthiAnna.jpeg" },
  { id: 11, name: "Nikhil Surya", role: "Social Media Manager",  image: "/images/team/Testimony_PIcs/NikhilSurya.jpeg" },
];

// ─── Geometry helpers ─────────────────────────────────────────────────────────
function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

// ─── Single orbit node ────────────────────────────────────────────────────────
interface OrbitNodeProps {
  member: (typeof CORE_TEAM)[0] & { imagePosition?: string };
  index: number;
  total: number;
  svgPath: string;
  nodeSize: number;   // design-space px
  tiltDeg: number;
  progress: ReturnType<typeof useMotionValue<number>>;
}

function OrbitNode({ member, index, total, svgPath, nodeSize, tiltDeg, progress }: OrbitNodeProps) {
  const itemOffset = (index / total) * 100;

  // Each node's position along the path = (global progress + its own offset) % 100
  const offsetDistance = useTransform(progress, (p: number) => {
    const d = (((p + itemOffset) % 100) + 100) % 100;
    return `${d}%`;
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        width: nodeSize,
        height: nodeSize,
        // CSS Motion Path properties
        offsetPath: `path("${svgPath}")`,
        offsetRotate: "0deg",
        offsetAnchor: "center center",
        offsetDistance,
      } as any}
      aria-label={member.name}
    >
      {/* Counter-rotate the card so it always stays upright even as the path tilts */}
      <div
        style={{ transform: `rotate(${-tiltDeg}deg)` }}
        className="flex flex-col items-center gap-1.5 select-none"
      >
        {/* Circular photo */}
        <div
          className="rounded-full overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10 bg-zinc-800 flex-shrink-0"
          style={{ width: nodeSize * 0.72, height: nodeSize * 0.72 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.image}
            alt={member.name}
            draggable={false}
            className="w-full h-full object-cover"
            style={{ objectPosition: member.imagePosition ?? "50% top" }}
          />
        </div>
        {/* Name + Role label */}
        <div className="text-center leading-tight" style={{ maxWidth: nodeSize * 1.3 }}>
          <p className="text-white font-semibold" style={{ fontSize: nodeSize * 0.12 }}>
            {member.name}
          </p>
          <p className="text-emerald-400 uppercase tracking-widest" style={{ fontSize: nodeSize * 0.09 }}>
            {member.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function OrbitTeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Design-space constants (everything in px at scale = 1)
  const BASE    = 1000;   // design canvas width & height
  const RX      = 430;    // ellipse half-width
  const RY      = 130;    // ellipse half-height (shallow = perspective-like)
  const TILT    = -8;     // rotation of whole orbit
  const ITEM    = 100;    // node bounding-box (in design px)
  const SPEED   = 34;     // seconds for one full lap
  const CX      = BASE / 2;
  const CY      = BASE / 2;

  const svgPath = useMemo(() => ellipsePath(CX, CY, RX, RY), [CX, CY]);

  // Height of the orbit region we actually need to show (design units)
  const designHeight = RY * 2 + ITEM * 3 + 40; // includes label space above/below orbit

  // Scale to fill container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / BASE);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Continuous animation loop: 0 → 100, repeating
  const progress = useMotionValue(0);
  useEffect(() => {
    const ctrl = animate(progress, 100, {
      duration: SPEED,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => ctrl.stop();
  }, [progress]);

  const sectionHeight = Math.max(designHeight * scale, 360);

  return (
    <section className="py-24 bg-[#050505] overflow-hidden">
      {/* Heading */}
      <div className="container mx-auto px-6 max-w-7xl mb-14">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400 mb-4">
          The people
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Meet our core team
        </h2>
      </div>

      {/* Orbit stage */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: sectionHeight }}
        aria-hidden="true"
      >
        {/* Scaled design canvas */}
        <div
          style={{
            position: "absolute",
            width: BASE,
            height: BASE,
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Tilted orbit wrapper */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transform: `rotate(${TILT}deg)`,
            }}
          >
            {/* Visible orbit ring (SVG) */}
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${BASE} ${BASE}`}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              {/* Outer glow */}
              <path
                d={svgPath}
                fill="none"
                stroke="rgba(16,185,129,0.08)"
                strokeWidth={3 / scale}
              />
              {/* Core ring */}
              <path
                d={svgPath}
                fill="none"
                stroke="rgba(16,185,129,0.25)"
                strokeWidth={1 / scale}
                strokeDasharray={`${6 / scale} ${10 / scale}`}
              />
            </svg>

            {/* Orbiting nodes */}
            {CORE_TEAM.map((member, index) => (
              <OrbitNode
                key={member.id}
                member={member}
                index={index}
                total={CORE_TEAM.length}
                svgPath={svgPath}
                nodeSize={ITEM}
                tiltDeg={TILT}
                progress={progress}
              />
            ))}
          </div>
        </div>

        {/* Center logo — sits above the tilted wrapper, always centred */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        >
          <div className="flex items-center gap-3">
            {/* HITAM logo circle */}
            <div
              className="rounded-full overflow-hidden border border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.15)] bg-[#5bab47]"
              style={{ width: 56 * scale, height: 56 * scale }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Untitled-design-54.webp"
                alt="HITAM"
                draggable={false}
                className="w-full h-full object-contain"
              />
            </div>

            {/* × separator */}
            <span
              className="text-zinc-500 font-light select-none"
              style={{ fontSize: Math.max(14 * scale, 12) }}
            >
              ×
            </span>

            {/* IUCEE-EWB logo circle */}
            <div
              className="rounded-full overflow-hidden border border-zinc-300/30 shadow-[0_0_24px_rgba(255,255,255,0.05)] bg-white"
              style={{ width: 56 * scale, height: 56 * scale }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Untitled-design-55.webp"
                alt="IUCEE-EWB"
                draggable={false}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <p
            className="text-zinc-500 uppercase tracking-widest font-semibold mt-2 select-none"
            style={{ fontSize: Math.max(9 * scale, 8) }}
          >
            IUCEE EWB HITAM
          </p>
        </div>
      </div>
    </section>
  );
}
