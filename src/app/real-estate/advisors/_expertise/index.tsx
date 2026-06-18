"use client";
import { motion } from "framer-motion";
import { Landmark, Building2, Quote, Plus } from "lucide-react";
import { EditableText } from "../_editable-text";

interface ExpertiseData {
  areas?: string[];
  propertyTypes?: string[];
  marketQuote?: string;
}

export function AgentExpertise({
  data,
  isEditable = false,
  onUpdate,
}: {
  data: ExpertiseData;
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
}) {
  const safeAreas = data?.areas?.length ? data.areas : ["Palm Jumeirah", "Downtown Dubai", "Dubai Hills Estate"];
  const safeTags = data?.propertyTypes?.length ? data.propertyTypes : ["Ultra-Luxury Villas", "Sky Penthouses", "Branded Residences"];
  const safeQuote = data?.marketQuote || "The premium asset market globally treats prime real estate as an essential structural wealth-preservation anchor.";

  // Generate dynamic coverage metrics based on index so it scales if they add more areas
  const getCoverageMetric = (index: number) => Math.max(95 - (index * 4), 70);

  // Area Handlers
  const handleAreaUpdate = (index: number, newVal: string) => {
    if (!onUpdate) return;
    const newAreas = [...safeAreas];
    if (newVal.trim() === "") newAreas.splice(index, 1);
    else newAreas[index] = newVal;
    onUpdate("areas", newAreas);
  };

  const handleAddArea = () => {
    if (!onUpdate) return;
    onUpdate("areas", [...safeAreas, "New Area"]);
  };

  // Tag Handlers
  const handleTagUpdate = (index: number, newVal: string) => {
    if (!onUpdate) return;
    const newTags = [...safeTags];
    if (newVal.trim() === "") newTags.splice(index, 1);
    else newTags[index] = newVal;
    onUpdate("propertyTypes", newTags);
  };

  const handleAddTag = () => {
    if (!onUpdate) return;
    onUpdate("propertyTypes", [...safeTags, "New Speciality"]);
  };

  return (
    <section className="py-24 font-jost text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">
            Market Intelligence
          </div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            Expertise Carved from Experience
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Metrics & Areas */}
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#b8924a]">Specialized Areas</div>
              {isEditable && (
                <button onClick={handleAddArea} className="text-[#b8924a] hover:bg-[#b8924a]/10 p-1.5 rounded transition-colors" title="Add Area">
                  <Plus size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {safeAreas.map((area, i) => (
                <div key={i} className="bg-white border border-[#e0d8cc] p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group/area">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#b8924a] to-[#d4af71]" />
                  <div className="flex gap-5 items-start">
                    <div className="w-11 h-11 shrink-0 bg-[#f0e6d0] border border-[#b8924a]/20 flex items-center justify-center text-[#b8924a]">
                      {i % 2 === 0 ? <Landmark size={18} /> : <Building2 size={18} />}
                    </div>
                    <div className="flex-1">

                      <EditableText
                        as="h4"
                        text={area}
                        isEditable={isEditable}
                        onUpdate={(val) => handleAreaUpdate(i, val)}
                        className={`font-cormorant text-xl mb-2 ${isEditable ? "hover:bg-black/5 transition-colors rounded px-1 -mx-1" : ""} inline-block min-w-25`}
                      />

                      {isEditable && (
                        <p className="text-[9px] text-[#b8924a] uppercase tracking-widest mb-2 italic">Clear text to remove area</p>
                      )}

                      <p className="font-jost text-xs text-[#6b6560] mb-3">Exclusive local placement insights and off-market asset optimization architectures.</p>

                      {/* Metric Scale Bar */}
                      <div className="h-0.5 bg-[#e0d8cc] w-full relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${getCoverageMetric(i)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="absolute h-full left-0 top-0 bg-gradient-to-r from-[#b8924a] to-[#d4af71]"
                        />
                      </div>
                      <span className="text-[10px] text-[#b8924a] font-jost font-medium mt-1.5 block">
                        {getCoverageMetric(i)}% market coverage
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Tag clouds & Press highlights */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#b8924a] font-jost">Property Expertise Spectrum</div>
                {isEditable && (
                  <button onClick={handleAddTag} className="text-[#b8924a] hover:bg-[#b8924a]/10 p-1.5 rounded transition-colors" title="Add Speciality">
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {safeTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className={`group/tag relative flex items-center justify-center font-jost border border-[#e0d8cc] px-4 py-2 min-w-15 text-center transition-colors duration-300 ${isEditable ? "hover:border-[#d4af71] hover:text-[#b8924a] hover:bg-[#f0e6d0]" : ""}`}
                  >
                    <EditableText
                      as="span"
                      text={tag}
                      isEditable={isEditable}
                      onUpdate={(val) => handleTagUpdate(idx, val)}
                      // We use ! to strip away the padding/margins/backgrounds that EditableText forces on it
                      className="text-xs text-[#6b6560] p-0! m-0! leading-none! bg-transparent! shadow-none! outline-none"
                    />

                    {isEditable && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/tag:opacity-100 pointer-events-none transition-opacity bg-black/80 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-50">
                        Clear to remove
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Quotation Block */}
            <div className="pt-4">
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-4 font-jost">Editorial Insight</div>
              <div className="bg-white border border-[#e0d8cc] p-6 relative">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 shrink-0 bg-[#f0e6d0] flex items-center justify-center text-[#b8924a] mt-1">
                    <Quote size={14} />
                  </div>

                  <EditableText
                    as="p"
                    text={safeQuote}
                    isEditable={isEditable}
                    onUpdate={(val) => onUpdate?.("marketQuote", val)}
                    className={`font-cormorant text-[16px] italic leading-relaxed text-[#1a1a1a] ${isEditable ? "hover:bg-black/5 transition-colors rounded px-1 -mx-1" : ""}`}
                  />

                </div>
                <div className="border-t border-[#e0d8cc] mt-4 pt-3 flex gap-2 items-center text-[9px] font-semibold tracking-widest uppercase text-[#6b6560] font-jost">
                  <span>Authorized Analyst</span>
                  <span className="text-[#e0d8cc]">·</span>
                  <span>Institutional Dossier Release</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}