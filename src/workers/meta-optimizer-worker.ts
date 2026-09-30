// riwaa/src/workers/meta-optimizer-worker.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Job, Worker } from 'bullmq';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { fetchMetaAccountFromStrapi, getMetaAgentSettingsForAccount, getActiveMetaAccounts, createRecommendation } from '@/lib/meta-agent/strapi';
import { redisOptions } from './queue';

export const createMetaOptimizerWorker = () => new Worker('meta-optimizer-queue', async (job: Job) => {
  const targetAccountId = job.data?.accountId;
  console.log(`🤖 [Meta Optimizer] Waking up... Target Account: ${targetAccountId || 'All Accounts (Batch Run)'}`);

  try {
    let accountsToProcess = [];

    // 1. Determine whether to run for a single targeted account or all active accounts
    if (targetAccountId) {
      const singleAccount = await fetchMetaAccountFromStrapi(targetAccountId);
      if (singleAccount) accountsToProcess = [singleAccount];
    } else {
      accountsToProcess = await getActiveMetaAccounts();
    }

    if (!accountsToProcess || accountsToProcess.length === 0) {
      console.log('[Meta Optimizer] No accounts found to optimize.');
      return;
    }

    const ai = new AiAgent();

    // 2. Iterate through accounts
    for (const account of accountsToProcess) {
      const attr = account.attributes || account;
      const accountId = account.documentId || account.id;
      const accountName = attr.name || 'Unknown Client';

      console.log(`🔍 [Meta Optimizer] Analyzing account: ${accountName} (${accountId})`);

      if (!attr.access_token || !attr.ad_account_id) {
        console.warn(`[Meta Optimizer] Skipping ${accountName}: Missing Meta credentials.`);
        continue;
      }

      const meta = new MetaClient({
        accessToken: attr.access_token,
        adAccountId: attr.ad_account_id,
        pageId: attr.page_id,
        pixelId: attr.pixel_id
      });

      const guardrails = await getMetaAgentSettingsForAccount(accountId);
      const rawInsights = await meta.getAccountInsights('last_7d', 'adset');

      const eligibleInsights = rawInsights.filter((insight: any) => {
        const protectedIds = guardrails.protected_campaign_ids || [];
        if (protectedIds.includes(insight.campaign_id)) return false;

        const spend = parseFloat(insight.spend || '0');
        const impressions = parseInt(insight.impressions || '0');
        return spend >= (guardrails.min_spend_threshold || 10) && impressions >= (guardrails.min_impressions_threshold || 100);
      });

      if (eligibleInsights.length === 0) {
        console.log(`[Meta Optimizer] No campaigns met spend thresholds for ${accountName}.`);
        continue;
      }

      const goals = { target_cpa_usd: guardrails.target_cpa || 25 };
      const recommendations = await ai.analyzePerformance(eligibleInsights, goals, guardrails);

      const maxActions = guardrails.max_actions_per_run || 10;
      const limitedRecommendations = recommendations.slice(0, maxActions);

      for (const rec of limitedRecommendations) {
        if (rec.action === 'no_action_but_watch') continue;

        if (rec.action === 'pause' && guardrails.disallow_pause_actions) {
          rec.action = 'no_action_but_watch';
          rec.rationale += ' [Overridden: pause actions are disabled in guardrails config.]';
          continue;
        }

        if (rec.change_pct && Math.abs(rec.change_pct) > (guardrails.max_budget_change_pct || 20)) {
          const limit = guardrails.max_budget_change_pct || 20;
          rec.change_pct = rec.change_pct > 0 ? limit : -limit;
          rec.rationale += ` [Clamped to ${rec.change_pct}% by code guardrails]`;
        }

        await createRecommendation({
          ...rec,
          meta_account: accountId
        }, accountId);
      }

      console.log(`[Meta Optimizer] Finished ${accountName}. Queued ${limitedRecommendations.length} actions.`);
    }

  } catch (error: any) {
    console.error(`[Meta Optimizer] Worker Failed:`, error);
    throw error;
  }
}, {
  connection: redisOptions as any,
  concurrency: 1
});