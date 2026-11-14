"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, HeartHandshake, Camera, ArrowDown, Maximize2, X } from "lucide-react";
import FlatGrid from "@/components/FlatGrid";
import { ScrollDissolveReveal } from "@/components/ui/scroll-dissolve-reveal";
import { ESPARTO_IMAGES, EspartoImageItem } from "@/data/espartoData";

export default function EspartoHhcPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "15r" | "17pro" | "pixel">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<EspartoImageItem | null>(null);

  // Group images by capturing device (first 21 from 15R, next 54 from 17 Pro Max, last from Pixel 9a)
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
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-wider px-4 py-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-lg text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>TIMELINE</span>
        </Link>
      </div>

      {/* Subtle Ambient Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-50">
        <FlatGrid cols={24} rows={18} className="w-full h-full" />
      </div>

      {/* Hero Header with Clean Typography */}
      <header className="relative z-10 pt-32 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-bold tracking-[0.22em] text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 dark:bg-emerald-500/15 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm mb-4">
          <HeartHandshake size={14} className="text-emerald-500" />
          <span>Chapter Collaboration • October 09, 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-zinc-900 dark:text-white font-sans drop-shadow-sm mb-4">
          esparto: <span className="text-emerald-500">iuceeewbhitam</span> × <span className="text-cyan-500">HHC</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          An impactful confluence of student engineering, youth volunteerism, and grassroots community engagement in collaboration with Helping Hearts Club.
        </p>

        {/* Highlight Metadata Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
            76 PHOTOGRAPHS
          </span>
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
            3 DEVICE PERSPECTIVES
          </span>
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm">
            COMMUNITY OUTREACH
          </span>
          <span className="bg-white/80 dark:bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 shadow-sm">
            SCROLL DISSOLVE REVEAL
          </span>
        </div>

        <div className="flex items-center justify-center space-x-2 text-zinc-400 dark:text-zinc-500 text-xs font-mono tracking-widest mt-12 animate-bounce">
          <span>SCROLL DOWN TO DISSOLVE & REVEAL</span>
          <ArrowDown size={14} />
        </div>
      </header>

      {/* Chapter 1: The Gathering & Welcoming Energy */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-01.jpg"
          imageBack="/images/events/esparto-hhc/esparto-18.jpg"
          className="bg-black"
        >
          {/* Typographic Overlay anchored cleanly inside the sticky dissolve view */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                CHAPTER 01 / 04
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                OnePlus 15R Lens
              </span>
            </div>

            <div className="max-w-xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 text-white">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                The Gathering & Team Assembly
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Delegates and student volunteers assemble on campus to kick off Esparto. Notice the WebGL dissolve as you scroll, transforming from early arrival into the packed hall.
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 mt-4 tracking-wider">
                <Sparkles size={13} />
                <span>SCROLL DOWN TO DISSOLVE INTO CEREMONY</span>
              </div>
            </div>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Chapter 2: Stage Keynotes & Initiatives */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-19.jpg"
          imageBack="/images/events/esparto-hhc/esparto-38.jpg"
          className="bg-black"
        >
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                CHAPTER 02 / 04
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                iPhone 17 Pro Max Lens
              </span>
            </div>

            <div className="max-w-xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 text-white">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                Stage Addresses & Keynote Dialogue
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Chapter officers and guest mentors address the audience, breaking down humanitarian project strategies, youth community partnerships, and sustainable field applications.
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 mt-4 tracking-wider">
                <Sparkles size={13} />
                <span>SCROLL DOWN TO DISSOLVE INTO FIELDWORK</span>
              </div>
            </div>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Chapter 3: Youth Outreach & Community Drive */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-39.jpg"
          imageBack="/images/events/esparto-hhc/esparto-58.jpg"
          className="bg-black"
        >
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                CHAPTER 03 / 04
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                Community Focus
              </span>
            </div>

            <div className="max-w-xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 text-white">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                Youth Outreach & Field Engagement
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Hands-on activities, youth engagement sessions, and heartfelt moments with children supported by Helping Hearts Club.
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 mt-4 tracking-wider">
                <Sparkles size={13} />
                <span>SCROLL DOWN TO DISSOLVE INTO THE FINALE</span>
              </div>
            </div>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Chapter 4: United Triumph & Valedictory */}
      <section className="relative z-10 w-full">
        <ScrollDissolveReveal
          imageFront="/images/events/esparto-hhc/esparto-59.jpg"
          imageBack="/images/events/esparto-hhc/esparto-76.jpg"
          className="bg-black"
        >
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                CHAPTER 04 / 04
              </span>
              <span className="text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                Grand Finale
              </span>
            </div>

            <div className="max-w-xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 text-white">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
                United Celebration & Group Legacy
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                The grand culmination bringing together IUCEE-EWB HITAM and Helping Hearts Club into a shared commemorative frame.
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 mt-4 tracking-wider">
                <Sparkles size={13} />
                <span>SCROLL DOWN TO EXPLORE ALL 76 MOMENTS</span>
              </div>
            </div>
          </div>
        </ScrollDissolveReveal>
      </section>

      {/* Full 76-Photographs Gallery with Device Filtering & Clean Lightbox */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-zinc-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase">
              COMPLETE ARCHIVE
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
              All 76 Captured Perspectives
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
                ESPARTO ARCHIVE • {selectedPhoto.id.toUpperCase()}
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
