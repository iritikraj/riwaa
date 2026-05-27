"use client";

import { motion } from "framer-motion";

export function AgentPartnerships({ data, isEditable = false, onUpdate }: any) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">Strategic Alliances</div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            Official Developer Partnerships
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-[#e7dccd] bg-[#e7dccd] overflow-hidden">
          {data.map((partner: string, idx: number) => (
            <div
              key={idx}
              className="group relative bg-[#fbf8f3] px-6 py-6 md:px-8 md:py-7 transition-all duration-500 hover:bg-white"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#b8924a]/0 via-[#b8924a]/0 to-[#b8924a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center gap-4">
                {/* Text */}
                <div className="min-w-0">
                  {isEditable ? (
                    <input
                      type="text"
                      value={partner}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[idx] = e.target.value;
                        onUpdate(
                          "partnerships",
                          newData
                        );
                      }}
                      className="w-full bg-transparent outline-none font-jost text-[13px] md:text-[14px] uppercase tracking-[0.18em] text-[#1a1a1a] font-medium"
                    />
                  ) : (
                    <span className="block font-jost text-[13px] md:text-[14px] uppercase tracking-[0.18em] text-[#1a1a1a] font-medium">
                      {partner}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}