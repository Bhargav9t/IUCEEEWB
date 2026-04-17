"use client";

import { useRef, useEffect, useState } from "react";
import SnakeTimeline from "@/components/SnakeTimeline";
import PerspectiveGrid from "@/components/PerspectiveGrid";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return (
    <div ref={ref} className={`transition-all ease-out duration-700 ${className}`} style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 mb-4">{children}</span>;
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden relative dark:bg-[#050505] dark:text-zinc-50">
      <PerspectiveGrid className="fixed z-0 dark:opacity-30" />

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-zinc-100 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(30,86,49,0.06),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <Reveal>
            <Label>Since 2019</Label>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-zinc-900 leading-tight mb-8 dark:text-white">
              Our{" "}
              <span className="text-emerald-600">Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl font-light">
              A timeline of milestones, projects, and events that have shaped IUCEE-EWB HITAM since we were founded.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────── */}
      <section className="relative z-10">
        <SnakeTimeline />
      </section>

    </div>
  );
}
