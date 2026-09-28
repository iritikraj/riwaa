// riwaa/src/app/api/meta-agent/setup/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { createAuditLog } from '@/lib/meta-agent/strapi';

export async function POST(req: NextRequest) {
  try {
    const { brief } = await req.json();
    if (!brief) return NextResponse.json({ error: 'Brief is required' }, { status: 400 });

    const ai = new AiAgent();
    const meta = new MetaClient();

    // 1. AI drafts the plan based on the brief
    const plan = await ai.draftCampaignStructure(brief);
    await createAuditLog('campaign_plan_drafted', { brief, plan });

    // 2. Create the Campaign (Always Paused)
    const campaignId = await meta.createCampaign(plan.campaign);
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

      const adsetId = await meta.createAdset(campaignId, spec);
      adsetIds.push(adsetId);

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

    // 5. Return the response
    return NextResponse.json({ success: true, campaignId, adsetIds, plan });
  } catch (error: any) {
    console.error('Setup Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}