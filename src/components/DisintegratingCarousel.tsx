"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Sparkles,
  Layers,
  MousePointer,
  RotateCcw
} from "lucide-react";
import { AunsfImageItem } from "@/data/aunsfData";

interface DisintegratingCarouselProps {
  items: AunsfImageItem[];
  className?: string;
  autoplayInitial?: boolean;
}

interface DetachedParticle {
  c: number;
  r: number;
  color: string;
  dx: number;
  dy: number;
  size: number;
  alpha: number;
}

// Pseudo-random deterministic hash for reproducible organic block contours
function getBlockNoise(seed: number, col: number, row: number): number {
  const n = Math.sin(col * 12.9898 + row * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function getVerticalNoise(seed: number, col: number, row: number): number {
  const n = Math.sin(col * 39.346 + row * 11.135 + seed * 91.24) * 23421.631;
  return n - Math.floor(n);
}

// Draw image covering target rectangle while maintaining aspect ratio
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  radius: number = 0
) {
  if (radius > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(dx, dy, dw, dh, radius);
    ctx.clip();
  }

  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const imgRatio = imgW / imgH;
  const targetRatio = dw / dh;

  let sx = 0, sy = 0, sw = imgW, sh = imgH;
  if (imgRatio > targetRatio) {
    sw = imgH * targetRatio;
    sx = (imgW - sw) / 2;
  } else {
    sh = imgW / targetRatio;
    sy = (imgH - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

  if (radius > 0) {
    ctx.restore();
  }
}

export default function DisintegratingCarousel({
  items,
  className = "",
  autoplayInitial = true
}: DisintegratingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loaded images & pre-sampled block color grids
  const loadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const colorDataRef = useRef<Map<number, Uint8ClampedArray>>(new Map());
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Motion and Scroll state
  const scrollRef = useRef<{
    current: number;
    target: number;
    isDragging: boolean;
    dragStartX: number;
    dragStartScroll: number;
    lastX: number;
    velocity: number;
    lastFrameTime: number;
    width: number;
    height: number;
    cardW: number;
    cardH: number;
    gap: number;
    pitch: number;
    cols: number;
    rows: number;
    blockSize: number;
  }>({
    current: 0,
    target: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartScroll: 0,
    lastX: 0,
    velocity: 0,
    lastFrameTime: performance.now(),
    width: 1200,
    height: 600,
    cardW: 360,
    cardH: 480,
    gap: 48,
    pitch: 408,
    cols: 30,
    rows: 40,
    blockSize: 12
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplayInitial);
  const [modalItem, setModalItem] = useState<AunsfImageItem | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  // Preload all images and cache sample colors
  useEffect(() => {
    const s = scrollRef.current;
    if (typeof window === "undefined") return;

    // Create scratch canvas for punch-out rendering
    if (!scratchCanvasRef.current) {
      scratchCanvasRef.current = document.createElement("canvas");
    }

    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    items.forEach((item, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.image;
      img.onload = () => {
        loadedImagesRef.current.set(index, img);

        if (sampleCtx) {
          sampleCanvas.width = s.cols;
          sampleCanvas.height = s.rows;
          sampleCtx.clearRect(0, 0, s.cols, s.rows);
          sampleCtx.drawImage(img, 0, 0, s.cols, s.rows);
          try {
            const data = sampleCtx.getImageData(0, 0, s.cols, s.rows).data;
            colorDataRef.current.set(index, data);
          } catch {
            // ignore cross-origin error if any
          }
        }
      };
    });
  }, [items]);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || (w < 640 ? 460 : 580));

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Adaptive card dimensions
      const cardW = w < 640 ? Math.min(270, w * 0.72) : w < 1024 ? 320 : 360;
      const cardH = w < 640 ? Math.min(360, h * 0.8) : w < 1024 ? 440 : 480;
      const gap = w < 640 ? 28 : 44;
      const blockSize = w < 640 ? 10 : 12;
      const cols = Math.floor(cardW / blockSize);
      const rows = Math.floor(cardH / blockSize);

      const s = scrollRef.current;
      s.width = w;
      s.height = h;
      s.cardW = cardW;
      s.cardH = cardH;
      s.gap = gap;
      s.pitch = cardW + gap;
      s.cols = cols;
      s.rows = rows;
      s.blockSize = blockSize;

      if (scratchCanvasRef.current) {
        scratchCanvasRef.current.width = cardW;
        scratchCanvasRef.current.height = cardH;
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Animation Render Loop
    const render = () => {
      const s = scrollRef.current;
      const now = performance.now();
      const dt = Math.min((now - s.lastFrameTime) / 1000, 0.1);
      s.lastFrameTime = now;

      // Friction & smooth lerp towards target
      if (!s.isDragging) {
        s.velocity *= 0.92;
        s.target += s.velocity * dt * 60;
        
        // Snap when slow
        if (Math.abs(s.velocity) < 0.2) {
          const nearestIdx = Math.round(s.target / s.pitch);
          const clampedIdx = Math.max(0, Math.min(items.length - 1, nearestIdx));
          s.target += (clampedIdx * s.pitch - s.target) * 0.1;
        }
      }

      // Bound target scroll within item limits
      const maxScroll = (items.length - 1) * s.pitch;
      s.target = Math.max(-s.pitch * 0.4, Math.min(maxScroll + s.pitch * 0.4, s.target));

      // Lerp current scroll
      s.current += (s.target - s.current) * 0.14;

      // Update active center index
      const curIdx = Math.max(0, Math.min(items.length - 1, Math.round(s.current / s.pitch)));
      setActiveIndex(curIdx);

      // Clear main canvas with deep dark background
      ctx.fillStyle = "#08090c";
      ctx.fillRect(0, 0, s.width, s.height);

      // Subtle radial ambient vignette in center
      const gradient = ctx.createRadialGradient(
        s.width / 2, s.height / 2, 50,
        s.width / 2, s.height / 2, s.width * 0.7
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.05)");
      gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.02)");
      gradient.addColorStop(1, "rgba(8, 9, 12, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, s.width, s.height);

      const centerX = s.width / 2;
      const cardTop = (s.height - s.cardH) / 2;

      // Draw all visible cards with disintegration & reintegration
      items.forEach((item, idx) => {
        const cardCenterX = centerX + idx * s.pitch - s.current;
        const cardLeft = cardCenterX - s.cardW / 2;
        const cardRight = cardLeft + s.cardW;

        // Viewport culling with margin for scattered flying particles
        if (cardRight < -350 || cardLeft > s.width + 350) return;

        const img = loadedImagesRef.current.get(idx);
        const colorData = colorDataRef.current.get(idx);

        // Distance from center of viewport
        const offsetFromCenter = cardCenterX - centerX;
        const normOffset = offsetFromCenter / s.pitch;
        const absOffset = Math.abs(normOffset);

        // Disintegration begins as card moves away from center
        // Center card (absOffset <= 0.22) is 100% solid & intact
        let progress = 0;
        let direction: "left" | "right" = "left";

        if (absOffset > 0.22) {
          progress = Math.min(1.0, (absOffset - 0.22) / 1.05);
          direction = normOffset < 0 ? "left" : "right";
        }

        // Case 1: Centered or Intact card (no disintegration)
        if (progress <= 0 || !scratchCanvasRef.current) {
          if (img) {
            ctx.save();
            // Subtle card border glow
            ctx.shadowColor = "rgba(16, 185, 129, 0.25)";
            ctx.shadowBlur = 24;
            drawImageCover(ctx, img, cardLeft, cardTop, s.cardW, s.cardH, 12);
            ctx.restore();

            // Crisp inner border outline
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cardLeft, cardTop, s.cardW, s.cardH, 12);
            ctx.stroke();
          } else {
            // Skeleton placeholder
            ctx.fillStyle = "#181a20";
            ctx.beginPath();
            ctx.roundRect(cardLeft, cardTop, s.cardW, s.cardH, 12);
            ctx.fill();
          }
          return;
        }

        // Case 2: Disintegrating / Reintegrating Card
        const scratchCanvas = scratchCanvasRef.current;
        const scratchCtx = scratchCanvas.getContext("2d");
        if (!scratchCtx || !img) return;

        // Reset scratch canvas
        scratchCtx.clearRect(0, 0, s.cardW, s.cardH);
        drawImageCover(scratchCtx, img, 0, 0, s.cardW, s.cardH, 8);

        const detachedParticles: DetachedParticle[] = [];
        const bSize = s.blockSize;

        // Iterate through pixel block grid
        for (let r = 0; r < s.rows; r++) {
          for (let c = 0; c < s.cols; c++) {
            // Normalized position across card width
            const u = direction === "left" 
              ? c / s.cols 
              : (s.cols - 1 - c) / s.cols;

            // Deterministic noise for jagged stepped edge
            const noise = getBlockNoise(idx, c, r);
            const noiseV = getVerticalNoise(idx, c, r);

            // Detachment threshold
            const threshold = u * 0.92 + (noise - 0.5) * 0.28;

            if (progress > threshold) {
              // Block is detached! Punch hole in solid card
              scratchCtx.clearRect(c * bSize, r * bSize, bSize, bSize);

              // Local decay progress of this detached particle
              const pDecay = Math.min(1.0, (progress - threshold) / 0.42);

              // Directional scatter displacement
              const dirSign = direction === "left" ? -1 : 1;
              const scatterX = dirSign * (pDecay * 140 + Math.pow(pDecay, 2) * 180 * (noise + 0.25));
              const scatterY = (noiseV - 0.5) * pDecay * 85;
              const pSize = Math.max(3, bSize * (1 - 0.4 * pDecay));
              const alpha = Math.max(0, 1 - Math.pow(pDecay, 1.4));

              // Lookup sampled color
              let color = "rgba(180, 190, 205, 0.8)";
              if (colorData) {
                const pIndex = (r * s.cols + c) * 4;
                const cr = colorData[pIndex];
                const cg = colorData[pIndex + 1];
                const cb = colorData[pIndex + 2];
                color = `rgb(${cr}, ${cg}, ${cb})`;
              }

              if (alpha > 0.02) {
                detachedParticles.push({
                  c,
                  r,
                  color,
                  dx: scatterX,
                  dy: scatterY,
                  size: pSize,
                  alpha
                });
              }
            }
          }
        }

        // Draw the punched-out solid card on main canvas
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, 1 - Math.pow(progress, 2.5));
        ctx.drawImage(scratchCanvas, cardLeft, cardTop);
        ctx.restore();

        // Draw detached flying particles
        for (let p = 0; p < detachedParticles.length; p++) {
          const pt = detachedParticles[p];
          ctx.save();
          ctx.globalAlpha = pt.alpha;
          ctx.fillStyle = pt.color;
          ctx.fillRect(
            cardLeft + pt.c * bSize + pt.dx,
            cardTop + pt.r * bSize + pt.dy,
            pt.size,
            pt.size
          );
          ctx.restore();
        }

        // Ambient micro-dust square particles drifting further out (like the screenshot!)
        if (progress > 0.15) {
          ctx.save();
          const dirSign = direction === "left" ? -1 : 1;
          for (let k = 0; k < 18; k++) {
            const dustHash = getBlockNoise(idx + 100, k, 7);
            const dustV = getVerticalNoise(idx + 100, k, 19);
            const dustX = cardLeft + (direction === "left" ? 0 : s.cardW) + dirSign * (dustHash * 260 + 40) * progress;
            const dustY = cardTop + dustV * s.cardH;
            const dustSize = 2 + (k % 3) * 1.5;
            const dustAlpha = (1 - progress * 0.8) * (0.35 + 0.3 * Math.sin(now * 0.003 + k));

            ctx.globalAlpha = Math.max(0, dustAlpha);
            ctx.fillStyle = "rgba(220, 235, 255, 0.75)";
            ctx.fillRect(dustX, dustY, dustSize, dustSize);
          }
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [items]);

  // Autoplay progression timer
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      const s = scrollRef.current;
      const nextIdx = (Math.round(s.target / s.pitch) + 1) % items.length;
      s.target = nextIdx * s.pitch;
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, items.length]);

  // Mouse / Pointer Interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = scrollRef.current;
    s.isDragging = true;
    s.dragStartX = e.clientX;
    s.dragStartScroll = s.target;
    s.lastX = e.clientX;
    s.velocity = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = scrollRef.current;
    if (!s.isDragging) return;
    const deltaX = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.velocity = -deltaX * 35;
    s.target = s.dragStartScroll - (e.clientX - s.dragStartX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = scrollRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Check if it was a quick click rather than drag
    if (Math.abs(e.clientX - s.dragStartX) < 6) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = e.clientX - rect.left;
        const centerX = s.width / 2;
        const cardIndex = Math.round((clickX - centerX + s.current) / s.pitch);
        if (cardIndex >= 0 && cardIndex < items.length) {
          if (cardIndex === activeIndex) {
            // Open modal on active card click
            setModalItem(items[cardIndex]);
            setModalIndex(cardIndex);
          } else {
            // Smoothly navigate to clicked card
            s.target = cardIndex * s.pitch;
          }
        }
      }
    }
  };

  // Wheel handling for smooth trackpad horizontal scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const s = scrollRef.current;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 3) {
      s.target += delta * 1.2;
    }
  };

  const goToPrev = () => {
    const s = scrollRef.current;
    const prevIdx = Math.max(0, Math.round(s.target / s.pitch) - 1);
    s.target = prevIdx * s.pitch;
  };

  const goToNext = () => {
    const s = scrollRef.current;
    const nextIdx = Math.min(items.length - 1, Math.round(s.target / s.pitch) + 1);
    s.target = nextIdx * s.pitch;
  };

  const currentItem = items[activeIndex] || items[0];

  return (
    <div 
      ref={containerRef}
      className={`relative w-full select-none overflow-hidden ${className}`}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Bar Info & Playback Controls */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-zinc-900/60 dark:bg-black/60 backdrop-blur-md border-b border-white/10 text-white">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wider border border-emerald-500/30">
            <Sparkles size={13} className="animate-spin-slow" />
            <span>DISINTEGRATION CAROUSEL</span>
          </span>
          <span className="hidden sm:inline-block text-xs text-zinc-400 font-medium">
            Scroll or drag to see images disperse into pixel blocks
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors text-zinc-200"
            title={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span className="hidden md:inline">{isPlaying ? "Pause" : "Play"}</span>
          </button>

          {/* Previous Button */}
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="p-2 rounded-lg bg-white/10 hover:bg-emerald-500/30 text-white disabled:opacity-40 disabled:hover:bg-white/10 transition-colors"
            title="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Slide Indicator */}
          <span className="px-3 py-1 text-xs font-mono text-emerald-400 bg-black/40 rounded-md border border-white/5">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={activeIndex === items.length - 1}
            className="p-2 rounded-lg bg-white/10 hover:bg-emerald-500/30 text-white disabled:opacity-40 disabled:hover:bg-white/10 transition-colors"
            title="Next Slide"
          >
            <ChevronRight size={18} />
          </button>

          {/* Lightbox / Zoom */}
          <button
            onClick={() => {
              setModalItem(currentItem);
              setModalIndex(activeIndex);
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="View Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Interactive Disintegration Canvas */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] bg-[#08090c] cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full block"
        />

        {/* Ambient Subtle Hint on Hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-center">
          <span className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-widest text-zinc-500 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            <MousePointer size={12} className="text-emerald-400" />
            <span>DRAG HORIZONTALLY • CLICK CENTER TO EXPAND</span>
          </span>
        </div>
      </div>

      {/* Active Card Story Banner */}
      <div className="relative z-20 px-6 py-6 bg-zinc-950 border-t border-white/10 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                {currentItem.category || "AUNSF 2026"}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Slide {activeIndex + 1} of {items.length}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
              {currentItem.title}
            </h3>
            {currentItem.subtitle && (
              <p className="text-xs md:text-sm font-medium text-emerald-400/90">
                {currentItem.subtitle}
              </p>
            )}
            {currentItem.description && (
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-2xl pt-1">
                {currentItem.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                setModalItem(currentItem);
                setModalIndex(activeIndex);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Maximize2 size={14} />
              <span>Expand Photograph</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Navigation Scrubber */}
        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-white/5 flex items-center space-x-2 overflow-x-auto py-2 hide-scrollbar">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => {
                  const s = scrollRef.current;
                  s.target = idx * s.pitch;
                }}
                className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  isActive 
                    ? "border-emerald-400 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.5)] opacity-100" 
                    : "border-white/10 opacity-40 hover:opacity-80 hover:border-white/40"
                }`}
                title={item.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen High-Res Lightbox Modal */}
      {modalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setModalItem(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10 text-white">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {modalItem.category || "AUNSF 2026"} • {modalIndex + 1} of {items.length}
                </span>
                <h4 className="text-base font-bold text-white">{modalItem.title}</h4>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative w-full flex-1 flex items-center justify-center p-4 bg-black/60 overflow-hidden min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalItem.image}
                alt={modalItem.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
              />

              {/* Modal Navigation Arrows */}
              <button
                onClick={() => {
                  const prev = (modalIndex - 1 + items.length) % items.length;
                  setModalIndex(prev);
                  setModalItem(items[prev]);
                  const s = scrollRef.current;
                  s.target = prev * s.pitch;
                }}
                className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-black text-white transition-colors border border-white/10 backdrop-blur-md"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={() => {
                  const next = (modalIndex + 1) % items.length;
                  setModalIndex(next);
                  setModalItem(items[next]);
                  const s = scrollRef.current;
                  s.target = next * s.pitch;
                }}
                className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-black text-white transition-colors border border-white/10 backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Modal Footer Caption */}
            {modalItem.description && (
              <div className="w-full px-6 py-4 bg-zinc-950 border-t border-white/10 text-xs md:text-sm text-zinc-300">
                {modalItem.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
