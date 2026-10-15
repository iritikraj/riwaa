/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Sparkles, CheckCircle2, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function GoogleCampaignSetupClient({ activeAccountId }: { activeAccountId: string }) {
  const [campaignName, setCampaignName] = useState('');
  const [brief, setBrief] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim() || !campaignName.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowAuthModal(false);

    try {
      const res = await fetch('/api/google-agent/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, campaignName, customerId: activeAccountId }),
      });

      const data = await res.json();

      if (res.status === 401 && data.code === 'GOOGLE_AUTH_EXPIRED') {
        setShowAuthModal(true);
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to generate blueprint');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="mb-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase">
          Strategy Intake
        </p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
          Search Campaign Setup
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
          Brief the autonomous agent on your property, target demographics, and primary objectives to generate a complete Google Ads blueprint.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Input Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-7 h-fit">
          <form onSubmit={handleGenerate} className="space-y-6">

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-3">
                Internal Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g., Q4 Luxury Villas Palm Jumeirah"
                className="w-full p-4 bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl text-[14px] text-[#14181F] placeholder-[#14181F]/30 focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-3">
                Strategic Brief & Keywords
              </label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Detail the property features, target investor profiles, and primary seed keywords. The AI will extract intents and map them to targeted ad groups..."
                className="w-full h-48 p-5 bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl text-[14px] text-[#14181F] placeholder-[#14181F]/30 focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !brief.trim() || !campaignName.trim()}
              className={`w-full ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[#14181F] hover:bg-[#14181F]/90 text-[#FCFBF8] font-medium py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm`}
            >
              {isLoading ? (
                <>
                  <Activity className="animate-spin" size={18} />
                  Structuring Blueprint...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-[#9C7A3C]" />
                  Generate Campaign Blueprint
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 bg-rose-50 text-rose-700 rounded-xl text-[13px] border border-rose-100">
              {error}
            </motion.div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-8 flex flex-col min-h-125 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#b8924a]/5 blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-between border-b border-[#14181F]/5 pb-4 mb-6 z-10">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]">
              Blueprint Output
            </h2>
            {result && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-emerald-600 border border-emerald-100">
                Draft Created
              </span>
            )}
          </div>

          {!result && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-[#565C6B] z-10">
              <FileText size={40} className="mb-4 text-[#14181F]/10" strokeWidth={1} />
              <p className="text-[14px] text-center max-w-xs">
                Submit a brief to generate the Google Ads structure, RSAs, and keyword clusters.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-[#9C7A3C] z-10 space-y-4">
              <Activity className="animate-pulse mb-2" size={32} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-center">Gemini is fetching search volume<br />and drafting RSA copy...</span>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 flex flex-col h-full z-10"
            >
              <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-4">
                <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                <div>
                  <h3 className="text-emerald-900 font-semibold mb-2">Blueprint Successfully Drafted</h3>
                  <p className="text-[13px] text-emerald-700 leading-relaxed mb-4">
                    The AI has generated <strong>{result.data.ad_groups.length} Ad Groups</strong> and complete Responsive Search Ads based on live search volume. It is currently held in Strapi awaiting your approval.
                  </p>

                  <div className="text-[13px] text-emerald-700 flex items-center justify-between bg-white/60 px-3.5 py-2 rounded-lg border border-emerald-100/50">
                    <span className="font-medium shrink-0">Blueprint ID</span>
                    <span className="font-mono text-[12px] bg-emerald-100/50 border border-emerald-200/50 px-2.5 py-1 rounded text-emerald-800 shadow-sm">
                      {result.blueprintId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button to the Approval Editor */}
              <div className="mt-auto pt-6">
                <Link
                  href={`/google-agent/${activeAccountId}/blueprints/${result.blueprintId}`}
                  className="w-full bg-[#9C7A3C] hover:bg-[#8A6B32] text-[#FCFBF8] font-medium py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  Proceed to Approval Studio
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden text-center p-8"
            >
              <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 text-rose-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#14181F] mb-3">Connection Expired</h3>
              <p className="text-[14px] text-[#565C6B] leading-relaxed mb-8">
                Your Google Ads access token has expired. You need to securely reconnect your account to continue using the AI Agent.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-3.5 rounded-xl font-medium text-[#14181F] bg-[#FCFBF8] border border-[#14181F]/10 hover:bg-[#14181F]/5 transition-colors text-[14px]"
                >
                  Cancel
                </button>
                {/* Link to the OAuth Initiation Route we created earlier */}
                <a
                  href="/api/google-agent/auth"
                  className="flex-1 py-3.5 rounded-xl font-medium text-[#FCFBF8] bg-[#9C7A3C] hover:bg-[#8A6B32] transition-colors text-[14px]"
                >
                  Reconnect Google
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}