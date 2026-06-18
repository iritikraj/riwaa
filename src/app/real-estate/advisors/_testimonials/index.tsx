"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function AgentTestimonials({
  data,
  isEditable = false,
  onUpdate,
}: any) {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#171717] py-28 md:py-36 text-white">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-[#b8924a]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#fff 0.7px, transparent 0.7px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-24"
        >

          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">
            Client Experiences
          </div>

          <h2 className="font-cormorant text-4xl md:text-5xl font-light tracking-[-0.03em]">
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8924a] via-[#d6b57a] to-[#8c6b35]">
              {" "}Distinguished Clients
            </span>
          </h2>

          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>

        </motion.div>

        {/* Testimonials */}
        <div className="space-y-10">

          {data.map((item: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
                delay: idx * 0.1,
              }}
              className="relative border border-white/10 bg-white/3 backdrop-blur-xl p-8 md:p-12"
            >

              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-[0.08]">
                <Quote
                  size={90}
                  strokeWidth={1}
                />
              </div>

              {/* Quote */}
              <div className="relative z-10 max-w-4xl">

                {isEditable ? (
                  <textarea
                    value={item.quote}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[idx].quote = e.target.value;
                      onUpdate(
                        "testimonials",
                        newData
                      );
                    }}
                    rows={4}
                    className="w-full resize-none bg-transparent outline-none font-cormorant text-[24px] leading-normal tracking-[-0.02em] text-[#f3efe8] font-light"
                  />
                ) : (
                  <p className="font-cormorant text-[24px] leading-normal tracking-[-0.02em] text-[#f3efe8] font-light pr-12">
                    “{item.quote}”
                  </p>
                )}

              </div>

              {/* Bottom Row */}
              <div className="relative z-10 mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                {/* Client Info */}
                <div>

                  {isEditable ? (
                    <>
                      <input
                        type="text"
                        value={item.clientName}
                        onChange={(e) => {
                          const d = [...data];
                          d[idx].clientName =
                            e.target.value;

                          onUpdate(
                            "testimonials",
                            d
                          );
                        }}
                        className="bg-transparent outline-none text-[11px] uppercase tracking-[0.32em] text-[#b8924a] font-medium"
                      />

                      <input
                        type="text"
                        value={item.clientTitle}
                        onChange={(e) => {
                          const d = [...data];
                          d[idx].clientTitle =
                            e.target.value;

                          onUpdate(
                            "testimonials",
                            d
                          );
                        }}
                        className="bg-transparent outline-none text-sm text-[#8d877f] mt-3 w-full"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] uppercase tracking-[0.32em] text-[#b8924a] font-medium mb-3">
                        {item.clientName}
                      </div>

                      <div className="text-sm text-[#8d877f]">
                        {item.clientTitle}
                      </div>
                    </>
                  )}

                </div>

                {/* Decorative Line */}
                <div className="hidden md:flex items-center gap-3 opacity-60">

                  <div className="w-12 h-px bg-[#5a4a35]" />

                  <div className="w-1.5 h-1.5 rounded-full bg-[#b8924a]" />

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}