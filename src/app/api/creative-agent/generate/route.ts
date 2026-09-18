/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createCreativeAgentInStrapi } from '@/lib/creative-agent/strapi';
import { creativeAgentQueue } from '@/workers/queue';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brand_name,
      category,
      campaign_data,
      usps,
      logo_id,
      background_image_id
    } = body;

    if (!brand_name || !category || !background_image_id) {
      return NextResponse.json(
        { error: 'Missing required fields (brand_name, category, background_image_id)' },
        { status: 400 }
      );
    }

    // Generate a URL-safe, unique slug based on the brand name
    const generatedSlug = `${brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    // 1. Create a placeholder record in Strapi to track the job status
    const record = await createCreativeAgentInStrapi({
      brand_name,
      category,
      campaign_data: campaign_data || {},
      usps: usps || [],
      logo: logo_id || null,
      background_image: background_image_id,
      report_status: 'processing',
      slug: generatedSlug,
    });

    const documentId = record.documentId || record.id;

    // 2. Dispatch the job to the BullMQ worker
    await creativeAgentQueue.add('generate-creative', {
      documentId,
    });

    // 3. Return the Document ID so the frontend can start polling for completion
    return NextResponse.json({ success: true, documentId });

  } catch (error: any) {
    console.error('[Creative Agent API] Failed to initiate generation:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}