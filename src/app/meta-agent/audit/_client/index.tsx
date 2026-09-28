/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileJson, LayoutDashboard, PlusCircle, BarChart3, History as HistoryIcon, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuditLogClient({ initialLogs }: { initialLogs: any[] }) {
  // Initialize state directly from server props. No loading needed!
  const [logs] = useState<any[]>(initialLogs);
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const toggleLog = (id: number) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getBadgeStyle = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type === 'campaign_setup') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (type.includes('create')) return 'border-blue-200 bg-blue-50 text-blue-700';
    if (type.includes('reject') || type.includes('fail')) return 'border-rose-200 bg-rose-50 text-rose-700';
    if (type.includes('report') || type.includes('plan')) return 'border-[#b8924a]/20 bg-[#b8924a]/10 text-[#9C7A3C]';
    return 'border-[#14181F]/15 bg-[#14181F]/5 text-[#14181F]/70';
  };

  // Extract unique event types dynamically from your fetched logs
  const uniqueEventTypes = Array.from(new Set(logs.map(log => {
    const data = log.attributes || log;
    return data.event_type;
  })));

  // Update the filter logic to match the exact event type
  const filteredLogs = logs.filter(log => {
    if (selectedEventType === 'all') return true;
    const data = log.attributes || log;
    return data.event_type === selectedEventType;
  });

  const renderHumanReadable = (eventType: string, details: any) => {
    switch (eventType) {
      case 'campaign_setup':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <CheckCircle2 size={16} />
              <span className="text-[14px] font-semibold">End-to-End Campaign Successfully Deployed</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[12px] bg-[#FCFBF8] border border-[#14181F]/10 px-2.5 py-1 rounded-md text-[#565C6B]">
                Campaign: <span className="font-mono text-[#14181F] font-medium">{details.campaignId}</span>
              </span>
              {details.adsetIds?.map((id: string) => (
                <span key={id} className="text-[12px] bg-[#FCFBF8] border border-[#14181F]/10 px-2.5 py-1 rounded-md text-[#565C6B]">
                  Ad Set: <span className="font-mono text-[#14181F] font-medium">{id}</span>
                </span>
              ))}
            </div>
          </div>
        );

      case 'campaign_plan_drafted':
        return (
          <div className="space-y-3">
            <p className="text-[14px] text-[#14181F] font-medium">AI Strategy Formulated</p>
            <div className="bg-[#FCFBF8] p-3.5 rounded-xl border border-[#14181F]/5">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9C7A3C] block mb-1">Rationale</span>
              <p className="text-[13px] text-[#565C6B] leading-relaxed line-clamp-3">
                {details.plan?.rationale || 'No rationale provided.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {details.plan?.ad_sets?.map((adset: any, idx: number) => (
                <span key={idx} className="text-[11px] bg-white border border-[#14181F]/10 px-2 py-1 rounded text-[#565C6B]">
                  Drafting: {adset.name} (${adset.daily_budget_usd}/day)
                </span>
              ))}
            </div>
          </div>
        );

      case 'campaign_created':
        return (
          <div>
            <p className="text-[14px] text-[#14181F] font-medium mb-1">Pushed Campaign Shell to Meta</p>
            <p className="text-[13px] text-[#565C6B] mb-2">
              Created as <strong>{details.spec?.name}</strong> with objective <strong>{details.spec?.objective}</strong>.
            </p>
            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded">
              ID: {details.campaign_id} (Status: {details.status})
            </span>
          </div>
        );

      case 'adset_created':
        return (
          <div>
            <p className="text-[14px] text-[#14181F] font-medium mb-1">Pushed Ad Set to Meta</p>
            <p className="text-[13px] text-[#565C6B] mb-2">
              Created <strong>{details.spec?.name}</strong> with a daily budget of ${(details.spec?.daily_budget / 100).toFixed(2)}.
            </p>
            <div className="flex gap-2 items-center">
              <span className="text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded">
                ID: {details.adset_id}
              </span>
              {details.spec?.targeting?.geo_locations?.countries && (
                <span className="text-[11px] bg-[#FCFBF8] border border-[#14181F]/10 px-2 py-1 rounded text-[#565C6B]">
                  Geo: {details.spec.targeting.geo_locations.countries.join(', ')}
                </span>
              )}
            </div>
          </div>
        );

      case 'report_generated':
        return (
          <div>
            <p className="text-[14px] text-[#14181F] font-medium mb-1">Performance Report Generated</p>
            <p className="text-[13px] text-[#565C6B]">
              Analyzed {details.datePreset?.replace('_', ' ')} data for <strong>{details.clientName || 'Client'}</strong>.
            </p>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-2 text-[#565C6B]">
            <AlertCircle size={16} />
            <span className="text-[13px]">System event recorded. View raw payload for details.</span>
          </div>
        );
    }
  };

  const navTabs = [
    { name: 'Dashboard', href: '/meta-agent', icon: LayoutDashboard },
    { name: 'Campaign Setup', href: '/meta-agent/setup', icon: PlusCircle },
    { name: 'History', href: '/meta-agent/history', icon: HistoryIcon },
    { name: 'Reports', href: '/meta-agent/reports', icon: BarChart3 },
    { name: 'Audit Log', href: '/meta-agent/audit', icon: HistoryIcon },
  ];

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
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
              Paper Trail
            </span>
            <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
              System Audit Log
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#565C6B]">
              Immutable record of all AI decisions, campaign creations, and manual approvals across the workspace.
            </p>
          </div>

          {/* Event Filter Dropdown */}
          <div className="relative w-full md:w-72">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full pl-5 pr-10 py-3 bg-white border border-[#14181F]/10 rounded-full text-[13px] text-[#14181F] focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all shadow-sm appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Event Types</option>
              {uniqueEventTypes.map((type) => (
                <option key={type as string} value={type as string}>
                  {(type as string).replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
            {/* Custom Dropdown Chevron */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-[#14181F]/40" />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="bg-white rounded-[28px] border border-[#14181F]/10 shadow-sm overflow-hidden min-h-[500px]">
          <div className="hidden md:grid grid-cols-[140px_180px_1fr] gap-6 border-b border-[#14181F]/5 bg-[#FCFBF8] px-8 py-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/40">Timestamp</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/40">Event Type</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/40">Activity Summary</span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#565C6B]">
              <FileJson size={32} className="opacity-20 mb-4 text-[#14181F]" />
              <p className="text-[14px]">No audit logs found for this event type.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#14181F]/5">
              {filteredLogs.map((log, i) => {
                const data = log.attributes || log;
                const date = formatDate(data.createdAt);
                const isExpanded = expandedLogs.has(log.id);

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="group flex flex-col md:flex-row gap-3 md:gap-6 px-5 py-5 md:px-8 md:py-6 hover:bg-[#FCFBF8]/50 transition-colors border-b border-[#14181F]/5 last:border-0"
                  >
                    {/* Mobile Header Group: Timestamp + Badge sit on the same line on mobile */}
                    <div className="flex flex-row items-start justify-between md:justify-start w-full md:w-[344px] shrink-0">

                      {/* Timestamp */}
                      <div className="flex items-start gap-2.5 md:w-[140px] shrink-0">
                        <Clock size={14} className="text-[#14181F]/30 mt-0.5 md:mt-1 md:w-4 md:h-4" />
                        <div>
                          <p className="text-[13px] md:text-[14px] font-medium text-[#14181F]">{date.day}</p>
                          <p className="text-[11px] md:text-[12px] text-[#565C6B] mt-0.5">{date.time}</p>
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <div className="flex items-center justify-center md:w-[180px] shrink-0 mt-0.5 md:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-center ${getBadgeStyle(data.event_type)}`}>
                          {data.event_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Content Area (Human Readable + Code Toggle) */}
                    <div className="flex flex-col items-start w-full min-w-0 mt-2 md:mt-0">

                      {/* Human Readable Summary */}
                      <div className="w-full mb-4">
                        {renderHumanReadable(data.event_type, data.details)}
                      </div>

                      {/* Developer Toggle Button */}
                      <button
                        onClick={() => toggleLog(log.id)}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#14181F]/40 hover:text-[#9C7A3C] transition-colors border border-[#14181F]/10 hover:border-[#9C7A3C]/30 px-3 py-1.5 rounded-full bg-white self-start"
                      >
                        <FileJson size={12} />
                        {isExpanded ? 'Hide Raw Payload' : 'View Raw Payload'}
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {/* Raw JSON Accordion */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="w-full overflow-hidden"
                          >
                            <pre className="w-full max-w-full overflow-x-auto bg-[#14181F] border border-[#14181F]/10 rounded-2xl p-4 md:p-5 text-[10px] md:text-[11px] font-mono text-[#FCFBF8]/80 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                              {JSON.stringify(data.details, null, 2)}
                            </pre>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}