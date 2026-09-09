"use client";

import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, MessageCircle, Phone, Star, ShieldCheck, Award, MapPin } from "lucide-react";

interface DeveloperHeroProps {
  developerName: string;
  developerProfile: string;
  agentData: {
    name: string;
    profileImage?: string;
    companyLogo?: string;
    companyName?: string;
    phoneNumber?: string;
    hasWhatsapp?: boolean;
    rating?: string;
    summaryStats?: { title: string; value: string }[];
  };
  agentBio: string;
}

export function DeveloperHero({
  developerName,
  developerProfile,
  agentData,
  agentBio,
}: DeveloperHeroProps) {
  console.log("DeveloperHero", agentData);
  return (
    <section className="relative w-full bg-[#FDFCFB] overflow-hidden font-jost border-b border-neutral-200 pb-20 pt-10">

      {/* Subtle Background Elements for Premium Depth */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4af71]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neutral-100 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* LEFT: Developer Credibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200">
              <BadgeCheck size={14} className="text-[#B8924A]" />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-600">
                Official Developer Partner
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 tracking-tight leading-[1.1]">
                <span className="font-medium text-[#B8924A]">{developerName}</span>
              </h1>
              <p className="text-lg text-neutral-500 font-light max-w-2xl leading-relaxed">
                {developerProfile}
              </p>
            </div>

            {/* Quick Stats or Trust Indicators */}
            <div className="flex items-center gap-8 pt-4 border-t border-neutral-200/60 max-w-lg">
              <div>
                <p className="text-2xl font-light text-neutral-900">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Direct Inventory</p>
              </div>
              <div className="w-px h-8 bg-neutral-200" />
              <div>
                <p className="text-2xl font-light text-neutral-900">0%</p>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Agency Fees</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Agent VIP Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-neutral-100 relative overflow-hidden group">
              {/* Decorative accent top line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8924A] to-[#E3CBA4]" />

              {/* Agent Header */}
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#B8924A]/20 bg-neutral-50 shadow-sm shrink-0">
                    {agentData.profileImage ? (
                      <img src={agentData.profileImage} alt={agentData.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">No Image</div>
                    )}
                  </div>
                  {agentData.companyLogo && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full p-1 shadow-md border border-neutral-100">
                      <img src={agentData.companyLogo} alt={agentData.companyName} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-medium text-neutral-900">{agentData.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#B8924A] mt-1">
                    {developerName} Specialist
                  </p>
                  {agentData.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-neutral-600">{agentData.rating} Rating</span>
                    </div>
                  )}
                </div>
              </div>

              {/* NEW: Agent Performance Stats Grid */}
              {agentData.summaryStats && agentData.summaryStats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {agentData.summaryStats.map((stat, idx) => (
                    <div key={idx} className="bg-neutral-50/70 border border-neutral-100 rounded-2xl p-3 text-center transition-colors hover:bg-neutral-50">
                      <p className="text-[13px] font-semibold text-neutral-900 mb-0.5">{stat.value}</p>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-500">{stat.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                {agentData.hasWhatsapp && (
                  <a
                    href={`https://wa.me/${agentData.phoneNumber?.replace(/\D/g, '')}?text=Hi ${agentData.name}, I am interested in ${developerName} properties.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22bf5b] text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors shadow-sm"
                  >
                    <MessageCircle size={16} /> WhatsApp Direct
                  </a>
                )}
                {agentData.phoneNumber && agentData.phoneNumber.trim() !== "" && (
                  <a
                    href={`tel:${agentData.phoneNumber}`}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors shadow-sm"
                  >
                    <Phone size={16} /> Call Specialist
                  </a>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export function DeveloperHeroTwo({ developerName, developerProfile, agentData, agentBio }: DeveloperHeroProps) {
  return (
    <div className="w-full bg-[#FCFBF8] text-neutral-900 font-jost pt-16 pb-24 relative overflow-hidden">

      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#f4ebd9] rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* CO-BRANDING HEADER */}
        <div className="flex items-center justify-between mb-20 border-b border-neutral-200 pb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#b8924a] mb-2 block">
              Master Developer
            </span>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-neutral-900 uppercase">
              {developerName}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-px h-12 bg-neutral-200 hidden md:block" />
            <div className="text-right flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-neutral-400 mb-2 block">
                Exclusive Partner
              </span>
              {agentData.companyLogo ? (
                <img src={agentData.companyLogo} alt={agentData.companyName} className="h-8 md:h-10 object-contain mix-blend-multiply" />
              ) : (
                <span className="text-sm font-medium tracking-widest uppercase">{agentData.companyName}</span>
              )}
            </div>
          </div>
        </div>

        {/* MAIN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* LEFT: Developer Profile & Why Choose Us */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-light leading-[1.2] tracking-tight text-neutral-900 mb-6">
                Shaping the future of <br />
                <span className="font-serif italic text-[#b8924a]">luxury living.</span>
              </h2>
              <p className="text-neutral-600 text-lg leading-relaxed font-light">
                {developerProfile}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
              <div>
                <ShieldCheck className="text-[#b8924a] w-6 h-6 mb-4" strokeWidth={1.5} />
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">Proven Heritage</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">Delivering world-class communities with sustained capital appreciation.</p>
              </div>
              <div>
                <Award className="text-[#b8924a] w-6 h-6 mb-4" strokeWidth={1.5} />
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 mb-2">Premium Quality</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">Architectural excellence and uncompromised finishing standards.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Agent Profile Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-neutral-100 relative">

              {/* Specialist Badge */}
              <div className="absolute -top-4 right-8 bg-[#b8924a] text-white text-[9px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-full shadow-md">
                {developerName} Specialist
              </div>

              <div className="flex items-center gap-6 mb-8">
                {agentData.profileImage ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-100 shadow-sm shrink-0">
                    <img src={agentData.profileImage} alt={agentData.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <span className="text-2xl text-neutral-400 font-light">{agentData.name.charAt(0)}</span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-1">{agentData.name}</h3>
                  <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-medium flex items-center gap-1.5">
                    <MapPin size={12} /> UAE Real Estate Expert
                  </p>

                  {agentData.rating && (
                    <div className="flex items-center gap-1 mt-3">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-neutral-700">{agentData.rating} Rating</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Bio */}
              {/* Agent Bio - Full Text */}
              <div className="mb-6">
                <div className="text-sm text-neutral-600 leading-relaxed font-light">
                  {agentBio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Scraped Stats (if available) */}
              {agentData.summaryStats && agentData.summaryStats.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
                  {agentData.summaryStats.slice(0, 2).map((stat, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-xl p-4 text-center border border-neutral-100">
                      <p className="text-lg font-medium text-neutral-900 mb-1">{stat.value}</p>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-500">{stat.title}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}