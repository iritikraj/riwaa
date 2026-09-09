/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/real-estate/developer-advisors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Building2, Link2, X, AlertTriangle, Check, Share2, Clock, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { DeveloperHero } from "./_hero";
import { ProjectsGrid } from "./_projects-grid";
import { ProjectsMap } from "./_projects-map";
import { LeadCaptureForm } from "./_lead-form";

// Developers list mapping to our backend registry
const DEVELOPERS = [
  { id: 'emaar', name: 'Emaar Properties' },
  { id: 'aldar', name: 'Aldar Properties' }
];

export default function DeveloperAdvisorBuilder() {
  const [developerId, setDeveloperId] = useState<string>("");
  const [propertyFinderUrl, setPropertyFinderUrl] = useState<string>("");

  // State Machine: 'input' -> 'processing' -> 'draft'
  const [step, setStep] = useState<'input' | 'processing' | 'draft'>('input');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // --- NEW: HISTORY STATES ---
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);

  // Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/real-estate-agents/developer-agents/history");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setHistory(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
      }
    };
    fetchHistory();
  }, [step]); // Re-fetch when step changes (e.g., after publishing)

  // Poll the database while the background worker is running
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!documentId || step !== 'processing') return;

      try {
        const res = await fetch(`/api/real-estate-agents/developer-agents/${documentId}`);
        const result = await res.json();

        if (result.success && result.data?.report_status === 'draft') {
          setDraftData(result.data);
          setStep('draft');
          setIsFromHistory(false); // It's a fresh generation
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    if (step === 'processing') {
      interval = setInterval(pollStatus, 3000);
    }

    return () => clearInterval(interval);
  }, [documentId, step]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'companyLogo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraftData({
          ...draftData,
          agent_data: {
            ...draftData.agent_data,
            [field]: reader.result as string
          }
        });
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!developerId || !propertyFinderUrl) {
      setError("Please select a developer and provide a valid PropertyFinder URL.");
      return;
    }

    if (!propertyFinderUrl.includes("propertyfinder.ae")) {
      setError("Currently, we only support PropertyFinder.ae URLs.");
      return;
    }

    setError(null);
    setStep('processing');

    try {
      const res = await fetch("/api/real-estate-agents/developer-agents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developerId, propertyFinderUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation failed.");
      }

      setDocumentId(data.documentId);
    } catch (err: any) {
      setError(err.message || "Failed to contact the server.");
      setStep('input');
    }
  };

  const handlePublish = async () => {
    if (!documentId || !draftData) return;

    setIsSaving(true);
    try {
      // 1. If there are unsaved inline edits, save them first
      if (hasUnsavedChanges) {
        await fetch("/api/real-estate-agents/developer-agents/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, updates: draftData }),
        });
      }

      // 2. Publish
      const res = await fetch("/api/real-estate-agents/developer-agents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, finalData: draftData }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasUnsavedChanges(false);
        // Update line ~140 in your DeveloperAdvisorBuilder (page.tsx)
        navigator.clipboard.writeText(`${window.location.origin}/real-estate/developer-advisors/${data.slug}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        throw new Error(data.error || "Failed to publish");
      }
    } catch (err) {
      alert("Failed to publish changes.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetBuilder = () => {
    setIsFromHistory(false);
    setDraftData(null);
    setDocumentId(null);
    setStep('input');
    setDeveloperId("");
    setPropertyFinderUrl("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white w-full relative overflow-x-hidden flex items-center justify-center font-jost">

      {/* ERROR MODAL */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#111111] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                  <AlertTriangle className="text-red-400" size={28} />
                </div>
                <h3 className="font-jost text-2xl text-white mb-2">Notice</h3>
                <p className="text-white/60 font-light text-sm leading-relaxed mb-8">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs uppercase tracking-widest text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 1 & 2: INPUT & LOADING */}
      {step !== 'draft' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl p-6 relative z-10">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl w-full shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />

            <div className="relative w-full p-8">

              {/* BRANDING HEADER WITH ARCHIVES */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <Link href="/" className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
                      <Image src="/riwa-logo-transparent.png" height={30} width={30} alt="RIWAA" className="object-contain" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-neutral-100 font-light uppercase text-[15px] tracking-[0.28em] leading-none">RIWAA</h2>
                      <span className="text-[9px] tracking-[0.24em] uppercase text-neutral-500 mt-2">Powered by</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <div className="flex flex-col justify-center hidden sm:block">
                    <img src="/solvetude-logo.png" alt="Solvetude" className="h-8 w-auto object-contain opacity-90" />
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-2 rounded-full border transition-all duration-300 px-3 py-1.5 ${showHistory ? "bg-white/10 border-white/20 text-white" : "border-white/10 bg-white/3 text-neutral-400 hover:text-white"}`}
                  >
                    {showHistory ? <X size={12} /> : <Clock size={12} />}
                    <span className="text-[9px] uppercase tracking-[0.25em] font-medium">Archives</span>
                  </button>
                </div>
              </div>

              {/* HISTORY DROPDOWN */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showHistory ? "max-h-64 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 overflow-y-auto max-h-60 no-scrollbar space-y-1">
                  {history?.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-4 uppercase tracking-widest">No archives found</p>
                  ) : (
                    history?.map((item) => (
                      <button
                        key={item.documentId}
                        onClick={() => {
                          setDraftData(item);
                          setDocumentId(item.documentId);
                          setIsFromHistory(true);
                          setStep('draft');
                          setShowHistory(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group flex justify-between items-center"
                      >
                        <div className="flex flex-col pr-4 overflow-hidden">
                          <span className="text-sm text-neutral-300 group-hover:text-white font-light uppercase tracking-wide truncate">
                            {item.agent_data?.name || "Unnamed Agent"}
                          </span>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                            {item.developer_name || "Unknown Developer"}
                          </span>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full mb-1 ${item.report_status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                            {item.report_status}
                          </span>
                          <span className="text-[9px] text-neutral-600 tracking-widest uppercase">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* INPUT FORM */}
              {step === 'input' && !showHistory && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h3 className="text-xl text-neutral-200 font-light tracking-wide mb-2">
                      Create Page For Your Advisors
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block flex items-center gap-2">
                        <Building2 size={12} /> Master Developer
                      </label>
                      <div className="relative">
                        <select
                          value={developerId}
                          onChange={(e) => setDeveloperId(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-white/10 bg-white/2.5 px-4 py-4 text-sm text-neutral-200 outline-none focus:border-white/20 focus:bg-white/5 transition-all cursor-pointer"
                        >
                          <option value="" disabled className="bg-[#111]">Select Developer...</option>
                          {DEVELOPERS.map(dev => (
                            <option key={dev.id} value={dev.id} className="bg-[#111] text-white">{dev.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block flex items-center gap-2">
                        <Link2 size={12} /> PropertyFinder Agent URL
                      </label>
                      <input
                        type="url"
                        value={propertyFinderUrl}
                        onChange={(e) => setPropertyFinderUrl(e.target.value)}
                        placeholder="https://www.propertyfinder.ae/en/broker/..."
                        className="w-full rounded-xl border border-white/10 bg-white/2.5 px-4 py-4 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-white/20 focus:bg-white/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={handleGenerate}
                      disabled={!developerId || !propertyFinderUrl}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-black transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:scale-100 px-8 py-4 w-full sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Generate Page <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* LOADING STATE */}
              {step === 'processing' && (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
                    <div className="absolute inset-0 border-2 border-[#d4af71] rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="text-[#d4af71]" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-neutral-200 font-light tracking-wide mb-2">Synthesizing Profile...</h3>
                    <p className="text-xs text-neutral-500 font-light">
                      Scraping PropertyFinder credentials and crafting the tailored {DEVELOPERS.find(d => d.id === developerId)?.name} specialist bio.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: DRAFT PREVIEW & EDIT (Full Screen) */}
      {step === 'draft' && draftData && (
        <div className="absolute inset-0 w-full h-full z-100 bg-[#f9f6f1] overflow-y-auto">

          {/* Top Admin Bar */}
          <div className="fixed top-0 left-0 right-0 bg-[#1A1A1A] border-b border-white/10 px-6 py-4 flex justify-between items-center z-110 shadow-xl">
            <div className="flex items-center gap-6">
              <button onClick={handleResetBuilder} className="text-white/50 hover:text-white cursor-pointer text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2">
                <X size={14} /> {isFromHistory ? "Close Archive" : "Discard & Restart"}
              </button>

              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <span className="text-[10px] text-white/70 uppercase tracking-widest font-medium hidden sm:block">
                Previewing: {draftData.agent_data?.name} x {draftData.developer_name}
              </span>
            </div>

            <button onClick={handlePublish} disabled={isSaving} className="px-6 py-2 bg-[#b8924a] cursor-pointer hover:bg-[#d4af71] text-white rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
              {isSaving ? (
                <><div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</>
              ) : isCopied ? (
                <><Check size={12} /> Link Copied!</>
              ) : (
                <><Share2 size={12} /> {draftData.report_status === 'published' ? "Update & Copy Link" : "Publish & Copy Link"}</>
              )}
            </button>
          </div>

          <div className="pt-20 pb-20 max-w-5xl mx-auto px-6">

            {/* Inline Editing Controls Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-10 mt-6 font-jost">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-800">Review & Edit Content</h3>
                {hasUnsavedChanges && <span className="text-[9px] uppercase tracking-widest font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">Unsaved Changes</span>}
              </div>

              <div className="space-y-5">
                {/* 2-Column Grid for Agent Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Agent Name</label>
                    <input
                      type="text"
                      value={draftData.agent_data?.name || ''}
                      onChange={(e) => {
                        setDraftData({ ...draftData, agent_data: { ...draftData.agent_data, name: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Phone Number</label>
                    <input
                      type="text"
                      value={draftData.agent_data?.phoneNumber || ''}
                      onChange={(e) => {
                        setDraftData({ ...draftData, agent_data: { ...draftData.agent_data, phoneNumber: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Agent Rating</label>
                    <input
                      type="text"
                      value={draftData.agent_data?.rating || ''}
                      onChange={(e) => {
                        setDraftData({ ...draftData, agent_data: { ...draftData.agent_data, rating: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Company Name</label>
                    <input
                      type="text"
                      value={draftData.agent_data?.companyName || ''}
                      onChange={(e) => {
                        setDraftData({ ...draftData, agent_data: { ...draftData.agent_data, companyName: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#b8924a] transition-colors"
                    />
                  </div>
                  {/* Visual Profile Image Uploader */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Profile Image</label>
                    <div className="flex items-center gap-5 bg-white rounded-xl p-4 transition-colors hover:bg-neutral-50">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 shadow-sm flex items-center justify-center">
                        {draftData.agent_data?.profileImage ? (
                          <img src={draftData.agent_data.profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">None</span>
                        )}
                      </div>
                      <div className="flex flex-col items-start gap-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          id="profile-upload"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'profileImage')}
                        />
                        {/* <label htmlFor="profile-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-[10px] uppercase tracking-widest font-semibold text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-all shadow-sm">
                          <Upload size={12} /> Replace
                        </label>
                        <span className="text-[9px] text-neutral-400">JPG, PNG or WEBP (Max 2MB)</span> */}
                      </div>
                    </div>
                  </div>

                  {/* Visual Company Logo Uploader */}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Company Logo</label>
                    <div className="flex items-center gap-5 bg-white rounded-xl p-4 transition-colors hover:bg-neutral-50">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-neutral-50 shrink-0 border border-neutral-200 shadow-sm flex items-center justify-center p-2">
                        {draftData.agent_data?.companyLogo ? (
                          <img src={draftData.agent_data.companyLogo} alt="Logo" className="h-full w-full object-contain mix-blend-multiply" />
                        ) : (
                          <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">None</span>
                        )}
                      </div>
                      <div className="flex flex-col items-start gap-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          id="logo-upload"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'companyLogo')}
                        />
                        {/* <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-[10px] uppercase tracking-widest font-semibold text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-all shadow-sm">
                          <Upload size={12} /> Replace
                        </label>
                        <span className="text-[9px] text-neutral-400">Transparent PNG recommended</span> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block flex justify-between">
                    <span>RIWAA Generated Bio (Tailored to {draftData.developer_name})</span>
                    <span className="text-[#b8924a] font-medium">RIWAA ✨</span>
                  </label>
                  <textarea
                    value={draftData.agent_bio || ''}
                    onChange={(e) => {
                      setDraftData({ ...draftData, agent_bio: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full h-40 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 leading-relaxed outline-none focus:border-[#b8924a] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Visual Preview Section */}
            <div className="pointer-events-none shadow-[0_30px_100px_rgba(0,0,0,0.12)] rounded-4xl overflow-hidden border border-neutral-200 mt-10 bg-white">
              <DeveloperHero
                developerName={draftData.developer_name}
                developerProfile={draftData.developer_profile}
                agentData={draftData.agent_data}
                agentBio={draftData.agent_bio}
              />
              <ProjectsGrid
                developerName={draftData.developer_name}
                projects={draftData.projects_list}
              />
              <ProjectsMap
                developerName={draftData.developer_name}
                projects={draftData.projects_list}
              />
              <LeadCaptureForm
                developerName={draftData.developer_name}
                agentName={draftData.agent_data?.name}
                projects={draftData.projects_list}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}