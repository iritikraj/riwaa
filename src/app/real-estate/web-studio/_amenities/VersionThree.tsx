"use client";
import { motion } from "framer-motion";
import { Dumbbell, Activity, CheckCircle, Home } from "lucide-react";

export function VersionThree({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section className="py-24 md:py-32 bg-[#F8F8F3] font-jost text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex px-4 py-1.5 border border-[#B9A089] rounded-full text-[#B9A089] text-sm font-medium mb-6">
              Wellness Standard
            </div>
            <h2 className="text-4xl md:text-5xl font-cormorant font-medium mb-6 leading-tight">{heading}</h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#B9A089] to-transparent mb-8" />

            <p className="text-lg text-[#1A1A1A]/70 mb-8 leading-relaxed font-light">
              From wellness sanctuaries to intelligent home technology — every detail is curated for meaningful living. Experience amenities designed for privacy, convenience, and holistic well-being.
            </p>

            {/* Left mini-list */}
            <div className="space-y-4">
              {items?.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#1A1A1A]/80">
                  <CheckCircle size={18} className="text-[#A6A79f]" />
                  <span className="font-medium text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Bento Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            <div className="bg-white p-6 rounded-2xl border border-[#D8D6D0] hover:border-[#A6A79f] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#A6A79f]/10 text-[#A6A79f] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <h4 className="text-center font-cormorant font-medium mb-1">{items[3] || "Infinity Pool"}</h4>
              <p className="text-center text-xs text-[#B3B7Bf]">Temperature-controlled</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#D8D6D0] hover:border-[#B9A089] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[#B9A089]/10 text-[#B9A089] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Dumbbell size={20} />
              </div>
              <h4 className="text-center font-cormorant font-medium mb-1">{items[4] || "Fitness Studio"}</h4>
              <p className="text-center text-xs text-[#B3B7Bf]">State-of-the-art equipment</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#D8D6D0] hover:border-[#B3B7Bf] transition-colors col-span-2 group flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#B3B7Bf]/10 text-[#B3B7Bf] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                <Home size={20} />
              </div>
              <div>
                <h4 className="font-cormorant font-medium mb-1">{items[5] || "Smart Integration"}</h4>
                <p className="text-sm text-[#B3B7Bf]">Integrated automation for comfort and energy efficiency</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}