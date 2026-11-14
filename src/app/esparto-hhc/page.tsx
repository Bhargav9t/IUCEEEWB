"use client";

import React from "react";
import DisintegratingCarousel from "@/components/DisintegratingCarousel";
import { ESPARTO_IMAGES } from "@/data/espartoData";

export default function EspartoHhcPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#08090c] transition-colors duration-300 flex flex-col pt-20">
      {/* Top Floating Event Header with Clean Typography */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center px-4 w-full max-w-2xl">
        <span className="inline-block text-[11px] font-mono font-bold tracking-[0.22em] text-emerald-600 dark:text-emerald-400 uppercase bg-white/80 dark:bg-black/60 px-3.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md shadow-sm mb-1.5">
          Chapter Collaboration • October 2026
        </span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white drop-shadow-sm font-sans">
          esparto: <span className="text-emerald-500">iuceeewbhitam</span> × <span className="text-cyan-500">HHC</span>
        </h1>
      </div>

      {/* Main Full-Page Disintegration Carousel */}
      <div className="relative w-full flex-1 overflow-hidden">
        <DisintegratingCarousel items={ESPARTO_IMAGES} autoplayInitial={true} />
      </div>
    </div>
  );
}
