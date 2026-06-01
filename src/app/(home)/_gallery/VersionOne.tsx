"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";

export function VersionOne({ heading, galleryImages }: { heading?: string; galleryImages?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const images = galleryImages?.length ? galleryImages : [
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595841696660-1e5b1ac56525?q=80&w=1200&auto=format&fit=crop",
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F8F8F3] overflow-hidden font-jost text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#B9A089]/50 rounded-full text-[#B9A089] text-xs uppercase tracking-widest font-medium mb-6">
            Curated Aesthetics
          </div>
          <h2 className="text-4xl md:text-5xl font-cormorant font-medium tracking-tight">
            {heading || "The Visual Journey"}
          </h2>
        </div>
        <p className="text-[#1A1A1A]/50 text-sm tracking-[0.2em] uppercase hidden md:block">
          Drag to explore
        </p>
      </div>

      {/* Cinematic Horizontal Scroll Reel */}
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ right: 0, left: -((images.length * 500) - window.innerWidth + 200) }}
        dragElastic={0.05}
        className="flex cursor-grab active:cursor-grabbing px-6 md:px-12 space-x-6 md:space-x-12 pb-12"
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="flex-shrink-0 w-[300px] md:w-125 h-125 md:h-[700px] relative overflow-hidden rounded-[32px] group bg-[#D9D5C9]/20"
          >
            <img
              src={img}
              alt={`Gallery Image ${i + 1}`}
              className="w-full h-full object-cover filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
            />

            {/* Elegant glass hover state */}
            <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-500" />

            <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="bg-white/80 backdrop-blur-md border border-white/40 p-4 rounded-2xl flex justify-between items-center">
                <span className="font-cormorant font-medium text-[#1A1A1A]">Perspective 0{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F8F8F3] flex items-center justify-center">
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}