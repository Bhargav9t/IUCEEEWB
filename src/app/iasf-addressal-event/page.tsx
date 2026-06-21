"use client";

import React from "react";
import { ImageGallery } from "@/components/ui/image-gallery";
import FlatGrid from "@/components/FlatGrid";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function IASFAddressalEventPage() {
    return (
        <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#050505] overflow-hidden flex flex-col justify-start items-center font-sans">
            {/* Top Navigation */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="inline-flex items-center text-zinc-900 dark:text-zinc-300 hover:text-emerald-500 transition-colors font-medium text-sm bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Timeline
                </Link>
            </div>

            {/* Header Content */}
            <div className="relative z-10 text-center mt-24 mb-10 px-4">
                <h1 className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tight text-center drop-shadow-sm mb-4">
                    IASF Addressal Event
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-center text-sm md:text-base leading-relaxed drop-shadow-sm font-medium mx-auto">
                    Relive the moments from the IUCEE Annual Student Forum project showcase and addressal.
                </p>
                <p className="mt-4 text-xs font-bold tracking-[0.2em] text-emerald-500">
                    PROJECT SHOWCASE • TEAM EVALUATIONS • MENTORSHIP
                </p>
            </div>
            
            {/* Theme-adaptive background grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FlatGrid cols={24} rows={16} className="w-full h-full opacity-40 dark:opacity-60" />
            </div>

            {/* The Image Gallery */}
            <div className="relative z-10 w-full pb-20">
                <ImageGallery />
            </div>
        </div>
    );
}
