/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/seo-agent/audit/history/_components/HistoryList.tsx
'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { Globe, Clock, ArrowUpRight, Layers, Search } from 'lucide-react';

export default function HistoryList({ records }: { records: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from('.history-row', {
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef, dependencies: [records] });

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-24 border border-white/10 rounded-[28px] bg-[#0b0b0c]/90 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)] pointer-events-none" />
        <p className="text-neutral-500 font-light text-[10px] uppercase tracking-[0.25em] relative z-10">
          No engine audits found in the database yet.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {records.map((record: any) => {
        const { target_url, audit_status, createdAt, audit_data } = record;
        const date = new Date(createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });

        // Handle the new Batch Architecture Structure
        const isBatch = audit_data?.is_batch;
        const rootResult = isBatch && audit_data.results?.length > 0 ? audit_data.results[0] : audit_data;
        const routeCount = isBatch ? audit_data.total_urls_scanned : 1;

        // Extract Seed Keyword if it exists in the root data
        const seedKeyword = rootResult?.keyword_opportunities?.primary_keyword;

        return (
          <Link href={`/seo-agent/audit-history/${record.documentId}`} key={record.documentId} className="block mt-4">
            <div className="history-row flex items-center justify-between p-6 bg-white/4 border border-white/10 rounded-[20px] backdrop-blur-md hover:bg-white/10 transition-all duration-300 group cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]">

              {/* Left Side: URL, Date, & Target Keyword */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-white/20 transition-all shrink-0">
                  <Globe className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-neutral-200 font-light text-sm tracking-wide group-hover:text-white transition-colors">
                      {target_url}
                    </h3>
                    {routeCount > 1 && (
                      <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        <Layers className="w-2.5 h-2.5" /> {routeCount} Routes
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-light">
                      <Clock className="w-3 h-3 opacity-60" /> {date}
                    </span>
                    {seedKeyword && (
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-emerald-400/70 font-light border-l border-white/10 pl-4">
                        <Search className="w-2.5 h-2.5 opacity-60" /> {seedKeyword}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Status & Scores */}
              <div className="flex items-center gap-10">
                {audit_status === 'completed' && rootResult ? (
                  <div className="hidden md:flex items-center gap-8 text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                    <div className="flex flex-col items-end">
                      <span className="mb-1.5 opacity-60">Root On-Page</span>
                      <span className="text-emerald-400/90 font-extralight text-xl leading-none">
                        {rootResult.seo_health_score || '--'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="mb-1.5 opacity-60">Root GEO</span>
                      <span className="text-cyan-400/90 font-extralight text-xl leading-none">
                        {rootResult.geo_visibility_score || '--'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center">
                    <span className={`text-[8px] uppercase px-3 py-1.5 rounded-full border tracking-[0.25em] ${audit_status === 'processing'
                      ? 'bg-white/5 border-white/10 text-neutral-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400/90'
                      }`}>
                      {audit_status}
                    </span>
                  </div>
                )}

                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}