/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Loader2, Zap, Search, ShieldCheck } from 'lucide-react';
import ContentQualityCard from '../../audit-history/[id]/_content-quality';

export default function InstantContentCheck() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/seo-agent/audit/content-quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, targetKeyword: keyword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze page');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] font-jost text-zinc-900 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] uppercase tracking-widest font-semibold mb-4 shadow-sm">
            <Zap size={12} className="text-emerald-500" /> Instant Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900">
            Content Quality Check
          </h1>
          <p className="text-sm text-neutral-500 font-light max-w-xl mx-auto leading-relaxed">
            Analyze keyword density, check grammar, and detect internal duplicate content in seconds. No database logging.
          </p>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <form onSubmit={handleCheck} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-6 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 ml-1">
                Target URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog-post"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 px-4 text-sm text-zinc-900 outline-none focus:border-neutral-400 focus:bg-white transition-all placeholder:text-neutral-400 shadow-inner"
              />
            </div>
            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 ml-1">
                Focus Keyword (Optional)
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Luxury Real Estate"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 px-4 text-sm text-zinc-900 outline-none focus:border-neutral-400 focus:bg-white transition-all placeholder:text-neutral-400 shadow-inner"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12.5 flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors rounded-xl text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 shadow-md"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={14} /> Analyze</>}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}
        </div>

        {/* RESULTS */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg text-zinc-900 font-medium">Analysis Results</h2>
            </div>

            <ContentQualityCard
              contentData={{
                ...result.content_quality,
                raw_dom_data: result.raw_dom_data
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}