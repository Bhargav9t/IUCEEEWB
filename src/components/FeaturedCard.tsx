"use client";

import { Calendar, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EventData } from "./EventCard";

interface FeaturedCardProps {
  event: EventData;
}

export default function FeaturedCard({ event }: FeaturedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-full group relative flex flex-col md:flex-row min-h-[360px] rounded-3xl border border-emerald-500/30 bg-zinc-50 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/60 dark:bg-[#0a0a0a] dark:border-emerald-500/20 dark:hover:border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]"
    >
      {/* Featured Image Area */}
      <div className="relative w-full md:w-5/12 min-h-[420px] md:min-h-full bg-black border-b md:border-b-0 md:border-r border-emerald-500/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {event.poster ? (
          <>
            <Image
              src={event.poster}
              alt={`${event.title} poster`}
              fill
              className="object-contain"
            />
            {/* Overlay to keep UI elements legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-emerald-950/20 to-black opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/30 rounded-full blur-[80px] group-hover:bg-emerald-400/40 transition-colors duration-700" />
          </>
        )}

        {/* Feature Badge */}
        <div className="absolute top-6 left-6 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Zap size={14} className="fill-emerald-400 text-emerald-400 animate-pulse" />
            Next Up
          </span>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50 text-sm font-semibold z-20 shadow-lg group-hover:border-emerald-400/50 transition-colors">
          <Calendar size={16} className="text-emerald-400" />
          {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 md:p-12 flex flex-col justify-center flex-grow relative z-10 w-full overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-zinc-200/50 dark:bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 tracking-tight group-hover:text-emerald-600 transition-colors duration-300 leading-tight dark:text-white dark:group-hover:text-emerald-400 relative z-10">
          {event.title}
        </h2>

        <p className="text-base md:text-lg text-zinc-600 leading-relaxed max-w-2xl mb-8 dark:text-zinc-400 relative z-10">
          {event.description}
        </p>

        <div className="mt-auto relative z-10 flex flex-wrap items-center gap-4">
          {event.registration_url && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Register Now
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </a>
          )}
          {event.poster && (
            <a
              href={event.poster}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-zinc-200 bg-white/40 dark:bg-white/[0.02] text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold hover:bg-emerald-50/50 hover:border-emerald-500/30 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              View Poster
            </a>
          )}
          {!event.registration_url && !event.poster && (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-200 text-zinc-400 font-bold cursor-not-allowed dark:bg-white/5 dark:text-zinc-600"
            >
              Details Coming Soon
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
