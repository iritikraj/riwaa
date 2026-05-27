"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";

export function VersionOne({ heading, floorPlans }: { heading?: string; floorPlans?: string[] }) {
  const [activeTab, setActiveTab] = useState(0);

  // Fallbacks if no user plans are uploaded
  const plans = floorPlans?.length ? floorPlans : [
    "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd27?q=80&w=1200&auto=format&fit=crop", // Placeholder 1
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"  // Placeholder 2
  ];

  // Mock data for the layout specs to match the reference UI
  const specs = [
    { title: "1 Bedroom Residence", desc: "Perfectly designed for modern professionals seeking efficiency and elegance.", area: "750 sq.ft", price: "AED 1.2M" },
    { title: "2 Bedroom Residence", desc: "Ideal for growing families seeking space, comfort, and premium amenities.", area: "1,250 sq.ft", price: "AED 2.1M" },
    { title: "3 Bedroom Residence", desc: "Luxurious family living with abundant space and world-class finishes.", area: "1,850 sq.ft", price: "AED 3.2M" }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F8F8F3] font-jost text-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#A6A79f] rounded-full text-[#A6A79f] text-sm font-medium mb-4">
            Thoughtfully Designed
          </div>
          <h2 className="text-4xl md:text-5xl font-cormorant font-medium mb-6 tracking-tight">
            {heading || "Floor Plans"}
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#A6A79f] to-transparent mb-6" />
          <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto font-light leading-relaxed">
            Timeless aesthetics meet intelligent functionality, ensuring long-term value and relevance. Built not just for today — but for the future of living.
          </p>
        </div>

        {/* Tabs */}
        {plans.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="bg-white/60 backdrop-blur-md border border-[#D8D6D0] rounded-full p-1.5 inline-flex shadow-sm">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === i
                    ? "bg-[#1A1A1A] text-[#F8F8F3] shadow-md"
                    : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-white/50"
                    }`}
                >
                  Layout 0{i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Content Canvas */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >

              {/* Left: Image Canvas */}
              <div className="bg-white/80 backdrop-blur-xl border border-[#D8D6D0]/50 rounded-3xl p-4 shadow-[0_8px_32px_rgba(26,26,26,0.04)]">
                <div className="bg-[#F8F8F3] rounded-2xl overflow-hidden aspect-square md:aspect-[4/3] relative flex items-center justify-center">
                  <img
                    src={plans[activeTab]}
                    alt={`Floor Plan ${activeTab + 1}`}
                    className="w-full h-full object-contain p-8 mix-blend-multiply opacity-80"
                  />
                </div>
              </div>

              {/* Right: Specifications */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-cormorant font-medium mb-4 text-[#1A1A1A]">
                    {specs[activeTab]?.title || `Premium Layout 0${activeTab + 1}`}
                  </h3>
                  <p className="text-[#1A1A1A]/70 text-lg font-light leading-relaxed">
                    {specs[activeTab]?.desc || "Meticulously crafted to maximize space, light, and natural airflow."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#D8D6D0] p-6 rounded-2xl transition-all hover:border-[#B9A089]">
                    <div className="text-xs text-[#A6A79f] uppercase tracking-widest mb-2 font-medium">Total Area</div>
                    <div className="text-2xl font-cormorant text-[#1A1A1A]">{specs[activeTab]?.area || "Custom"}</div>
                  </div>
                  <div className="bg-white border border-[#D8D6D0] p-6 rounded-2xl transition-all hover:border-[#A6A79f]">
                    <div className="text-xs text-[#A6A79f] uppercase tracking-widest mb-2 font-medium">Starting From</div>
                    <div className="text-2xl font-cormorant text-[#1A1A1A]">{specs[activeTab]?.price || "On Request"}</div>
                  </div>
                </div>

                <button className="w-full bg-[#1A1A1A] text-[#F8F8F3] hover:bg-[#2D2D2D] py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300 shadow-lg">
                  <Download size={18} />
                  <span>Download Floor Plan</span>
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}