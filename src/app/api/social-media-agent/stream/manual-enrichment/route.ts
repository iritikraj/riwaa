// app/api/social-media-agent/stream/manual-enrichment/route.ts
import { enrichStreamItemWithAI } from '@/config/ai/data-enrichment';
import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logs/withLogger';

// Wrap your async function with the logger!
export const POST = withLogger('/api/social-media-agent/stream/manual-enrichment', async (req, routeLogger) => {

  const { streamItemId, content } = await req.json();

  routeLogger.info({ event: 'manual_enrichment_request_received', streamItemId });

  if (!streamItemId || !content) {
    routeLogger.warn({ event: 'manual_enrichment_validation_failed', streamItemId });
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // We can still create nested child loggers if we want hyper-specific tracking
  const enrichmentLogger = routeLogger.child({ streamItemId });
  enrichmentLogger.info({ event: 'ai_enrichment_started' });

  const aiResult = await enrichStreamItemWithAI(streamItemId, content);

  enrichmentLogger.info({ event: 'ai_enrichment_completed' });

  return NextResponse.json({ success: true, data: aiResult });
});