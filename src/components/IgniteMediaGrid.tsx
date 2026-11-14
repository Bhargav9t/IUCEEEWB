'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, VolumeX, Maximize2, X } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: string;
  src: string;
  span: string;
  title: string;
  description: string;
}

interface InfoCard {
  isInfoCard: true;
  id: string;
  span: string;
  tag: string;
  title: string;
  description: string;
}

import mockMediaItems from '@/data/ignite-media.json';

const INFO_CARDS: { insertAfter: number; card: InfoCard }[] = [
  {
    insertAfter: 5,
    card: {
      isInfoCard: true,
      id: 'info-card-1',
      span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1',
      tag: '01 • Induction & Vision',
      title: 'Welcoming 200+ Fresh Minds',
      description:
        'Ignite 2026 welcomed the incoming cohort of engineers into the IUCEE-EWB family, introducing them to humanitarian engineering, collaborative problem-solving, and sustainable community impact.',
    },
  },
  {
    insertAfter: 15,
    card: {
      isInfoCard: true,
      id: 'info-card-2',
      span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1',
      tag: '02 • Hands-On Culture',
      title: 'Interactive Sprints & Team Ideation',
      description:
        'Students collaborated across disciplines during fast-paced design thinking workshops and technical icebreakers, turning raw curiosity into actionable engineering concepts.',
    },
  },
  {
    insertAfter: 31,
    card: {
      isInfoCard: true,
      id: 'info-card-3',
      span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1',
      tag: '03 • Mentorship',
      title: 'Leadership & Chapter Trajectory',
      description:
        'Executive board members and senior mentors shared personal journeys from our 6-year history, inspiring new members to lead with purpose in upcoming national forums and research projects.',
    },
  },
];

export default function IgniteMediaGrid() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const itemsWithCards = useMemo(() => {
    const result: (MediaItem | InfoCard)[] = [];
    const insertsMap = new Map(INFO_CARDS.map((ic) => [ic.insertAfter, ic.card]));

    (mockMediaItems as MediaItem[]).forEach((item, index) => {
      result.push(item);
      if (insertsMap.has(index)) {
        result.push(insertsMap.get(index)!);
      }
    });
    return result;
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
      {/* Bento Grid Layout with grid-flow-dense to eliminate any gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[240px] grid-flow-dense">
        {itemsWithCards.map((item) => {
          if ('isInfoCard' in item) {
            return (
              <div
                key={item.id}
                className={cn(
                  'relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden',
                  'bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 text-white',
                  'border border-emerald-500/30 shadow-lg shadow-emerald-500/5',
                  'group transition-all duration-300 hover:border-emerald-500/60',
                  item.span
                )}
              >
                {/* Accent ambient glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />
                
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase font-mono">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-2 leading-snug">
                    {item.title}
                  </h3>
                </div>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={cn(
                'group relative rounded-2xl overflow-hidden cursor-pointer border border-zinc-200/80 dark:border-white/10 shadow-sm transition-all duration-500 bg-zinc-50 dark:bg-zinc-900/40',
                item.span
              )}
            >
              {/* Outer card hover glows */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

              {item.type === 'image' ? (
                <BentoImage src={item.src} alt={item.title} />
              ) : (
                <BentoVideo src={item.src} />
              )}

              {/* Bento Card Hover overlay (Only shows a clean Zoom icon) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
                <div className="bg-white/10 border border-white/20 p-3 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-md">
                  <Maximize2 size={20} className="text-white group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* Image helper subcomponent with skeleton loader and safe URL encoding */
function BentoImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const safeSrc = encodeURI(src);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        </div>
      )}
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'object-cover transition-transform duration-700 ease-out group-hover:scale-105',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}

/* Video helper subcomponent with hover-play functionality */
function BentoVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const safeSrc = encodeURI(src);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Video play error on hover:', err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 0; // Rewind on exit
    }
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fallback Loader Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={safeSrc}
        className={cn(
          'w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />

      {/* Play/Mute indicator badge in the grid */}
      <div
        className={cn(
          'absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white transition-opacity duration-300',
          isPlaying ? 'opacity-0' : 'opacity-100'
        )}
      >
        <Play size={12} className="fill-white" />
        <VolumeX size={12} />
        <span className="text-[10px] font-semibold tracking-wider uppercase">Hover to Play</span>
      </div>
    </div>
  );
}

/* Lightbox overlay popup component */
function LightboxModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const safeSrc = encodeURI(item.src);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background page scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Lightbox Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-emerald-400 transition-all border border-white/10 backdrop-blur-md cursor-pointer"
        aria-label="Close media preview"
      >
        <X size={24} />
      </button>

      {/* Modal Inner Container */}
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent modal closing on clicking the media itself
      >
        {item.type === 'image' ? (
          <img
            src={safeSrc}
            alt={item.title}
            className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10 shadow-2xl"
          />
        ) : (
          <div className="relative max-w-full max-h-[75vh]">
            {!videoLoaded && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              </div>
            )}
            <video
              src={safeSrc}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10 shadow-2xl"
              controls
              autoPlay
              onCanPlay={() => setVideoLoaded(true)}
            />
          </div>
        )}

        {/* Media Information Footer */}
        <div className="mt-4 text-center">
          <p className="text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            Ignite Event Showcase
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
