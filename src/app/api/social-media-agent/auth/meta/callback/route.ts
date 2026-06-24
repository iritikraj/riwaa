/* eslint-disable @typescript-eslint/no-explicit-any */
import { enrichStreamItemWithAI } from '@/config/ai/data-enrichment';
import { supabase } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const workspaceId = searchParams.get('state'); // We pass the workspace ID in the state parameter

  if (!code || !workspaceId) {
    return NextResponse.json({ error: 'Missing code or workspace context' }, { status: 400 });
  }

  try {
    // 1. Exchange the temporary code for a User Access Token
    const tokenUrl = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.APP_URL}/api/social-media-agent/auth/meta/callback&client_secret=${process.env.META_APP_SECRET}&code=${code}`;

    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) throw new Error(tokenData.error.message);
    const userAccessToken = tokenData.access_token;


    // --- DEBUG: WHAT PERMISSIONS DID META ACTUALLY GIVE THE TOKEN? ---
    const debugUrl = `https://graph.facebook.com/v21.0/me/permissions?access_token=${userAccessToken}`;
    const debugRes = await fetch(debugUrl);
    const debugData = await debugRes.json();
    console.log("--- TOKEN PERMISSIONS ---", JSON.stringify(debugData, null, 2));


    // 2. Fetch the Facebook Pages the user granted us access to
    // This endpoint returns the Page IDs, Names, and specific Page Access Tokens
    const pagesUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${userAccessToken}`;
    const pagesRes = await fetch(pagesUrl);
    const pagesData = await pagesRes.json();

    console.log("--- META PAGES DATA RES ---", JSON.stringify(pagesData, null, 2));

    const channelsToInsert = [];

    // 3. Loop through each Facebook Page and check for linked Instagram Accounts
    for (const page of pagesData.data) {
      // Add Facebook Page to our provisioning array
      channelsToInsert.push({
        workspace_id: workspaceId,
        platform: 'facebook',
        platform_account_id: page.id,
        account_name: page.name,
        encrypted_access_token: page.access_token,
        is_active: true
      });

      // Check if this Facebook Page has an Instagram Business Account linked
      const igUrl = `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`;
      const igRes = await fetch(igUrl);
      const igData = await igRes.json();

      if (igData.instagram_business_account) {
        // We found a linked Instagram Account! Fetch its username.
        const igAccountId = igData.instagram_business_account.id;
        const igProfileUrl = `https://graph.facebook.com/v21.0/${igAccountId}?fields=username&access_token=${page.access_token}`;
        const igProfileRes = await fetch(igProfileUrl);
        const igProfileData = await igProfileRes.json();

        channelsToInsert.push({
          workspace_id: workspaceId,
          platform: 'instagram',
          platform_account_id: igAccountId,
          account_name: `@${igProfileData.username}`,
          encrypted_access_token: page.access_token, // IG Graph API uses the parent Page Token
          is_active: true
        });
      }
    }

    // 4. Save everything to Supabase (Upsert handles if they reconnect the same accounts)
    const { error: dbError } = await supabase
      .from('channels')
      .upsert(channelsToInsert, { onConflict: 'platform,platform_account_id' });

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    // HISTORICAL DATA BACKFILL FOR FB & INSTAGRAM

    // Step 4a: Fetch the newly created channel UUIDs to link our stream items
    const { data: savedChannels, error: fetchErr } = await supabase
      .from('channels')
      .select('id, platform, platform_account_id, encrypted_access_token')
      .eq('workspace_id', workspaceId);

    if (!fetchErr && savedChannels) {
      const streamItemsToInsert = [];

      for (const channel of savedChannels) {
        try {
          if (channel.platform === 'facebook') {
            // FB Graph API: Get recent posts and their comments
            // FB Graph API: Get last 25 posts and up to 100 comments per post
            // const fbUrl = `https://graph.facebook.com/v21.0/${channel.platform_account_id}/feed?fields=id,message,created_time,comments.limit(100){id,message,created_time,from}&limit=25&access_token=${channel.encrypted_access_token}`;
            const fbUrl = `https://graph.facebook.com/v21.0/${channel.platform_account_id}/feed?fields=id,message,created_time,comments.limit(200){id,message,created_time,from}&limit=100&access_token=${channel.encrypted_access_token}`;
            const fbRes = await fetch(fbUrl);
            const fbData = await fbRes.json();

            if (fbData.data) {
              for (const post of fbData.data) {
                if (post.comments && post.comments.data) {
                  for (const comment of post.comments.data) {
                    streamItemsToInsert.push({
                      channel_id: channel.id, // Supabase UUID
                      external_id: comment.id, // Meta's unique comment ID
                      sender_platform_id: comment.from?.id || 'unknown',
                      sender_username: comment.from?.name || 'Facebook User',
                      content: comment.message,
                      received_at: comment.created_time,
                      // Let DB handle: id, sentiment ('unassigned'), ai_suggestion, is_replied, created_at
                    });
                  }
                }
              }
            }
          }

          if (channel.platform === 'instagram') {
            // IG Graph API: Get recent media objects and their comments
            // Note: IG uses 'text' instead of 'message', and 'timestamp' instead of 'created_time'
            // IG Graph API: Get last 25 media objects and up to 100 comments per media
            // const igUrl = `https://graph.facebook.com/v21.0/${channel.platform_account_id}/media?fields=id,caption,timestamp,comments.limit(100){id,text,timestamp,from,username}&limit=25&access_token=${channel.encrypted_access_token}`;
            const igUrl = `https://graph.facebook.com/v21.0/${channel.platform_account_id}/media?fields=id,caption,timestamp,comments.limit(200){id,text,timestamp,from,username}&limit=100&access_token=${channel.encrypted_access_token}`;
            const igRes = await fetch(igUrl);
            const igData = await igRes.json();

            if (igData.data) {
              for (const media of igData.data) {
                if (media.comments && media.comments.data) {
                  for (const comment of media.comments.data) {
                    streamItemsToInsert.push({
                      channel_id: channel.id, // Supabase UUID
                      external_id: comment.id, // Meta's unique comment ID
                      sender_platform_id: comment.from?.id || 'unknown',
                      sender_username: comment.username || comment.from?.username || 'Instagram User',
                      content: comment.text,
                      received_at: comment.timestamp,
                    });
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error(`Failed to backfill history for ${channel.platform}:`, err);
        }
      }

      // Step 4b: Bulk Upsert into stream_items
      if (streamItemsToInsert.length > 0) {
        const { data: insertedItems, error: streamErr } = await supabase
          .from('stream_items')
          .upsert(streamItemsToInsert, { onConflict: 'external_id' })
          .select('id, content, sentiment'); // Ask Supabase to return the newly created IDs

        if (streamErr) {
          console.error("Stream Items Upsert Error:", streamErr);
        } else if (insertedItems) {

          // NEW: Sequential AI Background Processor
          const processQueueSequentially = async (items: any[]) => {
            const unassignedItems = items.filter(i => i.sentiment === 'unassigned');
            console.log(`[AI Queue] Starting background enrichment for ${unassignedItems.length} items...`);

            for (const item of unassignedItems) {
              await enrichStreamItemWithAI(item.id, item.content);
              // Pause for 5 seconds between each API call to avoid 429 Rate Limits
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
            console.log(`[AI Queue] Background enrichment complete!`);
          };

          // Fire and forget (Runs silently in the Node.js background)
          processQueueSequentially(insertedItems).catch(console.error);
        }
      }
    }

    // 5. Redirect the user back to the dashboard with a success flag
    return NextResponse.redirect(`${process.env.APP_URL}/social-media-agent?connection=success`);

  } catch (error: any) {
    console.error("[Meta Auth Error]:", error);
    return NextResponse.redirect(`${process.env.APP_URL}/social-media-agent?connection=error`);
  }
}