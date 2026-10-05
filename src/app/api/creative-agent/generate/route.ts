// riwaa/src/app/api/creative-agent/generate/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createCreativeAgentInStrapi } from '@/lib/creative-agent/strapi';
import { creativeAgentQueue } from '@/workers/queue';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brand_name,
      category,
      campaign_data,
      usps,
      logo_light_id,
      logo_dark_id,
      background_image_ids
    } = body;

    if (!brand_name || !category || !background_image_ids || !background_image_ids.length) {
      return NextResponse.json(
        { error: 'Missing required fields (brand_name, category, background_image_ids)' },
        { status: 400 }
      );
    }

    const activeWorkersCount = await creativeAgentQueue.getWorkersCount();
    if (activeWorkersCount === 0) {
      return NextResponse.json(
        { error: 'The AI Creative Swarm is currently offline or rebooting. Please try again in a few moments.' },
        { status: 503 }
      );
    }

    console.log(`[API] Triggering Copywriter Agent...`);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // THE SMART COPY INTERCEPTOR
    const copyPrompt = `You are an elite luxury real estate copywriter. Your job is to take raw, unpolished client notes and transform them into premium, eye-catching ad copy for a static image advertisement.
    
    RAW CLIENT NOTES:
    Brand: ${brand_name}
    Category: ${category}
    Location: ${campaign_data?.location || 'Not specified'}
    Starting Price: ${campaign_data?.starting_price || 'Not specified'}
    USPs: ${usps?.join(', ') || 'Luxury living'}

    TASK: Write a punchy 3-5 word Headline, a persuasive 1-sentence Subheadline (MAXIMUM 10 WORDS), and a short 2-3 word Call to Action (CTA).
    Return ONLY a valid JSON object with the keys "headline", "subheadline", and "cta".`;

    const copyRes = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview', // or gemini-2.5-flash for faster pre-processing
      contents: [copyPrompt],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    let generatedCopy = { headline: "Luxury Living", subheadline: "Discover your dream home today.", cta: "Learn More" };
    try {
      const cleanedJson = (copyRes.text || '{}').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      generatedCopy = JSON.parse(cleanedJson);
      console.log(`[API] Copywriter output:`, generatedCopy);
    } catch (e) {
      console.error('[API] Failed to parse AI copy, using fallback.', e);
    }

    const generatedSlug = `${brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    // 1. Create record with the pre-generated AI copy
    const record = await createCreativeAgentInStrapi({
      brand_name,
      category,
      campaign_data: campaign_data || {},
      usps: usps || [],
      logo_light: logo_light_id || null,
      logo_dark: logo_dark_id || null,
      background_images: background_image_ids,
      report_status: 'processing',
      slug: generatedSlug,
      ai_copy: generatedCopy // Save it immediately so the UI and worker both have it
    });

    const documentId = record.documentId || record.id;
    console.log(`[API] Dispatching Swarm for Document ${documentId}...`);

    for (const imageId of background_image_ids) {
      await creativeAgentQueue.add('generate-creative', { documentId, imageId });
    }

    return NextResponse.json({
      success: true,
      documentId,
      expectedCount: background_image_ids.length
    });

  } catch (error: any) {
    console.error('[Creative Agent API] Failed to initiate generation:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}