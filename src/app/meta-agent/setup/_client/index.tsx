/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, LayoutDashboard, PlusCircle, BarChart3, History, Sparkles, CheckCircle2, FileText, HelpCircle, HistoryIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CampaignSetupClientPage() {
  const [brief, setBrief] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/meta-agent/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to setup campaign');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation Tabs for the Meta Agent Module
  const navTabs = [
    { name: 'Dashboard', href: '/meta-agent', icon: LayoutDashboard },
    { name: 'Campaign Setup', href: '/meta-agent/setup', icon: PlusCircle },
    { name: 'History', href: '/meta-agent/history', icon: HistoryIcon },
    { name: 'Reports', href: '/meta-agent/reports', icon: BarChart3 },
    { name: 'Audit Log', href: '/meta-agent/audit', icon: History },
  ];

  // 2. Add this state inside your component (near your other state declarations)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 3. Helper to find the current active tab for the mobile button
  const activeTab = navTabs.find(tab => tab.href === pathname) || navTabs[0];

  return (
    <main className="grow text-[#14181F] antialiased p-6 lg:p-10">
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

        {/* Header Section */}
        <header className="mb-12">
          <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
            Deployment
          </span>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
            Campaign Setup
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
            Paste a client brief to automatically structure and draft a paused Meta Ads campaign.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: Input Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-7 h-fit">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-3">
                  Client Brief / Instructions
                </label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="e.g., We are launching a new luxury residential project in Dubai. Budget is $150/day. Target high-net-worth individuals aged 30-55..."
                  className="w-full h-64 p-5 bg-[#FCFBF8] border border-[#14181F]/10 rounded-2xl text-[14px] text-[#14181F] placeholder-[#14181F]/30 focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !brief.trim()}
                className={`w-full ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[#14181F] hover:bg-[#14181F]/90 text-[#FCFBF8] font-medium py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm`}
              >
                {isLoading ? (
                  <>
                    <Activity className="animate-spin" size={18} />
                    Drafting in Meta...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-[#9C7A3C]" />
                    Generate & Push to Meta
                  </>
                )}
              </button>
            </form>

            {error && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 bg-rose-50 text-rose-700 rounded-xl text-[13px] border border-rose-100">
                {error}
              </motion.div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-8 flex flex-col min-h-125 relative overflow-hidden">

            {/* Background decorative blur */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#b8924a]/5 blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-6 z-10">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]">
                Generation Output
              </h2>
              {result && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-emerald-600 border border-emerald-100">
                  Deployed
                </span>
              )}
            </div>

            {!result && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#565C6B] z-10">
                <FileText size={40} className="mb-4 text-[#14181F]/10" strokeWidth={1} />
                <p className="text-[14px] text-center max-w-xs">
                  Submit a brief to see the AI&apos;s logic and the resulting Meta Campaign IDs here.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#9C7A3C] z-10 space-y-4">
                <Activity className="animate-pulse mb-2" size={32} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Gemini is analyzing the brief...</span>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 overflow-y-auto z-10 pr-2 scrollbar-thin scrollbar-thumb-[#14181F]/10 scrollbar-track-transparent"
              >
                {/* Success Banner */}
                <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-4">
                  <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                  <div>
                    <h3 className="text-emerald-900 font-semibold mb-2">Successfully Created (Paused)</h3>
                    <div className="space-y-2 mt-1 w-full">
                      {/* Campaign ID Row */}
                      <div className="text-[13px] text-emerald-700 flex items-center justify-between bg-white/60 px-3.5 py-2 rounded-lg border border-emerald-100/50 transition-colors hover:bg-white/80">
                        <span className="font-medium shrink-0">Campaign ID</span>
                        <span className="font-mono text-[12px] bg-emerald-100/50 border border-emerald-200/50 px-2.5 py-1 rounded text-emerald-800 shadow-sm">
                          {result.campaignId}
                        </span>
                      </div>

                      {/* Ad Set IDs Row */}
                      <div className="text-[13px] text-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between bg-white/60 px-3.5 py-2 rounded-lg border border-emerald-100/50 transition-colors hover:bg-white/80 gap-3">
                        <span className="font-medium shrink-0">Ad Set IDs</span>
                        <div className="flex flex-wrap items-center sm:justify-end gap-1.5">
                          {result.adsetIds.map((id: string) => (
                            <span
                              key={id}
                              className="font-mono text-[12px] bg-emerald-100/50 border border-emerald-200/50 px-2.5 py-1 rounded text-emerald-800 shadow-sm"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Rationale */}
                <div className="bg-[#FCFBF8] border border-[#14181F]/5 p-5 rounded-2xl">
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-3">
                    Strategic Rationale
                  </h4>
                  <p className="text-[14px] text-[#14181F] leading-relaxed">
                    {result.plan.rationale}
                  </p>
                </div>

                {/* Open Questions */}
                {result.plan.open_questions?.length > 0 && (
                  <div className="bg-[#b8924a]/5 border border-[#b8924a]/10 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle size={14} className="text-[#9C7A3C]" />
                      <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#9C7A3C]">
                        Clarifications Needed
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {result.plan.open_questions.map((q: string, i: number) => (
                        <li key={i} className="text-[13px] text-[#14181F]/80 flex items-start gap-2">
                          <span className="text-[#9C7A3C] mt-0.5">•</span>
                          <span className="leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}