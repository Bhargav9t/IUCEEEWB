"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface HeroGridProps {
  /** CSS class for the wrapping div */
  className?: string;
  /** Grid cell size in px */
  cellSize?: number;
  /** Radius of the cursor glow (px) */
  glowRadius?: number;
}

export default function HeroGrid({
  className = "",
  cellSize = 48,
  glowRadius = 180,
}: HeroGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const glowRef = useRef({ x: -9999, y: -9999 }); // smoothed position
  const rafRef = useRef<number>(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const dark = document.documentElement.classList.contains("dark");

      // Smooth the glow position toward the actual cursor (lerp)
      glowRef.current.x += (mouseRef.current.x - glowRef.current.x) * 0.08;
      glowRef.current.y += (mouseRef.current.y - glowRef.current.y) * 0.08;

      const gx = glowRef.current.x;
      const gy = glowRef.current.y;
      const hasCursor = mouseRef.current.x !== -9999;

      // ── Background glow radial gradient ──────────────────────────────
      if (hasCursor) {
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowRadius);
        if (dark) {
          grad.addColorStop(0, "rgba(16,185,129,0.13)");
          grad.addColorStop(0.45, "rgba(16,185,129,0.04)");
          grad.addColorStop(1, "rgba(16,185,129,0)");
        } else {
          grad.addColorStop(0, "rgba(5,150,105,0.10)");
          grad.addColorStop(0.45, "rgba(5,150,105,0.03)");
          grad.addColorStop(1, "rgba(5,150,105,0)");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Grid lines ────────────────────────────────────────────────────
      const lineAlpha = dark ? 0.12 : 0.09;
      const lineColor = dark
        ? `rgba(16,185,129,${lineAlpha})`
        : `rgba(5,150,105,${lineAlpha})`;

      ctx.lineWidth = 0.75;
      ctx.strokeStyle = lineColor;

      // Vertical lines
      for (let x = 0; x <= W; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = 0; y <= H; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // ── Intersection dots ─────────────────────────────────────────────
      const dotAlpha = dark ? 0.35 : 0.28;
      const dotColor = dark
        ? `rgba(16,185,129,${dotAlpha})`
        : `rgba(5,150,105,${dotAlpha})`;

      for (let x = 0; x <= W; x += cellSize) {
        for (let y = 0; y <= H; y += cellSize) {
          const dist = hasCursor ? Math.hypot(x - gx, y - gy) : Infinity;
          const inGlow = dist < glowRadius;

          if (inGlow) {
            // Bright dot near cursor
            const t = 1 - dist / glowRadius;
            const r = 1.5 + t * 2.5;
            const a = dotAlpha + t * (dark ? 0.65 : 0.5);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = dark
              ? `rgba(52,211,153,${a})`
              : `rgba(16,185,129,${a})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
          }
        }
      }

      // ── Edge vignette — fades the grid out at top & bottom ───────────
      const topFade = ctx.createLinearGradient(0, 0, 0, H * 0.3);
      topFade.addColorStop(
        0,
        dark ? "rgba(5,5,5,0.82)" : "rgba(250,250,250,0.82)"
      );
      topFade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, W, H * 0.3);

      const botFade = ctx.createLinearGradient(0, H * 0.7, 0, H);
      botFade.addColorStop(0, "rgba(0,0,0,0)");
      botFade.addColorStop(
        1,
        dark ? "rgba(5,5,5,0.75)" : "rgba(250,250,250,0.75)"
      );
      ctx.fillStyle = botFade;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [cellSize, glowRadius, resolvedTheme]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
}
