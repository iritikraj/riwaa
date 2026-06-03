"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#050505] text-white pt-40 pb-16">

      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-white/3 blur-3xl rounded-full -translate-x-1/2" />

      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* Top */}
        <div className="flex flex-col lg:flex-row justify-between gap-20 mb-32">

          {/* Left */}
          <div className="max-w-2xl">

            <motion.span
              initial={{ opacity: 0, letterSpacing: "1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="block text-[10px] uppercase tracking-[0.35em] text-white/35 mb-8 font-jost"
            >
              Artificial Intelligence Meets Luxury Real Estate
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4 }}
              className="text-5xl leading-[1.2] tracking-normal font-light"
            >
              Curating Extraordinary Digital Property Experiences.
            </motion.h2>

          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-14 font-jost">

            <div>
              <h3 className="uppercase tracking-[0.35em] text-[10px] text-white/35 mb-8">
                Navigation
              </h3>

              <div className="space-y-5">
                {["Home", "Projects", "Luxury Living", "Contact"].map(
                  (item, i) => (
                    <motion.a
                      key={i}
                      whileHover={{ x: 6 }}
                      href="#"
                      className="block text-white/55 hover:text-white transition-all duration-500 text-sm uppercase tracking-[0.15em]"
                    >
                      {item}
                    </motion.a>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.35em] text-[10px] text-white/35 mb-8">
                Connect
              </h3>

              <div className="space-y-5">
                {[
                  "Instagram",
                  "LinkedIn",
                  "YouTube",
                  "Behance"
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ x: 6 }}
                    href="#"
                    className="block text-white/55 hover:text-white transition-all duration-500 text-sm uppercase tracking-[0.15em]"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-white blur-md opacity-50" />
            </div>

            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 font-jost">
              RIWAA Intelligence © 2026
            </p>
          </div>

          <p className="text-white/25 uppercase tracking-[0.25em] text-[10px] font-jost">
            Crafted For Visionary Real Estate Brands
          </p>

        </div>
      </div>
    </footer>
  );
}