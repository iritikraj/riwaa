/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Download, Plus, Trash2 } from "lucide-react";
import { EditableText } from "@/app/real-estate/advisors/_editable-text";

type VersionOneProps = {
  heading?: string;
  floorPlans?: string[];
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
  onOpenBrochureModal?: (planIndex: number) => void;
};

const FALLBACK_PLANS = [
  "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd27?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
];

const SPECS = [
  {
    title: "1 Bedroom Residence",
    desc: "Perfectly designed for modern professionals seeking efficiency and elegance.",
    area: "750 sq.ft",
    price: "AED 1.2M",
  },
  {
    title: "2 Bedroom Residence",
    desc: "Ideal for growing families seeking space, comfort, and premium amenities.",
    area: "1,250 sq.ft",
    price: "AED 2.1M",
  },
  {
    title: "3 Bedroom Residence",
    desc: "Luxurious family living with abundant space and world-class finishes.",
    area: "1,850 sq.ft",
    price: "AED 3.2M",
  },
];

export function VersionOne({
  heading,
  floorPlans,
  isEditable = false,
  onUpdate,
  onOpenBrochureModal,
}: VersionOneProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plans = (floorPlans?.length ? floorPlans : FALLBACK_PLANS).map((plan) => plan || "");

  const safePlans = plans.length ? plans : FALLBACK_PLANS;

  useEffect(() => {
    if (activeTab > safePlans.length - 1) {
      setActiveTab(Math.max(0, safePlans.length - 1));
    }
  }, [activeTab, safePlans.length]);

  const currentImage =
    safePlans[activeTab] ||
    FALLBACK_PLANS[activeTab % FALLBACK_PLANS.length];

  const openReplacePicker = (index: number) => {
    if (!isEditable) return;
    setUploadIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadIndex === null) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...safePlans];
      updated[uploadIndex] = reader.result as string;
      onUpdate?.("floorPlans", updated);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setUploadIndex(null);
  };

  const handleAddPlan = () => {
    if (!isEditable) return;
    onUpdate?.("floorPlans", [...safePlans, ""]);
    setActiveTab(safePlans.length);
  };

  const handleRemovePlan = (index: number) => {
    if (!isEditable) return;

    const updated = safePlans.filter((_, i) => i !== index);
    const nextPlans = updated.length ? updated : [""];

    onUpdate?.("floorPlans", nextPlans);
    setActiveTab((prev) => {
      if (prev === index) return Math.max(0, index - 1);
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const handleDownloadClick = () => {
    onOpenBrochureModal?.(activeTab);
  };

  return (
    <section className="py-24 md:py-32 bg-[#F8F8F3] font-jost text-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#A6A79f] rounded-full text-[#A6A79f] text-sm font-medium mb-4">
            {isEditable ? (
              <EditableText
                as="span"
                text={heading || "Thoughtfully Designed"}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("heading", val)}
                className="inline-block rounded"
              />
            ) : (
              <span>{heading || "Thoughtfully Designed"}</span>
            )}
          </div>

          <h2 className="text-4xl md:text-5xl font-cormorant font-medium mb-6 tracking-tight">
            <EditableText
              as="span"
              text={heading || "Floor Plans"}
              isEditable={isEditable}
              onUpdate={(val) => onUpdate?.("heading", val)}
              className="inline-block rounded"
            />
          </h2>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#A6A79f] to-transparent mb-6" />

          <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto font-light leading-relaxed">
            Timeless aesthetics meet intelligent functionality, ensuring long-term value and relevance. Built not just for today — but for the future of living.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/60 backdrop-blur-md border border-[#D8D6D0] rounded-full p-1.5 inline-flex shadow-sm flex-wrap gap-1">
            {safePlans.map((_, i) => (
              <div key={i} className="relative">
                <button
                  onClick={() => setActiveTab(i)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === i
                      ? "bg-[#1A1A1A] text-[#F8F8F3] shadow-md"
                      : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-white/50"
                    }`}
                >
                  Layout 0{i + 1}
                </button>

                {isEditable && safePlans.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePlan(i);
                    }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#D8D6D0] bg-white text-[#A6A79f] shadow-sm transition-colors hover:bg-[#fff3ee] hover:text-red-500"
                    title="Remove plan"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}

            {isEditable && (
              <button
                onClick={handleAddPlan}
                className="ml-1 inline-flex items-center gap-2 rounded-full border border-[#A6A79f]/30 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#7A6350] transition-colors hover:bg-[#FFF9F2]"
              >
                <Plus size={13} />
                Add Plan
              </button>
            )}
          </div>
        </div>

        {/* Interactive Content Canvas */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Left: Image Canvas */}
              <div className="relative bg-white/80 backdrop-blur-xl border border-[#D8D6D0]/50 rounded-3xl p-4 shadow-[0_8px_32px_rgba(26,26,26,0.04)]">
                <div className="bg-[#F8F8F3] rounded-2xl overflow-hidden aspect-square md:aspect-[4/3] relative flex items-center justify-center">
                  <img
                    src={currentImage}
                    alt={`Floor Plan ${activeTab + 1}`}
                    className="w-full h-full object-contain p-8 mix-blend-multiply opacity-80"
                  />

                  {isEditable && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      <button
                        onClick={() => openReplacePicker(activeTab)}
                        className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-[#A6A79f]/30 bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7A6350] backdrop-blur-md transition-colors hover:bg-white"
                      >
                        <Camera size={13} />
                        Replace Image
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Specifications */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-cormorant font-medium mb-4 text-[#1A1A1A]">
                    {SPECS[activeTab]?.title || `Premium Layout 0${activeTab + 1}`}
                  </h3>
                  <p className="text-[#1A1A1A]/70 text-lg font-light leading-relaxed">
                    {SPECS[activeTab]?.desc || "Meticulously crafted to maximize space, light, and natural airflow."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#D8D6D0] p-6 rounded-2xl transition-all hover:border-[#B9A089]">
                    <div className="text-xs text-[#A6A79f] uppercase tracking-widest mb-2 font-medium">Total Area</div>
                    <div className="text-2xl font-cormorant text-[#1A1A1A]">{SPECS[activeTab]?.area || "Custom"}</div>
                  </div>
                  <div className="bg-white border border-[#D8D6D0] p-6 rounded-2xl transition-all hover:border-[#A6A79f]">
                    <div className="text-xs text-[#A6A79f] uppercase tracking-widest mb-2 font-medium">Starting From</div>
                    <div className="text-2xl font-cormorant text-[#1A1A1A]">{SPECS[activeTab]?.price || "On Request"}</div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadClick}
                  className="w-full bg-[#1A1A1A] text-[#F8F8F3] hover:bg-[#2D2D2D] py-4 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-all duration-300 shadow-lg"
                >
                  <Download size={18} />
                  <span>Download Floor Plan</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}