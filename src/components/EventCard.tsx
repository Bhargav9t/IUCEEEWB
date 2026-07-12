"use client";

import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface EventData {
  id: string;
  title: string;
  date: string;
  description: string;
  poster?: string;
  registration_url?: string;
}

interface EventCardProps {
  event: EventData;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative flex flex-col h-full rounded-3xl border border-zinc-200 bg-zinc-50 overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:border-zinc-300 dark:bg-[#0a0a0a] dark:border-white/10 dark:hover:border-emerald-500/30"
    >
      {/* Image area */}
      <div className="relative h-48 bg-black border-b border-zinc-200 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {event.poster && (
          <img
            src={event.poster}
            alt={`${event.title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-zinc-200 text-zinc-300 text-[11px] font-medium z-10">
          <Calendar size={11} />
          {new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
      {/* Content */}
      <div className="p-7 flex flex-col flex-grow relative z-10">
        <h3 className="text-base font-semibold text-zinc-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300 leading-snug dark:text-white dark:group-hover:text-emerald-400">
          {event.title}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed flex-grow mb-6 dark:text-zinc-400">
          {event.description}
        </p>
        
        <div className="flex flex-col gap-2 mt-auto w-full">
          {event.registration_url ? (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-center cursor-pointer"
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
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 text-sm font-medium hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300 dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-800/50 dark:hover:text-emerald-300 text-center cursor-pointer"
            >
              View Poster
            </a>
          ) : null}
          {!event.registration_url && !event.poster ? (
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
