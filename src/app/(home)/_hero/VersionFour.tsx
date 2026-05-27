"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Leaf, Droplets, Download } from "lucide-react";

export function VersionFour({ heading, subtext, imageUrls, siteTitle, items }: { heading?: string; subtext?: string; imageUrls?: string[]; siteTitle?: string; items?: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeHeading = heading || siteTitle || "Mindful Modern Luxury";
  const safeSubtext = subtext || "Experience a new paradigm in residential landscapes, harmonizing environmental responsibility with human-centered design.";
  const safeItems = items?.length ? items : ["Conscious Design", "Premium Finish"];

  const validImages = imageUrls && imageUrls.length > 0
    ? imageUrls
    : [
      "https://images.unsplash.com/photo-1582647509711-c8aa8a8b1a37?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
    ];

  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [validImages.length]);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#1A1A1A] font-jost">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            src={validImages[currentIndex]}
            alt={`Hero View ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/40 via-[#1A1A1A]/20 to-[#1A1A1A]/80 z-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pt-20"
      >
        <div className="flex gap-3 mb-8">
          {safeItems.slice(0, 2).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#F8F8F3] bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-light">
              {i === 0 ? <Leaf size={14} className="text-[#A6A79f]" /> : <Droplets size={14} className="text-[#B9A089]" />}
              <span>{item}</span>
            </div>
          ))}
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant text-[#F8F8F3] mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
          {safeHeading}
        </h1>

        <p className="text-[#F8F8F3]/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
          {safeSubtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button className="bg-[#B9A089] text-white hover:bg-[#A8927A] px-10 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300 shadow-lg">
            <span>Register Interest</span>
            <ArrowRight size={16} />
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/30 text-[#F8F8F3] hover:bg-white/20 px-10 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300">
            <Download size={16} />
            <span>Download Brochure</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}