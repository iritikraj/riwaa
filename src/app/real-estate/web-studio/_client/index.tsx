/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Footer } from "@/components/skeleton/Footer";
import { Navbar } from "@/components/skeleton/Navbar";
import { ComponentRegistry } from "..";
import { Clock, Share2, Check, X, Save, LayoutTemplate } from "lucide-react";

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

  const [prompt, setPrompt] = useState("");
  const [site, setSite] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // --- NEW: THEME & EDITOR STATE ---
  const [selectedTheme, setSelectedTheme] = useState("VersionOne");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);

  const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/landing-page-builder/history");
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCopyLink = () => {
    if (!site?.id) return;
    navigator.clipboard.writeText(`${window.location.origin}/real-estate/web-studio/${site.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    if (!prompt && currentStep === 0) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/landing-page-builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, assets: formData }),
      });

      const data = await res.json();
      setSite({ ...data, theme: "VersionOne" }); // Set default theme
      setSelectedTheme("VersionOne");
      fetchHistory();
      setShowHistory(false);
      setCurrentStep(0);
      setIsFromHistory(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- NEW: SAVE TO DATABASE ---
  const saveToDatabase = async () => {
    console.log(site);
    setIsSaving(true);
    try {
      // Assuming you have an endpoint for saving/updating the site
      const res = await fetch("/api/landing-page-builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: site?.id,
          content: { ...site, theme: selectedTheme },
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- NEW: SECTION UPDATE HANDLER ---
  const handleSectionUpdate = (sectionIndex: number, field: string, value: any) => {
    const updatedSections = [...site.sections];
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], [field]: value };
    setSite({ ...site, sections: updatedSections });
    setHasUnsavedChanges(true);
  };

  const closeEditor = () => {
    setSite(null);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white w-full relative overflow-x-hidden font-jost">

      {/* --- NEW: THE ACTION STRIP (Only visible when site is generated) --- */}
      {site && (
        <div className="fixed top-0 left-0 right-0 bg-[#1A1A1A] border-b border-white/10 px-6 py-4 flex justify-between items-center z-150 shadow-xl">

          {/* Left: Close & Save */}
          <div className="flex items-center gap-6">
            <button onClick={closeEditor} className="text-white/50 hover:text-white cursor-pointer text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2">
              <X size={14} /> {isFromHistory ? "Close Archive" : "Close Editor"}
            </button>
            {hasUnsavedChanges && (
              <button onClick={saveToDatabase} disabled={isSaving} className="text-[#d4af71] hover:text-[#e0c393] animate-pulse cursor-pointer text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2">
                {isSaving ? "Saving..." : <><Save size={14} /> Save Inline Edits</>}
              </button>
            )}
          </div>

          {/* Center: Theme Switcher */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full p-1">
            {[
              { id: "VersionOne", label: "Elegance" },
              { id: "VersionTwo", label: "Modern" },
              { id: "VersionThree", label: "Minimal" }
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  setHasUnsavedChanges(true);
                }}
                className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-full transition-all duration-300 ${selectedTheme === theme.id
                  ? "bg-[#b8924a] text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
                  }`}
              >
                {selectedTheme === theme.id && <LayoutTemplate size={12} />}
                {theme.label}
              </button>
            ))}
          </div>

          {/* Right: Share */}
          <button onClick={handleCopyLink} className="px-6 py-2 bg-[#b8924a] cursor-pointer hover:bg-[#d4af71] text-white rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
            {isCopied ? <Check size={12} /> : <Share2 size={12} />}
            {isCopied ? "Copied" : "Copy Share Link"}
          </button>
        </div>
      )}

      {/* Floating AI Panel (Hides when site is generated) */}
      {!site && (
        <motion.div
          className="fixed inset-0 z-120 flex items-center justify-center p-6 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          {/* Panel Shell */}
          <div className="w-full max-w-2xl p-px rounded-[28px] bg-gradient-to-br from-white/20 via-white/5 to-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl w-full">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
              <div className="absolute -top-24 right-0 w-72 h-72 bg-white/3 blur-3xl rounded-full pointer-events-none" />

              <div className="relative w-full transition-all duration-700 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
                        <Image src="/riwa-logo.png" height={26} width={26} alt="RIWAA" className="object-contain" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h2 className="text-neutral-100 font-light uppercase text-[15px] tracking-[0.28em] leading-none">RIWAA</h2>
                        <span className="text-[9px] tracking-[0.24em] uppercase text-neutral-500 mt-2">Powered by</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex flex-col justify-center">
                      <img src="/solvetude-logo.png" alt="Solvetude" className="h-8 w-auto object-contain opacity-90" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-2 rounded-full border transition-all duration-300 hover:bg-white/10 px-3 py-2 ${showHistory ? "bg-white/10 border-white/20 text-white" : "border-white/10 bg-white/3 text-neutral-400"}`}>
                      <Clock size={12} />
                      <span className="text-[10px] uppercase tracking-[0.25em] hidden sm:block font-jost">Archives</span>
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-jost">Online</span>
                    </div>
                  </div>
                </div>

                {/* History Drawer */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showHistory ? "max-h-64 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 overflow-y-auto max-h-60 no-scrollbar space-y-1">
                    {history?.length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-4 uppercase tracking-widest font-jost">No archives found</p>
                    ) : (
                      history?.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSite({ ...item.content, id: item.id });
                            setSelectedTheme(item.content.theme || "VersionOne");
                            setIsFromHistory(true);
                            setShowHistory(false);
                          }}
                          className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group flex justify-between items-center"
                        >
                          <span className="text-sm text-neutral-300 group-hover:text-white font-light uppercase tracking-wide truncate pr-4 font-jost">{item.siteTitle || "Untitled Vision"}</span>
                          <span className="text-[9px] text-neutral-600 tracking-widest uppercase shrink-0 font-jost">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Interactive Wizard Area */}
                <div className="relative overflow-hidden w-full">
                  <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3, ease: "circOut" }} className="w-full">
                      <div className="flex gap-1.5 mb-5">
                        {steps.map((_, i) => (
                          <div key={i} className={`h-1 flex-1 font-jost rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-white' : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <div className="mb-4">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1 font-jost">Step 0{currentStep + 1}</p>
                        <h3 className="text-sm text-neutral-200 font-light tracking-widest uppercase font-jost">{steps[currentStep].label}</h3>
                      </div>

                      <div className="relative group w-full">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {steps[currentStep].type === 'text' && (
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe a luxury property vision..."
                            className="w-full resize-none font-jost rounded-2xl border border-white/10 bg-white/2.5 px-5 py-5 text-sm leading-relaxed text-neutral-200 placeholder:text-neutral-500 outline-none transition-all duration-500 focus:border-white/20 focus:bg-white/4.5 no-scrollbar h-32 md:h-40"
                          />
                        )}

                        {steps[currentStep].type === 'file' && (
                          <div className="relative w-full border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-white/20 bg-white/2.5 transition-all cursor-pointer h-32 md:h-40">
                            <input type="file" multiple={steps[currentStep].multiple} onChange={async (e) => { const files = Array.from(e.target.files || []); const base64Files = await Promise.all(files.map(toBase64)); setFormData({ ...formData, [steps[currentStep].id]: base64Files }); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <p className="text-xs text-neutral-400 uppercase tracking-widest">{formData[steps[currentStep].id] ? "Files Ready" : "Upload or Drop"}</p>
                            <span className="text-[10px] text-neutral-600 mt-2 italic">PDF, JPG, PNG</span>
                          </div>
                        )}

                        {steps[currentStep].type === 'url' && (
                          <input type="text" value={formData[steps[currentStep].id] || ""} placeholder={steps[currentStep].id === 'maps' ? "Paste Map Embed Code / iFrame" : "Paste Video Link..."} onChange={(e) => setFormData({ ...formData, [steps[currentStep].id]: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/2.5 px-5 text-sm text-neutral-200 placeholder:text-neutral-500 outline-none transition-all duration-500 focus:border-white/20 focus:bg-white/4.5 py-5" />
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Wizard Footer Navigation */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {currentStep > 0 && <button onClick={() => setCurrentStep(prev => prev - 1)} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-all">Back</button>}
                    {currentStep > 0 && currentStep < steps.length - 1 && <button onClick={handleNext} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-all">Skip</button>}
                  </div>
                  <button onClick={handleNext} disabled={isGenerating || (currentStep === 0 && !prompt)} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-black transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:scale-100 hover:cursor-pointer px-8 py-4 w-full sm:w-auto">
                    <span className="relative z-10 flex items-center justify-center gap-3 font-jost">
                      {isGenerating ? <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Synthesizing...</> : <>{currentStep === steps.length - 1 ? "Build Experience" : "Continue"} <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" /></svg></>}
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Canvas */}
      <div className="w-full transition-all duration-1000">
        {!site ? (
          <div className="h-screen flex flex-col items-center justify-center text-center px-6 pb-64">
            <div className="mb-6 w-16 h-px bg-white/20" />
            <p className="text-white/80 uppercase tracking-[0.55em] text-[11px] font-light">Waiting For Your Vision</p>
            <p className="mt-4 text-white/35 text-sm max-w-md leading-relaxed">Describe a premium Dubai property experience and let the AI craft a luxury digital presentation.</p>
            <div className="mt-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse delay-300" />
            </div>
          </div>
        ) : (
          <div className="mt-17 transform-gpu min-h-screen bg-[#f9f6f1]">
            <Navbar />
            <main className="w-full">
              {site?.sections?.map((section: any, i: number) => {
                const SectionFamily = ComponentRegistry[section.type];
                if (!SectionFamily) return null;
                const Component = SectionFamily[selectedTheme] || SectionFamily["VersionOne"];
                if (!Component) return null;
                return (
                  <Component
                    key={i}
                    {...section}
                    // --- NEW: PASSING EDITOR PROPS ---
                    isEditable={!isFromHistory}
                    onUpdate={(field: string, value: any) => handleSectionUpdate(i, field, value)}
                    floorPlans={site.globalAssets?.floorPlans}
                    mapsLink={site.globalAssets?.mapsLink}
                    videoUrl={site.globalAssets?.videoUrl}
                  />
                );
              })}
            </main>
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}