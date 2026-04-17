"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flag, Zap, Factory, Code, BookOpen, Rocket, FileText, 
  Lightbulb, Upload, Brain, School, Leaf, Globe, 
  Wrench, Trophy, Sprout, Medal, Cpu, Droplets, PartyPopper, Hourglass, Users, X
} from "lucide-react";
import RightSideGrid from "./RightSideGrid";
import { MaskedAvatars } from "@/components/ui/masked-avatars";

const FIRST_TEAM_AVATARS = [
  { avatar: "/images/first-team/aashish.jpg", name: "Aashish" },
  { avatar: "/images/first-team/bhargav.jpg", name: "Bhargav" },
  { avatar: "/images/first-team/nagarjuna.jpg", name: "Nagarjuna" },
  { avatar: "/images/first-team/pranay.jpg", name: "Pranay" },
  { avatar: "/images/first-team/purna.jpg", name: "Purna" },
];


const timelineEvents = [
  {
    id: "01", date: "AUG 2019", title: "THE BEGINNING",
    desc: "Chapter established as a non-profit for community engineering.",
    icon: Flag
  },
  {
    id: "founder", date: "2019", title: "THE FIRST TEAM",
    desc: "The founding members and pioneers who laid the core foundation.",
    icon: Users,
    link: "/history/first-team"
  },
  {
    id: "02", date: "NOV 8-9, 2024", title: "INNOFIESTA 2024",
    desc: "Flagship multidisciplinary fest at HITAM.",
    icon: Zap
  },
  {
    id: "03", date: "MAR 29, 2025", title: "AKSHAYA PATRA VISIT",
    desc: "Industrial visit to the world's largest automated NGO kitchen.",
    icon: Factory
  },
  {
    id: "04", date: "MAY 9-10, 2025", title: "HACK YOUR PATH 6.0",
    desc: "24-hour hackathon with 60 interdisciplinary teams.",
    icon: Code
  },
  {
    id: "05", date: "MAY 27, 2025", title: "RESEARCH WRITING WORKSHOP",
    desc: "Training on paper structure and citation practices.",
    icon: BookOpen
  },
  {
    id: "06", date: "JULY 11-13, 2025", title: "AUNSF 3.0",
    desc: "Participation in Aeronox and Ignova domains at Anurag University.",
    icon: Rocket
  },
  {
    id: "07", date: "JULY 25, 2025", title: "INTRODUCTION TO ICTIEE",
    desc: "Session on academic research publication culture.",
    icon: FileText
  },
  {
    id: "08", date: "JULY 26 & 28, 2025", title: "DT PROJECT EXPO I",
    desc: "Showcasing prototypes developed through Design Thinking.",
    icon: Lightbulb
  },
  {
    id: "09", date: "AUG 31, 2025", title: "ICTIEE SUBMISSIONS",
    desc: "4 research papers submitted on GenAI, AR, and Gamification.",
    icon: Upload
  },
  {
    id: "10", date: "SEP 5, 2025", title: "THINKSPRINT IDEATHON",
    desc: "SDG-focused ideathon involving 7 pitching teams.",
    icon: Brain
  },
  {
    id: "11", date: "OCT 25, 2025", title: "SCHOOL VISITS",
    desc: "Needs assessment at Krushi Home and ZPHS Gowdavelly.",
    icon: School
  },
  {
    id: "12", date: "OCT 31, 2025", title: "AKSHAYAKALPA FARM VISIT",
    desc: "Exploration of tech integration in organic farming.",
    icon: Leaf
  },
  {
    id: "13", date: "DEC 9, 2025", title: "MR. PETER INTERACTION",
    desc: "Session with ED of EWB East Africa on humanitarian engineering.",
    icon: Globe
  },
  {
    id: "14", date: "DEC 19-20, 2025", title: "DT PROJECT EXPO II",
    desc: "Platform for human-centered solutions addressing real-world problems.",
    icon: Wrench
  },
  {
    id: "15", date: "JAN 7-10, 2026", title: "ICTIEE 2026 AWARD",
    desc: "Won the Student Chapter Award at the national conference.",
    icon: Trophy
  },
  {
    id: "16", date: "JAN 15, 2026", title: "IASF MENTORSHIP",
    desc: "AI Crop Disease & Waste Mgmt projects selected for elite mentorship.",
    icon: Sprout
  },
  {
    id: "17", date: "JAN 20, 2026", title: "EDUAITHON TOP 15",
    desc: "Team Label2Learn ranked among the top 15 teams nationally.",
    icon: Medal
  },
  {
    id: "18", date: "JAN 28-29, 2026", title: "INNOFIESTA 2026",
    desc: "Innovation event featuring Reverse Engineering challenges.",
    icon: Cpu
  },
  {
    id: "19", date: "FEB 2026", title: "RO PLANT INSTALLATION",
    desc: "Implementation of safe drinking water infrastructure at ZPHS Gowdavelly.",
    icon: Droplets
  },
  {
    id: "present-team", date: "2026", title: "PRESENT TEAM",
    desc: "Meet the current members driving our chapter's mission forward.",
    icon: Users,
    link: "/team"
  },
  {
    id: "20", date: "APR 10, 2026", title: "IGNITE 2026",
    desc: "Welcoming the incoming batch to the chapter.",
    icon: PartyPopper,
    image: "/images/events/Ignite.jpeg"
  },
  {
    id: "22", date: "APR 15, 2026", title: "HELPING HEARTS NGO VISIT",
    desc: "A visit to Helping Hearts NGO.",
    icon: Users,
    image: "/images/events/NGOvisit%231.jpeg"
  },
  {
    id: "21", date: "FUTURE", title: "TO BE CONTINUED...",
    desc: "Our journey of impact and innovation never stops.",
    icon: Hourglass
  },
];

export default function SnakeTimeline() {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generatePath = () => {
    const numItems = timelineEvents.length;
    const numRows = Math.ceil(numItems / 4);
    let path = "M 200 250";
    
    for (let r = 0; r < numRows; r++) {
      const y = 250 + r * 400;
      const isEven = r % 2 === 0;
      const itemsInRow = (r === numRows - 1) ? (numItems - r * 4) : 4;
      
      if (isEven) {
        const endX = 200 + (itemsInRow - 1) * 266.66;
        if (r === numRows - 1) {
           path += ` L ${endX} ${y}`;
        } else {
           path += ` L 1000 ${y} A 200 200 0 0 1 1000 ${y + 400}`;
        }
      } else {
        const endX = 1000 - (itemsInRow - 1) * 266.66;
        if (r === numRows - 1) {
           path += ` L ${endX} ${y}`;
        } else {
           path += ` L 200 ${y} A 200 200 0 0 0 200 ${y + 400}`;
        }
      }
    }
    return path;
  };

  const dynamicPath = generatePath();
  const svgHeight = Math.max(1000, Math.ceil(timelineEvents.length / 4) * 400 + 400);

  const cssContent = `
    @keyframes cyberSnakeStreak {
      0% { stroke-dashoffset: 4000; }
      100% { stroke-dashoffset: 0; }
    }
    .cyber-snake-path {
      animation: cyberSnakeStreak 15s linear infinite;
    }
    @keyframes verticalStreakCyber {
      0% { top: -10%; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .animate-vertical-streak {
      animation: verticalStreakCyber 4s linear infinite;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none; 
      scrollbar-width: none; 
    }
  `;

  return (
    <section className="relative w-full bg-zinc-50 overflow-hidden py-24 font-sans mx-auto dark:bg-[#050505]">
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />
      
      {/* Perspective Grid Background */}
      <RightSideGrid />

      {/* Content wrapper with pointer-events-none to let hover through to background */}
      <div className="relative z-20 pointer-events-none h-full w-full">

      {/* Header */}
      <div className="relative z-10 text-center mb-16 px-4">
         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white uppercase drop-shadow-sm mb-4"
         >
           Our <span className="text-emerald-500">Journey</span>
         </motion.h2>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="text-emerald-500/80 font-bold tracking-[0.3em] uppercase text-sm md:text-base drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
         >
           Tracing the footprints of impact
         </motion.p>
      </div>

      <div className="relative z-10 w-full px-4 lg:px-8 max-w-[1600px] mx-auto">
        
        {/* Desktop View: Multi-row Vertical Winding SVG Map */}
        <div className="hidden lg:block relative w-full overflow-x-auto hide-scrollbar pb-24">
          <div 
            className="relative w-[1200px] min-w-[1200px] mx-auto mt-16"
            style={{ height: `${svgHeight}px` }}
          >
            
            {/* Base Static Track & Glowing Animated Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox={`0 0 1200 ${svgHeight}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <filter id="neonGlowCyber" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                
                {/* Track Ghost Line */}
                <path 
                  d={dynamicPath}
                  stroke="rgba(16, 185, 129, 0.15)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Flowing Laser Line */}
                {mounted && (
                  <path 
                    d={dynamicPath}
                    stroke="url(#cyberGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#neonGlowCyber)"
                    className="cyber-snake-path"
                    strokeDasharray="150 4000"
                  />
                )}
              </svg>
            </div>

            {/* Interactive Nodes and Glass Cards */}
            {timelineEvents.map((event, index) => {
              const r = Math.floor(index / 4);
              const c = index % 4;
              const y = 250 + r * 400;
              const x = r % 2 === 0 ? 200 + c * 266.66 : 1000 - c * 266.66;
              const col_idx = Math.round((x - 200) / 266.66);
              // Cards alternate strictly by column to guarantee no vertical overlapping
              const align = col_idx % 2 === 0 ? "top" : "bottom";
              
              const isCompleted = index < timelineEvents.length - 1;
              const theme = isCompleted ? {
                 nodeBorder: "border-emerald-500 shadow-[0_0_15px_#10b981]",
                 nodeInner: "bg-emerald-300",
                 cardHover: "group-hover:border-emerald-500/50 group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)] dark:hover:border-emerald-500/50",
                 tetherTop: "to-emerald-500/50",
                 tetherBottom: "from-emerald-500/50",
                 iconBg: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400",
                 dateText: "text-emerald-500/90",
                 titleHover: "group-hover:text-emerald-400"
              } : {
                 nodeBorder: "border-cyan-500 shadow-[0_0_15px_#06b6d4]",
                 nodeInner: "bg-cyan-400",
                 cardHover: "group-hover:border-cyan-500/50 group-hover:shadow-[0_4px_20px_rgba(6,182,212,0.1)] dark:hover:border-cyan-500/50",
                 tetherTop: "to-cyan-500/50",
                 tetherBottom: "from-cyan-500/50",
                 iconBg: "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20 group-hover:text-cyan-400",
                 dateText: "text-cyan-500/90",
                 titleHover: "group-hover:text-cyan-400"
              };
              
              return (
                <motion.div
                  key={event.id}
                  className="absolute flex items-center justify-center group z-10 pointer-events-auto"
                  style={{
                    top: `${y}px`,
                    left: `${x}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.4, delay: c * 0.15 }}
                >
                  {/* Anchor Center */}
                  <div className="absolute w-0 h-0" style={{ transform: 'translate(-50%, -50%)' }}>
                     {/* Glowing Pulse Node */}
                     <div className={`relative w-7 h-7 rounded-full bg-white border-[3px] ${theme.nodeBorder} group-hover:scale-125 transition-transform duration-300 z-30 flex items-center justify-center cursor-pointer animate-pulse mx-auto`}>
                        <div className={`w-2 h-2 rounded-full ${theme.nodeInner} group-hover:bg-white transition-colors`} />
                     </div>

                     {/* Glassmorphism Data Card */}
                     <div 
                       onClick={() => {
                         if ("link" in event && event.link) window.open((event as any).link, "_blank");
                         else if ("image" in event && event.image) setSelectedImage((event as any).image);
                       }}
                       className={`absolute w-[260px] h-auto min-h-[160px] p-5 bg-white border border-zinc-200 rounded-2xl shadow-md transition-all duration-300 group-hover:-translate-y-1 ${theme.cardHover} dark:bg-[#0a0a0a] dark:border-white/10 flex flex-col items-start z-40 origin-center left-1/2 -translate-x-1/2 ${
                         align === 'top' ? 'bottom-full mb-6' : 'top-full mt-6'
                       } ${("link" in event && event.link) || ("image" in event && event.image) ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
                     >
                        {/* Connection Tether */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-[2px] h-6 bg-gradient-to-b ${
                          align === 'top' ? `from-transparent ${theme.tetherTop} -bottom-6` : `${theme.tetherBottom} to-transparent -top-6`
                        }`} />

                        {event.id === "founder" && (
                          <div className="mb-4">
                            <MaskedAvatars avatars={FIRST_TEAM_AVATARS} />
                          </div>
                        )}

                        <div className="flex items-start space-x-3 mb-3 w-full shrink-0">
                          <span className={`p-2 rounded-lg transition-colors shrink-0 ${theme.iconBg}`}>
                            <event.icon size={20} strokeWidth={2.5} />
                          </span>
                          <span className={`${theme.dateText} font-mono text-[11px] tracking-widest font-semibold drop-shadow-sm pt-2`}>{event.date}</span>
                        </div>
                        <h3 className={`text-zinc-900 font-bold text-base leading-tight mb-2 uppercase transition-colors dark:text-white shrink-0 line-clamp-2 w-full ${theme.titleHover}`}>{event.title}</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed dark:text-zinc-400 w-full overflow-hidden line-clamp-3">{event.desc}</p>
                     </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile/Tablet View: Vertical Scroll Architecture */}
        <div className="block lg:hidden relative w-full pt-10 pb-20 px-2 sm:px-6">
          <div className="absolute left-[36px] sm:left-[48px] top-10 bottom-20 w-[4px] bg-emerald-500/20 rounded-full">
            <div className="absolute top-0 left-0 w-full h-[150px] bg-emerald-500 blur-[2px] animate-vertical-streak rounded-full" />
          </div>

          <div className="flex flex-col space-y-10 relative z-10 w-full">
                {timelineEvents.map((event, index) => {
                  const isCompleted = index < timelineEvents.length - 1;
                  const theme = isCompleted ? {
                     nodeBorder: "border-emerald-500 shadow-[0_0_15px_#10b981]",
                     nodeInner: "bg-emerald-300",
                     cardHover: "hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:hover:border-emerald-500/30",
                     iconBg: "bg-emerald-500/10 text-emerald-500",
                     dateText: "text-emerald-500/90"
                  } : {
                     nodeBorder: "border-cyan-500 shadow-[0_0_15px_#06b6d4]",
                     nodeInner: "bg-cyan-400",
                     cardHover: "hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] dark:hover:border-cyan-500/30",
                     iconBg: "bg-cyan-500/10 text-cyan-500",
                     dateText: "text-cyan-500/90"
                  };

                  return (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="relative pl-[72px] sm:pl-[96px] pr-2 group pointer-events-auto"
                    >
                      {/* Node Target */}
                      <div className={`absolute left-[38px] sm:left-[50px] top-8 w-6 h-6 rounded-full bg-white border-[3px] ${theme.nodeBorder} animate-pulse flex items-center justify-center -translate-x-1/2 -translate-y-1/2`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${theme.nodeInner}`} />
                      </div>

                      {/* Mobile Glass Card */}
                      <div 
                        onClick={() => {
                          if ("link" in event && event.link) window.open((event as any).link, "_blank");
                          else if ("image" in event && event.image) setSelectedImage((event as any).image);
                        }}
                        className={`p-6 bg-white border border-zinc-200 rounded-2xl shadow-md transition-transform duration-300 hover:-translate-y-1 ${theme.cardHover} dark:bg-[#0a0a0a] dark:border-white/10 flex flex-col items-start w-full relative z-10 ${("link" in event && event.link) || ("image" in event && event.image) ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
                      >
                          {event.id === "founder" && (
                            <div className="mb-4">
                              <MaskedAvatars avatars={FIRST_TEAM_AVATARS} />
                            </div>
                          )}
                          <div className="flex items-start space-x-3 mb-3 w-full">
                             <span className={`p-2 rounded-lg shrink-0 ${theme.iconBg}`}>
                               <event.icon size={18} strokeWidth={2.5} />
                             </span>
                             <span className={`${theme.dateText} font-mono text-xs sm:text-sm tracking-widest font-semibold drop-shadow-sm pt-1`}>{event.date}</span>
                          </div>
                    <h3 className="text-zinc-900 font-bold text-lg leading-snug mb-2 uppercase dark:text-white">{event.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed dark:text-zinc-400">{event.desc}</p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>

      </div>


      </div>

      {/* Image Modal Popup */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="pointer-events-auto relative max-w-4xl max-h-[85vh] bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Header with Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {/* Image Content */}
                <div className="w-full h-full flex items-center justify-center overflow-hidden bg-zinc-100/50 dark:bg-black/50">
                  <img 
                    src={selectedImage} 
                    alt="Event popup" 
                    className="w-full max-h-[85vh] object-contain"
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </section>
  );
}
