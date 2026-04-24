"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: string; // e.g. "150+", "$2M+", "98%"
  duration?: number;
}

function parseTarget(raw: string): { number: number; prefix: string; suffix: string } {
  const prefix = raw.startsWith("$") ? "$" : "";
  const stripped = raw.replace(/[$+%,M]/g, "");
  const number = parseFloat(stripped) || 0;
  const suffix = raw.replace(/[$\d.]/g, "");
  return { number, prefix, suffix };
}

export default function AnimatedCounter({ target, duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");
  const { number, prefix, suffix } = parseTarget(target);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = number / steps;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= steps) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        const val = number < 10 ? start.toFixed(1) : Math.floor(start).toString();
        setDisplay(`${prefix}${val}${suffix}`);
      }
    }, (duration * 1000) / steps);
    return () => clearInterval(timer);
  }, [inView, number, prefix, suffix, target, duration]);

  return <span ref={ref}>{display}</span>;
}
