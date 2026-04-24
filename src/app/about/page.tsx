"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Shield, Rocket, Target, Users, Heart } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Target, title: "Our Mission", desc: "To empower businesses by creating digital products that don't just look good, but perform exceptionally." },
    { icon: Rocket, title: "Innovation", desc: "We stay at the forefront of technology, using the latest tools to give our clients a competitive edge." },
    { icon: Users, title: "Client First", desc: "Your success is our priority. We work as an extension of your team to achieve your goals." },
    { icon: Heart, title: "Quality", desc: "We don't believe in 'good enough'. We strive for perfection in every line of code and pixel." },
  ];

  return (
    <main className="min-h-screen bg-[#020408]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/5 text-violet-400 text-sm font-medium mb-6"
          >
            <Zap size={14} />
            <span>The Nexoura Story</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
          >
            We Build <span className="text-gradient">Digital Futures</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Nexoura is more than just a digital agency. We are a team of visionaries, developers, and designers dedicated to transforming how the world interacts with digital brands.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <val.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-white mb-8">Who We Are</h2>
            <p className="text-slate-400 text-lg mb-6">
              Founded in 2024, Nexoura emerged from a simple observation: most websites are static and uninspiring. We set out to change that by blending high-end cinematic visuals with powerful, conversion-driven technology.
            </p>
            <p className="text-slate-400 text-lg mb-12">
              Based in Egypt and serving clients globally, we specialize in custom web applications, premium SaaS landing pages, and interactive digital experiences. Our team is small, agile, and obsessed with details.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-transparent border border-white/5">
                <h4 className="text-white font-bold text-xl mb-4">Our Vision</h4>
                <p className="text-slate-400">To be the global benchmark for interactive digital experiences that redefine brand authority.</p>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-transparent border border-white/5">
                <h4 className="text-white font-bold text-xl mb-4">Our Commitment</h4>
                <p className="text-slate-400">We commit to transparency, excellence, and delivering measurable results for every client we serve.</p>
              </div>
            </div>

            <div className="mt-20 p-10 rounded-[2rem] glass border border-white/5 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Join Our Community</h3>
              <p className="text-slate-400 mb-8 relative z-10">Stay updated with our latest projects and freelance opportunities through our Telegram channels.</p>
              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <a href="https://t.me/nex_ora_org" target="_blank" className="px-6 py-3 bg-[#24A1DE]/10 hover:bg-[#24A1DE]/20 text-[#24A1DE] border border-[#24A1DE]/20 rounded-xl font-bold transition-all flex items-center gap-2">
                  <span>Projects Channel</span>
                </a>
                <a href="https://t.me/GigWork1" target="_blank" className="px-6 py-3 bg-[#24A1DE]/10 hover:bg-[#24A1DE]/20 text-[#24A1DE] border border-[#24A1DE]/20 rounded-xl font-bold transition-all flex items-center gap-2">
                  <span>Freelance Network</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
