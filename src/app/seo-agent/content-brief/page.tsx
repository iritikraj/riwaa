/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Globe, FileText, ChevronDown, History, Plus, Trash2, Link as LinkIcon, BookOpen, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define the Strapi Type
interface PageTypeRule {
  id: number;
  documentId: string;
  name: string;
  requires_internal_blueprint: boolean;
}

export default function ContentBriefDashboard() {
  const router = useRouter();

  // State
  const [pageTypes, setPageTypes] = useState<PageTypeRule[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [error, setError] = useState('');

  const [viewState, setViewState] = useState<'idle' | 'loading'>('idle');
  const [loadingStatus, setLoadingStatus] = useState('');

  // Form Fields
  const [topic, setTopic] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [urlPattern, setUrlPattern] = useState('');
  const [internalBlueprintUrl, setInternalBlueprintUrl] = useState('');
  const [referenceUrls, setReferenceUrls] = useState<string[]>(['']);

  // Fetch Page Types on Mount
  useEffect(() => {
    async function fetchPageTypes() {
      try {
        // 🔒 Now fetching securely through our local Next.js API
        const res = await fetch(`/api/seo-agent/content-brief/page-types`);
        const data = await res.json();
        const types = data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
          requires_internal_blueprint: item.requires_internal_blueprint
        }));
        setPageTypes(types);
      } catch (err) {
        console.error('Failed to load page types:', err);
        setError('Failed to load configuration rules. Please check Strapi connection.');
      } finally {
        setIsLoadingTypes(false);
      }
    }
    fetchPageTypes();
  }, []);

  // Cycle through loading statuses for better UX
  useEffect(() => {
    if (viewState !== 'loading') return;
    const statuses = [
      'INITIALIZING BRIEF ENGINE...',
      'ANALYZING PAGE TYPE RULES...',
      'QUEUING AI WORKER...',
      'PREPARING WORKSPACE...'
    ];
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % statuses.length;
      setLoadingStatus(statuses[currentIdx]);
    }, 2000);
    return () => clearInterval(interval);
  }, [viewState]);

  // Derived state to check if current selected type requires a blueprint
  const selectedType = pageTypes.find(t => t.documentId === selectedTypeId);
  const requiresBlueprint = selectedType?.requires_internal_blueprint || false;

  // Dynamic Competitor Inputs
  const addReferenceUrl = () => setReferenceUrls([...referenceUrls, '']);
  const updateReferenceUrl = (index: number, value: string) => {
    const updated = [...referenceUrls];
    updated[index] = value;
    setReferenceUrls(updated);
  };
  const removeReferenceUrl = (index: number) => {
    setReferenceUrls(referenceUrls.filter((_, i) => i !== index));
  };

  const handleStartBriefGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !selectedTypeId || !urlPattern) return;

    setViewState('loading');
    setLoadingStatus('INITIALIZING BRIEF ENGINE...');
    setError('');

    try {
      // Filter out empty reference URLs
      const cleanedReferences = referenceUrls.filter(url => url.trim() !== '');

      const res = await fetch('/api/seo-agent/content-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          pageTypeId: selectedTypeId,
          urlPattern,
          internalBlueprintUrl: requiresBlueprint ? internalBlueprintUrl : null,
          referenceUrls: cleanedReferences
        }),
      });

      const data = await res.json();

      if (data.success && data.documentId) {
        router.push(`/seo-agent/content-brief-history/${data.documentId}`);
      } else {
        throw new Error(data.error || 'Failed to submit job');
      }
    } catch (err: any) {
      console.error("Critical failure initiating brief generation:", err);
      setError(err.message || 'Failed to initiate generator. Please check console.');
      setViewState('idle');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] font-jost text-neutral-200">
      <div className="w-full max-w-4xl relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)] my-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />

        <div className="relative w-full p-8 md:p-10">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-4">
              {/* RIWAA */}
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
                  <Image
                    src="/riwa-logo-transparent.png"
                    height={30}
                    width={30}
                    alt="RIWAA"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-neutral-100 font-light uppercase text-[15px] tracking-[0.28em] leading-none">
                    RIWAA
                  </h2>
                  <span className="text-[9px] tracking-[0.24em] uppercase text-neutral-500 mt-2">
                    Powered by
                  </span>
                </div>
              </div>
              {/* Divider */}
              <div className="h-8 w-px bg-white/10" />
              {/* Powered By */}
              <div className="flex flex-col justify-center">
                <img
                  src="/solvetude-logo.png"
                  alt="Solvetude"
                  className="h-8 w-auto object-contain opacity-90"
                />
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/seo-agent/content-brief-history" className="flex items-center gap-2 rounded-full border transition-all duration-300 px-4 py-2 border-white/10 bg-white/4 text-neutral-400 hover:text-white">
                <History size={12} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Archives</span>
              </Link>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-sm uppercase tracking-[0.2em] text-neutral-200 mt-1.5 font-light flex items-center gap-3">
              <FileText className="w-4 h-4 text-blue-600" /> Content Brief Module
            </h1>
          </div>

          <div className="relative min-h-100">

            {/* ERROR STATE */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            {/* IDLE STATE */}
            {viewState === 'idle' && (
              <form onSubmit={handleStartBriefGeneration} className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-3xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Topic */}
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-blue-600 font-semibold">Target Topic</label>
                    <div className="relative">
                      <Search className="absolute left-5 top-4 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Best areas to invest in Dubai"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light backdrop-blur-md shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Page Type Dropdown */}
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-blue-600 font-semibold">Page Type</label>
                    <div className="relative">
                      <select
                        required
                        value={selectedTypeId}
                        onChange={(e) => setSelectedTypeId(e.target.value)}
                        disabled={isLoadingTypes}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 pr-10 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm font-light backdrop-blur-md shadow-inner appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="" disabled className="bg-[#0b0b0c] text-neutral-500">Select Page Type...</option>
                        {pageTypes.map(type => (
                          <option key={type.documentId} value={type.documentId} className="bg-[#0b0b0c]">
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {isLoadingTypes && (
                        <div className="absolute right-4 top-4">
                          <Loader2 size={16} className="animate-spin text-neutral-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* URL Pattern */}
                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-yellow-600 font-semibold">URL Structure Pattern</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-4 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      placeholder="https://www.yourdomain.com/blog/{dynamic-url}"
                      value={urlPattern}
                      onChange={(e) => setUrlPattern(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light backdrop-blur-md shadow-inner"
                    />
                  </div>
                </div>

                {/* Conditional Input: Internal Blueprint */}
                {requiresBlueprint && (
                  <div className="space-y-3 p-5 bg-green-500/5 border border-green-500/20 rounded-2xl backdrop-blur-md">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-green-600 font-semibold mb-1">
                      <BookOpen size={14} /> Internal Blueprint URL (Optional)
                    </label>
                    <p className="text-xs text-white-500/60 font-light mb-4">
                      Provide an existing guide on your domain to enforce structural consistency.
                    </p>
                    <div className="relative">
                      <Globe className="absolute left-5 top-4 w-4 h-4 text-white-500/50" />
                      <input
                        type="url"
                        placeholder="https://www.yourdomain.com/areas/downtown-dubai"
                        value={internalBlueprintUrl}
                        onChange={(e) => setInternalBlueprintUrl(e.target.value)}
                        className="w-full bg-white/5 border border-green-500/20 rounded-xl py-3 pl-12 pr-4 text-neutral-200 outline-none focus:border-green-500/50 transition-all placeholder:text-neutral-600 text-sm font-light shadow-inner"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] uppercase tracking-[0.28em] text-neutral-600">COMPETITORS</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Dynamic Competitor URLs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-green-600 font-semibold">
                      Reference URLs
                    </label>
                    <button
                      type="button"
                      onClick={addReferenceUrl}
                      className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 hover:text-green-300 cursor-pointer transition-colors"
                    >
                      <Plus size={12} /> Add Reference
                    </button>
                  </div>

                  {referenceUrls.map((url, index) => (
                    <div key={index} className="relative flex items-center">
                      <Globe className="absolute left-5 top-4 w-4 h-4 text-neutral-500" />
                      <input
                        type="url"
                        placeholder="https://competitor.com/their-article"
                        value={url}
                        onChange={(e) => updateReferenceUrl(index, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light backdrop-blur-md shadow-inner"
                      />
                      {referenceUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReferenceUrl(index)}
                          className="absolute right-4 p-2 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={!topic || !selectedTypeId || !urlPattern}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-black cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white px-8 py-4 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Initialize Brief <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* LOADING STATE */}
            {viewState === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in duration-700 z-10 bg-[#0b0b0c]/50 backdrop-blur-sm rounded-2xl">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                  <Loader2 className="w-8 h-8 text-neutral-300 animate-spin relative z-10" />
                </div>
                <p className="text-neutral-400 font-light text-[10px] uppercase tracking-[0.25em] animate-pulse">{loadingStatus}</p>
                <div className="mt-8 flex gap-1.5">
                  <div className="h-0.5 w-8 rounded-full transition-colors duration-500 bg-indigo-500/80 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <div className="h-0.5 w-8 rounded-full transition-colors duration-500 bg-violet-500/80 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                  <div className="h-0.5 w-8 rounded-full transition-colors duration-500 bg-white/10" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}