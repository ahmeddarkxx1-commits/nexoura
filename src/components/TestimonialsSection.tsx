"use client";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { testimonials } from "@/lib/data";

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <SectionLabel text="Testimonials" accent="#7c3aed" />
            <ScrollReveal>
              <h2 className="section-heading text-white mb-4">
                What Our <span className="text-gradient">Partners Say</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="section-sub">
                We build long-term relationships with businesses that care about quality as much as we do.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div 
                className="relative glass-card rounded-[2rem] p-10 handcrafted-border soft-shadow overflow-hidden group"
                style={{
                  marginTop: i === 1 ? "40px" : "0px" // Asymmetrical offset
                }}
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote size={80} className="text-violet-500" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed italic mb-8">
                    &quot;{t.content}&quot;
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
