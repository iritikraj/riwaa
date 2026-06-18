"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Cpu,
  Download,
  Droplets,
  Home,
  Leaf,
  Plus,
  Send,
} from "lucide-react";
import { EditableText } from "@/app/real-estate/advisors/_editable-text";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type VersionOneProps = {
  heading?: string;
  subtext?: string;
  imageUrl?: string;
  siteTitle?: string;
  items?: string[];
  primaryCtaText?: string;
  secondaryCtaText?: string;
  modalEyebrow?: string;
  modalTitle?: string;
  modalSubtext?: string;
  modalSubmitText?: string;
  modalFootnote?: string;
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
};

export function VersionOne({
  heading,
  subtext,
  imageUrl,
  siteTitle,
  items,
  primaryCtaText,
  secondaryCtaText,
  modalEyebrow,
  modalTitle,
  modalSubtext,
  modalSubmitText,
  modalFootnote,
  isEditable = false,
  onUpdate,
}: VersionOneProps) {
  const safeHeading = heading || siteTitle || "Mindful Modern Luxury";
  const safeSiteTitle = siteTitle || "Curated Residential Collection";
  const safeSubtext =
    subtext ||
    "Experience a new paradigm in residential landscapes, harmonizing environmental responsibility with human-centered design.";

  const finalImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop";

  const safeItems = items?.length
    ? items
    : ["Sustainability", "Wellness", "Technology"];

  const safePrimaryCtaText = primaryCtaText || "Register Interest";
  const safeSecondaryCtaText = secondaryCtaText || "Download Brochure";

  const safeModalEyebrow = modalEyebrow || `Private Enquiry`;
  const safeModalTitle = modalTitle || `Experience ${safeSiteTitle}`;
  const safeModalSubtext =
    modalSubtext || "Mindful Modern Luxury Awaits";
  const safeModalSubmitText = modalSubmitText || "Submit Interest";
  const safeModalFootnote =
    modalFootnote ||
    "By submitting, you agree to our Privacy Policy. We'll contact you within 24 hours.";

  const icons = [Leaf, Droplets, Cpu];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHeadingUpdate = (value: string) => {
    onUpdate?.("heading", value);
  };

  const handleSubtextUpdate = (value: string) => {
    onUpdate?.("subtext", value);
  };

  const handleSiteTitleUpdate = (value: string) => {
    onUpdate?.("siteTitle", value);
  };

  const handleItemUpdate = (index: number, newValue: string) => {
    if (!onUpdate) return;

    const updatedItems = [...safeItems];

    if (newValue.trim() === "") {
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index] = newValue;
    }

    onUpdate("items", updatedItems);
  };

  const handleAddItem = () => {
    if (!onUpdate) return;
    onUpdate("items", [...safeItems, "New Feature"]);
  };

  const handlePrimaryCtaUpdate = (value: string) => {
    onUpdate?.("primaryCtaText", value);
  };

  const handleSecondaryCtaUpdate = (value: string) => {
    onUpdate?.("secondaryCtaText", value);
  };

  const handleModalEyebrowUpdate = (value: string) => {
    onUpdate?.("modalEyebrow", value);
  };

  const handleModalTitleUpdate = (value: string) => {
    onUpdate?.("modalTitle", value);
  };

  const handleModalSubtextUpdate = (value: string) => {
    onUpdate?.("modalSubtext", value);
  };

  const handleModalSubmitTextUpdate = (value: string) => {
    onUpdate?.("modalSubmitText", value);
  };

  const handleModalFootnoteUpdate = (value: string) => {
    onUpdate?.("modalFootnote", value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdate) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate("imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <section className="relative h-screen overflow-hidden bg-[#1A1A1A] font-jost">
      <div className="absolute inset-0">
        <img
          src={finalImage}
          alt={safeHeading}
          className="h-full w-full scale-105 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 via-[#1A1A1A]/30 to-[#1A1A1A]/90" />
      </div>

      {isEditable && (
        <div className="absolute right-5 top-5 md:right-8 md:top-8 z-999">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex cursor-pointer z-999 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#F8F8F3] backdrop-blur-md transition-all duration-300 hover:bg-white/20"
          >
            <Camera size={13} />
            Replace Image
          </button>
        </div>
      )}

      <div className="relative flex h-full flex-col items-center justify-center px-4 pt-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center"
        >
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {safeItems.slice(0, 3).map((item, i) => {
              const Icon = icons[i % icons.length];

              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-light text-[#F8F8F3] shadow-lg backdrop-blur-md md:text-sm"
                >
                  <Icon
                    size={14}
                    className={
                      i === 0
                        ? "text-[#A6A79f]"
                        : i === 1
                          ? "text-[#B9A089]"
                          : "text-[#B3B7Bf]"
                    }
                  />
                  {isEditable ? (
                    <EditableText
                      as="span"
                      text={item}
                      isEditable={isEditable}
                      onUpdate={(val) => handleItemUpdate(i, val)}
                      className="inline-block rounded"
                    />
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              );
            })}

            {isEditable && (
              <button
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-light text-[#F8F8F3] shadow-lg backdrop-blur-md md:text-sm"
              >
                <Plus size={14} className="text-[#B3B7Bf]" />
                Add
              </button>
            )}
          </div>

          <h1 className="mb-8 font-cormorant text-5xl leading-[1.1] tracking-tight text-[#F8F8F3] drop-shadow-lg md:text-6xl lg:text-7xl">
            <EditableText
              as="span"
              text={safeHeading}
              isEditable={isEditable}
              onUpdate={handleHeadingUpdate}
              className="inline-block rounded capitalize"
            />
          </h1>

          <div className="relative mb-10 max-w-2xl overflow-hidden rounded-2xl border border-[#D8D6D0]/20 bg-[#1A1A1A]/70 p-6 backdrop-blur-xl md:p-8">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#B9A089]" />
            <EditableText
              as="p"
              text={safeSubtext}
              isEditable={isEditable}
              onUpdate={handleSubtextUpdate}
              className="block rounded pl-4 font-cormorant text-base leading-relaxed italic text-[#D9D5C9] md:text-lg"
            />
          </div>

          <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-3 rounded-full bg-[#F8F8F3] px-8 py-4 text-sm font-medium text-[#1A1A1A] transition-all duration-300 hover:bg-white"
            >
              <EditableText
                as="span"
                text={safePrimaryCtaText}
                isEditable={isEditable}
                onUpdate={handlePrimaryCtaUpdate}
                className="inline-block rounded"
              />
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-medium text-[#F8F8F3] transition-all duration-300 backdrop-blur-md hover:bg-white/20"
            >
              <Download size={16} />
              <EditableText
                as="span"
                text={safeSecondaryCtaText}
                isEditable={isEditable}
                onUpdate={handleSecondaryCtaUpdate}
                className="inline-block rounded"
              />
            </button>
          </div>

          {isEditable && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/60 backdrop-blur-md">
              Tip: click any text to edit
            </div>
          )}
        </motion.div>
      </div>

      {/* NEW: Use createPortal to teleport the modal outside of the overflow-hidden section 
        and mount it directly to the document body.
      */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 font-jost">
              <motion.button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="lead-modal-title"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-[1000000] w-full max-w-md overflow-hidden rounded-2xl bg-[#F8F8F3] p-8 text-[#1A1A1A] shadow-2xl"
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-6 top-6 text-2xl text-[#6D6A63] transition-colors hover:text-[#1A1A1A]"
                  aria-label="Close"
                >
                  &times;
                </button>

                <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#A6A79f]/20 bg-[#A6A79f]/10">
                  <Home className="text-[#7A6350]" size={22} />
                </div>

                <div className="text-center">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#B7A38A]/25 bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A6F59] shadow-sm">
                    <EditableText
                      as="span"
                      text={safeModalEyebrow}
                      isEditable={isEditable}
                      onUpdate={handleModalEyebrowUpdate}
                      className="inline-block rounded"
                    />
                  </div>

                  <h2
                    id="lead-modal-title"
                    className="text-3xl font-medium mb-2"
                  >
                    <EditableText
                      as="span"
                      text={safeModalTitle}
                      isEditable={isEditable}
                      onUpdate={handleModalTitleUpdate}
                      className="inline-block rounded"
                    />
                  </h2>

                  <p className="text-[#6D6A63] mb-8">
                    <EditableText
                      as="span"
                      text={safeModalSubtext}
                      isEditable={isEditable}
                      onUpdate={handleModalSubtextUpdate}
                      className="inline-block rounded"
                    />
                  </p>
                </div>

                <form onSubmit={handleModalSubmit}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      required
                      className="w-full rounded-lg border border-[#D8D6D0] bg-[#FFF9F2] p-4 focus:border-[#A6A79f] focus:outline-none"
                    />

                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      className="w-full rounded-lg border border-[#D8D6D0] bg-[#FFF9F2] p-4 focus:border-[#A6A79f] focus:outline-none"
                    />

                    <div className="flex gap-2">
                      <select className="rounded-lg border border-[#D8D6D0] bg-[#FFF9F2] p-4 focus:border-[#A6A79f] focus:outline-none">
                        <option value="+971">+971 (UAE)</option>
                        <option value="+1">+1 (USA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+91">+91 (India)</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone *"
                        required
                        className="flex-1 rounded-lg border border-[#D8D6D0] bg-[#FFF9F2] p-4 focus:border-[#A6A79f] focus:outline-none"
                      />
                    </div>

                    <select className="w-full rounded-lg border border-[#D8D6D0] bg-[#FFF9F2] p-4 focus:border-[#A6A79f] focus:outline-none">
                      <option value="">Interested In</option>
                      <option value="1bed">1 Bedroom Residence</option>
                      <option value="2bed">2 Bedroom Residence</option>
                      <option value="3bed">3 Bedroom Residence</option>
                      <option value="brochure">Brochure Only</option>
                    </select>

                    <textarea
                      placeholder="Additional Notes (Optional)"
                      rows={3}
                      className="w-full rounded-lg border border-[#D8D6D0] bg-[#FFF9F2] p-4 focus:border-[#A6A79f] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#1A1A1A] py-4 font-medium text-[#F8F8F3] transition-colors hover:bg-[#2C2C2C]"
                  >
                    <EditableText
                      as="span"
                      text={safeModalSubmitText}
                      isEditable={isEditable}
                      onUpdate={handleModalSubmitTextUpdate}
                      className="inline-block rounded"
                    />
                    <Send size={14} />
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-[#6D6A63]">
                  <EditableText
                    as="span"
                    text={safeModalFootnote}
                    isEditable={isEditable}
                    onUpdate={handleModalFootnoteUpdate}
                    className="inline-block rounded"
                  />
                </p>

                {isEditable && (
                  <div className="mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-[#A6A79f]">
                    Modal copy is editable
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}