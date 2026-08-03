// app/api/social-media-agent/stream/manual-enrichment/route.ts
import { enrichStreamItemWithAI, gmapsJsonAiEnrichment } from '@/config/ai/data-enrichment';
import { NextResponse } from 'next/server';
import { withLogger } from '@/lib/logs/withLogger';
import { updateLocalGmapsData } from '@/config/data/gmapsjson-update';

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

  try {
    let aiResult;
    if (String(streamItemId).startsWith('demo-')) {
      enrichmentLogger.info({ event: 'bypassing_db_for_demo_item' });
      aiResult = await gmapsJsonAiEnrichment(content);
      await updateLocalGmapsData(streamItemId, aiResult);
      aiResult = {
        sentiment: aiResult.sentiment,
        reply_draft: aiResult.reply_draft
      };
    } else {
      aiResult = await enrichStreamItemWithAI(streamItemId, content);
    }

    enrichmentLogger.info({ event: 'ai_enrichment_completed' });
    return NextResponse.json({ success: true, data: aiResult });

  } catch (error) {
    enrichmentLogger.error({ err: error, event: 'ai_enrichment_failed' });
    return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 });
  }
});