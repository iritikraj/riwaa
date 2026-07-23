'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Globe, FileText, ChevronDown, LayoutTemplate, History, UploadCloud, CheckCircle2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComplianceDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [targetUrl, setTargetUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [viewState, setViewState] = useState<'idle' | 'loading'>('idle');
  const [loadingStatus, setLoadingStatus] = useState('');

  // Cycle through loading statuses for better UX
  useEffect(() => {
    if (viewState !== 'loading') return;
    const statuses = [
      'UPLOADING BRIEF TO STRAPI...',
      'EXTRACTING DOCUMENT METADATA...',
      'MAPPING CONTENT VIA AI...',
      'QUEUING COMPLIANCE AUDIT...'
    ];
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % statuses.length;
      setLoadingStatus(statuses[currentIdx]);
    }, 2500);
    return () => clearInterval(interval);
  }, [viewState]);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Basic validation to ensure it's a Word document
    if (file.name.endsWith('.docx')) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid .docx Content Brief.");
    }
  };

  const handleStartComplianceCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl || !selectedFile) return;

    setViewState('loading');
    setLoadingStatus('INITIALIZING COMPLIANCE QUEUE...');

    const formData = new FormData();
    formData.append('url', targetUrl);
    formData.append('brief', selectedFile);

    try {
      const response = await fetch('/api/seo-agent/compliance', {
        method: 'POST',
        body: formData, // No Content-Type header; fetch sets it automatically with boundary for FormData
      });

      const data = await response.json();

      if (data.success && data.documentId) {
        // Redirect to the side-by-side analysis view
        router.push(`/seo-agent/compliance-history/${data.documentId}`);
        return;
      } else {
        throw new Error(data.error || 'Failed to start compliance audit');
      }
    } catch (err) {
      console.error("Critical failure initiating compliance analysis:", err);
      alert("Failed to initiate audit. Please check console for details.");
      setViewState('idle');
    }
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
                  <span className="text-[9px] tracking-[0.24em] uppercase text-neutral-500 mt-2">Compliance Engine</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/seo-agent/compliance-history" className="flex items-center gap-2 rounded-full border transition-all duration-300 px-4 py-2 border-white/10 bg-white/4 text-neutral-400 hover:text-white">
                <History size={12} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Archives</span>
              </Link>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-sm uppercase tracking-[0.2em] text-neutral-200 mt-1.5 font-light flex items-center gap-3">
              <LayoutTemplate className="w-4 h-4 text-[#b8924a]" /> Brief Compliance Module
            </h1>
          </div>

          <div className="relative min-h-100">
            {/* IDLE STATE */}
            {viewState === 'idle' && (
              <form onSubmit={handleStartComplianceCheck} className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-3xl">

                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#b8924a] font-semibold">Live Target URL</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-4 w-4 h-4 text-neutral-500" />
                    <input
                      type="url"
                      required
                      placeholder="Please Paste Your Content URL Here..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-neutral-200 outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-neutral-600 text-sm font-light backdrop-blur-md shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] uppercase tracking-[0.28em] text-neutral-600">AGAINST</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-semibold">Content Brief (.docx)</label>

                  {/* File Upload Zone */}
                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center w-full h-32 bg-white/5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-md shadow-inner ${isDragging ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/30 hover:bg-white/10'
                        }`}
                    >
                      <input
                        type="file"
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <UploadCloud className={`w-6 h-6 mb-3 transition-colors ${isDragging ? 'text-emerald-500' : 'text-neutral-500'}`} />
                      <p className="text-xs text-neutral-400 font-light tracking-wide">
                        <span className="text-white font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-neutral-600 uppercase tracking-widest mt-2">.DOCX FILES ONLY</p>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-md">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20">
                          <FileText className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-neutral-200 font-medium">{selectedFile.name}</span>
                          <span className="text-[10px] text-emerald-500/70 uppercase tracking-widest mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready for Analysis
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={!targetUrl || !selectedFile}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-black cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white px-8 py-4 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Initiate Audit <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
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
                  <div className="h-0.5 w-8 rounded-full transition-colors duration-500 bg-[#b8924a]/80 shadow-[0_0_10px_rgba(184,146,74,0.5)]" />
                  <div className="h-0.5 w-8 rounded-full transition-colors duration-500 bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
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