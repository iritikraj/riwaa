import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enrichStreamItemWithAI } from '@/config/ai/data-enrichment';
import { withLogger } from '@/lib/logs/withLogger';

// CRITICAL: Use the SERVICE_ROLE key to bypass Row Level Security (RLS) for background jobs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Vercel Cron uses GET requests by default
export const GET = withLogger('/api/social-media-agent/cron/auto-enrich', async (req, routeLogger) => {

  // 1. (Optional but recommended) Security Check
  // Ensure only your cron scheduler can trigger this endpoint
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    routeLogger.warn('Unauthorized cron invocation attempted');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  routeLogger.info({ event: 'cron_enrichment_started' });

  try {
    // 2. Fetch a batch of 15 unenriched items
    // Assuming your table is named 'stream_items' and default sentiment is 'unassigned'
    const { data: unenrichedItems, error } = await supabaseAdmin
      .from('stream_items')
      .select('id, content')
      .eq('sentiment', 'unassigned')
      .limit(15);

    if (error) throw error;

    // 3. Exit early if the queue is empty
    if (!unenrichedItems || unenrichedItems.length === 0) {
      routeLogger.info({ event: 'cron_enrichment_empty_queue' });
      return NextResponse.json({ success: true, message: 'All caught up! No items to enrich.' });
    }

    routeLogger.info({ event: 'cron_processing_batch', count: unenrichedItems.length });

    const results = [];

    // 4. Process sequentially to respect OpenAI/Claude rate limits
    for (const item of unenrichedItems) {
      try {
        // We use your existing function that calls the AI AND saves to Supabase
        await enrichStreamItemWithAI(item.id, item.content);
        results.push({ id: item.id, status: 'success' });

        // Optional: Add a tiny 1-second delay between calls to be extra safe against rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (err) {
        routeLogger.error({ err, streamItemId: item.id, event: 'cron_item_failed' });
        results.push({ id: item.id, status: 'failed' });
      }
    }

    routeLogger.info({ event: 'cron_enrichment_completed', results });
    return NextResponse.json({ success: true, processed: results.length, results });

  } catch (error) {
    routeLogger.error({ err: error, event: 'cron_fatal_error' });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});