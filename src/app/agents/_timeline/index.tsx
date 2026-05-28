"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { EditableText } from "../_editable-text";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export function AgentTimeline({
  timeline,
  isEditable = false,
  onUpdate,
}: {
  timeline?: TimelineItem[];
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
}) {
  // Fix: Treat the empty array or provided array as valid data so updates aren't discarded
  const hasTimelineData = Array.isArray(timeline);

  const safeTimeline = hasTimelineData && timeline.length > 0
    ? timeline
    : hasTimelineData && isEditable
      ? timeline // If it's an empty array but we are in edit mode, allow it to start empty so additions work
      : [
        {
          year: "2006",
          title: "Entered the Market",
          description: "Joined a premier residential brokerage during the initial expansion cycle, ranking in the top tier within the first twelve months.",
        },
        {
          year: "2018",
          title: "Established Independent Advisory",
          description: "Founded a boutique private practice specializing in off-market property acquisition and institutional land banking.",
        },
      ];

  // List Modification Handlers
  const handleItemUpdate = (index: number, field: keyof TimelineItem, val: string) => {
    if (!onUpdate) return;
    const newTimeline = [...safeTimeline];
    newTimeline[index] = { ...newTimeline[index], [field]: val };
    onUpdate("timeline", newTimeline);
  };

  const handleAddItem = () => {
    if (!onUpdate) return;
    onUpdate("timeline", [
      ...safeTimeline,
      { year: "Year", title: "New Milestone", description: "Milestone description goes here." }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (!onUpdate) return;
    const newTimeline = [...safeTimeline];
    newTimeline.splice(index, 1);
    onUpdate("timeline", newTimeline);
  };

  return (
    <section className="relative overflow-hidden bg-[#f8f5ef] py-32 text-[#1a1a1a]">
      {/* Ambient */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 0.8px, transparent 0.8px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#b8924a]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">
            Professional Journey
          </div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            A Legacy Built Deal by Deal
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>

        {/* Editorial Timeline */}
        <div className="relative">
          {/* subtle center line */}
          <div className="absolute left-[90px] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#d8cab3] to-transparent md:block" />

          <div className="space-y-24">
            {safeTimeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="grid gap-8 md:grid-cols-[120px_1fr] group/timeline"
              >
                {/* Year */}
                <div className="relative">
                  <div className="sticky top-24">
                    <EditableText
                      as="div"
                      text={item.year}
                      isEditable={isEditable}
                      onUpdate={(val) => handleItemUpdate(i, "year", val)}
                      className={`mb-4 text-[11px] uppercase tracking-[0.3em] text-[#9a8f80] font-jost font-medium inline-block ${isEditable ? "hover:bg-black/5 rounded transition-colors" : ""} px-1 -ml-1`}
                    />
                    <div className="hidden md:block h-3 w-3 rounded-full bg-[#b8924a] shadow-[0_0_0_6px_rgba(184,146,74,0.12)]" />
                  </div>
                </div>

                {/* Content */}
                <div className="border-t border-[#dfd3c2] pt-10 relative">

                  {/* Delete Button (Only in edit mode) */}
                  {isEditable && (
                    <button
                      onClick={() => handleRemoveItem(i)}
                      className="absolute top-8 right-0 p-2 text-red-400 opacity-0 group-hover/timeline:opacity-100 transition-opacity hover:bg-red-400/10 rounded"
                      title="Remove Milestone"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="max-w-3xl pr-8">
                    <EditableText
                      as="h3"
                      text={item.title || "Career Milestone"}
                      isEditable={isEditable}
                      onUpdate={(val) => handleItemUpdate(i, "title", val)}
                      className={`mb-5 font-cormorant text-base md:text-2xl leading-[1.1] tracking-[-0.04em] font-light ${isEditable ? "hover:bg-black/5 transition-colors rounded px-1 -mx-1" : ""}`}
                    />
                    <EditableText
                      as="p"
                      text={item.description || "Continued excellence."}
                      isEditable={isEditable}
                      onUpdate={(val) => handleItemUpdate(i, "description", val)}
                      className={`max-w-2xl text-[15px] leading-[1.9] text-[#6f675d] font-jost ${isEditable ? "hover:bg-black/5 transition-colors rounded px-1 -mx-1" : ""}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add Milestone Button */}
            {isEditable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-8 md:grid-cols-[120px_1fr]"
              >
                <div className="hidden md:block"></div>
                <div className="pt-4">
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#b8924a] border border-[#b8924a]/30 px-6 py-3 hover:bg-[#b8924a]/5 transition-colors rounded"
                  >
                    <Plus size={14} /> Add Milestone
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}