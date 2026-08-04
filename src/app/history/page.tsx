"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SnakeTimeline from "@/components/SnakeTimeline";
import PerspectiveGrid from "@/components/PerspectiveGrid";
import { Sparkles, GitCommit } from "lucide-react";

// Dynamically import 3D Canvas component to prevent SSR WebGL hydration issues
const Cosmic3DJourney = dynamic(() => import("@/components/Cosmic3DJourney"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[85vh] min-h-[600px] bg-[#050505] flex flex-col items-center justify-center gap-4 text-emerald-500">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      <p className="font-mono text-sm tracking-widest uppercase animate-pulse">Initializing 3D Cosmic Space Engine...</p>
    </div>
  ),
});

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
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden relative dark:bg-[#050505] dark:text-zinc-50">
      <PerspectiveGrid className="fixed z-0 dark:opacity-30" />

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 overflow-hidden border-b border-zinc-100 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(30,86,49,0.06),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <Reveal>
            <Label>Since 2019</Label>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-zinc-900 leading-tight mb-6 dark:text-white">
              Our{" "}
              <span className="text-emerald-600">Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl font-light">
              An interactive timeline of milestones, projects, and events that have shaped IUCEE-EWB HITAM.
            </p>
          </Reveal>

          {/* View Mode Toggle Switch */}
          <Reveal delay={150}>
            <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-inner">
              <button
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === "3d"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 scale-[1.02]"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Sparkles size={16} />
                <span>3D Crystal Space</span>
              </button>

              <button
                onClick={() => setViewMode("2d")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === "2d"
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/25 scale-[1.02]"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <GitCommit size={16} />
                <span>2D Map</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── INTERACTIVE JOURNEY VIEW ──────────────────────────────────── */}
      <section className="relative z-10">
        <div className={viewMode === "3d" ? "block" : "hidden"}>
          <Cosmic3DJourney onSwitchTo2D={() => setViewMode("2d")} />
        </div>
        <div className={viewMode === "2d" ? "block" : "hidden"}>
          <SnakeTimeline onSwitchTo3D={() => setViewMode("3d")} />
        </div>
      </section>

    </div>
  );
}

