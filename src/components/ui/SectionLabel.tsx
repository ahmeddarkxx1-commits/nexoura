"use client";
import { motion } from "framer-motion";

interface SectionLabelProps {
  text: string;
  accent?: string;
}

export default function SectionLabel({ text, accent = "#00d4ff" }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 mb-5"
    >
      <div className="w-6 h-px" style={{ background: accent }} />
      <span
        className="text-[11px] font-bold tracking-[0.25em] uppercase"
        style={{ color: accent }}
      >
        {text}
      </span>
    </motion.div>
  );
}
