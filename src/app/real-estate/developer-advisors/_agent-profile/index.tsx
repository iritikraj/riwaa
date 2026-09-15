"use client";

import { MessageCircle, Phone, Star, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentProfileProps {
  agentData: {
    name: string;
    profileImage?: string;
    companyLogo?: string;
    companyName?: string;
    phoneNumber?: string;
    hasWhatsapp?: boolean;
    rating?: string;
    languages?: string;
    uniqueTag?: string;
    summaryStats?: { title: string; value: string }[];
  };
  agentBio?: string;
}

export function DetailedAgentProfile({ agentData, agentBio }: AgentProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      // FIXED: Changed max-w-6xl to max-w-5xl to tighten horizontal whitespace
      className="max-w-5xl mx-auto px-6 lg:px-8 py-16 w-full font-jost"
    >
      <div className="bg-white flex flex-col md:flex-row min-w-full rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-neutral-100 relative overflow-hidden group">

        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#c5a059] to-[#e6d0a3]" />

        {/* LEFT SIDE: Imagery, Identity & Bio */}
        <div className="flex-1 p-8 md:p-10 flex flex-col">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Profile Image */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm">
                {agentData.profileImage ? (
                  <img src={agentData.profileImage} alt={agentData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">No Image</div>
                )}
              </div>
              {agentData.companyLogo && (
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full p-2 shadow-md border border-neutral-100 flex items-center justify-center">
                  <img src={agentData.companyLogo} alt={agentData.companyName} className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Name & Details */}
            <div className="flex-1">
              <h3 className="text-3xl font-normal text-neutral-900 leading-tight tracking-tight">{agentData.name}</h3>
              <p className="text-sm font-semibold tracking-wide text-[#c5a059] mt-1.5 uppercase">
                {agentData.companyName} Specialist
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                {agentData.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm text-neutral-700 font-medium">{agentData.rating} Rating</span>
                  </div>
                )}

                {agentData.languages && (
                  <div className="flex items-start gap-1.5 text-neutral-500">
                    <CheckCircle size={14} className="text-[#c5a059] mt-1" />
                    <span className="text-sm">Speaks: {agentData.languages}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agent Bio - Separated by a faint line */}
          {agentBio && (
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <p className="text-[15px] text-neutral-500 font-light leading-loose whitespace-pre-wrap">
                {agentBio.match(/^(?:[^.]*\.){1,2}/)?.[0] || agentBio}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Stats & CTAs */}
        {/* FIXED: Changed justify-between to justify-center to eliminate vertical whitespace */}
        <div className="w-full md:w-90 lg:w-100 p-8 md:p-10 border-t md:border-t-0 md:border-l border-neutral-100 bg-[#fafafa]/50 flex flex-col justify-center gap-8">

          {agentData.summaryStats && agentData.summaryStats.length > 0 && (
            <div className="flex flex-col gap-4">
              {agentData.summaryStats
                .filter((stat) => {
                  const t = stat.title.toLowerCase();
                  return !t.includes('for sale') && !t.includes('for rent');
                })
                .map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-neutral-100/80 rounded-2xl p-5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-center"
                  >
                    <p className="text-xl md:text-2xl font-semibold text-neutral-900 mb-1.5 leading-tight">
                      {stat.value.replace(/Million AED/gi, 'M AED')}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">
                      {stat.title}
                    </p>
                  </div>
                ))}
            </div>
          )}
          <div className="flex flex-col gap-3">
            {agentData.hasWhatsapp && (
              <a
                href={`https://wa.me/${(agentData.phoneNumber || '+971581980131')?.replace(/\D/g, '')}?text=Hi ${agentData.name}, I am interested in ${agentData.companyName} properties.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#22bf5b] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle size={18} /> WhatsApp Direct
              </a>
            )}
            <a
              href={`tel:${agentData.phoneNumber || '+971581980131'}`}
              className="w-full flex items-center justify-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-lg shadow-neutral-900/20"
            >
              <Phone size={18} /> Call Specialist
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}