/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, ChevronDown, Check, Sparkles, TrendingUp,
  Smartphone, Monitor, Tablet, Search, Zap, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MetricKey = 'impressions' | 'cpc' | 'clicks' | 'cost' | 'conversions';

const METRIC_CONFIG = {
  impressions: { label: 'Impressions', color: '#2563EB', prefix: '' },
  cpc: { label: 'Avg. CPC', color: '#DC2626', prefix: '$' },
  clicks: { label: 'Clicks', color: '#4B5563', prefix: '' },
  cost: { label: 'Cost', color: '#D97706', prefix: '$' },
  conversions: { label: 'Conversions', color: '#059669', prefix: '' },
};

export default function ReportsClient({
  reportData,
  aiBrief,
  accountId,
  initialRange,
}: {
  reportData: any;
  aiBrief: any;
  accountId: string;
  initialRange: string;
}) {
  const router = useRouter();
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(['impressions', 'cpc']);

  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRange = e.target.value;
    startTransition(() => {
      router.push(`/google-agent/${accountId}/reports?range=${newRange}`);
    });
  };

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) => {
      if (prev.includes(metric)) {
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== metric);
      }
      if (prev.length >= 2) {
        return [prev[1], metric];
      }
      return [...prev, metric];
    });
  };

  const formatValue = (val: string | number, prefix = '') => {
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return `${prefix}0`;
    if (num >= 1000000) return `${prefix}${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(1)}K`;
    return `${prefix}${num.toLocaleString()}`;
  };

  const totalDeviceCost = parseFloat(reportData.devices.totals.cost) || 1;
  const mobileCostPct = ((reportData.devices.raw.MOBILE.cost / totalDeviceCost) * 100).toFixed(1);
  const desktopCostPct = ((reportData.devices.raw.DESKTOP.cost / totalDeviceCost) * 100).toFixed(1);
  const tabletCostPct = ((reportData.devices.raw.TABLET.cost / totalDeviceCost) * 100).toFixed(1);

  return (
    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out space-y-10 pb-24 font-jost text-[#14181F] transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

      {/* 1. Header & Range Selector */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase">
            Performance Ledger
          </p>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
            Overview & Intelligence
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
            Live synchronization across Google Ads ad groups, device shares, and keyword search intent.
          </p>
        </div>

        <div className="relative inline-block min-w-44">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {/* 2. Swap the icon to a spinner if loading */}
            {isPending ? (
              <Loader2 size={14} className="text-[#9C7A3C] animate-spin" />
            ) : (
              <Calendar size={14} className="text-[#9C7A3C]" />
            )}
          </div>
          <select
            value={initialRange}
            onChange={handleRangeChange}
            disabled={isPending} // Disable the dropdown while fetching
            className="appearance-none bg-white border border-[#14181F]/10 hover:border-[#9C7A3C]/50 rounded-full pl-10 pr-10 py-3 text-[12px] font-semibold uppercase tracking-wider text-[#14181F] outline-none cursor-pointer shadow-sm transition-all w-full disabled:bg-gray-50 disabled:cursor-wait"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Last 1 Year</option>
            <option value="all">All Time</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <ChevronDown size={14} className="text-[#14181F]/40" />
          </div>
        </div>
      </header>

      {/* 2. AI Performance Briefing Card */}
      {aiBrief && (
        <div className="relative overflow-hidden bg-linear-to-br from-white via-white to-[#9C7A3C]/5 rounded-3xl border border-[#9C7A3C]/20 p-7 md:p-9 shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#9C7A3C]/5 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#9C7A3C]/10 flex items-center justify-center text-[#9C7A3C]">
              <Sparkles size={16} />
            </div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#9C7A3C]">
              Gemini PPC Strategic Brief
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold font-cormorant tracking-tight text-[#14181F] mb-3">
            {aiBrief.executiveHeadline}
          </h2>
          <p className="text-[14px] leading-relaxed text-[#565C6B] max-w-3xl mb-6">
            {aiBrief.strategicTakeaway}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-[#14181F]/5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-800 flex items-center gap-1.5 mb-2.5">
                <Zap size={13} className="text-emerald-600" /> Key Efficiencies
              </span>
              <ul className="space-y-2">
                {aiBrief.keyWins?.map((win: string, i: number) => (
                  <li key={i} className="text-[13px] text-[#14181F]/80 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9C7A3C] flex items-center gap-1.5 mb-2.5">
                <TrendingUp size={13} className="text-[#9C7A3C]" /> Agent Recommendations
              </span>
              <ul className="space-y-2">
                {aiBrief.actionableRecommendations?.map((rec: string, i: number) => (
                  <li key={i} className="text-[13px] text-[#14181F]/80 flex items-start gap-2">
                    <span className="text-[#9C7A3C] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. Selectable KPI Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/50">
            Compare Primary & Secondary Metrics
          </span>
          <span className="text-[11px] text-[#9C7A3C] font-medium">
            Select 2 to overlay
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
            const config = METRIC_CONFIG[key];
            const isActive = activeMetrics.includes(key);
            const val = reportData.summary[key as keyof typeof reportData.summary];

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleMetric(key)}
                style={{
                  borderTopWidth: '3px',
                  borderTopColor: isActive ? config.color : 'transparent',
                }}
                className={`p-5 rounded-2xl text-left transition-all border ${isActive
                  ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-[#14181F]/10'
                  : 'bg-white/60 border-[#14181F]/5 hover:bg-white hover:border-[#14181F]/10'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] uppercase tracking-wider font-semibold ${isActive ? 'text-[#14181F]' : 'text-[#14181F]/50'}`}>
                    {config.label}
                  </span>
                  {isActive && <Check size={13} style={{ color: config.color }} />}
                </div>
                <p className="text-2xl font-bold tracking-tight text-[#14181F]">
                  {formatValue(val, config.prefix)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Dual-Axis Recharts Canvas */}
      <div className="bg-white rounded-3xl border border-[#14181F]/10 shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-6">
          <div className="flex items-center gap-4">
            {activeMetrics.map((m) => (
              <div key={m} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: METRIC_CONFIG[m].color }} />
                <span className="text-[12px] font-semibold text-[#14181F]">
                  {METRIC_CONFIG[m].label}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#14181F]/40">
            Daily Pacing
          </span>
        </div>

        <div style={{ width: '100%', height: '380px' }}>
          {reportData.chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#565C6B]">
              <p className="text-[14px]">No time-series data reported for this date range.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                {activeMetrics.map((metric) => (
                  <defs key={`grad-${metric}`}>
                    <linearGradient id={`color-${metric}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={METRIC_CONFIG[metric].color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={METRIC_CONFIG[metric].color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                ))}

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#14181F" strokeOpacity={0.05} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#565C6B' }} dy={10} minTickGap={24} />

                {activeMetrics.length > 0 && (
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: METRIC_CONFIG[activeMetrics[0]].color }}
                    tickFormatter={(val) => formatValue(val, METRIC_CONFIG[activeMetrics[0]].prefix)}
                  />
                )}
                {activeMetrics.length > 1 && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: METRIC_CONFIG[activeMetrics[1]].color }}
                    tickFormatter={(val) => formatValue(val, METRIC_CONFIG[activeMetrics[1]].prefix)}
                  />
                )}

                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(20,24,31,0.08)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '11px', color: '#565C6B', textTransform: 'uppercase', marginBottom: '4px' }}
                />

                {activeMetrics.map((metric, index) => (
                  <Area
                    key={metric}
                    yAxisId={index === 0 ? 'left' : 'right'}
                    type="monotone"
                    dataKey={metric}
                    name={METRIC_CONFIG[metric].label}
                    stroke={METRIC_CONFIG[metric].color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#color-${metric})`}
                    activeDot={{ r: 5, fill: METRIC_CONFIG[metric].color, stroke: '#fff', strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 5. Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Campaign Performance Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#14181F]/10 shadow-sm p-7">
          <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-5">
            <div>
              <h2 className="text-[13px] uppercase tracking-[0.2em] font-bold text-[#14181F]">
                Campaign Performance Summary
              </h2>
              <p className="text-[12px] text-[#565C6B] mt-0.5">Top performing Search & Performance Max channels</p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9C7A3C]">
              {reportData.campaigns.length} Active
            </span>
          </div>

          {reportData.campaigns.length === 0 ? (
            <div className="py-12 text-center text-[#565C6B] text-[13px]">
              No active campaigns registered for this account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-[#14181F]/5 text-[10px] uppercase tracking-widest text-[#14181F]/50">
                    <th className="pb-3 font-semibold">Campaign</th>
                    <th className="pb-3 font-semibold text-right">Cost</th>
                    <th className="pb-3 font-semibold text-right">Clicks</th>
                    <th className="pb-3 font-semibold text-right">CTR</th>
                    <th className="pb-3 font-semibold text-right">Avg. CPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14181F]/5">
                  {reportData.campaigns.map((camp: any) => (
                    <tr key={camp.id} className="hover:bg-[#FCFBF8] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full shrink-0 ${camp.status === 'ENABLED' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="font-semibold text-[#14181F] truncate max-w-[200px]" title={camp.name}>
                            {camp.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono font-medium text-[#14181F]">
                        ${parseFloat(camp.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 text-right font-mono text-[#565C6B]">
                        {camp.clicks.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right font-mono text-[#565C6B]">
                        {camp.ctr}%
                      </td>
                      <td className="py-3.5 text-right font-mono text-[#565C6B]">
                        ${camp.cpc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Device Distribution (1 Col) */}
        <div className="bg-white rounded-3xl border border-[#14181F]/10 shadow-sm p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-5">
              <h2 className="text-[13px] uppercase tracking-[0.2em] font-bold text-[#14181F]">
                Device Share
              </h2>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9C7A3C]">
                By Spend
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-4 w-full bg-[#14181F]/5 rounded-full overflow-hidden flex mb-6">
              <div style={{ width: `${mobileCostPct}%` }} className="bg-[#2563EB] h-full" title={`Mobile: ${mobileCostPct}%`} />
              <div style={{ width: `${desktopCostPct}%` }} className="bg-[#D97706] h-full" title={`Desktop: ${desktopCostPct}%`} />
              <div style={{ width: `${tabletCostPct}%` }} className="bg-[#059669] h-full" title={`Tablet: ${tabletCostPct}%`} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Smartphone size={14} />
                  </div>
                  <div>
                    <span className="font-semibold block">Mobile</span>
                    <span className="text-[11px] text-[#565C6B]">{reportData.devices.raw.MOBILE.clicks} clicks</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold">${reportData.devices.raw.MOBILE.cost.toFixed(2)}</span>
                  <span className="text-[11px] text-[#565C6B] block">{mobileCostPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Monitor size={14} />
                  </div>
                  <div>
                    <span className="font-semibold block">Computers</span>
                    <span className="text-[11px] text-[#565C6B]">{reportData.devices.raw.DESKTOP.clicks} clicks</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold">${reportData.devices.raw.DESKTOP.cost.toFixed(2)}</span>
                  <span className="text-[11px] text-[#565C6B] block">{desktopCostPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Tablet size={14} />
                  </div>
                  <div>
                    <span className="font-semibold block">Tablets</span>
                    <span className="text-[11px] text-[#565C6B]">{reportData.devices.raw.TABLET.clicks} clicks</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold">${reportData.devices.raw.TABLET.cost.toFixed(2)}</span>
                  <span className="text-[11px] text-[#565C6B] block">{tabletCostPct}%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-[#565C6B] text-center border-t border-[#14181F]/5 pt-4">
            Total Allocated: ${reportData.devices.totals.cost}
          </p>
        </div>
      </div>

      {/* 6. Top Search Terms / Words Within Searches */}
      {reportData.searchTerms?.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#14181F]/10 shadow-sm p-7">
          <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Search size={15} className="text-[#9C7A3C]" />
              <h2 className="text-[13px] uppercase tracking-[0.2em] font-bold text-[#14181F]">
                High-Volume Search Queries
              </h2>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#565C6B]">
              Real-world Intent
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {reportData.searchTerms.map((term: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[#FCFBF8] border border-[#14181F]/10 hover:border-[#9C7A3C]/40 rounded-full px-3.5 py-1.5 transition-colors"
              >
                <span className="text-[12px] font-medium text-[#14181F]">{term.term}</span>
                <span className="text-[10px] font-mono text-[#565C6B] bg-white px-2 py-0.5 rounded-full border border-[#14181F]/5">
                  {term.clicks} clicks • ${term.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}