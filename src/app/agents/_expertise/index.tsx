"use client";
import { motion } from "framer-motion";
import { Landmark, Building2, Quote } from "lucide-react";

interface ExpertiseData {
  areas?: string[];
  propertyTypes?: string[];
  marketQuote?: string;
}

export function AgentExpertise({ data }: { data: ExpertiseData }) {
  const safeAreas = data?.areas?.length ? data.areas : ["Palm Jumeirah", "Downtown Dubai", "Dubai Hills Estate"];
  const safeTags = data?.propertyTypes?.length ? data.propertyTypes : ["Ultra-Luxury Villas", "Sky Penthouses", "Branded Residences", "Commercial Investments", "Off-Plan Exclusives", "Land Banking"];
  const safeQuote = data?.marketQuote || "The premium asset market globally treats prime real estate as an essential structural wealth-preservation anchor. Sustainable value isn't built on flash, it's anchored by long-term structural security.";

  // Static mock coverage percentage vectors to complement layout aesthetics
  const coverageMetrics = [92, 88, 85];

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
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">Market Intelligence</div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            Expertise Carved from Experience
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>

        {/* Main Infrastructure Container split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Metrics & Areas */}
          <div className="space-y-8">
            <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-2">Specialized Areas</div>

            <div className="flex flex-col gap-4">
              {safeAreas.slice(0, 3).map((area, i) => (
                <div key={i} className="bg-white border border-[#e0d8cc] p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b8924a] to-[#d4af71]" />
                  <div className="flex gap-5 items-start">
                    <div className="w-11 h-11 shrink-0 bg-[#f0e6d0] border border-[#b8924a]/20 flex items-center justify-center text-[#b8924a]">
                      {i % 2 === 0 ? <Landmark size={18} /> : <Building2 size={18} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-cormorant text-xl mb-2">{area}</h4>
                      <p className="font-jost text-xs text-[#6b6560] mb-3">Exclusive local placement insights and off-market asset optimization architectures.</p>

                      {/* Metric Scale Bar */}
                      <div className="h-0.5 bg-[#e0d8cc] w-full relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${coverageMetrics[i]}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="absolute h-full left-0 top-0 bg-gradient-to-r from-[#b8924a] to-[#d4af71]"
                        />
                      </div>
                      <span className="text-[10px] text-[#b8924a] font-jost font-medium mt-1.5 block">{coverageMetrics[i]}% market coverage</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Tag clouds & Press highlights */}
          <div className="space-y-8">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">Property Expertise Spectrum</div>
              <div className="flex flex-wrap gap-2">
                {safeTags.map((tag, idx) => (
                  <span key={idx} className="font-jost border border-[#e0d8cc] px-4 py-2 text-xs text-[#6b6560] cursor-default bg-transparent hover:border-[#d4af71] hover:text-[#b8924a] hover:bg-[#f0e6d0] transition-colors duration-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Premium Quotation Block */}
            <div className="pt-4">
              <div className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-4 font-jost">Editorial Insight</div>
              <div className="bg-white border border-[#e0d8cc] p-6 relative">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 shrink-0 bg-[#f0e6d0] flex items-center justify-center text-[#b8924a]">
                    <Quote size={14} />
                  </div>
                  <p className="font-cormorant text-[15px] italic leading-relaxed text-[#1a1a1a]">
                    &quot;{safeQuote}&quot;
                  </p>
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