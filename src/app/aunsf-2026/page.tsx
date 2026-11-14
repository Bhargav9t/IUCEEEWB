"use client";

import React from "react";
import DisintegratingCarousel from "@/components/DisintegratingCarousel";
import { AUNSF_IMAGES } from "@/data/aunsfData";

export default function Aunsf2026Page() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#08090c] transition-colors duration-300 flex flex-col pt-20">
      {/* Main full-page carousel container positioned cleanly below Navbar */}
      <div className="relative w-full flex-1 overflow-hidden">
        <DisintegratingCarousel items={AUNSF_IMAGES} autoplayInitial={true} />
      </div>
    </div>
  );
}
