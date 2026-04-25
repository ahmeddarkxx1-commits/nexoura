"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Check, X, Sparkles, Zap } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import axios from "axios";

const ROT = 12; // Max tilt degrees

function ServiceCard({ service, index }: { service: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [glow, setGlow] = useState({ x: 0, y: 0 });

  const accentColor = service.isPopular ? "#8b5cf6" : "#00d4ff";

  /* ── 3D tilt ── */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useTransform(my, [0, 1], [ROT, -ROT]);
  const rotY = useTransform(mx, [0, 1], [-ROT, ROT]);
  const sRotX = useSpring(rotX, { stiffness: 350, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 350, damping: 28 });

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      mx.set((e.clientX - left) / width);
      my.set((e.clientY - top) / height);
      setGlow({ x: e.clientX - left, y: e.clientY - top });
    },
    [mx, my]
  );

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className={service.isPopular ? "lg:-mt-6 lg:mb-6" : ""} // Staggered emphasis
    >
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
        className={`relative h-full rounded-3xl p-8 flex flex-col cursor-none select-none ${
          service.isPopular ? "ring-1 ring-violet-500/50" : "glass-card"
        }`}
      >
        {/* Cursor glow (Softer) */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 z-0"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${glow.x}px ${glow.y}px, ${accentColor}10, transparent 70%)`,
          }}
        />

        {/* Base background for featured */}
        {service.isPopular && (
          <div className="absolute inset-0 rounded-3xl -z-10" style={{
            background: "linear-gradient(145deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))",
            backdropFilter: "blur(24px)",
          }} />
        )}

        {/* Content Container (Lifted on Z-axis) */}
        <div style={{ transform: "translateZ(15px)", zIndex: 10 }} className="flex flex-col h-full">
          {/* Featured badge */}
          {service.isPopular && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <motion.div 
                animate={{ y: hovered ? -2 : 0 }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-violet-500/30"
              >
                <Sparkles size={10} />
                Most Popular
              </motion.div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg transition-transform duration-500"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                boxShadow: `0 10px 20px -5px ${accentColor}33`,
                transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1)",
              }}
            >
              {index + 1}
            </div>
            {service.isPopular && (
              <Zap size={24} className="text-violet-400 opacity-50" />
            )}
          </div>

          <h3 className="text-2xl font-black text-white mb-1">{service.name}</h3>
          <p className="text-sm text-slate-400 mb-3">{service.description}</p>
          <div className="text-3xl font-black text-gradient mb-6">${service.price.toLocaleString()}</div>

          <div
            className="w-full h-px mb-6 rounded-full opacity-50"
            style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
          />

          <ul className="space-y-3 flex-1 mb-8">
            {service.features.map((f: string, i: number) => (
              <motion.li 
                key={f} 
                initial={false}
                animate={hovered ? { x: 5 } : { x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: accentColor }}
                >
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
                {f}
              </motion.li>
            ))}
          </ul>

          <a
            href="#contact"
            className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-400 ${
              service.isPopular
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 active:scale-95"
                : "glass text-white hover:bg-white/5 border border-white/10 active:scale-95"
            }`}
            style={{ transform: hovered ? "translateZ(10px)" : "none" }}
          >
            {service.buttonText || "Get Started"}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/plans?active=true");
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section
      id="services"
      className="relative py-28 px-6"
      style={{
        background: "radial-gradient(ellipse 50% 40% at 80% 50%, rgba(0,212,255,0.04) 0%, transparent 60%), #020408",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionLabel text="Services" accent="#00d4ff" />
          <ScrollReveal>
            <h2 className="section-heading text-white mb-4">
              Choose Your{" "}
              <span className="text-gradient">Growth Plan</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-sub max-w-xl mx-auto">
              From quick template edits to full custom builds — we have a plan for every ambition.
            </p>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-12">
            {plans.map((service, i) => {
              // Asymmetrical vertical offsets
              const offsets = ["lg:mt-0", "lg:-mt-12", "lg:mt-8"];
              const offsetClass = offsets[i % offsets.length];
              
              return (
                <div key={service._id} className={offsetClass}>
                  <ServiceCard service={service} index={i} />
                </div>
              );
            })}
            {plans.length === 0 && (
              <p className="col-span-full text-center py-20 text-slate-500">No active plans found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
