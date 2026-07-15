/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { saveAuditToStrapi } from '@/lib/seo-agent/strapi';
import { withLogger } from '@/lib/logs/withLogger';
// import { spiderQueue } from '@/lib/seo-agent/queue';

export const POST = withLogger('/api/seo-agent/audit/save-batch', async (req: NextRequest, routeLogger) => {
  try {
    const { rootDomain, industry, batchResults } = await req.json();

    // routeLogger.info({ event: 'batch_save_started', rootDomain }, 'Saving batch...');
    routeLogger.info({ event: 'batch_save_started', rootDomain }, 'Saving batch data to Strapi...');

    const strapiRecord = await saveAuditToStrapi({
      target_url: rootDomain,
      industry: industry || 'General Business',
      audit_data: {
        is_batch: true,
        total_urls_scanned: batchResults.length,
        results: batchResults
      },
      audit_status: 'completed',
    });

    // 2. 🛑 TEMPORARILY COMMENTED OUT THE BACKGROUND SPIDER TRIGGER
    /*
    try {
      routeLogger.info({ event: 'spider_queue_attempt' }, 'Triggering Spider...');
      await spiderQueue.add('crawl-domain', { startUrl: rootDomain, industry, documentId: strapiRecord.id });
    } catch (redisError: any) {
      routeLogger.warn('Redis skipped.');
    }
    */

    // 3. Instantly return success to the frontend so the loader disappears
    return NextResponse.json({ success: true, documentId: strapiRecord.id });

  } catch (error: any) {
    routeLogger.error({ err: error }, 'Batch Save Error');
    return NextResponse.json({ error: 'Failed to save batch' }, { status: 500 });
  }
});

/*
import { NextRequest, NextResponse } from 'next/server';
import { saveAuditToStrapi } from '@/lib/seo-agent/strapi';
import { withLogger } from '@/lib/logs/withLogger';
import { spiderQueue } from '@/lib/seo-agent/queue';

export const POST = withLogger('/api/seo-agent/audit/save-batch', async (req: NextRequest, routeLogger) => {
  try {
    const { rootDomain, industry, batchResults } = await req.json();

    routeLogger.info({ event: 'batch_save_started', rootDomain }, 'Saving batch...');

    const strapiRecord = await saveAuditToStrapi({
      target_url: rootDomain,
      industry: industry || 'General Business',
      audit_data: {
        is_batch: true,
        total_urls_scanned: batchResults.length,
        results: batchResults
      },
      audit_status: 'completed',
    });

    // We drop the job into Redis and immediately move on. We do NOT await it.
    await spiderQueue.add('crawl-domain', {
      startUrl: rootDomain,
      industry,
      documentId: strapiRecord.id // Passing the Strapi ID so the worker can update it later
    });

    routeLogger.info({ event: 'spider_queued', rootDomain }, 'Background spider successfully queued in Redis.');

    return NextResponse.json({ success: true, documentId: strapiRecord.id });

  } catch (error: any) {
    routeLogger.error({ err: error }, 'Batch Save Error');
    return NextResponse.json({ error: 'Failed to save batch' }, { status: 500 });
  }
});
*/