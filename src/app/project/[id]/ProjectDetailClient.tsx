"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/types";
import { buildProjectWhatsApp } from "@/lib/utils";

type Tab = "overview" | "features" | "usecase";

function UpsellToggle({
  label,
  price,
  unit,
  checked,
  onChange,
  color,
}: {
  label: string;
  price: number;
  unit: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${
        checked
          ? "border-violet-500/60 bg-violet-500/10"
          : "border-white/10 bg-white/5 hover:bg-white/8"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
            checked ? "bg-violet-600" : "bg-white/10"
          }`}
        >
          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
        </div>
      </div>
      <span className="text-sm font-bold" style={{ color }}>
        +${price}<span className="text-xs font-normal text-slate-400">/{unit}</span>
      </span>
    </button>
  );
}

import axios from "axios";

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [customization, setCustomization] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [tracking, setTracking] = useState(false);

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (tracking) return;
    
    setTracking(true);
    const refCode = localStorage.getItem("nexoura_ref");
    
    if (refCode) {
      try {
        await axios.post("/api/referral-click", {
          affiliateCode: refCode,
          productId: project.id,
          type: "whatsapp"
        });
      } catch (err) {
        console.error("Referral tracking failed", err);
      }
    }

    const whatsappUrl = buildProjectWhatsApp(
      project.title, 
      project.finalPrice || project.price, 
      selectedUpsells,
      refCode
    );
    window.open(whatsappUrl, "_blank");
    setTracking(false);
  };

  const upsells = project.upsells || { customization: 499, hosting: 29, maintenance: 99 };

  const totalPrice =
    (project.finalPrice || project.price) +
    (customization ? upsells.customization : 0) +
    (hosting ? upsells.hosting : 0) +
    (maintenance ? upsells.maintenance : 0);

  const selectedUpsells = [
    ...(customization ? [`Customization (+$${upsells.customization})`] : []),
    ...(hosting ? [`Hosting (+$${upsells.hosting}/mo)`] : []),
    ...(maintenance ? [`Maintenance (+$${upsells.maintenance}/mo)`] : []),
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "usecase", label: "Use Case" },
  ];

  return (
    <div className="min-h-screen bg-[#020408]">
      {/* Hero */}
      <div
        className={`relative h-[50vh] min-h-[380px] bg-gradient-to-br ${project.gradient || "from-violet-600/20 to-cyan-600/20"} flex items-end overflow-hidden`}
      >
        {/* Geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-20 border border-white/20" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-3xl opacity-15 rotate-45 border border-white/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent" />

        {/* Back */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>

        {/* Category + title */}
        <div className="relative px-6 md:px-12 pb-10 max-w-7xl mx-auto w-full">
          <span
            className="text-xs font-bold uppercase tracking-widest mb-2 block"
            style={{ color: project.accentColor || "#8b5cf6" }}
          >
            {project.category}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-black text-white"
          >
            {project.title}
          </motion.h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: tabs */}
          <div className="lg:col-span-2">
            {/* Tab nav */}
            <div className="flex gap-1 glass-card rounded-2xl p-1 mb-8 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/80 to-indigo-600/80"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-8"
            >
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">About This Template</h2>
                  <p className="text-slate-300 leading-relaxed text-base">{project.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(project.techStack || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          background: (project.accentColor || "#8b5cf6") + "18",
                          color: project.accentColor || "#8b5cf6",
                          border: `1px solid ${project.accentColor || "#8b5cf6"}35`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "features" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">What&apos;s Included</h2>
                  <ul className="space-y-4">
                    {(project.features || []).map((f: string, i: number) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: project.accentColor || "#8b5cf6" }}
                        >
                          <Check size={11} className="text-white" strokeWidth={3} />
                        </div>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "usecase" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Perfect For</h2>
                  <p className="text-slate-300 leading-relaxed text-base">{project.useCase}</p>
                  <div className="mt-8 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5">
                    <p className="text-sm text-violet-300 font-semibold mb-2">💡 Need Something Different?</p>
                    <p className="text-sm text-slate-400">
                      We can fully customize this template or build a completely unique solution from scratch.
                    </p>
                    <a
                      href="/#contact"
                      className="inline-block mt-3 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Request Custom Build →
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Sticky pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card rounded-3xl p-6 space-y-5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Base Price</p>
                <div className="text-4xl font-black text-gradient">${project.price}</div>
              </div>

              <div className="h-px bg-white/8" />

              {/* Upsells */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Add-On Options
                </p>
                <UpsellToggle
                  label="Customization"
                  price={upsells.customization}
                  unit="once"
                  checked={customization}
                  onChange={setCustomization}
                  color={project.accentColor || "#8b5cf6"}
                />
                <UpsellToggle
                  label="Hosting"
                  price={upsells.hosting}
                  unit="mo"
                  checked={hosting}
                  onChange={setHosting}
                  color={project.accentColor || "#8b5cf6"}
                />
                <UpsellToggle
                  label="Maintenance"
                  price={upsells.maintenance}
                  unit="mo"
                  checked={maintenance}
                  onChange={setMaintenance}
                  color={project.accentColor || "#8b5cf6"}
                />
              </div>

              <div className="h-px bg-white/8" />

              {/* Total */}
              <motion.div
                key={totalPrice}
                initial={{ scale: 1.05, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-slate-300">Total</span>
                <span className="text-2xl font-black text-white">${totalPrice}</span>
              </motion.div>

              {/* Buy CTA */}
              <button
                onClick={handleBuy}
                disabled={tracking}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50"
              >
                {tracking ? <Loader2 className="animate-spin" size={18} /> : <MessageCircle size={18} />}
                <span>Buy via WhatsApp</span>
              </button>

              {/* Custom request */}
              <a
                href="/#contact"
                className="btn-secondary w-full flex items-center justify-center gap-2 py-3 text-sm text-center"
              >
                Request Custom Version
              </a>

              {project.liveDemo !== "#" && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  View Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
