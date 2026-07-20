/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { saveAuditToStrapi } from '@/lib/seo-agent/strapi';
import { withLogger } from '@/lib/logs/withLogger';
import { aiAuditQueue } from '@/lib/seo-agent/queue'; // ✅ Only need AI Queue here

export const POST = withLogger('/api/seo-agent/audit/save-batch', async (req: NextRequest, routeLogger) => {
  try {
    const { rootDomain, industry } = await req.json();

    routeLogger.info({ event: 'batch_save_started', rootDomain }, 'Saving batch data to Strapi...');

    const strapiRecord = await saveAuditToStrapi({
      target_url: rootDomain,
      industry: industry || 'General Business',
      audit_data: {
        is_batch: true,
        total_urls_scanned: 0,
        results: []
      },
      audit_status: 'processing', // Keeps the UI in loading mode
    });

    const validId = strapiRecord.documentId || strapiRecord.data?.documentId || strapiRecord.id;

    try {
      routeLogger.info({ event: 'queue_attempt' }, 'Triggering AI Worker First...');

      await aiAuditQueue.add('audit-page', {
        url: rootDomain,
        documentId: validId,
        industry: industry || 'General Business'
      });

    } catch (redisError: any) {
      console.error({ redisError });
      routeLogger.warn('Redis skipped.');
    }

    return NextResponse.json({ success: true, documentId: validId });

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