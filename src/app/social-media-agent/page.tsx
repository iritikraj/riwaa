'use client';

import React, { useState } from 'react';
import ConnectMetaButton from "./_connect-meta";
import DashboardStream from "./_dashboard";

export default function DashboardPage() {
  const mockWorkspaceId = "99700b46-3eff-48e9-9b0d-477032c6dd72";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen w-full bg-[#FCFBF8] font-jost text-zinc-900 overflow-hidden relative">

      {/* MOBILE OVERLAY (Darkens the screen when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-zinc-900/30 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR COMMAND CENTER (Responsive: Slides in on mobile, fixed on desktop) */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-[280px] bg-white border-r border-zinc-100 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* BRAND HEAD */}
          <div className="p-6 pb-4 border-b border-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm">
                <span className="text-zinc-900 font-bold text-lg tracking-widest">RI</span>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-zinc-900 font-semibold uppercase text-[13px] tracking-[0.25em] leading-none">
                  RIWAA
                </h2>
                <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-400 mt-1.5 font-medium flex items-center gap-1">
                  by
                  <img src="/solvetude-logo.png" alt="Solvetude" className="h-4 w-auto object-contain" />
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 bg-zinc-50 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-3">Main Menu</div>

            {/* Active Link: Live Stream */}
            <button onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900 text-white shadow-md transition-all duration-300">
              <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span className="text-[14px] font-medium tracking-wide">Live Stream</span>
              <span className="ml-auto flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            {/* Placeholder Links */}
            {/* <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300 group">
              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              <span className="text-[14px] font-medium tracking-wide">Insights Studio</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300 group">
              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="text-[14px] font-medium tracking-wide">Audience CRM</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300 group">
              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              <span className="text-[14px] font-medium tracking-wide">Automations</span>
            </button> */}

            <div className="pt-6 pb-2">
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-3">System</div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300 group cursor-not-allowed">
                <svg className="w-4 h-4 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="text-[14px] font-medium tracking-wide">Settings</span>
              </button>
            </div>
          </nav>
        </div>

        {/* WORKSPACE FOOTER (Meta & User) */}
        <div className="p-5 border-t border-zinc-100 bg-zinc-50/50 space-y-5">
          <div className="w-full">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Integrations</div>
            <ConnectMetaButton workspaceId={mockWorkspaceId} />
          </div>

          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-zinc-200 shadow-sm cursor-pointer hover:border-zinc-300 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
              <img src="https://ui-avatars.com/api/?name=Ritik&background=f4f4f5&color=18181b" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-semibold text-zinc-900 truncate">Ritik Admin</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">Workspace Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* MOBILE TOP NAVIGATION (Hidden on Desktop) */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-100 shadow-sm z-20">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
              <span className="text-zinc-900 font-bold text-sm tracking-widest">RI</span>
            </div>
            <span className="text-zinc-900 font-semibold uppercase text-[14px] tracking-[0.2em] leading-none">RIWAA</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </header>

        {/* STREAM CONTAINER */}
        <div className="flex-1 overflow-y-auto">
          <DashboardStream workspaceId={mockWorkspaceId} />
        </div>
      </div>

    </main>
  );
}