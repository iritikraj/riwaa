"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

export function AgentPartnerships({ data, isEditable = false, onUpdate }: any) {
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
    <section className="py-20 text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">Strategic Alliances</div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            Official Developer Partnerships
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-[#e7dccd] bg-[#e7dccd] overflow-hidden">
          {safeData.map((partner: string, idx: number) => (
            <div
              key={idx}
              className="group relative bg-[#fbf8f3] px-6 py-6 md:px-8 md:py-7 transition-all duration-500 hover:bg-white"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#b8924a]/0 via-[#b8924a]/0 to-[#b8924a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Remove Button */}
              {isEditable && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-3 right-3 text-[#b8924a]/60 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100 z-10"
                  title="Remove Partner"
                >
                  <X size={14} />
                </button>
              )}

              <div className="relative flex items-center justify-center gap-4 h-full">
                {/* Text */}
                <div className="min-w-0 w-full text-center">
                  {isEditable ? (
                    <input
                      type="text"
                      value={partner}
                      onChange={(e) => {
                        const newData = [...safeData];
                        newData[idx] = e.target.value;
                        onUpdate("partnerships", newData);
                      }}
                      className="w-full text-center bg-transparent outline-none font-jost text-[13px] md:text-[14px] uppercase tracking-[0.18em] text-[#1a1a1a] font-medium hover:bg-black/5 focus:bg-black/5 py-1 px-2 rounded transition-colors"
                    />
                  ) : (
                    <span className="block font-jost text-[13px] md:text-[14px] uppercase tracking-[0.18em] text-[#1a1a1a] font-medium">
                      {partner}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Partner Button */}
          {isEditable && (
            <button
              onClick={handleAdd}
              className="group relative bg-[#fbf8f3]/60 px-6 py-6 md:px-8 md:py-7 transition-all duration-300 hover:bg-[#f0e6d0] flex flex-col items-center justify-center gap-2 min-h-[100px]"
            >
              <Plus size={20} className="text-[#b8924a] group-hover:scale-110 transition-transform" />
              <span className="font-jost text-[11px] uppercase tracking-[0.18em] text-[#b8924a] font-medium">
                Add Partner
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}