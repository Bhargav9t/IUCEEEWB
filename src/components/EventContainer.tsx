"use client";

import { useState, useMemo } from "react";
import FeaturedCard from "./FeaturedCard";
import EventCard, { EventData } from "./EventCard";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventContainerProps {
  events: EventData[];
}

export default function EventContainer({ events }: EventContainerProps) {
  // Number of regular grid cards to show initially
  const INITIAL_COUNT = 6;
  const LOAD_MORE_COUNT = 6;
  
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);

  // Process and sort events purely on the client via useMemo
  const { featuredEvent, gridEvents } = useMemo(() => {
    // 1. Sort all events chronologically
    const sorted = [...events].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Check for an explicitly featured flagship event
    const explicitlyFeaturedIndex = sorted.findIndex((e) => e.isFeatured);

    // 3. Fallback: Find the closest upcoming event
    const upcomingIndex = sorted.findIndex(
      (e) => new Date(e.date).getTime() >= today.getTime()
    );

    let featured: EventData | null = null;
    let grid: EventData[] = [];

    if (explicitlyFeaturedIndex !== -1) {
      featured = sorted[explicitlyFeaturedIndex];
      const remaining = sorted.filter((_, idx) => idx !== explicitlyFeaturedIndex);
      // Ensure any additional featured events are sorted to the very top of the grid
      grid = [...remaining].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        const aUpcoming = new Date(a.date).getTime() >= today.getTime();
        const bUpcoming = new Date(b.date).getTime() >= today.getTime();
        if (aUpcoming && !bUpcoming) return -1;
        if (!aUpcoming && bUpcoming) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    } else if (upcomingIndex !== -1) {
      // If we found an upcoming event, make it featured
      featured = sorted[upcomingIndex];
      grid = sorted.filter((_, idx) => idx !== upcomingIndex);
    } else if (sorted.length > 0) {
      // Fallback: If no future events exist, feature the most recent past event
      featured = sorted[sorted.length - 1];
      grid = sorted.slice(0, sorted.length - 1).reverse(); // Reverse to show newest past first
    }

    return { featuredEvent: featured, gridEvents: grid };
  }, [events]);

  if (!featuredEvent && gridEvents.length === 0) {
    return (
      <div className="text-center py-28 text-zinc-500 text-lg">
        No upcoming events scheduled yet. Check back soon.
      </div>
    );
  }

  const visibleGridEvents = gridEvents.slice(0, displayCount);
  const hasMore = displayCount < gridEvents.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + LOAD_MORE_COUNT);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Featured Hero Area */}
      {featuredEvent && (
        <div className="w-full">
          <FeaturedCard event={featuredEvent} />
        </div>
      )}

      {/* Grid Iteration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {visibleGridEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Controller */}
      {hasMore && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition-all duration-300 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 border border-zinc-200/50 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10"
          >
            <Sparkles size={16} className="text-emerald-500" />
            Discover More Events
            <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
