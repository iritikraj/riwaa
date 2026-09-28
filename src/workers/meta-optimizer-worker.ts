// riwaa/src/workers/meta-optimizer-worker.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Job, Worker } from 'bullmq';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { AiAgent } from '@/lib/meta-agent/ai-agent';
import { getMetaAgentSettings, createRecommendation } from '@/lib/meta-agent/strapi';
import { redisOptions } from './queue';

export const createMetaOptimizerWorker = () => new Worker('meta-optimizer-queue', async (job: Job) => {
  console.log(`🤖 [Meta Optimizer] Waking up for daily analysis...`);
  const meta = new MetaClient();
  const ai = new AiAgent();

  try {
    // 1. Fetch Guardrails from Strapi
    const guardrails = await getMetaAgentSettings();

    // 2. Fetch Account Insights
    const rawInsights = await meta.getAccountInsights('last_7d', 'adset');
    // const rawInsights = await meta.getAccountInsights('last_7d', 'campaign');

    // 3. Filter out campaigns that don't have enough data to make a smart decision
    const eligibleInsights = rawInsights.filter((insight: any) => {
      // NEW: Block protected campaigns
      const protectedIds = guardrails.protected_campaign_ids || [];
      if (protectedIds.includes(insight.campaign_id)) return false;

      const spend = parseFloat(insight.spend || '0');
      const impressions = parseInt(insight.impressions || '0');
      return spend >= guardrails.min_spend_threshold && impressions >= guardrails.min_impressions_threshold;
    });

    if (eligibleInsights.length === 0) {
      console.log('[Meta Optimizer] No campaigns met the spend thresholds today.');
      return;
    }

    // 4. Ask Gemini for Recommendations
    const goals = { target_cpa_usd: 25 }; // Example goal
    const recommendations = await ai.analyzePerformance(eligibleInsights, goals, guardrails);

    // NEW: Slice the array to respect the max actions ceiling
    const maxActions = guardrails.max_actions_per_run || 10;
    const limitedRecommendations = recommendations.slice(0, maxActions);

    // 5. Code-Level Enforcement (Never trust the AI completely)
    // 5. Code-Level Enforcement (Never trust the AI completely)
    for (const rec of limitedRecommendations) {
      if (rec.action === 'no_action_but_watch') continue;

      // NEW: Guardrail against pause actions if disabled
      if (rec.action === 'pause' && guardrails.disallow_pause_actions) {
        rec.action = 'no_action_but_watch';
        rec.rationale += ' [Overridden: pause actions are disabled in guardrails config.]';
        continue;
      }

      // Clamp budget changes...
      if (rec.change_pct && Math.abs(rec.change_pct) > guardrails.max_budget_change_pct) {
        rec.change_pct = rec.change_pct > 0 ? guardrails.max_budget_change_pct : -guardrails.max_budget_change_pct;
        rec.rationale += ` [Clamped to ${rec.change_pct}% by code guardrails]`;
      }

      // Save to Strapi Approval Queue
      await createRecommendation(rec);
    }

    console.log(`[Meta Optimizer] Finished analysis. Queued ${recommendations.length} items.`);
  } catch (error: any) {
    console.error(`[Meta Optimizer] Failed:`, error);
    throw error;
  }
}, {
  connection: redisOptions as any,
  concurrency: 1
});