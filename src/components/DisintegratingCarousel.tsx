"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X,
  ArrowLeft
} from "lucide-react";
import { useTheme } from "next-themes";

export interface DisintegratingCarouselItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

interface DisintegratingCarouselProps {
  items: DisintegratingCarouselItem[];
  className?: string;
  autoplayInitial?: boolean;
}

interface DetachedBlock {
  c: number;
  r: number;
  dx: number;
  dy: number;
  size: number;
  alpha: number;
}

// Compute cover crop coordinates for an image
function getCoverCrop(
  imgW: number,
  imgH: number,
  targetW: number,
  targetH: number
) {
  const imgRatio = imgW / imgH;
  const targetRatio = targetW / targetH;
  let sx = 0, sy = 0, sw = imgW, sh = imgH;
  if (imgRatio > targetRatio) {
    sw = imgH * targetRatio;
    sx = (imgW - sw) / 2;
  } else {
    sh = imgW / targetRatio;
    sy = (imgH - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

// Draw full image covering the target rectangle
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
  const crop = getCoverCrop(imgW, imgH, dw, dh);
  ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, dx, dy, dw, dh);

  if (radius > 0) {
    ctx.restore();
  }
}

// Draw a single slice corresponding to grid block (c, r)
function drawCoverSlice(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  c: number,
  r: number,
  cols: number,
  rows: number,
  cardW: number,
  cardH: number,
  destX: number,
  destY: number,
  destW: number,
  destH: number
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const crop = getCoverCrop(imgW, imgH, cardW, cardH);

  const blockSx = crop.sx + (c / cols) * crop.sw;
  const blockSy = crop.sy + (r / rows) * crop.sh;
  const blockSw = crop.sw / cols;
  const blockSh = crop.sh / rows;

  ctx.drawImage(img, blockSx, blockSy, blockSw, blockSh, destX, destY, destW, destH);
}

export default function DisintegratingCarousel({
  items,
  className = "",
  autoplayInitial = true
}: DisintegratingCarouselProps) {
  const { resolvedTheme } = useTheme();
  const isDarkRef = useRef(true);

  useEffect(() => {
    isDarkRef.current = resolvedTheme !== "light";
  }, [resolvedTheme]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cached image elements and reusable scratch canvas
  const loadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Motion state
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
    height: 700,
    cardW: 380,
    cardH: 520,
    gap: 48,
    pitch: 428,
    cols: 25,
    rows: 35,
    blockSize: 15
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplayInitial);
  const [modalItem, setModalItem] = useState<DisintegratingCarouselItem | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  // Preload images
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!scratchCanvasRef.current) {
      scratchCanvasRef.current = document.createElement("canvas");
    }

    items.forEach((item, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.image;
      img.onload = () => {
        loadedImagesRef.current.set(index, img);
      };
    });
  }, [items]);

  // Main Render Loop with Pristine Disintegration & Infinite Scroll
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
      const h = Math.floor(rect.height);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Card sizing adapted to available container space
      const cardH = w < 640 ? Math.min(380, h * 0.65) : Math.min(500, h * 0.74);
      const cardW = Math.round(cardH * 0.72);
      const gap = w < 640 ? 28 : 48;
      const blockSize = w < 640 ? 12 : 15;
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
    window.addEventListener("resize", handleResize);

    const render = () => {
      const s = scrollRef.current;
      const now = performance.now();
      const dt = Math.min((now - s.lastFrameTime) / 1000, 0.1);
      s.lastFrameTime = now;
      const N = items.length;
      const isDark = isDarkRef.current;

      // Slower ambient continuous drift
      if (isPlaying && !s.isDragging && !isHovered) {
        s.target += dt * 30;
      } else if (!s.isDragging) {
        s.velocity *= 0.94;
        s.target += s.velocity * dt * 60;
      }

      // Smooth cinematic lerp
      s.current += (s.target - s.current) * 0.055;

      // Wrap coordinates seamlessly
      const cycleLength = N * s.pitch;
      if (Math.abs(s.current) > cycleLength * 3) {
        const offset = Math.floor(s.current / cycleLength) * cycleLength;
        s.current -= offset;
        s.target -= offset;
      }

      // Current slide index
      const rawCurrentIndex = Math.round(s.current / s.pitch);
      const normalizedActiveIndex = ((rawCurrentIndex % N) + N) % N;
      setActiveIndex(normalizedActiveIndex);

      // Theme-adaptive canvas background
      ctx.fillStyle = isDark ? "#08090c" : "#f8fafc";
      ctx.fillRect(0, 0, s.width, s.height);

      // Theme-adaptive atmospheric vignette
      const gradient = ctx.createRadialGradient(
        s.width / 2, s.height / 2, 60,
        s.width / 2, s.height / 2, s.width * 0.72
      );
      if (isDark) {
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.06)");
        gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.02)");
        gradient.addColorStop(1, "rgba(8, 9, 12, 0.98)");
      } else {
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.08)");
        gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.04)");
        gradient.addColorStop(1, "rgba(248, 250, 252, 0.95)");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, s.width, s.height);

      const centerX = s.width / 2;
      const cardTop = (s.height - s.cardH) / 2;

      // Determine visible cards range k
      const extraMargin = 400;
      const minX = -s.cardW - extraMargin;
      const maxX = s.width + extraMargin;

      const kMin = Math.floor((minX - centerX + s.current) / s.pitch);
      const kMax = Math.ceil((maxX - centerX + s.current) / s.pitch);

      for (let k = kMin; k <= kMax; k++) {
        const imgIdx = ((k % N) + N) % N;
        const cardCenterX = centerX + k * s.pitch - s.current;
        const cardLeft = cardCenterX - s.cardW / 2;
        const img = loadedImagesRef.current.get(imgIdx);

        // Distance from center of viewport
        const offsetFromCenter = cardCenterX - centerX;
        const normOffset = offsetFromCenter / s.pitch;
        const absOffset = Math.abs(normOffset);

        // Central area (|absOffset| <= 0.35) remains 100% SOLID & PRISTINE
        let progress = 0;
        let direction: "left" | "right" = "left";

        if (absOffset > 0.35) {
          progress = Math.min(1.0, (absOffset - 0.35) / 1.15);
          direction = normOffset < 0 ? "left" : "right";
        }

        // Case 1: Centered / Solid intact card
        if (progress <= 0 || !scratchCanvasRef.current) {
          if (img) {
            ctx.save();
            ctx.shadowColor = isDark ? "rgba(16, 185, 129, 0.25)" : "rgba(0, 0, 0, 0.12)";
            ctx.shadowBlur = isDark ? 24 : 16;
            drawImageCover(ctx, img, cardLeft, cardTop, s.cardW, s.cardH, 10);
            ctx.restore();

            // Inner subtle border
            ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cardLeft, cardTop, s.cardW, s.cardH, 10);
            ctx.stroke();
          } else {
            ctx.fillStyle = isDark ? "#14151a" : "#e2e8f0";
            ctx.beginPath();
            ctx.roundRect(cardLeft, cardTop, s.cardW, s.cardH, 10);
            ctx.fill();
          }
          continue;
        }

        // Case 2: Clean Edge Disintegration
        const scratchCanvas = scratchCanvasRef.current;
        const scratchCtx = scratchCanvas.getContext("2d");
        if (!scratchCtx || !img) continue;

        scratchCtx.clearRect(0, 0, s.cardW, s.cardH);
        drawImageCover(scratchCtx, img, 0, 0, s.cardW, s.cardH, 0);

        const detachedBlocks: DetachedBlock[] = [];
        const bSize = s.blockSize;

        // Controlled breaking front advancing smoothly from the outer edge inward
        const dissolveCols = progress * (s.cols * 0.75);

        for (let r = 0; r < s.rows; r++) {
          // Clean stepped notch profile along each row (0 to 2.2 blocks)
          const rowNotch = (Math.sin(r * 2.3 + imgIdx * 3.7) * 0.5 + 0.5) * 2.2;
          const edgeThreshold = dissolveCols + rowNotch;

          for (let c = 0; c < s.cols; c++) {
            const colPos = direction === "left" ? c : (s.cols - 1 - c);

            // If outside the breaking front, it is 100% SOLID
            if (colPos > edgeThreshold) {
              continue;
            }

            // Block is detached: punch hole out from solid card
            scratchCtx.clearRect(c * bSize, r * bSize, bSize, bSize);

            // Distance inside the detached region
            const distFromEdge = edgeThreshold - colPos;

            // Only actively fly blocks within 3.5 columns of the breaking front
            if (distFromEdge < 3.5) {
              const p = distFromEdge / 3.5;
              const dirSign = direction === "left" ? -1 : 1;
              const dx = dirSign * (p * 28 + Math.pow(p, 1.8) * 90);
              const dy = Math.sin(r * 1.4 + c * 2.1) * p * 22;
              const alpha = Math.max(0, 1 - p * 0.85);
              const size = Math.max(3, bSize * (1 - 0.25 * p));

              detachedBlocks.push({ c, r, dx, dy, size, alpha });
            }
          }
        }

        // Draw solid notched card on main canvas
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, 1 - Math.pow(progress, 2.8));
        ctx.drawImage(scratchCanvas, cardLeft, cardTop);
        ctx.restore();

        // Draw the detached image slices with exact photograph pixels
        for (let b = 0; b < detachedBlocks.length; b++) {
          const blk = detachedBlocks[b];
          ctx.save();
          ctx.globalAlpha = blk.alpha;
          drawCoverSlice(
            ctx,
            img,
            blk.c,
            blk.r,
            s.cols,
            s.rows,
            s.cardW,
            s.cardH,
            cardLeft + blk.c * bSize + blk.dx,
            cardTop + blk.r * bSize + blk.dy,
            blk.size,
            blk.size
          );
          ctx.restore();
        }

        // Ambient micro-dust squares drifting outward
        if (progress > 0.2) {
          ctx.save();
          const dirSign = direction === "left" ? -1 : 1;
          for (let d = 0; d < 12; d++) {
            const dustP = ((d * 17 + imgIdx * 31) % 100) / 100;
            const dustV = ((d * 37 + imgIdx * 19) % 100) / 100;
            const dustX = cardLeft + (direction === "left" ? 0 : s.cardW) + dirSign * (dustP * 180 + 30) * progress;
            const dustY = cardTop + dustV * s.cardH;
            const dustSize = 2 + (d % 3);
            const dustAlpha = (1 - progress * 0.8) * (0.3 + 0.2 * Math.sin(now * 0.002 + d));

            ctx.globalAlpha = Math.max(0, dustAlpha);
            ctx.fillStyle = isDark ? "rgba(220, 235, 255, 0.7)" : "rgba(16, 185, 129, 0.65)";
            ctx.fillRect(dustX, dustY, dustSize, dustSize);
          }
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [items, isPlaying, isHovered]);

  // Pointer interactions with smooth inertia
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
    s.velocity = -deltaX * 12;
    s.target = s.dragStartScroll - (e.clientX - s.dragStartX) * 1.0;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = scrollRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Click on active card opens modal
    if (Math.abs(e.clientX - s.dragStartX) < 6) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = e.clientX - rect.left;
        const centerX = s.width / 2;
        const rawClickedK = Math.round((clickX - centerX + s.current) / s.pitch);
        const N = items.length;
        const clickedIdx = ((rawClickedK % N) + N) % N;

        if (clickedIdx === activeIndex) {
          setModalItem(items[clickedIdx]);
          setModalIndex(clickedIdx);
        } else {
          s.target = rawClickedK * s.pitch;
        }
      }
    }
  };

  // Relaxed wheel scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const s = scrollRef.current;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 1) {
      s.target += delta * 0.55;
    }
  };

  const goToPrev = () => {
    const s = scrollRef.current;
    const currentK = Math.round(s.target / s.pitch);
    s.target = (currentK - 1) * s.pitch;
  };

  const goToNext = () => {
    const s = scrollRef.current;
    const currentK = Math.round(s.target / s.pitch);
    s.target = (currentK + 1) * s.pitch;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden ${className}`}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Floating Back to Timeline pill */}
      <div className="absolute top-4 left-6 z-30 pointer-events-auto">
        <Link
          href="/history"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-md text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>TIMELINE</span>
        </Link>
      </div>

      {/* Interactive Disintegration Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating Bottom Control Pill - Adapts seamlessly to Light & Dark themes */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-white/85 dark:bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-2xl text-zinc-800 dark:text-white transition-colors duration-300">
        <button
          onClick={goToPrev}
          className="p-2 rounded-full hover:bg-emerald-500/20 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title="Previous Image"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold px-2">
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full hover:bg-emerald-500/20 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title={isPlaying ? "Pause Ambient Motion" : "Resume Ambient Motion"}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>

        <button
          onClick={goToNext}
          className="p-2 rounded-full hover:bg-emerald-500/20 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title="Next Image"
        >
          <ChevronRight size={18} />
        </button>

        <div className="h-4 w-px bg-zinc-200 dark:bg-white/20 mx-1" />

        <button
          onClick={() => {
            setModalItem(items[activeIndex]);
            setModalIndex(activeIndex);
          }}
          className="p-2 rounded-full hover:bg-emerald-500/20 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title="Fullscreen View"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Fullscreen Clean Modal with Light & Dark Theme Support */}
      {modalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 dark:bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setModalItem(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-6 py-3.5 bg-zinc-100/80 dark:bg-black/50 border-b border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
                {modalIndex + 1} / {items.length}
              </span>
              <button
                onClick={() => setModalItem(null)}
                className="p-2 rounded-full bg-zinc-200/80 dark:bg-white/10 hover:bg-zinc-300 dark:hover:bg-white/20 text-zinc-800 dark:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full flex-1 flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-black/80 overflow-hidden min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalItem.image}
                alt=""
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
              />

              <button
                onClick={() => {
                  const prev = (modalIndex - 1 + items.length) % items.length;
                  setModalIndex(prev);
                  setModalItem(items[prev]);
                  const s = scrollRef.current;
                  s.target = prev * s.pitch;
                }}
                className="absolute left-4 p-3 rounded-full bg-white/80 dark:bg-black/70 hover:bg-emerald-500 hover:text-black text-zinc-800 dark:text-white transition-colors border border-zinc-200 dark:border-white/10 shadow-lg"
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
                className="absolute right-4 p-3 rounded-full bg-white/80 dark:bg-black/70 hover:bg-emerald-500 hover:text-black text-zinc-800 dark:text-white transition-colors border border-zinc-200 dark:border-white/10 shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
