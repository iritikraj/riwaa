// riwaa/src/app/api/google-agent/accounts/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchActiveGoogleAccounts } from '@/lib/google-ads-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

export const GET = withLogger('/api/google-agent/accounts', async (req: NextRequest, routeLogger) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('riwaa_session')?.value;

    if (!token) {
      routeLogger.warn({ event: 'fetch_accounts_unauthorized' }, 'Unauthorized access attempt: No session token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    routeLogger.info({ event: 'fetch_accounts_attempt' }, 'Fetching active Google Ads accounts from Strapi');

    const accounts = await fetchActiveGoogleAccounts();

    routeLogger.info({ event: 'fetch_accounts_success', accountCount: accounts?.length || 0 }, 'Successfully retrieved Google Ads accounts');

    return NextResponse.json({ success: true, accounts });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_accounts_error' }, 'Failed to fetch Google Ads accounts due to an internal error');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});