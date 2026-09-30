/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/meta-agent/[accountId]/history/_client.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, X, FileText, Target, HelpCircle } from 'lucide-react';

export default function CampaignHistoryClient({ initialCampaigns }: { initialCampaigns: any[] }) {
  const [campaigns] = useState<any[]>(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      <header className="mb-10">
        <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
          Library
        </span>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
          Campaign History
        </h1>
        <p className="mt-3 text-[15px] text-[#565C6B]">
          Browse previously generated campaigns and their AI rationales.
        </p>
      </header>

      {/* Grid List of Campaigns */}
      {campaigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#14181F]/10 text-[#565C6B]">
          No past campaigns found for this account.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((log) => {
            const data = log.attributes || log;
            const details = data.details;

            return (
              <motion.div
                key={log.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCampaign(data)}
                className="bg-white border border-[#14181F]/10 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#565C6B] font-medium uppercase tracking-wider">
                    <Clock size={14} /> {formatDate(data.createdAt)}
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>

                <h3 className="font-semibold text-[16px] leading-tight mb-2 group-hover:text-[#9C7A3C] transition-colors">
                  {details.plan?.campaign?.name || 'Untitled Campaign'}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[11px] bg-[#FCFBF8] border border-[#14181F]/5 px-2 py-1 rounded text-[#565C6B]">
                    {details.plan?.ad_sets?.length || 0} Ad Sets
                  </span>
                  <span className="text-[11px] bg-emerald-50 border border-emerald-100 px-2 py-1 rounded text-emerald-700">
                    Deployed
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Popup (Modal) */}
      <AnimatePresence>
        {selectedCampaign && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCampaign(null)}
              className="fixed inset-0 bg-[#14181F]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FCFBF8] w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#14181F]/10 bg-white">
                  <div>
                    <h2 className="text-xl font-bold font-cormorant text-[#14181F] tracking-normal">
                      {selectedCampaign.details.plan?.campaign?.name || 'Campaign Details'}
                    </h2>
                    <p className="text-[12px] text-[#565C6B] mt-1 font-medium">
                      Generated on {formatDate(selectedCampaign.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="p-2 hover:bg-[#14181F]/5 rounded-full transition-colors"
                  >
                    <X size={20} className="text-[#14181F]/60" />
                  </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">

                  {/* Meta IDs Section */}
                  <section className="bg-white p-5 rounded-2xl border border-[#14181F]/10 shadow-sm">
                    <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#9C7A3C] mb-4 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Meta Deployment IDs
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#14181F]/5">
                        <span className="text-[13px] font-medium text-[#14181F]">Campaign ID</span>
                        <span className="font-mono text-[12px] bg-blue-50 text-blue-800 px-2 py-1 rounded">
                          {selectedCampaign.details.campaignId}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2">
                        <span className="text-[13px] font-medium text-[#14181F] mt-1">Ad Set IDs</span>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 justify-end">
                          {selectedCampaign.details.adsetIds?.map((id: string) => (
                            <span key={id} className="font-mono text-[12px] bg-blue-50 text-blue-800 px-2 py-1 rounded">
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* AI Rationale */}
                  <section>
                    <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#9C7A3C] mb-3 flex items-center gap-2">
                      <FileText size={14} /> Strategic Rationale
                    </h3>
                    <p className="text-[14px] leading-relaxed text-[#565C6B] bg-white p-5 rounded-2xl border border-[#14181F]/10 shadow-sm">
                      {selectedCampaign.details.plan?.rationale}
                    </p>
                  </section>

                  {/* Ad Sets Structure */}
                  <section>
                    <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#9C7A3C] mb-3 flex items-center gap-2">
                      <Target size={14} /> Budget & Targeting Structure
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedCampaign.details.plan?.ad_sets?.map((adset: any, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-[#14181F]/10 shadow-sm">
                          <p className="font-semibold text-[#14181F] text-[14px] mb-2">{adset.name}</p>
                          <div className="space-y-1.5 text-[12px] text-[#565C6B]">
                            <p><strong>Budget:</strong> ${adset.daily_budget_usd}/day</p>
                            <p><strong>Goal:</strong> {adset.optimization_goal}</p>
                            {adset.meta_countries && (
                              <p><strong>Geos:</strong> {adset.meta_countries.join(', ')}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Open Questions */}
                  {selectedCampaign.details.plan?.open_questions?.length > 0 && (
                    <section>
                      <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#9C7A3C] mb-3 flex items-center gap-2">
                        <HelpCircle size={14} /> Clarifications Needed
                      </h3>
                      <ul className="bg-[#14181F]/5 p-5 rounded-2xl border border-[#14181F]/10 space-y-3">
                        {selectedCampaign.details.plan.open_questions.map((q: string, idx: number) => (
                          <li key={idx} className="flex gap-3 text-sm text-[#14181F]">
                            <span className="text-[#9C7A3C]">•</span> {q}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}