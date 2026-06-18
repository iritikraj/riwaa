/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";

export function Amenities({ heading, items }: any) {
  return (
    <section className="bg-[#faf9f6] py-36 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Top */}
        <div className="mb-24 flex flex-col lg:flex-row justify-between gap-12">

          <div className="max-w-2xl">
            <span className="text-[10px] tracking-[0.45em] uppercase text-black/40 block mb-6">
              Luxury Amenities
            </span>

            <h2 className="text-5xl md:text-7xl leading-[0.95] tracking-[-0.05em] font-light text-black">
              {heading}
            </h2>
          </div>

          <p className="max-w-sm text-black/45 leading-loose uppercase tracking-[0.2em] text-xs">
            Every detail crafted to elevate modern luxury living into an immersive experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-[1px] bg-black/10">

          {items.map((item: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.8 }}
              className="group bg-[#faf9f6] p-10 md:p-14 relative overflow-hidden"
            >

              {/* Gradient Hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-black/[0.03] to-transparent"
              />

              <div className="relative z-10">

                <span className="text-black/20 text-sm mb-12 block">
                  {(i + 1).toString().padStart(2, "0")}
                </span>

                <h3 className="text-3xl md:text-4xl font-light tracking-[-0.03em] text-black leading-tight">
                  {item}
                </h3>

                <div className="mt-14 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="w-8 h-px bg-black/30" />
                  <span className="uppercase tracking-[0.35em] text-[10px] text-black/40">
                    Premium Feature
                  </span>
                </div>

              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}