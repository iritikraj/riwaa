/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";

export function Hero({ heading, subtext, imageUrl }: any) {
  const finalImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2400&auto=format&fit=crop";

  return (
    <section className="relative h-screen overflow-hidden bg-[#050505] text-white">

      {/* Background */}
      <motion.img
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3 }}
        src={finalImage}
        className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
      />

      <div className="absolute inset-0 bg-black/50" />

      {/* Ambient Glows */}
      <motion.div
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity
        }}
        className="absolute top-1/2 left-1/2 w-175 h-175 bg-white/4 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      />

      {/* Glass Card */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, y: 0, backdropFilter: "blur(20px)" }}
          transition={{ duration: 1.4 }}
          className="max-w-5xl border border-white/10 bg-white/3 rounded-[40px] p-10 md:p-20 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
        >

          <div className="flex justify-center mb-8">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/3 text-[10px] tracking-[0.35em] uppercase text-white/50">
              AI Curated Collection
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.3 }}
            className="text-center text-5xl md:text-8xl leading-[0.95] tracking-[-0.04em] font-light"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 max-w-2xl mx-auto text-white/55 leading-loose uppercase tracking-[0.22em] text-sm"
          >
            {subtext}
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}