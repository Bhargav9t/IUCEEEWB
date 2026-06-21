"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import IgniteMediaGrid from "@/components/IgniteMediaGrid";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;  // Reduced from 100
const IMG_HEIGHT = 85; // Reduced from 140

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            // Smoothly animate to the coordinates defined by the parent
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}

            // Initial style
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 flex flex-col items-center justify-center p-4 border border-gray-700"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component Configuration ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000; // Virtual scroll range

// Local Ignite Images from public/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/
const IMAGES = [
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05765.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05766.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05773.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05774.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05775.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05776.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05777.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05779.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05781.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05784.JPG",
    "/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026/DSC05785.JPG",
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

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Virtual Scroll Logic ---
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0); // Keep track of scroll value without re-renders

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            if (isScrollingDown && scrollRef.current < MAX_SCROLL) {
                // Prevent browser standard scroll to advance 3D card layout first
                e.preventDefault();
                const newScroll = Math.min(scrollRef.current + e.deltaY, MAX_SCROLL);
                scrollRef.current = newScroll;
                virtualScroll.set(newScroll);
            } else if (isScrollingUp && window.scrollY === 0 && scrollRef.current > 0) {
                // Rewind 3D animation before letting user pull standard viewport up
                e.preventDefault();
                const newScroll = Math.max(scrollRef.current + e.deltaY, 0);
                scrollRef.current = newScroll;
                virtualScroll.set(newScroll);
            }
        };

        // Touch support
        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const isScrollingDown = deltaY > 0;
            const isScrollingUp = deltaY < 0;

            if (isScrollingDown && scrollRef.current < MAX_SCROLL) {
                e.preventDefault();
                const newScroll = Math.min(scrollRef.current + deltaY * 1.5, MAX_SCROLL);
                scrollRef.current = newScroll;
                virtualScroll.set(newScroll);
            } else if (isScrollingUp && window.scrollY === 0 && scrollRef.current > 0) {
                e.preventDefault();
                const newScroll = Math.max(scrollRef.current + deltaY * 1.5, 0);
                scrollRef.current = newScroll;
                virtualScroll.set(newScroll);
            }
        };

        // Attach listeners
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    // 2. Scroll Rotation
    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop ---
    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // --- Content Opacity ---
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-[#FAFAFA] overflow-hidden dark:bg-[#050505] flex flex-col justify-center items-center">
            {/* Top Navigation */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="inline-flex items-center text-zinc-900 dark:text-zinc-300 hover:text-emerald-500 transition-colors font-medium text-sm bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-sm pointer-events-auto">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Timeline
                </Link>
            </div>

            {/* Intro Text (Fades out) */}
            <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                <motion.h1
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 1 }}
                    className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl uppercase"
                >
                    Ignite <span className="text-emerald-500">2026</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.7 - morphValue } : { opacity: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-4 text-xs font-bold tracking-[0.25em] text-emerald-500"
                >
                    SCROLL DOWN TO EXPLORE
                </motion.p>
            </div>

            {/* Arc Active Content (Fades in) */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="absolute top-[12%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
            >
                <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-3 uppercase">
                    Ignite 2026
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed font-medium">
                    Welcoming the incoming batch to the IUCEE-EWB HITAM student chapter. Experience the highlights, projects, and activities from the event.
                </p>
                <p className="mt-3 text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase">
                    Scroll Down for Media Gallery
                </p>
            </motion.div>

            {/* Main 3D Card Container */}
            <div className="relative flex items-center justify-center w-full h-full">
                {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                    let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                    if (introPhase === "scatter") {
                        target = scatterPositions[i];
                    } else if (introPhase === "line") {
                        const lineSpacing = 70;
                        const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                        const lineX = i * lineSpacing - lineTotalWidth / 2;
                        target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                    } else {
                        const isMobile = containerSize.width < 768;
                        const minDimension = Math.min(containerSize.width, containerSize.height);

                        // Circle setup
                        const circleRadius = Math.min(minDimension * 0.35, 350);
                        const circleAngle = (i / TOTAL_IMAGES) * 360;
                        const circleRad = (circleAngle * Math.PI) / 180;
                        const circlePos = {
                            x: Math.cos(circleRad) * circleRadius,
                            y: Math.sin(circleRad) * circleRadius,
                            rotation: circleAngle + 90,
                        };

                        // Bottom Arc setup
                        const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                        const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                        const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                        const arcCenterY = arcApexY + arcRadius;

                        const spreadAngle = isMobile ? 100 : 130;
                        const startAngle = -90 - (spreadAngle / 2);
                        const step = spreadAngle / (TOTAL_IMAGES - 1);

                        const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                        const maxRotation = spreadAngle * 0.8;
                        const boundedRotation = -scrollProgress * maxRotation;

                        const currentArcAngle = startAngle + (i * step) + boundedRotation;
                        const arcRad = (currentArcAngle * Math.PI) / 180;

                        const arcPos = {
                            x: Math.cos(arcRad) * arcRadius + parallaxValue,
                            y: Math.sin(arcRad) * arcRadius + arcCenterY,
                            rotation: currentArcAngle + 90,
                            scale: isMobile ? 1.4 : 1.8,
                        };

                        // Interpolate morph progress
                        target = {
                            x: lerp(circlePos.x, arcPos.x, morphValue),
                            y: lerp(circlePos.y, arcPos.y, morphValue),
                            rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                            scale: lerp(1, arcPos.scale, morphValue),
                            opacity: 1,
                        };
                    }

                    const optimizedSrc = `/_next/image?url=${encodeURIComponent(src)}&w=128&q=75`;

                    return (
                        <FlipCard
                            key={i}
                            src={optimizedSrc}
                            index={i}
                            total={TOTAL_IMAGES}
                            phase={introPhase}
                            target={target}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// --- The Combined Layout Page (Exports as default) ---
export default function IgnitePage() {
    return (
        <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#050505] overflow-x-hidden">
            {/* Morphing 3D Card Banner */}
            <IntroAnimation />

            {/* Dynamic Bento Box Media Grid */}
            <div className="relative z-10 w-full py-20 bg-white dark:bg-[#080808] border-t border-zinc-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 mb-14 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                        Ignite Media Gallery
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto text-sm md:text-base font-medium">
                        Explore photography and captured clips highlighting team initiatives and student workshops.
                    </p>
                    <p className="text-emerald-500 text-xs font-bold tracking-[0.25em] mt-3 uppercase">
                        Hover Videos to Play • Click to Enlarge
                    </p>
                </div>
                <IgniteMediaGrid />
            </div>
        </div>
    );
}
