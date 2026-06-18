"use client";

import { motion } from "framer-motion";
import {
  Wind,
  Sun,
  Shield,
  Leaf,
  ArrowUpRight,
} from "lucide-react";

export function VersionTwo({
  heading,
  items,
}: {
  heading?: string;
  items?: string[];
}) {
  // SAFE FALLBACKS
  const safeHeading = heading || "Curated Experiences";

  const safeItems = items?.length
    ? items
    : [
      "Smart Home Integration",
      "Wellness Spa Access",
      "Infinity Pool",
      "State-of-the-art Fitness",
      "24/7 Concierge",
      "Eco-Conscious Design",
    ];

  const icons = [Wind, Sun, Shield, Leaf];

  const accentStyles = [
    {
      bg: "from-[#D8D2C7] to-[#F3EFE8]",
      glow: "bg-[#D8D2C7]/30",
      icon: "text-[#8C8375]",
    },
    {
      bg: "from-[#D9C4A9] to-[#F8F2EB]",
      glow: "bg-[#D9C4A9]/30",
      icon: "text-[#B28A62]",
    },
    {
      bg: "from-[#D8DEE6] to-[#F5F7FA]",
      glow: "bg-[#D8DEE6]/30",
      icon: "text-[#728197]",
    },
    {
      bg: "from-[#D6DDD2] to-[#F4F7F2]",
      glow: "bg-[#D6DDD2]/30",
      icon: "text-[#66745E]",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8F8F3] py-24 md:py-32 text-[#1A1A1A]">
      {/* Ambient Background */}
      <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-[#DDD3C4]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-[#D9D4C9] bg-white/80 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-[#8A877F] shadow-sm backdrop-blur-xl">
            Elevated Lifestyle
          </div>

          <h2 className="text-4xl font-cormorant font-medium tracking-tight md:text-6xl">
            {safeHeading}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#1A1A1A]/55 md:text-base">
            Every amenity is designed with intention — blending modern
            functionality, wellness, and timeless sophistication into one
            seamless living experience.
          </p>
        </div>

        {/* Bento Luxury Grid */}
        <div className="grid auto-rows-[260px] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {safeItems.slice(0, 6).map((item, i) => {
            const Icon = icons[i % icons.length];
            const style = accentStyles[i % accentStyles.length];

            // FEATURED BIG CARDS
            const isLarge =
              i === 0 || i === 3;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                }}
                className={`group relative overflow-hidden rounded-[32px] border border-white/40 bg-white/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(0,0,0,0.08)]
                  
                  ${isLarge
                    ? "md:col-span-2"
                    : ""
                  }
                `}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-[0.14]`}
                />

                {/* Glow */}
                <div
                  className={`absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${style.glow}`}
                />

                <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-sm backdrop-blur-md`}
                    >
                      <Icon
                        className={style.icon}
                        size={28}
                      />
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8D6D0] bg-white/80 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {/* Bottom */}
                  <div>
                    <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/35">
                      Premium Feature
                    </div>

                    <h3
                      className={`font-cormorant leading-tight tracking-tight ${isLarge
                          ? "text-3xl md:text-4xl"
                          : "text-2xl"
                        }`}
                    >
                      {item}
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#1A1A1A]/55">
                      Thoughtfully crafted to elevate everyday living through
                      refined comfort, intelligent design, and effortless
                      functionality.
                    </p>
                  </div>
                </div>

                {/* Hover Shine */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -left-1/2 top-0 h-full w-1/3 rotate-12 bg-white/20 blur-2xl transition-all duration-1000 group-hover:left-[120%]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}