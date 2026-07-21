/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Swords, Clock, ChevronRight, Globe } from 'lucide-react';
import { getCompetitorAuditsHistory } from '@/lib/seo-agent/strapi';

export const metadata = {
  title: 'Competitor Analysis History - Riwaa SEO Agent',
};

export default async function CompetitorHistoryPage() {
  const audits = await getCompetitorAuditsHistory();

  return (
    <div className="min-h-screen px-6 py-16 md:px-12 text-neutral-900 bg-[#FCFBF8] font-jost selection:bg-neutral-200">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="border-b border-neutral-200 pb-10 mb-12">
          <Link href="/seo-agent/competitor" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-neutral-900 flex items-center gap-4 tracking-tight">
            <Swords className="w-8 h-8 text-neutral-400" />
            Comparison Archives
          </h1>
          <p className="mt-4 text-sm text-neutral-500 max-w-xl">
            A complete historical log of all competitive gap analyses executed by the AI workers.
          </p>
        </header>

        {/* LISTING */}
        <div className="space-y-4">
          {audits.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-300 rounded-2xl bg-white/50">
              <p className="text-sm text-neutral-500">No competitor audits found in the database.</p>
            </div>
          ) : (
            audits.map((audit: any) => {
              const docId = audit.documentId || audit.id;
              const date = new Date(audit.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              const isProcessing = audit.audit_status === 'processing';
              const isFailed = audit.audit_status === 'failed';
              const primaryCompetitor = audit.competitor_urls?.[0] || 'Unknown Competitor';

              return (
                <Link
                  href={`/seo-agent/competitor-history/${docId}`}
                  key={docId}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${isProcessing ? 'bg-blue-50 text-blue-600' :
                        isFailed ? 'bg-red-50 text-red-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                        {audit.audit_status}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {date}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-neutral-900">
                      <span className="flex items-center gap-2 truncate max-w-62.5">
                        <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="truncate">{new URL(audit.target_url).hostname.replace('www.', '')}</span>
                      </span>
                      <span className="text-[10px] uppercase text-neutral-400 tracking-widest hidden sm:inline">VS</span>
                      <span className="flex items-center gap-2 truncate max-w-62.5">
                        <Swords className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="truncate">{primaryCompetitor !== 'Unknown Competitor' ? new URL(primaryCompetitor).hostname.replace('www.', '') : primaryCompetitor}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {audit.industry && (
                      <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                        {audit.industry}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-full border border-neutral-100 bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}