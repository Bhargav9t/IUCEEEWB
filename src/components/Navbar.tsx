"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/",        label: "Home" },
    { href: "/about",   label: "About" },
    { href: "/team",    label: "Our Team" },
    { href: "/events",  label: "Upcoming Events" },
    { href: "/projects", label: "Projects" },
    { href: "/history", label: "Our Journey" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ${montserrat.className}`}
      >
        <div 
          className={`
            pointer-events-auto flex items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isScrolled 
              ? "w-[98%] md:w-[95%] lg:max-w-[64rem] h-[60px] mt-4 bg-emerald-500/[0.06] dark:bg-emerald-500/10 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.08] rounded-full shadow-md px-6" 
              : "w-full h-20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] backdrop-blur-md border-b border-black/[0.05] dark:border-white/[0.08] px-6 md:px-12"
            }
          `}
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group z-20 shrink-0 relative">
            {/* Soft radial gradient behind the entire logo area for primary focus */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-16 bg-[radial-gradient(circle_at_center,theme(colors.emerald.500/0.10),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,theme(colors.emerald.400/0.20),transparent_70%)] blur-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Left Logo (Secondary/Supporting Identity) */}
            <div className={`relative shrink-0 overflow-hidden rounded-full transition-all duration-300 bg-white opacity-80 grayscale-[30%] group-hover:grayscale-[10%] group-hover:opacity-90 ${isScrolled ? "w-8 h-8" : "w-10 h-10"}`}>
              <Image 
                src="/images/logos/IUCEEEWBHITAM.webp" 
                alt="IUCEE EWB HITAM Logo" 
                fill 
                className="object-cover"
                sizes="40px"
              />
            </div>
            
            {/* Right Logo (Primary Focus) */}
            <span className={`relative z-10 font-black origin-left tracking-tight transition-all duration-300 scale-105 group-hover:scale-[1.08] drop-shadow-[0_0_6px_rgba(16,185,129,0.15)] dark:drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 pb-0.5 ${isScrolled ? "text-sm sm:text-[15px]" : "text-sm sm:text-[1.1rem]"}`}>
              IUCEE EWB HITAM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 md:gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-1.5 text-[13px] rounded-full flex items-center transition-all duration-300 ease-out
                    ${isActive ? "font-bold text-emerald-700 dark:text-emerald-400" : "font-semibold opacity-80 text-zinc-800 dark:text-zinc-200 hover:opacity-100 hover:-translate-y-[1px]"}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-4 z-20">
            <ThemeToggle />


            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center p-2 text-zinc-900 rounded-full transition-colors focus:outline-none dark:text-zinc-100"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl pt-24 pb-6 px-6 md:hidden flex flex-col pointer-events-auto dark:bg-[#050505]/95"
          >
            <div className="flex flex-col gap-4 mt-8 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    className={`block text-3xl font-bold py-4 border-b border-zinc-100 dark:border-white/10 transition-colors ${
                      pathname === link.href ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
