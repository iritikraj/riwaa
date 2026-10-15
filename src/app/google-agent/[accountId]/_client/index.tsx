/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { PlusCircle, History, Settings, Activity, ArrowRight, LayoutDashboard, CheckCircle2 } from 'lucide-react';

export default function DashboardClient({
  activeAccountId,
  pendingTasks
}: {
  activeAccountId: string;
  pendingTasks: any[];
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-24">

      <header className="mb-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase flex items-center gap-2">
          <LayoutDashboard size={14} />
          Agent Workspace
        </p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant text-[#14181F]">
          Campaign Dashboard
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
          Manage your autonomous Google Ads pipelines, approve pending blueprints, and monitor structural execution logs.
        </p>
      </header>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href={`/google-agent/${activeAccountId}/setup`}
          className="group bg-white p-6 rounded-3xl border border-[#14181F]/10 shadow-sm hover:border-[#9C7A3C]/50 hover:shadow-md transition-all flex flex-col items-start"
        >
          <div className="h-12 w-12 bg-[#FCFBF8] border border-[#14181F]/5 rounded-2xl flex items-center justify-center mb-5 text-[#9C7A3C] group-hover:scale-110 transition-transform">
            <PlusCircle size={24} />
          </div>
          <h3 className="text-[15px] font-bold text-[#14181F] mb-2 uppercase tracking-wide">New Campaign</h3>
          <p className="text-[13px] text-[#565C6B] mb-6 line-clamp-2">Brief the AI to generate a full Search campaign with keywords and RSAs.</p>
          <span className="mt-auto text-[11px] font-bold uppercase tracking-widest text-[#9C7A3C] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Start Brief <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href={`/google-agent/${activeAccountId}/history`}
          className="group bg-white p-6 rounded-3xl border border-[#14181F]/10 shadow-sm hover:border-[#14181F]/20 hover:shadow-md transition-all flex flex-col items-start"
        >
          <div className="h-12 w-12 bg-[#FCFBF8] border border-[#14181F]/5 rounded-2xl flex items-center justify-center mb-5 text-[#14181F]/60 group-hover:text-[#14181F] group-hover:scale-110 transition-all">
            <History size={24} />
          </div>
          <h3 className="text-[15px] font-bold text-[#14181F] mb-2 uppercase tracking-wide">Audit History</h3>
          <p className="text-[13px] text-[#565C6B] mb-6 line-clamp-2">Review the chronological ledger of all AI deployments and optimizations.</p>
          <span className="mt-auto text-[11px] font-bold uppercase tracking-widest text-[#14181F]/60 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            View Logs <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href={`/google-agent/settings`}
          className="group bg-white p-6 rounded-3xl border border-[#14181F]/10 shadow-sm hover:border-[#14181F]/20 hover:shadow-md transition-all flex flex-col items-start"
        >
          <div className="h-12 w-12 bg-[#FCFBF8] border border-[#14181F]/5 rounded-2xl flex items-center justify-center mb-5 text-[#14181F]/60 group-hover:text-[#14181F] group-hover:scale-110 transition-all">
            <Settings size={24} />
          </div>
          <h3 className="text-[15px] font-bold text-[#14181F] mb-2 uppercase tracking-wide">Agent Settings</h3>
          <p className="text-[13px] text-[#565C6B] mb-6 line-clamp-2">Manage your Google Ads account connection and API permissions.</p>
          <span className="mt-auto text-[11px] font-bold uppercase tracking-widest text-[#14181F]/60 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Configure <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {/* Pending Tasks Section */}
      <div className="bg-white rounded-4xl border border-[#14181F]/10 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[13px] uppercase tracking-widest font-bold flex items-center gap-2">
            <Activity size={16} className="text-[#9C7A3C]" />
            Action Required
          </h2>
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
            {pendingTasks.length} Pending
          </span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[#14181F] font-semibold">You&apos;re all caught up!</p>
            <p className="text-[13px] text-[#565C6B] mt-1">No blueprints are currently awaiting your approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Map over pendingTasks here in the future */}
            <p className="text-[13px] text-[#565C6B]">Tasks will appear here.</p>
          </div>
        )}
      </div>

    </div>
  );
}