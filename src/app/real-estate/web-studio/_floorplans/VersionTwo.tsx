"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function VersionTwo({ heading, floorPlans }: { heading?: string; floorPlans?: string[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const plans = floorPlans?.length ? floorPlans : ["https://images.unsplash.com/photo-1600607688969-a5bfcd64bd27?q=80&w=1200&auto=format&fit=crop"];

  return (
    <section className="py-24 md:py-32 bg-[#1A1A1A] font-jost text-[#F8F8F3] overflow-hidden relative">

      {/* Subtle blueprint grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(248,248,243,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(248,248,243,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#B9A089]/30 rounded-full text-[#B9A089] text-xs uppercase tracking-widest font-medium mb-6">
              Architectural Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-cormorant font-light tracking-tight">{heading || "Master Layouts"}</h2>
          </div>

          {/* Minimalist Line Tabs */}
          {plans.length > 1 && (
            <div className="flex gap-6 border-b border-white/10 pb-4">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`text-sm uppercase tracking-widest transition-all duration-300 relative ${activeTab === i ? "text-[#B9A089]" : "text-white/40 hover:text-white"
                    }`}
                >
                  Type 0{i + 1}
                  {activeTab === i && (
                    <motion.div layoutId="activeFloorPlan" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-[#B9A089]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blueprint Canvas */}
        <div className="w-full bg-[#1A1A1A] border border-white/10 rounded-3xl p-6 md:p-16 relative overflow-hidden shadow-2xl min-h-125 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              src={plans[activeTab]}
              alt={`Blueprint ${activeTab + 1}`}
              // The magic class that turns white blueprints into dark mode wireframes
              className="relative z-10 w-full max-h-[60vh] object-contain filter invert opacity-80"
            />
          </AnimatePresence>

          {/* Decorative Corner Accents */}
          <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/30" />
          <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/30" />
          <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/30" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/30" />
        </div>

      </div>
    </section>
  );
}