"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

export function AgentMedia({ data, isEditable = false, onUpdate }: any) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-24 text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-28 text-center"
        >
          <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-6 font-jost">Editorial Features</div>
          <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">
            Media & Public Presence
          </h2>
          <div className="w-10 h-px bg-gradient-to-r from-[#b8924a] to-[#d4af71] mx-auto mt-6"></div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {data.map((item: any, idx: number) => (
            <div key={idx} className="p-8 border border-[#e0d8cc] rounded-2xl bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Newspaper size={20} className="text-[#b8924a]" />

                  <button
                    className="text-sm font-medium text-[#b8924a] hover:text-[#9a7635] transition-colors cursor-pointer"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    Read More →
                  </button>
                </div>
                {isEditable ? (
                  <textarea
                    value={item.headline}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[idx].headline = e.target.value;
                      onUpdate("mediaPresence", newData);
                    }}
                    className="w-full bg-transparent outline-none text-base leading-snug text-neutral-900 mb-4 resize-none font-jost"
                    rows={2}
                  />
                ) : (
                  <h4 className="text-base leading-snug text-neutral-900 mb-4 font-jost">&quot;{item.headline}&quot;</h4>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-[#e0d8cc] pt-4 mt-4">
                {isEditable ? (
                  <>
                    <input type="text" value={item.publication} onChange={(e) => { const d = [...data]; d[idx].publication = e.target.value; onUpdate("mediaPresence", d); }} className="bg-transparent outline-none text-xs tracking-widest uppercase font-semibold text-[#b8924a] w-1/2" />
                    <input type="text" value={item.year} onChange={(e) => { const d = [...data]; d[idx].year = e.target.value; onUpdate("mediaPresence", d); }} className="bg-transparent outline-none text-xs text-neutral-400 text-right w-1/4" />
                  </>
                ) : (
                  <>
                    <span className="text-xs tracking-widest uppercase font-semibold text-[#b8924a] font-jost">{item.publication}</span>
                    <span className="text-xs text-neutral-400 font-jost">{item.year}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}