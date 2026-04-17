"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface GridNode {
  screenX: number;
  screenY: number;
  opacity: number;
  glowRadius: number;
  glowAlpha: number;
}

interface FlatGridProps {
  /** Number of columns */
  cols?: number;
  /** Number of rows */
  rows?: number;
  /** Interaction radius around cursor (px) */
  cursorRadius?: number;
  /** Extra classes applied to the wrapping div */
  className?: string;
}

export default function FlatGrid({
  cols = 20,
  rows = 14,
  cursorRadius = 100,
  className = "",
}: FlatGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<GridNode[]>([]);
  const { resolvedTheme } = useTheme();

  const buildGrid = useCallback(
    (W: number, H: number): GridNode[] => {
      const nodes: GridNode[] = [];
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          nodes.push({
            screenX: (c / cols) * W,
            screenY: (r / rows) * H,
            opacity: 0.45,
            glowRadius: 0,
            glowAlpha: 0,
          });
        }
      }
      return nodes;
    },
    [cols, rows]
  );

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
      ctx.scale(devicePixelRatio, devicePixelRatio);
      nodesRef.current = buildGrid(W, H);
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

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const dark = isDark();
      const lineAlphaBase = dark ? 0.1 : 0.12;
      const nodeDotColor = dark ? "rgba(16,185,129," : "rgba(5,150,105,";
      const glowColor = dark ? "#10b981" : "#059669";
      const { x: mx, y: my } = mouseRef.current;

      const nodes = nodesRef.current;
      if (!nodes.length) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const cellW = W / cols;
      const cellH = H / rows;

      // ── Draw vertical lines ──────────────────────────────────────────
      for (let c = 0; c <= cols; c++) {
        const x = c * cellW;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.strokeStyle = `rgba(16,185,129,${lineAlphaBase})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── Draw horizontal lines ────────────────────────────────────────
      for (let r = 0; r <= rows; r++) {
        const y = r * cellH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(16,185,129,${lineAlphaBase})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── Draw intersection nodes with hover glow ──────────────────────
      nodes.forEach((node) => {
        const dist = Math.hypot(node.screenX - mx, node.screenY - my);
        const isHovered = dist < cursorRadius;

        const targetGlow = isHovered ? cursorRadius * (1 - dist / cursorRadius) : 0;
        const targetAlpha = isHovered ? 0.75 * (1 - dist / cursorRadius) : 0;

        // Smooth lerp
        node.glowRadius += (targetGlow - node.glowRadius) * 0.12;
        node.glowAlpha += (targetAlpha - node.glowAlpha) * 0.12;

        // Base dot
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeDotColor}${node.opacity * 0.9})`;
        ctx.fill();

        // Glow halo
        if (node.glowRadius > 0.5) {
          const grad = ctx.createRadialGradient(
            node.screenX,
            node.screenY,
            0,
            node.screenX,
            node.screenY,
            node.glowRadius
          );
          grad.addColorStop(0, `rgba(16,185,129,${node.glowAlpha})`);
          grad.addColorStop(1, "rgba(16,185,129,0)");
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, node.glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Bright centre dot when hovered
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = node.glowAlpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [buildGrid, cols, rows, cursorRadius, resolvedTheme]);

  return (
    <div className={`inset-0 w-full h-full pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-auto"
        aria-hidden="true"
      />
    </div>
  );
}
