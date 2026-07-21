/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Swords, Activity, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface CompetitorDetailProps {
  record: any;
}

export default function CompetitorDetailView({ record }: CompetitorDetailProps) {
  const router = useRouter();

  const { target_url, competitor_urls, industry, createdAt, audit_status, audit_data } = record;
  const primaryCompetitorUrl = competitor_urls?.[0] || 'Competitor';
  const date = new Date(createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

  const isProcessing = audit_status === 'processing' || audit_status === 'pending';
  const hasAnalysis = !!audit_data?.analysis;

  // const targetRaw = audit_data?.raw_extraction?.target;
  // const compRaw = audit_data?.raw_extraction?.competitors?.[0];
  const categories = audit_data?.analysis?.categories || {};

  // 1. Live Polling
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [isProcessing, router]);

  // Format category names nicely
  const formatCategoryName = (key: string) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-16 font-jost text-neutral-800 pb-20">

      {/* HEADER SECTION */}
      <header className="border-b border-neutral-200 pb-10">
        <Link href="/seo-agent/competitor" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light text-neutral-900 flex items-center gap-4 tracking-tight mb-4">
              <Swords className="w-8 h-8 text-neutral-400" />
              Gap Analysis
            </h1>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-emerald-700 w-24">TARGET:</span>
                <span className="text-neutral-700 font-mono truncate">{target_url}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-rose-700 w-24">COMPETITOR:</span>
                <span className="text-neutral-700 font-mono truncate">{primaryCompetitorUrl}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-500">
              <span>{date}</span>
              {industry && <span>Context: <span className="text-neutral-900">{industry}</span></span>}
            </div>
          </div>

          <div>
            {isProcessing ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  Workers Analyzing...
                </span>
              </div>
            ) : (
              <span className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                Analysis Complete
              </span>
            )}
          </div>
        </div>
      </header>

      {/* PROCESSING STATE */}
      {isProcessing && !hasAnalysis && (
        <div className="py-32 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-100 blur-xl rounded-full opacity-50" />
            <Activity className="w-12 h-12 text-blue-500 relative z-10 animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-800 mb-3">
            Extracting Parallel Metrics...
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm text-center leading-relaxed">
            Headless engines are currently parsing the DOM, Core Web Vitals, and NLP entities for both the target and competitor URLs.
          </p>
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {hasAnalysis && (
        <div className="space-y-12 animate-in fade-in duration-700">

          {/* HIGH LEVEL SCOREBOARD */}
          <div className="p-8 bg-white border border-neutral-200 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />

            <div className="flex-1 text-center md:text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 mb-2">Target URL</p>
              <p className="text-lg font-medium text-neutral-900 truncate max-w-xs">{new URL(target_url).hostname}</p>
            </div>

            <div className="shrink-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 shadow-inner z-10 relative">
                <Swords className="w-5 h-5 text-neutral-400" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 mt-3 font-semibold">Versus</span>
            </div>

            <div className="flex-1 text-center md:text-right">
              <p className="text-[11px] font-bold uppercase tracking-widest text-rose-700 mb-2">Competitor URL</p>
              <p className="text-lg font-medium text-neutral-900 truncate max-w-xs">{new URL(primaryCompetitorUrl).hostname}</p>
            </div>

            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 flex items-center gap-3">
            <span className="w-6 h-px bg-neutral-300"></span> Category Scorecards
          </h3>

          {/* DYNAMIC CATEGORY CARDS */}
          <div className="grid grid-cols-1 gap-8">
            {Object.entries(categories).map(([key, data]: [string, any]) => {

              const targetWins = data.target_score >= data.competitor_score;

              return (
                <div key={key} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">

                  {/* Card Header */}
                  <div className={`px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${targetWins ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}>
                    <h4 className="text-base font-semibold text-neutral-900 capitalize flex items-center gap-2">
                      {formatCategoryName(key)}
                    </h4>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Target</span>
                        <span className={`text-2xl font-light ${targetWins ? 'text-emerald-600' : 'text-neutral-400'}`}>{data.target_score}<span className="text-sm text-neutral-400">/10</span></span>
                      </div>
                      <div className="w-px h-8 bg-neutral-200" />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Competitor</span>
                        <span className={`text-2xl font-light ${!targetWins ? 'text-rose-600' : 'text-neutral-400'}`}>{data.competitor_score}<span className="text-sm text-neutral-400">/10</span></span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning Block */}
                  <div className="p-6 bg-neutral-50/50">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="mt-1">
                        {!targetWins ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-800 mb-2">The Deficit Analysis</p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{data.ai_opinion?.deficit_reason || 'No deficit analysis provided.'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Lightbulb className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-800 mb-2">Actionable Fix</p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{data.ai_opinion?.actionable_fix || 'No fix suggested.'}</p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}