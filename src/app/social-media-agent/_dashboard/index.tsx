/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import ConnectMetaButton from '../_connect-meta';
import PlatformIcon from '../_icon';
import useLiveWorkspaceStream from '@/hooks/useLiveWorkspaceStream';

interface DashboardStreamProps {
  workspaceId: string;
}

export default function DashboardStream({ workspaceId }: DashboardStreamProps) {
  const {
    streamItems,
    hasChannels,
    filterPlatform,
    setFilterPlatform,
    filterSentiment,
    setFilterSentiment,
  } = useLiveWorkspaceStream(workspaceId);

  const [activeItem, setActiveItem] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isEnrichingManual, setIsEnrichingManual] = useState<boolean>(false);
  const [isEscalating, setIsEscalating] = useState<boolean>(false);


  // DATE FILTER & SORT STATE
  const [dateSortOrder, setDateSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterDateStr, setFilterDateStr] = useState<string>(''); // Format: YYYY-MM-DD

  const [isFetchingDemoGmaps, setIsFetchingDemoGmaps] = useState(false);
  const [demoItemsGmaps, setDemoItemsGmaps] = useState<any[]>([]); // Store temporary Apify data

  useEffect(() => {
    const fetchReviews = async () => {
      setIsFetchingDemoGmaps(true);

      try {
        const response = await fetch('/api/social-media-agent/demo-google-maps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placeUrls: [
              "https://www.google.com/maps/place/Relaam+(previously+ADCP)+-+Main+Branch/@24.4773958,54.3212408,1025m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e5e665a954d9b4b:0xf53d3124c55b2fc9!8m2!3d24.4773958!4d54.3212408!16s%2Fg%2F1tgplhs2",
              "https://www.google.com/maps/place/Relaam+(previously+ADCP)+-+Dalma+Mall/@24.3347236,54.5187856,1026m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e5e3900248180b3:0xf45c98c1eccba460!8m2!3d24.3347237!4d54.5236565!16s%2Fg%2F11ysvv6l9f",
              "https://www.google.com/maps/place/Relaam+(previously+ADCP)+-+Al+Dhafra/@23.6387005,53.7094663,1032m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e676793960b05bd:0x67a265d11461053f!8m2!3d23.6387005!4d53.7094663!16s%2Fg%2F11lyl66lgy",
              "https://www.google.com/maps/place/Relaam+(previously+ADCP)+-+Sharjah+Branch/@25.3443869,55.386703,1018m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e5f5b551fd72ce9:0xcb2c5983bb540f22!8m2!3d25.3443869!4d55.386703!16s%2Fg%2F11y8x06f2r",
              "https://www.google.com/maps/place/Relaam+(previously+ADCP)+-+Al+Ain/@24.2162428,55.7591723,1027m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e8ab6ccc2829bb1:0x6d7aebb3689676b0!8m2!3d24.2162428!4d55.7591723!16s%2Fg%2F11h9y4x8yv"
            ],
            maxReviews: 15,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setDemoItemsGmaps(result.data);
        }
      } finally {
        setIsFetchingDemoGmaps(false);
      }
    };

    fetchReviews();
  }, []);

  const combinedItems = [...demoItemsGmaps, ...streamItems];

  // const processedStreamItems = streamItems.filter((item: any) => {
  //   // If no date is selected, show all
  //   if (!filterDateStr) return true;

  //   // Compare just the YYYY-MM-DD portion
  //   const itemDateStr = new Date(item.received_at).toISOString().split('T')[0];
  //   return itemDateStr === filterDateStr;
  // }).sort((a: any, b: any) => {
  //   const dateA = new Date(a.received_at).getTime();
  //   const dateB = new Date(b.received_at).getTime();
  //   return dateSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  // });

  const processedStreamItems = combinedItems.filter((item: any) => {
    // 1. Filter by Platform
    if (filterPlatform && filterPlatform !== 'all') {
      const itemPlatform = item.channels?.platform || '';
      if (itemPlatform !== filterPlatform) return false;
    }

    // 2. Filter by Sentiment
    if (filterSentiment && filterSentiment !== 'all') {
      if (item.sentiment !== filterSentiment) return false;
    }

    // 3. Filter by Date
    if (filterDateStr) {
      const itemDateStr = new Date(item.received_at).toISOString().split('T')[0];
      if (itemDateStr !== filterDateStr) return false;
    }

    return true; // Keep the item if it passes all active filters
  }).sort((a: any, b: any) => {
    const dateA = new Date(a.received_at).getTime();
    const dateB = new Date(b.received_at).getTime();
    return dateSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // DYNAMIC FRONTEND ANALYTICS (Fixed to consistently use processedStreamItems)
  const totalCount = processedStreamItems.length;
  const negativeCount = processedStreamItems.filter((i: any) => i.sentiment === 'negative').length;
  const positiveCount = processedStreamItems.filter((i: any) => i.sentiment === 'positive').length;
  const neutralCount = processedStreamItems.filter((i: any) => i.sentiment === 'neutral' || i.sentiment === 'unassigned').length;

  const posPct = totalCount ? (positiveCount / totalCount) * 100 : 0;
  const negPct = totalCount ? (negativeCount / totalCount) * 100 : 0;
  const neuPct = totalCount ? (neutralCount / totalCount) * 100 : 0;

  /*
  const processedStreamItems = combinedItems.filter((item: any) => {
    // If no date is selected, show all
    if (!filterDateStr) return true;

    // Compare just the YYYY-MM-DD portion
    const itemDateStr = new Date(item.received_at).toISOString().split('T')[0];
    return itemDateStr === filterDateStr;
  }).sort((a: any, b: any) => {
    const dateA = new Date(a.received_at).getTime();
    const dateB = new Date(b.received_at).getTime();
    return dateSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });


  // DYNAMIC FRONTEND ANALYTICS
  const totalCount = processedStreamItems.length;
  const negativeCount = processedStreamItems.filter((i: any) => i.sentiment === 'negative').length;
  // const positiveCount = streamItems.filter((i: any) => i.sentiment === 'positive').length;
  // const neutralCount = streamItems.filter((i: any) => i.sentiment === 'neutral' || i.sentiment === 'unassigned').length;

  const positiveCount = combinedItems.filter((i: any) => i.sentiment === 'positive').length;
  const neutralCount = combinedItems.filter((i: any) => i.sentiment === 'neutral' || i.sentiment === 'unassigned').length;

  const posPct = totalCount ? (positiveCount / totalCount) * 100 : 0;
  const negPct = totalCount ? (negativeCount / totalCount) * 100 : 0;
  const neuPct = totalCount ? (neutralCount / totalCount) * 100 : 0;
*/

  const handleSelectItem = (item: any) => {
    setActiveItem(item);
    setReplyMessage(item.ai_suggestion || '');
    setActionStatus(null);
  };

  const handleSendReply = async (isAi: boolean) => {
    if (!activeItem || !replyMessage.trim()) return;
    setIsSending(true);
    setActionStatus(null);

    try {
      const response = await fetch('/api/social-media-agent/stream/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamItemId: activeItem.id,
          message: replyMessage,
          isAiGenerated: isAi,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setActionStatus({ success: true });
        setActiveItem((prev: any) => ({ ...prev, is_replied: true }));
      } else {
        setActionStatus({ error: data.error || 'Failed to dispatch reply' });
      }
    } catch (err: any) {
      setActionStatus({ error: 'Network error occurred.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleManualEnrichment = async () => {
    if (!activeItem) return;
    setIsEnrichingManual(true);
    setActionStatus(null);

    try {
      const response = await fetch('/api/social-media-agent/stream/manual-enrichment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamItemId: activeItem.id,
          content: activeItem.content,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to enrich");

      setActiveItem((prev: any) => ({
        ...prev,
        sentiment: result.data.sentiment,
        ai_suggestion: result.data.reply_draft
      }));
      setReplyMessage(result.data.reply_draft);
    } catch (err: any) {
      setActionStatus({ error: 'AI Enrichment failed.' });
    } finally {
      setIsEnrichingManual(false);
    }
  };

  const handleEscalate = async () => {
    if (!activeItem) return;
    setIsEscalating(true);
    setActionStatus(null);

    try {
      const response = await fetch('/api/social-media-agent/stream/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamItemId: activeItem.id,
          content: activeItem.content,
          senderUsername: activeItem.sender_username,
          platform: activeItem.channels?.platform || 'Social Media',
          channelId: activeItem.channel_id,
          externalId: activeItem.external_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to escalate");
      setActiveItem((prev: any) => ({ ...prev, is_escalated: true }));
      setActionStatus({ success: true, message: 'Ticket escalated!' } as any);
    } catch (err: any) {
      setActionStatus({ error: 'Failed to escalate ticket.' });
    } finally {
      setIsEscalating(false);
    }
  };

  const handlePlatformClick = (plat: string) => {
    setFilterPlatform(plat);

    // Auto-fetch demo data the FIRST time they click the maps filter
    // if (plat === 'google_maps' && demoItemsGmaps.length === 0 && !isFetchingDemoGmaps) {
    //   handleFetchDemoReviewsGmaps();
    // }
  };

  if (hasChannels === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#FCFBF8] font-jost">
        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
          {/* Outer pulsing ring for a "radar" or "syncing" feel */}
          <div className="absolute inset-0 rounded-full border-2 border-zinc-200 animate-ping opacity-30"></div>

          {/* Inner crisp spinner */}
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin relative z-10"></div>
        </div>

        <h3 className="text-zinc-900 font-semibold tracking-wide text-sm mb-1.5 uppercase">
          Syncing Workspace
        </h3>
        <p className="text-zinc-500 text-[11px] uppercase tracking-widest font-medium">
          Establishing connection to channels...
        </p>
      </div>
    );
  }

  if (hasChannels === false) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-zinc-100 p-12 text-center">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">Workspace Disconnected</h2>
          <p className="text-sm text-zinc-500 mb-8">Connect your Meta properties to begin processing live interactions.</p>
          <div className="flex justify-center">
            <ConnectMetaButton workspaceId={workspaceId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FCFBF8] text-zinc-900 p-4 lg:p-6 font-jost">

      {/* 1. COMPACT TOP BAR: Header & Inline Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Live Command Center</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-zinc-500 text-sm">Syncing {totalCount} active interactions</p>
          </div>
        </div>

        {/* Minimalist Brand Health Indicator */}
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-zinc-100 shadow-sm">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Health</span>

          <div className="w-32 h-1.5 flex rounded-full overflow-hidden bg-zinc-100">
            {posPct > 0 && <div style={{ width: `${posPct}%` }} className="bg-emerald-400" />}
            {neuPct > 0 && <div style={{ width: `${neuPct}%` }} className="bg-zinc-300" />}
            {negPct > 0 && <div style={{ width: `${negPct}%` }} className="bg-rose-400" />}
          </div>

          {/* Explicit Numbers & Percentages */}
          <div className="flex gap-4 text-[11px] font-medium border-l border-zinc-100 pl-4">
            <div className="flex items-center gap-1.5" title="Positive Interactions">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-zinc-900">{positiveCount}</span>
              <span className="text-zinc-400">({Math.round(posPct)}%)</span>
            </div>

            <div className="flex items-center gap-1.5" title="Alerts / Negative Interactions">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span className="text-zinc-900">{negativeCount}</span>
              <span className="text-zinc-400">({Math.round(negPct)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPLIT-PANE WORKSPACE */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0"> {/* min-h-0 is crucial for flex-child scrolling */}

        {/* LEFT PANE: The Queue (35% width) */}
        <div className="w-full lg:w-100 flex flex-col bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden shrink-0">

          {/* List Header & Filters */}
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
            {/* <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-none">
              {['all', 'facebook', 'instagram', 'google_maps'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setFilterPlatform(plat)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all ${filterPlatform === plat ? 'bg-zinc-900 text-white shadow-sm' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}
                >
                  {plat}
                </button>
              ))}
            </div> */}

            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-none">
              {['all', 'facebook', 'instagram', 'google_maps'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => handlePlatformClick(plat)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all ${filterPlatform === plat ? 'bg-zinc-900 text-white shadow-sm' : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'}`}
                >
                  {plat === 'google_maps' ? 'Maps' : plat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {['positive', 'neutral', 'negative'].map((sent) => {
                const isActive = filterSentiment === sent;

                // Dynamically assign premium color maps based on the specific sentiment
                let activeStyle = "";
                let dotStyle = "";
                let hoverStyle = "";

                if (sent === 'positive') {
                  activeStyle = "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm ring-1 ring-emerald-500/10";
                  dotStyle = "bg-emerald-500";
                  hoverStyle = "hover:border-emerald-200 hover:bg-emerald-50/50";
                } else if (sent === 'negative') {
                  activeStyle = "bg-rose-50 border-rose-200 text-rose-700 shadow-sm ring-1 ring-rose-500/10";
                  dotStyle = "bg-rose-500";
                  hoverStyle = "hover:border-rose-200 hover:bg-rose-50/50";
                } else {
                  activeStyle = "bg-zinc-100 border-zinc-300 text-zinc-900 shadow-sm ring-1 ring-zinc-500/10";
                  dotStyle = "bg-zinc-400";
                  hoverStyle = "hover:border-zinc-200 hover:bg-zinc-50";
                }

                return (
                  <button
                    key={sent}
                    onClick={() => setFilterSentiment(isActive ? 'all' : sent)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full capitalize transition-all duration-200 border cursor-pointer ${isActive
                      ? activeStyle
                      : `bg-white border-zinc-100 text-zinc-500 ${hoverStyle}`
                      }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${dotStyle} ${!isActive && 'opacity-40 grayscale-50'}`}></span>
                    {sent === 'negative' ? 'Alerts' : sent}
                  </button>
                );
              })}
            </div>
            {/* NEW: Date Controls */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-200/50">
              {/* Native Date Picker */}
              <div className="relative flex-1">
                <input
                  type="date"
                  value={filterDateStr}
                  onChange={(e) => setFilterDateStr(e.target.value)}
                  className="w-full text-[11px] font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all cursor-pointer"
                />
                {filterDateStr && (
                  <button
                    onClick={() => setFilterDateStr('')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    title="Clear Date"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                )}
              </div>

              {/* Sort Toggle Button */}
              <button
                onClick={() => setDateSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 transition-colors shrink-0"
                title={`Sorting by ${dateSortOrder}`}
              >
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${dateSortOrder === 'oldest' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                </svg>
                <span className="capitalize">{dateSortOrder}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Stream */}
          {/* <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 p-2 space-y-1">
            {processedStreamItems.length === 0 ? (
              <div className="text-center p-8 text-zinc-400 text-sm">Queue empty.</div>
            ) : ( */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 p-2 space-y-1">
            {isFetchingDemoGmaps ? (
              <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
                <div className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                  Scraping Live Maps Data...
                </p>
              </div>
            ) : processedStreamItems.length === 0 ? (
              <div className="text-center p-8 text-zinc-400 text-sm">Queue empty.</div>
            ) : (
              processedStreamItems.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeItem?.id === item.id ? 'bg-white border-zinc-300 shadow-[0_4px_20px_rgb(0,0,0,0.06)]' : 'bg-transparent border-transparent hover:bg-white hover:border-zinc-200 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[13px] font-semibold text-zinc-900 truncate tracking-tight">@{item.sender_username}</span>
                    <span className="text-[10px] text-zinc-400 whitespace-nowrap ml-2 font-medium">
                      {new Date(item.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[13px] text-zinc-600 line-clamp-2 leading-relaxed mb-3">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Platform Logo + Text */}
                    <div className="flex items-center gap-1.5">
                      <PlatformIcon platform={item.channels?.platform} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        {item.channels?.platform?.replace('_', ' ') || 'Meta'}
                      </span>
                    </div>

                    {/* Explicit Sentiment Badge & Reply Status */}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${item.sentiment === 'positive' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        item.sentiment === 'negative' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                          'bg-zinc-50 border-zinc-200 text-zinc-600'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.sentiment === 'positive' ? 'bg-emerald-500' :
                          item.sentiment === 'negative' ? 'bg-rose-500' :
                            'bg-zinc-400'
                          }`}></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {item.sentiment || 'Unassigned'}
                        </span>
                      </div>

                      {item.is_replied && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-zinc-800 text-white px-2 py-0.5 rounded-md">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: The Canvas (65% width) */}
        {/* MOBILE OVERLAY: Sleek blurred backdrop for the popup */}
        {activeItem && (
          <div
            className="fixed inset-0 bg-zinc-900/20 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
            onClick={() => setActiveItem(null)}
          />
        )}

        {/* RIGHT PANE: The Canvas (65% width on desktop, Floating Premium Popup on mobile) */}
        <div className={`
          flex-col bg-white border border-zinc-100 overflow-hidden min-w-0
          ${activeItem
            ? 'fixed top-4 bottom-4 left-4 right-4 z-50 rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex lg:static lg:inset-auto lg:z-auto lg:shadow-sm lg:flex-1 lg:rounded-3xl'
            : 'hidden lg:flex lg:flex-1 lg:rounded-3xl shadow-sm'}
        `}>
          {activeItem ? (
            <>
              {/* Canvas Header */}
              <div className="flex justify-between items-center p-4 lg:p-5 border-b border-zinc-100 shrink-0 bg-zinc-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 flex items-center justify-center text-zinc-600 font-semibold shadow-inner shrink-0">
                    {activeItem.sender_username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-900 truncate">@{activeItem.sender_username}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${activeItem.channels?.platform === 'instagram' ? 'text-pink-600' : 'text-blue-600'}`}>
                        {activeItem.channels?.platform}
                      </span>
                      <span className="text-zinc-300 text-[10px] hidden sm:inline">•</span>
                      <span className="text-[10px] text-zinc-500 hidden sm:inline">{new Date(activeItem.received_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* <div className="flex items-center gap-2 shrink-0 ml-2">
                  <a href={`/api/social-media-agent/stream/get-feedback-link?id=${activeItem.id}`} target="_blank" rel="noopener noreferrer" className="px-2 lg:px-3 py-1.5 text-[11px] font-medium rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors hidden sm:flex items-center justify-center">
                    View External ↗
                  </a>
                  {activeItem.sentiment === 'negative' && (
                    <button onClick={handleEscalate} disabled={isEscalating || activeItem.is_escalated} className={`px-2 lg:px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${activeItem.is_escalated ? 'bg-zinc-100 text-zinc-400' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                      {isEscalating ? '...' : activeItem.is_escalated ? '✓' : 'Flag'}
                    </button>
                  )} */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <a
                    href={activeItem.permalink_url ? activeItem.permalink_url : `/api/social-media-agent/stream/get-feedback-link?id=${activeItem.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 lg:px-3 py-1.5 text-[11px] font-medium rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors hidden sm:flex items-center justify-center"
                  >
                    View External ↗
                  </a>

                  {activeItem.sentiment === 'negative' && (
                    <button onClick={handleEscalate} disabled={isEscalating || activeItem.is_escalated} className={`px-2 lg:px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${activeItem.is_escalated ? 'bg-zinc-100 text-zinc-400' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                      {isEscalating ? '...' : activeItem.is_escalated ? '✓' : 'Flag'}
                    </button>
                  )}

                  {/* MOBILE ONLY: Premium Cross / Close Button */}
                  <button
                    onClick={() => setActiveItem(null)}
                    className="lg:hidden p-1.5 ml-1 text-zinc-400 hover:text-zinc-900 bg-white hover:bg-zinc-100 rounded-full border border-transparent hover:border-zinc-200 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#FCFBF8]">
                <div className="max-w-2xl bg-white p-4 lg:p-5 rounded-2xl rounded-tl-sm border border-zinc-100 shadow-sm text-[14px] lg:text-[15px] text-zinc-800 leading-relaxed inline-block">
                  {activeItem.content}
                </div>
              </div>

              {/* Action / AI Composer */}
              <div className="p-4 lg:p-5 border-t border-zinc-100 bg-white shrink-0 pb-safe">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Synthesis Engine
                  </span>
                  {activeItem.sentiment !== 'unassigned' && activeItem.ai_suggestion && (
                    <button onClick={() => setReplyMessage(activeItem.ai_suggestion)} className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium">
                      Reset Draft
                    </button>
                  )}
                </div>

                {activeItem.sentiment === 'unassigned' ? (
                  <div className="p-6 lg:p-8 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                    <button onClick={handleManualEnrichment} disabled={isEnrichingManual} className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-2">
                      {isEnrichingManual ? 'Generating Context...' : 'Initialize Analysis'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="w-full text-[14px] leading-relaxed p-4 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-zinc-50 focus:bg-white transition-all resize-none"
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      disabled={activeItem.is_replied || isSending}
                      placeholder="Draft a response..."
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 w-full text-center sm:text-left">
                        {actionStatus?.success && <span className="text-xs text-emerald-600 font-medium">✓ Transmission successful</span>}
                        {actionStatus?.error && <span className="text-xs text-rose-600 font-medium">{actionStatus.error}</span>}
                      </div>

                      <button
                        onClick={() => handleSendReply(replyMessage === activeItem.ai_suggestion)}
                        disabled={isSending || activeItem.is_replied || !replyMessage.trim()}
                        className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-medium py-3 sm:py-2.5 px-6 rounded-xl transition-all shadow-md disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none"
                      >
                        {isSending ? 'Transmitting...' : activeItem.is_replied ? 'Thread Closed' : 'Dispatch Response'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <p className="text-sm">Select an interaction to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}