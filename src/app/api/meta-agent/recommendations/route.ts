// riwaa/src/app/api/meta-agent/recommendations/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getPendingRecommendations } from '@/lib/meta-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

export const GET = withLogger('/api/meta-agent/recommendations', async (req: NextRequest, routeLogger) => {
  try {
    routeLogger.info({ event: 'fetch_pending_recommendations_started' }, 'Fetching pending AI recommendations from Strapi');

    const data = await getPendingRecommendations();

    routeLogger.info({ event: 'fetch_pending_recommendations_success', count: data?.length || 0 }, 'Successfully fetched pending recommendations');

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_pending_recommendations_error' }, 'Failed to fetch pending recommendations');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});