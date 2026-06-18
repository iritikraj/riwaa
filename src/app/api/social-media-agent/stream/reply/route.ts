/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { streamItemId, message } = body;

    if (!streamItemId || !message) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Fetch the stream item along with its channel details (Multi-tenant token extraction)
    const { data: item, error: itemErr } = await supabase
      .from('stream_items')
      .select(`
        id,
        external_id,
        is_replied,
        channels (
          platform,
          encrypted_access_token
        )
      `)
      .eq('id', streamItemId)
      .single();

    if (itemErr || !item) {
      return NextResponse.json({ error: 'Interaction item not found' }, { status: 404 });
    }

    if (item.is_replied) {
      return NextResponse.json({ error: 'This comment has already been replied to' }, { status: 400 });
    }

    // Safely cast the joined channel object
    const channel = item.channels as any;
    const platform = channel.platform;
    const accessToken = channel.encrypted_access_token; // Decrypt here if you add encryption later

    let metaGraphUrl = "";

    // 2. Select the correct platform Graph API endpoint
    if (platform === 'instagram') {
      // Instagram replies edge
      metaGraphUrl = `https://graph.facebook.com/v21.0/${item.external_id}/replies`;
    } else if (platform === 'facebook') {
      // Facebook comments edge
      metaGraphUrl = `https://graph.facebook.com/v21.0/${item.external_id}/comments`;
    } else {
      return NextResponse.json({ error: 'Platform not supported for automated replies yet' }, { status: 400 });
    }

    // 3. Dispatch the message payload to Meta
    const metaResponse = await fetch(metaGraphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        access_token: accessToken
      })
    });

    const metaData = await metaResponse.json();

    if (metaData.error) {
      console.error("[Meta API Error]:", metaData.error);
      return NextResponse.json({ error: metaData.error.message }, { status: 502 });
    }

    // 4. Record the successful event transaction inside Supabase
    // Wrap both changes inside an independent try block or single transaction block
    const { error: replyLogErr } = await supabase
      .from('stream_replies')
      .insert({
        stream_item_id: streamItemId,
        external_reply_id: metaData.id,
        content: message,
        is_ai_generated: body.isAiGenerated || false
      });

    if (replyLogErr) console.error("[Database Error] Failed logging reply transaction:", replyLogErr);

    const { error: streamUpdateErr } = await supabase
      .from('stream_items')
      .update({ is_replied: true })
      .eq('id', streamItemId);

    if (streamUpdateErr) console.error("[Database Error] Failed marking item as replied:", streamUpdateErr);

    return NextResponse.json({ success: true, platformReplyId: metaData.id });

  } catch (error: any) {
    console.error("[Reply API Critical Error]:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}