"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildWhatsAppLink } from "@/lib/utils";

const projectTypes = [
  "E-commerce Store",
  "Landing Page",
  "Corporate Website",
  "Mobile App",
  "Custom Platform",
  "Other",
];

const budgets = ["$100 – $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+"];

interface FormState {
  projectType: string;
  budget: string;
  description: string;
  name: string;
  email: string;
}

const INITIAL: FormState = {
  projectType: "",
  budget: "",
  description: "",
  name: "",
  email: "",
};

export default function RequestSection() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildMessage = (refCode?: string | null) => {
    return [
      `Hi Nexoura! I'd like to start a project:`,
      ``,
      `👤 Name: ${form.name}`,
      `📧 Email: ${form.email}`,
      `📦 Project Type: ${form.projectType}`,
      `💰 Budget: ${form.budget}`,
      ...(refCode ? [``, `🔗 Ref: ${refCode}`] : []),
      ``,
      `📝 Description:`,
      form.description,
    ].join("\n");
  };

  const [tracking, setTracking] = useState(false);

  const handleWhatsApp = async () => {
    if (!form.name || !form.projectType || !form.budget || tracking) return;
    
    setTracking(true);
    const refCode = localStorage.getItem("nexoura_ref");
    
    if (refCode) {
      try {
        await axios.post("/api/referral-click", {
          affiliateCode: refCode,
          type: "whatsapp"
        });
      } catch (err) {
        console.error("Referral tracking failed", err);
      }
    }

    window.open(buildWhatsAppLink(buildMessage(refCode)), "_blank");
    setSubmitted(true);
    setTracking(false);
  };

  return (
    <section
      id="contact"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background with floating orbs */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 120%, rgba(236,72,153,0.08) 0%, transparent 60%), #020408",
      }}>
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -15, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-1/4 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel text="Start a Project" accent="#ec4899" />
          <ScrollReveal>
            <h2 className="section-heading text-white mb-4">
              Let&apos;s Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Extraordinary</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-sub max-w-xl mx-auto">
              Ready to start? Tell us about your vision. We typically respond via WhatsApp within 2 hours.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2}>
          <div className="relative">
            {/* Background Glow for Card */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] blur-xl opacity-50" />
            
            <div className="relative glass-card rounded-[2.5rem] p-8 md:p-12 overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="text-center py-16"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                    >
                      <MessageCircle size={40} className="text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-white mb-4">Request Sent!</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                      We&apos;ve received your details. Please check your WhatsApp to continue the conversation.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm(INITIAL); }}
                      className="btn-secondary text-sm px-8 py-3"
                    >
                      Start Another Project
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={form.name}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={`w-full bg-white/5 border rounded-xl px-5 py-4 text-white text-sm placeholder-slate-600 focus:outline-none transition-all duration-300 ${
                            focusedField === 'name' ? 'border-pink-500/30 bg-white/10' : 'border-white/5'
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white text-sm placeholder-slate-600 focus:outline-none transition-all duration-300 ${
                            focusedField === 'email' ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-white/10' : 'border-white/10'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                        What do you need?
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {projectTypes.map((type) => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChange("projectType", type)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                              form.projectType === type
                                ? "bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] border-transparent"
                                : "glass text-slate-400 hover:text-white border border-white/10 hover:border-white/30"
                            }`}
                          >
                            {type}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                        Estimated Budget
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {budgets.map((b) => (
                          <motion.button
                            key={b}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChange("budget", b)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                              form.budget === b
                                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border-transparent"
                                : "glass text-slate-400 hover:text-white border border-white/10 hover:border-white/30"
                            }`}
                          >
                            {b}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Project Details
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your vision, goals, and any specific requirements..."
                        value={form.description}
                        onFocus={() => setFocusedField('desc')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white text-sm placeholder-slate-600 focus:outline-none transition-all duration-300 resize-none ${
                          focusedField === 'desc' ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-white/10' : 'border-white/10'
                        }`}
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <motion.button
                        onClick={handleWhatsApp}
                        whileHover={form.name && form.projectType && form.budget ? { scale: 1.01 } : {}}
                        whileTap={form.name && form.projectType && form.budget ? { scale: 0.99 } : {}}
                        disabled={!form.name || !form.projectType || !form.budget}
                        className="w-full relative group overflow-hidden rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-90 transition-opacity" />
                        
                        <div className="relative py-4 px-6 flex items-center justify-center gap-3 text-white font-bold text-lg">
                          {tracking ? <Loader2 size={22} className="animate-spin" /> : <MessageCircle size={22} />}
                          <span>{tracking ? 'Processing...' : 'Send WhatsApp Message'}</span>
                          {!tracking && <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                        </div>
                      </motion.button>
                      <p className="text-xs font-medium text-center text-slate-500 mt-4 flex items-center justify-center gap-1.5">
                        <Sparkles size={12} className="text-pink-500" />
                        Fast response guaranteed
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
