import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/supabase/admin';

// Initialize Gemini AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;

// 1. HANDLE META WEBHOOK VERIFICATION (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Webhook] Verification successful.");
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// 2. PROCESS INCOMING DATA STREAM (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== 'page' && body.object !== 'instagram') {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Process entries. Meta handles webhooks asynchronously on their end,
    // but expects a fast 200 OK response from your server within seconds.
    for (const entry of body.entry) {
      const platformAccountId = entry.id; // Page ID or Instagram Account ID
      const changes = entry.changes;

      if (!changes) continue;

      for (const change of changes) {
        let commentId = "";
        let content = "";
        let senderId = "";
        let senderUsername = "";
        const platform: 'facebook' | 'instagram' = body.object === 'page' ? 'facebook' : 'instagram';

        // Extracting Facebook Comments
        if (platform === 'facebook' && change.field === 'feed' && change.value.item === 'comment') {
          commentId = change.value.comment_id;
          content = change.value.message;
          senderId = change.value.from?.id;
          senderUsername = change.value.from?.name || "FB User";

          // Skip if the comment was made by the page itself to avoid infinite loops
          if (senderId === platformAccountId) continue;
        }

        // Extracting Instagram Comments
        if (platform === 'instagram' && change.field === 'comments') {
          commentId = change.value.id;
          content = change.value.text;
          senderId = change.value.from?.id;
          senderUsername = change.value.from?.username || "IG User";

          // Meta webhook payloads don't always contain the IG account ID in the "from" object 
          // but if it matches the platform account, skip it.
          if (senderId === platformAccountId) continue;
        }

        // If we found a valid comment event, process it
        if (commentId && content) {
          // Execution is passed to a background process so Meta gets a fast 200 response code
          processCommentWorkflow(platform, platformAccountId, commentId, content, senderId, senderUsername)
            .catch((err) => console.error(`[Workflow Error] ID ${commentId}:`, err));
        }
      }
    }

    // Always return 200 OK immediately to stop Meta from retrying the payload
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("[Webhook Critical Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// 3. CORE WORKFLOW: LOOKUP -> UPSERT (IDEMPOTENCY) -> AI ANALYSIS -> SEAMLESS UPDATE
async function processCommentWorkflow(
  platform: 'facebook' | 'instagram',
  platformAccountId: string,
  commentId: string,
  content: string,
  senderId: string,
  senderUsername: string
) {
  // Step A: Find the tenant workspace channel
  const { data: channel, error: channelErr } = await supabase
    .from('channels')
    .select('id')
    .eq('platform', platform)
    .eq('platform_account_id', platformAccountId)
    .eq('is_active', true)
    .single();

  if (channelErr || !channel) {
    console.warn(`[Webhook Warning] Active channel not found for platform asset ${platformAccountId}`);
    return;
  }

  // Step B: Multi-tenant Idempotent Upsert to avoid duplicate rows from Meta retry bursts
  const { data: streamItem, error: upsertErr } = await supabase
    .from('stream_items')
    .upsert(
      {
        channel_id: channel.id,
        external_id: commentId,
        sender_platform_id: senderId,
        sender_username: senderUsername,
        content: content,
        sentiment: 'unassigned',
        received_at: new Date().toISOString(),
      },
      { onConflict: 'external_id' }
    )
    .select()
    .single();

  if (upsertErr || !streamItem) {
    console.error(`[Database Error] Failed to upsert interaction stream item:`, upsertErr);
    return;
  }

  // If the stream item was already processed and replied to, don't waste AI tokens
  if (streamItem.is_replied) return;

  // Step C: Run Gemini Sentiment and Response Generation
  try {
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `
        You are an elite, highly professional customer support representative for 'Relaam', Abu Dhabi's premier real estate and property management company. 
        Relaam manages over 50,000 units and is known for delivering a modern, intelligent, and premium tenant experience rooted in care and operational excellence.

        Analyze this social media comment.
        1. Classify sentiment strictly into one of these categories: positive, negative, neutral.
        2. Draft a context-aware, highly personalized response that addresses the comment directly.

        Comment Text: "${content}"
        Platform: ${platform}
        Sender: @${senderUsername}

        Return your analysis strictly as a valid JSON object matching the schema below. Do not wrap it in markdown code blocks.
        
        {
          "sentiment": "positive" | "negative" | "neutral",
          "suggestion": "string"
        }
      `,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = aiResponse.text;
    if (!responseText) return;

    const parsedAiData = JSON.parse(responseText.trim());

    // Step D: Update the Stream Item with AI insights
    const { error: updateErr } = await supabase
      .from('stream_items')
      .update({
        sentiment: parsedAiData.sentiment || 'neutral',
        ai_suggestion: parsedAiData.suggestion || null
      })
      .eq('id', streamItem.id);

    if (updateErr) {
      console.error(`[Database Error] Failed to update AI payload for item ${streamItem.id}:`, updateErr);
    } else {
      console.log(`[Success] Comment ${commentId} processed. Sentiment: ${parsedAiData.sentiment}`);
    }

  } catch (aiError) {
    console.error(`[AI Engine Error] Processing failed for comment ${commentId}:`, aiError);
  }
}