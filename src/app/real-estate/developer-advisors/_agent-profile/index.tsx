import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

interface AgentProfileProps {
  developerName: string;
  agentBio: string;
  agentData: {
    name: string;
    profileImage?: string;
    companyLogo?: string;
    companyName?: string;
    summaryStats?: { title: string; value: string }[];
  };
}

export function DetailedAgentProfile({ developerName, agentBio, agentData }: AgentProfileProps) {
  return (
    <section className="w-full bg-white py-24 border-t border-neutral-100 font-jost">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left: Agent Imagery & Stats */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative w-full max-w-sm mx-auto lg:mx-0 rounded-4xl overflow-hidden bg-neutral-100 border border-neutral-200 p-2 shadow-lg">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
                {agentData.profileImage ? (
                  <img src={agentData.profileImage} alt={agentData.name} className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="w-full h-full bg-neutral-200" />
                )}

                {/* Overlay Company Logo */}
                {agentData.companyLogo && (
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20">
                    <img src={agentData.companyLogo} alt={agentData.companyName} className="h-8 object-contain" />
                  </div>
                )}
              </div>
            </div>

            {/* The 2x2 Stats Grid from PropertyFinder */}
            {agentData.summaryStats && agentData.summaryStats.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {agentData.summaryStats.map((stat, idx) => (
                  <div key={idx} className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100 hover:border-[#b8924a]/30 transition-colors">
                    <p className="text-xl font-medium text-neutral-900 mb-1">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-500">{stat.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: The Full Tailored Bio */}
          <div className="lg:col-span-7 lg:pl-10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#b8924a] mb-4 block flex items-center gap-2">
              <Award size={14} /> Meet Your Specialist
            </span>
            <h2 className="text-4xl font-light text-neutral-900 leading-[1.2] mb-8">
              Why work with <span className="font-medium">{agentData.name}?</span>
            </h2>

            <div className="prose prose-neutral prose-lg text-neutral-600 font-light leading-relaxed mb-10">
              {agentBio.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 last:mb-0">{paragraph}</p>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#b8924a]" />
                <p className="text-sm font-medium text-neutral-800">Exclusive access to {developerName} inventory</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#b8924a]" />
                <p className="text-sm font-medium text-neutral-800">Zero commission or agency fees for off-plan</p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#b8924a]" />
                <p className="text-sm font-medium text-neutral-800">VIP unit selection before public launch</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}