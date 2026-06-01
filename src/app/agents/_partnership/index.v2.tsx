"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

export function AgentPartnershipsVersionTwo({ data, isEditable = false, onUpdate }: any) {
  const safeData = data || [];

  if (!isEditable && safeData.length === 0) return null;

  const handleAdd = () => {
    if (onUpdate) {
      onUpdate("partnerships", [...safeData, "New Partner"]);
    }
  };

  const handleRemove = (idx: number) => {
    if (onUpdate) {
      const newData = [...safeData];
      newData.splice(idx, 1);
      onUpdate("partnerships", newData);
    }
  };

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
            Strategic Alliances
          </div>

          <h2 className="max-w-2xl font-sans text-[40px] font-light leading-[1.02] tracking-[-0.04em] text-white md:text-[68px]">
            Developer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              Partnership Network
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            A curated network of official relationships and development alliances presented in an editorial format.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block" />

          <div className="space-y-6">
            {safeData.map((partner: string, idx: number) => {
              const leftSide = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.75, delay: idx * 0.06 }}
                  className="grid gap-4 lg:grid-cols-[1fr_120px_1fr] lg:items-center"
                >
                  <div
                    className={[
                      "relative",
                      leftSide ? "lg:col-start-1 lg:pr-8" : "lg:col-start-3 lg:pl-8",
                    ].join(" ")}
                  >
                    <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.06]">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-transparent to-violet-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {isEditable && (
                        <button
                          onClick={() => handleRemove(idx)}
                          className="absolute right-4 top-4 z-20 rounded-full border border-red-400/20 bg-red-400/10 p-2 text-red-200 opacity-0 transition-opacity hover:bg-red-400/15 group-hover:opacity-100"
                          title="Remove Partner"
                        >
                          <X size={14} />
                        </button>
                      )}

                      <div className="relative flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                          0{idx + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <div className="h-px w-10 bg-white/10" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                              Developer Partner
                            </span>
                          </div>

                          {isEditable ? (
                            <input
                              type="text"
                              value={partner}
                              onChange={(e) => {
                                const newData = [...safeData];
                                newData[idx] = e.target.value;
                                onUpdate("partnerships", newData);
                              }}
                              className="w-full bg-transparent text-[16px] font-medium tracking-[-0.01em] text-white outline-none placeholder:text-slate-500"
                            />
                          ) : (
                            <span className="block text-[16px] font-medium tracking-[-0.01em] text-white">
                              {partner}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:col-start-2 lg:flex items-center justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0b1020] shadow-[0_0_0_8px_rgba(255,255,255,0.03)]">
                      <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_0_10px_rgba(34,211,238,0.12)]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isEditable && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-10"
              >
                <button
                  onClick={handleAdd}
                  className="group flex w-full items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-xl transition-colors hover:border-cyan-300/20 hover:bg-white/[0.06]"
                >
                  <Plus size={14} className="transition-transform group-hover:scale-110" />
                  Add Partnership
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}