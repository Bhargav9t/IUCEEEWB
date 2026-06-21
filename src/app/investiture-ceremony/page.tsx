"use client";

import React, { useState } from "react";
import InfiniteGallery from "@/components/InfiniteGallery";
import FlatGrid from "@/components/FlatGrid";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InvestitureCeremonyPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const images = [
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1051.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1053.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1060.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1062.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1074.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1078.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1088.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_1092.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5639.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5653.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5655.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5662.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5670.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5673.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5676.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5685.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5691.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5695.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5699.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5702.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_5707.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9716.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9747.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9769.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9773.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9779.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9782.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9785.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/IMG_9788.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/Pic1.jpg",
        "/images/SnakeTimelineNodes/InvestitureCeremony/Pic2.JPG",
        "/images/SnakeTimelineNodes/InvestitureCeremony/Pic3.jpg"
    ];

    return (
        <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-[#050505] overflow-hidden flex flex-col justify-center items-center font-sans">
            {/* Top Navigation */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="inline-flex items-center text-zinc-900 dark:text-zinc-300 hover:text-emerald-500 transition-colors font-medium text-sm bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Timeline
                </Link>
            </div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4">
                <h1 className="text-4xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tight text-center drop-shadow-sm mb-4">
                    Investiture Ceremony
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-lg text-center text-sm md:text-base leading-relaxed drop-shadow-sm font-medium">
                    Explore the gallery of our newly inducted core team members.
                </p>
                <p className="mt-4 text-xs font-bold tracking-[0.2em] text-emerald-500">
                    CLICK ON ANY IMAGE TO VIEW
                </p>
            </div>
            
            {/* Theme-adaptive background grid */}
            <div className="absolute inset-0 z-0">
                <FlatGrid cols={24} rows={16} className="w-full h-full" />
            </div>

            {/* The Infinite Gallery - slightly transparent so grid peeks through */}
            <InfiniteGallery 
                images={images} 
                className="w-full h-screen absolute inset-0 z-0" 
                visibleCount={14} 
                onImageClick={(image) => {
                    const src = typeof image === "string" ? image : image.src;
                    setSelectedImage(src);
                }}
            />

            {/* Image Popup Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-white/80 dark:bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full max-h-[85vh] bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all focus:outline-none"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="w-full h-full flex items-center justify-center overflow-hidden bg-zinc-100 dark:bg-black/50 p-4">
                                <img 
                                    src={selectedImage} 
                                    alt="Investiture Event" 
                                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
