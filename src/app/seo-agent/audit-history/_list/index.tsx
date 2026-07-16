/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/seo-agent/audit/history/_components/HistoryList.tsx
import Link from 'next/link';
import { Globe, Clock, ArrowUpRight, Layers, Search } from 'lucide-react';

export default function HistoryList({ records }: { records: any[] }) {
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-24 border border-neutral-200 rounded-[28px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.02),transparent_55%)] pointer-events-none" />
        <p className="text-neutral-500 font-medium text-[10px] uppercase tracking-[0.25em] relative z-10">
          No engine audits found in the database yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          <Link href={`/seo-agent/audit-history/${record.documentId}`} key={record.documentId} className="block group">
            <div className="flex items-center justify-between p-6 bg-white border border-neutral-200/80 rounded-[20px] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:border-neutral-300 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group-hover:-translate-y-0.5">

              {/* Left Side: URL, Date, & Target Keyword */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-center shadow-sm group-hover:border-neutral-300 group-hover:bg-white transition-all shrink-0">
                  <Globe className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-neutral-800 font-medium text-sm tracking-wide group-hover:text-black transition-colors">
                      {target_url}
                    </h3>
                    {routeCount > 1 && (
                      <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-neutral-600 bg-neutral-100 border border-neutral-200/80 px-2.5 py-0.5 rounded-full font-medium">
                        <Layers className="w-2.5 h-2.5" /> {routeCount} Routes
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
                      <Clock className="w-3 h-3 opacity-70" /> {date}
                    </span>
                    {seedKeyword && (
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-emerald-600 font-medium border-l border-neutral-200 pl-4">
                        <Search className="w-2.5 h-2.5 opacity-80" /> {seedKeyword}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Status & Scores */}
              <div className="flex items-center gap-10">
                {audit_status === 'completed' && rootResult ? (
                  <div className="hidden md:flex items-center gap-8 text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-medium">
                    <div className="flex flex-col items-end">
                      <span className="mb-1.5 text-neutral-400">Root On-Page</span>
                      <span className="text-emerald-600 font-light text-xl leading-none">
                        {rootResult.seo_health_score || '--'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="mb-1.5 text-neutral-400">Root GEO</span>
                      <span className="text-cyan-600 font-light text-xl leading-none">
                        {rootResult.geo_visibility_score || '--'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center">
                    <span className={`text-[8px] uppercase px-3 py-1.5 rounded-full border tracking-[0.25em] font-semibold ${audit_status === 'processing'
                      ? 'bg-neutral-100 border-neutral-200 text-neutral-600'
                      : 'bg-red-50 border-red-200 text-red-600'
                      }`}>
                      {audit_status}
                    </span>
                  </div>
                )}

                <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center bg-neutral-50 group-hover:bg-white group-hover:border-neutral-300 group-hover:shadow-sm transition-all">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}