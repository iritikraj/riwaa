// riwaa/src/app/api/meta-agent/report/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { createAuditLog, createMetaAdsReport } from '@/lib/meta-agent/strapi';
import { getSessionUser, getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';
import { withLogger } from '@/utils/logs/withLogger';

// Helper to safely parse Meta API string numbers
function toFloat(v: any) {
  const parsed = parseFloat(v);
  return isNaN(parsed) ? 0 : parsed;
}

export const GET = withLogger('/api/meta-agent/report', async (req: NextRequest, routeLogger) => {
  try {
    const user = await getSessionUser();
    const searchParams = req.nextUrl.searchParams;
    const datePreset = searchParams.get('datePreset') || 'last_30d';
    const accountId = searchParams.get('accountId');

    if (!accountId) return NextResponse.json({ error: 'accountId is required' }, { status: 400 });

    const metaAccount = await getAuthorizedMetaAccount(accountId);

    // 1. SAFELY EXTRACT STRAPI DATA
    const attr = metaAccount.attributes || metaAccount;
    const safeAccountId = metaAccount.documentId || metaAccount.id;

    routeLogger.info({ event: 'report_generation_started', account: attr.name }, 'Starting Meta Ads report');

    // 2. PASS EXTRACTED CREDENTIALS
    const meta = new MetaClient({
      accessToken: attr.access_token,
      adAccountId: attr.ad_account_id,
      pageId: attr.page_id,
      pixelId: attr.pixel_id
    });

    const ai = new AiAgent();

    // 3. Fetch raw campaign insights from Facebook
    const insights = await meta.getAccountInsights(datePreset, 'campaign');
    routeLogger.info({ event: 'meta_insights_fetched', count: insights.length }, 'Successfully fetched campaign insights from Meta');

    // 4. Aggregate the metrics
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
        cpm: toFloat(i.cpm)
      };
    }).sort((a, b) => b.spend - a.spend);

    const aggregatedMetrics = {
      total_spend: Number(totalSpend.toFixed(2)),
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      blended_ctr: totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
      blended_cpc: totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(2)) : 0,
      campaign_count: perCampaign.length,
      per_campaign: perCampaign,
    };

    // 5. Generate the narrative report using Gemini
    routeLogger.info({ event: 'ai_narrative_generation_started' }, 'Drafting narrative report with Gemini');
    const reportText = await ai.writeReport(aggregatedMetrics, datePreset, attr.name);
    routeLogger.info({ event: 'ai_narrative_generation_success' }, 'Successfully generated AI narrative');

    // 6. Save the historical report to Strapi via our helper using safe variables
    await createMetaAdsReport({
      client_name: attr.name,
      date_preset: datePreset,
      metrics: aggregatedMetrics,
      markdown_content: reportText,
      meta_account: safeAccountId
    });
    routeLogger.info({ event: 'report_saved_strapi' }, 'Archived report securely to Strapi');

    // 7. Log the generation event in Strapi
    await createAuditLog('report_generated', { datePreset, metrics: aggregatedMetrics }, safeAccountId, user.id);
    routeLogger.info({ event: 'report_audit_log_created' }, 'Created audit log entry for report generation');

    return NextResponse.json({
      success: true,
      report: reportText,
      metrics: aggregatedMetrics
    });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'report_generation_error' }, 'Failed to generate Meta Ads report');
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Forbidden') ? 403 : 500 });
  }
});