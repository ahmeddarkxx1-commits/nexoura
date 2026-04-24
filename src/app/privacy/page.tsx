"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, and payment information.",
      icon: Eye
    },
    {
      title: "How We Use Data",
      content: "Your data is used to provide, maintain, and improve our services, process transactions, and communicate with you about updates and offers.",
      icon: FileText
    },
    {
      title: "Data Protection",
      content: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.",
      icon: Lock
    },
    {
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. Contact us at hello@nexoura.com for assistance.",
      icon: Shield
    }
  ];

  return (
    <main className="min-h-screen bg-[#020408]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Privacy <span className="text-gradient">Policy</span></h1>
            <p className="text-slate-400">Last updated: April 24, 2026</p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400">
                    <section.icon size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <p className="text-slate-400 leading-relaxed text-lg">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 p-8 rounded-2xl bg-white/5 border border-white/5 text-center"
          >
            <p className="text-slate-400 mb-4">Have questions about our privacy practices?</p>
            <a href="mailto:hello@nexoura.com" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
              hello@nexoura.com
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
