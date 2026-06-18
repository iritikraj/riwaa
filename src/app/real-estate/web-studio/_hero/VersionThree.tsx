"use client";
import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

export function VersionThree({ heading, subtext, imageUrl, siteTitle, items }: { heading?: string; subtext?: string; imageUrl?: string; siteTitle?: string; items?: string[] }) {
  const safeHeading = heading || siteTitle || "Mindful Modern Luxury";
  const safeSubtext = subtext || "Experience a new paradigm in residential landscapes, harmonizing environmental responsibility with human-centered design.";
  const finalImage = imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop";
  const mainChip = items?.[0] || "Signature Collection";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1A1A1A] font-jost">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img src={finalImage} alt={safeHeading} className="w-full h-full object-cover" />
      </motion.div>

      <div className="absolute inset-0 flex items-end justify-start p-4 md:p-12 lg:p-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#F8F8F3]/95 backdrop-blur-2xl border border-white/50 rounded-[32px] p-8 md:p-12 max-w-2xl w-full shadow-[0_20px_60px_rgba(26,26,26,0.15)]"
        >
          <p className="text-[#A6A79f] uppercase tracking-[0.3em] text-xs font-semibold mb-6">
            {mainChip}
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant text-[#1A1A1A] tracking-tight leading-[1.1] mb-6">
            {safeHeading}
          </h1>

          <p className="text-[#1A1A1A]/70 text-base leading-relaxed font-light mb-10">
            {safeSubtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 border-t border-[#D8D6D0] pt-8">
            <button className="flex-1 bg-[#1A1A1A] text-[#F8F8F3] hover:bg-[#2D2D2D] py-4 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-3 transition-colors duration-300">
              <span>Register Interest</span>
              <ArrowRight size={14} />
            </button>
            <button className="flex-1 bg-transparent border border-[#D8D6D0] text-[#1A1A1A] hover:border-[#A6A79f] py-4 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-3 transition-colors duration-300">
              <Download size={14} />
              <span>Brochure</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}