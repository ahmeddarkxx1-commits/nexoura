"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { stats } from "@/lib/data";

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative glass-card rounded-[2.5rem] p-10 md:p-14 overflow-hidden border border-white/10"
        >
          {/* Spotlight follow effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.15), transparent 60%)`,
            }}
          />

          {/* Grid background inside card */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="text-center group"
              >
                <motion.div 
                  className="text-4xl md:text-6xl font-black mb-3 inline-block relative"
                  whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
                >
                  <span className="text-gradient drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <AnimatedCounter target={stat.value} duration={2.5} />
                  </span>
                  
                  {/* Subtle float behind number */}
                  <motion.div 
                    className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full z-[-1]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                </motion.div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-3 group-hover:w-24 group-hover:via-violet-500 transition-all duration-500" />
                  <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
