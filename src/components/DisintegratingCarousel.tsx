"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  MousePointer,
  Sparkles
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
    height: 800,
    cardW: 400,
    cardH: 540,
    gap: 52,
    pitch: 452,
    cols: 32,
    rows: 44,
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

  // Main Canvas Render & Slower Infinite Loop
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
      const h = Math.floor(rect.height || window.innerHeight);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Sizing for full-page immersion
      const cardH = w < 640 ? Math.min(420, h * 0.62) : Math.min(560, h * 0.68);
      const cardW = Math.round(cardH * 0.72);
      const gap = w < 640 ? 32 : 52;
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
    window.addEventListener("resize", handleResize);

    // Animation Render Loop
    const render = () => {
      const s = scrollRef.current;
      const now = performance.now();
      const dt = Math.min((now - s.lastFrameTime) / 1000, 0.1);
      s.lastFrameTime = now;
      const N = items.length;

      // Slower, graceful movement
      if (isPlaying && !s.isDragging && !isHovered) {
        // Continuous slow, majestic drift (~32px per second)
        s.target += dt * 32;
      } else if (!s.isDragging) {
        // Damped velocity glide
        s.velocity *= 0.94;
        s.target += s.velocity * dt * 60;
      }

      // Smooth, deliberate lerp towards target (slowed down to 0.055)
      s.current += (s.target - s.current) * 0.055;

      // Keep coordinates bounded to prevent numeric overflow while maintaining seamless continuity
      const cycleLength = N * s.pitch;
      if (Math.abs(s.current) > cycleLength * 3) {
        const offset = Math.floor(s.current / cycleLength) * cycleLength;
        s.current -= offset;
        s.target -= offset;
      }

      // Calculate current active slide index
      const rawCurrentIndex = Math.round(s.current / s.pitch);
      const normalizedActiveIndex = ((rawCurrentIndex % N) + N) % N;
      setActiveIndex(normalizedActiveIndex);

      // Deep dark canvas background
      ctx.fillStyle = "#08090c";
      ctx.fillRect(0, 0, s.width, s.height);

      // Center atmospheric glow
      const gradient = ctx.createRadialGradient(
        s.width / 2, s.height / 2, 80,
        s.width / 2, s.height / 2, s.width * 0.75
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.05)");
      gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.02)");
      gradient.addColorStop(1, "rgba(8, 9, 12, 0.98)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, s.width, s.height);

      const centerX = s.width / 2;
      const cardTop = (s.height - s.cardH) / 2;

      // Determine visible range of slot integers k for infinite seamless looping
      const extraMargin = 450;
      const minX = -s.cardW - extraMargin;
      const maxX = s.width + extraMargin;

      const kMin = Math.floor((minX - centerX + s.current) / s.pitch);
      const kMax = Math.ceil((maxX - centerX + s.current) / s.pitch);

      for (let k = kMin; k <= kMax; k++) {
        const imgIdx = ((k % N) + N) % N;
        const item = items[imgIdx];
        const cardCenterX = centerX + k * s.pitch - s.current;
        const cardLeft = cardCenterX - s.cardW / 2;

        const img = loadedImagesRef.current.get(imgIdx);
        const colorData = colorDataRef.current.get(imgIdx);

        // Distance from center of viewport
        const offsetFromCenter = cardCenterX - centerX;
        const normOffset = offsetFromCenter / s.pitch;
        const absOffset = Math.abs(normOffset);

        // Slower, more progressive disintegration curve
        let progress = 0;
        let direction: "left" | "right" = "left";

        if (absOffset > 0.22) {
          progress = Math.min(1.0, (absOffset - 0.22) / 1.35);
          direction = normOffset < 0 ? "left" : "right";
        }

        // Case 1: Centered / Solid intact card
        if (progress <= 0 || !scratchCanvasRef.current) {
          if (img) {
            ctx.save();
            ctx.shadowColor = "rgba(16, 185, 129, 0.25)";
            ctx.shadowBlur = 28;
            drawImageCover(ctx, img, cardLeft, cardTop, s.cardW, s.cardH, 12);
            ctx.restore();

            // Inner subtle border
            ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cardLeft, cardTop, s.cardW, s.cardH, 12);
            ctx.stroke();
          } else {
            ctx.fillStyle = "#14151a";
            ctx.beginPath();
            ctx.roundRect(cardLeft, cardTop, s.cardW, s.cardH, 12);
            ctx.fill();
          }
          continue;
        }

        // Case 2: Disintegrating / Reintegrating Card
        const scratchCanvas = scratchCanvasRef.current;
        const scratchCtx = scratchCanvas.getContext("2d");
        if (!scratchCtx || !img) continue;

        scratchCtx.clearRect(0, 0, s.cardW, s.cardH);
        drawImageCover(scratchCtx, img, 0, 0, s.cardW, s.cardH, 8);

        const detachedParticles: DetachedParticle[] = [];
        const bSize = s.blockSize;

        for (let r = 0; r < s.rows; r++) {
          for (let c = 0; c < s.cols; c++) {
            const u = direction === "left" 
              ? c / s.cols 
              : (s.cols - 1 - c) / s.cols;

            const noise = getBlockNoise(imgIdx, c, r);
            const noiseV = getVerticalNoise(imgIdx, c, r);

            // Slower threshold curve
            const threshold = u * 0.94 + (noise - 0.5) * 0.26;

            if (progress > threshold) {
              scratchCtx.clearRect(c * bSize, r * bSize, bSize, bSize);

              // Local decay progress of this detached particle
              const pDecay = Math.min(1.0, (progress - threshold) / 0.48);

              const dirSign = direction === "left" ? -1 : 1;
              const scatterX = dirSign * (pDecay * 120 + Math.pow(pDecay, 1.8) * 150 * (noise + 0.2));
              const scatterY = (noiseV - 0.5) * pDecay * 70;
              const pSize = Math.max(3, bSize * (1 - 0.4 * pDecay));
              const alpha = Math.max(0, 1 - Math.pow(pDecay, 1.4));

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

        // Draw solid notched card on main canvas
        ctx.save();
        ctx.globalAlpha = Math.max(0.08, 1 - Math.pow(progress, 2.5));
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

        // Subtle ambient drifting dust squares
        if (progress > 0.15) {
          ctx.save();
          const dirSign = direction === "left" ? -1 : 1;
          for (let d = 0; d < 15; d++) {
            const dustHash = getBlockNoise(imgIdx + 100, d, 7);
            const dustV = getVerticalNoise(imgIdx + 100, d, 19);
            const dustX = cardLeft + (direction === "left" ? 0 : s.cardW) + dirSign * (dustHash * 220 + 35) * progress;
            const dustY = cardTop + dustV * s.cardH;
            const dustSize = 2 + (d % 3) * 1.5;
            const dustAlpha = (1 - progress * 0.8) * (0.35 + 0.25 * Math.sin(now * 0.002 + d));

            ctx.globalAlpha = Math.max(0, dustAlpha);
            ctx.fillStyle = "rgba(220, 235, 255, 0.75)";
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

  // Mouse / Pointer Interaction handlers with relaxed inertia
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
    s.velocity = -deltaX * 12; // relaxed inertia
    s.target = s.dragStartScroll - (e.clientX - s.dragStartX) * 1.0;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = scrollRef.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Click on active center card to open high-res modal
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
          // Slower, smooth glide to clicked card
          s.target = rawClickedK * s.pitch;
        }
      }
    }
  };

  // Wheel handling for relaxed trackpad / mouse scroll
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
      className={`relative w-full h-full select-none overflow-hidden bg-[#08090c] ${className}`}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full-Screen Interactive Disintegration Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Floating Bottom Control Pill - Clean & Minimalist, Zero Titles */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl text-white">
        {/* Previous Button */}
        <button
          onClick={goToPrev}
          className="p-2 rounded-full hover:bg-emerald-500/30 text-white transition-colors"
          title="Previous Image"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Slide Counter */}
        <span className="font-mono text-xs text-emerald-400 font-bold px-2">
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>

        {/* Autoplay Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full hover:bg-emerald-500/30 text-white transition-colors"
          title={isPlaying ? "Pause Ambient Motion" : "Resume Ambient Motion"}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="p-2 rounded-full hover:bg-emerald-500/30 text-white transition-colors"
          title="Next Image"
        >
          <ChevronRight size={18} />
        </button>

        <div className="h-4 w-px bg-white/20 mx-1" />

        {/* Expand Modal */}
        <button
          onClick={() => {
            setModalItem(items[activeIndex]);
            setModalIndex(activeIndex);
          }}
          className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          title="Fullscreen View"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Fullscreen High-Res Modal (Clean without titles) */}
      {modalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setModalItem(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between px-6 py-3.5 bg-black/50 border-b border-white/10 text-white">
              <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
                {modalIndex + 1} / {items.length}
              </span>
              <button
                onClick={() => setModalItem(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full flex-1 flex items-center justify-center p-4 bg-black/80 overflow-hidden min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalItem.image}
                alt=""
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
              />

              {/* Prev/Next arrows in modal */}
              <button
                onClick={() => {
                  const prev = (modalIndex - 1 + items.length) % items.length;
                  setModalIndex(prev);
                  setModalItem(items[prev]);
                  const s = scrollRef.current;
                  s.target = prev * s.pitch;
                }}
                className="absolute left-4 p-3 rounded-full bg-black/70 hover:bg-emerald-500 hover:text-black text-white transition-colors border border-white/10"
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
                className="absolute right-4 p-3 rounded-full bg-black/70 hover:bg-emerald-500 hover:text-black text-white transition-colors border border-white/10"
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
