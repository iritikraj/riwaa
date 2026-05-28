/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { EditableText } from "../_editable-text";

export function AgentMetrics({
  data,
  isEditable = false,
  onUpdate,
}: {
  data: any;
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
}) {
  const {
    totalVolume,
    dealsClosed,
    yearsActive,
    highestDeal,
    averageDeal,
    repeatClients,
  } = data || {};

  // We map the keys so we know exactly which field to update in the database
  const metrics = [
    { label: "Deals Closed", value: dealsClosed, key: "dealsClosed" },
    { label: "Years Active", value: yearsActive, key: "yearsActive" },
    { label: "Highest Deal", value: highestDeal, key: "highestDeal" },
    { label: "Average Deal", value: averageDeal, key: "averageDeal" },
    { label: "Repeat Clients", value: repeatClients, key: "repeatClients" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8f5ef] py-28 text-[#1a1a1a]">
      {/* Ambient */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 0.8px, transparent 0.8px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#b8924a]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#c6a46a]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">
            Performance Intelligence
          </div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            Market Performance
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>

        {/* Premium Editorial Layout */}
        <div className="grid gap-16 lg:grid-cols-[1.4fr_0.9fr]">
          {/* Left Hero Metric */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/60 p-10 backdrop-blur-xl md:p-14"
          >
            <div className="mb-20">
              <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[#9a8f80] font-jost font-medium">
                Total Volume
              </p>

              <EditableText
                as="h3"
                text={totalVolume || "$0"}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("totalVolume", val)}
                className={`font-jost text-[64px] leading-none tracking-[-0.06em] font-light md:text-[110px] ${isEditable ? "hover:bg-white/40" : ""} transition-colors rounded`}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-[#cdbb9b]" />
              <p className="max-w-sm text-sm leading-relaxed text-[#6f675d] font-jost">
                Representing consistent high-value transactions across luxury residential markets.
              </p>
            </div>

            {/* glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#b8924a]/10 blur-3xl" />
          </motion.div>

          {/* Right Side Metrics */}
          <div className="flex flex-col justify-between gap-8">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group border-b border-[#dfd3c2] pb-7"
              >
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#8f8477] font-jost font-medium">
                      {metric.label}
                    </p>

                    <EditableText
                      as="h3"
                      text={metric.value || "-"}
                      isEditable={isEditable}
                      onUpdate={(val) => onUpdate?.(metric.key, val)}
                      className={`font-jost text-[38px] leading-none tracking-[-0.05em] font-light transition-transform duration-500 group-hover:translate-x-1 md:text-[52px] ${isEditable ? "hover:bg-black/5" : ""} transition-colors rounded px-1 -mx-1`}
                    />
                  </div>
                  <span className="text-[11px] text-[#b8924a]">0{i + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}