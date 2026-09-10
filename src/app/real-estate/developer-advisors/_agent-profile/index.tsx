"use client";

import { MessageCircle, Phone, Star } from 'lucide-react';
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
    summaryStats?: { title: string; value: string }[];
  };
  agentBio: string;
}

export function DetailedAgentProfile({ agentData }: AgentProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full"
    >
      <div className="bg-white flex flex-col md:flex-row gap-0 md:gap-6 justify-between min-w-full rounded-3xl p-3 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-neutral-100 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#B8924A] to-[#E3CBA4]" />

        <div className="flex items-center gap-6 md:gap-2">
          <div className="relative">
            <div className="w-24 md:w-48 h-24 md:h-48 rounded-full overflow-hidden border-2 border-[#B8924A]/20 bg-neutral-50 shadow-sm shrink-0">
              {agentData.profileImage ? (
                <img src={agentData.profileImage} alt={agentData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">No Image</div>
              )}
            </div>
            {agentData.companyLogo && (
              <div className="absolute -bottom-2 md:-bottom-1 -right-2 md:-right-1 w-10 md:h-20 h-10 md:w-20 bg-white rounded-full p-1 shadow-md border border-neutral-100">
                <img src={agentData.companyLogo} alt={agentData.companyName} className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          <div className="flex-1 pt-2">
            <h3 className="text-xl md:text-2xl font-medium text-neutral-900">{agentData.name}</h3>
            <p className="text-xs md:text-lg font-jost tracking-wide text-[#B8924A] mt-1">
              {agentData.companyName} Specialist
            </p>
            {agentData.rating && (
              <div className="flex items-center gap-1 mt-2">
                <Star size={12} className="fill-amber-400 text-amber-400 md:h-6 md:w-6" />
                <span className="text-xs md:text-base font-jost text-neutral-600">{agentData.rating} Rating</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-2">
          {agentData.summaryStats && agentData.summaryStats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {agentData.summaryStats.map((stat, idx) => (
                <div key={idx} className="bg-neutral-50/70 border border-neutral-100 rounded-2xl p-3 text-center transition-colors hover:bg-neutral-50">
                  <p className="text-lg md:text-2xl font-semibold text-neutral-900 mb-0.5">{stat.value}</p>
                  <p className="text-xs font-jost md:text-sm uppercase tracking-widest text-neutral-500">{stat.title}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            {agentData.hasWhatsapp && (
              <a
                href={`https://wa.me/${agentData.phoneNumber?.replace(/\D/g, '')}?text=Hi ${agentData.name}, I am interested in ${agentData.companyName} properties.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex font-jost items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22bf5b] text-white py-3.5 rounded-xl text-xs md:text-sm font-medium uppercase tracking-widest transition-colors shadow-sm"
              >
                <MessageCircle size={16} /> WhatsApp Direct
              </a>
            )}
            {agentData.phoneNumber && agentData.phoneNumber.trim() !== "" && (
              <a
                href={`tel:${agentData.phoneNumber}`}
                className="w-full flex font-jost items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl text-xs md:text-sm font-medium uppercase tracking-widest transition-colors shadow-sm"
              >
                <Phone size={16} /> Call Specialist
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}