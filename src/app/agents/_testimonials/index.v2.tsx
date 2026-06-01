"use client";

import { motion } from "framer-motion";

export function AgentTestimonialsVersionTwo({
  data,
  isEditable = false,
  onUpdate,
}: any) {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-24 md:py-32 text-white">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-20 max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Client Endorsements
          </div>

          <h2 className="font-sans text-[40px] md:text-[68px] leading-[1.02] tracking-[-0.04em] font-light">
            Trusted By
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              Distinguished Clients
            </span>
          </h2>
        </motion.div>

        <div className="divide-y divide-white/10">

          {data.map((item: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: idx * 0.08,
              }}
              className="py-14"
            >
              <div className="grid lg:grid-cols-[140px_1fr] gap-8 lg:gap-14">

                {/* Index */}
                <div className="flex items-start">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">
                    0{idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div>

                  {isEditable ? (
                    <textarea
                      value={item.quote}
                      onChange={(e) => {
                        const d = [...data];
                        d[idx].quote = e.target.value;
                        onUpdate("testimonials", d);
                      }}
                      rows={4}
                      className="
                    w-full
                    bg-transparent
                    outline-none
                    resize-none
                    text-[24px]
                    md:text-[34px]
                    leading-[1.6]
                    tracking-[-0.03em]
                    font-light
                    text-white
                  "
                    />
                  ) : (
                    <p className="
                  text-[24px]
                  md:text-[34px]
                  leading-[1.6]
                  tracking-[-0.03em]
                  font-light
                  text-white
                  max-w-4xl
                ">
                      “{item.quote}”
                    </p>
                  )}

                  <div className="mt-10 flex items-center gap-5">

                    <div className="h-px w-12 bg-cyan-300/40" />

                    <div>

                      {isEditable ? (
                        <>
                          <input
                            value={item.clientName}
                            onChange={(e) => {
                              const d = [...data];
                              d[idx].clientName = e.target.value;
                              onUpdate("testimonials", d);
                            }}
                            className="
                          block
                          bg-transparent
                          outline-none
                          text-[11px]
                          uppercase
                          tracking-[0.35em]
                          text-cyan-200
                          mb-2
                        "
                          />

                          <input
                            value={item.clientTitle}
                            onChange={(e) => {
                              const d = [...data];
                              d[idx].clientTitle = e.target.value;
                              onUpdate("testimonials", d);
                            }}
                            className="
                          block
                          bg-transparent
                          outline-none
                          text-sm
                          text-slate-400
                        "
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-200 mb-2">
                            {item.clientName}
                          </div>

                          <div className="text-sm text-slate-400">
                            {item.clientTitle}
                          </div>
                        </>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}