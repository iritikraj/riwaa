/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LayoutDashboard, PlusCircle, BarChart3, History, CheckCircle2, Check, X, Sparkles, HistoryIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the shape of our recommendation based on the Strapi schema
interface Recommendation {
  id: number;
  object_id: string;
  object_name: string;
  level: string;
  action: string;
  change_pct?: number;
  rationale: string;
  confidence: string;
  supporting_metrics: any;
  status: string;
}

export default function DashboardClient({ initialRecommendations }: { initialRecommendations: Recommendation[] }) {
  // Initialize state directly with server props. Zero loading states!
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const pathname = usePathname();

  const handleAction = async (id: number, actionType: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const endpoint = `/api/meta-agent/recommendations/${id}/${actionType}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: actionType === 'reject' ? JSON.stringify({ reason: 'Manual rejection from dashboard' }) : undefined
      });

      const data = await res.json();
      if (data.success) {
        // Remove the processed item from the UI smoothly
        setRecommendations((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(`Failed to ${actionType}: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error processing ${actionType}:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleManualScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/meta-agent/optimize', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Optimizer AI is now scanning your Meta account. It may take a minute or two to analyze the data. Refresh the page shortly!');
      } else {
        alert(`Failed to start scan: ${data.error}`);
      }
    } catch (error) {
      console.error('Error starting manual scan:', error);
      alert('An error occurred while starting the scan.');
    } finally {
      setIsScanning(false);
    }
  };

  // Helper to format the action into human-readable text
  const formatAction = (action: string, pct?: number) => {
    const cleanAction = action.replace('_', ' ').toUpperCase();
    return pct ? `${cleanAction} (${pct}%)` : cleanAction;
  };

  // Dynamic styling for the action badges
  const getActionStyle = (action: string) => {
    if (action.includes('increase')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('decrease') || action === 'pause') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-[#14181F]/5 text-[#14181F]/70 border-[#14181F]/15';
  };

  // Navigation Tabs for the Meta Agent Module
  const navTabs = [
    { name: 'Dashboard', href: '/meta-agent', icon: LayoutDashboard },
    { name: 'Campaign Setup', href: '/meta-agent/setup', icon: PlusCircle },
    { name: 'History', href: '/meta-agent/history', icon: HistoryIcon },
    { name: 'Reports', href: '/meta-agent/reports', icon: BarChart3 },
    { name: 'Audit Log', href: '/meta-agent/audit', icon: History },
  ];

  const activeTab = navTabs.find(tab => tab.href === pathname) || navTabs[0];

  return (
    <main className="grow text-[#14181F] antialiased p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Responsive Module Sub-Navigation */}
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
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
              Optimizer Queue
            </span>
            <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
              Approval Dashboard
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#565C6B]">
              Review and execute AI-generated strategic recommendations directly into Meta Ads Manager.
            </p>
          </div>

          {/* Header Actions: Badge & Trigger Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#14181F]/10 rounded-full shadow-sm">
              <div className={`h-2 w-2 rounded-full ${recommendations.length > 0 ? 'bg-[#9C7A3C] animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[12px] uppercase tracking-widest font-medium text-[#14181F]">
                {recommendations.length} Pending Actions
              </span>
            </div>

            <button
              onClick={handleManualScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-4 py-2 bg-[#14181F] text-[#FCFBF8] border border-[#14181F] hover:bg-transparent hover:text-[#14181F] rounded-full shadow-sm text-[12px] uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none ${isScanning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isScanning ? (
                <Activity size={14} className="animate-spin text-[#9C7A3C]" />
              ) : (
                <Sparkles size={14} className="text-[#9C7A3C]" />
              )}
              {isScanning ? 'Scanning...' : 'Run AI Scan Now'}
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="min-h-[400px]">
          {recommendations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[28px] border border-[#14181F]/10 shadow-sm p-16 flex flex-col items-center justify-center text-center"
            >
              <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 mb-6">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-cormorant font-bold text-[#14181F] mb-2">Queue is clear</h3>
              <p className="text-[15px] text-[#565C6B] max-w-md">
                The AI optimizer hasn&apos;t found any new opportunities today. The system will continue scanning your campaigns in the background.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-7 flex flex-col lg:flex-row gap-8 lg:items-center justify-between group transition-shadow hover:shadow-md relative overflow-hidden"
                  >
                    {/* Decorative Background Accent */}
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#9C7A3C]/5 blur-[60px] pointer-events-none group-hover:bg-[#9C7A3C]/10 transition-colors" />

                    {/* Left Side: Details */}
                    <div className="flex-1 space-y-4 z-10">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-[0.2em] ${getActionStyle(rec.action)}`}>
                          {formatAction(rec.action, rec.change_pct)}
                        </span>
                        <span className="text-[10px] text-[#565C6B] uppercase tracking-[0.2em] font-medium border border-[#14181F]/5 px-2.5 py-1 rounded-full bg-[#FCFBF8]">
                          {rec.level}
                        </span>
                        <span className="text-[10px] font-mono text-[#14181F]/40 bg-[#14181F]/5 px-2.5 py-1 rounded-full">
                          ID: {rec.object_id}
                        </span>
                      </div>

                      <h3 className="text-xl font-medium text-[#14181F]">{rec.object_name || 'Unnamed Object'}</h3>

                      <div className="bg-[#FCFBF8] border border-[#14181F]/5 p-4 rounded-xl max-w-4xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} className="text-[#9C7A3C]" />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]">AI Strategy Rationale</span>
                        </div>
                        <p className="text-[#565C6B] text-[14px] leading-relaxed">
                          {rec.rationale}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-48 shrink-0 z-10">
                      <button
                        onClick={() => handleAction(rec.id, 'approve')}
                        disabled={processingId === rec.id}
                        className="flex-1 lg:flex-none px-6 py-3.5 bg-[#14181F] hover:bg-[#14181F]/90 text-[#FCFBF8] text-[13px] font-medium rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingId === rec.id ? (
                          <>
                            <Activity className="animate-spin" size={16} />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleAction(rec.id, 'reject')}
                        disabled={processingId === rec.id}
                        className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-[#14181F]/10 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-[#565C6B] text-[13px] font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}