// lib/ai/enrichment.ts
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/supabase/admin';
import { logger as defaultLogger } from '@/lib/logs/logger';
import type { Logger } from 'pino';

// Initialize the new Gemini AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function enrichStreamItemWithAI(streamItemId: string, content: string, parentLogger: Logger = defaultLogger) {
  const startTime = Date.now();

  // Create a localized child logger for this specific execution
  const enrichmentLogger = parentLogger.child({
    module: 'ai_enrichment',
    streamItemId
  });

  try {
    enrichmentLogger.debug({ event: 'gemini_api_call_started', contentLength: content?.length ?? 0 });

    // 1. Call Gemini with strict JSON enforcement
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `
        You are an elite, highly professional customer support representative for 'Relaam', Abu Dhabi's premier real estate and property management company. 
        Relaam manages over 50,000 units and is known for delivering a modern, intelligent, and premium tenant experience rooted in care and operational excellence.
        
        Analyze the following customer comment from social media: "${content}"
        
        Provide exactly two things in a strict JSON format:
        1. "sentiment": Strictly choose one of these three words: "positive", "neutral", or "negative".
        2. "reply_draft": A short, highly professional, and helpful suggested reply to the customer on behalf of Relaam (under 2 sentences). The tone must be sophisticated, empathetic, welcoming, and solution-oriented.
      `,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = aiResponse.text;
    if (!responseText) throw new Error("Gemini returned an empty response.");

    // 2. Parse the guaranteed JSON response
    const aiData = JSON.parse(responseText.trim());

    enrichmentLogger.debug({ event: 'gemini_api_call_success', sentiment: aiData.sentiment });

    // 3. Update the specific row in Supabase
    const { error } = await supabase
      .from('stream_items')
      .update({
        sentiment: aiData.sentiment || 'neutral',
        ai_suggestion: aiData.reply_draft || null
      })
      .eq('id', streamItemId);

    if (error) throw new Error(`Database error: ${error.message}`);

    enrichmentLogger.info({
      event: 'ai_enrichment_completed',
      durationMs: Date.now() - startTime,
      sentiment: aiData.sentiment
    });

    return aiData;
  } catch (error) {
    enrichmentLogger.error({
      err: error,
      event: 'ai_enrichment_failed',
      durationMs: Date.now() - startTime
    }, `Failed to process item ${streamItemId}`);

    throw error;
  }
}

export async function enrichBatchWithAI(reviews: { id: string; content: string }[]) {
  const prompt = `
    You are an expert customer experience analyzer. I am providing you with a JSON array of ${reviews.length} social media comments/reviews.
    
    For each review, determine the sentiment (positive, neutral, negative, or inquiry) and draft a highly professional, contextual 1-2 sentence response.

    You must return a JSON array of objects. Each object MUST contain:
    - "id": The exact ID provided in the input.
    - "sentiment": The determined sentiment.
    - "ai_suggestion": The drafted response.

    Input Data:
    ${JSON.stringify(reviews)}
  `;

  try {
    // New SDK syntax: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        // CRITICAL: Forces the new SDK to return pure JSON
        responseMimeType: 'application/json',
      }
    });

    // The new SDK exposes the text directly via .text (no function call needed)
    const responseText = response.text;

    // Parse the pure JSON string directly into a TypeScript array
    if (!responseText) {
      throw new Error("Gemini returned an empty response");
    }

    const enrichedData = JSON.parse(responseText);
    return enrichedData;

  } catch (error) {
    console.error("Gemini Batch Enrichment Error:", error);
    throw error;
  }
}