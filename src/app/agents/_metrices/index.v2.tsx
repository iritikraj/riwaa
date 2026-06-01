/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { EditableText } from "../_editable-text";
import { TrendingUp, Clock, Target, Activity, Users } from "lucide-react"; // Added subtle icons for the bento boxes

export function AgentMetricsVersionTwo({
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

  // Mapped with specific icons and span sizes for the Bento Grid
  const metrics = [
    { label: "Deals Closed", value: dealsClosed, key: "dealsClosed", icon: Target, span: "col-span-1" },
    { label: "Years Active", value: yearsActive, key: "yearsActive", icon: Clock, span: "col-span-1" },
    { label: "Highest Deal", value: highestDeal, key: "highestDeal", icon: TrendingUp, span: "col-span-1" },
    { label: "Average Deal", value: averageDeal, key: "averageDeal", icon: Activity, span: "col-span-1" },
    { label: "Repeat Clients", value: repeatClients, key: "repeatClients", icon: Users, span: "col-span-1 md:col-span-2" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-24 md:py-32 text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-16 max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl shadow-lg">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Performance Intelligence
          </div>

          <h2 className="max-w-2xl font-sans text-[40px] font-light leading-[1.02] tracking-[-0.04em] text-white md:text-[68px]">
            Market
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              Performance
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            A concise view of transaction depth, advisory consistency, and long-term client trust.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Hero Metric (Total Volume) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.04]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200">
                  Total Volume
                </div>

                <p className="max-w-xs text-sm leading-6 text-slate-400 mb-12">
                  Representing consistent high-value transactions across luxury residential markets.
                </p>
              </div>

              <div className="relative z-10 mt-auto">
                <EditableText
                  as="h3"
                  text={totalVolume || "$0"}
                  isEditable={isEditable}
                  onUpdate={(val) => onUpdate?.("totalVolume", val)}
                  className={`rounded font-sans text-[64px] leading-[0.9] tracking-[-0.06em] font-light text-white md:text-[88px] ${isEditable ? "hover:bg-white/10" : ""
                    } transition-colors`}
                />

                {/* Subtle decorative graph/line element */}
                <div className="mt-10 flex h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-violet-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Bento Grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 h-full">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] ${metric.span}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 group-hover:text-cyan-100 transition-colors">
                      {metric.label}
                    </p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] text-cyan-300/50 group-hover:bg-cyan-400/10 group-hover:text-cyan-300 transition-all">
                      <metric.icon size={16} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <EditableText
                      as="h3"
                      text={metric.value || "-"}
                      isEditable={isEditable}
                      onUpdate={(val) => onUpdate?.(metric.key, val)}
                      className={`rounded font-sans text-[36px] leading-none tracking-[-0.04em] font-light text-white md:text-[44px] ${isEditable ? "hover:bg-white/10" : ""
                        } transition-colors`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}