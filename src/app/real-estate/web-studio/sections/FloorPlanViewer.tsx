"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloorPlanViewer({ floorPlans }: { floorPlans: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!floorPlans || floorPlans.length === 0) return null;

  return (
    <section className="py-32 bg-[#020202] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">

        <span className="text-amber-500 tracking-[0.4em] text-[10px] uppercase mb-4">Architecture</span>
        <h2 className="text-3xl md:text-5xl font-cormorant text-white tracking-wide font-light mb-16">Floor Plans</h2>

        {/* Blueprint Navigation */}
        {floorPlans.length > 1 && (
          <div className="flex gap-4 mb-12">
            {floorPlans.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 ${activeIndex === i ? "border-amber-500 text-amber-500 bg-amber-500/10" : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
              >
                Layout 0{i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Floor Plan Display Canvas */}
        <div className="w-full max-w-5xl aspect-video relative border border-white/10 bg-white/5 p-4 md:p-12 flex items-center justify-center overflow-hidden">
          {/* subtle grid background to make it look like a blueprint table */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src={floorPlans[activeIndex]}
              alt={`Floor Plan ${activeIndex + 1}`}
              className="relative z-10 max-w-full max-h-full object-contain filter invert opacity-80 mix-blend-screen"
            />
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}