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

    // Generate a URL-safe, unique slug based on the brand name
    const generatedSlug = `${brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    // 0. GUARD: Check if any background workers are actually alive and listening
    const activeWorkersCount = await creativeAgentQueue.getWorkersCount();
    const activeWorkers = await creativeAgentQueue.getActive();
    const getWaitingCount = await creativeAgentQueue.getWaitingCount();
    console.log({ activeWorkersCount, activeWorkers, getWaitingCount });

    if (activeWorkersCount === 0) {
      return NextResponse.json(
        { error: 'The AI Creative Swarm is currently offline or rebooting. Please try again in a few moments.' },
        { status: 503 } // 503 Service Unavailable
      );
    }

    // 1. Create a placeholder record in Strapi to track the job status
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
    });

    const documentId = record.documentId || record.id;

    console.log(`[API] Dispatching Swarm for Document ${documentId}...`);

    // 2. DISPATCH THE SWARM: Explicitly add jobs one by one to guarantee Redis delivery
    const addedJobIds = [];
    for (const imageId of background_image_ids) {
      const job = await creativeAgentQueue.add('generate-creative', {
        documentId,
        imageId
      });
      addedJobIds.push(job.id);
      console.log(`[API] Successfully pushed Job ${job.id} to Redis for Image ${imageId}`);
    }

    // Check if the jobs actually stuck in Redis
    const getWaitingCountAfter = await creativeAgentQueue.getWaitingCount();
    console.log(`[API] Redis confirms ${getWaitingCountAfter} jobs are now waiting in the queue.`);

    // 3. Return the Document ID and the expected count so the frontend knows when polling is finished
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