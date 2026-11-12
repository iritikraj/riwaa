// riwaa/src/app/api/meta-agent/setup/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { createAuditLog } from '@/lib/meta-agent/strapi';
import { getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';
import { withLogger } from '@/utils/logs/withLogger';

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

    const metaAccount = await getAuthorizedMetaAccount(accountId);
    const attr = metaAccount.attributes || metaAccount;
    const safeAccountId = metaAccount.documentId || metaAccount.id;

    const ai = new AiAgent();

    const meta = new MetaClient({
      accessToken: attr.access_token,
      adAccountId: attr.ad_account_id,
      pageId: attr.page_id,
      pixelId: attr.pixel_id
    });

    routeLogger.info({ event: 'ai_drafting_started' }, 'Requesting campaign structure draft from Gemini');
    const plan = await ai.draftCampaignStructure(brief);

    routeLogger.info({ event: 'ai_drafting_success', campaignName: plan.campaign?.name }, 'AI successfully drafted campaign structure');

    await createAuditLog('campaign_plan_drafted', { brief, plan }, safeAccountId, user.id);

    routeLogger.info({ event: 'meta_campaign_creation_started' }, 'Pushing campaign shell to Meta Ads API');
    const campaignId = await meta.createCampaign(plan.campaign);

    routeLogger.info({ event: 'meta_campaign_creation_success', campaignId }, 'Successfully created Meta campaign');
    await createAuditLog('campaign_created', { campaign_id: campaignId, spec: plan.campaign, status: 'PAUSED' }, safeAccountId, user.id);

    // FIXED: Must declare the array to hold the successfully created Ad Sets
    const adsetIds = [];

    for (const adsetPlan of plan.ad_sets || []) {

      const targetPayload: any = {
        geo_locations: {
          countries: adsetPlan.targeting?.countries && adsetPlan.targeting.countries.length > 0
            ? adsetPlan.targeting.countries
            : ['AE']
        },
        locales: adsetPlan.targeting?.locales && adsetPlan.targeting.locales.length > 0
          ? adsetPlan.targeting.locales
          : [24],
        // FIX: Explicitly disable Advantage Audience to satisfy Meta API requirements
        // and enforce our strict AI-generated targeting boundaries.
        targeting_automation: {
          advantage_audience: 0
        }
      };

      if (adsetPlan.targeting?.age_min) targetPayload.age_min = adsetPlan.targeting.age_min;
      if (adsetPlan.targeting?.age_max) targetPayload.age_max = adsetPlan.targeting.age_max;

      // Helper to resolve hallucinated AI IDs into real Meta IDs
      const resolveFlexibleSpec = async (rawSpecs: any[]) => {
        const resolvedFlexibleSpec = [];
        for (const spec of rawSpecs) {
          const resolvedSpec: any = {};

          // Resolve Interests
          if (spec.interests && spec.interests.length > 0) {
            const validInterests = await Promise.all(
              spec.interests.map(async (interest: any) => {
                const realId = await meta.getTargetingIdByName(interest.name, 'adinterest');
                if (!realId) routeLogger.warn({ event: 'unmapped_interest' }, `Interest '${interest.name}' not found on Meta`);
                return realId ? { id: realId, name: interest.name } : null;
              })
            );
            const filtered = validInterests.filter(Boolean);
            if (filtered.length > 0) resolvedSpec.interests = filtered;
          }

          // Resolve Behaviors
          if (spec.behaviors && spec.behaviors.length > 0) {
            const validBehaviors = await Promise.all(
              spec.behaviors.map(async (behavior: any) => {
                const realId = await meta.getTargetingIdByName(behavior.name, 'adTargetingCategory');
                if (!realId) routeLogger.warn({ event: 'unmapped_behavior' }, `Behavior '${behavior.name}' not found on Meta`);
                return realId ? { id: realId, name: behavior.name } : null;
              })
            );
            const filtered = validBehaviors.filter(Boolean);
            if (filtered.length > 0) resolvedSpec.behaviors = filtered;
          }

          if (Object.keys(resolvedSpec).length > 0) {
            resolvedFlexibleSpec.push(resolvedSpec);
          }
        }
        return resolvedFlexibleSpec;
      };

      if (adsetPlan.type === 'interest') {
        if (adsetPlan.targeting?.flexible_spec) {
          targetPayload.flexible_spec = await resolveFlexibleSpec(adsetPlan.targeting.flexible_spec);
        }
      } else if (adsetPlan.type === 'expats') {
        if (adsetPlan.targeting?.flexible_spec) {
          targetPayload.flexible_spec = await resolveFlexibleSpec(adsetPlan.targeting.flexible_spec);
        }

        // Meta Behavior IDs for specific expat groups
        const EXPAT_BEHAVIOR_MAP: Record<string, string> = {
          'UK': '6021354152983',
          'United Kingdom': '6021354152983',
          'US': '6019396649183',
          'United States': '6023620475783',
          'Germany': '6019367052983',
          'France': '6019367014383',
          'Russia': '6025000815983',
          'Italy': '6019396654583',
          'Spain': '6019366943583',
          'Switzerland': '6019377644783',
          'Ireland': '6019396650783',
          'Belgium': '6043702804583',
          'Denmark': '6023287455983',
          'Sweden': '6023287397383',
          'Japan': '6023676028783',
          'Austria': '6023675997383',
          'Monaco': '6023676048183',
          'Greece': '6023676017583',
          'Hungary': '6019396638383',
        };

        if (adsetPlan.targeting?.expat_countries && adsetPlan.targeting.expat_countries.length > 0) {
          const expatBehaviors = adsetPlan.targeting.expat_countries
            .map((country: string) => {
              const behaviorId = EXPAT_BEHAVIOR_MAP[country] || EXPAT_BEHAVIOR_MAP[country.toUpperCase()];
              if (!behaviorId) {
                routeLogger.warn({ event: 'unmapped_expat_country' }, `Missing Meta Behavior ID for expats from: ${country}`);
              }
              return behaviorId ? { id: behaviorId, name: `Expats (${country})` } : null;
            })
            .filter(Boolean);

          if (expatBehaviors.length > 0) {
            if (!targetPayload.flexible_spec) targetPayload.flexible_spec = [];
            targetPayload.flexible_spec.push({ behaviors: expatBehaviors });
          }
        }
      } else if (adsetPlan.type === 'lookalike') {
        if (adsetPlan.targeting?.custom_audiences) {
          const resolvedAudiences = await Promise.all(
            adsetPlan.targeting.custom_audiences.map(async (ca: any) => {
              const realId = await meta.getCustomAudienceByName(ca.name);
              if (!realId) {
                routeLogger.warn({ event: 'missing_audience' }, `Audience ${ca.name} not found in Meta`);
              }
              return { id: realId || "UNKNOWN_ID", name: ca.name };
            })
          );

          const validAudiences = resolvedAudiences.filter((ca: any) => ca.id !== "UNKNOWN_ID");
          if (validAudiences.length > 0) {
            targetPayload.custom_audiences = validAudiences;
          } else {
            routeLogger.warn({ event: 'lookalike_failed' }, 'No valid custom audiences found. Dropping custom audience targeting for this adset.');
          }
        }
      }

      // FIXED: Restored the actual API call logic!
      const spec = {
        name: adsetPlan.name,
        daily_budget: Math.round(adsetPlan.daily_budget_usd * 100),
        billing_event: 'IMPRESSIONS',
        optimization_goal: adsetPlan.optimization_goal || 'OFFSITE_CONVERSIONS',
        targeting: targetPayload,
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
        ai_intended_targeting: adsetPlan.targeting
      }, safeAccountId, user.id);
    } // End of For Loop

    await createAuditLog('campaign_setup', { campaignId, adsetIds, plan }, safeAccountId, user.id);

    routeLogger.info({ event: 'campaign_setup_complete', campaignId, adsetCount: adsetIds.length }, 'End-to-end campaign setup completed successfully');

    return NextResponse.json({ success: true, campaignId, adsetIds, plan });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'campaign_setup_error' }, 'Failed to execute campaign setup');
    const status = error.message === 'Unauthorized' || error.message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
});