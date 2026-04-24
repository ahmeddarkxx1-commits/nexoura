"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import CategoryFilter from "@/components/CategoryFilter";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import axios from "axios";
import { Project } from "@/lib/types";

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products?active=true");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      className="relative py-32 px-6 overflow-hidden z-20 -mt-12"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 60%), #020408",
      }}
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel text="Our Work" accent="#8b5cf6" />
          <ScrollReveal>
            <h2 className="section-heading text-white mb-4">
              Explore Our{" "}
              <span className="text-gradient">Digital Store</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-sub max-w-xl mx-auto">
              Every project is a product — buy a ready-made template or commission
              a fully custom build.
            </p>
          </ScrollReveal>
        </div>

        {/* Filter */}
        <ScrollReveal delay={0.15} className="mb-14">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </ScrollReveal>

        {/* Staggered bento grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + (loading ? "-loading" : "-ready")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center py-20 text-slate-500">
                No projects in this category yet.
              </p>
            ) : (
              <StaggeredGrid projects={filtered} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function StaggeredGrid({ projects }: { projects: Project[] }) {
  const [featured, ...rest] = projects;

  return (
    <div className="space-y-6">
      {/* Row 1: featured (wide) + first two regular */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Featured card spans 2 cols and is taller */}
        <div className="lg:col-span-2">
          <ProjectCard project={featured} index={0} featured={true} />
        </div>

        {/* First regular card — offset down on desktop */}
        {rest[0] && (
          <div className="lg:mt-24">
            <ProjectCard project={rest[0]} index={1} />
          </div>
        )}
      </div>

      {/* Row 2: regular cards — column 1 flush, columns 2/3 offset up */}
      {rest.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {rest.slice(1).map((project, i) => (
            <div
              key={project.id}
              style={{
                marginTop:
                  i === 0
                    ? "32px"
                    : i === 1
                    ? "-48px"
                    : i === 2
                    ? "-24px"
                    : "0px",
              }}
              className="hidden-on-small"
            >
              <ProjectCard project={project} index={i + 2} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
