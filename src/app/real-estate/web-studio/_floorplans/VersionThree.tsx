"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowLeft, ArrowRight } from "lucide-react";

export function VersionThree({
  heading,
  floorPlans,
}: {
  heading?: string;
  floorPlans?: string[];
}) {
  const plans = floorPlans?.length
    ? floorPlans
    : [
      "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd27?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    ];

  const [active, setActive] = useState(0);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % plans.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + plans.length) % plans.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#F8F8F3] py-24 md:py-32 text-[#1A1A1A]">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-[#d8c8b0]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <span className="mb-4 text-xs uppercase tracking-[0.35em] text-[#A6A79f]">
            Luxury Floor Plans
          </span>

          <h2 className="max-w-4xl text-4xl font-cormorant font-medium tracking-tight md:text-6xl">
            {heading || "Spatial Intelligence"}
          </h2>

          <div className="mt-8 h-px w-24 bg-[#C9C6BD]" />
        </div>

        {/* Main Layout */}
        <div className="grid items-center gap-10 lg:grid-cols-[420px,1fr]">
          {/* Left Panel */}
          <div className="relative rounded-[32px] border border-[#E7E4DA] bg-white/70 p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-[#A6A79f]">
                <span className="text-sm tracking-[0.3em] uppercase">
                  Layout
                </span>

                <div className="mt-2 text-5xl font-cormorant">
                  {String(active + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevSlide}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7D3CA] bg-white transition-all hover:scale-105 hover:border-[#B9A089]"
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  onClick={nextSlide}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7D3CA] bg-white transition-all hover:scale-105 hover:border-[#B9A089]"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <h3 className="mb-5 text-3xl font-cormorant leading-tight">
              Signature Residence Layout
            </h3>

            <p className="mb-10 text-[15px] leading-relaxed text-[#1A1A1A]/60">
              Thoughtfully designed spaces that balance openness,
              functionality, and elegance. Each layout enhances natural
              movement, daylight, and luxurious living experiences.
            </p>

            {/* Specs Table */}
            <div className="mb-10 overflow-hidden rounded-2xl border border-[#ECE9E0]">
              {[
                ["Configuration", "3 BHK Premium"],
                ["Area", "2,450 sq.ft"],
                ["Facing", "East & West"],
                ["Balcony", "Sky Deck"],
              ].map((item, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-2 border-b border-[#ECE9E0] last:border-0`}
                >
                  <div className="bg-[#F8F6F0] px-5 py-4 text-sm text-[#1A1A1A]/50">
                    {item[0]}
                  </div>

                  <div className="px-5 py-4 text-sm font-medium">
                    {item[1]}
                  </div>
                </div>
              ))}
            </div>

            {/* Download */}
            <button className="group inline-flex items-center gap-3 rounded-full border border-[#1A1A1A] px-6 py-3 text-xs uppercase tracking-[0.25em] transition-all hover:bg-[#1A1A1A] hover:text-white">
              <span>Download Specs</span>

              <Download
                size={15}
                className="transition-transform duration-300 group-hover:translate-y-[2px]"
              />
            </button>

            {/* Pagination */}
            <div className="mt-10 flex gap-2">
              {plans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-[4px] rounded-full transition-all duration-300 ${active === i
                      ? "w-12 bg-[#1A1A1A]"
                      : "w-6 bg-[#D4D0C8]"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#EAE4D8] to-transparent opacity-40 blur-2xl" />

            <div className="relative overflow-hidden rounded-[40px] border border-[#E5E1D8] bg-white/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={plans[active]}
                    alt={`Floor Plan ${active + 1}`}
                    className="h-full w-full rounded-[28px] object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Preview Cards */}
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
              {plans.map((plan, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative min-w-[120px] overflow-hidden rounded-2xl border transition-all duration-300 ${active === i
                      ? "border-[#1A1A1A] scale-[1.02]"
                      : "border-[#E5E1D8] opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={plan}
                    alt={`Preview ${i + 1}`}
                    className="h-24 w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}