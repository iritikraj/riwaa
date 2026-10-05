/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getCreativeAgentById } from '@/lib/creative-agent/strapi';
import { creativeAgentQueue } from '@/workers/queue';

export async function POST(req: NextRequest) {
  try {
    const { documentId, format } = await req.json();

    if (!documentId || !format) {
      return NextResponse.json({ error: 'Missing documentId or format' }, { status: 400 });
    }

    // 1. Fetch the master campaign to get the background images
    const agentData = await getCreativeAgentById(documentId);
    if (!agentData || !agentData.background_images) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const currentVariationsCount = agentData.generated_creatives?.variations?.length || 0;
    const bgImages = agentData.background_images;

    console.log(`[Resize API] Queuing ${bgImages.length} new jobs for format ${format}...`);

    // 2. Dispatch jobs with the specific format override
    for (const bg of bgImages) {
      await creativeAgentQueue.add('generate-creative', {
        documentId,
        imageId: bg.id,
        format // Pass the new format (e.g., '1080x1920')
      });
    }

    // 3. Tell the frontend to resume polling until the new total is reached
    const expectedTotalCount = currentVariationsCount + bgImages.length;

    return NextResponse.json({
      success: true,
      expectedCount: expectedTotalCount
    });

  } catch (error: any) {
    console.error('[Resize API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}