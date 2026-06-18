/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { EditableText } from "../_editable-text";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export function AgentTimelineVersionTwo({
  timeline,
  isEditable = false,
  onUpdate,
}: {
  timeline?: TimelineItem[];
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
}) {
  const hasTimelineData = Array.isArray(timeline);

  const safeTimeline =
    hasTimelineData && timeline.length > 0
      ? timeline
      : hasTimelineData && isEditable
        ? timeline
        : [
          {
            year: "2006",
            title: "Entered the Market",
            description:
              "Joined a premier residential brokerage during the initial expansion cycle, ranking in the top tier within the first twelve months.",
          },
          {
            year: "2018",
            title: "Established Independent Advisory",
            description:
              "Founded a boutique private practice specializing in off-market property acquisition and institutional land banking.",
          },
        ];

  const handleItemUpdate = (
    index: number,
    field: keyof TimelineItem,
    val: string
  ) => {
    if (!onUpdate) return;
    const newTimeline = [...safeTimeline];
    newTimeline[index] = { ...newTimeline[index], [field]: val };
    onUpdate("timeline", newTimeline);
  };

  const handleAddItem = () => {
    if (!onUpdate) return;
    onUpdate("timeline", [
      ...safeTimeline,
      {
        year: "Year",
        title: "New Milestone",
        description: "Milestone description goes here.",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (!onUpdate) return;
    const newTimeline = [...safeTimeline];
    newTimeline.splice(index, 1);
    onUpdate("timeline", newTimeline);
  };

  // Subtle luxury edit states for the dark theme
  const editStyles = isEditable
    ? "hover:bg-white/10 hover:ring-1 hover:ring-white/20 rounded transition-all cursor-text px-1.5 -mx-1.5"
    : "";

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-24 md:py-32 text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-20 max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl shadow-lg">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Professional Journey
          </div>

          <h2 className="max-w-2xl font-sans text-[42px] font-light leading-[1.02] tracking-[-0.04em] text-white md:text-[68px]">
            A path shaped by
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              defining chapters
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
            A chronological view of growth, transition, and advisory leadership.
          </p>
        </motion.div>

        {/* Illuminated Data Track */}
        <div className="relative">
          {/* Continuous Base Track Line */}
          <div className="absolute left-[27px] md:left-[180px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="space-y-4 md:space-y-6">
            {safeTimeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group relative flex flex-col md:flex-row items-start md:gap-12"
              >
                {/* Active Hover Glow Beam (Shoots down the track) */}
                <div className="absolute left-[27px] md:left-[180px] top-[60px] bottom-0 w-px bg-gradient-to-b from-cyan-400/60 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-0" />

                {/* Left Column: Desktop Year */}
                <div className="hidden md:block w-[132px] shrink-0 text-right pt-7 relative z-10">
                  <EditableText
                    as="div"
                    text={item.year}
                    isEditable={isEditable}
                    onUpdate={(val) => handleItemUpdate(i, "year", val)}
                    className={`inline-block text-[32px] font-light tracking-[-0.02em] text-cyan-100/70 transition-colors duration-500 group-hover:text-cyan-300 ${editStyles}`}
                  />
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 transition-colors duration-500 group-hover:text-slate-400">
                    Chapter 0{i + 1}
                  </div>
                </div>

                {/* Center Node (HUD Style) */}
                <div className="absolute left-[27px] md:left-[180px] top-10 -translate-x-1/2 flex items-center justify-center z-20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#070b14] shadow-[0_0_0_8px_rgba(255,255,255,0.02)] transition-all duration-500 group-hover:border-cyan-400/40 group-hover:bg-[#0a1122] group-hover:shadow-[0_0_0_8px_rgba(34,211,238,0.05)]">
                    <div className="h-2 w-2 rounded-full bg-slate-600 transition-all duration-500 group-hover:bg-cyan-400 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.9)] group-hover:scale-125" />
                  </div>
                </div>

                {/* Right Column: Glassmorphism Card */}
                <div className="ml-16 md:ml-0 flex-1 relative z-10 pt-4 pb-8 w-full">
                  <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-white/[0.04] group-hover:border-cyan-400/20 group-hover:shadow-[0_20px_60px_rgba(34,211,238,0.05)]">

                    {/* Inner Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                    {/* Delete Button (Edit Mode Only) */}
                    {isEditable && (
                      <button
                        onClick={() => handleRemoveItem(i)}
                        className="absolute right-4 top-4 z-20 rounded-full border border-red-400/20 bg-red-400/10 p-2 text-red-200 opacity-0 transition-opacity hover:bg-red-400/20 group-hover:opacity-100"
                        title="Remove Milestone"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <div className="relative z-10">
                      {/* Mobile Year Tag */}
                      <div className="md:hidden mb-4 flex items-center justify-between">
                        <EditableText
                          as="span"
                          text={item.year}
                          isEditable={isEditable}
                          onUpdate={(val) => handleItemUpdate(i, "year", val)}
                          className={`text-xl font-light text-cyan-200 ${editStyles}`}
                        />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Ch. 0{i + 1}
                        </span>
                      </div>

                      <EditableText
                        as="h3"
                        text={item.title || "Career Milestone"}
                        isEditable={isEditable}
                        onUpdate={(val) => handleItemUpdate(i, "title", val)}
                        className={`mb-4 font-sans text-[22px] font-light leading-[1.2] tracking-[-0.03em] text-white md:text-[28px] ${editStyles}`}
                      />

                      <EditableText
                        as="p"
                        text={item.description || "Continued excellence."}
                        isEditable={isEditable}
                        onUpdate={(val) => handleItemUpdate(i, "description", val)}
                        className={`max-w-2xl text-[14px] leading-[1.95] text-slate-400 md:text-[15px] group-hover:text-slate-300 transition-colors duration-500 ${editStyles}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Milestone Button (Edit Mode Only) */}
          {isEditable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex flex-col md:flex-row md:items-start md:gap-12"
            >
              <div className="hidden md:block w-[132px] shrink-0" />
              <div className="ml-16 md:ml-0 flex-1 pt-2">
                <button
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-all hover:bg-cyan-300/15 hover:border-cyan-300/40"
                >
                  <Plus size={14} />
                  Add Milestone
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}