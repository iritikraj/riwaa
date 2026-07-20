/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, AlertTriangle, ArrowLeft, Calendar, Globe,
  ChevronDown, ChevronUp, CheckCircle, Layers,
  LayoutTemplate, XCircle, Search, MessageCircle, TrendingUp, Code, Zap, Tag, Loader2, Activity
} from 'lucide-react';
import Link from 'next/link';

interface AuditDetailProps {
  record: any;
}

export default function AuditDetailView({ record }: AuditDetailProps) {
  const router = useRouter();
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  const { target_url, industry, createdAt, audit_status, audit_data } = record;
  const date = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'long', timeStyle: 'short'
  });

  const isBatch = audit_data?.is_batch;
  const resultsArray = isBatch ? (audit_data.results || []) : (audit_data ? [audit_data] : []);
  const domainArchitecture = audit_data?.domain_architecture;

  // 1. Better Data Checks
  const hasSpiderFinished = audit_data?.raw_spider_data !== undefined;
  // const totalPagesFound = audit_data?.raw_spider_data?.length || 0;
  const totalPagesFound = isBatch && hasSpiderFinished ? 1 : 0;
  const pagesProcessed = resultsArray.length;

  // 2. Smarter Processing Logic (It is processing if the spider hasn't finished OR if we haven't processed all pages)
  const isProcessing =
    audit_status === 'processing' ||
    audit_status === 'pending' ||
    (isBatch && !hasSpiderFinished) ||
    (isBatch && hasSpiderFinished && pagesProcessed < totalPagesFound);

  // 3. Keep the Polling
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 4000);

    return () => clearInterval(interval);
  }, [isProcessing, router]);

  React.useEffect(() => {
    if (resultsArray.length === 1) {
      setExpandedUrl(resultsArray[0].url);
    }
  }, [resultsArray]);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-700 bg-red-50 border border-red-200';
      case 'high': return 'text-orange-700 bg-orange-50 border border-orange-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border border-amber-200';
      default: return 'text-blue-700 bg-blue-50 border border-blue-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'performance': return 'text-purple-700 bg-purple-50 border border-purple-200';
      case 'accessibility': return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      case 'best practices': return 'text-blue-700 bg-blue-50 border border-blue-200';
      case 'seo': return 'text-cyan-700 bg-cyan-50 border border-cyan-200';
      default: return 'text-neutral-700 bg-neutral-100 border border-neutral-200';
    }
  };

  const StatusIcon = ({ status }: { status: boolean }) =>
    status ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />;

  // Clean up the DB data: Remove duplicate URLs and drop any titles that only have 1 unique URL
  const validDuplicateTitles = domainArchitecture?.duplicate_titles
    ?.map((dup: any) => ({
      ...dup,
      urls: Array.from(new Set(dup.urls)) // Deduplicate the URLs array
    }))
    .filter((dup: any) => dup.urls.length > 1); // Only keep if there are actually 2+ DIFFERENT urls

  return (
    <div className="space-y-16 font-jost text-neutral-800 pb-20">

      {/* HEADER SECTION */}
      <header className="border-b border-neutral-200 pb-10">
        <Link
          href="/seo-agent/audit-history"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Archives
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-neutral-900 flex items-center gap-4 tracking-tight mb-4">
              <Globe className="w-8 h-8 text-neutral-400" />
              {target_url}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-500">
              <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {date}</span>
              {industry && <span className="flex items-center gap-2">Context: <span className="text-neutral-900">{industry}</span></span>}
              {isBatch && hasSpiderFinished && (
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> {totalPagesFound} Routes Discovered
                </span>
              )}
            </div>
          </div>

          <div>
            {/* Smarter Live Badge */}
            {isProcessing ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full shadow-sm">
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  {!hasSpiderFinished ? "Mapping Domain..." : `Analyzing ${pagesProcessed} / ${totalPagesFound}`}
                </span>
              </div>
            ) : (
              <span className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200`}>
                Completed
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 4. THE NEW EMPTY LOADING STATE */}
      {isProcessing && resultsArray.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-100 blur-xl rounded-full opacity-50" />
            <Activity className="w-12 h-12 text-blue-500 relative z-10 animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-800 mb-3">
            {!hasSpiderFinished ? 'Running Domain Spider...' : 'AI Agents Analyzing...'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm text-center leading-relaxed">
            {!hasSpiderFinished
              ? 'The background spider is currently crawling the target URL to extract all valid routes and check domain architecture. This usually takes 1-2 minutes.'
              : 'The domain architecture has been mapped. Background AI workers are now processing the first batch of pages.'}
          </p>
        </div>
      )}

      {/* DOMAIN ARCHITECTURE (Duplicates & Orphans) */}
      {isBatch && domainArchitecture && (
        <section className="space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 flex items-center gap-3">
            <span className="w-6 h-px bg-neutral-300"></span> Domain Architecture Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <h4 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Duplicate Meta Titles
              </h4>
              {validDuplicateTitles && validDuplicateTitles.length > 0 ? (
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                  {validDuplicateTitles.map((dup: any, i: number) => (
                    <div key={i} className="pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                      <p className="text-xs font-medium text-neutral-800 mb-1">{dup.title}</p>
                      <ul className="space-y-1">
                        {dup.urls.map((u: string, idx: number) => (
                          <li key={idx} className="text-[10px] text-neutral-500 font-mono">- {u}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 italic">No duplicate titles detected.</p>
              )}
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <h4 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Orphan Pages
              </h4>
              {domainArchitecture.orphan_pages?.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {domainArchitecture.orphan_pages.map((u: string, idx: number) => (
                    <li key={idx} className="text-xs text-neutral-600 font-mono">{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500 italic">No orphan pages detected. Site architecture is healthy.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* DOCUMENT RESULTS FLOW */}
      {audit_status === 'completed' && resultsArray.length > 0 && (
        <div className="space-y-12">
          {resultsArray.map((result: any, idx: number) => {
            const isExpanded = expandedUrl === result.url;
            const kw = result.keyword_opportunities;
            const dom = result.raw_dom_data;
            const psi = result.raw_pagespeed_data;
            const nlp = result.raw_nlp_entities;

            // Safe derivations for Architecture Checklist based on DOM data
            const titleLength = dom?.title?.length || 0;
            const isTitleValid = titleLength >= 30 && titleLength <= 60;
            const descLength = dom?.description?.length || 0;
            const isDescValid = descLength >= 120 && descLength <= 160;
            const hasH1 = dom?.headings?.h1?.length > 0;
            const isUrlOptimized = dom?.url_metrics?.raw_url ? true : false;
            const hasBreadcrumbs = dom?.breadcrumbs && dom.breadcrumbs.length > 0;
            const hasOGTags = !!dom?.social_graph?.og_title;
            const hasTwitterCards = !!dom?.social_graph?.twitter_card;
            const hasCanonical = !!dom?.canonical_url;
            const noGenericAnchors = !dom?.link_architecture?.unoptimized_anchors || dom.link_architecture.unoptimized_anchors.length === 0;

            return (
              <section key={idx} className="group">
                {/* Expandable Route Header */}
                <div
                  onClick={() => setExpandedUrl(isExpanded ? null : result.url)}
                  className={`flex flex-col md:flex-row md:items-center justify-between py-6 cursor-pointer border-b transition-colors ${isExpanded ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`}
                >
                  <h2 className="text-lg font-medium text-neutral-900 flex items-center gap-3">
                    {result.error ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                    {result.url}
                  </h2>

                  {!result.error && (
                    <div className="flex items-center gap-8 mt-4 md:mt-0">
                      <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] font-semibold text-neutral-500">
                        <span className="flex items-center gap-2">SEO <span className="text-emerald-600 text-sm">{result.seo_health_score}</span></span>
                        <span className="flex items-center gap-2">GEO <span className="text-cyan-600 text-sm">{result.geo_visibility_score}</span></span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                    </div>
                  )}
                </div>

                {result.error && (
                  <p className="text-sm text-red-600 font-medium py-4">{result.error}</p>
                )}

                {/* EXPANDED SEAMLESS CONTENT */}
                {isExpanded && !result.error && (
                  <div className="py-12 animate-in fade-in duration-500 cursor-default" onClick={(e) => e.stopPropagation()}>

                    {/* Reasoning Scores Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                      <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div className="mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-800 mb-1.5">SEO Health</p>
                          <p className="text-[10px] text-neutral-500 leading-relaxed">Aggregated from on-page structure, content quality, and technical metadata.</p>
                        </div>
                        <p className="text-5xl font-light text-emerald-600">{result.seo_health_score}</p>
                      </div>

                      <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div className="mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-800 mb-1.5">Geo Visibility</p>
                          <p className="text-[10px] text-neutral-500 leading-relaxed">Calculated from local schema, regional keywords, and semantic entities.</p>
                        </div>
                        <p className="text-5xl font-light text-cyan-600">{result.geo_visibility_score}</p>
                      </div>

                      <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div className="mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-800 mb-1.5">Accessibility</p>
                          <p className="text-[10px] text-neutral-500 leading-relaxed">Based on WCAG compliance, ARIA attributes, and semantic HTML.</p>
                        </div>
                        <p className="text-5xl font-light text-purple-600">{result.accessibility_score || '--'}</p>
                      </div>

                      <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div className="mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-800 mb-1.5">Best Practices</p>
                          <p className="text-[10px] text-neutral-500 leading-relaxed">Evaluated against modern web standards, HTTPS, and safe cross-origin links.</p>
                        </div>
                        <p className="text-5xl font-light text-blue-600">{result.best_practices_score || '--'}</p>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* SECTION 1: RAW INGESTION DATA */}
                    {/* ======================================================== */}
                    <div className="mb-16">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 mb-8 flex items-center gap-3">
                        <span className="w-6 h-px bg-neutral-300"></span> 1. Raw Data Extraction
                      </h3>

                      {/* Keyword Opportunities */}
                      {kw && (
                        <div className="mb-12">
                          <h4 className="text-sm font-medium text-neutral-800 mb-6 flex items-center gap-2">
                            <Search className="w-4 h-4 text-neutral-400" /> Search Opportunity Matrix
                          </h4>
                          <div className="mb-8">
                            <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-neutral-500 block mb-2">Seed Keyword Focus</span>
                            <span className="text-lg font-medium text-neutral-900 border-b-2 border-emerald-200 pb-1">
                              {kw.primary_keyword}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                              <h5 className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-3 flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5" /> People Also Ask</h5>
                              <div className="flex flex-wrap gap-2">
                                {kw.question_keywords?.map((k: string, i: number) => <span key={i} className="text-xs text-neutral-700 bg-white border border-neutral-200 px-3 py-1.5 rounded-full">{k}</span>)}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-3 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Long-Tail</h5>
                              <div className="flex flex-wrap gap-2">
                                {kw.long_tail_keywords?.map((k: string, i: number) => <span key={i} className="text-xs text-neutral-700 bg-white border border-neutral-200 px-3 py-1.5 rounded-full">{k}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* NLP Entities */}
                      {nlp && nlp.length > 0 && (
                        <div className="mb-12">
                          <h4 className="text-sm font-medium text-neutral-800 mb-6 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-neutral-400" /> NLP Extracted Entities
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {nlp.map((ent: any, i: number) => (
                              <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <span className="text-xs font-medium text-neutral-900">{ent.name}</span>
                                <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
                                  <span className="text-[9px] uppercase tracking-widest text-neutral-400">{ent.type}</span>
                                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">{ent.google_salience_score}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Raw DOM Metrics */}
                        {dom && (
                          <div>
                            <h4 className="text-sm font-medium text-neutral-800 mb-6 flex items-center gap-2">
                              <Code className="w-4 h-4 text-neutral-400" /> Raw DOM Extraction
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">Word Count</span>
                                <span className="text-sm font-medium text-neutral-900">{dom.content_metrics?.word_count || 0}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">Internal Links</span>
                                <span className="text-sm font-medium text-neutral-900">
                                  {Array.isArray(dom.link_architecture?.internal_links) ? dom.link_architecture.internal_links.length : (dom.link_architecture?.internal_links || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">External Links</span>
                                <span className="text-sm font-medium text-neutral-900">
                                  {Array.isArray(dom.link_architecture?.external_links) ? dom.link_architecture.external_links.length : (dom.link_architecture?.external_links || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">Images Missing Alt Text</span>
                                <span className="text-sm font-medium text-amber-600">{dom.content_metrics?.images_missing_alt || 0}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Raw Core Web Vitals */}
                        {psi && (
                          <div>
                            <h4 className="text-sm font-medium text-neutral-800 mb-6 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-neutral-400" /> Core Web Vitals (PSI)
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">Largest Contentful Paint (LCP)</span>
                                <span className="text-sm font-medium text-neutral-900">{psi.web_vitals?.largest_contentful_paint || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">First Contentful Paint (FCP)</span>
                                <span className="text-sm font-medium text-neutral-900">{psi.web_vitals?.first_contentful_paint || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">Total Blocking Time (TBT)</span>
                                <span className="text-sm font-medium text-neutral-900">{psi.web_vitals?.total_blocking_time || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                                <span className="text-sm text-neutral-600">Layout Shift (CLS)</span>
                                <span className="text-sm font-medium text-neutral-900">{psi.web_vitals?.cumulative_layout_shift || '--'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* SECTION 2: AI SYNTHESIS & ON-PAGE ARCHITECTURE */}
                    {/* ======================================================== */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 mb-8 flex items-center gap-3">
                        <span className="w-6 h-px bg-neutral-300"></span> 2. AI Synthesis & Diagnostics
                      </h3>

                      <div className="mb-12">
                        {/* THE ON-PAGE ARCHITECTURE CHECKLIST (Derived directly from raw DB JSON) */}
                        {dom && (
                          <div className="mb-12">
                            <h4 className="text-sm font-medium text-neutral-800 mb-6 flex items-center gap-2">
                              <LayoutTemplate className="w-4 h-4 text-neutral-400" />Architecture Validation
                            </h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                              {/* 1. URL Optimization */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">1. URL Valid</span>
                                  <StatusIcon status={isUrlOptimized} />
                                </div>
                                <p className="text-xs font-mono text-neutral-500 break-all">{dom?.url_metrics?.raw_url || '--'}</p>
                              </div>

                              {/* 2. Slug Optimization */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">2. Slug Extraction</span>
                                  <StatusIcon status={dom?.url_metrics?.slug !== null} />
                                </div>
                                <p className="text-xs font-mono text-neutral-500">Path: {dom?.url_metrics?.slug || '--'}</p>
                              </div>

                              {/* 3. Title Length */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">3. Meta Title Length</span>
                                  <StatusIcon status={isTitleValid} />
                                </div>
                                <p className="text-xs font-mono text-neutral-600 mb-1">{dom?.title?.text || '--'}</p>
                                <span className={`text-[10px] font-semibold uppercase tracking-widest ${!isTitleValid ? 'text-amber-600' : 'text-emerald-600'}`}>
                                  {titleLength} Chars (Target: 30-60)
                                </span>
                              </div>

                              {/* 4. Meta Description Length */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">4. Description Length</span>
                                  <StatusIcon status={isDescValid} />
                                </div>
                                <p className="text-xs font-mono text-neutral-600 line-clamp-4 mb-1">{dom?.description?.text || '--'}</p>
                                <span className={`text-[10px] font-semibold uppercase tracking-widest ${!isDescValid ? 'text-amber-600' : 'text-emerald-600'}`}>
                                  {descLength} Chars (Target: 120-160)
                                </span>
                              </div>

                              {/* 5. Detailed Heading Hierarchy Map */}
                              <div className="col-span-1 lg:col-span-2 p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-sm font-semibold text-neutral-900">5. Heading Hierarchy Validation</span>
                                  <StatusIcon status={hasH1} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {['h1', 'h2', 'h3'].map((level) => (
                                    <div key={level}>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-2">{level.toUpperCase()} ({dom?.headings?.[level]?.length || 0})</span>
                                      {dom?.headings?.[level]?.length > 0 ? (
                                        <ul className="space-y-2">
                                          {dom.headings[level].map((text: string, idx: number) => (
                                            <li key={idx} className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-100">{text}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <span className="text-xs text-neutral-400 italic">None found</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 6. Canonical Tags */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">6. Canonical Target</span>
                                  <StatusIcon status={hasCanonical} />
                                </div>
                                <p className="text-xs font-mono text-neutral-500">{dom?.canonical_url || <span className="text-red-500 font-medium">Missing Tag</span>}</p>
                              </div>

                              {/* 7. Robots Meta */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">7. Robots Directive</span>
                                  <StatusIcon status={true} />
                                </div>
                                <p className="text-xs font-mono text-neutral-500">Rule: {dom?.robots_meta || 'index, follow (Default)'}</p>
                              </div>

                              {/* 8. Open Graph Tags */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">8. Open Graph (OG)</span>
                                  <StatusIcon status={hasOGTags} />
                                </div>
                                <p className="text-xs font-mono text-neutral-500">Title: {dom?.social_graph?.og_title || <span className="text-amber-500 font-medium">Missing</span>}</p>
                              </div>

                              {/* 9. Twitter Cards */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">9. Twitter Cards</span>
                                  <StatusIcon status={hasTwitterCards} />
                                </div>
                                <p className="text-xs font-mono text-neutral-500">Type: {dom?.social_graph?.twitter_card || <span className="text-amber-500 font-medium">Missing</span>}</p>
                              </div>

                              {/* 10. Anchor Text Optimization */}
                              <div className="col-span-1 lg:col-span-2 p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">10. Anchor Text Check</span>
                                  <StatusIcon status={noGenericAnchors} />
                                </div>
                                <div className="text-xs font-mono text-neutral-500">
                                  {!noGenericAnchors ? (
                                    <div>
                                      <span className="text-amber-600 font-medium block mb-2">Found {dom.link_architecture.unoptimized_anchors.length} unoptimized links:</span>
                                      <ul className="space-y-1">
                                        {dom.link_architecture.unoptimized_anchors.map((anc: any, i: number) => (
                                          <li key={i}>&quot;{anc.text}&quot; → {anc.href}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : (
                                    <span className="text-emerald-600 font-medium">All internal anchors are contextually optimized</span>
                                  )}
                                </div>
                              </div>

                              {/* 11. Breadcrumb Check */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">11. Breadcrumb Navigation</span>
                                  <StatusIcon status={hasBreadcrumbs} />
                                </div>
                                <div className="text-xs font-mono text-neutral-500">
                                  {hasBreadcrumbs ? dom.breadcrumbs.join(' > ') : <span className="text-amber-500 font-medium">No Breadcrumbs Detected</span>}
                                </div>
                              </div>

                              {/* 12. Pagination */}
                              <div className="p-5 bg-white border border-neutral-200 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-neutral-900">12. Pagination (Rel Next/Prev)</span>
                                  {/* Status is true if there is pagination, or true if there just isn't any needed. We'll check if the object exists. */}
                                  <StatusIcon status={true} />
                                </div>
                                <div className="text-xs font-mono text-neutral-500">
                                  Next: {dom?.pagination?.next_url || 'None'} | Prev: {dom?.pagination?.prev_url || 'None'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Technical Issues Developer Backlog */}
                      {result.technical_issues && result.technical_issues.length > 0 && (
                        <div className="mt-12">
                          <h4 className="text-sm font-medium text-neutral-800 mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-neutral-400" /> Technical Backlog Issues ({result.technical_issues.length})
                          </h4>
                          <div className="flex flex-col gap-4">
                            {result.technical_issues.map((issue: any, i: number) => (
                              <div key={i} className="p-6 bg-white border border-neutral-200 rounded-xl flex flex-col md:flex-row md:items-start gap-4 md:gap-8 shadow-sm">
                                <div className="flex-1">
                                  <p className="text-base font-medium text-neutral-900 mb-2">{issue.issue}</p>
                                  <p className="text-sm text-neutral-600 leading-relaxed">
                                    <span className="font-semibold text-neutral-800 mr-1">Recommendation:</span> {issue.recommendation}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 md:flex-col md:items-end shrink-0">
                                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${getCategoryColor(issue.category)}`}>
                                    {issue.category || 'SEO'}
                                  </span>
                                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}