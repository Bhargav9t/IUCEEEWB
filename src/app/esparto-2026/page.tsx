"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Code2, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Layers, 
  Users, 
  ArrowDown, 
  Maximize2, 
  X 
} from "lucide-react";
import FlatGrid from "@/components/FlatGrid";
import { ScrollDissolveReveal } from "@/components/ui/scroll-dissolve-reveal";
import { ESPARTO_IMAGES, EspartoImageItem } from "@/data/espartoData";

export default function Esparto2026Page() {
  const [activeFilter, setActiveFilter] = useState<"all" | "15r" | "17pro" | "pixel">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<EspartoImageItem | null>(null);

  const filteredImages = ESPARTO_IMAGES.filter((_, idx) => {
    if (activeFilter === "15r") return idx < 21;
    if (activeFilter === "17pro") return idx >= 21 && idx < 75;
    if (activeFilter === "pixel") return idx >= 75;
    return true;
  });

  return (
    <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* Top Floating Back to Timeline Navigation */}
      <div className="fixed top-24 left-6 z-40 pointer-events-auto">
        <Link
          href="/history"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-wider px-4 py-2 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-lg text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>TIMELINE</span>
        </Link>
      </div>

      {/* Subtle Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-50">
        <FlatGrid cols={24} rows={18} className="w-full h-full" />
      </div>

      {/* Hero Header with Clean Typography */}
      <header className="relative z-10 pt-32 pb-12 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-bold tracking-[0.22em] text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-500/15 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm mb-4">
          <Code2 size={14} className="text-emerald-500" />
          <span>Technical Conclave & Hackathon • October 09, 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-zinc-900 dark:text-white font-sans drop-shadow-sm mb-4">
          ESPARTO <span className="text-emerald-500">2026</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 font-semibold max-w-3xl mx-auto leading-relaxed">
          IUCEE-EWB HITAM <span className="text-emerald-500 font-normal">×</span> HITAM Hackathon Club (HHC)
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
            76 CAPTURED PERSPECTIVES
          </span>
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
            JOINT HACKATHON SPRINTS
          </span>
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
            HARDWARE & CODE CO-DESIGN
          </span>
        </div>
      </header>

      {/* Expanded Collaboration Narrative: How IUCEE-EWB HITAM & HHC Collaborated */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-10 mb-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase">
              CHAPTER PARTNERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1.5">
              How We Collaborated With HITAM Hackathon Club (HHC)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Bridging humanitarian engineering and competitive hackathon culture into one shared innovation ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <Code2 size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Fusing Code Sprints with Community Challenges
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Instead of abstract coding exercises, IUCEE-EWB provided real-world sustainability challenge briefs and field testbed data, while HITAM Hackathon Club (HHC) architected the rapid 24-hour sprint framework, evaluation benchmarks, and live code reviews.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                <Cpu size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Hardware-Software Interdisciplinary Teams
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Both clubs paired software developers from HHC with design thinkers and hardware creators from EWB. Teams co-developed end-to-end prototypes bridging microcontroller sensor telemetry, automated data processing, and user-facing web dashboards.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Joint Mentorship & Technical Defense
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Executive board members and senior advisors from both chapters conducted structured feedback rounds, guiding teams through circuit reliability, algorithmic efficiency, and community deployment feasibility.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-white/5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                <Terminal size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Campus Collaboration Benchmark
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Esparto 2026 proved that campus technical organizations accomplish far more together than in isolation. The joint effort produced scalable prototypes and solidified an ongoing alliance between our chapters for future national events.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-zinc-400 dark:text-zinc-500 text-xs font-mono tracking-widest mt-12 animate-bounce">
          <span>SCROLL DOWN TO EXPERIENCE THE DISSOLVE JOURNEY</span>
          <ArrowDown size={14} />
        </div>
      </section>

      {/* Chapter 1 Dissolve Reveal: Assembly & Campus Conclave */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-01.jpg"
          imageBack="/images/events/esparto-hhc/esparto-18.jpg"
          className="bg-zinc-950"
        >
          {/* Clean minimal chapter pill only (no blocking description boxes) */}
          <div className="absolute top-28 left-6 sm:left-12 z-20 pointer-events-none">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              01 / 04 • ASSEMBLY & ARRIVAL
            </span>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Chapter 2 Dissolve Reveal: Stage Addresses & Problem Pitching */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-19.jpg"
          imageBack="/images/events/esparto-hhc/esparto-38.jpg"
          className="bg-zinc-950"
        >
          <div className="absolute top-28 left-6 sm:left-12 z-20 pointer-events-none">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              02 / 04 • STAGE ADDRESSES & HACKATHON BRIEFS
            </span>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Chapter 3 Dissolve Reveal: Interdisciplinary Sprints */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-39.jpg"
          imageBack="/images/events/esparto-hhc/esparto-58.jpg"
          className="bg-zinc-950"
        >
          <div className="absolute top-28 left-6 sm:left-12 z-20 pointer-events-none">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              03 / 04 • TEAM COLLABORATION & DESIGN SPRINTS
            </span>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Chapter 4 Dissolve Reveal: Celebrations & Group Legacy */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-59.jpg"
          imageBack="/images/events/esparto-hhc/esparto-76.jpg"
          className="bg-zinc-950"
        >
          <div className="absolute top-28 left-6 sm:left-12 z-20 pointer-events-none">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              04 / 04 • UNITED CELEBRATION & VALEDICTORY
            </span>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Complete 76-Photographs Archive with Device Filtering & Clean Lightbox */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-zinc-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase">
              COMPLETE ARCHIVE
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
              All 76 Captured Moments
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Photographs captured across OnePlus 15R, iPhone 17 Pro Max, and Pixel 9a devices.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Photos (76)" },
              { id: "15r", label: "OnePlus 15R (21)" },
              { id: "17pro", label: "17 Pro Max (54)" },
              { id: "pixel", label: "Pixel 9a (1)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 ${
                  activeFilter === tab.id
                    ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 border border-zinc-200 dark:border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/60 transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 flex items-end justify-between text-white">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  #{idx + 1}
                </span>
                <Maximize2 size={13} className="text-zinc-300" />
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
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-6 py-3.5 bg-black/60 border-b border-white/10 text-white">
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
                ESPARTO 2026 ARCHIVE • {selectedPhoto.id.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full flex-1 flex items-center justify-center p-4 bg-black/80 overflow-hidden min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.image}
                alt=""
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
