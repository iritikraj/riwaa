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
    <div className="min-h-screen px-6 py-16 text-neutral-800 bg-[#FCFBF8] font-jost relative">
      {/* Background ambient lighting - updated for light theme */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.03),transparent_50%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header Elements */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] border rounded-full text-neutral-600 bg-white border-neutral-200 shadow-sm mb-6">
            <Activity className="w-3 h-3 text-neutral-400" /> Audit
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase mb-3 text-neutral-900">
            Audit <span className="text-neutral-400">History</span>
          </h1>
          <p className="text-neutral-500 text-[10px] tracking-[0.25em] font-medium uppercase">
            Review past agent diagnostics, crawling data, and visibility scores.
          </p>
        </header>

        {/* Server Component for mapping list items */}
        <HistoryList records={records} />
      </div>
    </div>
  );
}