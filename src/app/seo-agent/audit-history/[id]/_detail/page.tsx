/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/seo-agent/audit/history/[id]/_components/AuditDetailView.tsx
'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ShieldCheck, AlertTriangle, ArrowLeft, Calendar, Globe, ChevronDown, ChevronUp, CheckCircle, Tag, Layers, FileText, LayoutTemplate, XCircle, Search, MessageCircle, TrendingUp, Sparkles, Activity, Code, Zap } from 'lucide-react';
import Link from 'next/link';

interface AuditDetailProps {
  record: any;
}

export default function AuditDetailView({ record }: AuditDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  const { target_url, industry, createdAt, audit_status, audit_data } = record;
  const date = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'medium', timeStyle: 'short'
  });

  const isBatch = audit_data?.is_batch;
  const resultsArray = isBatch ? (audit_data.results || []) : (audit_data ? [audit_data] : []);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from('.detail-element', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power4.out',
    });
  }, { scope: containerRef });

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'high': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'performance': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
      case 'accessibility': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      case 'best practices': return 'text-blue-400 border-blue-500/30 bg-blue-500/5';
      case 'seo': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5';
      default: return 'text-neutral-400 border-neutral-500/30 bg-neutral-500/5';
    }
  };

  const StatusIcon = ({ status }: { status: boolean }) =>
    status ? <CheckCircle className="w-4 h-4 text-emerald-400/80" /> : <XCircle className="w-4 h-4 text-red-400/80" />;

  return (
    <div ref={containerRef} className="space-y-8 max-w-5xl mx-auto font-jost text-neutral-200">

      {/* HEADER CARD */}
      <div className="detail-element relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/seo-agent/audit-history" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-neutral-500 hover:text-neutral-300 transition-colors mb-6 border border-white/5 hover:border-white/20 px-4 py-2 rounded-full">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Archives
          </Link>
          <h2 className="text-2xl font-light text-white flex items-center gap-3 tracking-wide">
            <Globe className="w-6 h-6 text-emerald-500/80" />
            {target_url}
          </h2>
          <div className="flex items-center gap-5 mt-4 text-[10px] uppercase tracking-[0.2em] font-light text-neutral-500">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 opacity-60" /> {date}</span>
            {industry && <span className="flex items-center gap-1.5 border-l border-white/10 pl-5">Context: <span className="text-neutral-300">{industry}</span></span>}
            {isBatch && <span className="flex items-center gap-1.5 border-l border-white/10 pl-5"><Layers className="w-3.5 h-3.5 opacity-60" /> {audit_data.total_urls_scanned} Routes</span>}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <span className={`px-4 py-2 text-[9px] uppercase tracking-[0.3em] rounded-full border ${audit_status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/5 border-amber-500/20 text-amber-400'}`}>
            {audit_status}
          </span>
        </div>
      </div>

      {/* ACCORDION RESULTS */}
      {audit_status === 'completed' && resultsArray.length > 0 && (
        <div className="detail-element space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 ml-4 mb-2">Domain Route Matrix</h3>

          {resultsArray.map((result: any, idx: number) => {
            const isExpanded = expandedUrl === result.url;
            const kw = result.keyword_opportunities;
            const dom = result.raw_dom_data;
            const psi = result.raw_pagespeed_data;

            return (
              <div
                key={idx}
                onClick={() => setExpandedUrl(isExpanded ? null : result.url)}
                className={`bg-[#0b0b0c]/80 border border-white/10 rounded-[24px] p-8 backdrop-blur-3xl transition-all duration-300 cursor-pointer ${isExpanded ? 'bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'hover:bg-white/4'}`}
              >
                {/* Accordion Header */}
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-base font-light text-neutral-200 tracking-wide flex items-center gap-3">
                    {result.error ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-emerald-400/80" />}
                    {result.url}
                  </h4>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </div>
                </div>

                {result.error ? (
                  <p className="text-xs text-red-400/80 font-light tracking-wide">{result.error}</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-white/5 pb-8">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1.5">SEO Health</p>
                      <p className="text-3xl font-extralight text-emerald-400/90">{result.seo_health_score}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1.5">GEO Score</p>
                      <p className="text-3xl font-extralight text-cyan-400/90">{result.geo_visibility_score}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1.5">Accessibility</p>
                      <p className="text-3xl font-extralight text-purple-400/90">{result.accessibility_score || '--'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-1.5">Best Practices</p>
                      <p className="text-3xl font-extralight text-blue-400/90">{result.best_practices_score || '--'}</p>
                    </div>
                  </div>
                )}

                {/* EXPANDED DETAILS */}
                {isExpanded && !result.error && (
                  <div className="mt-8 pt-8 animate-in slide-in-from-top-4 duration-500 cursor-default" onClick={(e) => e.stopPropagation()}>

                    {/* ======================================================== */}
                    {/* SECTION 1: RAW INGESTION DATA (What we actually found)   */}
                    {/* ======================================================== */}
                    <div className="mb-8">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-6 border-b border-white/5 pb-2">1. Raw Data Extraction</h3>

                      {/* Keyword Opportunities */}
                      {kw && (
                        <div className="mb-6 bg-white/4 border border-white/5 rounded-2xl p-6">
                          <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-6 flex items-center gap-2">
                            <Search className="w-4 h-4 text-emerald-500" /> Search Opportunity Matrix
                          </h5>

                          <div className="mb-6 pb-6 border-b border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-2">Seed Keyword Focus</span>
                            <span className="text-lg font-light text-white bg-white/10 px-4 py-1.5 rounded-lg border border-white/10 inline-block">
                              {kw.primary_keyword}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h6 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-cyan-400" /> People Also Ask</h6>
                              <ul className="space-y-2">
                                {kw.question_keywords?.map((k: string, i: number) => <li key={i} className="text-xs text-neutral-300 font-light bg-black/20 px-3 py-2 rounded border border-white/5">{k}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h6 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Long-Tail</h6>
                              <ul className="space-y-2">
                                {kw.long_tail_keywords?.map((k: string, i: number) => <li key={i} className="text-xs text-neutral-300 font-light bg-black/20 px-3 py-2 rounded border border-white/5">{k}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h6 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2"><Search className="w-3.5 h-3.5 text-purple-400" /> Related Searches</h6>
                              <ul className="space-y-2">
                                {kw.related_searches?.map((k: string, i: number) => <li key={i} className="text-xs text-neutral-300 font-light bg-black/20 px-3 py-2 rounded border border-white/5">{k}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h6 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Semantic / LSI</h6>
                              <ul className="space-y-2">
                                {kw.semantic_keywords?.map((k: string, i: number) => <li key={i} className="text-xs text-neutral-300 font-light bg-black/20 px-3 py-2 rounded border border-white/5">{k}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Raw DOM Metrics */}
                        {dom && (
                          <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-6 flex items-center gap-2">
                              <Code className="w-3.5 h-3.5 text-blue-400" /> Raw DOM Extraction
                            </h5>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Word Count</span>
                                <span className="text-sm font-mono text-neutral-200">{dom.content_metrics?.word_count || 0}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Internal Links</span>
                                <span className="text-sm font-mono text-neutral-200">{dom.link_architecture?.internal_links || 0}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Meta Title Length</span>
                                <span className="text-sm font-mono text-neutral-200">{dom.title?.length || 0} chars</span>
                              </div>
                              {dom.headings?.h1?.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-2">Extracted H1</span>
                                  <p className="text-xs text-emerald-400/80 font-mono bg-black/20 p-2 rounded">{dom.headings.h1[0]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Raw Core Web Vitals */}
                        {psi && (
                          <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-6 flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-amber-400" /> Core Web Vitals (PSI)
                            </h5>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Largest Contentful Paint (LCP)</span>
                                <span className="text-sm font-mono text-neutral-200">{psi.web_vitals?.largest_contentful_paint || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">First Contentful Paint (FCP)</span>
                                <span className="text-sm font-mono text-neutral-200">{psi.web_vitals?.first_contentful_paint || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Total Blocking Time (TBT)</span>
                                <span className="text-sm font-mono text-neutral-200">{psi.web_vitals?.total_blocking_time || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-neutral-400">Layout Shift (CLS)</span>
                                <span className="text-sm font-mono text-neutral-200">{psi.web_vitals?.cumulative_layout_shift || '--'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* SECTION 2: AI SYNTHESIS (How Gemini interpreted it)      */}
                    {/* ======================================================== */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-6 border-b border-white/5 pb-2 mt-12">2. AI Synthesis & Diagnostics</h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Content Quality Panel */}
                        {result.content_quality && (
                          <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-6 flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5" /> Content Quality Metrics
                            </h5>

                            <div className="space-y-5">
                              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <span className="text-sm font-light text-neutral-400">Readability Score</span>
                                <span className="text-xl font-extralight text-emerald-400">{result.content_quality.readability_score}/100</span>
                              </div>
                              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <span className="text-sm font-light text-neutral-400">Thin Content Detected</span>
                                <StatusIcon status={!result.content_quality.thin_content_detected} />
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-2">Tone Analysis</span>
                                <p className="text-xs text-neutral-300 font-light leading-relaxed">{result.content_quality.tone_consistency}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* On-Page SEO Panel */}
                        {result.on_page_seo && (
                          <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                            <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-6 flex items-center gap-2">
                              <LayoutTemplate className="w-3.5 h-3.5" /> On-Page Structural Health
                            </h5>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-sm font-light text-neutral-300">Heading Hierarchy (H1-H6)</span>
                                <StatusIcon status={result.on_page_seo.heading_hierarchy_valid} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-sm font-light text-neutral-300">Open Graph & Social Cards</span>
                                <StatusIcon status={result.on_page_seo.open_graph_optimized} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-sm font-light text-neutral-300">Image Alt Accessibility</span>
                                <StatusIcon status={result.on_page_seo.images_optimized} />
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-sm font-light text-neutral-300">Internal/External Link Ratio</span>
                                <StatusIcon status={result.on_page_seo.link_ratio_healthy} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Technical Issues Ticket Board */}
                      {result.technical_issues && result.technical_issues.length > 0 && (
                        <div className="bg-white/4 border border-white/5 rounded-2xl p-6">
                          <h5 className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Developer Backlog
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.technical_issues.map((issue: any, i: number) => (
                              <div key={i} className="p-5 rounded-xl bg-[#0b0b0c]/50 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                  <p className="text-sm font-medium text-neutral-200 leading-snug">{issue.issue}</p>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                  <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border ${getCategoryColor(issue.category)}`}>
                                    {issue.category || 'SEO'}
                                  </span>
                                  <span className={`text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                                  <span className="text-neutral-500 mr-1 font-medium">Resolution:</span> {issue.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}