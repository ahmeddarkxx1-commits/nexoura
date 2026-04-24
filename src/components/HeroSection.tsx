"use client";
import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { ArrowRight, Code2, Globe, Layers, Sparkles, Star, Zap } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const LAYERS = { far: 0.012, mid: 0.028, near: 0.05, close: 0.075 };

/* ─── Floating UI elements ─── */
function StatBadge({ value, label, gradient, style, delay = 0 }: {
  value: string; label: string; gradient: string; style?: React.CSSProperties; delay?: number;
}) {
  return (
    <motion.div
      className="absolute glass-card rounded-2xl p-3 text-center select-none pointer-events-none"
      style={{ minWidth: 100, ...style }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-xl font-black mb-0.5" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {value}
      </div>
      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

function CodeCard({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute glass-card rounded-xl p-4 font-mono text-xs select-none pointer-events-none"
      style={{ width: 200, ...style }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 1 }}
    >
      <div className="flex gap-1.5 mb-3">
        <div className="w-2 h-2 rounded-full bg-rose-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
      </div>
      <p><span className="text-violet-400">const</span> <span className="text-cyan-300">build</span> <span className="text-slate-400">=</span> <span className="text-orange-300">&apos;premium&apos;</span></p>
      <p className="mt-1"><span className="text-violet-400">const</span> <span className="text-cyan-300">convert</span> <span className="text-slate-400">=</span> <span className="text-emerald-400">true</span></p>
    </motion.div>
  );
}

function NotifCard({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute glass-card rounded-2xl p-3 flex items-center gap-3 select-none pointer-events-none"
      style={{ width: 210, ...style }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
        <Star size={14} fill="white" className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-white">New Order!</p>
        <p className="text-xs text-slate-400 truncate">LuxeCart Pro — $299</p>
      </div>
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
    </motion.div>
  );
}

function TechPill({ icon: Icon, label, style, delay = 0 }: {
  icon: any; label: string; style?: React.CSSProperties; delay?: number;
}) {
  return (
    <motion.div
      className="absolute glass-card rounded-xl px-3 py-2 flex items-center gap-2 select-none pointer-events-none"
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.7 }}
    >
      <Icon size={13} className="text-cyan-400" />
      <span className="text-xs text-slate-300 font-medium">{label}</span>
    </motion.div>
  );
}

function AvatarRow({ style }: { style?: React.CSSProperties }) {
  const g = ["from-violet-500 to-purple-700", "from-cyan-500 to-blue-600", "from-rose-500 to-pink-600", "from-amber-500 to-orange-600"];
  return (
    <motion.div
      className="absolute glass-card rounded-2xl p-3 flex items-center gap-3 select-none pointer-events-none"
      style={style}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.1, duration: 0.8 }}
    >
      <div className="flex -space-x-2">
        {g.map((gr, i) => (
          <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${gr} border-2 border-[#0d1117] flex items-center justify-center text-[8px] font-bold text-white`}>
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-white">+48 clients</p>
        <div className="flex gap-0.5 mt-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} size={7} fill="#f59e0b" className="text-amber-400" />)}
        </div>
      </div>
    </motion.div>
  );
}

function MagneticWord({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 200 });
  const sy = useSpring(y, { damping: 15, stiffness: 200 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.1);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.1);
  }, [x, y]);

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

export default function HeroSection() {

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 250 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 250 });

  const farX   = useTransform(smoothX, v => v * LAYERS.far);
  const farY   = useTransform(smoothY, v => v * LAYERS.far);
  const midX   = useTransform(smoothX, v => v * LAYERS.mid);
  const midY   = useTransform(smoothY, v => v * LAYERS.mid);
  const nearX  = useTransform(smoothX, v => v * LAYERS.near);
  const nearY  = useTransform(smoothY, v => v * LAYERS.near);
  const closeX = useTransform(smoothX, v => v * LAYERS.close);
  const closeY = useTransform(smoothY, v => v * LAYERS.close);
  const gridX  = useTransform(smoothX, v => v * 0.02);
  const gridY  = useTransform(smoothY, v => v * 0.02);

  // Optimized transforms for the glowing background spots (GPU-based, no re-renders)
  const spot1X = useTransform(smoothX, v => v * 0.02);
  const spot1Y = useTransform(smoothY, v => v * 0.02);
  const spot2X = useTransform(smoothX, v => -v * 0.015);
  const spot2Y = useTransform(smoothY, v => -v * 0.015);

  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, -80]);
  const titleOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#020408" }}>

      {/* Three.js canvas — full bleed behind everything */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Reactive mesh background */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ x: gridX, y: gridY }}>
        <motion.div className="absolute rounded-full" style={{
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)",
          left: -200, top: -250,
          x: spot1X, y: spot1Y,
        }} />
        <motion.div className="absolute rounded-full" style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%)",
          right: -100, bottom: -50,
          x: spot2X, y: spot2Y,
        }} />
        {/* Grid */}
        <motion.div className="absolute inset-0"
          animate={{ backgroundPosition: ["0px 0px", "70px 70px"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)`,
            backgroundSize: "70px 70px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 100%)",
        }} />
        {/* Floating Particles */}
        {mounted && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
        {/* Scanline */}
        <div className="absolute left-0 right-0 h-px opacity-20" style={{
          background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.8), transparent)",
          animation: "scan-line 8s linear infinite",
        }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,4,8,0.7) 100%)"
        }} />
      </motion.div>

      {/* Layer FAR */}
      <motion.div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ x: farX, y: farY }}>
        <StatBadge value="150+" label="Projects" gradient="linear-gradient(135deg,#00d4ff,#3b82f6)" style={{ top: "18%", left: "5%" }} delay={0.8} />
        <TechPill icon={Globe} label="Next.js 15" style={{ bottom: "28%", left: "4%" }} delay={1.9} />
      </motion.div>

      {/* Layer MID */}
      <motion.div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ x: midX, y: midY }}>
        <CodeCard style={{ top: "22%", left: "3%" }} />
        <AvatarRow style={{ bottom: "22%", right: "5%" }} />
      </motion.div>

      {/* Layer NEAR */}
      <motion.div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ x: nearX, y: nearY }}>
        <NotifCard style={{ top: "18%", right: "4%" }} />
        <StatBadge value="$2M+" label="Revenue" gradient="linear-gradient(135deg,#8b5cf6,#ec4899)" style={{ bottom: "26%", left: "6%" }} delay={1.3} />
        <TechPill icon={Layers} label="Framer Motion" style={{ top: "40%", right: "3%" }} delay={2.3} />
      </motion.div>

      {/* Layer CLOSE */}
      <motion.div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ x: closeX, y: closeY }}>
        <StatBadge value="98%" label="Satisfaction" gradient="linear-gradient(135deg,#10b981,#06b6d4)" style={{ top: "62%", right: "5%" }} delay={1} />
        <TechPill icon={Code2} label="TypeScript" style={{ top: "74%", left: "3%" }} delay={2.6} />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-10"
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-[11px] text-cyan-300 font-semibold tracking-[0.2em] uppercase">Premium Digital Agency</span>
          <Sparkles size={11} className="text-violet-400" />
        </motion.div>

        {/* Staggered headline */}
        <h1 className="section-heading mb-6">
          {["Building Digital", "Experiences That Sell"].map((line, i) => (
            <div key={line} style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <MagneticWord>
                  <span className={i === 0 ? "block text-white" : "block text-gradient"}>{line}</span>
                </MagneticWord>
              </motion.div>
            </div>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="section-sub max-w-xl mx-auto mb-10"
        >
          Websites, Apps, and Ready-Made Solutions crafted for brands that demand the extraordinary.
          We don&apos;t build websites — we build digital empires.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#projects" className="btn-primary group flex items-center gap-2">
            <span>View Projects</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a href="#contact" className="btn-secondary flex items-center gap-2">
            <Zap size={14} className="text-cyan-400" />
            Start Your Project
          </a>
        </motion.div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-20 w-80 h-20 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(20px)" }} />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-violet-500/60 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}
