/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { createAuditLog, createMetaAdsReport } from '@/lib/meta-agent/strapi';

// Helper to safely parse Meta API string numbers
function toFloat(v: any) {
  const parsed = parseFloat(v);
  return isNaN(parsed) ? 0 : parsed;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const datePreset = searchParams.get('datePreset') || 'last_30d';
    const clientName = searchParams.get('clientName') || 'Internal Account';

    const meta = new MetaClient();
    const ai = new AiAgent();

    // 1. Fetch raw campaign insights from Facebook
    const insights = await meta.getAccountInsights(datePreset, 'campaign');

    // 2. Aggregate the metrics
    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;

    const perCampaign = insights.map((i: any) => {
      const spend = toFloat(i.spend);
      const impressions = toFloat(i.impressions);
      const clicks = toFloat(i.clicks);

      totalSpend += spend;
      totalImpressions += impressions;
      totalClicks += clicks;

      return {
        campaign_name: i.campaign_name,
        campaign_id: i.campaign_id,
        spend,
        impressions,
        clicks,
        ctr: toFloat(i.ctr),
        cpc: toFloat(i.cpc),
        cpm: toFloat(i.cpm),
      };
    });

    // Sort campaigns by spend descending to prioritize top movers in the report
    perCampaign.sort((a, b) => b.spend - a.spend);

    const aggregatedMetrics = {
      total_spend: Number(totalSpend.toFixed(2)),
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      blended_ctr: totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
      blended_cpc: totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(2)) : 0,
      campaign_count: perCampaign.length,
      per_campaign: perCampaign,
    };

    // 3. Generate the narrative report using Gemini
    const reportText = await ai.writeReport(aggregatedMetrics, datePreset, clientName);

    // 4. Save the historical report to Strapi via our helper
    // 4. Save the historical report to Strapi via our helper
    await createMetaAdsReport({
      client_name: clientName,
      date_preset: datePreset,
      metrics: aggregatedMetrics,
      markdown_content: reportText
    });

    // 5. Log the generation event in Strapi
    await createAuditLog('report_generated', { datePreset, clientName, metrics: aggregatedMetrics });

    return NextResponse.json({
      success: true,
      report: reportText,
      metrics: aggregatedMetrics
    });
  } catch (error: any) {
    console.error('Report Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}