"use client";

import { Calendar, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export interface EventData {
  id: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  status?: string;
  poster?: string;
  registration_url?: string;
  externalUrl?: string | null;
  isFeatured?: boolean;
}

interface EventCardProps {
  event: EventData;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const isFeatured = Boolean(event.isFeatured);
  const hasExternalUrl = Boolean(event.externalUrl && event.externalUrl.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className={`group relative flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${
        isFeatured
          ? "border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:border-emerald-500/80 hover:shadow-[0_0_45px_rgba(16,185,129,0.3)] bg-gradient-to-b from-emerald-500/[0.08] via-zinc-50 to-zinc-50 dark:from-emerald-950/40 dark:via-[#0a0a0a] dark:to-[#0a0a0a]"
          : "border border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:bg-[#0a0a0a] dark:border-white/10 dark:hover:border-emerald-500/30 shadow-sm dark:shadow-none"
      }`}
    >
      {/* Featured ambient border glow */}
      {isFeatured && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
      )}

      {/* Image area */}
      <div className="relative h-48 bg-black border-b border-zinc-200 dark:border-white/10 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {event.poster ? (
          <img
            src={event.poster}
            alt={`${event.title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-black to-zinc-950 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            <span className="relative text-3xl font-black text-emerald-500/40 uppercase tracking-widest select-none">
              {event.title.split(" ")[0]}
            </span>
          </div>
        )}

        {/* Date badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-zinc-300 text-[11px] font-medium z-10 shadow-sm">
          <Calendar size={11} className="text-emerald-400" />
          {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </div>

        {/* Category tag */}
        {event.category && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              {event.category}
            </span>
          </div>
        )}

        {/* Pulsing Featured Fest badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.35)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <Sparkles size={11} className="text-emerald-300" />
              Featured Fest
              <span className="relative inline-flex items-center ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-[2px] bg-red-500 opacity-60 -skew-x-6" />
                <span className="relative inline-flex items-center justify-center w-3 h-3 bg-red-600 text-white font-black text-[9px] rounded-[2px] shadow-[0_0_6px_rgba(239,68,68,0.7)] -skew-x-6 leading-none select-none italic">
                  !
                </span>
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-grow relative z-10">
        <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300 leading-snug dark:text-white dark:group-hover:text-emerald-400">
          {hasExternalUrl ? (
            <a
              href={event.externalUrl!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:underline inline-flex items-center gap-1.5"
            >
              {event.title}
              <ExternalLink size={14} className="opacity-60 inline-block" />
            </a>
          ) : (
            event.title
          )}
        </h3>

        <p className="text-sm text-zinc-500 leading-relaxed flex-grow mb-6 dark:text-zinc-400">
          {event.description}
        </p>
        
        <div className="flex flex-col gap-2.5 mt-auto w-full">
          {hasExternalUrl ? (
            <a
              href={event.externalUrl!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 text-center cursor-pointer"
            >
              <span>Visit Official Site</span>
              <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          ) : null}

          {event.registration_url ? (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`group/btn flex items-center justify-center gap-1.5 w-full py-3 rounded-xl ${
                hasExternalUrl
                  ? "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-800/50 dark:hover:text-emerald-300 font-medium"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              } text-sm transition-all duration-300 text-center cursor-pointer`}
            >
              Register Now
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          ) : null}

          {event.poster ? (
            <a
              href={event.poster}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 text-sm font-medium hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-800/50 dark:hover:text-emerald-300 text-center cursor-pointer"
            >
              View Poster
            </a>
          ) : null}

          {!hasExternalUrl && !event.registration_url && !event.poster ? (
            <button
              disabled
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-dashed border-zinc-200 bg-transparent text-zinc-400 text-sm font-medium dark:border-white/10 dark:text-zinc-600 cursor-not-allowed"
            >
              Details Coming Soon
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
