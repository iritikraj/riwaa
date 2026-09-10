"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

interface DeveloperHeroProps {
  developerName: string;
  developerProfile?: string;
  heroImage: string;
  trustStats: string[];
}

export function DeveloperHero({
  developerName,
  developerProfile,
  heroImage,
  trustStats,
}: DeveloperHeroProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center font-jost overflow-hidden shadow-2xl">

      {/* 1. Full-Bleed Background Image with Premium Vignette */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <img
          src={heroImage}
          alt={`${developerName} Luxury Properties`}
          // Reduced opacity slightly to 90% for a richer feel, letting the image breathe
          className="w-full h-full object-cover object-center scale-105 opacity-90 animate-image-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/60" /> */}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full py-24 mt-10">
        <div className="gap-12 lg:gap-8 items-center">

          {/* LEFT: Headline & Trust Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-10"
          >
            <div>
              <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-light text-white tracking-tight leading-[1.05]">
                {developerName}
              </h1>
            </div>

            {/* Trust Stat Pills - Upgraded Glassmorphism */}
            <div className="flex flex-wrap items-center gap-3">
              {trustStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/15 text-white/95 px-5 py-2.5 rounded-full text-xs font-medium tracking-widest uppercase shadow-xl"
                >
                  {stat}
                </div>
              ))}
            </div>

            {developerProfile && (
              <p className="text-lg text-white/70 font-light max-w-2xl leading-relaxed line-clamp-3">
                {developerProfile}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}