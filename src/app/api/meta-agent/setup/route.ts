// riwaa/src/app/api/meta-agent/setup/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { createAuditLog } from '@/lib/meta-agent/strapi';
import { getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';
import { withLogger } from '@/utils/logs/withLogger';

// Helper to get the current user session
async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('riwaa_session')?.value;
  if (!token) throw new Error('Unauthorized');

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
  const res = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export const POST = withLogger('/api/meta-agent/setup', async (req: NextRequest, routeLogger) => {
  try {
    const user = await getSessionUser();
    const { brief, accountId } = await req.json();

    if (!brief || !accountId) {
      routeLogger.warn({ event: 'campaign_setup_missing_params' }, 'Brief or accountId missing from request');
      return NextResponse.json({ error: 'Brief and accountId are required' }, { status: 400 });
    }

    routeLogger.info({ event: 'campaign_setup_started', accountId }, 'Processing new AI campaign setup request');

    // 1. Use the updated signature (only accountId is needed)
    const metaAccount = await getAuthorizedMetaAccount(accountId);

    // Safely extract attributes regardless of Strapi v4/v5 nesting
    const attr = metaAccount.attributes || metaAccount;
    const safeAccountId = metaAccount.documentId || metaAccount.id;

    const ai = new AiAgent();

    // 2. Pass ALL credentials to the MetaClient, including the new page and pixel IDs
    const meta = new MetaClient({
      accessToken: attr.access_token,
      adAccountId: attr.ad_account_id,
      pageId: attr.page_id,
      pixelId: attr.pixel_id
    });

    // 3. AI drafts the plan based on the brief
    routeLogger.info({ event: 'ai_drafting_started' }, 'Requesting campaign structure draft from Gemini');
    const plan = await ai.draftCampaignStructure(brief);

    routeLogger.info({ event: 'ai_drafting_success', campaignName: plan.campaign?.name }, 'AI successfully drafted campaign structure');

    // 4. Create Audit Logs (Using safeAccountId)
    await createAuditLog('campaign_plan_drafted', { brief, plan }, safeAccountId, user.id);

    // 5. Create the Campaign (Always Paused)
    routeLogger.info({ event: 'meta_campaign_creation_started' }, 'Pushing campaign shell to Meta Ads API');
    const campaignId = await meta.createCampaign(plan.campaign);

    routeLogger.info({ event: 'meta_campaign_creation_success', campaignId }, 'Successfully created Meta campaign');
    await createAuditLog('campaign_created', { campaign_id: campaignId, spec: plan.campaign, status: 'PAUSED' }, safeAccountId, user.id);

    // 6. Create the Ad Sets
    const adsetIds = [];
    for (const adsetPlan of plan.ad_sets || []) {
      const spec = {
        name: adsetPlan.name,
        daily_budget: Math.round(adsetPlan.daily_budget_usd * 100), // Cents
        billing_event: 'IMPRESSIONS',
        optimization_goal: adsetPlan.optimization_goal || 'OFFSITE_CONVERSIONS',
        targeting: { geo_locations: { countries: adsetPlan.meta_countries || ['AE'] } },
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      };

      routeLogger.info({ event: 'meta_adset_creation_started', adsetName: spec.name }, 'Pushing ad set to Meta Ads API');
      const adsetId = await meta.createAdset(campaignId, spec);
      adsetIds.push(adsetId);

      routeLogger.info({ event: 'meta_adset_creation_success', adsetId, campaignId }, 'Successfully created Meta ad set');

      await createAuditLog('adset_created', {
        adset_id: adsetId,
        campaign_id: campaignId,
        spec,
        ai_intended_targeting: adsetPlan.targeting_summary
      }, safeAccountId, user.id);
    }

    // 7. Final Completion Log
    await createAuditLog('campaign_setup', { campaignId, adsetIds, plan }, safeAccountId, user.id);

    routeLogger.info({ event: 'campaign_setup_complete', campaignId, adsetCount: adsetIds.length }, 'End-to-end campaign setup completed successfully');

    return NextResponse.json({ success: true, campaignId, adsetIds, plan });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'campaign_setup_error' }, 'Failed to execute campaign setup');
    const status = error.message === 'Unauthorized' || error.message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
});