"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/lib/types";
import { categories } from "@/lib/data";

interface CategoryFilterProps {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              color: isActive ? "#fff" : "rgba(148,163,184,0.8)",
              border: isActive ? "none" : "1px solid rgba(0,119,182,0.2)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0077b6, #00b4d8)",
                }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
