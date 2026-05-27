/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Footer } from "@/app/components/skeleton/Footer";
import { Navbar } from "@/app/components/skeleton/Navbar";
import { ComponentRegistry } from "..";
import { Clock, Share2, Check } from "lucide-react";

const steps = [
  { id: 'vision', label: 'The Vision', type: 'text' },
  { id: 'images', label: 'Property Imagery', type: 'file', multiple: true },
  { id: 'floorPlan', label: 'Floor Plans', type: 'file', multiple: true },
  { id: 'maps', label: 'Map Location', type: 'url' },
  { id: 'brochure', label: 'Brochure PDF', type: 'file' },
  { id: 'video', label: 'Project Video', type: 'url' },
];

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isCopied, setIsCopied] = useState(false);

  // Helper to convert File to Base64 for SQLite storage
  const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const [prompt, setPrompt] = useState("");
  const [site, setSite] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const handleCopyLink = () => {
    if (!site?.id) return;
    // Copies the dynamic route URL to the clipboard
    navigator.clipboard.writeText(`${window.location.origin}/p/${site.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    if (!prompt && currentStep === 0) return; // Require at least the text prompt
    setIsGenerating(true);

    try {
      // Pass both the prompt and the collected assets
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, assets: formData }),
      });

      const data = await res.json();
      setSite(data);
      fetchHistory();
      setShowHistory(false);
      // Optional: Reset step to 0 after generation so if they want to tweak, they start at vision
      setCurrentStep(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white w-full relative overflow-x-hidden">

      {/* Floating AI Panel */}
      <motion.div
        drag={!!site}
        dragMomentum={false}
        dragElastic={0.08}
        whileDrag={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`
          fixed z-[120] flex pointer-events-none
          transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${!site ? "inset-0 items-center justify-center p-6" : "bottom-6 right-6 items-start justify-end"}
        `}
      >
        {/* Panel Shell */}
        <div
          className={`
            pointer-events-auto p-px rounded-[28px]
            bg-gradient-to-br from-white/20 via-white/5 to-white/10
            shadow-[0_20px_80px_rgba(0,0,0,0.55)]
            transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${!site ? "w-full max-w-2xl" : "w-[400px] max-w-[400px]"}
          `}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl w-full">
            {/* Drag Handle */}
            {site && (
              <div className="absolute top-0 left-0 w-full h-10 z-20 cursor-grab active:cursor-grabbing flex items-center justify-center">
                <div className="w-16 h-1 rounded-full bg-white/10" />
              </div>
            )}

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
            <div className="absolute -top-24 right-0 w-72 h-72 bg-white/3 blur-3xl rounded-full pointer-events-none" />

            {/* Inner */}
            <div className={`relative w-full transition-all duration-700 ${!site ? "p-8" : "pt-12 pb-5 px-5"}`}>

              {/* Header */}
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <Image
                    src="/riwa-logo.png"
                    height={32}
                    width={32}
                    alt="logo"
                    className="object-contain"
                    style={{ background: "transparent" }}
                  />
                  <div>
                    <h2 className={`text-neutral-100 font-light uppercase transition-all duration-500 ${!site ? "text-base tracking-[0.12em]" : "text-sm tracking-[0.25em]"}`}>
                      RIWAA
                    </h2>
                    <p className="text-xs tracking-[0.35em] uppercase text-neutral-500 font-medium">
                      By Solvetude
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* NEW: Share Button (Only visible when site is generated) */}
                  {site && site.id && (
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 rounded-full border border-[#B9A089]/40 bg-[#B9A089]/10 px-2.5 py-2 text-[#B9A089] hover:bg-[#B9A089]/20 transition-all duration-300"
                    >
                      {isCopied ? <Check size={12} /> : <Share2 size={12} />}
                      <span className="text-[10px] uppercase tracking-[0.25em] font-medium hidden sm:block">
                        {isCopied ? "Copied" : "Share"}
                      </span>
                    </button>
                  )}

                  {/* Existing Archives Button */}
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-2 rounded-full border transition-all duration-300 hover:bg-white/10 ${!site ? "px-3 py-2" : "px-2.5 py-2"} ${showHistory ? "bg-white/10 border-white/20 text-white" : "border-white/10 bg-white/3 text-neutral-400"}`}
                  >
                    <Clock size={12} />
                    {!site && <span className="text-[10px] uppercase tracking-[0.25em] hidden sm:block">Archives</span>}
                  </button>

                  {/* Existing Online Indicator */}
                  {!site && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Online</span>
                    </div>
                  )}
                </div>
              </div>

              {/* History Drawer */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showHistory ? "max-h-64 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 overflow-y-auto max-h-60 no-scrollbar space-y-1">
                  {history?.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-4 uppercase tracking-widest">No archives found</p>
                  ) : (
                    history?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setSite(item.content); setShowHistory(false); }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group flex justify-between items-center"
                      >
                        <span className="text-sm text-neutral-300 group-hover:text-white font-light uppercase tracking-wide truncate pr-4">{item.siteTitle || "Untitled Vision"}</span>
                        <span className="text-[9px] text-neutral-600 tracking-widest uppercase shrink-0">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Interactive Wizard Area */}
              <div className="relative overflow-hidden w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="w-full"
                  >
                    {/* Step Indicator (Only show if site isn't generated to save space when docked) */}
                    {!site && (
                      <>
                        <div className="flex gap-1.5 mb-5">
                          {steps.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-white' : 'bg-white/10'}`} />
                          ))}
                        </div>
                        <div className="mb-4">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">Step 0{currentStep + 1}</p>
                          <h3 className="text-sm text-neutral-200 font-light tracking-widest uppercase">{steps[currentStep].label}</h3>
                        </div>
                      </>
                    )}

                    <div className="relative group w-full">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Input Switching Logic */}
                      {steps[currentStep].type === 'text' && (
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe a luxury property vision..."
                          className={`w-full resize-none rounded-2xl border border-white/10 bg-white/2.5 px-5 py-5 text-sm leading-relaxed text-neutral-200 placeholder:text-neutral-500 outline-none transition-all duration-500 focus:border-white/20 focus:bg-white/4.5 no-scrollbar ${!site ? "h-32 md:h-40" : "h-24"}`}
                        />
                      )}

                      {steps[currentStep].type === 'file' && (
                        <div className={`relative w-full border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-white/20 bg-white/2.5 transition-all cursor-pointer ${!site ? "h-32 md:h-40" : "h-24"}`}>
                          <input
                            type="file"
                            multiple={steps[currentStep].multiple}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              const base64Files = await Promise.all(files.map(toBase64));
                              setFormData({ ...formData, [steps[currentStep].id]: base64Files });
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <p className="text-xs text-neutral-400 uppercase tracking-widest">
                            {formData[steps[currentStep].id] ? "Files Ready" : "Upload or Drop"}
                          </p>
                          {!site && <span className="text-[10px] text-neutral-600 mt-2 italic">PDF, JPG, PNG</span>}
                        </div>
                      )}

                      {steps[currentStep].type === 'url' && (
                        <input
                          type="text"
                          value={formData[steps[currentStep].id] || ""}
                          placeholder={steps[currentStep].id === 'maps' ? "Paste Map Link..." : "Paste Video Link..."}
                          onChange={(e) => setFormData({ ...formData, [steps[currentStep].id]: e.target.value })}
                          className={`w-full rounded-2xl border border-white/10 bg-white/2.5 px-5 text-sm text-neutral-200 placeholder:text-neutral-500 outline-none transition-all duration-500 focus:border-white/20 focus:bg-white/4.5 ${!site ? "py-5" : "py-4"}`}
                        />
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Wizard Footer Navigation */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="flex items-center gap-4">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-all"
                    >
                      Back
                    </button>
                  )}
                  {currentStep > 0 && currentStep < steps.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-all"
                    >
                      Skip
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={isGenerating || (currentStep === 0 && !prompt)}
                  className={`
                    group relative overflow-hidden rounded-2xl border border-white/10 bg-white
                    text-[11px] font-semibold uppercase tracking-[0.3em] text-black 
                    transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 
                    disabled:opacity-40 disabled:hover:scale-100 hover:cursor-pointer
                    ${!site ? "px-8 py-4 w-full sm:w-auto" : "px-5 py-3 w-full"}
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isGenerating ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Synthesizing...</>
                    ) : (
                      <>
                        {currentStep === steps.length - 1 ? (site ? "Regenerate" : "Build Experience") : "Continue"}
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Canvas */}
      <div className="w-full transition-all duration-1000">
        {!site ? (
          <div className="h-screen flex flex-col items-center justify-center text-center px-6 pb-64">
            <div className="mb-6 w-16 h-px bg-white/20" />
            <p className="text-white/80 uppercase tracking-[0.55em] text-[11px] font-light">
              Waiting For Your Vision
            </p>
            <p className="mt-4 text-white/35 text-sm max-w-md leading-relaxed">
              Describe a premium Dubai property experience and let the AI craft a luxury digital presentation.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse delay-300" />
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <main className="w-full">
              {site?.sections?.map((section: any, i: number) => {
                const SectionFamily = ComponentRegistry[section.type];
                if (!SectionFamily) return null;

                const Component = SectionFamily[section.version] || SectionFamily["VersionOne"];
                if (!Component) return null;

                return (
                  <Component
                    key={i}
                    {...section}
                    // Inject Global Assets directly into the components
                    floorPlans={site.globalAssets?.floorPlans}
                    mapsLink={site.globalAssets?.mapsLink}
                    videoUrl={site.globalAssets?.videoUrl}
                  />
                );
              })}
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}