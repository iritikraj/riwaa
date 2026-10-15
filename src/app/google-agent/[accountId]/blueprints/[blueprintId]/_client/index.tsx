/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Layers, UploadCloud, Hash, Link as LinkIcon } from 'lucide-react';

export default function BlueprintStudioClient({
  accountId,
  blueprintId,
  initialBlueprint,
  status,
}: {
  accountId: string;
  blueprintId: string;
  initialBlueprint: any;
  status: string;
}) {
  const [blueprint, setBlueprint] = useState(initialBlueprint);
  const [selectedAdGroupIdx, setSelectedAdGroupIdx] = useState(0);
  const [selectedAdIdx, setSelectedAdIdx] = useState(0); // Added back the Ad Index state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [urlError, setUrlError] = useState(false);

  if (!blueprint) {
    return <div className="p-8 text-center text-[#565C6B]">No active blueprint data provided.</div>;
  }

  const activeAdGroup = blueprint.ad_groups?.[selectedAdGroupIdx] || blueprint.ad_groups?.[0];
  const isAdsArray = Array.isArray(activeAdGroup?.ads);

  // Safely extract the exact ad variation we want to look at
  const activeAd = isAdsArray ? activeAdGroup?.ads?.[selectedAdIdx] : activeAdGroup?.ads;

  const handleHeadlineChange = (idx: number, value: string) => {
    const updated = { ...blueprint };
    if (isAdsArray) {
      updated.ad_groups[selectedAdGroupIdx].ads[selectedAdIdx].headlines[idx] = value;
    } else {
      updated.ad_groups[selectedAdGroupIdx].ads.headlines[idx] = value;
    }
    setBlueprint(updated);
  };

  const handleDescriptionChange = (idx: number, value: string) => {
    const updated = { ...blueprint };
    if (isAdsArray) {
      updated.ad_groups[selectedAdGroupIdx].ads[selectedAdIdx].descriptions[idx] = value;
    } else {
      updated.ad_groups[selectedAdGroupIdx].ads.descriptions[idx] = value;
    }
    setBlueprint(updated);
  };

  const handleFinalUrlChange = (value: string) => {
    setBlueprint({ ...blueprint, final_url: value });
    if (value.trim()) setUrlError(false);
  };

  const handleDeploy = async () => {
    if (!blueprint.final_url || !blueprint.final_url.trim()) {
      setUrlError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsDeploying(true);
    try {
      const res = await fetch(`/api/google-agent/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, blueprintId, blueprint }),
      });
      if (res.ok) setDeploySuccess(true);
    } catch (err) {
      console.error('Deployment error:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out space-y-8 pb-24 font-jost text-[#14181F]">

      {/* Top Navigation & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#14181F]/5 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/google-agent/${accountId}/blueprints`}
            className="h-10 w-10 rounded-full bg-white border border-[#14181F]/10 flex items-center justify-center hover:bg-[#FCFBF8] transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#9C7A3C] uppercase">
                Campaign Approval Studio
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${status === 'pending_approval' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-medium font-jost uppercase">
              {blueprint.campaign_theme}
            </h1>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          disabled={isDeploying || deploySuccess}
          className="flex items-center gap-2 bg-[#9C7A3C] hover:bg-[#8A6B34] text-white px-6 py-3 rounded-full text-[13px] font-semibold tracking-wider uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          {deploySuccess ? (
            <><CheckCircle2 size={16} /> Deployed to Google Ads</>
          ) : isDeploying ? (
            'Deploying Campaign...'
          ) : (
            <><UploadCloud size={16} /> Publish to Google Ads</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ad Group Selector & SERP Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#14181F]/10 p-6 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#14181F]/50 block mb-3">
              Ad Groups ({blueprint.ad_groups?.length || 0})
            </span>
            <div className="space-y-2">
              {blueprint.ad_groups?.map((group: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAdGroupIdx(idx);
                    setSelectedAdIdx(0); // Reset variation tab to the first one on ad group change
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${selectedAdGroupIdx === idx
                    ? 'bg-[#FCFBF8] border-[#9C7A3C] shadow-sm'
                    : 'border-[#14181F]/5 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={16} className={selectedAdGroupIdx === idx ? 'text-[#9C7A3C]' : 'text-[#14181F]/40'} />
                    <div>
                      <p className="text-[13px] font-semibold text-[#14181F]">{group.name}</p>
                      <p className="text-[11px] text-[#565C6B]">{group.keywords?.length || 0} keywords</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Google Search Live SERP Mockup */}
          <div className="bg-white rounded-3xl border border-[#14181F]/10 p-6 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#14181F]/50 block mb-4">
              Live SERP Simulation
            </span>
            <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold text-gray-900 border border-gray-400 px-1 rounded">
                  Sponsored
                </span>
                <span className="text-[12px] text-gray-600 truncate">Example.com</span>
              </div>
              <h3 className="text-[17px] text-[#1A0DAB] hover:underline font-normal cursor-pointer leading-snug">
                {activeAd?.headlines?.slice(0, 3).join(' | ')}
              </h3>
              <p className="text-[13px] text-[#4D5156] mt-1.5 leading-relaxed">
                {activeAd?.descriptions?.[0]}
              </p>

              {/* Sitelinks Mockup */}
              {blueprint.sitelinks && blueprint.sitelinks.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-200">
                  {blueprint.sitelinks.slice(0, 4).map((link: any, i: number) => (
                    <div key={i}>
                      <a href="#" className="text-[13px] text-[#1A0DAB] hover:underline font-medium">{link.linkText}</a>
                      <p className="text-[11px] text-[#4D5156]">{link.description1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Keyword Target List */}
          <div className="bg-white rounded-3xl border border-[#14181F]/10 p-6 md:p-8 shadow-sm">
            <h3 className="text-[14px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Hash size={16} className="text-[#9C7A3C]" />
              Configured Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeAdGroup?.keywords?.map((kw: string, i: number) => (
                <div key={i} className="bg-[#FCFBF8] border border-[#14181F]/10 px-3 py-1.5 rounded-full text-[12px] flex items-center gap-2">
                  <span className="font-medium text-[#14181F]">{kw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Copy Editor & Keyword Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {/* Campaign Settings (Final URL) */}
          <div className={`bg-white rounded-3xl border p-6 md:p-8 shadow-sm transition-colors ${urlError ? 'border-red-500/50 bg-red-50/10' : 'border-[#14181F]/10'}`}>
            <h3 className="text-[14px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <LinkIcon size={16} className={urlError ? 'text-red-500' : 'text-[#9C7A3C]'} />
              Campaign Destination
            </h3>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#14181F]/60 block mb-2">
                Final URL (Landing Page) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                placeholder="https://your-domain.com/landing-page"
                value={blueprint.final_url || ''}
                onChange={(e) => handleFinalUrlChange(e.target.value)}
                className={`w-full bg-[#FCFBF8] border rounded-xl px-4 py-2.5 text-[13px] outline-none transition-colors ${urlError
                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                  : 'border-[#14181F]/10 focus:border-[#9C7A3C]'
                  }`}
              />
              {urlError && (
                <p className="text-red-500 text-[11px] font-bold tracking-wide uppercase mt-2">
                  Final URL is required to publish this campaign.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#14181F]/10 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-6">
              <div>
                <h3 className="text-[14px] uppercase tracking-widest font-bold">
                  Responsive Search Ad (RSA) Copy
                </h3>
                <p className="text-[12px] text-[#565C6B]">
                  Character counters enforce Google Ads specifications.
                </p>
              </div>
            </div>

            {/* Ad Variation Tabs */}
            {isAdsArray && activeAdGroup?.ads?.length > 1 && (
              <div className="flex items-center gap-1 mb-8 bg-[#FCFBF8] p-1.5 rounded-full border border-[#14181F]/5 w-fit">
                {activeAdGroup.ads.map((ad: any, i: number) => {
                  const isActive = selectedAdIdx === i;

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedAdIdx(i)}
                      className={`relative px-4 py-2 rounded-full cursor-pointer text-[12px] font-bold transition-colors outline-none ${isActive ? 'text-[#9C7A3C]' : 'text-[#565C6B] hover:text-[#14181F]'
                        }`}
                    >
                      {/* The animated sliding background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeVariationTab"
                          className="absolute inset-0 bg-white shadow-sm border border-[#14181F]/10 rounded-full"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}

                      {/* The text sits above the animated background */}
                      <span className="relative z-10">
                        {ad.variation_name || `Variation ${i + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Headlines */}
            <div className="space-y-4 mb-6">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#14181F]/60 flex items-center justify-between">
                <span>Headlines (Max 30 characters)</span>
                <span className="text-[#9C7A3C] font-mono">{activeAd?.headlines?.length || 0}</span>
              </label>
              <div className="space-y-2.5">
                {activeAd?.headlines?.map((headline: string, i: number) => {
                  const isOver = headline.length > 30;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-[#565C6B] w-5 text-right">{i + 1}</span>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => handleHeadlineChange(i, e.target.value)}
                        className={`flex-1 bg-[#FCFBF8] border rounded-xl px-3.5 py-2 text-[13px] outline-none transition-colors ${isOver ? 'border-red-500 bg-red-50/20' : 'border-[#14181F]/10 focus:border-[#9C7A3C]'
                          }`}
                      />
                      <span className={`text-[11px] font-mono w-10 text-right ${isOver ? 'text-red-500 font-bold' : 'text-[#565C6B]'}`}>
                        {headline.length}/30
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#14181F]/60 flex items-center justify-between">
                <span>Descriptions (Max 90 characters)</span>
                <span className="text-[#9C7A3C] font-mono">{activeAd?.descriptions?.length || 0}</span>
              </label>
              <div className="space-y-2.5">
                {activeAd?.descriptions?.map((desc: string, i: number) => {
                  const isOver = desc.length > 90;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[11px] font-mono text-[#565C6B] w-5 text-right mt-2">{i + 1}</span>
                      <textarea
                        rows={2}
                        value={desc}
                        onChange={(e) => handleDescriptionChange(i, e.target.value)}
                        className={`flex-1 bg-[#FCFBF8] border rounded-xl p-3 text-[13px] outline-none transition-colors resize-none ${isOver ? 'border-red-500 bg-red-50/20' : 'border-[#14181F]/10 focus:border-[#9C7A3C]'
                          }`}
                      />
                      <span className={`text-[11px] font-mono w-10 text-right mt-2 ${isOver ? 'text-red-500 font-bold' : 'text-[#565C6B]'}`}>
                        {desc.length}/90
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sitelinks Extension Manager */}
          {blueprint.sitelinks && blueprint.sitelinks.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#14181F]/10 p-6 md:p-8 shadow-sm">
              <h3 className="text-[14px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <LinkIcon size={16} className="text-[#9C7A3C]" />
                Account-Level Sitelinks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blueprint.sitelinks.map((link: any, i: number) => (
                  <div key={i} className="bg-[#FCFBF8] border border-[#14181F]/5 p-4 rounded-2xl">
                    <p className="text-[13px] font-bold text-[#14181F] mb-1">{link.linkText}</p>
                    <p className="text-[11px] text-[#565C6B]">{link.description1}</p>
                    <p className="text-[11px] text-[#565C6B]">{link.description2}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}