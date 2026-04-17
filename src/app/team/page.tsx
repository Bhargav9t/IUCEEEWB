"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CoreTeamCarousel from "@/components/CoreTeamCarousel";
import ParticleGridBackground from "@/components/ParticleGridBackground";


function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return (
    <div ref={ref} className={`transition-all ease-out duration-700 ${className}`} style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 mb-4">{children}</span>;
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden relative dark:bg-[#050505] dark:text-zinc-50">
      <ParticleGridBackground />

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 overflow-hidden border-b border-zinc-100 dark:border-white/[0.06]">

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <Reveal>
            <Label>The people</Label>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-zinc-900 leading-tight mb-8 dark:text-white">
              Meet our
              <br />
              <span className="text-emerald-600">Core Team</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl font-light">
              The people who make it happen — a dedicated group of students driving real-world engineering projects from concept to deployment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CORE TEAM CAROUSEL ───────────────────────────────────────── */}
      <section className="border-b border-zinc-100">
        <Reveal>
          <CoreTeamCarousel />
        </Reveal>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(30,86,49,0.06),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6 dark:text-white">
              Want to join the team?
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto font-light">
              We recruit at the start of each semester. If you're interested in working on hardware projects with a purpose, reach out or show up to an open meeting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors w-full sm:w-auto dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Learn about us <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/events"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-200 bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-50 transition-colors w-full sm:w-auto dark:bg-transparent dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
              >
                View our events
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
