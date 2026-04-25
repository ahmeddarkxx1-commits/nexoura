"use client";
import { useState, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import type { Project } from "@/lib/types";

const ROT = 16; // max rotation degrees

export default function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: any;
  index: number;
  featured?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [glow, setGlow] = useState({ x: 0, y: 0 });

  // Default styling if not in DB
  const accentColor = "#0077b6"; 
  const gradient = "from-blue-600/20 to-cyan-600/20";
  const mainImage = project.images?.[0];
  const tags = project.techStack || [];
  const displayPrice = project.finalPrice || project.price;
  const hasDiscount = project.discount > 0;
  const projectId = project._id || project.id;

  /* ── 3D tilt ── */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useTransform(my, [0, 1], [ROT, -ROT]);
  const rotY = useTransform(mx, [0, 1], [-ROT, ROT]);
  const sRotX = useSpring(rotX, { stiffness: 350, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 350, damping: 28 });

  /* ── Shine ── */
  const shineX = useTransform(mx, [0, 1], ["110%", "-10%"]);
  const shineY = useTransform(my, [0, 1], ["110%", "-10%"]);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const { left, top, width, height } =
        cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - left) / width;
      const ny = (e.clientY - top) / height;
      mx.set(nx);
      my.set(ny);
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
      initial={{ opacity: 0, y: 60, filter: "blur(15px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      animate={{ y: hovered ? 0 : [0, -6, 0] }}
      style={{
        perspective: 900,
        animationDuration: hovered ? "0s" : `${4 + (index % 3)}s`,
      } as React.CSSProperties}
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
        className={`relative rounded-2xl overflow-hidden cursor-none select-none
          ${featured || project.isFeatured ? "ring-1 ring-blue-500/40" : "glass-card"}`}
        whileHover={{ scale: 1.04, z: 20 }}
        transition={{ scale: { duration: 0.3, ease: "easeOut" }, z: { duration: 0.3 } }}
      >
        {/* Cursor-follow glow (Softer and more subtle) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 z-10"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${glow.x}px ${glow.y}px, ${accentColor}12, transparent 70%)`,
          }}
        />

        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: hovered ? 0.35 : 0,
            background: `radial-gradient(180px circle at ${shineX.get()} ${shineY.get()}, rgba(255,255,255,0.12), transparent 70%)`,
            transition: "opacity 0.3s",
          }}
        />

        {/* Handcrafted shadow and border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20"
          animate={{
            boxShadow: hovered
              ? `0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)`
              : `0 10px 30px -10px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)`,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

          {/* Card visual */}
          <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

            {/* Display image if available, else fallback to shapes */}
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={project.title} 
                className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-5 left-5 w-14 h-14 rounded-xl opacity-25 rotate-12 border border-white/30"
                  style={{ backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.1)" }} />
                <div className="absolute bottom-5 right-6 w-20 h-20 rounded-2xl opacity-20 -rotate-6 border border-white/20"
                  style={{ backdropFilter: "blur(6px)", background: "rgba(255,255,255,0.08)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/25"
                  style={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.06)" }} />
              </div>
            )}

          {/* Price badge */}
          <div className="absolute top-4 right-4 z-10" style={{ transform: "translateZ(30px)" }}>
            <div className="glass rounded-full px-3 py-1 text-xs font-black text-white shadow-lg flex items-center gap-2">
              {hasDiscount && <span className="text-slate-400 line-through font-normal text-[10px]">${project.price}</span>}
              <span>${displayPrice}</span>
            </div>
          </div>

          {/* Featured label */}
          {(featured || project.isFeatured) && (
            <div className="absolute top-4 left-4 z-10">
              <div className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ background: accentColor + "cc" }}>
                Featured
              </div>
            </div>
          )}

          {/* Hover CTA overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-20 flex items-center justify-center gap-3"
                style={{ background: "rgba(2,4,8,0.78)", backdropFilter: "blur(10px)" }}
              >
                <Link
                  href={`/project/${projectId}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/25 hover:bg-white/15 transition-colors"
                >
                  <ArrowUpRight size={14} />
                  Details
                </Link>
                <Link
                  href={`/project/${projectId}#buy`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors"
                  style={{ background: accentColor }}
                >
                  <ShoppingBag size={13} />
                  Buy Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card body */}
        <div className={`p-5 ${featured ? "bg-gradient-to-b from-transparent to-black/20" : ""}`}
          style={{ transform: "translateZ(15px)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1 block"
                style={{ color: accentColor }}>
                {project.category}
              </span>
              <h3 className={`font-black text-white leading-tight ${featured ? "text-xl" : "text-lg"}`}>
                {project.title}
              </h3>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              {hasDiscount && <p className="text-[10px] text-rose-500 font-bold mb-0">-{project.discount}% OFF</p>}
              <p className="text-lg font-black text-white">${displayPrice}</p>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-1 rounded-full font-semibold"
                style={{
                  background: accentColor + "14",
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: hovered ? 1 : 0.2,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
