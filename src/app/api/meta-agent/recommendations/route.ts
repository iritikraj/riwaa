// riwaa/src/app/api/meta-agent/recommendations/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getPendingRecommendations } from '@/lib/meta-agent/strapi';
import { getSessionUser, getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';
import { withLogger } from '@/utils/logs/withLogger';

export const GET = withLogger('/api/meta-agent/recommendations', async (req: NextRequest, routeLogger) => {
  try {
    // 1. Authenticate the session
    const user = await getSessionUser();

    // 2. Extract accountId from query params
    const accountId = req.nextUrl.searchParams.get('accountId');

    if (!accountId) {
      routeLogger.warn({ event: 'fetch_pending_recommendations_missing_accountId' }, 'accountId missing from request query params');
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    // 3. Verify user has access to this specific account
    await getAuthorizedMetaAccount(accountId);

    routeLogger.info({ event: 'fetch_pending_recommendations_started', accountId }, 'Fetching pending AI recommendations from Strapi');

    // 4. Fetch recommendations explicitly scoped to this accountId
    const data = await getPendingRecommendations(accountId);

    routeLogger.info({ event: 'fetch_pending_recommendations_success', count: data?.length || 0, accountId }, 'Successfully fetched pending recommendations');

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_pending_recommendations_error' }, 'Failed to fetch pending recommendations');
    const status = error.message.includes('Forbidden') || error.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
});