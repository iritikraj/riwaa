// riwaa/src/app/api/meta-agent/setup/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { createAuditLog } from '@/lib/meta-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

export const POST = withLogger('/api/meta-agent/setup', async (req: NextRequest, routeLogger) => {
  try {
    const { brief } = await req.json();
    if (!brief) {
      routeLogger.warn({ event: 'campaign_setup_missing_brief' }, 'Brief is required but was missing from the request');
      return NextResponse.json({ error: 'Brief is required' }, { status: 400 });
    }

    routeLogger.info({ event: 'campaign_setup_started' }, 'Processing new AI campaign setup request');

    const ai = new AiAgent();
    const meta = new MetaClient();

    // 1. AI drafts the plan based on the brief
    routeLogger.info({ event: 'ai_drafting_started' }, 'Requesting campaign structure draft from Gemini');
    const plan = await ai.draftCampaignStructure(brief);

    routeLogger.info({ event: 'ai_drafting_success', campaignName: plan.campaign?.name }, 'AI successfully drafted campaign structure');
    await createAuditLog('campaign_plan_drafted', { brief, plan });

    // 2. Create the Campaign (Always Paused)
    routeLogger.info({ event: 'meta_campaign_creation_started' }, 'Pushing campaign shell to Meta Ads API');
    const campaignId = await meta.createCampaign(plan.campaign);

    routeLogger.info({ event: 'meta_campaign_creation_success', campaignId }, 'Successfully created Meta campaign');
    await createAuditLog('campaign_created', { campaign_id: campaignId, spec: plan.campaign, status: 'PAUSED' });

    // 3. Create the Ad Sets
    const adsetIds = [];
    for (const adsetPlan of plan.ad_sets || []) {
      const spec = {
        name: adsetPlan.name,
        daily_budget: Math.round(adsetPlan.daily_budget_usd * 100), // Cents
        billing_event: 'IMPRESSIONS',
        optimization_goal: adsetPlan.optimization_goal || 'OFFSITE_CONVERSIONS',
        // Make targeting dynamic based on AI output!
        targeting: { geo_locations: { countries: adsetPlan.meta_countries || ['AE'] } },
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      };

      routeLogger.info({ event: 'meta_adset_creation_started', adsetName: spec.name }, 'Pushing ad set to Meta Ads API');
      const adsetId = await meta.createAdset(campaignId, spec);
      adsetIds.push(adsetId);

      routeLogger.info({ event: 'meta_adset_creation_success', adsetId, campaignId }, 'Successfully created Meta ad set');

      // Log the AI's intended targeting so the human can apply it in Ads Manager
      await createAuditLog('adset_created', {
        adset_id: adsetId,
        campaign_id: campaignId,
        spec,
        ai_intended_targeting: adsetPlan.targeting_summary // Saved for human reference
      });
    }

    // 4. Log to Strapi (Assuming you have a helper function to POST to Strapi)
    await createAuditLog('campaign_setup', { campaignId, adsetIds, plan });

    routeLogger.info({ event: 'campaign_setup_complete', campaignId, adsetCount: adsetIds.length }, 'End-to-end campaign setup completed successfully');

    // 5. Return the response
    return NextResponse.json({ success: true, campaignId, adsetIds, plan });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'campaign_setup_error' }, 'Failed to execute campaign setup');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});