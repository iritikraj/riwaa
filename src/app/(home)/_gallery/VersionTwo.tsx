"use client";

import { motion } from "framer-motion";

export function VersionTwo({
  heading,
  galleryImages,
}: {
  heading?: string;
  galleryImages?: string[];
}) {
  const images = galleryImages?.length
    ? galleryImages
    : [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    ];

  return (
    <section className="relative overflow-hidden bg-[#111111] py-24 md:py-32 text-[#F8F8F3]">
      {/* Ambient Glow */}
      <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-white/3 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/3 px-5 py-2 backdrop-blur-xl">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#A6A79f]">
              Bespoke Aesthetics
            </span>
          </div>

          <h2 className="text-4xl font-cormorant font-medium tracking-tight md:text-6xl">
            {heading || "Craftsmanship & Detail"}
          </h2>

          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[#A6A79f]/50 to-transparent" />
        </div>

        {/* Modern Asymmetrical Gallery */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-2">
          {/* Left Tall Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="group relative overflow-hidden rounded-[36px] border border-white/10 lg:col-span-7 lg:row-span-2 h-[700px]"
          >
            <img
              src={images[0]}
              alt="Feature"
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 grayscale-[15%]"
            />

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Floating Blur */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="w-fit rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-xl">
                <span className="text-[11px] uppercase tracking-[0.35em] text-white/80">
                  Signature Finish
                </span>
              </div>
            </div>
          </motion.div>

          {/* Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 h-[340px] lg:col-span-5"
          >
            <img
              src={images[1]}
              alt="Detail"
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale-[20%]"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/40" />

            {/* Corner Accent */}
            <div className="absolute right-5 top-5 h-16 w-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl" />
          </motion.div>

          {/* Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 h-[340px] lg:col-span-5"
          >
            <img
              src={images[2]}
              alt="Detail"
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 grayscale-[20%]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Decorative Lines */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-2">
              <div className="h-0.5 w-14 bg-white/60" />
              <div className="h-0.5 w-8 bg-white/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}