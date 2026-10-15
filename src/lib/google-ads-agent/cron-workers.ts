/* eslint-disable @typescript-eslint/no-explicit-any */
import { redisOptions } from '@/workers/queue';
import { Job, Worker } from 'bullmq';
import { GoogleAdsApi } from 'google-ads-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getAllActiveGoogleAccounts,
  getGoogleAgentSetting,
  logGoogleAuditAction
} from '@/lib/google-ads-agent/strapi';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/* -------------------------------------------------------------------------- */
/* 1. OPTIMIZATION GATEKEEPER WORKER (Runs Daily)                             */
/* -------------------------------------------------------------------------- */
export const createGoogleAdsOptimizationWorker = () => new Worker('google-ads-optimization-queue', async (job: Job) => {
  console.log(`[Gatekeeper Worker] Running daily optimization scan...`);

  try {
    const accounts = await getAllActiveGoogleAccounts();

    for (const account of accounts) {
      const accountData = account.attributes || account;
      const customerId = accountData.customerId;
      const userId = accountData.user?.data?.id;

      if (!userId) continue;

      // 1. Check Guardrails
      const settings = await getGoogleAgentSetting(userId);
      if (!settings || settings.optimizationGatekeeper === false) {
        console.log(`[Gatekeeper] Optimization disabled for Account ${customerId}. Skipping.`);
        continue;
      }

      const googleAdsClient = new GoogleAdsApi({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      });

      const customer = googleAdsClient.Customer({
        customer_id: customerId,
        // login_customer_id: accountData.loginCustomerId || "5426907660",
        refresh_token: accountData.refreshToken,
      });

      // 2. Fetch Pending Recommendations
      const query = `
        SELECT recommendation.resource_name, recommendation.type, recommendation.campaign, recommendation.impact 
        FROM recommendation
      `;
      const recommendations = await customer.query(query);

      if (recommendations.length === 0) {
        console.log(`[Gatekeeper] No recommendations found for ${customerId}. 100% Score maintained.`);
        continue;
      }

      // 3. Gemini Evaluation Node
      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-pro-preview",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `You are a strict Google Ads Media Buyer protecting a real estate client's ROAS. 
      Analyze these Google recommendations: ${JSON.stringify(recommendations)}.
      
      RULES:
      - ACCEPT technical fixes (e.g., FIX_AD_GROUP_AD_POLICY, REMOVE_CONFLICTING_NEGATIVE_KEYWORDS, RESPONSIVE_SEARCH_AD).
      - REJECT anything that spends more money or removes targeting control (e.g., UPGRADE_SMART_SHOPPING, MAXIMIZE_CONVERSIONS_OPT_IN, USE_BROAD_MATCH_KEYWORD, RAISE_TARGET_CPA).

      Output ONLY a JSON array mapping the exact 'recommendation.resource_name' to an action:
      [
        { "resource_name": "...", "action": "APPLY" | "DISMISS", "reason": "..." }
      ]`;

      const aiResponse = await model.generateContent(prompt);
      const decisions = JSON.parse(aiResponse.response.text());

      // 4. Execute Mutations & Log Actions
      // 4. Execute Mutations & Log Actions
      for (const decision of decisions) {
        try {
          if (decision.action === 'APPLY') {
            await customer.recommendations.applyRecommendation({
              customer_id: customerId,
              partial_failure: true,
              operations: [{ resource_name: decision.resource_name }]
            } as any);

            // await logGoogleAuditAction(userId, 'recommendation_applied', 'success', decision);
          } else {
            await customer.recommendations.dismissRecommendation({
              customer_id: customerId,
              partial_failure: true,
              operations: [{ resource_name: decision.resource_name }]
            } as any);

            // await logGoogleAuditAction(userId, 'recommendation_dismissed', 'success', decision);
          }
        } catch (mutError: any) {
          console.error(`[Gatekeeper] Failed to ${decision.action} recommendation:`, mutError);
        }
      }
    }
  } catch (error: any) {
    console.error(`[Gatekeeper Worker] Execution failed:`, error);
    throw error;
  }
}, { connection: redisOptions as any, concurrency: 1 });

/* -------------------------------------------------------------------------- */
/* 2. CAMPAIGN SENTINEL WORKER (Runs every 6 hours)                           */
/* -------------------------------------------------------------------------- */
export const createGoogleAdsSentinelWorker = () => new Worker('google-ads-sentinel-queue', async (job: Job) => {
  console.log(`[Sentinel Worker] Scanning for policy violations and spend anomalies...`);

  try {
    const accounts = await getAllActiveGoogleAccounts();

    for (const account of accounts) {
      const accountData = account.attributes || account;
      const customerId = accountData.customerId;
      const userId = accountData.user?.data?.id;

      if (!userId) continue;

      const googleAdsClient = new GoogleAdsApi({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      });

      const customer = googleAdsClient.Customer({
        customer_id: customerId,
        // login_customer_id: accountData.loginCustomerId || "5426907660",
        refresh_token: accountData.refreshToken,
      });

      // Scan 1: Disapproved Ads
      const policyQuery = `
        SELECT ad_group_ad.ad.id, ad_group_ad.policy_summary.approval_status, campaign.name
        FROM ad_group_ad 
        WHERE ad_group_ad.policy_summary.approval_status = 'DISAPPROVED'
      `;
      const policyViolations = await customer.query(policyQuery);

      if (policyViolations.length > 0) {
        // await logGoogleAuditAction(userId, 'policy_violation_flagged', 'warning', {
        //   issues_found: policyViolations.length,
        //   sample: policyViolations[0]
        // });

        const settings = await getGoogleAgentSetting(userId);
        if (settings?.alertEmails?.length > 0) {
          console.log(`[Sentinel] Triggering Email Alert to ${settings.alertEmails.join(', ')} for Disapproved Ads`);
        }
      }
    }
  } catch (error: any) {
    console.error(`[Sentinel Worker] Execution failed:`, error);
    throw error;
  }
}, { connection: redisOptions as any, concurrency: 1 });