"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Globe2,
  MapPin,
  Plus,
  Camera,
} from "lucide-react";

import { EditableText } from "../_editable-text";

export function AgentHero({
  data,
  isEditable = false,
  onUpdate,
}: {
  data: any;
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
}) {
  const {
    name,
    title,
    bio,
    location,
    languages = [],
    badges = [],
    imageUrl,
  } = data;

  const splitName = (name || "Agent Name").split(" ");
  const firstName = splitName[0];
  const lastName = splitName.slice(1).join(" ");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers for dynamic languages
  const handleLanguageUpdate = (index: number, newVal: string) => {
    if (!onUpdate) return;
    const updatedLanguages = [...languages];

    if (newVal.trim() === "") {
      // If user clears the text, remove the language
      updatedLanguages.splice(index, 1);
    } else {
      updatedLanguages[index] = newVal;
    }

    onUpdate("languages", updatedLanguages);
  };

  const handleAddLanguage = () => {
    if (!onUpdate) return;
    onUpdate("languages", [...languages, "New Language"]);
  };

  // Handler for image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdate) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative font-jost pb-16 pt-20 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#c6a46a]/10 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#b8924a]/10 to-transparent blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* LEFT COLUMN - Typography & Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-8 flex flex-col items-start"
          >
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-3 border border-[#b8924a]/30 bg-[#b8924a]/[0.03] backdrop-blur-md px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b8924a] mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b8924a] animate-pulse" />
              Available for Consultation
            </div>

            {/* Category */}
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f8477] mb-5 font-jost font-semibold text-[#b8924a]">
              Luxury Real Estate Advisory
            </p>

            {/* Name */}
            <h1 className="font-cormorant text-[56px] md:text-[80px] lg:text-[96px] text-[#1a1a1a] leading-[0.95] tracking-[-0.03em] font-light mb-6 drop-shadow-sm">
              <EditableText
                as="span"
                text={firstName}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("name", `${val} ${lastName}`)}
                className={`transition-colors rounded ${isEditable ? "hover:bg-white/50" : ""}`}
              />
              <br />
              <EditableText
                as="span"
                text={lastName}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("name", `${firstName} ${val}`)}
                className={`text-[#b8924a] italic pr-4 ${isEditable ? "hover:bg-white/50" : ""} transition-colors rounded`}
              />
            </h1>

            {/* Title */}
            <EditableText
              as="p"
              text={title}
              isEditable={isEditable}
              onUpdate={(val) => onUpdate?.("title", val)}
              className={`inline-block align-baseline overflow-visible leading-[1.2] pb-[0.08em] font-cormorant text-[20px] font-light tracking-[0.03em] text-[#5c5752] mb-6 ${isEditable ? "hover:bg-white/50" : ""} transition-colors rounded`}
            />

            {/* Refined Ornament */}
            <div className="flex items-center gap-4 mb-8 w-full max-w-[200px]">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d8cbb6] to-transparent" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8924a" strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d8cbb6] to-transparent" />
            </div>

            {/* Bio */}
            <EditableText
              as="p"
              text={bio}
              isEditable={isEditable}
              onUpdate={(val) => onUpdate?.("bio", val)}
              className="max-w-2xl text-[15px] leading-[1.9] tracking-[0.02em] text-[#6b6560] font-light mb-10 text-pretty"
            />

            {/* Badges */}
            {badges?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {badges.map((badge: string, i: number) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 border border-[#d9c7a7]/60 bg-white/60 backdrop-blur-sm px-4 py-2 hover:bg-white transition-colors duration-300"
                  >
                    <BadgeCheck size={14} className="text-[#b8924a]" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#7a6b56]">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN - Portrait & Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-4 flex justify-center lg:justify-end mt-12 lg:mt-0"
          >
            <div className="w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[240px] relative group">

              {/* Portrait Container */}
              <div className="relative z-10">
                {/* Elegant Offset Frame */}
                <div className="absolute top-4 -right-4 w-full h-full border border-[#b8924a]/40 z-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />

                {/* Main Image Wrapper */}
                <div className="relative z-10 aspect-[4/5] overflow-hidden bg-[#ebe3d6] shadow-[0_20px_40px_rgba(0,0,0,0.06)] group/image">

                  {/* Hidden File Input */}
                  {isEditable && (
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  )}

                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top filter grayscale-[10%] contrast-[1.05] brightness-[1.02] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

                  {/* Edit Image Overlay */}
                  {isEditable && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-30 cursor-pointer"
                    >
                      <Camera size={24} className="text-white mb-2" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                        Change Photo
                      </span>
                    </button>
                  )}

                  {/* Verified Badge Overlay */}
                  <div className="absolute top-3 right-3 w-7 h-7 bg-white/95 backdrop-blur-md border border-[#e7dccd] flex items-center justify-center shadow-lg rounded-sm z-40 pointer-events-none">
                    <BadgeCheck size={12} className="text-[#b8924a]" />
                  </div>
                </div>

                {/* Overlapping Location Tab */}
                {location && (
                  <div className="absolute -bottom-4 -left-6 bg-white/95 backdrop-blur-xl border border-[#e7dccd] px-4 py-3 shadow-xl z-20">
                    <div className="flex items-center gap-2.5">
                      <MapPin size={14} className="text-[#b8924a]" />
                      <EditableText
                        as="span"
                        text={location}
                        isEditable={isEditable}
                        onUpdate={(val) => onUpdate?.("location", val)}
                        className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#5c5752]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Info Cards (Languages) */}
              <div className="relative z-10 mt-12">
                <div className="bg-white/70 backdrop-blur-xl border border-[#e7dccd]/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Globe2 size={13} className="text-[#b8924a]" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8f8477]">
                        Languages
                      </span>
                    </div>

                    {/* Add Language Button (Only visible in edit mode) */}
                    {isEditable && (
                      <button
                        onClick={handleAddLanguage}
                        className="p-1 hover:bg-[#b8924a]/10 rounded text-[#b8924a] transition-colors"
                        title="Add Language"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {languages.map((language: string, i: number) => (
                      <div
                        key={i}
                        className="group/lang relative border border-[#e7dccd] bg-[#faf7f2] hover:border-[#b8924a]/40 transition-colors"
                      >
                        <EditableText
                          as="div"
                          text={language}
                          isEditable={isEditable}
                          onUpdate={(val) => handleLanguageUpdate(i, val)}
                          className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#5c5752] min-w-[60px] text-center"
                        />

                        {/* Tooltip hint for deletion */}
                        {isEditable && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/lang:opacity-100 pointer-events-none transition-opacity bg-black/80 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap z-50">
                            Clear to remove
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Empty state if no languages exist */}
                    {languages.length === 0 && !isEditable && (
                      <span className="text-[10px] text-[#8f8477] italic">Not specified</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}