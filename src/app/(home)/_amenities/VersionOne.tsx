"use client";
import { motion } from "framer-motion";
import { Leaf, Sparkles, Check } from "lucide-react";

export function VersionOne({ heading, items, imageUrl }: { heading: string; items: string[]; imageUrl?: string }) {
  // Use user's global image if passed, otherwise luxury fallback
  const featureImage = imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="py-24 md:py-32 bg-[#F8F8F3] font-jost text-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#A6A79f] rounded-full text-[#A6A79f] text-sm font-medium mb-6">
              Treppan Philosophy
            </div>

            <h2 className="text-4xl md:text-5xl font-cormorant font-medium mb-6 leading-tight tracking-tight">
              {heading}
            </h2>

            {/* The signature decorative line */}
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#A6A79f] to-transparent mb-8" />

            <p className="text-lg mb-10 leading-relaxed text-[#1A1A1A]/70 font-light">
              Representing a new paradigm in residential landscapes — harmonizing environmental responsibility with human-centered design.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {items?.slice(0, 4).map((item, i) => (
                <div key={i} className="bg-white border border-[#D8D6D0] p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#A6A79f] hover:shadow-[0_12px_32px_rgba(166,167,159,0.12)]">
                  <div className="flex items-start gap-3">
                    <Check size={18} className="text-[#A6A79f] mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-[#1A1A1A]/80 leading-snug">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image with Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/80 backdrop-blur-md border border-[#D8D6D0]/30 rounded-3xl overflow-hidden shadow-lg p-2">
              <img src={featureImage} alt="Lifestyle" className="w-full h-125 object-cover rounded-2xl grayscale-[10%]" />
            </div>

            {/* Floating Glass Pillars */}
            <div className="absolute -left-6 -top-6 bg-white/80 backdrop-blur-md border border-[#D8D6D0]/50 rounded-full p-4 shadow-[0_8px_32px_rgba(26,26,26,0.08)]">
              <div className="w-16 h-16 rounded-full bg-[#A6A79f]/10 border border-[#A6A79f]/20 flex items-center justify-center">
                <Leaf className="text-[#A6A79f]" size={24} />
              </div>
            </div>

            <div className="absolute -right-6 -bottom-6 bg-white/80 backdrop-blur-md border border-[#D8D6D0]/50 rounded-full p-4 shadow-[0_8px_32px_rgba(26,26,26,0.08)]">
              <div className="w-16 h-16 rounded-full bg-[#B9A089]/10 border border-[#B9A089]/20 flex items-center justify-center">
                <Sparkles className="text-[#B9A089]" size={24} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}