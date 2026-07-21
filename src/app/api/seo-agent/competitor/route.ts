/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { saveCompetitorAuditToStrapi } from '@/lib/seo-agent/strapi'; // We will build this in the next step
import { withLogger } from '@/lib/logs/withLogger';
import { competitorQueue } from '@/lib/seo-agent/queue'; // We will add this to queue.ts next

export const POST = withLogger('/api/seo-agent/competitor', async (req: NextRequest, routeLogger) => {
  try {
    // 1. Accept the target URL and an array of Competitor URLs
    const { targetUrl, competitorUrls, industry } = await req.json();

    routeLogger.info({ event: 'competitor_save_started', targetUrl }, 'Saving initial competitor batch to Strapi...');

    // 2. Create the placeholder document in Strapi (Status: processing)
    const strapiRecord = await saveCompetitorAuditToStrapi({
      target_url: targetUrl,
      competitor_urls: competitorUrls, // Array of strings e.g. ["https://famproperties.com/..."]
      industry: industry || 'General Business',
      audit_data: {
        results: {} // Will be populated with the JSON layout we discussed later
      },
      audit_status: 'processing',
    });

    // Handle both Strapi v4 and v5 ID structures safely
    const validId = strapiRecord.documentId || strapiRecord.data?.documentId || strapiRecord.id;

    try {
      routeLogger.info({ event: 'queue_attempt' }, 'Triggering Competitor AI Worker...');

      // 3. Dispatch a single Master Job to the queue
      await competitorQueue.add('compare-pages', {
        targetUrl,
        competitorUrls,
        documentId: validId,
        industry: industry || 'General Business'
      });

    } catch (redisError: any) {
      console.error({ redisError });
      routeLogger.warn('Redis skipped.');
    }

    // 4. Return the ID so the frontend can redirect to the loading screen
    return NextResponse.json({ success: true, documentId: validId });

  } catch (error: any) {
    routeLogger.error({ err: error }, 'Competitor Batch Save Error');
    return NextResponse.json({ error: 'Failed to initiate competitor analysis' }, { status: 500 });
  }
});