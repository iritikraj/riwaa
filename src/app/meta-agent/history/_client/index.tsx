/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, BarChart3, History as HistoryIcon, Clock, CheckCircle2, X, FileText, Target, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CampaignHistoryClient({ initialCampaigns }: { initialCampaigns: any[] }) {
  // We initialize our state immediately with the data from the server. No loading needed!
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const navTabs = [
    { name: 'Dashboard', href: '/meta-agent', icon: LayoutDashboard },
    { name: 'Campaign Setup', href: '/meta-agent/setup', icon: PlusCircle },
    { name: 'History', href: '/meta-agent/history', icon: HistoryIcon },
    { name: 'Reports', href: '/meta-agent/reports', icon: BarChart3 },
    { name: 'Audit Log', href: '/meta-agent/audit', icon: FileText },
  ];

  const activeTab = navTabs.find(tab => tab.href === pathname) || navTabs[0];

  return (
    <main className="grow text-[#14181F] antialiased p-6 lg:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Module Sub-Navigation */}
        <div className="mb-8 relative z-20">

          {/* Mobile View: Premium Dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-[#14181F]/10 rounded-2xl shadow-sm"
            >
              <div className="flex items-center gap-3 text-[14px] font-medium text-[#14181F]">
                <activeTab.icon size={18} className="text-[#9C7A3C]" />
                {activeTab.name}
              </div>
              <ChevronDown size={18} className={`text-[#14181F]/50 transition-transform duration-300 ${isMobileNavOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isMobileNavOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#14181F]/10 rounded-2xl shadow-lg overflow-hidden"
                >
                  {navTabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3.5 text-[14px] font-medium transition-colors ${isActive ? 'bg-[#FCFBF8] text-[#14181F] border-l-2 border-[#9C7A3C]' : 'text-[#565C6B] hover:bg-[#14181F]/5 border-l-2 border-transparent'
                          }`}
                      >
                        <tab.icon size={18} className={isActive ? 'text-[#9C7A3C]' : 'opacity-50'} />
                        {tab.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop View: Existing Pill Design */}
          <div className="hidden md:flex overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#14181F]/10 rounded-full shadow-sm">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 ${isActive
                      ? 'bg-[#14181F] text-[#FCFBF8] shadow-md'
                      : 'text-[#565C6B] hover:text-[#14181F] hover:bg-[#14181F]/5'
                      }`}
                  >
                    <tab.icon size={16} className={isActive ? 'text-[#9C7A3C]' : 'opacity-70'} />
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

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

        {/* Grid List of Campaigns - No loading state needed! */}
        {campaigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#14181F]/10 text-[#565C6B]">
            No past campaigns found.
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
      </div>

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
    </main>
  );
}