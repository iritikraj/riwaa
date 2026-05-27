"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Download } from "lucide-react";

export function VersionTwo({ heading, subtext, imageUrl, siteTitle, items }: { heading?: string; subtext?: string; imageUrl?: string; siteTitle?: string; items?: string[] }) {
  const safeHeading = heading || siteTitle || "Mindful Modern Luxury";
  const safeSubtext = subtext || "Experience a new paradigm in residential landscapes, harmonizing environmental responsibility with human-centered design.";
  const finalImage = imageUrl || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop";
  const mainChip = items?.[0] || "Signature Collection";

  return (
    <section className="relative min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] bg-[#F8F8F3] font-jost">
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-32 relative z-10 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#A6A79f]/40 rounded-full text-[#A6A79f] text-xs font-medium mb-8 shadow-sm">
            <Sparkles size={14} /> <span>{mainChip}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-cormorant text-[#1A1A1A] leading-[1.1] tracking-tight mb-8">
            {safeHeading}
          </h1>

          <div className="w-16 h-px bg-[#D8D6D0] mb-8" />

          <p className="text-[#1A1A1A]/70 text-lg leading-relaxed max-w-md font-light mb-12">
            {safeSubtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="group bg-[#1A1A1A] text-[#F8F8F3] hover:bg-[#2D2D2D] px-8 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-4 transition-all duration-300 shadow-xl">
              <span>Register Interest</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border border-[#D8D6D0] text-[#1A1A1A] hover:border-[#A6A79f] px-8 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300">
              <Download size={16} />
              <span>Download Brochure</span>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative h-[60vh] lg:h-screen order-1 lg:order-2 overflow-hidden p-4 lg:p-8 lg:pl-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full relative rounded-3xl lg:rounded-[40px] overflow-hidden shadow-2xl"
        >
          <img src={finalImage} alt={safeHeading} className="w-full h-full object-cover" />
          <div className="absolute inset-0 border border-white/20 rounded-3xl lg:rounded-[40px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}