"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import DisintegratingCarousel from "@/components/DisintegratingCarousel";
import { AUNSF_IMAGES } from "@/data/aunsfData";

export default function Aunsf2026Page() {
  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#08090c] overflow-hidden select-none font-sans">
      {/* Top Floating Navigation */}
      <div className="absolute top-5 left-5 z-40">
        <Link
          href="/history"
          className="inline-flex items-center space-x-2 text-zinc-300 hover:text-emerald-400 transition-colors font-medium text-xs sm:text-sm bg-black/60 hover:bg-black/80 px-4 py-2 rounded-full backdrop-blur-xl border border-white/10 shadow-lg pointer-events-auto"
        >
          <ArrowLeft size={16} />
          <span>Timeline</span>
        </Link>
      </div>

      {/* Top Minimal Forum Badge */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-lg">
          <Globe size={13} className="text-emerald-400" />
          <span>AUNSF 2026</span>
        </div>
      </div>

      {/* Full-Page Infinite Disintegrating & Reintegrating Carousel */}
      <div className="w-full h-full">
        <DisintegratingCarousel items={AUNSF_IMAGES} autoplayInitial={true} />
      </div>
    </main>
  );
}
