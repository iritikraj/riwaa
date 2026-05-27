"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function VersionFour({ heading, items, imageUrl }: { heading: string; items: string[]; imageUrl?: string }) {
  // Cinematic background
  const bgImage = imageUrl || "https://images.unsplash.com/photo-1546412414-8035e1776c9a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="relative py-32 bg-[#1A1A1A] overflow-hidden font-jost">

      {/* Background Image with Heavy Gradient */}
      <div className="absolute inset-0">
        <img src={bgImage} alt="Luxury Background" className="w-full h-full object-cover opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1A]/95 via-[#1A1A1A]/80 to-[#1A1A1A]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Dark Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#D8D6D0]/10 p-10 md:p-12 rounded-[32px] shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#B9A089]/20 border border-[#B9A089]/30 flex items-center justify-center">
                <span className="text-[#F8F8F3] font-cormorant italic text-lg">TL</span>
              </div>
              <div>
                <p className="text-xs text-[#D9D5C9] uppercase tracking-widest">Exclusive Access</p>
                <p className="text-sm text-[#D9D5C9]/70">Premium Wellness Residences</p>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-cormorant text-[#F8F8F3] mb-8 leading-tight">
              {heading}
            </h2>

            <p className="text-lg text-[#D9D5C9]/80 mb-10 leading-relaxed font-light">
              Spaces designed to nurture balance, serenity, and well-being — physically and emotionally. Because true luxury begins with how you feel.
            </p>

            {/* List */}
            <div className="grid sm:grid-cols-2 gap-6">
              {items?.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#F8F8F3]">
                  <Check size={18} className="text-[#A6A79f]" />
                  <span className="text-sm font-light">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Floating List (Clean Typographic) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex flex-col gap-8 pl-12"
          >
            {items?.slice(4, 7).map((item, i) => (
              <div key={i} className="border-b border-[#D8D6D0]/20 pb-8 group cursor-default">
                <p className="text-xs text-[#A6A79f] tracking-widest uppercase mb-3 font-medium transition-colors group-hover:text-[#F8F8F3]">
                  0{i + 1} / Privilege
                </p>
                <h4 className="text-[#D9D5C9] font-cormorant text-2xl transition-colors group-hover:text-[#F8F8F3]">{item}</h4>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}