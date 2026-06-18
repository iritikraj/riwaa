/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/lib/logs/withLogger';
import { promises as fs } from 'fs';
import path from 'path';

export const POST = withLogger('/api/demo-google-maps', async (req: NextRequest, routeLogger) => {
  const { maxReviews = 15 } = await req.json();

  routeLogger.info({ event: 'local_gmaps_demo_started', maxReviews });

  try {
    // 1. Read the local JSON file
    // Adjust this path if your folder structure is slightly different!
    const filePath = path.join(process.cwd(), 'src', 'config', 'data', 'gmaps-data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const items = JSON.parse(fileContents);

    // 2. Filter out empty ratings
    const allTextReviews = items.data;

    routeLogger.info({
      event: 'local_json_filtering_completed',
      totalItemsInFile: items.length,
      finalTextReviewCount: allTextReviews.length,
      // officeDistribution: reviewsPerOffice
    });

    return NextResponse.json({ success: true, data: allTextReviews });

  } catch (error) {
    routeLogger.error({ err: error }, 'Failed to process local JSON file');
    return NextResponse.json({ error: 'Failed to load local demo data' }, { status: 500 });
  }
});

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from 'next/server';
// import { ApifyClient } from 'apify-client';
// import { withLogger } from '@/lib/logs/withLogger';

// export const POST = withLogger('/api/demo-google-maps', async (req: NextRequest, routeLogger) => {
//   // 1. Accept 'placeUrls' array instead of a single string
//   const { placeUrls, maxReviews = 15 } = await req.json();

//   if (!process.env.APIFY_GMAPS_KEY) {
//     routeLogger.error('APIFY_GMAPS_KEY is missing from .env');
//     return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
//   }

//   routeLogger.info({ event: 'apify_gmaps_demo_started', numLocations: placeUrls?.length, maxReviews });

//   const client = new ApifyClient({
//     token: process.env.APIFY_GMAPS_KEY,
//   });

//   const input = {
//     // 2. Map the array of strings into Apify's required { url: string } object format
//     startUrls: placeUrls.map((url: string) => ({ url })),
//     maxReviews: maxReviews, // Apify applies this limit PER URL!
//     reviewsSort: "newest",
//     language: "en",
//     personalData: true
//   };

//   try {
//     const run = await client.actor("Xb8osYTtOjlsgI6k9").call(input);
//     routeLogger.info({ event: 'apify_run_completed', datasetId: run.defaultDatasetId });

//     const { items } = await client.dataset(run.defaultDatasetId).listItems();

//     // NEW: Filter out empty star ratings, then map the text reviews
//     const formattedItems = items
//       .filter((review: any) => review.text && review.text.trim().length > 0)
//       .map((review: any) => ({
//         id: `demo-${review.reviewId || Math.random().toString()}`,
//         channel_id: 'demo-google-maps',
//         external_id: review.reviewId,
//         sender_username: review.name || 'Google Maps User',
//         content: review.text.trim(), // Guaranteed to have clean text now
//         sentiment: 'unassigned',
//         ai_suggestion: null,
//         is_replied: false,
//         received_at: review.publishedAtDate || new Date().toISOString(),
//         // NEW: Chain common Apify keys, and provide a guaranteed fallback URL!
//         permalink_url: review.reviewUrl || review.shareUrl || review.reviewLink || review.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.name + " review")}`,
//         channels: {
//           platform: 'google_maps',
//         }
//       }));

//     routeLogger.info({
//       event: 'apify_filtering_completed',
//       originalCount: items.length,
//       textReviewCount: formattedItems.length
//     });

//     return NextResponse.json({ success: true, data: formattedItems });

//   } catch (error) {
//     routeLogger.error({ err: error }, 'Apify execution failed');
//     return NextResponse.json({ error: 'Failed to fetch Google Maps demo data' }, { status: 500 });
//   }
// });