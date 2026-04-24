"use client";
import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Lightbulb, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Discover",
    description: "We deep-dive into your brand, goals, and audience to craft a digital strategy that converts.",
    color: "#f59e0b",
  },
  {
    icon: PenTool,
    title: "Design",
    description: "Cinematic mockups and interactive prototypes — you'll see the magic before a single line of code.",
    color: "#8b5cf6",
  },
  {
    icon: Code2,
    title: "Build",
    description: "Pixel-perfect development with clean code, blazing performance, and animations that impress.",
    color: "#00d4ff",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "We deploy, optimize, and hand over your digital empire — ready to grow from day one.",
    color: "#10b981",
  },
];

function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useTransform(my, [0, 1], [15, -15]);
  const rotY = useTransform(mx, [0, 1], [-15, 15]);
  const sRotX = useSpring(rotX, { stiffness: 400, damping: 30 });
  const sRotY = useSpring(rotY, { stiffness: 400, damping: 30 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - left) / width);
    my.set((e.clientY - top) / height);
  }, [mx, my]);

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center text-center group"
      style={{ perspective: 1000 }}
    >
      <div className="text-[11px] font-bold tracking-widest text-slate-500 mb-4 uppercase transition-colors group-hover:text-white">
        Step {String(index + 1).padStart(2, "0")}
      </div>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          transformStyle: "preserve-3d",
        }}
        className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 relative cursor-none"
      >
        <div 
          className="absolute inset-0 rounded-3xl transition-all duration-300"
          style={{
            background: hovered ? `${step.color}25` : `${step.color}12`,
            border: `1px solid ${hovered ? step.color : step.color + '30'}`,
            boxShadow: hovered ? `0 0 60px ${step.color}40` : `0 0 40px ${step.color}10`,
            transform: hovered ? "translateZ(-10px)" : "translateZ(0px)",
          }}
        />

        <motion.div style={{ transform: "translateZ(30px)" }}>
          <Icon size={40} style={{ color: step.color }} />
        </motion.div>

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: `1px solid ${step.color}` }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: [0, 0.4, 0], scale: [0.8, 1.3, 1.5] }}
          viewport={{ once: false }}
          transition={{ delay: index * 0.3, duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
        />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-3 transition-transform group-hover:-translate-y-1">{step.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-[260px] transition-transform group-hover:-translate-y-1">{step.description}</p>
    </motion.div>
  );
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="about" className="relative py-28 px-6 overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 30% at 50% 100%, rgba(139,92,246,0.05) 0%, transparent 70%)"
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <SectionLabel text="Our Process" accent="#f59e0b" />
          <ScrollReveal>
            <h2 className="section-heading text-white mb-4">
              How We{" "}
              <span className="text-gradient">Build Empires</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-sub max-w-lg mx-auto">
              A proven 4-step process that takes your idea from concept to a
              high-converting digital experience.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative">
          {/* Animated Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[85px] left-[10%] right-[10%] h-px bg-white/10">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-500"
              style={{ width: lineWidth }}
            />
            
            {/* Moving light particle on line */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_4px_rgba(255,255,255,0.5)]"
              style={{ 
                left: useTransform(lineWidth, (v) => `calc(${v} - 8px)`),
                opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
