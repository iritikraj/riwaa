/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Clock, PlayCircle } from 'lucide-react';

export default function BlueprintsListClient({ blueprints, accountId }: { blueprints: any[]; accountId: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
      case 'live':
        return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: <PlayCircle size={14} /> };
      case 'pending_approval':
      case 'generating':
      default:
        return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: <Clock size={14} /> };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-24 font-jost text-[#14181F]">
      <header className="mb-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase">
          Campaign Library
        </p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
          Blueprint Archives
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
          Review pending AI generations, edit drafts, and monitor published Google Ads campaigns.
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-[#14181F]/10 shadow-sm overflow-hidden">
        {blueprints.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <FileText size={32} className="text-[#14181F]/20 mb-4" />
            <p className="text-[14px] text-[#565C6B]">No blueprints found.</p>
            <Link
              href={`/google-agent/${accountId}/setup`}
              className="mt-4 px-6 py-2.5 bg-[#14181F] text-white text-[12px] uppercase font-bold tracking-wider rounded-full hover:bg-[#9C7A3C] transition-colors"
            >
              Generate New Campaign
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#14181F]/5 bg-[#FCFBF8] text-[10px] uppercase tracking-widest text-[#14181F]/50">
                <th className="py-4 pl-6 font-semibold">Campaign Name</th>
                <th className="py-4 font-semibold">Objective / Brief</th>
                <th className="py-4 font-semibold">Status</th>
                <th className="py-4 font-semibold">Date Created</th>
                <th className="py-4 pr-6 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14181F]/5">
              {blueprints.map((bp) => {
                const docId = bp.documentId || bp.id;
                const status = bp.attributes?.approvalState || bp.approvalState || 'pending_approval';
                const name = bp.attributes?.campaignName || bp.campaignName || 'Untitled Campaign';
                const brief = bp.attributes?.brief || bp.brief || 'No brief provided.';
                const date = new Date(bp.attributes?.createdAt || bp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const config = getStatusConfig(status);

                return (
                  <tr key={docId} className="hover:bg-[#FCFBF8] transition-colors group">
                    <td className="py-4 pl-6 font-bold text-[#14181F]">{name}</td>
                    <td className="py-4 text-[#565C6B] max-w-50 truncate">{brief}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${config.color}`}>
                        {config.icon} {status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-[#565C6B] font-mono text-[12px]">{date}</td>
                    <td className="py-4 pr-6 text-right">
                      <Link
                        href={`/google-agent/${accountId}/blueprints/${docId}`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white border border-[#14181F]/10 text-[#14181F] group-hover:bg-[#9C7A3C] group-hover:text-white group-hover:border-transparent transition-all"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}