"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Globe2,
  MapPin,
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
    languages,
    badges,
    imageUrl,
  } = data;

  const splitName = (name || "Agent Name").split(" ");

  const firstName = splitName[0];

  const lastName =
    splitName.slice(1).join(" ");

  return (
    <section className="font-jost">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#c6a46a]/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-[#b8924a]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#000 0.7px, transparent 0.7px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="lg:col-span-8"
          >
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-3 border font-jost font-semibold border-[#b8924a4d] bg-[#f0e6d0] backdrop-blur-xl px-5 py-2 text-[10px] uppercase tracking-[0.15em] text-[#b8924a] mb-8">
              <span className="w-2 h-2 rounded-full font-jost font-semibold bg-[#b8924a]" />
              Available for Consultation
            </div>

            {/* Category */}
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8f8477] mb-5 font-jost font-semibold text-[#b8924a]">
              Luxury Real Estate Advisory
            </p>

            {/* Name */}
            <h1 className="font-cormorant text-[48px] text-[#1a1a1a] leading-[1.05] overflow-visible md:text-[88px] tracking-[-0.05em] font-light mb-6">
              <EditableText
                as="span"
                text={firstName}
                isEditable={isEditable}
                onUpdate={(val) =>
                  onUpdate?.(
                    "name",
                    `${val} ${lastName}`
                  )
                }
              />
              &nbsp;
              {/* <br /> */}

              <EditableText
                as="span"
                text={lastName}
                isEditable={isEditable}
                onUpdate={(val) =>
                  onUpdate?.(
                    "name",
                    `${firstName} ${val}`
                  )
                }
                className="text-[#b8924a]"
              />
            </h1>

            {/* Title */}
            <EditableText
              as="p"
              text={title}
              isEditable={isEditable}
              onUpdate={(val) =>
                onUpdate?.("title", val)
              }
              className="font-cormorant text-[20px] font-light tracking-[0.03em] text-[#5c5752] mb-6"
            />

            {/* Ornament */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d8cbb6] to-transparent" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8924a" stroke-width="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d8cbb6] to-transparent" />
            </div>

            {/* Bio */}
            <EditableText
              as="p"
              text={bio}
              isEditable={isEditable}
              onUpdate={(val) =>
                onUpdate?.("bio", val)
              }
              className="max-w-2xl font-jost text-[14px] md:text-[15px] leading-[2] tracking-[0.01em] text-[#6b6560] font-light mb-6"
            />

            {/* Badges */}
            {badges?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {badges.map(
                  (
                    badge: string,
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 border border-[#d9c7a7] bg-white/80 px-4 py-2"
                    >
                      <BadgeCheck
                        size={14}
                        className="text-[#b8924a]"
                      />

                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#7a6b56]">
                        {badge}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1.2,
            }}
            className="lg:col-span-4 flex justify-center lg:justify-end"
          >

            <div className="w-full max-w-[320px]">

              {/* Portrait Card */}
              <div className="relative">

                {/* Frame */}
                <div className="absolute -inset-4 border border-[#d9c7a7]/50" />

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#ebe3d6] to-[#d9ccb9] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top grayscale-[10%] contrast-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                  {/* Verified */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-xl border border-[#e7dccd] flex items-center justify-center shadow-lg">
                    <BadgeCheck
                      size={18}
                      className="text-[#b8924a]"
                    />
                  </div>

                </div>

                {/* Location */}
                {location && (
                  <div className="absolute -bottom-5 left-5 bg-white/95 backdrop-blur-xl border border-[#e7dccd] px-5 py-4 shadow-xl">

                    <div className="flex items-center gap-3">

                      <MapPin
                        size={15}
                        className="text-[#b8924a]"
                      />

                      <EditableText
                        as="span"
                        text={location}
                        isEditable={isEditable}
                        onUpdate={(val) =>
                          onUpdate?.(
                            "location",
                            val
                          )
                        }
                        className="text-[10px] uppercase tracking-[0.25em] text-[#5c5752]"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Info Cards */}
              <div className="grid grid-cols-1 gap-3 mt-10">

                {/* Languages */}
                {languages?.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-xl border border-[#e7dccd] p-5">

                    <div className="flex items-center gap-2 mb-4">
                      <Globe2
                        size={14}
                        className="text-[#b8924a]"
                      />

                      <span className="text-[10px] uppercase tracking-[0.28em] text-[#8f8477]">
                        Languages
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {languages.map(
                        (
                          language: string,
                          i: number
                        ) => (
                          <div
                            key={i}
                            className="border border-[#e7dccd] px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-[#5c5752] bg-[#faf7f2]"
                          >
                            {language}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}