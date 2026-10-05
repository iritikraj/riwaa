/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/meta-agent/[accountId]/competitor-benchmarking/_client/index.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, AlertTriangle, ExternalLink, Activity, Calendar, LayoutGrid, Globe } from 'lucide-react';

interface AdLibraryClientProps {
  activeAccountId: string;
  activeAccountName: string;
}

export default function AdLibraryClient({ activeAccountId, activeAccountName }: AdLibraryClientProps) {
  const [query, setQuery] = useState('');
  const [adType, setAdType] = useState('POLITICAL_AND_ISSUE_ADS');
  const [country, setCountry] = useState('US');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        accountId: activeAccountId,
        q: query,
        country: country,
        type: adType
      });

      const res = await fetch(`/api/meta-agent/ad-library?${searchParams.toString()}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Failed to fetch ads from Meta.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred during the search.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setAdType(newType);
    if (newType === 'ALL' && !['GB', 'FR', 'DE', 'IT', 'ES'].includes(country)) {
      setCountry('GB');
    }
  };

  return (
    <>
      <header className="mb-10">
        <span className="font-jost text-[11px] uppercase tracking-[0.28em] text-[#9C7A3C]">
          Competitor Intelligence
        </span>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
          Global Ad Library
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
          Search the Meta transparency archive to monitor competitor advertisers, durations, and platform placements.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Search Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-7">

            <div className="mb-6 p-4 bg-[#FCFBF8] border border-[#9C7A3C]/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-[#9C7A3C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.1em] font-bold text-[#14181F] mb-1">API Limitations</h4>
                  <ul className="text-[13px] text-[#565C6B] space-y-2 list-disc pl-3">
                    <li><strong className="text-[#14181F]">Social/Political:</strong> Global (7 years).</li>
                    <li><strong className="text-[#14181F]">Commercial Ads:</strong> UK/EU only (1 year).</li>
                    <li><strong className="text-[#14181F]">Ad Formats:</strong> Viewable via Snapshot link only.</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-2">Search Scope</label>
                <select
                  value={adType}
                  onChange={handleAdTypeChange}
                  className="w-full px-4 py-3 bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl text-[14px] text-[#14181F] focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all appearance-none"
                >
                  <option value="POLITICAL_AND_ISSUE_ADS">Social, Election & Politics (Global)</option>
                  <option value="ALL">All Commercial Ads (UK/EU Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-2">Target Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl text-[14px] text-[#14181F] focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all appearance-none"
                >
                  {adType === 'POLITICAL_AND_ISSUE_ADS' ? (
                    <>
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </>
                  ) : (
                    <>
                      <option value="GB">United Kingdom</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/60 mb-2">Advertiser / Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. 'Nike' or 'Real Estate'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl text-[14px] text-[#14181F] focus:outline-none focus:border-[#9C7A3C]/50 focus:ring-1 focus:ring-[#9C7A3C]/50 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#14181F] hover:bg-[#14181F]/90 text-[#FCFBF8] font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm mt-2"
              >
                {isLoading ? <><Activity className="animate-spin" size={16} /> Scanning Archive...</> : <><Search size={16} /> Search Ad Library</>}
              </button>
            </form>

            {error && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 bg-rose-50 text-rose-700 rounded-xl text-[13px] border border-rose-100 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-[#14181F]/10 p-8 min-h-[600px] flex flex-col relative overflow-hidden">

            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#b8924a]/5 blur-[100px] pointer-events-none" />

            {!isLoading && results.length === 0 && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-[#565C6B] z-10">
                <Search size={40} className="mb-4 text-[#14181F]/10" strokeWidth={1} />
                <p className="text-[14px]">Enter an advertiser name to explore the Meta Ad Library.</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
                {results.map((ad, idx) => {
                  const startDate = ad.ad_delivery_start_time ? new Date(ad.ad_delivery_start_time).toLocaleDateString() : 'Unknown';
                  const endDate = ad.ad_delivery_stop_time ? new Date(ad.ad_delivery_stop_time).toLocaleDateString() : 'Ongoing';

                  return (
                    <motion.div
                      key={ad.id || idx}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border border-[#14181F]/10 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                      {/* Card Header: Advertiser Name */}
                      <div className="p-5 border-b border-[#14181F]/5 bg-[#FCFBF8] flex justify-between items-start">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#565C6B] mb-1">Advertiser</p>
                          <h4 className="font-bold text-[#14181F] text-[16px] leading-tight">{ad.page_name}</h4>
                        </div>
                        <span className="text-[10px] bg-white border border-[#14181F]/10 px-2 py-1 rounded text-[#565C6B] font-medium tracking-wider flex items-center gap-1">
                          <Globe size={10} /> {country}
                        </span>
                      </div>

                      {/* Card Body: Duration, Platforms, and Formats */}
                      <div className="p-5 flex-1 flex flex-col gap-4">

                        <div className="flex items-start gap-2 text-[#565C6B]">
                          <Calendar size={14} className="mt-0.5 text-[#9C7A3C]" />
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-0.5">Duration</p>
                            <p className="text-[13px]">{startDate} — {endDate}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[#565C6B]">
                          <LayoutGrid size={14} className="mt-0.5 text-[#9C7A3C]" />
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.1em] font-semibold mb-1">Platforms</p>
                            <div className="flex flex-wrap gap-1.5">
                              {ad.publisher_platforms?.map((platform: string) => (
                                <span key={platform} className="text-[10px] uppercase tracking-wider bg-[#14181F]/5 px-2 py-0.5 rounded text-[#14181F]/80">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Card Footer: View Format Action */}
                      <div className="p-4 border-t border-[#14181F]/5 bg-[#FCFBF8]/50">
                        <a
                          href={ad.ad_snapshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-white border border-[#14181F]/10 hover:border-[#9C7A3C]/50 text-[#14181F] py-2 rounded-lg text-[13px] font-medium transition-colors"
                        >
                          View Ad Format & Creative <ExternalLink size={14} className="text-[#9C7A3C]" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}