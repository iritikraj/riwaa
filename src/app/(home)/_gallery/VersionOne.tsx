/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Maximize2, Plus, Trash2 } from "lucide-react";
import { EditableText } from "@/app/agents/_editable-text";

type VersionOneProps = {
  heading?: string;
  galleryImages?: string[];
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595841696660-1e5b1ac56525?q=80&w=1200&auto=format&fit=crop",
];

export function VersionOne({
  heading,
  galleryImages,
  isEditable = false,
  onUpdate,
}: VersionOneProps) {
  const safeHeading = heading || "The Visual Journey";
  const images = galleryImages?.length ? galleryImages : FALLBACK_IMAGES;

  const viewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);

  const handleHeadingUpdate = (value: string) => {
    onUpdate?.("heading", value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdate || uploadIndex === null) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...images];
      updated[uploadIndex] = reader.result as string;
      onUpdate("galleryImages", updated);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setUploadIndex(null);
  };

  const openUploadPicker = (index: number) => {
    if (!isEditable) return;
    setUploadIndex(index);
    fileInputRef.current?.click();
  };

  const handleAddImage = () => {
    if (!isEditable || !onUpdate) return;
    onUpdate("galleryImages", [...images, ""]);
    setActiveIndex(images.length);
    setUploadIndex(images.length);
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    if (!isEditable || !onUpdate) return;

    const updated = images.filter((_, i) => i !== index);
    const next = updated.length ? updated : [""];

    onUpdate("galleryImages", next);

    setActiveIndex((prev) => {
      if (prev === index) return Math.max(0, index - 1);
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  return (
    <section className="py-24 md:py-32 bg-[#F8F8F3] overflow-hidden font-jost text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#B9A089]/50 rounded-full text-[#B9A089] text-xs uppercase tracking-widest font-medium mb-6">
            Curated Aesthetics
          </div>

          <h2 className="text-4xl md:text-5xl font-cormorant font-medium tracking-tight">
            <EditableText
              as="span"
              text={safeHeading}
              isEditable={isEditable}
              onUpdate={handleHeadingUpdate}
              className="inline-block rounded"
            />
          </h2>
        </div>

        <p className="text-[#1A1A1A]/50 text-sm tracking-[0.2em] uppercase hidden md:block">
          Drag to explore
        </p>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden px-6 md:px-12 pb-12"
      >
        <motion.div
          drag="x"
          dragConstraints={viewportRef}
          dragElastic={0.05}
          className="flex cursor-grab active:cursor-grabbing space-x-6 md:space-x-12"
          onUpdate={(latest) => {
            if (typeof latest.x === "number") {
              // no-op; keeps framer motion happy with interactive drag
            }
          }}
        >
          {images.map((img, i) => (
            <motion.div
              key={`${img || "blank"}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              onMouseEnter={() => setActiveIndex(i)}
              className="flex-shrink-0 w-[300px] md:w-125 h-125 md:h-[700px] relative overflow-hidden rounded-[32px] group bg-[#D9D5C9]/20"
            >
              {img ? (
                <img
                  src={img}
                  alt={`Gallery Image ${i + 1}`}
                  className="w-full h-full object-cover filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F0ECE2]">
                  <div className="text-center px-8">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-[#B9A089]/30 bg-white flex items-center justify-center">
                      <Camera size={20} className="text-[#B9A089]" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#A6A79f]">
                      Empty Slot
                    </p>
                    <p className="mt-2 text-xs text-[#1A1A1A]/50">
                      Upload an image to fill this frame
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-500" />

              <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="bg-white/80 backdrop-blur-md border border-white/40 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-cormorant font-medium text-[#1A1A1A]">
                    Perspective 0{i + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    {isEditable && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openUploadPicker(i);
                          }}
                          className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F8F8F3] flex items-center justify-center transition-colors hover:bg-[#2D2D2D]"
                          title="Replace image"
                        >
                          <Camera size={14} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(i);
                          }}
                          className="w-8 h-8 rounded-full border border-[#D8D6D0] bg-white text-[#A6A79f] flex items-center justify-center transition-colors hover:text-red-500"
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}

                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F8F8F3] flex items-center justify-center">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isEditable && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={handleAddImage}
              className="flex-shrink-0 w-[300px] md:w-125 h-125 md:h-[700px] relative overflow-hidden rounded-[32px] border-2 border-dashed border-[#B9A089]/40 bg-white/40 flex items-center justify-center transition-colors hover:bg-white/60"
            >
              <div className="text-center px-8">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-[#B9A089]/30 bg-white flex items-center justify-center">
                  <Plus size={20} className="text-[#B9A089]" />
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#A6A79f]">
                  Add Image
                </p>
                <p className="mt-2 text-xs text-[#1A1A1A]/50">
                  Insert another gallery frame
                </p>
              </div>
            </motion.button>
          )}
        </motion.div>
      </div>

      {isEditable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      )}
    </section>
  );
}