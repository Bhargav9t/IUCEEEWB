"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FlatGrid from "@/components/FlatGrid";
import MorphSlider, { MorphSliderItem } from "@/components/MorphSlider";
import IgniteMediaGrid from "@/components/IgniteMediaGrid";

// Local Ignite Images from public/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/
const IMAGES = [
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05765.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05773.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05774.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05775.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05776.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05777.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05779.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05781.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05784.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05786.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05806.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05807.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05810.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05811.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05828.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05851.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/C0100T01.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/C0101T01.JPG"
];

const SLIDER_ITEMS: MorphSliderItem[] = IMAGES.map((img, i) => ({
    image: img,
    caption: `Ignite 2026 • Highlight ${i + 1}`
}));

export default function IgnitePage() {
    const [transition, setTransition] = useState<"melt" | "ripple" | "shear" | "swirl">("melt");

    return (
        <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#050505] overflow-x-hidden font-sans">
            {/* Top Navigation */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/history"
                    className="inline-flex items-center text-zinc-900 dark:text-zinc-300 hover:text-emerald-500 transition-colors font-medium text-sm bg-white/70 dark:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm pointer-events-auto"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Timeline
                </Link>
            </div>

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FlatGrid cols={24} rows={16} className="w-full h-full opacity-40 dark:opacity-60" />
            </div>

            {/* Hero Header */}
            <div className="relative z-10 text-center pt-24 pb-8 px-4">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-3 bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/20">
                    Chapter Milestone
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
                    Ignite <span className="text-emerald-500">2026</span>
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-center text-sm md:text-base leading-relaxed font-medium mx-auto">
                    Welcoming the incoming batch to the IUCEE-EWB HITAM student chapter. Experience the highlights, projects, and activities from the event.
                </p>

                {/* Transition Mode Selector Pills */}
                <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
                    {(["melt", "ripple", "shear", "swirl"] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setTransition(mode)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                                transition === mode
                                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20 scale-105 font-bold"
                                    : "bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/40"
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* MorphSlider Showcase Container */}
            <div className="relative z-10 w-full max-w-5xl px-4 mx-auto mb-20">
                <div className="w-full h-[450px] sm:h-[520px] md:h-[600px] relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 bg-zinc-950">
                    <MorphSlider
                        items={SLIDER_ITEMS}
                        transition={transition}
                        intensity={0.55}
                        aberration={0.35}
                        drift={0.4}
                        autoplay
                        autoplayDelay={4}
                        loop
                        radius={16}
                    />
                </div>
            </div>

            {/* Dynamic Bento Box Media Grid */}
            <div className="relative z-10 w-full py-20 bg-white dark:bg-[#080808] border-t border-zinc-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                        Ignite Media Gallery
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto text-sm md:text-base font-medium">
                        Explore photography and captured moments highlighting team initiatives and student workshops.
                    </p>
                </div>

                {/* Event Highlights & Context (3 Neatly Formatted Paragraphs Near the Pictures) */}
                <div className="max-w-6xl mx-auto px-4 mt-10 mb-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                                01
                            </span>
                            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                                Induction & Mission
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
                            Welcoming the Incoming Cohort
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Ignite 2026 served as the official induction for the fresh batch of engineering students at HITAM. The event immersed newcomers into the global vision of IUCEE and Engineers Without Borders, inspiring them to apply engineering fundamentals toward real community challenges from day one.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                                02
                            </span>
                            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                                Sprints & Activities
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
                            Hands-On Ideation & Culture
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Through interactive icebreakers, design thinking sprints, and lively multimedia presentations, participants experienced our chapter&apos;s collaborative ethos firsthand. The atmosphere was charged with curiosity as students pitched spontaneous ideas and explored interdisciplinary teamwork.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                                03
                            </span>
                            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                                Vision & Growth
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
                            Leadership & Future Roadmap
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            Executive board members and senior coordinators walked the new recruits through ongoing research, community outreach initiatives, and upcoming national student forums. Ignite sparked lasting connections, setting the benchmark for another transformative year of student-led innovation.
                        </p>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <p className="text-emerald-500 text-xs font-bold tracking-[0.25em] uppercase">
                        Hover Videos to Play • Click Any Photo to Enlarge
                    </p>
                </div>

                <IgniteMediaGrid />
            </div>
        </div>
    );
}
