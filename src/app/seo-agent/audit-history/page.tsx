// src/app/seo-agent/audit/history/page.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import { getAuditsHistory } from '@/lib/seo-agent/strapi';
import HistoryList from './_list';


export const metadata = {
  title: 'Audit History - Riwaa SEO Agent',
  description: 'Historical records of engine and web visibility audits.',
};

export default async function AuditHistoryPage() {
  // Fetch data securely on the server
  const records = await getAuditsHistory();

  return (
    <div className="min-h-screen px-6 py-16 text-neutral-200 bg-[#050505] font-jost relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header Elements */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] border rounded-full text-neutral-300 bg-white/4 border-white/10 backdrop-blur-md mb-6 shadow-inner">
            <Activity className="w-3 h-3" /> Team Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase mb-3 text-white">
            Audit <span className="text-neutral-600">History</span>
          </h1>
          <p className="text-neutral-500 text-[10px] tracking-[0.25em] font-light uppercase">
            Review past agent diagnostics, crawling data, and visibility scores.
          </p>
        </header>

        {/* Client Component handles the mapping and animations */}
        <HistoryList records={records} />
      </div>
    </div>
  );
}