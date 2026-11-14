"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Code2, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Users, 
  ArrowDown, 
  Maximize2, 
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";
import FlatGrid from "@/components/FlatGrid";
import { ScrollDissolveReveal } from "@/components/ui/scroll-dissolve-reveal";
import { ESPARTO_IMAGES, EspartoImageItem } from "@/data/espartoData";

export default function Esparto2026Page() {
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<EspartoImageItem | null>(null);
  const dissolveContainerRef = useRef<HTMLDivElement>(null);

  const allImageUrls = useMemo(() => ESPARTO_IMAGES.map((item) => item.image), []);

  // Smooth programmatic scroll to a specific moment in the dissolve reveal
  const scrollToMoment = useCallback((targetIndex: number) => {
    if (!dissolveContainerRef.current) return;
    const container = dissolveContainerRef.current;
    const totalSteps = ESPARTO_IMAGES.length - 1;
    const clampedIndex = Math.max(0, Math.min(totalSteps, targetIndex));
    const scrollRange = container.offsetHeight - window.innerHeight;
    const targetY = container.offsetTop + (clampedIndex / totalSteps) * scrollRange;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  // Keyboard navigation for jumping between moments
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside a form or modal
      if (selectedPhoto) return;
      if (e.key === "ArrowRight" || e.key === "KeyD") {
        scrollToMoment(activeMomentIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "KeyA") {
        scrollToMoment(activeMomentIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMomentIndex, selectedPhoto, scrollToMoment]);

  const activeProgressPercent = Math.round(
    ((activeMomentIndex + 1) / ESPARTO_IMAGES.length) * 100
  );

  return (
    <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Top Floating Back to Timeline Navigation */}
      <div className="fixed top-24 left-6 z-40 pointer-events-auto">
        <Link
          href="/history"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-wider px-4 py-2 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-lg text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
        >
          <ArrowLeft size={15} />
          <span>TIMELINE</span>
        </Link>
      </div>

      {/* Subtle Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-40">
        <FlatGrid cols={24} rows={18} className="w-full h-full" />
      </div>

      {/* Hero Header Section */}
      <header className="relative z-10 pt-32 pb-14 px-6 max-w-5xl mx-auto text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold tracking-[0.2em] uppercase shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>JOINT TECHNICAL CONCLAVE • OCTOBER 09, 2026</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-sans drop-shadow-sm mb-4 leading-none">
          ESPARTO <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">2026</span>
        </h1>

        <p className="text-lg sm:text-2xl font-bold text-zinc-800 dark:text-zinc-200 tracking-tight max-w-3xl mx-auto mb-3">
          IUCEE-EWB HITAM <span className="text-emerald-500 font-normal mx-1.5">×</span> HITAM Hackathon Club{" "}
          <span className="font-mono text-xs sm:text-sm px-2.5 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold ml-1 border border-zinc-300/80 dark:border-white/10">
            HHC
          </span>
        </p>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          A high-impact confluence uniting community-centered engineering with competitive hackathon sprints.
        </p>

        {/* Highlight Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-white/10 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">76</div>
            <div className="text-[11px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">Visual Perspectives</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-white/10 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-mono">24H</div>
            <div className="text-[11px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">Sprint Framework</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-white/10 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-mono">02</div>
            <div className="text-[11px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">Flagship Chapters</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-white/10 shadow-sm text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
            <div className="text-[11px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-0.5">Interdisciplinary</div>
          </div>
        </div>
      </header>

      {/* Redesigned Collaboration Narrative (Elevated Main Text) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-6 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4 shadow-sm">
            <Sparkles size={14} className="text-emerald-500" />
            <span>CHAPTER PARTNERSHIP BLUEPRINT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight">
            How We Collaborated With{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              HITAM Hackathon Club (HHC)
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed font-normal">
            Bridging humanitarian engineering with competitive sprint culture into one unified innovation ecosystem.
          </p>
        </div>

        {/* 4 Architectural Bento Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="group relative p-7 rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-zinc-200/90 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-xl dark:hover:shadow-emerald-500/5 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm group-hover:scale-105 transition-transform">
                <Code2 size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                01 • SPRINT ARCHITECTURE
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white mb-2.5 tracking-tight">
              Fusing Code Sprints with Community Challenges
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-5">
              Instead of abstract coding exercises, IUCEE-EWB provided real-world sustainability challenge briefs and field testbed data, while HITAM Hackathon Club (HHC) architected the rapid 24-hour sprint framework, evaluation benchmarks, and live code reviews.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Real-world Problem Formulation</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="group relative p-7 rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-zinc-200/90 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-xl dark:hover:shadow-cyan-500/5 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-sm group-hover:scale-105 transition-transform">
                <Cpu size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                02 • CO-DESIGN TEAMS
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white mb-2.5 tracking-tight">
              Hardware-Software Interdisciplinary Teams
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-5">
              Both clubs paired software developers from HHC with design thinkers and hardware creators from EWB. Teams co-developed end-to-end prototypes bridging microcontroller sensor telemetry, automated data processing, and user-facing web dashboards.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-700 dark:text-cyan-400">
              <CheckCircle2 size={14} className="text-cyan-500 shrink-0" />
              <span>Microcontrollers + Web Telemetry</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="group relative p-7 rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-zinc-200/90 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-xl dark:hover:shadow-emerald-500/5 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm group-hover:scale-105 transition-transform">
                <Users size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                03 • TECHNICAL DEFENSE
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white mb-2.5 tracking-tight">
              Joint Mentorship & Technical Defense
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-5">
              Executive board members and senior advisors from both chapters conducted structured feedback rounds, guiding teams through circuit reliability, algorithmic efficiency, and community deployment feasibility.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span>Rigorous Cross-Chapter Mentorship</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="group relative p-7 rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-zinc-200/90 dark:border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-xl dark:hover:shadow-cyan-500/5 hover:border-cyan-500/50 dark:hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-sm group-hover:scale-105 transition-transform">
                <Terminal size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                04 • CAMPUS ALLIANCE
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white mb-2.5 tracking-tight">
              Campus Collaboration Benchmark
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-5">
              Esparto 2026 proved that campus technical organizations accomplish far more together than in isolation. The joint effort produced scalable prototypes and solidified an ongoing alliance between our chapters for future national events.
            </p>

            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-700 dark:text-cyan-400">
              <CheckCircle2 size={14} className="text-cyan-500 shrink-0" />
              <span>Precedent for Future Hackathons</span>
            </div>
          </div>
        </div>

        {/* Scroll Cue to Enter Dissolve Experience */}
        <div className="flex flex-col items-center justify-center text-center mt-14 space-y-2">
          <span className="text-xs font-mono font-bold tracking-[0.22em] text-emerald-600 dark:text-emerald-400 uppercase">
            SCROLL DOWN TO EXPERIENCE ALL 76 MOMENTS IN FULL DISSOLVE
          </span>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce border border-emerald-500/20">
            <ArrowDown size={16} />
          </div>
        </div>
      </section>

      {/* Complete 76-Image Scrolling Dissolve Reveal Showcase */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          images={allImageUrls}
          onActiveIndexChange={setActiveMomentIndex}
          containerRef={dissolveContainerRef}
          className="bg-black"
        >
          {/* Top-Left Minimal Moment Indicator */}
          <div className="absolute top-28 left-6 sm:left-12 z-30 pointer-events-none">
            <div className="inline-flex items-center gap-2.5 bg-black/75 backdrop-blur-xl border border-white/15 px-4 py-2 rounded-full shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.18em] text-emerald-400 uppercase">
                MOMENT {String(activeMomentIndex + 1).padStart(2, "0")} / {ESPARTO_IMAGES.length}
              </span>
              <span className="text-zinc-500 font-mono text-xs">•</span>
              <span className="text-zinc-300 font-mono text-xs tracking-wider">
                ESPARTO 2026
              </span>
            </div>
          </div>

          {/* Floating Bottom Interactive HUD Dock */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 bg-black/80 backdrop-blur-2xl border border-white/15 px-4 py-2.5 rounded-full shadow-2xl max-w-[92vw]">
            {/* Previous Button */}
            <button
              onClick={() => scrollToMoment(activeMomentIndex - 1)}
              disabled={activeMomentIndex === 0}
              className="p-1.5 rounded-full hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-2.5 min-w-[140px] sm:min-w-[200px]">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden relative cursor-pointer"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const clickX = e.clientX - rect.left;
                     const ratio = clickX / rect.width;
                     const target = Math.round(ratio * (ESPARTO_IMAGES.length - 1));
                     scrollToMoment(target);
                   }}>
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-150"
                  style={{ width: `${activeProgressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-white shrink-0">
                {activeMomentIndex + 1}/{ESPARTO_IMAGES.length}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => scrollToMoment(activeMomentIndex + 1)}
              disabled={activeMomentIndex === ESPARTO_IMAGES.length - 1}
              className="p-1.5 rounded-full hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Complete Photographic Archive Grid (Sorting Tabs Removed) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-zinc-200 dark:border-white/10">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase mb-2">
            <Layers size={13} className="text-emerald-500" />
            <span>FULL PERSPECTIVE VAULT</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            All 76 Captured Moments
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Complete chronological photographic archive from the Esparto 2026 collaboration conclave.
          </p>
        </div>

        {/* 76-Photo Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {ESPARTO_IMAGES.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-200/80 dark:border-white/10 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex items-end justify-between text-white">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
                <Maximize2 size={14} className="text-zinc-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-6 py-4 bg-black/70 border-b border-white/10 text-white">
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider uppercase">
                ESPARTO 2026 ARCHIVE • {selectedPhoto.id}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full flex-1 flex items-center justify-center p-4 bg-black/90 overflow-hidden min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.image}
                alt=""
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
