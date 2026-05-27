"use client";
import { motion } from "framer-motion";
import { Leaf, Droplets, Cpu, ArrowRight, Download } from "lucide-react";

export function VersionOne({ heading, subtext, imageUrl, siteTitle, items }: { heading?: string; subtext?: string; imageUrl?: string; siteTitle?: string; items?: string[] }) {
  const safeHeading = heading || siteTitle || "Mindful Modern Luxury";
  const safeSubtext = subtext || "Experience a new paradigm in residential landscapes, harmonizing environmental responsibility with human-centered design.";
  const finalImage = imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop";

  // Dynamic chips fallback
  const safeItems = items?.length ? items : ["Sustainability", "Wellness", "Technology"];
  const icons = [Leaf, Droplets, Cpu];

  return (
    <section className="relative h-screen overflow-hidden bg-[#1A1A1A] font-jost">
      <div className="absolute inset-0">
        <img src={finalImage} alt={safeHeading} className="w-full h-full object-cover object-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 via-[#1A1A1A]/30 to-[#1A1A1A]/90" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto w-full flex flex-col items-center"
        >
          {/* Dynamic Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {safeItems.slice(0, 3).map((item, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="flex items-center gap-2 text-[#F8F8F3] bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg text-xs md:text-sm font-light">
                  <Icon size={14} className={i === 0 ? "text-[#A6A79f]" : i === 1 ? "text-[#B9A089]" : "text-[#B3B7Bf]"} />
                  <span>{item}</span>
                </div>
              );
            })}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant text-[#F8F8F3] mb-8 leading-[1.1] tracking-tight drop-shadow-lg">
            {safeHeading}
          </h1>

          <div className="bg-[#1A1A1A]/70 backdrop-blur-xl border border-[#D8D6D0]/20 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-10 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B9A089]" />
            <p className="font-cormorant italic text-[#D9D5C9] text-base md:text-lg leading-relaxed pl-4">
              &quot;{safeSubtext}&quot;
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <button className="bg-[#F8F8F3] text-[#1A1A1A] hover:bg-white px-8 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300">
              <span>Register Interest</span>
              <ArrowRight size={16} />
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-[#F8F8F3] hover:bg-white/20 px-8 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300">
              <Download size={16} />
              <span>Download Brochure</span>
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}