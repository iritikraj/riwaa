/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enrichBatchWithAI } from '@/config/ai/data-enrichment';
import { withLogger } from '@/lib/logs/withLogger';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET = withLogger('/api/cron/auto-enrich', async (req, routeLogger) => {
  // Security Check
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  routeLogger.info({ event: 'cron_batch_enrichment_started' });

  try {
    // 1. Fetch up to 50 unenriched items
    const { data: unenrichedItems, error: fetchError } = await supabaseAdmin
      .from('stream_items')
      .select('id, content')
      .eq('sentiment', 'unassigned')
      .limit(50); // Increased batch size!

    if (fetchError) throw fetchError;

    if (!unenrichedItems || unenrichedItems.length === 0) {
      routeLogger.info({ event: 'cron_enrichment_empty_queue' });
      return NextResponse.json({ success: true, message: 'No items to enrich.' });
    }

    routeLogger.info({ event: 'ai_batch_processing_started', count: unenrichedItems.length });

    // 2. Make exactly ONE call to Gemini for all 50 items
    const enrichedResults = await enrichBatchWithAI(unenrichedItems);

    routeLogger.info({ event: 'ai_batch_processing_completed', parsedCount: enrichedResults.length });

    // 3. Update Supabase with the new data
    // We use Promise.all to run all the database updates concurrently, making it lightning fast
    const dbUpdateResults = await Promise.all(
      enrichedResults.map(async (item: any) => {
        try {
          const { error: updateErr } = await supabaseAdmin
            .from('stream_items')
            .update({
              sentiment: item.sentiment,
              ai_suggestion: item.ai_suggestion,
            })
            .eq('id', item.id);

          if (updateErr) throw updateErr;
          return { id: item.id, status: 'success' };
        } catch (dbErr) {
          routeLogger.error({ err: dbErr, streamItemId: item.id, event: 'db_update_failed' });
          return { id: item.id, status: 'failed' };
        }
      })
    );

    routeLogger.info({ event: 'cron_batch_enrichment_completed', results: dbUpdateResults });
    return NextResponse.json({ success: true, processed: dbUpdateResults.length, results: dbUpdateResults });

  } catch (error) {
    routeLogger.error({ err: error, event: 'cron_fatal_error' });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});