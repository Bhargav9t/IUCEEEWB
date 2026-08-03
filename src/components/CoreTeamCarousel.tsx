"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  animate,
} from "framer-motion";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

const CORE_TEAM = [
  { id: 1,  name: "Ameena",           role: "President",            image: "/images/team/Testimony_PIcs/Ameena.jpeg", linkedin: "https://www.linkedin.com/in/ameena-begum-mahek-01a148329/", email: "Ameenamahekk@gmail.com" },
  { id: 2,  name: "Kanishka",         role: "Vice President",       image: "/images/team/Testimony_PIcs/Kanishka.jpeg", linkedin: "https://www.linkedin.com/in/kanishka-chitturi-03482a351/", email: "chitturikanishka@gmail.com" },
  { id: 3,  name: "Alankrusha",       role: "Secretary",            image: "/images/team/Testimony_PIcs/AlankrushaBhaiyya.jpeg", linkedin: "https://www.linkedin.com/in/alankrusha-bathini-b99544326/", email: "sha020507@gmail.com" },
  { id: 4,  name: "Jahnavi",          role: "Treasurer",            image: "/images/team/Testimony_PIcs/Jahnavi.jpeg", linkedin: "https://www.linkedin.com/in/jahanavi-gujarathi-28868a383/", email: "gujarathijahanavi@gmail.com" },
  { id: 5,  name: "Sathvik Varkula",  role: "Project Manager",      image: "/images/team/Testimony_PIcs/Satvik.jpeg", linkedin: "https://www.linkedin.com/in/sathvik-varkula-459790340/", email: "sathvikvarkula.sv@gmail.com" },
  { id: 6,  name: "Charlson",         role: "Project Manager",      image: "/images/team/Testimony_PIcs/Charlson.jpeg", linkedin: "", email: "charlsonyarasani06@gmail.com" },
  { id: 7,  name: "Bhargav",          role: "Lead R&D",             image: "/images/team/Testimony_PIcs/Bhargav.jpg",  imageClass: "object-[center_3%]", linkedin: "https://www.linkedin.com/in/bhargav-reddy-6369b732b/", email: "Bhargavreddy9t@gmail.com" },
  { id: 8,  name: "Yashashwini",      role: "Event Manager",        image: "/images/team/Testimony_PIcs/Yeshashwini.jpeg", linkedin: "https://www.linkedin.com/in/yashaswini-kande-9bb582310/", email: "yashaswinikande@gmail.com" },
  { id: 9,  name: "Harshith",         role: "PR Lead",              image: "/images/team/Testimony_PIcs/Harshith.jpeg", linkedin: "https://www.linkedin.com/in/harshith-godishela/", email: "harshithreddygodishela@gmail.com" },
  { id: 10, name: "Nikhil Surya",      role: "Social Media Manager", image: "/images/team/Testimony_PIcs/NikhilSurya.jpeg", linkedin: "", email: "nikhilsurya.839@gmail.com" },
  { id: 11, name: "Kranthi",          role: "Lead Co-ordinator",    image: "/images/team/Testimony_PIcs/KranthiAnna.jpeg", linkedin: "https://www.linkedin.com/in/kristipati-kranthi-chaitanya-reddy-6a168b330/", email: "4638kranthichaitanyareddy123@gmail.com" },
];

const CARD_W  = 220;
const GAP     = 16;
const UNIT    = CARD_W + GAP;
const TRACK_W = UNIT * CORE_TEAM.length;   // width of one set
const SPEED   = 72;                         // px/s auto-scroll

const TRIPLED = [...CORE_TEAM, ...CORE_TEAM, ...CORE_TEAM];

// ── 3-D tilt card ─────────────────────────────────────────────────────────────
interface MemberCardProps {
  member: typeof CORE_TEAM[0];
  carouselDragging: boolean;
}

function MemberCard({ member, carouselDragging }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX    = useMotionValue(0);
  const rotY    = useMotionValue(0);
  const glowX   = useMotionValue(50);
  const glowY   = useMotionValue(50);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (carouselDragging) return;          // don't tilt while dragging the track
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rotY.set(((e.clientX - r.left) / r.width  - 0.5) *  14);
    rotX.set(((e.clientY - r.top)  / r.height - 0.5) * -10);
    glowX.set(((e.clientX - r.left) / r.width)  * 100);
    glowY.set(((e.clientY - r.top)  / r.height) * 100);
  };

  const handleLeave = () => {
    animate(rotX,  0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(rotY,  0, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(glowX, 50, { duration: 0.5 });
    animate(glowY, 50, { duration: 0.5 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: carouselDragging ? 0 : rotX,
        rotateY: carouselDragging ? 0 : rotY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        pointerEvents: carouselDragging ? "none" : "auto",
      }}
      whileHover={carouselDragging ? {} : { scale: 1.08, zIndex: 20 }}
      transition={{ scale: { type: "spring", stiffness: 320, damping: 22 } }}
      className="group flex-none w-[220px] rounded-3xl bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/5 p-6 flex flex-col items-center relative overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Radial follow-glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(16,185,129,0.25) 0%, transparent 70%)`,
        }}
      />
      {/* Hover border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-emerald-500/60 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300" />

      {/* Photo */}
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden mb-5 border-2 border-white/10 group-hover:border-emerald-500 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 shadow-md"
        style={{ transform: "translateZ(20px)" }}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          draggable={false}
          className={`object-cover ${member.imageClass ?? "object-top"}`}
        />
      </div>

      <h3
        className="text-sm font-semibold text-zinc-900 dark:text-white text-center tracking-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300"
        style={{ transform: "translateZ(14px)" }}
      >
        {member.name}
      </h3>
      <p
        className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.12em] text-center mb-6 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors duration-300"
        style={{ transform: "translateZ(10px)" }}
      >
        {member.role}
      </p>

      <div 
        className="mt-auto flex gap-3"
        style={{ transform: "translateZ(18px)" }}
      >
        {member.linkedin ? (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn for ${member.name}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-[#0A66C2]/10 dark:hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/30 dark:hover:border-[#0A66C2]/40 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-all duration-300 shadow-sm dark:shadow-none"
          >
            <Linkedin size={14} />
          </a>
        ) : null}
        
        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email for ${member.name}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 hover:border-emerald-500/30 dark:hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 shadow-sm dark:shadow-none"
          >
            <Mail size={14} />
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}

// ── normalise x into the middle-copy window ────────────────────────────────────
function normalise(val: number): number {
  let v = val;
  while (v >  0)              v -= TRACK_W;
  while (v <= -TRACK_W * 2)  v += TRACK_W;
  return v;
}

// ── Main carousel ─────────────────────────────────────────────────────────────
export default function CoreTeamCarousel() {
  const x            = useMotionValue(-TRACK_W);     // start at the middle copy
  const dragging     = useRef(false);
  const [paused, setPaused]       = useState(false);
  const [isDragging, setIsDragging] = useState(false); // for card tilt disable

  // Auto-scroll every frame
  useAnimationFrame((_, delta) => {
    if (dragging.current || paused) return;
    x.set(normalise(x.get() - (delta / 1000) * SPEED));
  });

  // Wheel / trackpad horizontal scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    x.set(normalise(x.get() - delta));
  }, [x]);

  const onDragStart = () => { dragging.current = true; setIsDragging(true); };
  const onDragEnd   = () => {
    x.set(normalise(x.get()));
    dragging.current = false;
    setIsDragging(false);
  };

  return (
    <section className="py-24 bg-transparent overflow-hidden select-none">
      <div className="container mx-auto px-6 max-w-7xl mb-14">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 mb-4">
          The people
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Meet our core team
        </h2>
        <p className="text-zinc-500 text-sm mt-2">
          Drag, scroll, or hover to explore
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white dark:from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white dark:from-[#050505] to-transparent" />

        {/* Track container */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => { setPaused(false); }}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="flex gap-4 w-max py-6"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -TRACK_W * 3, right: TRACK_W }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            {TRIPLED.map((member, i) => (
              <MemberCard
                key={`${member.id}-${i}`}
                member={member}
                carouselDragging={isDragging}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
