// riwaa/src/app/api/meta-agent/test-connection/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { getSessionUser, getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate the session
    const user = await getSessionUser();

    // 2. Extract accountId from query params
    const accountId = req.nextUrl.searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    // 3. Verify access for this specific account
    const metaAccount = await getAuthorizedMetaAccount(accountId);

    // 4. Instantiate isolated MetaClient (pass true for dry_run to ensure safety)
    const meta = new MetaClient({
      accessToken: metaAccount.access_token,
      adAccountId: metaAccount.ad_account_id
    }, true);

    // 5. Fetch campaigns
    const campaigns = await meta.getCampaigns();
    const topCampaigns = campaigns.slice(0, 5).map((c: any) => ({
      id: c.id,
      name: c.name,
      status: c.status,
    }));

    // 6. Fetch last 7 days insights
    const insights = await meta.getAccountInsights('last_7d', 'campaign');
    const totalSpend = insights.reduce((sum: number, i: any) => sum + parseFloat(i.spend || '0'), 0);

    return NextResponse.json({
      success: true,
      message: 'Connection check passed!',
      data: {
        total_campaigns_found: campaigns.length,
        showing_top_5: topCampaigns,
        last_7_days_spend: `$${totalSpend.toFixed(2)}`,
      }
    });

  } catch (error: any) {
    console.error('Meta API Connection Failed:', error);
    const status = error.message.includes('Forbidden') || error.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to connect to Meta API'
    }, { status });
  }
}