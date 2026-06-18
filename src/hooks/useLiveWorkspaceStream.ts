/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function useLiveWorkspaceStream(initialWorkspaceId: string) {
  const [items, setItems] = useState<any[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [hasChannels, setHasChannels] = useState<boolean | null>(null);

  useEffect(() => {
    const checkChannelsAndFetch = async () => {
      try {
        console.log("[Network] Checking channels for workspace:", initialWorkspaceId);

        const { count, error: channelErr } = await supabase
          .from('channels')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', initialWorkspaceId)
          .eq('is_active', true);

        if (channelErr) {
          console.error("[Supabase Error] Failed to fetch channels:", channelErr);
          setHasChannels(false);
          return;
        }

        console.log("[Network] Channel count:", count);

        if (count === 0) {
          setHasChannels(false);
          return;
        }

        setHasChannels(true);

        // 2. Fetch stream items
        const { data, error } = await supabase
          .from('stream_items')
          .select('*, channels!inner(workspace_id, platform)')
          .eq('channels.workspace_id', initialWorkspaceId)
          .order('received_at', { ascending: false });

        if (data) setItems(data);

      } catch (err) {
        // THIS CATCHES THE SILENT CRASH
        console.error("[Critical Hook Error]:", err);
        setHasChannels(false); // Fails gracefully to the Connect button instead of spinning forever
      }
    };

    checkChannelsAndFetch();

    // 1. Initial baseline fetch for current workspace items
    const fetchStreamItems = async () => {
      const { data, error } = await supabase
        .from('stream_items')
        .select(`
          *,
          channels!inner(workspace_id, platform)
        `)
        .eq('channels.workspace_id', initialWorkspaceId)
        .order('received_at', { ascending: false });

      if (data) setItems(data);
    };

    fetchStreamItems();

    // 2. Turn on Realtime Listener channel for table rows
    const channelSubscription = supabase
      .channel('workspace-stream-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stream_items' },
        async (payload) => {
          // If a new comment comes in
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [payload.new, ...prev]);
          }
          // If Gemini updates an existing comment with a sentiment tag and suggestions
          if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) => (item.id === payload.new.id ? { ...item, ...payload.new } : item))
            );
          }
          // If items get removed
          if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, [initialWorkspaceId]);

  // Computed state property allowing instant front-end filtering and sorting controls
  const filteredAndSortedItems = items.filter((item) => {
    const matchesPlatform = filterPlatform === 'all' || item.channels?.platform === filterPlatform;
    const matchesSentiment = filterSentiment === 'all' || item.sentiment === filterSentiment;
    return matchesPlatform && matchesSentiment;
  });

  return {
    streamItems: filteredAndSortedItems,
    hasChannels,
    filterPlatform,
    setFilterPlatform,
    filterSentiment,
    setFilterSentiment,
  };
}