"use client";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";

export function HeroVideo({ heading, subtext, videoUrl, siteTitle, items }: { heading?: string; subtext?: string; videoUrl?: string; siteTitle?: string; items?: string[] }) {
  const isDirectLink = videoUrl?.endsWith('.mp4') || videoUrl?.includes('storage');
  const safeHeading = heading || siteTitle || "Mindful Modern Luxury";
  const safeSubtext = subtext || "Experience a new paradigm in residential landscapes, harmonizing environmental responsibility with human-centered design.";
  const safeItems = items?.length ? items : ["Visionary Living"];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {isDirectLink ? (
        <video src={videoUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
      ) : (
        <iframe
          src={`${videoUrl?.replace("watch?v=", "embed/")}?autoplay=1&mute=1&loop=1&playlist=${videoUrl?.split('v=')[1]}`}
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none scale-150"
          allow="autoplay; encrypted-media"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-medium mb-8 shadow-sm">
          <Sparkles size={14} className="text-[#B9A089]" /> <span>{safeItems[0]}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-cormorant text-[#F8F8F3] mb-6 drop-shadow-lg"
        >
          {safeHeading}
        </motion.h1>

        <p className="text-[#F8F8F3]/80 text-lg max-w-2xl font-light tracking-wide italic mb-10 drop-shadow-md">
          &quot;{safeSubtext}&quot;
        </p>

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

      </div>
    </section>
  );
}