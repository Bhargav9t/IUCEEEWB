"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  animate,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { Quote, X, Linkedin, Sparkles, Mail } from "lucide-react";

export interface TestimonialItem {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  imagePosition?: string;
  linkedin?: string;
}

interface TestimonialsCardProps {
  items: TestimonialItem[];
  className?: string;
}

const CARD_W = 440;
const GAP = 28;
const UNIT = CARD_W + GAP;
const SPEED = 58; // px/s smooth auto-scroll

// ── Classic Roomy 3D Glassmorphic Testimonial Card ────────────────────────────
interface TestimonialCardItemProps {
  item: TestimonialItem;
  carouselDragging: boolean;
  onExpand: (item: TestimonialItem) => void;
}

function Testimonial3DCard({ item, carouselDragging, onExpand }: TestimonialCardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (carouselDragging) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rotY.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rotX.set(((e.clientY - r.top) / r.height - 0.5) * -10);
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
  };

  const handleLeave = () => {
    animate(rotX, 0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(rotY, 0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(glowX, 50, { duration: 0.5 });
    animate(glowY, 50, { duration: 0.5 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => {
        if (!carouselDragging) onExpand(item);
      }}
      style={{
        rotateX: carouselDragging ? 0 : rotX,
        rotateY: carouselDragging ? 0 : rotY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        pointerEvents: carouselDragging ? "none" : "auto",
      }}
      whileHover={carouselDragging ? {} : { scale: 1.04, zIndex: 30 }}
      transition={{ scale: { type: "spring", stiffness: 320, damping: 22 } }}
      className="group flex-none w-[340px] sm:w-[410px] md:w-[440px] rounded-3xl bg-white/80 dark:bg-[#0a0f0c]/85 border border-zinc-200/90 dark:border-white/10 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-300 cursor-pointer select-none"
    >
      {/* Specular Top Reflection Line */}
      <div
        className="pointer-events-none absolute top-0 left-8 right-8 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.6), transparent)",
        }}
      />

      {/* Large Watermark Quote Icon (Original Signature Look) */}
      <div className="absolute top-6 right-6 text-emerald-500/15 dark:text-emerald-400/15 pointer-events-none" style={{ transform: "translateZ(5px)" }}>
        <Quote size={56} className="fill-current" />
      </div>

      {/* Radial Cursor Follow Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(16,185,129,0.22) 0%, transparent 65%)`,
        }}
      />

      {/* Hover Border & Glow Ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-emerald-500/60 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300" />

      {/* Card Header: Chapter Badge */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-white/[0.08]" style={{ transform: "translateZ(15px)" }}>
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Sparkles size={13} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
          IUCEE–EWB HITAM
        </span>
      </div>

      {/* Quote Description (Original Roomy Typography) */}
      <p
        className="relative z-10 text-sm sm:text-base leading-[1.85] text-zinc-700 dark:text-zinc-200 font-light italic mb-8"
        style={{ transform: "translateZ(12px)" }}
      >
        &ldquo;{item.description}&rdquo;
      </p>

      {/* Author Footer (Original Layout with 48px Avatar) */}
      <div className="flex items-center gap-4 pt-2" style={{ transform: "translateZ(18px)" }}>
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/60 dark:border-white/10 group-hover:border-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 shadow-md">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              draggable={false}
              className="object-cover"
              style={{ objectPosition: item.imagePosition ?? "50% top" }}
            />
          ) : (
            <div className="w-full h-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-base">
              {item.title[0]}
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white truncate uppercase tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {item.title}
          </h4>
          {item.subtitle && (
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
              {item.subtitle}
            </p>
          )}
        </div>

        {/* LinkedIn Quick Icon */}
        {item.linkedin && (
          <div className="shrink-0">
            <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300 shadow-sm">
              <Linkedin size={14} />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Carousel Component ───────────────────────────────────────────────────
export function TestimonialsCard({ items, className = "" }: TestimonialsCardProps) {
  const trackWidth = UNIT * items.length;
  const tripled = [...items, ...items, ...items];

  // Motion value starting at middle copy (-trackWidth)
  const x = useMotionValue(-trackWidth);
  const dragging = useRef(false);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState<TestimonialItem | null>(null);

  // Normalization helper: keeps x strictly inside [-2 * trackWidth, 0]
  const normalise = useCallback(
    (val: number): number => {
      let v = val;
      while (v > 0) v -= trackWidth;
      while (v <= -trackWidth * 2) v += trackWidth;
      return v;
    },
    [trackWidth]
  );

  // Smooth continuous 60 FPS auto-scroll
  useAnimationFrame((_, delta) => {
    if (dragging.current || paused || expanded) return;
    x.set(normalise(x.get() - (delta / 1000) * SPEED));
  });

  // Trackpad / Wheel horizontal scroll driver
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      x.set(normalise(x.get() - delta * 0.8));
    },
    [x, normalise]
  );

  const onDragStart = () => {
    dragging.current = true;
    setIsDragging(true);
  };

  const onDragEnd = () => {
    x.set(normalise(x.get()));
    dragging.current = false;
    setIsDragging(false);
  };

  return (
    <div className={`relative w-full py-6 select-none ${className}`}>
      <div className="relative overflow-hidden">
        {/* Edge Gradient Fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-32 z-20 bg-gradient-to-r from-white dark:from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-32 z-20 bg-gradient-to-l from-white dark:from-[#050505] to-transparent" />

        {/* Track Container */}
        <div
          className="overflow-hidden py-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="flex gap-7 w-max"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -trackWidth * 3, right: trackWidth }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            {tripled.map((item, i) => (
              <Testimonial3DCard
                key={`${item.id}-${i}`}
                item={item}
                carouselDragging={isDragging}
                onExpand={(selected) => setExpanded(selected)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Interactive Drag / Scroll Hint */}
      <div className="mt-4 flex justify-center z-10 relative pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl px-5 py-2 rounded-full border border-zinc-200/80 dark:border-white/10 shadow-sm">
          <Sparkles size={12} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Drag or scroll to explore testimonials
          </span>
        </div>
      </div>

      {/* ── GENIE PROFILE OVERLAY MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[10px]"
              onClick={() => setExpanded(null)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.7, y: 30, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="pointer-events-auto relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-emerald-500/30 shadow-[0_0_70px_rgba(0,0,0,0.7)]"
                style={{
                  background: "linear-gradient(145deg, rgba(10,24,16,0.95) 0%, rgba(5,14,10,0.98) 100%)",
                  backdropFilter: "blur(30px) saturate(200%)",
                  WebkitBackdropFilter: "blur(30px) saturate(200%)",
                }}
              >
                <button
                  onClick={() => setExpanded(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/20 transition-all"
                >
                  <X size={14} />
                </button>

                <div className="relative z-10 flex flex-col items-center px-8 pt-10 pb-8 text-center">
                  <div className="relative mb-5 p-[3px] rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-lg">
                    <div className="w-24 h-24 rounded-full overflow-hidden relative bg-[#0f1419]">
                      {expanded.image ? (
                        <Image
                          src={expanded.image}
                          alt={expanded.title}
                          fill
                          className="object-cover"
                          style={{ objectPosition: expanded.imagePosition ?? "50% top" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-emerald-400">
                          {expanded.title[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight mb-1">
                    {expanded.title}
                  </h3>

                  {expanded.subtitle && (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 mb-4">
                      {expanded.subtitle}
                    </span>
                  )}

                  <p className="text-xs leading-relaxed text-zinc-300 italic mb-6">
                    &ldquo;{expanded.description}&rdquo;
                  </p>

                  {expanded.linkedin ? (
                    <a
                      href={expanded.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center gap-2.5 w-full px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-300 border border-[#0A66C2]/40 hover:border-[#0A66C2]/80 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30"
                    >
                      <Linkedin size={15} className="text-[#5ba3e0]" />
                      <span>View LinkedIn Profile</span>
                    </a>
                  ) : (
                    <span className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-xs text-zinc-500 border border-white/5 bg-white/[0.03]">
                      <Linkedin size={15} />
                      LinkedIn not linked
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
