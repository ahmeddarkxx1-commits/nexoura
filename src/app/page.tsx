import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import RequestSection from "@/components/RequestSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020408]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProjectsSection />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <RequestSection />
      <Footer />
    </main>
  );
}
