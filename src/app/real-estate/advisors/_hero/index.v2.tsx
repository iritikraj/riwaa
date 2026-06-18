/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function AgentHeroVersionTwo({
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

  const handleLanguageUpdate = (index: number, newVal: string) => {
    if (!onUpdate) return;

    const updatedLanguages = [...languages];

    if (newVal.trim() === "") {
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
    <section className="relative overflow-hidden bg-[#070b14] py-24 md:py-32 text-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-12 max-w-3xl text-center md:text-left"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Profile Overview
          </div>

          <h2 className="font-sans text-[42px] font-light leading-[1.02] tracking-[-0.04em] text-white md:text-[68px]">
            Contemporary
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300">
              Advisory Presence
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-6">
          {/* Main Identity Card with Small Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-left">
              {/* Small Portrait / Avatar */}
              <div className="group relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-slate-900 shadow-2xl md:h-40 md:w-40">
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
                  className="h-full w-full object-cover object-top grayscale-[8%] contrast-[1.05] brightness-[1.02]"
                />

                {isEditable && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100"
                  >
                    <Camera size={20} className="mb-2 text-white" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                      Update
                    </span>
                  </button>
                )}
              </div>

              {/* Identity Details */}
              <div className="flex flex-1 flex-col items-center md:items-start">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Active Profile
                </div>

                <h1 className="font-sans text-[40px] font-light leading-[0.95] tracking-[-0.03em] text-white md:text-[56px]">
                  <EditableText
                    as="span"
                    text={firstName}
                    isEditable={isEditable}
                    onUpdate={(val) => onUpdate?.("name", `${val} ${lastName}`)}
                    className="inline-block"
                  />
                  <span className="mx-2" />
                  <EditableText
                    as="span"
                    text={lastName}
                    isEditable={isEditable}
                    onUpdate={(val) =>
                      onUpdate?.("name", `${firstName} ${val}`)
                    }
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300"
                  />
                </h1>

                <div className="mt-4 max-w-2xl">
                  <EditableText
                    as="p"
                    text={title}
                    isEditable={isEditable}
                    onUpdate={(val) => onUpdate?.("title", val)}
                    className="text-[16px] leading-[1.6] text-slate-300 md:text-[18px]"
                  />
                </div>

                {location && (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl">
                    <MapPin size={14} className="shrink-0 text-cyan-300" />
                    <EditableText
                      as="span"
                      text={location}
                      isEditable={isEditable}
                      onUpdate={(val) => onUpdate?.("location", val)}
                      className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-12">
            {/* Professional Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 }}
              className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-xl md:col-span-7 md:p-8"
            >
              <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Professional Summary
              </div>

              <EditableText
                as="p"
                text={bio}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("bio", val)}
                className="max-w-2xl text-[15px] leading-[1.95] tracking-[0.01em] text-slate-300"
              />
            </motion.div>

            {/* Professional Markers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:col-span-5 md:p-8"
            >
              <div className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Professional Markers
              </div>

              <div className="flex flex-wrap gap-3">
                {badges?.length > 0 ? (
                  badges.map((badge: string, i: number) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2"
                    >
                      <BadgeCheck size={14} className="text-cyan-300" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200">
                        {badge}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No markers available
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Globe2 size={14} className="text-cyan-300" />
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Languages
                </div>
              </div>

              {isEditable && (
                <button
                  onClick={handleAddLanguage}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-300/15"
                >
                  <Plus size={13} />
                  Add
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {languages.map((language: string, i: number) => (
                <div
                  key={i}
                  className="group/lang relative rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 transition-colors hover:border-cyan-300/30"
                >
                  <EditableText
                    as="div"
                    text={language}
                    isEditable={isEditable}
                    onUpdate={(val) => handleLanguageUpdate(i, val)}
                    className="min-w-16 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200"
                  />

                  {isEditable && (
                    <div className="pointer-events-none absolute -top-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[8px] text-white opacity-0 transition-opacity group-hover/lang:opacity-100">
                      Clear to remove
                    </div>
                  )}
                </div>
              ))}

              {languages.length === 0 && !isEditable && (
                <span className="text-[10px] italic text-slate-400">
                  Not specified
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}