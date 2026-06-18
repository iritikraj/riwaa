"use client";

import { motion } from "framer-motion";

export function Gallery({ heading, galleryImages }: { heading: string; galleryImages: string[] }) {
  return (
    <section className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-cormorant italic text-white mb-12 tracking-widest uppercase"
        >
          {heading || "Curated Spaces"}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[800px]">
          {/* Large Feature Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-8 relative overflow-hidden group"
          >
            <img
              src={galleryImages[0]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Luxury Interior"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </motion.div>

          {/* Side Stack */}
          <div className="md:col-span-4 grid grid-rows-2 gap-4">
            {galleryImages.slice(1, 3).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative overflow-hidden group"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Detail"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}