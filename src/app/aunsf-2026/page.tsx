"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Globe, Award, Users, BookOpen, Layers, Maximize2 } from "lucide-react";
import FlatGrid from "@/components/FlatGrid";
import DisintegratingCarousel from "@/components/DisintegratingCarousel";
import { AUNSF_IMAGES, AunsfImageItem } from "@/data/aunsfData";

export default function Aunsf2026Page() {
  const [selectedPhoto, setSelectedPhoto] = useState<AunsfImageItem | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#050505] overflow-x-hidden font-sans text-zinc-900 dark:text-zinc-100">
      {/* Top Navigation */}
      <div className="absolute top-6 left-6 z-30">
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
        <FlatGrid cols={24} rows={18} className="w-full h-full opacity-40 dark:opacity-60" />
      </div>

      {/* Hero Header */}
      <div className="relative z-10 text-center pt-24 pb-8 px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-3 bg-emerald-500/10 dark:bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <Globe size={13} className="text-emerald-500" />
          <span>Chapter Milestone • May 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-4 text-zinc-900 dark:text-white">
          AUNSF <span className="text-emerald-500">2026</span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-center text-sm sm:text-base leading-relaxed font-medium mx-auto">
          Anurag University National Student Forum. Celebrating cross-chapter collaboration, technical expositions, research papers, and humanitarian engineering initiatives.
        </p>

        {/* Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
          <span className="bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20">
            32 HIGHLIGHTS
          </span>
          <span className="bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20">
            TECHNICAL CONCLAVE
          </span>
          <span className="bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20">
            INNOVATION EXPO
          </span>
          <span className="bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/20">
            CROSS-CHAPTER ALLIANCE
          </span>
        </div>
      </div>

      {/* Disintegrating & Reintegrating Pixel Carousel */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-6 my-6">
        <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-2xl bg-[#08090c]">
          <DisintegratingCarousel items={AUNSF_IMAGES} autoplayInitial={true} />
        </div>
      </div>

      {/* Event Narrative / Story Cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-500 uppercase">
            EVENT HIGHLIGHTS & OUTCOMES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Empowering Change Through Engineering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm hover:border-emerald-500/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Globe size={20} />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
              National Forum Delegation
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The IUCEE EWB HITAM student delegation represented our chapter at the Anurag University National Student Forum. Gathering student leaders and young engineers from all across India, the forum established a collective platform to share grassroots humanitarian projects, sustainable development interventions, and technical design breakthroughs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm hover:border-emerald-500/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
              Technical Tracks & Paper Defenses
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Delegates engaged in rigorous technical tracks and paper presentations, pitching community-driven hardware prototypes and research outcomes before experienced academic juries. Project domains encompassed frugal IoT sensors for rural applications, sustainable solar deployments, and pedagogical models engineered for school education.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#0a0a0c]/80 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm hover:border-emerald-500/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
              Cross-Chapter Synergies
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Beyond competitive presentations, AUNSF 2026 served as a catalyst for cross-chapter alliances. Our team conducted interactive brainstorming sessions with peer IUCEE and EWB chapters, forging long-term partnerships to collaborate on inter-collegiate ideathons, joint community visits, and mentorship networks throughout the upcoming academic year.
            </p>
          </div>
        </div>
      </div>

      {/* Complete All-Photos Gallery Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-white/10">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              All Moments from AUNSF 2026
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Browse all 32 moments captured during the national forum delegation
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            32 Photographs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {AUNSF_IMAGES.map((imgItem, idx) => (
            <div
              key={imgItem.id}
              onClick={() => setSelectedPhoto(imgItem)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/60 transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-lg hover:shadow-emerald-500/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgItem.image}
                alt={imgItem.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  #{idx + 1}
                </span>
                <p className="text-xs font-bold leading-tight line-clamp-2">
                  {imgItem.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-white/10 text-white">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {selectedPhoto.category || "AUNSF 2026"}
                </span>
                <h4 className="text-base font-bold">{selectedPhoto.title}</h4>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-black/70 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
            {selectedPhoto.description && (
              <div className="px-6 py-4 bg-zinc-950 border-t border-white/10 text-xs sm:text-sm text-zinc-300">
                {selectedPhoto.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
