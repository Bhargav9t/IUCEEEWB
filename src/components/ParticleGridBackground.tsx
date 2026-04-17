"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  opacity: number;
  phaseX: number;
  phaseY: number;
}

export default function ParticleGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let W = 0;
    let H = 0;

    const spacing = 35; // Grid spacing
    const mouseRadius = 220; // Soft magnetic ripple field
    let time = 0;

    const initGrid = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);

      particles = [];
      
      const cols = Math.floor(W / spacing) + 2;
      const rows = Math.floor(H / spacing) + 2;
      
      const offsetX = (W - (cols - 1) * spacing) / 2;
      const offsetY = (H - (rows - 1) * spacing) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = offsetX + i * spacing;
          const y = offsetY + j * spacing;
          
          particles.push({
            x,
            y,
            originX: x,
            originY: y,
            size: Math.random() * 0.7 + 0.8, // 0.8 to 1.5
            opacity: Math.random() * 0.4 + 0.2, // 0.2 to 0.6
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    initGrid();

    const handleResize = () => {
      initGrid();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      time += 0.015;

      const isDark = document.documentElement.classList.contains("dark");
      
      // Theme adaptive colors (Emerald)
      const rgbValues = isDark ? "16, 185, 129" : "5, 150, 105"; 
      
      particles.forEach((p) => {
        // Idle animation: Organic sinusoidal wave motion
        const waveX = Math.sin(time + p.phaseX) * 1.5 + Math.cos(time * 0.8 + p.phaseY) * 1.0;
        const waveY = Math.cos(time + p.phaseY) * 1.5 + Math.sin(time * 0.8 + p.phaseX) * 1.0;
        
        let targetX = p.originX + waveX;
        let targetY = p.originY + waveY;
        
        // Interaction: Distance-based soft magnetic field
        const dx = mouseRef.current.x - p.originX;
        const dy = mouseRef.current.y - p.originY;
        const dist = Math.hypot(dx, dy);

        let intensity = 0;
        
        if (dist < mouseRadius) {
          // Eased falloff for soft ripple effect
          intensity = Math.pow(1 - dist / mouseRadius, 2);
          
          const force = intensity * 20; // Push distance
          const angle = Math.atan2(dy, dx);
          
          targetX -= Math.cos(angle) * force;
          targetY -= Math.sin(angle) * force;
        }

        // Smoothing using interpolation
        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Visual depth: Size and opacity respond to interaction
        const currentSize = p.size + intensity * (isDark ? 1.5 : 1.2);
        
        const baseOp = isDark ? p.opacity * 0.6 : p.opacity * 0.7;
        const highlightOp = isDark ? 0.9 : 0.85;
        const finalOp = baseOp + intensity * (highlightOp - baseOp);
        
        // Draw primary dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbValues}, ${finalOp})`;
        ctx.fill();

        // Dark mode subtle bloom
        if (isDark && intensity > 0.05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgbValues}, ${intensity * 0.15})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
      {/* Edge fade / vignette effect to blend with theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.7)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.7)_100%)]" />
    </div>
  );
}
