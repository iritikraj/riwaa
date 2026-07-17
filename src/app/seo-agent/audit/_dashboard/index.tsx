/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/seo-agent/audit/_dashboard/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Loader2, Globe, Briefcase, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuditDashboard() {
  const router = useRouter();
  const [rootDomain, setRootDomain] = useState('');
  const [pathsInput, setPathsInput] = useState('');
  const [industry, setIndustry] = useState('');

  const [viewState, setViewState] = useState<'idle' | 'loading'>('idle');
  const [loadingStatus, setLoadingStatus] = useState('');
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (viewState !== 'loading') return;
    const statuses = [
      'INITIALIZING AI AGENT CONTEXT...',
      'EXTRACTING DOM & META DATA...',
      'FETCHING LIVE GOOGLE SERP DATA...',
      'EXTRACTING SEMANTIC ENTITIES...',
      'CALCULATING GEO VISIBILITY SCORES...',
      'COMPILING DIAGNOSTIC MATRIX...'
    ];
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % statuses.length;
      setLoadingStatus(statuses[currentIdx]);
    }, 3000);
    return () => clearInterval(interval);
  }, [viewState]);

  const handleStartBatchAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootDomain) return;

    const rawPaths = pathsInput.split(',').map(p => p.trim()).filter(Boolean);
    const urlsToAudit = [rootDomain, ...rawPaths.map(path => `${rootDomain}${path.startsWith('/') ? '' : '/'}${path}`)];

    setViewState('loading');
    setBatchProgress({ current: 0, total: urlsToAudit.length });

    const results = [];
    for (let i = 0; i < urlsToAudit.length; i++) {
      setBatchProgress(prev => ({ ...prev, current: i + 1 }));
      try {
        const response = await fetch('/api/seo-agent/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlsToAudit[i], industry: industry || 'General Business', skipSave: true }),
        });
        const data = await response.json();
        results.push(response.ok && data.success ? { url: urlsToAudit[i], ...data.audit } : { url: urlsToAudit[i], error: data.error });
      } catch {
        results.push({ url: urlsToAudit[i], error: "Network failure" });
      }
    }

    try {
      const batchSaveRes = await fetch('/api/seo-agent/audit/save-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rootDomain, industry: industry || 'General Business', batchResults: results }),
      });
      const saveData = await batchSaveRes.json();
      if (saveData.success && saveData.documentId) {
        router.push(`/seo-agent/audit-history/${saveData.documentId}`);
        return;
      }
    } catch (err) {
      console.error("Critical failure during persistence:", err);
    }

    setViewState('idle'); // Reset if something failed so user can try again
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] font-jost text-neutral-200">
      <div className="w-full max-w-4xl relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative w-full p-8 md:p-10">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl shadow-inner">
                  <Image src="/riwa-logo.png" height={26} width={26} alt="RIWAA" className="object-contain" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-neutral-100 font-light uppercase text-[15px] tracking-[0.28em] leading-none">RIWAA</h2>
                  <span className="text-[9px] tracking-[0.24em] uppercase text-neutral-500 mt-2">Powered by</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col justify-center">
                <Image src="/solvetude-logo.png" height={32} width={100} alt="Solvetude" className="h-8 w-auto object-contain opacity-90" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/seo-agent/audit-history" className="flex items-center gap-2 rounded-full border transition-all duration-300 px-4 py-2 border-white/10 bg-white/4 text-neutral-400 hover:text-white">
                <Clock size={12} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Archives</span>
              </Link>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-sm uppercase tracking-[0.2em] text-neutral-200 mt-1.5 font-light">Engine Visibility Audit</h1>
          </div>

          <div className="relative min-h-100">
            {/* IDLE STATE */}
            {viewState === 'idle' && (
              <form onSubmit={handleStartBatchAudit} className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 max-w-3xl">
                {/* ... existing form inputs ... */}
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Target Root Domain</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-4 w-4 h-4 text-neutral-500" />
                    <input type="url" required placeholder="https://www.relaam.com" value={rootDomain} onChange={(e) => setRootDomain(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light backdrop-blur-md shadow-inner" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Market Context (Optional)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-5 top-4 w-4 h-4 text-neutral-500" />
                    <input type="text" placeholder="e.g., Luxury Real Estate, Investment Holding" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light backdrop-blur-md shadow-inner" />
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] uppercase tracking-[0.28em] text-neutral-600">Add Route Matrix</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">Specific Paths (Comma Separated)</label>
                  <textarea placeholder="/contact, /regions, /about-us" value={pathsInput} onChange={(e) => setPathsInput(e.target.value)} className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-5 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light resize-none backdrop-blur-md shadow-inner custom-scrollbar" />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-black cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 px-8 py-4 w-full sm:w-auto">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Initiate Scan <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* LOADING STATE */}
            {viewState === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in duration-700 z-10 bg-[#0b0b0c]/50 backdrop-blur-sm rounded-2xl">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                  <Loader2 className="w-8 h-8 text-neutral-300 animate-spin relative z-10" />
                </div>
                <p className="text-neutral-400 font-light text-[10px] uppercase tracking-[0.25em] animate-pulse">{loadingStatus}</p>
                <div className="mt-8 flex gap-1.5">
                  {Array.from({ length: batchProgress.total }).map((_, i) => (
                    <div key={i} className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${i < batchProgress.current ? 'bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}