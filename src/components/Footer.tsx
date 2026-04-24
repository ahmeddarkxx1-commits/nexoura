"use client";
import { ExternalLink, Mail, Globe, Share2, Zap, Send } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  { icon: Mail, href: "mailto:hello@nexoura.com", label: "Email" },
  { icon: Share2, href: "https://wa.me/201152628515", label: "WhatsApp" },
  { icon: Zap, href: "https://t.me/nex_ora_org", label: "Projects Channel" },
  { icon: Send, href: "https://t.me/GigWork1", label: "Freelance Channel" },
];

const links = [
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "tel:+201152628515" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-violet-500/10 py-16 px-6 overflow-hidden">
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-black text-gradient">Nexoura</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -2, scale: 1.1 }}
                className="w-9 h-9 glass rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Nexoura. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 text-gradient font-semibold">
            Building Digital Experiences That Sell
          </p>
          <div className="flex gap-4">
            <a href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="/about" className="text-xs text-slate-500 hover:text-white transition-colors">About Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
