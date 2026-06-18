"use client";
import { motion } from "framer-motion";

export function Location({
  heading,
  subtext,
  imageUrl
}: {
  heading: string;
  subtext: string;
  imageUrl?: string;
}) {
  const finalImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="relative bg-[#f7f5f1] overflow-hidden">

      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-black/[0.03] blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="grid md:grid-cols-2 min-h-screen relative z-10">

        {/* Left */}
        <div className="flex items-center px-8 md:px-24 py-24">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-xl"
          >

            <span className="uppercase tracking-[0.45em] text-[10px] text-black/35 block mb-10">
              Prime Destination
            </span>

            <h2 className="text-5xl md:text-7xl tracking-[-0.05em] leading-[0.95] font-light text-black">
              {heading}
            </h2>

            <div className="w-20 h-px bg-black/15 my-10" />

            <p className="text-black/50 leading-[2.2] tracking-[0.08em] text-sm uppercase">
              {subtext}
            </p>

            <motion.button
              whileHover={{ x: 8 }}
              className="mt-16 flex items-center gap-5 group"
            >
              <span className="uppercase tracking-[0.35em] text-[10px] text-black/45 group-hover:text-black transition-colors">
                Explore Location
              </span>

              <div className="w-12 h-px bg-black/20 group-hover:w-20 transition-all duration-500" />
            </motion.button>

          </motion.div>
        </div>

        {/* Right */}
        <div className="relative p-6 md:p-12 flex items-center">

          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6 }}
            className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden"
          >

            <img
              src={finalImage}
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute inset-6 border border-white/20 pointer-events-none" />

          </motion.div>
        </div>

      </div>
    </section>
  );
}