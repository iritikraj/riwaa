/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Landmark, Building2, Quote, Plus } from "lucide-react";
import { EditableText } from "../_editable-text";

interface ExpertiseData {
  areas?: string[];
  propertyTypes?: string[];
  marketQuote?: string;
}

export function AgentExpertiseVersionTwo({
  data,
  isEditable = false,
  onUpdate,
}: {
  data: ExpertiseData;
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
}) {
  const safeAreas =
    data?.areas?.length
      ? data.areas
      : ["Palm Jumeirah", "Downtown Dubai", "Dubai Hills Estate"];

  const safeTags =
    data?.propertyTypes?.length
      ? data.propertyTypes
      : ["Ultra-Luxury Villas", "Sky Penthouses", "Branded Residences"];

  const safeQuote =
    data?.marketQuote ||
    "The premium asset market globally treats prime real estate as an essential structural wealth-preservation anchor.";

  const getCoverageMetric = (index: number) =>
    Math.max(97 - index * 6, 72);

  const handleAreaUpdate = (index: number, newVal: string) => {
    if (!onUpdate) return;

    const newAreas = [...safeAreas];

    if (newVal.trim() === "") {
      newAreas.splice(index, 1);
    } else {
      newAreas[index] = newVal;
    }

    onUpdate("areas", newAreas);
  };

  const handleAddArea = () => {
    if (!onUpdate) return;
    onUpdate("areas", [...safeAreas, "New Area"]);
  };

  const handleTagUpdate = (index: number, newVal: string) => {
    if (!onUpdate) return;

    const newTags = [...safeTags];

    if (newVal.trim() === "") {
      newTags.splice(index, 1);
    } else {
      newTags[index] = newVal;
    }

    onUpdate("propertyTypes", newTags);
  };

  const handleAddTag = () => {
    if (!onUpdate) return;
    onUpdate("propertyTypes", [...safeTags, "New Speciality"]);
  };

  return (
    <section className="relative overflow-hidden bg-[#0b1020] py-24 md:py-32 text-white">
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
            Expertise Atlas
          </div>

          <h2 className="max-w-2xl font-sans text-[40px] font-light leading-[1.02] tracking-[-0.04em] text-white md:text-[68px]">
            Market
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              Expertise
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            A spatial view of specialisation, local knowledge, and market point of view.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Territories */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Landmark size={14} className="text-cyan-300" />
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                    Coverage Zones
                  </div>
                </div>

                {isEditable && (
                  <button
                    onClick={handleAddArea}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-100 transition-colors hover:bg-cyan-300/15"
                    title="Add Area"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {safeAreas.map((area, i) => {
                  const coverage = getCoverageMetric(i);

                  return (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-cyan-300/20 hover:bg-white/[0.05]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-transparent to-violet-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative grid items-center gap-4 md:grid-cols-[96px_1fr_72px]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            0{i + 1}
                          </div>

                          <div className="hidden md:block h-px w-8 bg-white/10" />
                        </div>

                        <div className="min-w-0">
                          <EditableText
                            as="div"
                            text={area}
                            isEditable={isEditable}
                            onUpdate={(val) => handleAreaUpdate(i, val)}
                            className={`rounded text-[15px] font-medium tracking-[-0.02em] text-white ${isEditable ? "hover:bg-white/10" : ""
                              } transition-colors`}
                          />

                          {/* {isEditable && (
                            <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-slate-500">
                              Clear text to remove
                            </p>
                          )} */}
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                            {coverage}%
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-4 h-px w-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${coverage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Quote + Specialities */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.05 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.03] p-6 md:p-8 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
              <div className="mb-6 flex items-center gap-2">
                <Quote size={14} className="text-cyan-300" />
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Market Perspective
                </div>
              </div>

              <EditableText
                as="p"
                text={safeQuote}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("marketQuote", val)}
                className={`font-sans text-[20px] leading-[1.5] tracking-[-0.03em] text-white md:text-[28px] ${isEditable ? "hover:bg-white/10" : ""
                  } rounded transition-colors`}
              />

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-12 bg-white/15" />
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <div className="h-px flex-1 bg-white/15" />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-cyan-300" />
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                    Specialization Spectrum
                  </div>
                </div>

                {isEditable && (
                  <button
                    onClick={handleAddTag}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-100 transition-colors hover:bg-cyan-300/15"
                    title="Add Speciality"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {safeTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="group/tag relative rounded-full border border-white/10 bg-black/20 px-4 py-3 transition-colors hover:border-cyan-300/20 hover:bg-white/[0.05]"
                  >
                    <EditableText
                      as="span"
                      text={tag}
                      isEditable={isEditable}
                      onUpdate={(val) => handleTagUpdate(idx, val)}
                      className="inline-block rounded text-[11px] font-medium uppercase tracking-[0.18em] text-slate-200"
                    />

                    {isEditable && (
                      <div className="pointer-events-none absolute -top-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[8px] text-white opacity-0 transition-opacity group-hover/tag:opacity-100">
                        Clear to remove
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}