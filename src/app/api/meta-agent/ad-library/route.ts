/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/api/meta-agent/ad-library/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/meta-agent/auth-guard';
import { fetchMetaAccountFromStrapi } from '@/lib/meta-agent/strapi';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { withLogger } from '@/utils/logs/withLogger';

export const GET = withLogger('/api/meta-agent/ad-library', async (req: NextRequest, routeLogger) => {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = new URL(req.url).searchParams;
    const accountId = searchParams.get('accountId');
    const searchTerms = searchParams.get('q');
    const country = searchParams.get('country') || 'US';
    const adType = searchParams.get('type') || 'POLITICAL_AND_ISSUE_ADS';

    if (!accountId || !searchTerms) {
      return NextResponse.json({ error: 'accountId and search query (q) are required' }, { status: 400 });
    }

    routeLogger.info({ event: 'ad_library_search_started', searchTerms, country }, 'Starting Meta Ad Library search');

    // 1. Get the authorized account to securely retrieve its access token
    const metaAccount = await fetchMetaAccountFromStrapi(accountId);
    if (!metaAccount || !metaAccount.access_token) {
      return NextResponse.json({ error: 'Meta account not found or missing access token' }, { status: 404 });
    }

    // 2. Initialize Meta Client with the tenant's token
    const meta = new MetaClient({
      accessToken: metaAccount.access_token,
      adAccountId: metaAccount.ad_account_id
    });

    // 3. Fetch from Ad Library
    const ads = await meta.searchAdLibrary(searchTerms, country, adType);

    routeLogger.info({ event: 'ad_library_search_success', count: ads.length }, 'Successfully fetched Ad Library data');

    return NextResponse.json({ success: true, data: ads });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'ad_library_search_error' }, 'Failed to search Ad Library');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});