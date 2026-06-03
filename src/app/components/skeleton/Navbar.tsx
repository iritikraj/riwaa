"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed top-0 left-0 w-full z-[120] px-6 md:px-10 py-6"
    >
      <div className="max-w-7xl mx-auto">

        <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/20 backdrop-blur-2xl">

          {/* Ambient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

          <div className="relative flex items-center justify-between px-6 md:px-8 py-4">

            {/* Logo */}
            <motion.div
              whileHover={{ opacity: 0.8 }}
              className="flex items-center gap-4 cursor-pointer"
            >
              <Image
                src="/riwa-logo.png"
                height={32}
                width={32}
                alt="logo"
                className="object-contain"
                style={{
                  background: "transparent",
                }}
              />

              <div>
                <h1 className="text-sm md:text-base uppercase tracking-[0.4em] text-white font-jost">
                  RIWAA
                </h1>

                <p className="text-white/70 text-[9px] tracking-[0.25em] uppercase font-light font-jost">
                  By Solvetude
                </p>
              </div>
            </motion.div>

            {/* Center Links */}
            <div className="hidden lg:flex items-center gap-10">

              {["Residences", "Amenities", "Locations", "Collections"].map(
                (item, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -2 }}
                    href="#"
                    className="group relative text-[10px] uppercase tracking-[0.35em] text-white/45 hover:text-white transition-all duration-500"
                  >
                    {item}

                    <span className="absolute -bottom-2 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
                  </motion.a>
                )
              )}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-full border border-white/10 bg-white px-5 md:px-7 py-3 text-[10px] uppercase tracking-[0.35em] text-black transition-all duration-500 hover:bg-neutral-200"
            >
              <span className="relative z-10 flex items-center gap-3 font-jost">
                Begin Experience

                <svg
                  className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 12h14m-6-6 6 6-6 6"
                  />
                </svg>
              </span>
            </motion.button>

          </div>
        </div>
      </div>
    </motion.header>
  );
}