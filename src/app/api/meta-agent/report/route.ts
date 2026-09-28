// riwaa/src/app/api/meta-agent/report/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { createAuditLog, createMetaAdsReport } from '@/lib/meta-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

// Helper to safely parse Meta API string numbers
function toFloat(v: any) {
  const parsed = parseFloat(v);
  return isNaN(parsed) ? 0 : parsed;
}

export const GET = withLogger('/api/meta-agent/report', async (req: NextRequest, routeLogger) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const datePreset = searchParams.get('datePreset') || 'last_30d';
    const clientName = searchParams.get('clientName') || 'Internal Account';

    routeLogger.info({ event: 'report_generation_started', clientName, datePreset }, 'Starting Meta Ads report generation');

    const meta = new MetaClient();
    const ai = new AiAgent();

    // 1. Fetch raw campaign insights from Facebook
    const insights = await meta.getAccountInsights(datePreset, 'campaign');
    routeLogger.info({ event: 'meta_insights_fetched', count: insights.length }, 'Successfully fetched campaign insights from Meta');

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
    routeLogger.info({ event: 'ai_narrative_generation_started' }, 'Drafting narrative report with Gemini');
    const reportText = await ai.writeReport(aggregatedMetrics, datePreset, clientName);
    routeLogger.info({ event: 'ai_narrative_generation_success' }, 'Successfully generated AI narrative');

    // 4. Save the historical report to Strapi via our helper
    await createMetaAdsReport({
      client_name: clientName,
      date_preset: datePreset,
      metrics: aggregatedMetrics,
      markdown_content: reportText
    });
    routeLogger.info({ event: 'report_saved_strapi' }, 'Archived report securely to Strapi');

    // 5. Log the generation event in Strapi
    await createAuditLog('report_generated', { datePreset, clientName, metrics: aggregatedMetrics });
    routeLogger.info({ event: 'report_audit_log_created' }, 'Created audit log entry for report generation');

    return NextResponse.json({
      success: true,
      report: reportText,
      metrics: aggregatedMetrics
    });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'report_generation_error' }, 'Failed to generate Meta Ads report');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});