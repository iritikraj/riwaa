/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, CheckCircle, Loader2, LayoutTemplate, Clock, Moon, Sun, FolderOpen, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const BACKGROUND_FOLDER_ID = 4
const LOGO_FOLDER_ID = 3;

export default function CreativeAgentBuilder() {
  // 1. Form State
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('real_estate');
  const [usps, setUsps] = useState('');
  const [campaignData, setCampaignData] = useState<Record<string, string>>({});

  // 2. Asset Mode & Library State
  const [assetMode, setAssetMode] = useState<'upload' | 'library'>('library');
  const [libraryBackgrounds, setLibraryBackgrounds] = useState<any[]>([]);
  const [libraryLogos, setLibraryLogos] = useState<any[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  // 3. Selection State (Files for Upload vs IDs for Existing)
  const [bgFiles, setBgFiles] = useState<File[]>([]);
  const [selectedBgIds, setSelectedBgIds] = useState<number[]>([]);

  const [logoLightFile, setLogoLightFile] = useState<File | null>(null);
  const [selectedLogoLightId, setSelectedLogoLightId] = useState<number | null>(null);

  const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
  const [selectedLogoDarkId, setSelectedLogoDarkId] = useState<number | null>(null);

  // 4. System State
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [finalCreative, setFinalCreative] = useState<any>(null);

  // Fetch Strapi Library Assets
  useEffect(() => {
    if (assetMode === 'library') {
      const fetchLibrary = async () => {
        setIsLoadingLibrary(true);
        try {
          const [bgRes, logoRes] = await Promise.all([
            fetch(`/api/strapi-upload?folder=${BACKGROUND_FOLDER_ID}`),
            fetch(`/api/strapi-upload?folder=${LOGO_FOLDER_ID}`)
          ]);
          setLibraryBackgrounds(await bgRes.json());
          setLibraryLogos(await logoRes.json());
        } catch (error) {
          console.error("Failed to load media library", error);
        } finally {
          setIsLoadingLibrary(false);
        }
      };
      fetchLibrary();
    }
  }, [assetMode]);

  // Helper: Upload file to our Next.js Proxy -> Strapi
  const uploadToStrapi = async (file: File, folderId: number) => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('fileInfo', JSON.stringify({ folder: folderId }));

    const res = await fetch('/api/strapi-upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data[0].id;
  };

  const handleGenerate = async () => {
    const totalBgs = bgFiles.length + selectedBgIds.length;
    if (!brandName || totalBgs === 0) return alert("Brand Name and at least one Background Image are required.");

    try {
      setIsGenerating(true);
      setFinalCreative(null);
      setStatusText('Processing assets...');

      // 1. Upload new files if present, otherwise use selected IDs
      const bgUploadPromises = bgFiles.map(file => uploadToStrapi(file, BACKGROUND_FOLDER_ID));
      const newlyUploadedBgIds = await Promise.all(bgUploadPromises);
      const finalBgIds = [...selectedBgIds, ...newlyUploadedBgIds]; // Merge existing with new

      const finalLightId = logoLightFile ? await uploadToStrapi(logoLightFile, LOGO_FOLDER_ID) : selectedLogoLightId;
      const finalDarkId = logoDarkFile ? await uploadToStrapi(logoDarkFile, LOGO_FOLDER_ID) : selectedLogoDarkId;

      // 2. Trigger Generation API
      setStatusText('Dispatching Swarm to AI Art Directors...');
      const splitUsps = usps.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/creative-agent/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: brandName,
          category,
          usps: splitUsps,
          campaign_data: campaignData,
          logo_light_id: finalLightId,
          logo_dark_id: finalDarkId,
          background_image_ids: finalBgIds,
        })
      });

      const { documentId, expectedCount } = await res.json();
      if (!documentId) throw new Error("Failed to get Document ID");

      // 3. Start Polling
      pollForCompletion(documentId, expectedCount);

    } catch (error) {
      console.error(error);
      alert("Something went wrong during generation.");
      setIsGenerating(false);
    }
  };

  const pollForCompletion = (documentId: string, expectedCount: number) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/creative-agent/${documentId}`);
        const data = await res.json();
        const currentVariations = data.generated_creatives?.variations || [];

        setFinalCreative(data);

        if (data.report_status === 'failed') {
          clearInterval(interval);
          setStatusText('Generation failed. Please try again.');
          setIsGenerating(false);
          return;
        }

        if (currentVariations.length === expectedCount) {
          clearInterval(interval);
          setStatusText('Creatives Generated Successfully!');
          setIsGenerating(false);
        } else {
          setStatusText(`Rendering pixels... (${currentVariations.length}/${expectedCount} ready)`);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
  };

  const toggleBgSelection = (id: number) => {
    setSelectedBgIds(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const handleCampaignDataChange = (key: string, value: string) => {
    setCampaignData(prev => ({ ...prev, [key]: value }));
  };

  const STRAPI_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : 'http://localhost:1337'; // Update prod URL
  const variationsCount = finalCreative?.generated_creatives?.variations?.length || 0;
  const isIdle = !isGenerating && variationsCount === 0;
  const isInitialLoading = isGenerating && variationsCount === 0;
  const hasPartialOrFullResults = variationsCount > 0;
  const totalSelectedBgs = bgFiles.length + selectedBgIds.length;

  return (
    <div className="min-h-screen bg-[#fcfcfb] font-jost text-neutral-900 selection:bg-[#b8924a]/20">
      {/* Top Navigation */}
      <nav className="w-full bg-[#fcfcfb] border-b border-neutral-200 md:border-neutral-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#14181F]/10 bg-white">
            <Image src="/riwa-logo-transparent.png" alt="RIWAA" width={30} height={30} />
          </div>
          <div className="leading-none hidden md:block">
            <p className="text-[15px] font-medium tracking-[0.22em] text-[#14181F]">RIWAA</p>
            <p className="mt-1 font-jost text-[9px] uppercase tracking-[0.22em] text-[#565C6B]">powered by</p>
          </div>
          <div className="mx-2 h-8 w-px bg-[#14181F]/15 hidden md:block" />
          <Image src="/solvetude-logo.png" alt="Solvetude" width={100} height={30} className="object-contain hidden md:block" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/creative-agent/history" className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2">
            <Clock size={14} className="text-white" /> Archives
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: The Brief Builder */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h2 className="text-3xl font-light mb-2">Campaign <span className="font-medium text-[#b8924a]">Brief</span></h2>
            <p className="text-sm text-neutral-500 font-light">Supply the AI with the core brand assets and marketing parameters.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Brand / Project Name</label>
                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Prestige One" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Industry Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a] transition-all appearance-none">
                  <option value="real_estate">Real Estate & Property</option>
                  <option value="saas" disabled>SaaS & Software</option>
                </select>
              </div>
            </div>

            <div className="p-5 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <LayoutTemplate size={14} className="text-[#b8924a]" /> Additional Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 block">Location</label>
                  <input type="text" onChange={(e) => setCampaignData(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Dubai Marina" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 block">Starting Price</label>
                  <input type="text" onChange={(e) => setCampaignData(p => ({ ...p, starting_price: e.target.value }))} placeholder="e.g. AED 1.2M" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Unique Selling Propositions</label>
              <textarea value={usps} onChange={(e) => setUsps(e.target.value)} placeholder="Comma separated (e.g. Post-Handover Payment, Smart Home)" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] min-h-20 resize-none" />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Art Director Instructions (Optional)</label>
              <textarea onChange={(e) => handleCampaignDataChange('design_instructions', e.target.value)} placeholder="e.g., 'Put the logo in the top right. Focus the headline on post-handover payments.'" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] min-h-25 resize-none" />
            </div>

            {/* Smart Asset Uploads & Selection */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 block">Brand Assets</label>
                <div className="flex bg-neutral-100 p-1 rounded-lg">
                  <button onClick={() => setAssetMode('library')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5 transition-colors ${assetMode === 'library' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>
                    <FolderOpen size={12} /> Library
                  </button>
                  <button onClick={() => setAssetMode('upload')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1.5 transition-colors ${assetMode === 'upload' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>
                    <Upload size={12} /> Upload New
                  </button>
                </div>
              </div>
              {/* UPLOAD MODE */}
              {assetMode === 'upload' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white hover:bg-neutral-50 cursor-pointer relative overflow-hidden group">
                    <input type="file" multiple accept="image/jpeg, image/png" onChange={(e) => setBgFiles(Array.from(e.target.files || []))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {bgFiles.length > 0 ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <ImageIcon className="text-neutral-400 mb-2 group-hover:text-[#b8924a] transition-colors" size={24} />}
                    <span className="text-xs font-medium text-neutral-700">{bgFiles.length > 0 ? `${bgFiles.length} Renders Selected` : 'Select Multiple Building Renders'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-[#14181F] cursor-pointer relative group">
                      <input type="file" accept="image/png, image/svg+xml" onChange={(e) => setLogoLightFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {logoLightFile ? <CheckCircle className="text-green-400 mb-2" size={20} /> : <Sun className="text-white/60 mb-2 group-hover:text-white" size={20} />}
                      <span className="text-[10px] font-medium text-white">{logoLightFile ? 'Selected' : 'Light Logo'}</span>
                    </div>
                    <div className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white cursor-pointer relative group">
                      <input type="file" accept="image/png, image/svg+xml" onChange={(e) => setLogoDarkFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {logoDarkFile ? <CheckCircle className="text-green-500 mb-2" size={20} /> : <Moon className="text-neutral-400 mb-2 group-hover:text-black" size={20} />}
                      <span className="text-[10px] font-medium text-neutral-700">{logoDarkFile ? 'Selected' : 'Dark Logo'}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LIBRARY MODE */}
              {assetMode === 'library' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {isLoadingLibrary ? (
                    <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-neutral-400" /></div>
                  ) : (
                    <>
                      {/* Background Library */}
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Select Backgrounds ({selectedBgIds.length})</label>
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                          {libraryBackgrounds.map(img => (
                            <div key={img.id} onClick={() => toggleBgSelection(img.id)} className={`aspect-square rounded-xl cursor-pointer overflow-hidden border-2 transition-all relative ${selectedBgIds.includes(img.id) ? 'border-[#b8924a] shadow-md' : 'border-transparent hover:border-neutral-300'}`}>
                              <img src={`${STRAPI_BASE}${img.formats?.small?.url || img.url}`} className="w-full h-full object-cover" />
                              {selectedBgIds.includes(img.id) && <div className="absolute inset-0 bg-[#b8924a]/20 flex items-center justify-center"><CheckCircle className="text-white drop-shadow-md" size={16} /></div>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Logo Library */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Select Light Logo</label>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-[#14181F] rounded-xl">
                            {libraryLogos.map(img => (
                              <div key={img.id} onClick={() => setSelectedLogoLightId(img.id === selectedLogoLightId ? null : img.id)} className={`aspect-square rounded-lg cursor-pointer overflow-hidden border-2 p-2 flex items-center justify-center ${selectedLogoLightId === img.id ? 'border-green-400 bg-white/10' : 'border-transparent hover:border-white/20 bg-gray-400'}`}>
                                <img src={`${STRAPI_BASE}${img.url}`} className="max-w-full max-h-full object-contain" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Select Dark Logo</label>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-neutral-100 rounded-xl">
                            {libraryLogos.map(img => (
                              <div key={img.id} onClick={() => setSelectedLogoDarkId(img.id === selectedLogoDarkId ? null : img.id)} className={`aspect-square rounded-lg cursor-pointer overflow-hidden border-2 p-2 flex items-center justify-center ${selectedLogoDarkId === img.id ? 'border-[#b8924a] bg-white' : 'border-transparent hover:border-neutral-300 bg-gray-300'}`}>
                                <img src={`${STRAPI_BASE}${img.url}`} className="max-w-full max-h-full object-contain" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || totalSelectedBgs === 0}
              className="w-full bg-[#050505] hover:bg-black text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-[#b8924a]" />}
              {isGenerating ? 'Processing...' : `Generate Batch (${totalSelectedBgs} Renders)`}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output & Preview */}
        <div className="lg:col-span-7 bg-neutral-100/50 rounded-4xl border border-neutral-100 p-8 flex flex-col items-center justify-center min-h-150 relative overflow-hidden">
          <AnimatePresence mode="wait">

            {isIdle && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <LayoutTemplate size={24} className="text-neutral-300" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Awaiting Brief</h3>
                <p className="text-xs text-neutral-500 mt-1">Configure your parameters to start swarm generation.</p>
              </motion.div>
            )}

            {isInitialLoading && (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-neutral-200 rounded-full border-t-[#b8924a] animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#b8924a]" size={24} />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mt-6 animate-pulse">{statusText}</h3>
              </motion.div>
            )}

            {hasPartialOrFullResults && (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col">
                {isGenerating && (
                  <div className="mb-6 flex items-center justify-center gap-2 bg-white border border-neutral-200 py-2 px-4 rounded-full shadow-sm mx-auto animate-pulse">
                    <Loader2 size={14} className="animate-spin text-[#b8924a]" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-700">{statusText}</span>
                  </div>
                )}

                <div className="mb-8 bg-white p-5 rounded-2xl border border-neutral-100 w-full shadow-sm text-center">
                  <p className="text-[9px] uppercase tracking-widest text-[#b8924a] font-bold mb-3">AI Copywriting Output</p>
                  <p className="text-sm font-semibold text-neutral-900 leading-tight mb-2">&quot;{finalCreative.ai_copy?.headline || 'Analyzing layout for copy...'}&quot;</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {finalCreative.generated_creatives.variations.map((url: string, index: number) => (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={index} className="w-full aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200 relative group">
                      <img src={`${STRAPI_BASE}${url}`} alt={`Variation ${index + 1}`} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm gap-3">
                        <a href={`${STRAPI_BASE}${url}`} download target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#b8924a] hover:text-white transition-colors">
                          Download
                        </a>
                      </div>
                    </motion.div>
                  ))}

                  {isGenerating && Array.from({ length: Math.max(0, totalSelectedBgs - variationsCount) }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="w-full aspect-square bg-neutral-200/50 rounded-2xl border border-neutral-200 relative overflow-hidden animate-pulse flex items-center justify-center">
                      <Loader2 size={24} className="text-neutral-400 animate-spin" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}