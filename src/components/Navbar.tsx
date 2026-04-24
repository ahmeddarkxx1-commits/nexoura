"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionTemplate, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  
  // Mouse position for navbar glow effect
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll
      const sections = navLinks.map(link => link.href.substring(1));
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= (el.offsetTop - 200)) {
          current = section;
        }
      }
      setActiveTab(current);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 overflow-hidden group ${
          scrolled 
            ? "py-3 bg-[#020408]/60 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
            : "py-6 bg-transparent"
        }`}
      >
        {/* Cursor Glow Effect behind Navbar */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                rgba(139, 92, 246, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* Floating particles inside navbar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
           {[
             { left: "15%", duration: 5.2, delay: 0.5, xOffset: 12 },
             { left: "35%", duration: 4.1, delay: 1.2, xOffset: -18 },
             { left: "65%", duration: 6.5, delay: 0.1, xOffset: 22 },
             { left: "80%", duration: 4.8, delay: 1.8, xOffset: -15 },
             { left: "92%", duration: 5.9, delay: 0.8, xOffset: 8 },
           ].map((particle, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
               animate={{
                 y: [-10, 50],
                 x: [0, particle.xOffset, 0],
                 opacity: [0, 1, 0]
               }}
               transition={{
                 duration: particle.duration,
                 repeat: Infinity,
                 delay: particle.delay,
                 ease: "linear"
               }}
               style={{
                 left: particle.left,
                 top: "-10px"
               }}
             />
           ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center glow-purple relative"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-600 rounded-xl blur-md -z-10"
              />
              <Zap size={18} className="text-white relative z-10 drop-shadow-md" />
            </motion.div>
            <span className="text-xl font-black tracking-tight text-gradient">
              Nexoura
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.href.substring(1);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 group/link text-sm font-medium transition-colors"
                >
                  <motion.span 
                    className={`relative z-10 transition-colors duration-300 block ${isActive ? "text-white scale-105" : "text-slate-400 group-hover/link:text-white group-hover/link:scale-105"}`}
                  >
                    {link.label}
                  </motion.span>
                  
                  {/* Hover effect background */}
                  <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 -z-10" />

                  {/* Underline grow from center */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 ease-out ${isActive ? "w-4/5 opacity-100" : "w-0 opacity-0 group-hover/link:w-4/5 group-hover/link:opacity-100"}`} />
                  
                  {/* Glow under active item */}
                  {isActive && (
                     <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[8px] bg-cyan-400/30 blur-[6px]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="#contact">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group/btn px-6 py-2.5 rounded-full overflow-hidden font-semibold text-sm text-white border-0"
              >
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 transition-transform duration-300 group-hover/btn:scale-105" />
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent transition-opacity duration-500" />
                
                {/* Border glow */}
                <div className="absolute inset-[-2px] bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full blur-md opacity-40 group-hover/btn:opacity-80 transition-opacity duration-300 -z-10" />
                
                <span className="relative flex items-center gap-2">
                  <Zap size={14} className="text-cyan-200" />
                  Start Project
                </span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-[110] w-10 h-10 rounded-full glass flex items-center justify-center text-slate-200 hover:text-white transition-colors"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] bg-[#020408]/80 flex flex-col items-center justify-center"
          >
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-[80px]" />
            
            <nav className="flex flex-col items-center gap-8 w-full px-6 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl font-bold text-slate-300 hover:text-white transition-colors relative group block"
                  >
                    {link.label}
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8 w-full max-w-xs"
              >
                <Link
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="w-full relative group/mobbtn px-6 py-4 rounded-2xl overflow-hidden font-bold text-white block text-center"
                >
                  {/* Background layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600" />
                  <div className="absolute inset-[-2px] bg-gradient-to-r from-cyan-400 to-violet-500 rounded-2xl blur-lg opacity-60 group-hover/mobbtn:opacity-100 transition-opacity duration-300 -z-10" />
                  <span className="relative">Start Your Project</span>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
