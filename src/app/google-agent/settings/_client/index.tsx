/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams } from 'next/navigation';
import { Settings, Link as LinkIcon, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Unplug, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import Link from 'next/link';

export default function SettingsClient({ activeAccount }: { activeAccount: any }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center text-[#565C6B]">Loading settings...</div>}>
      <SettingsContent activeAccount={activeAccount} />
    </Suspense>
  );
}

function SettingsContent({ activeAccount }: { activeAccount: any }) {
  const searchParams = useSearchParams();
  const successMsg = searchParams.get('success');
  const errorMsg = searchParams.get('error');

  const isConnected = !!activeAccount?.refreshToken;

  return (
    /* NEW WRAPPER: Forces light background, full height, and base text color */
    <div className="min-h-screen bg-[#FCFBF8] text-[#14181F] font-jost selection:bg-[#9C7A3C]/20">

      {/* Main Content Container with Max Width and Centering */}
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-24">

        <header className="mb-12">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase flex items-center gap-2">
            <Settings size={14} />
            Configuration
          </p>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant text-[#14181F]">
            Agent Settings
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
            Manage your AI agent&apos;s access to external platforms and configure automated deployment permissions.
          </p>
        </header>

        {/* OAuth Alerts */}
        {successMsg === 'google_connected' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-4 items-start shadow-sm">
            <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-emerald-900 font-semibold text-[14px]">Authentication Successful</h3>
              <p className="text-[13px] text-emerald-700 mt-1">Your Google Ads account has been securely connected. The AI Agent now has deployment access.</p>
            </div>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-4 items-start shadow-sm">
            <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-rose-900 font-semibold text-[14px]">Authentication Failed</h3>
              <p className="text-[13px] text-rose-700 mt-1">
                {errorMsg === 'no_refresh_token' ? "Google did not provide offline access. Please ensure you check all permission boxes during login." :
                  errorMsg === 'no_manual_account_found' ? "No pending account setup found in the database. Please contact support to initialize your account." :
                    "An unexpected error occurred during the Google connection process. Please try again."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Google Integration Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-4xl border border-[#14181F]/10 shadow-sm p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-[16px] font-bold text-[#14181F] uppercase tracking-wide flex items-center gap-2 mb-2">
                    <LinkIcon size={18} className="text-[#9C7A3C]" />
                    Google Ads Integration
                  </h2>
                  <p className="text-[13px] text-[#565C6B]">
                    Connect your Google Ads Manager account to allow the AI to fetch live search volumes and deploy approved campaigns automatically.
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${isConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-[#14181F]/5 border-[#14181F]/10 text-[#14181F]/40'}`}>
                  {isConnected ? <><ShieldCheck size={14} /> Active</> : <><Unplug size={14} /> Disconnected</>}
                </div>
              </div>

              <div className="bg-[#FCFBF8] border border-[#14181F]/5 rounded-2xl p-6">
                {isConnected ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest font-bold text-[#14181F]/40 mb-1">Connected Account ID</p>
                      <p className="text-[16px] font-mono font-medium text-[#14181F]">{activeAccount.customerId}</p>
                      <p className="text-[12px] text-[#565C6B] mt-2">Secure OAuth refresh token is stored and active.</p>
                    </div>
                    <a
                      href="/api/google-agent/auth"
                      className="inline-flex items-center justify-center gap-2 bg-white border border-[#14181F]/10 hover:border-[#9C7A3C]/50 hover:text-[#9C7A3C] text-[#14181F] px-5 py-3 rounded-xl text-[13px] font-semibold transition-all shadow-sm"
                    >
                      Refresh Connection <ArrowRight size={16} />
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-[14px] font-semibold text-[#14181F] mb-1">Authorization Required</p>
                      <p className="text-[12px] text-[#565C6B]">You will be securely redirected to Google to grant access.</p>
                    </div>
                    <a
                      href="/api/google-agent/auth"
                      className="inline-flex items-center justify-center gap-2 bg-[#14181F] hover:bg-[#14181F]/90 text-white px-6 py-3 rounded-xl text-[13px] font-semibold transition-all shadow-sm whitespace-nowrap"
                    >
                      <LinkIcon size={16} /> Connect Google Ads
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white border border-[#14181F]/10 shadow-sm rounded-3xl p-6">
              <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#14181F] mb-4">Security Notice</h3>
              <p className="text-[13px] text-[#565C6B] leading-relaxed mb-4">
                Riwaa AI utilizes official Google OAuth 2.0 protocols. Your password is never exposed to our servers. We only store an encrypted refresh token to execute background AI tasks.
              </p>
              <p className="text-[13px] text-[#565C6B] leading-relaxed">
                You can revoke this access at any time directly from your Google Account security settings.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="px-6 py-4 flex items-center justify-center z-50">
        {activeAccount?.customerId && (
          <Link
            href={`/google-agent/${activeAccount.customerId}/setup`}
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#565C6B] hover:text-[#14181F] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}