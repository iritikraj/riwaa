/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';

export async function GET() {
  try {
    // Pass true for dry_run to ensure we are completely safe
    const meta = new MetaClient(true);

    // 1. Fetch campaigns
    const campaigns = await meta.getCampaigns();
    const topCampaigns = campaigns.slice(0, 5).map((c: any) => ({
      id: c.id,
      name: c.name,
      status: c.status,
    }));

    // 2. Fetch last 7 days insights
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
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to connect to Meta API'
    }, { status: 500 });
  }
}