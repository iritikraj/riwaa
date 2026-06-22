/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

export function AgentMediaVersionTwo({
  data,
  isEditable = false,
  onUpdate,
}: any) {
  if (!data || data.length === 0) return null;

  const safeData = data || [];

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-24 md:py-32 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-16 max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Editorial Features
          </div>

          <h2 className="max-w-2xl font-sans text-[40px] font-light leading-[1.02] tracking-[-0.04em] text-white md:text-[68px]">
            Media
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              Public Presence
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            A clean archive of mentions and visibility presented in a uniform publication grid.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {safeData.map((item: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.75, delay: idx * 0.05 }}
              className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.06]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-violet-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Newspaper size={14} className="text-cyan-300" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                      Feature {idx + 1}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    {isEditable ? (
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const d = [...safeData];
                          d[idx].year = e.target.value;
                          onUpdate("mediaPresence", d);
                        }}
                        className="w-16 bg-transparent text-right outline-none text-[10px] uppercase tracking-[0.28em] text-slate-400"
                      />
                    ) : (
                      item.year
                    )}
                  </span>
                </div>

                <div className="mb-4 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300 w-fit">
                  {isEditable ? (
                    <input
                      type="text"
                      value={item.publication}
                      onChange={(e) => {
                        const d = [...safeData];
                        d[idx].publication = e.target.value;
                        onUpdate("mediaPresence", d);
                      }}
                      className="w-28 bg-transparent outline-none text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100"
                    />
                  ) : (
                    item.publication
                  )}
                </div>

                <div className="flex-1">
                  {isEditable ? (
                    <textarea
                      value={item.headline}
                      onChange={(e) => {
                        const d = [...safeData];
                        d[idx].headline = e.target.value;
                        onUpdate("mediaPresence", d);
                      }}
                      className="min-h-[160px] w-full resize-none bg-transparent outline-none font-sans text-[18px] leading-[1.7] tracking-[-0.02em] text-white md:text-[20px]"
                      rows={5}
                    />
                  ) : (
                    <h4 className="font-sans text-[18px] leading-[1.7] tracking-[-0.02em] text-white md:text-[20px]">
                      “{item.headline}”
                    </h4>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                      onClick={() => window.open(item.link, "_blank")}
                    >
                      Read More →
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-px w-12 bg-white/15" />
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <div className="h-px flex-1 bg-white/15" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}