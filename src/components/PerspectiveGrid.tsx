"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface GridNode {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
  opacity: number;
  glowRadius: number;
  glowAlpha: number;
}

interface PerspectiveGridProps {
  /** Number of columns in the grid */
  cols?: number;
  /** Number of rows in the grid */
  rows?: number;
  /** Vanishing point Y offset as a fraction of canvas height (0 = top, 1 = bottom) */
  horizonY?: number;
  /** How wide the grid spreads at the bottom */
  spreadX?: number;
  /** Interaction radius around cursor (px) */
  cursorRadius?: number;
  /** Extra classes applied to the wrapping div (e.g. 'fixed inset-0 z-0') */
  className?: string;
}

export default function PerspectiveGrid({
  cols = 14,
  rows = 12,
  horizonY = 0.38,
  spreadX = 1.1,
  cursorRadius = 90,
  className = "",
}: PerspectiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<GridNode[]>([]);
  const { resolvedTheme } = useTheme();

  const buildGrid = useCallback(
    (W: number, H: number): GridNode[] => {
      const nodes: GridNode[] = [];
      const vx = W / 2;
      const vy = H * horizonY;

      for (let r = 0; r <= rows; r++) {
        const t = r / rows; // 0 (horizon) → 1 (bottom)
        // Y: linearly interpolate from horizon to bottom-edge
        const sy = vy + t * (H - vy);
        // Horizontal spread grows with t
        const halfSpread = (W / 2) * spreadX * t;

        for (let c = 0; c <= cols; c++) {
          const s = c / cols; // 0 → 1
          const sx = vx + (s - 0.5) * 2 * halfSpread;
          nodes.push({
            x: c,
            y: r,
            screenX: sx,
            screenY: sy,
            opacity: 0.18 + t * 0.55, // fade in toward bottom
            glowRadius: 0,
            glowAlpha: 0,
          });
        }
      }
      return nodes;
    },
    [cols, rows, horizonY, spreadX]
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
      const lineColor = dark ? "rgba(16,185,129," : "rgba(16,185,129,";
      const nodeDot = dark ? "#10b981" : "#059669";
      const glowColor = dark ? "#10b981" : "#059669";
      const { x: mx, y: my } = mouseRef.current;

      const nodes = nodesRef.current;
      if (!nodes.length) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const vx = W / 2;
      const vy = H * horizonY;

      // ── Draw grid lines ──────────────────────────────────────────────
      // Horizontal lines (per row)
      for (let r = 0; r <= rows; r++) {
        const rowStart = nodes[r * (cols + 1)];
        const rowEnd = nodes[r * (cols + 1) + cols];
        if (!rowStart || !rowEnd) continue;
        const t = r / rows;
        const alpha = 0.08 + t * 0.22;
        ctx.beginPath();
        ctx.moveTo(rowStart.screenX, rowStart.screenY);
        ctx.lineTo(rowEnd.screenX, rowEnd.screenY);
        ctx.strokeStyle = `${lineColor}${alpha})`;
        ctx.lineWidth = 0.7 + t * 0.6;
        ctx.stroke();
      }

      // Vertical (perspective) lines per column
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(vx, vy); // all converge at vanishing point
        const bottomNode = nodes[rows * (cols + 1) + c];
        if (!bottomNode) continue;
        ctx.lineTo(bottomNode.screenX, bottomNode.screenY);
        const alpha = 0.08 + (c === 0 || c === cols ? 0.08 : 0);
        ctx.strokeStyle = `${lineColor}${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Draw intersection nodes ──────────────────────────────────────
      nodes.forEach((node) => {
        const dist = Math.hypot(node.screenX - mx, node.screenY - my);
        const isHovered = dist < cursorRadius;

        // Target glow values
        const targetGlow = isHovered ? cursorRadius * (1 - dist / cursorRadius) : 0;
        const targetAlpha = isHovered ? 0.7 * (1 - dist / cursorRadius) : 0;

        // Smooth lerp
        node.glowRadius += (targetGlow - node.glowRadius) * 0.12;
        node.glowAlpha += (targetAlpha - node.glowAlpha) * 0.12;

        // Base node dot
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${node.opacity * 0.9})`;
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

          // Bright center dot when hovered
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = node.glowAlpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      // Horizon fade overlay (soft top gradient)
      const fadeH = H * horizonY + 30;
      const fade = ctx.createLinearGradient(0, 0, 0, fadeH);
      // Use transparent-to-transparent fade; actual bg is set in CSS
      fade.addColorStop(0, dark ? "rgba(5,5,5,0.95)" : "rgba(250,250,250,0.95)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, W, fadeH);

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [buildGrid, cols, rows, horizonY, cursorRadius, resolvedTheme]);

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
