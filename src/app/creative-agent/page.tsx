/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, UploadCloud, Image as ImageIcon, CheckCircle, Loader2, LayoutTemplate, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CreativeAgentBuilder() {
  // 1. Form State
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('real_estate');
  const [usps, setUsps] = useState('');
  const [campaignData, setCampaignData] = useState<Record<string, string>>({});

  // 2. File State
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // 3. System State
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [finalCreative, setFinalCreative] = useState<any>(null);

  // Helper: Upload file to our Next.js Proxy -> Strapi
  // Helper: Upload file to our Next.js Proxy -> Strapi
  const uploadToStrapi = async (file: File, folderId: number) => {
    const formData = new FormData();
    formData.append('files', file);

    // Append the routing instruction for Strapi
    formData.append('fileInfo', JSON.stringify({ folder: folderId }));

    const res = await fetch('/api/strapi-upload', { method: 'POST', body: formData });

    if (!res.ok) throw new Error('Upload failed');

    const data = await res.json();
    return data[0].id; // Return Strapi Media ID
  };

  const handleGenerate = async () => {
    if (!brandName || !bgFile) return alert("Brand Name and Background Image are required.");

    try {
      setIsGenerating(true);
      setFinalCreative(null);
      setStatusText('Uploading raw assets to secure vault...');

      // Plug in your actual Strapi Folder IDs here
      const BACKGROUND_FOLDER_ID = 4;
      const LOGO_FOLDER_ID = 3;

      // 1. Upload files directly to their respective folders
      const bgId = await uploadToStrapi(bgFile, BACKGROUND_FOLDER_ID);
      const logoId = logoFile ? await uploadToStrapi(logoFile, LOGO_FOLDER_ID) : null;

      // 2. Trigger Generation API
      setStatusText('Briefing AI Art Director...');
      const splitUsps = usps.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/creative-agent/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: brandName,
          category,
          usps: splitUsps,
          campaign_data: campaignData,
          logo_id: logoId,
          background_image_id: bgId,
        })
      });

      const { documentId } = await res.json();
      if (!documentId) throw new Error("Failed to get Document ID");

      // 3. Start Polling
      setStatusText('Satori Engine rendering pixels...');
      pollForCompletion(documentId);

    } catch (error) {
      console.error(error);
      alert("Something went wrong during generation.");
      setIsGenerating(false);
    }
  };

  const pollForCompletion = (documentId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/creative-agent/${documentId}`);
        const data = await res.json();

        if (data.report_status === 'draft' || data.report_status === 'published') {
          clearInterval(interval);
          setFinalCreative(data);
          setStatusText('Creative Generated Successfully!');
          setIsGenerating(false);
        } else if (data.report_status === 'failed') {
          clearInterval(interval);
          setStatusText('Generation failed. Please try again.');
          setIsGenerating(false);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000); // Check every 3 seconds
  };

  // Dynamic input handler
  const handleCampaignDataChange = (key: string, value: string) => {
    setCampaignData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#fcfcfb] font-jost text-neutral-900 selection:bg-[#b8924a]/20">
      {/* Top Navigation */}
      <nav className="w-full bg-[#fcfcfb] border-b border-neutral-200 md:border-neutral-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#14181F]/10 bg-white">
            <Image
              src="/riwa-logo-transparent.png"
              alt="RIWAA"
              width={30}
              height={30}
            />
          </div>

          <div className="leading-none hidden md:block">
            <p className="text-[15px] font-medium tracking-[0.22em] text-[#14181F]">
              RIWAA
            </p>
            <p className="mt-1 font-jost text-[9px] uppercase tracking-[0.22em] text-[#565C6B]">
              powered by
            </p>
          </div>

          <div className="mx-2 h-8 w-px bg-[#14181F]/15 hidden md:block" />

          <Image
            src="/solvetude-logo.png"
            alt="Solvetude"
            width={100}
            height={30}
            className="object-contain hidden md:block"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/creative-agent/history"
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
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
            {/* Core Details */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Brand / Project Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Prestige One Developments"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a] transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Industry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a] transition-all appearance-none"
                >
                  <option value="real_estate">Real Estate & Property</option>
                  <option value="saas">SaaS & Software</option>
                  <option value="ecommerce">E-Commerce & Retail</option>
                  <option value="service">Service Business</option>
                </select>
              </div>
            </div>

            {/* Dynamic Campaign Data */}
            <div className="p-5 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <LayoutTemplate size={14} className="text-[#b8924a]" /> Dynamic Parameters
              </h3>

              {category === 'real_estate' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 block">Location</label>
                    <input type="text" onChange={(e) => handleCampaignDataChange('location', e.target.value)} placeholder="e.g. Dubai Marina" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 block">Starting Price</label>
                    <input type="text" onChange={(e) => handleCampaignDataChange('starting_price', e.target.value)} placeholder="e.g. AED 1.2M" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs" />
                  </div>
                </div>
              )}

              {category === 'saas' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 block">Monthly Price</label>
                    <input type="text" onChange={(e) => handleCampaignDataChange('price', e.target.value)} placeholder="e.g. $29/mo" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 block">Trial Offer</label>
                    <input type="text" onChange={(e) => handleCampaignDataChange('trial', e.target.value)} placeholder="e.g. 14-Day Free Trial" className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs" />
                  </div>
                </div>
              )}
            </div>

            {/* USPs */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">Unique Selling Propositions</label>
              <textarea
                value={usps}
                onChange={(e) => setUsps(e.target.value)}
                placeholder="Comma separated (e.g. Post-Handover Payment, Smart Home, Beach Access)"
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] min-h-20 resize-none"
              />
            </div>

            {/* Inside your Campaign Brief section in page.tsx */}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 block">
                Art Director Instructions (Optional)
              </label>
              <textarea
                onChange={(e) => handleCampaignDataChange('design_instructions', e.target.value)}
                placeholder="e.g., 'Put the logo in the top right. Focus the headline on post-handover payments. Place text at the bottom left.'"
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#b8924a] min-h-[100px] resize-none"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Tell the Riwaa exactly where to place elements and what the core message should be.</p>
            </div>

            {/* Asset Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white hover:bg-neutral-50 cursor-pointer relative overflow-hidden group">
                <input type="file" accept="image/*" onChange={(e) => setBgFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {bgFile ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <ImageIcon className="text-neutral-400 mb-2 group-hover:text-[#b8924a] transition-colors" size={24} />}
                <span className="text-xs font-medium text-neutral-700">{bgFile ? 'Background Selected' : 'Upload Background'}</span>
                <span className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">Required</span>
              </div>

              <div className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-white hover:bg-neutral-50 cursor-pointer relative overflow-hidden group">
                <input type="file" accept="image/png, image/svg+xml" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {logoFile ? <CheckCircle className="text-green-500 mb-2" size={24} /> : <UploadCloud className="text-neutral-400 mb-2 group-hover:text-[#b8924a] transition-colors" size={24} />}
                <span className="text-xs font-medium text-neutral-700">{logoFile ? 'Logo Selected' : 'Upload Transparent Logo'}</span>
                <span className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">Optional</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#050505] hover:bg-black text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold uppercase tracking-widest text-xs transition-all shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-[#b8924a]" />}
              {isGenerating ? 'Processing...' : 'Generate Master Creative'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output & Preview */}
        <div className="lg:col-span-7 bg-neutral-100/50 rounded-4xl border border-neutral-100 p-8 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">

          <AnimatePresence mode="wait">
            {/* STATE 1: Idle */}
            {!isGenerating && !finalCreative && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <LayoutTemplate size={24} className="text-neutral-300" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Awaiting Brief</h3>
                <p className="text-xs text-neutral-500 mt-1">Configure your parameters to start generation.</p>
              </motion.div>
            )}

            {/* STATE 2: Loading / Polling */}
            {isGenerating && (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-neutral-200 rounded-full border-t-[#b8924a] animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#b8924a]" size={24} />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mt-6 animate-pulse">{statusText}</h3>
              </motion.div>
            )}

            {/* STATE 3: Final Output */}
            {!isGenerating && finalCreative && (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">

                {/* Image Showcase */}
                <div className="w-full max-w-[400px] aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 relative group">
                  {/* Since Strapi returns relative URLs for media, prefix with your Strapi URL */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338'}${finalCreative.generated_creatives?.feed_square}`}
                    alt="Final Creative"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338'}${finalCreative.generated_creatives?.feed_square}`} download target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#b8924a] hover:text-white transition-colors">
                      Download PNG
                    </a>
                  </div>
                </div>

                {/* AI Copy Reveal */}
                <div className="mt-8 bg-white p-5 rounded-2xl border border-neutral-100 w-full max-w-100 shadow-sm">
                  <p className="text-[9px] uppercase tracking-widest text-[#b8924a] font-bold mb-3">Riwaa Copywriting Output</p>
                  <p className="text-sm font-semibold text-neutral-900 leading-tight mb-2">&quot;{finalCreative.ai_copy?.headline}&quot;</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">CTA: {finalCreative.ai_copy?.cta}</p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}