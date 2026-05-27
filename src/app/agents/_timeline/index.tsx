"use client";

import { motion } from "framer-motion";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export function AgentTimeline({
  timeline,
}: {
  timeline?: TimelineItem[];
}) {
  const safeTimeline = timeline?.length
    ? timeline
    : [
      {
        year: "2006",
        title: "Entered the Market",
        description:
          "Joined a premier residential brokerage during the initial expansion cycle, ranking in the top tier within the first twelve months.",
      },
      {
        year: "2012",
        title: "Regulatory Credentials & $100M Portfolio",
        description:
          "Secured top-tier investment diplomas and pivoted exclusively into high-net-worth portfolio management.",
      },
      {
        year: "2018",
        title: "Established Independent Advisory",
        description:
          "Founded a boutique private practice specializing in off-market property acquisition and institutional land banking.",
      },
      {
        year: "2025",
        title: "Record Achievement Milestone",
        description:
          "Recognized as a leading wealth advisory figure across major Middle Eastern publication lists.",
      },
    ];

  return (
    <section className="relative overflow-hidden bg-[#f8f5ef] py-32 text-[#1a1a1a]">

      {/* Ambient */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#000 0.8px, transparent 0.8px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#b8924a]/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">Professional Journey</div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            A Legacy Built Deal by Deal
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>
        {/* Editorial Timeline */}
        <div className="relative">
          {/* subtle center line */}
          <div className="absolute left-[90px] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#d8cab3] to-transparent md:block" />
          <div className="space-y-24">
            {safeTimeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                }}
                className="grid gap-8 md:grid-cols-[120px_1fr]"
              >
                {/* Year */}
                <div className="relative">
                  <div className="sticky top-24">
                    <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#9a8f80] font-jost font-medium">
                      {item.year}
                    </div>
                    <div className="hidden md:block h-3 w-3 rounded-full bg-[#b8924a] shadow-[0_0_0_6px_rgba(184,146,74,0.12)]" />
                  </div>
                </div>
                {/* Content */}
                <div className="border-t border-[#dfd3c2] pt-10">
                  <div className="max-w-3xl">
                    <h3 className="mb-5 font-cormorant text-base md:text-2xl leading-[1.1] tracking-[-0.04em] font-light">
                      {item.title || "Career Milestone"}
                    </h3>
                    <p className="max-w-2xl text-[15px] leading-[1.9] text-[#6f675d] font-jost">
                      {item.description ||
                        "Continued excellence and strategic growth within the luxury real estate sector."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}