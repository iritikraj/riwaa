"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface DeveloperHeroProps {
  developerName: string;
  developerLogo?: string;
  developerProfile?: string;
  heroImage: string;
  heroBanner?: string;
  trustStats: string[];
}

export function DeveloperHero({
  developerName,
  developerLogo,
  developerProfile,
  heroImage,
  heroBanner,
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
        {heroBanner && heroBanner.endsWith('.mp4') ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-80"
          >
            <source src={heroBanner} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroBanner || heroImage}
            alt={`${developerName} Luxury Properties`}
            className="w-full h-full object-cover object-center scale-105 opacity-90 animate-image-pan"
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />

        {/* NEW: Top Gradient to ensure the navbar logo pops against bright backgrounds */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* NEW: Floating Navbar Area */}
      <div className="absolute top-0 left-0 w-full z-30 px-6 lg:px-12 py-4 md:py-0 flex items-center justify-center">
        {developerLogo ? (
          <img
            src={developerLogo}
            alt={`${developerName} Logo`}
            // Reduced height from the original h-20 to look like a sleek nav logo
            className="h-12 md:h-20 w-auto object-contain drop-shadow-md"
          />
        ) : (
          <span className="text-white text-lg tracking-[0.3em] font-medium uppercase">
            {developerName}
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full py-24 mt-12">
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