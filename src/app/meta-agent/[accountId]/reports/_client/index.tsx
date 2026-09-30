// riwaa/src/app/meta-agent/[accountId]/reports/_client.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, HistoryIcon, Sparkles, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportingEngineClientProps {
  initialReports: any[];
  activeAccountId: string;
  activeAccountName: string;
}

export default function ReportingEngineClient({ initialReports, activeAccountId, activeAccountName }: ReportingEngineClientProps) {
  const [datePreset, setDatePreset] = useState('last_30d');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ report: string; metrics: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Pass the accountId and the pre-filled account name
      const query = new URLSearchParams({
        accountId: activeAccountId,
        clientName: activeAccountName,
        datePreset
      });

      const res = await fetch(`/api/meta-agent/report?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResult({ report: data.report, metrics: data.metrics });
      } else {
        setError(data.error || 'Failed to generate report');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoricalReport = (doc: any) => {
    const data = doc.attributes || doc;
    setResult({
      report: data.markdown_content,
      metrics: data.metrics
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Header Section */}
      <header className="mb-12">
        <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
          Performance • {activeAccountName}
        </span>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
          Executive Reporting
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
          Generate AI-narrated performance teardowns from live Meta Ads data for {activeAccountName}.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Sidebar & History */}
        <div className="lg:col-span-4 h-fit space-y-6">

          {/* Generate New Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-7">
            <form onSubmit={handleGenerate} className="space-y-6">

              {/* Removed the manual "Client Name" input because we automatically use activeAccountName */}

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-2">
                  Timeframe
                </label>
                <select
                  value={datePreset}
                  onChange={(e) => setDatePreset(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl text-[14px] text-[#14181F] focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all appearance-none"
                >
                  <option value="last_7d">Last 7 Days</option>
                  <option value="last_30d">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="maximum">Maximum (All Time)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#14181F] hover:bg-[#14181F]/90 text-[#FCFBF8] font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Activity className="animate-spin" size={16} />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-[#9C7A3C]" />
                    Generate Narrative
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

          {/* Historical Reports Library */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-7">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-5 flex items-center gap-2">
              <HistoryIcon size={14} /> Report Library
            </h3>

            {initialReports.length === 0 ? (
              <p className="text-[13px] text-[#565C6B] text-center py-4 bg-[#FCFBF8] rounded-xl border border-[#14181F]/5">
                No historical reports found for {activeAccountName}.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {initialReports.map((doc) => {
                  const data = doc.attributes || doc;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => loadHistoricalReport(doc)}
                      className="w-full flex flex-col text-left bg-[#FCFBF8] hover:bg-[#14181F]/5 border border-[#14181F]/5 hover:border-[#14181F]/15 p-4 rounded-xl transition-all group"
                    >
                      <div className="flex justify-between items-start w-full mb-2">
                        <span className="font-semibold text-[14px] text-[#14181F] group-hover:text-[#9C7A3C] transition-colors line-clamp-1">
                          {data.client_name}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-[#565C6B] bg-white border border-[#14181F]/10 px-2 py-0.5 rounded shrink-0">
                          {data.date_preset.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#565C6B]">
                        <Clock size={12} /> {formatDate(data.createdAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Report Output Area */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-8 md:p-10 min-h-[600px] flex flex-col relative overflow-hidden">

            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#b8924a]/5 blur-[100px] pointer-events-none" />

            {!result && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#565C6B] z-10">
                <FileText size={40} className="mb-4 text-[#14181F]/10" strokeWidth={1} />
                <p className="text-[14px]">Select a timeframe or past report to view insights for {activeAccountName}.</p>
              </div>
            )}

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#9C7A3C] z-10">
                <Activity className="animate-pulse mb-4" size={32} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Drafting Narrative...</span>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10"
              >
                {/* High-Level Metrics Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 pb-8 border-b border-[#14181F]/5">
                  <div className="bg-[#FCFBF8] p-4 rounded-2xl border border-[#14181F]/5">
                    <p className="text-[9px] text-[#565C6B] uppercase tracking-[0.2em] font-semibold mb-1">Total Spend</p>
                    <p className="text-2xl font-bold text-[#14181F]">${result.metrics?.total_spend || 0}</p>
                  </div>
                  <div className="bg-[#FCFBF8] p-4 rounded-2xl border border-[#14181F]/5">
                    <p className="text-[9px] text-[#565C6B] uppercase tracking-[0.2em] font-semibold mb-1">Impressions</p>
                    <p className="text-2xl font-bold text-[#14181F]">{(result.metrics?.total_impressions || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#FCFBF8] p-4 rounded-2xl border border-[#14181F]/5">
                    <p className="text-[9px] text-[#565C6B] uppercase tracking-[0.2em] font-semibold mb-1">Blended CTR</p>
                    <p className="text-2xl font-bold text-[#14181F]">{result.metrics?.blended_ctr || 0}%</p>
                  </div>
                  <div className="bg-[#FCFBF8] p-4 rounded-2xl border border-[#14181F]/5">
                    <p className="text-[9px] text-[#565C6B] uppercase tracking-[0.2em] font-semibold mb-1">Avg CPC</p>
                    <p className="text-2xl font-bold text-[#14181F]">${result.metrics?.blended_cpc || 0}</p>
                  </div>
                </div>

                {/* Report Content rendered with Markdown */}
                <div>
                  <span className="inline-block px-3 py-1.5 rounded-full border border-[#14181F]/10 bg-[#14181F]/5 text-[9px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-6">
                    AI Analysis
                  </span>
                  <div className="max-w-3xl">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold font-cormorant text-[#14181F] mt-8 mb-4 tracking-wide" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold font-cormorant text-[#14181F] mt-8 mb-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-[#14181F] mt-6 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 text-[15px] text-[#565C6B] leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-[#14181F]" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-[15px] text-[#565C6B]" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-[15px] text-[#565C6B]" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#9C7A3C] pl-4 italic text-[#565C6B] my-4" {...props} />
                      }}
                    >
                      {result.report}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}