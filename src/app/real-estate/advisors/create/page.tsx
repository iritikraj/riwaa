/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Upload, Clock, X, ArrowRight, Share2, Check, FileText, Image as ImageIcon, Settings2, Save, Globe, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { z } from "zod";
import { experimental_useObject as useObject } from "@ai-sdk/react";

// Version One
import { AgentHero } from "../_hero";
import { AgentMetrics } from "../_metrices";
import { AgentTimeline } from "../_timeline";
import { AgentExpertise } from "../_expertise";
import { AgentContact } from "../_contact";
import { AgentPartnerships } from "../_partnership";
import { AgentMedia } from "../_media";
import { AgentTestimonials } from "../_testimonials";

// Version Two
import { AgentHeroVersionTwo } from "../_hero/index.v2";
import { AgentMetricsVersionTwo } from "../_metrices/index.v2";
import { AgentTimelineVersionTwo } from "../_timeline/index.v2";
import { AgentExpertiseVersionTwo } from "../_expertise/index.v2";
import { AgentContactVersionTwo } from "../_contact/index.v2";
import { AgentMediaVersionTwo } from "../_media/index.v2";
import { AgentTestimonialsVersionTwo } from "../_testimonials/index.v2";
import { AgentPartnershipsVersionTwo } from "../_partnership/index.v2";
import dynamic from 'next/dynamic';

// --- NEW IMPORTS ---
import { mockDrivenListings } from '@/config/data/mock-driven-listings';
import { BrokerageFooter } from "../_brokerage-company";

const AgentListings = dynamic(() => import('../_listings').then(mod => mod.AgentListings), {
  ssr: false,
});

const agentZodSchema = z.object({
  theme: z.string().optional().describe("Either 'theme1' or 'theme2'. Defaults to 'theme1'"),
  companyLogo: z.string().optional(),
  hero: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    languages: z.array(z.string()).optional(),
    badges: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
  }).optional(),
  metrics: z.object({
    totalVolume: z.string().optional(),
    dealsClosed: z.string().optional(),
    yearsActive: z.string().optional(),
    highestDeal: z.string().optional(),
    averageDeal: z.string().optional(),
    repeatClients: z.string().optional(),
  }).optional(),
  timeline: z.array(
    z.object({
      year: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),
  expertise: z.object({
    areas: z.array(z.string()).optional(),
    propertyTypes: z.array(z.string()).optional(),
    marketQuote: z.string().optional(),
  }).optional(),
  partnerships: z.array(z.string()).optional(),
  mediaPresence: z.array(
    z.object({
      headline: z.string().optional(),
      publication: z.string().optional(),
      year: z.string().optional(),
    })
  ).optional(),
  testimonials: z.array(
    z.object({
      quote: z.string().optional(),
      clientName: z.string().optional(),
      clientTitle: z.string().optional(),
    })
  ).optional(),
  contact: z.object({
    whatsapp: z.string().optional(),
    developer: z.string().optional(),
  }).optional(),
});

const baseSteps = [
  { id: 'ingestion', label: 'Data Ingestion', icon: FileText },
  { id: 'visuals', label: 'Visual Assets', icon: ImageIcon },
  { id: 'verification', label: 'Verification & Gaps', icon: Settings2 },
];

export default function AgentBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDiscoveringPR, setIsDiscoveringPR] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- NEW: ERROR STATE ---
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [sourceText, setSourceText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");

  const [agentImage, setAgentImage] = useState<string | null>(null);
  const [bgImages, setBgImages] = useState<string[]>([]);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const activeSteps = links.length > 0
    ? baseSteps.filter(step => step.id !== 'visuals')
    : baseSteps;

  const currentStepId = activeSteps[currentStep]?.id;
  const isFinalOutput = currentStep === activeSteps.length;

  const { submit, isLoading: isStreaming, object: streamedData } = useObject({
    api: '/api/real-estate-agents/generate',
    schema: agentZodSchema,
    onFinish({ object }) {
      // --- NEW: VALIDATION CHECK ---
      // If the object is empty or missing the core name, the AI failed mid-stream.
      if (!object || !object.hero || !object.hero.name) {
        setGenerationError("This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.");
        setCurrentStep(prev => Math.max(0, prev - 1)); // Step back so they can try again
        return;
      }

      setExtractedData({
        ...object,
        contact: {
          whatsapp: object?.contact?.whatsapp || "",
          developer: object?.contact?.developer || "independent"
        },
        hero: {
          ...object?.hero,
          imageUrl: agentImage || object?.hero?.imageUrl,
          bgImages: bgImages.length > 0 ? bgImages : undefined
        },
        companyLogo: companyLogo || object?.companyLogo,
        listings: mockDrivenListings.agents_active_listings
      });
    },
    onError(error) {
      console.error("Stream error:", error);
      // --- NEW: TRIGGER POPUP ON HTTP/SDK ERROR ---
      setGenerationError("The Server encountered an unexpected error. It may be overloaded. Please try again.");
      setCurrentStep(prev => Math.max(0, prev - 1));
    }
  });

  const handleDiscoverPR = async () => {
    const agentName = extractedData?.hero?.name || streamedData?.hero?.name;
    if (!agentName) {
      alert("We need the agent's name to search the web first!");
      return;
    }

    setIsDiscoveringPR(true);
    try {
      const res = await fetch("/api/real-estate-agents/discover-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: agentName, location: "ae" }),
      });
      const data = await res.json();

      if (data.mediaPresence && data.mediaPresence.length > 0) {
        setExtractedData((prev: any) => ({
          ...prev,
          mediaPresence: data.mediaPresence
        }));
        setHasUnsavedChanges(true);
      } else {
        alert("No recent news articles found. You can add placeholders manually.");
      }
    } catch (error) {
      console.error("PR Discovery failed", error);
      alert("Failed to search the web.");
    } finally {
      setIsDiscoveringPR(false);
    }
  };

  const handleAddLink = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkInput.trim()) {
      e.preventDefault();
      const url = linkInput.trim().toLowerCase();
      if (url.includes("propertyfinder.ae")) {
        if (!links.includes(url)) setLinks([...links, url]);
        setLinkInput("");
      } else {
        alert("Currently, we optimize only PropertyFinder URLs.");
      }
    }
  };

  const removeLink = (urlToRemove: string) => setLinks(links.filter(link => link !== urlToRemove));

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/real-estate-agents/history");
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCopyLink = () => {
    if (!extractedData?.id) return;
    navigator.clipboard.writeText(`${window.location.origin}/real-estate/advisors/${extractedData.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 2);
    const base64Files = await Promise.all(
      files.map((file) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    );
    setBgImages(base64Files);
  };

  const runAiExtraction = () => {
    setGenerationError(null); // Clear previous errors
    submit({ sourceText, links });
    setCurrentStep(activeSteps.length - 1);
  };

  const saveToDatabase = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/real-estate-agents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: extractedData?.id,
          content: extractedData,
          name: extractedData?.hero?.name,
          imageUrl: extractedData?.hero?.imageUrl
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save to database");
      }

      const data = await res.json();
      if (!extractedData?.id && data.id) {
        setExtractedData((prev: any) => ({ ...prev, id: data.id }));
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    if (currentStepId === 'ingestion') {
      if (activeSteps.length === 2) runAiExtraction();
      else setCurrentStep(1);
    }
    else if (currentStepId === 'visuals') {
      runAiExtraction();
    }
    else if (currentStepId === 'verification') {
      if (isStreaming || isDiscoveringPR) return;
      await saveToDatabase();
      setCurrentStep(activeSteps.length);
    }
  };

  const handleResetBuilder = () => {
    setIsFromHistory(false);
    setExtractedData(null);
    setCurrentStep(0);
  };

  const displayData = extractedData || streamedData || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white w-full relative overflow-x-hidden flex items-center justify-center font-jost">

      {/* --- NEW: ERROR MODAL OVERLAY --- */}
      <AnimatePresence>
        {generationError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#111111] border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                  <AlertTriangle className="text-red-400" size={28} />
                </div>
                <h3 className="font-jost text-2xl text-white mb-2">Generation Interrupted</h3>
                <p className="text-white/60 font-light text-sm leading-relaxed mb-8">
                  {generationError}
                </p>
                <button
                  onClick={() => setGenerationError(null)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs uppercase tracking-widest text-white transition-colors"
                >
                  Dismiss & Try Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isFinalOutput && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl p-6 relative z-10">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 backdrop-blur-3xl w-full shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />

            <div className="relative w-full p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  {/* RIWAA */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 backdrop-blur-xl">
                      <Image
                        src="/riwa-logo.png"
                        height={26}
                        width={26}
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
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`flex items-center gap-2 rounded-full border transition-all duration-300 px-3 py-2 ${showHistory ? "bg-white/10 border-white/20 text-white" : "border-white/10 bg-white/3 text-neutral-400 hover:text-white"}`}
                  >
                    {showHistory ? <X size={12} /> : <Clock size={12} />}
                    <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Archives</span>
                  </button>
                </div>
              </div>
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showHistory ? "max-h-64 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 overflow-y-auto max-h-60 no-scrollbar space-y-1">
                  {history?.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-4 uppercase tracking-widest">No archives found</p>
                  ) : (
                    history?.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setExtractedData({ ...item.content, id: item.id });
                          setIsFromHistory(true);
                          setCurrentStep(activeSteps.length);
                          setShowHistory(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group flex justify-between items-center"
                      >
                        <span className="text-sm text-neutral-300 group-hover:text-white font-light uppercase tracking-wide truncate pr-4">
                          {item.name || "Unnamed Agent"}
                        </span>
                        <span className="text-[9px] text-neutral-600 tracking-widest uppercase shrink-0">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="relative overflow-hidden w-full min-h-75">
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3 }} className="w-full">

                    <div className="flex gap-1.5 mb-5">
                      {activeSteps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-white' : 'bg-white/10'}`} />)}
                    </div>
                    <div className="mb-6">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">Step 0{currentStep + 1}</p>
                      <h3 className="text-sm text-neutral-200 font-light tracking-widest uppercase flex items-center gap-2">{activeSteps[currentStep].label}</h3>
                    </div>

                    {/* Step 1: Ingestion */}
                    {currentStepId === 'ingestion' && (
                      <div className="space-y-4">
                        <div className="relative w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-white/20 bg-white/2.5 transition-all cursor-pointer group">
                          <input type="file" onChange={(e) => setCvFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <Upload className="text-neutral-500 group-hover:text-neutral-300 transition-colors mb-1" size={18} />
                          <p className="text-xs text-neutral-400 uppercase tracking-widest group-hover:text-neutral-200 transition-colors">
                            {cvFile ? cvFile.name : "Upload CV or PDF"}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 py-1">
                          <div className="flex-1 h-px bg-white/5" />
                          <span className="text-[9px] uppercase tracking-widest text-neutral-600">OR PASTE</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <textarea
                          value={sourceText}
                          onChange={(e) => setSourceText(e.target.value)}
                          placeholder="Paste LinkedIn bio or career highlights..."
                          className="w-full h-32 resize-none rounded-2xl border border-white/10 bg-white/2.5 px-5 py-5 text-sm leading-relaxed text-neutral-200 placeholder:text-neutral-500 outline-none transition-all duration-500 focus:border-white/20 focus:bg-white/4.5 no-scrollbar"
                        />

                        <div className="flex items-center gap-4 py-1">
                          <div className="flex-1 h-px bg-white/5" />
                          <span className="text-[9px] uppercase tracking-widest text-neutral-600">OR ADD PROFILE LINKS</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <div className="w-full rounded-2xl border border-white/10 bg-white/2.5 p-2 transition-all duration-500 focus-within:border-white/20 focus-within:bg-white/4.5">
                          {links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 px-2 pt-2">
                              {links.map((link, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs text-neutral-300">
                                  <span className="truncate max-w-37.5">{new URL(link).hostname.replace('www.', '')}</span>
                                  <button onClick={() => removeLink(link)} className="text-neutral-500 hover:text-white"><X size={12} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                          <input
                            type="url"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            onKeyDown={handleAddLink}
                            placeholder="Paste PropertyFinder URL & Press Enter"
                            className="w-full bg-transparent px-3 py-3 text-sm text-neutral-200 placeholder:text-neutral-500 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Visuals (Skipped if links provided) */}
                    {currentStepId === 'visuals' && (
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Brokerage / Company Logo</p>
                          <div className="relative w-full h-20 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-white/20 bg-white/2.5 transition-all cursor-pointer group overflow-hidden">
                            <input type="file" onChange={(e) => handleFileUpload(e, setCompanyLogo)} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            {companyLogo ? (
                              <img src={companyLogo} alt="Logo" className="h-12 object-contain" />
                            ) : (
                              <p className="text-xs text-neutral-400 uppercase tracking-widest group-hover:text-neutral-200 transition-colors">Drop Brand Logo</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Primary Headshot</p>
                            <div className="relative w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-white/20 bg-white/2.5 transition-all cursor-pointer group overflow-hidden">
                              <input type="file" onChange={(e) => handleFileUpload(e, setAgentImage)} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              {agentImage ? (
                                <img src={agentImage} alt="Headshot" className="w-full h-full object-cover opacity-80" />
                              ) : (
                                <ImageIcon className="text-neutral-500 group-hover:text-neutral-300" size={24} />
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Architectural BG</p>
                            <div className="relative w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-white/20 bg-white/2.5 transition-all cursor-pointer group overflow-hidden">
                              <input type="file" multiple onChange={handleBgUpload} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              {bgImages.length > 0 ? (
                                <div className="flex w-full h-full">
                                  {bgImages.map((img, i) => <img key={i} src={img} alt={`Bg ${i}`} className="w-1/2 h-full object-cover border-r border-black" />)}
                                </div>
                              ) : (
                                <Upload className="text-neutral-500 group-hover:text-neutral-300" size={24} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Verification & Gaps */}
                    {currentStepId === 'verification' && (
                      <div className="space-y-6">
                        <div className="text-xs text-neutral-400 leading-relaxed font-light mb-4 flex items-center gap-2">
                          {isStreaming && <div className="w-2 h-2 rounded-full bg-[#d4af71] animate-pulse" />}
                          {isStreaming ? "Synthesizing portfolio data..." : "Review the extracted metrics and fill in any required communication gaps."}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Total Volume</label>
                            <input
                              type="text"
                              value={displayData?.metrics?.totalVolume || ""}
                              onChange={(e) => extractedData && setExtractedData({ ...extractedData, metrics: { ...extractedData.metrics, totalVolume: e.target.value } })}
                              className="w-full rounded-xl border border-white/10 bg-white/2.5 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-white/20"
                              disabled={isStreaming}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">Highest Deal</label>
                            <input
                              type="text"
                              value={displayData?.metrics?.highestDeal || ""}
                              onChange={(e) => extractedData && setExtractedData({ ...extractedData, metrics: { ...extractedData.metrics, highestDeal: e.target.value } })}
                              className="w-full rounded-xl border border-white/10 bg-white/2.5 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-white/20"
                              disabled={isStreaming}
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5 block">WhatsApp Direct Line</label>
                          <input
                            type="tel"
                            value={displayData?.contact?.whatsapp || ""}
                            onChange={(e) => extractedData && setExtractedData({ ...extractedData, contact: { ...extractedData.contact, whatsapp: e.target.value } })}
                            placeholder="+971 50 000 0000"
                            className="w-full rounded-xl border border-white/10 bg-white/2.5 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-white/20"
                            disabled={isStreaming}
                          />
                        </div>

                        {!isStreaming && (
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <label className="text-[9px] uppercase tracking-widest text-neutral-500 mb-3 block">Media & PR Reputation</label>
                            <div className="p-4 rounded-xl border border-[#d4af71]/30 bg-[#d4af71]/5 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-neutral-200">Public News Mentions</p>
                                <p className="text-xs text-neutral-500 mt-1">Scan the web for real news articles featuring this agent.</p>
                              </div>
                              <button
                                onClick={handleDiscoverPR}
                                disabled={isDiscoveringPR || isStreaming}
                                className="flex items-center gap-2 px-4 py-2 bg-[#d4af71] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#e0c393] transition-all disabled:opacity-50"
                              >
                                {isDiscoveringPR ? <div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" /> : <Globe size={14} />}
                                {isDiscoveringPR ? "Scanning Web..." : "Scan Now"}
                              </button>
                            </div>
                            {displayData?.mediaPresence && displayData.mediaPresence.length > 0 && (
                              <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                                <Check size={12} /> Successfully attached {displayData.mediaPresence.length} media mentions.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {currentStep > 0 && (
                    <button onClick={() => setCurrentStep(prev => prev - 1)} className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white transition-all">Back</button>
                  )}
                </div>

                <button onClick={handleNext} disabled={isProcessing || isStreaming || isDiscoveringPR || (currentStep === 0 && !sourceText && !cvFile && links.length === 0)} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-black cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:scale-100 px-8 py-4 w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isProcessing || isStreaming ? <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> {isStreaming ? "Synthesizing..." : "Processing..."}</> : <>{currentStepId === 'verification' ? "Finalize Profile" : "Continue"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1" /></>}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Render Full Site */}
      {isFinalOutput && extractedData && (
        <div className="absolute inset-0 w-full h-full z-100 bg-[#f9f6f1] overflow-y-auto">

          <div className="fixed top-0 left-0 right-0 bg-[#1A1A1A] border-b border-white/10 px-6 py-4 flex justify-between items-center z-110 shadow-xl">
            {isFromHistory ? (
              <button onClick={handleResetBuilder} className="text-white/50 hover:text-white cursor-pointer text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2">
                <X size={14} /> Close Archive
              </button>
            ) : (
              <div className="flex items-center gap-6">
                <button onClick={() => setCurrentStep(activeSteps.length - 1)} className="text-white/50 hover:text-white cursor-pointer text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2">
                  <X size={14} /> Back to Editor
                </button>
                {hasUnsavedChanges && (
                  <button onClick={saveToDatabase} disabled={isProcessing} className="text-[#d4af71] hover:text-[#e0c393] animate-pulse cursor-pointer text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2">
                    {isProcessing ? "Saving..." : <><Save size={14} /> Save Inline Edits</>}
                  </button>
                )}
              </div>
            )}

            {/* --- NEW: THEME TOGGLE --- */}
            {!isFromHistory && (
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
                <button
                  onClick={() => {
                    setExtractedData({ ...extractedData, theme: "theme1" });
                    setHasUnsavedChanges(true);
                  }}
                  className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-full transition-all duration-300 ${!extractedData?.theme || extractedData.theme === "theme1"
                    ? "bg-[#b8924a] text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                    }`}
                >
                  Classic UI
                </button>
                <button
                  onClick={() => {
                    setExtractedData({ ...extractedData, theme: "theme2" });
                    setHasUnsavedChanges(true);
                  }}
                  className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-full transition-all duration-300 ${extractedData?.theme === "theme2"
                    ? "bg-[#b8924a] text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                    }`}
                >
                  Modern UI
                </button>
              </div>
            )}

            <button onClick={handleCopyLink} className="px-6 py-2 bg-[#b8924a] cursor-pointer hover:bg-[#d4af71] text-white rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
              {isCopied ? <Check size={12} /> : <Share2 size={12} />}
              {isCopied ? "Copied" : "Copy Share Link"}
            </button>
          </div>

          <div className="pt-17">
            {/* THEME 1: CLASSIC UI (Default) */}
            {(!extractedData.theme || extractedData.theme === "theme1") && (
              <div className="theme-classic">
                <header className="w-full bg-[#f9f6f1] py-2 flex items-center justify-center border-b border-[#e0d8cc]/60 relative z-50">
                  {extractedData.companyLogo ? (
                    <img src={extractedData.companyLogo} alt="Brokerage Logo" className="h-18 md:h-28 object-contain mix-blend-multiply opacity-90" />
                  ) : (
                    <h2 className="font-serif text-xl tracking-[0.35em] uppercase text-[#b8924a] font-light">Exclusive Partner</h2>
                  )}
                </header>

                {extractedData.hero && (
                  <AgentHero data={extractedData.hero} isEditable={!isFromHistory} onUpdate={(field, value) => { setExtractedData({ ...extractedData, hero: { ...extractedData.hero, [field]: value } }); setHasUnsavedChanges(true); }} />
                )}

                {extractedData.metrics && (
                  <AgentMetrics
                    data={extractedData.metrics}
                    isEditable={!isFromHistory}
                    onUpdate={(field, value) => {
                      setExtractedData({ ...extractedData, metrics: { ...extractedData.metrics, [field]: value } });
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                {extractedData.timeline && (
                  <AgentTimeline
                    timeline={extractedData.timeline}
                    isEditable={!isFromHistory}
                    onUpdate={(field, value) => {
                      setExtractedData({ ...extractedData, [field]: value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                {extractedData.expertise && (
                  <AgentExpertise
                    data={extractedData.expertise}
                    isEditable={!isFromHistory}
                    onUpdate={(field, value) => {
                      setExtractedData({ ...extractedData, expertise: { ...extractedData.expertise, [field]: value } });
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                <AgentPartnerships data={extractedData.partnerships} isEditable={!isFromHistory} onUpdate={(field: string, value: any) => { setExtractedData({ ...extractedData, [field]: value }); setHasUnsavedChanges(true); }} />
                <AgentMedia data={extractedData.mediaPresence} isEditable={!isFromHistory} onUpdate={(field: string, value: any) => { setExtractedData({ ...extractedData, [field]: value }); setHasUnsavedChanges(true); }} />
                <AgentTestimonials data={extractedData.testimonials} isEditable={!isFromHistory} onUpdate={(field: string, value: any) => { setExtractedData({ ...extractedData, [field]: value }); setHasUnsavedChanges(true); }} />

                {extractedData.contact && (
                  <AgentContact agentId={extractedData.id} agentName={extractedData.hero?.name || "Agent"} whatsapp={extractedData.contact?.whatsapp} />
                )}
              </div>
            )}

            {/* THEME 2: MODERN UI */}
            {extractedData.theme === "theme2" && (
              <div className="theme-modern">
                <header className="w-full bg-[#f9f6f1] py-2 flex items-center justify-center border-b border-[#e0d8cc]/60 relative z-50">
                  {extractedData.companyLogo ? (
                    <img src={extractedData.companyLogo} alt="Brokerage Logo" className="h-18 md:h-28 object-contain mix-blend-multiply opacity-90" />
                  ) : (
                    <h2 className="font-serif text-xl tracking-[0.35em] uppercase text-[#b8924a] font-light">Exclusive Partner</h2>
                  )}
                </header>

                {extractedData.hero && (
                  <AgentHeroVersionTwo data={extractedData.hero} isEditable={!isFromHistory} onUpdate={(field, value) => { setExtractedData({ ...extractedData, hero: { ...extractedData.hero, [field]: value } }); setHasUnsavedChanges(true); }} />
                )}

                {extractedData.metrics && (
                  <AgentMetricsVersionTwo
                    data={extractedData.metrics}
                    isEditable={!isFromHistory}
                    onUpdate={(field, value) => {
                      setExtractedData({ ...extractedData, metrics: { ...extractedData.metrics, [field]: value } });
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                {extractedData.timeline && (
                  <AgentTimelineVersionTwo
                    timeline={extractedData.timeline}
                    isEditable={!isFromHistory}
                    onUpdate={(field, value) => {
                      setExtractedData({ ...extractedData, [field]: value });
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                {extractedData.expertise && (
                  <AgentExpertiseVersionTwo
                    data={extractedData.expertise}
                    isEditable={!isFromHistory}
                    onUpdate={(field, value) => {
                      setExtractedData({ ...extractedData, expertise: { ...extractedData.expertise, [field]: value } });
                      setHasUnsavedChanges(true);
                    }}
                  />
                )}

                <AgentPartnershipsVersionTwo data={extractedData.partnerships} isEditable={!isFromHistory} onUpdate={(field: string, value: any) => { setExtractedData({ ...extractedData, [field]: value }); setHasUnsavedChanges(true); }} />
                <AgentMediaVersionTwo data={extractedData.mediaPresence} isEditable={!isFromHistory} onUpdate={(field: string, value: any) => { setExtractedData({ ...extractedData, [field]: value }); setHasUnsavedChanges(true); }} />
                <AgentTestimonialsVersionTwo data={extractedData.testimonials} isEditable={!isFromHistory} onUpdate={(field: string, value: any) => { setExtractedData({ ...extractedData, [field]: value }); setHasUnsavedChanges(true); }} />

                {extractedData.contact && (
                  <AgentContactVersionTwo agentId={extractedData.id} agentName={extractedData.hero?.name || "Agent"} whatsapp={extractedData.contact?.whatsapp} />
                )}
              </div>
            )}

            <AgentListings
              data={extractedData.listings}
              brokerName={extractedData.contact?.developer}
            />

            <BrokerageFooter
              brokerName={extractedData.contact?.developer || ""}
              logoUrl={extractedData.companyLogo}
            />
          </div>
        </div>
      )}
    </div>
  );
}