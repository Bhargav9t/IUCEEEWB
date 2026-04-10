"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Users, Zap, ArrowRight } from "lucide-react";
import FlatGrid from "@/components/FlatGrid";
import { TestimonialsCard } from "@/components/ui/testimonials-card";
const ABOUT_TESTIMONIALS = [
  {
    id: 1,
    title: "Architha Reddy Pabbathi",
    subtitle: "Ex-President",
    description: "During my tenure in IUCEE–EWB HITAM 24-25, I developed strong ownership, accountability, and the ability to manage responsibilities under pressure. More than experience, it has been a defining part of my student life — giving me a sense of responsibility, a strong community, a family, and a foundation for my personal and professional growth.",
    image: "/images/team/Testimony_PIcs/Architha_Akka.jpeg",
    linkedin: "https://www.linkedin.com/in/architha-reddy-pabbathi/"
  },
  {
    id: 2,
    title: "Harsith Gourishetti",
    subtitle: "Ex-Treasurer",
    description: "My tenure as Treasurer was a transformative experience in professional accountability and leadership. I developed essential skills in event management, high-pressure decision-making, and professional communication while leveraging the IUCEE network to build meaningful connections.",
    image: "/images/team/Testimony_PIcs/Harshit_Anna.jpeg",
    linkedin: "https://www.linkedin.com/in/harsith-gourishetti/"
  },
  {
    id: 3,
    title: "Sai Kumar",
    subtitle: "Ex-Project Manager",
    description: "Being part of this chapter allowed me to apply my skills to real-world challenges and grow as a leader. We've seen incredible innovation from this group. Their ability to deliver practical solutions to complex problems is unmatched.",
    image: "/images/team/Testimony_PIcs/SaiKUMARANNATRUE.jpeg",
    linkedin: "https://www.linkedin.com/in/sai-kumar-lingaraju/"
  },
  {
    id: 4,
    title: "Shaik Ruksana",
    subtitle: "Ex-Secretary",
    description: "Serving as Secretary of the IUCEE–EWB HITAM Student Chapter was a formative engagement in discipline, ownership, and intent. It demanded both precision in execution and depth in perspective. My tenure was shaped by efforts to foster a more engaged, thoughtful, and socially attuned student ecosystem, while contributing meaningfully to the chapter's evolving direction. The experience remains a quiet but defining influence on how I approach responsibility, impact, and growth.",
    image: "/images/team/Testimony_PIcs/a723ae11-9239-42d5-8e09-ee4b89f642ea.jpg",
    imagePosition: "50% 18%",
    linkedin: "https://www.linkedin.com/in/shaik-ruksana-a3a21b2ab/"
  },
  {
    id: 5,
    title: "Aligeti Sharanya",
    subtitle: "Ex-Lead R&D",
    description: "Being part of the IUCEE-EWB HITAM 2025-26 was a defining experience. I worked with research while guiding others, turning challenges into meaningful outcomes. It not only gave me valuable experience but also showed me different aspects of student life beyond academics. Grateful for a supportive team that made this journey truly impactful.",
    image: "/images/team/Testimony_PIcs/SharanyaAkka.jpeg",
    linkedin: "https://www.linkedin.com/in/aligeti-sharanya/"
  },
  {
    id: 6,
    title: "Vishnu Adari",
    subtitle: "Ex-Social Media Manager",
    description: "My tenure as Social Media Manager of the IUCEE EWB Student Chapter (2025–2026) was a highly enriching experience that strengthened my skills in digital communication and teamwork. Beginning as a PR volunteer during Innofiesta 2024, I gained valuable exposure to the organization's dynamic environment. Being entrusted with the newly created role of Social Media Manager allowed me to contribute to event promotions and enhance our digital presence.",
    image: "/images/team/Testimony_PIcs/VishnuAnna.PNG",
    linkedin: "https://www.linkedin.com/in/adari-vishnu-091131291/"
  }
];

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden relative dark:bg-[#050505] dark:text-zinc-50">
      <FlatGrid className="fixed z-0 opacity-60 dark:opacity-30" />

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 overflow-hidden border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(30,86,49,0.06),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <Reveal>
            <Label>Who we are</Label>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-zinc-900 leading-tight mb-8 dark:text-white">
              About IUCEE-EWB
              <br />
              <span className="text-emerald-600">HITAM</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl font-light">
              We're a student chapter operating out of Hyderabad Institute of Technology and Management. Our chapter builds practical engineering projects — sustainable systems, IoT deployments, and community-focused hardware.
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-16">
            <p className="text-zinc-500 text-base leading-relaxed max-w-2xl">
              The chapter was started to bridge the gap between what students learn in lectures and what actually gets used in the real world. Most engineering education stops at the theory. We try to go the rest of the way — prototyping, testing in conditions, and handing off systems that communities can operate independently.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-zinc-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              { icon: Briefcase, value: "5+", label: "Projects we are working on", desc: "Spanning IoT, energy, and agriculture" },
              { icon: Users, value: "100+", label: "Active members", desc: "And counting, across 5 engineering disciplines" },
              { icon: Zap, value: "6 yrs", label: "Chapter history", desc: "Founded in 2019 at HITAM" },
              { icon: Briefcase, value: "5+", label: "Research papers we worked on", desc: "Published across conferences and journals" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="group p-8 rounded-3xl bg-zinc-50 border border-zinc-200 hover:border-emerald-600/30 transition-all duration-400 dark:bg-[#0a0a0a] dark:border-white/10 dark:hover:border-emerald-500/30">
                  <div className="mb-5 w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 group-hover:text-emerald-600 group-hover:border-emerald-600/30 transition-colors duration-300 dark:bg-white/5 dark:border-white/10 dark:text-zinc-400 dark:group-hover:text-emerald-400">
                    <s.icon size={18} strokeWidth={1.5} />
                  </div>
                  <div className="text-4xl font-black text-zinc-900 mb-1 tracking-tight dark:text-white">{s.value}</div>
                  <div className="text-sm font-semibold text-zinc-900 mb-1 dark:text-white">{s.label}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION + VALUES ─────────────────────────────────────────── */}
      <section className="py-28 border-b border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Reveal>
              <Label>How we operate</Label>
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-7 dark:text-white">
                We believe in building first, theorizing second
              </h2>
              <div className="space-y-5 text-zinc-400 text-base leading-relaxed">
                <p>
                  At HITAM, most student clubs organize talks and workshops. We do those too — but the chapter's real work happens in project teams where students own an outcome from conception to deployment.
                </p>
                <p>
                  We run lean. Project teams are small (5–8 people), timelines are semester-based, and there's a real expectation that you'll ship something. The accountability is what makes it valuable.
                </p>
                <p>
                  We're embedded in the IUCEE network, which means we have access to cross-institution collaboration, national-level competitions, and faculty mentorship beyond our own campus.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid grid-cols-1 gap-4 h-full">
                {[
                  { title: "Student-led projects", desc: "Teams are run by students. Faculty advise but don't manage. You learn ownership by actually having it." },
                  { title: "Field-tested solutions", desc: "We validate in the environments our solutions are meant for — not in comfortable lab conditions." },
                  { title: "Open documentation", desc: "Everything we build is documented so teams who come after us (and communities we work with) can continue without us." },
                  { title: "Skill over résumé", desc: "We care more about what you've built and learned than about your GPA or which clubs you've joined." },
                ].map((v, i) => (
                  <Reveal key={v.title} delay={i * 80}>
                    <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors duration-300 dark:bg-[#0a0a0a] dark:border-white/10 dark:hover:border-emerald-500/30">
                      <h4 className="text-sm font-semibold text-zinc-900 mb-1.5 dark:text-white">{v.title}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">{v.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 border-b border-zinc-100 bg-zinc-50/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <Reveal className="mb-12 text-center">
            <Label>From members</Label>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight dark:text-white">
              In their own words
            </h2>
          </Reveal>
          
          <Reveal delay={100}>
            <TestimonialsCard items={ABOUT_TESTIMONIALS} />
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(30,86,49,0.06),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-6 dark:text-white">
              Ready to contribute?
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto font-light">
              We recruit at the start of each semester. If you're interested in working on hardware projects with a purpose, reach out or show up to an open meeting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors w-full sm:w-auto dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                View our events <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-200 bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-50 transition-colors w-full sm:w-auto dark:bg-transparent dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
              >
                Back to homepage
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
