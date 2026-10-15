// riwaa/src/app/api/google-agent/keywords/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withLogger } from '@/utils/logs/withLogger';
import { logGoogleAuditAction } from '@/lib/google-ads-agent/strapi';
import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const googleAdsClient = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: "deprecated-by-google",
});

export const POST = withLogger('/api/google-agent/keywords', async (req: NextRequest, routeLogger) => {
  try {
    const { brief, category, targetLocationId, customerId, refreshToken } = await req.json();

    routeLogger.info({ event: 'keyword_research_start', customerId, category }, 'Starting multi-step AI keyword research and campaign structuring');

    // 1. Initial LLM Pass: Extract Seed Keywords from the Brief
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const seedPrompt = `You are a Google Ads Strategist. Extract exactly 5 high-intent seed keywords from this brief: "${brief}" (Category: ${category}). 
    Return a valid JSON array of strings under the key "seeds".`;

    routeLogger.info({ event: 'llm_seed_extraction_attempt' }, 'Extracting seed keywords via Gemini');
    const seedResult = await model.generateContent(seedPrompt);
    const { seeds } = JSON.parse(seedResult.response.text());
    routeLogger.info({ event: 'llm_seed_extraction_success', seeds }, 'Successfully extracted seed keywords');

    // 2. Fetch Live Search Volume from Google Ads API
    const customer = googleAdsClient.Customer({
      customer_id: customerId,
      // login_customer_id: "5426907660",
      refresh_token: refreshToken,
    });

    const requestPayload: any = {
      customer_id: customerId,
      keyword_seed: { keywords: seeds },
      keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
    };

    if (targetLocationId) {
      requestPayload.geo_target_constants = [`geoTargetConstants/${targetLocationId}`];
    }

    routeLogger.info({ event: 'google_ads_keyword_plan_attempt' }, 'Fetching live keyword metrics from Google Ads API');
    const keywordResponse = await customer.keywordPlanIdeas.generateKeywordIdeas(requestPayload);

    const rawMetrics = keywordResponse.results?.map(idea => ({
      keyword: idea.text,
      volume: idea.keyword_idea_metrics?.avg_monthly_searches || 0,
      competition: idea.keyword_idea_metrics?.competition || 'UNKNOWN'
    })) || [];
    routeLogger.info({ event: 'google_ads_keyword_plan_success', metricCount: rawMetrics.length }, 'Successfully retrieved live keyword metrics');

    // 3. Final LLM Pass: Strategic Clustering & Ad Group Creation
    const clusterPrompt = `You are an elite Google Ads Media Buyer. I used the Google Ads API to fetch live search volume for keywords related to: "${brief}".
    Here is the raw data: ${JSON.stringify(rawMetrics)}
    
    TASK: Analyze the search volume and competition. Discard low-intent or junk keywords. 
    Group the remaining winning keywords into 2-3 highly specific "Ad Groups".
    
    Return a valid JSON object matching this schema:
    {
      "campaign_theme": "string",
      "ad_groups": [
        {
          "name": "string",
          "intent_description": "string",
          "keywords": ["string", "string"]
        }
      ]
    }`;

    routeLogger.info({ event: 'llm_clustering_attempt' }, 'Structuring keywords into thematic Ad Groups via Gemini');
    const clusterResult = await model.generateContent(clusterPrompt);
    const campaignPlan = JSON.parse(clusterResult.response.text());
    routeLogger.info({ event: 'llm_clustering_success' }, 'Successfully structured Ad Groups');

    // 4. RSA Copywriter Node: Generate strictly constrained ad copy
    const copyPrompt = `You are an elite Real Estate Google Ads Copywriter. I have clustered keywords into ad groups. 
    For EACH ad group in the provided plan, generate a Responsive Search Ad (RSA). 
    
    CRITICAL CHARACTER LIMIT RULES:
    - Headlines MUST be 30 characters or less (including spaces). 
    - Descriptions MUST be 90 characters or less (including spaces).
    - If a headline is 31 characters, it will crash the API. Be ruthless with character counts.
    
    Here is the campaign plan: ${JSON.stringify(campaignPlan)}
    
    Return the EXACT same JSON structure, but append an "ads" object to each ad group containing 5 headlines and 2 descriptions matching the schema below:
    {
      "campaign_theme": "...",
      "ad_groups": [
        {
          "name": "...",
          "intent_description": "...",
          "keywords": ["..."],
          "ads": {
            "headlines": ["(max 30 chars)", "(max 30 chars)", ...],
            "descriptions": ["(max 90 chars)", "(max 90 chars)"]
          }
        }
      ]
    }`;

    routeLogger.info({ event: 'llm_copy_generation_attempt' }, 'Generating constrained RSA copy via Gemini');
    const copyResult = await model.generateContent(copyPrompt);
    const finalCampaignData = JSON.parse(copyResult.response.text());
    routeLogger.info({ event: 'llm_copy_generation_success' }, 'Successfully generated all RSA copy components');

    // 5. Fetch User Session & Write to Audit Log
    try {
      routeLogger.info({ event: 'audit_log_attempt' }, 'Writing keyword generation success to audit logs');

      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('riwaa_session')?.value;

      let userId = 'system';
      if (sessionToken) {
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${sessionToken}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          userId = userData.documentId || userData.id;
        }
      }

      await logGoogleAuditAction(
        userId,
        customerId,
        'keyword_research_completed',
        'success',
        {
          category: category,
          adGroupsGenerated: finalCampaignData.ad_groups?.length || 0,
          timestamp: new Date().toISOString()
        }
      );
    } catch (logError) {
      routeLogger.error({ err: logError }, 'Failed to save keyword audit log to Strapi');
    }

    return NextResponse.json(finalCampaignData);

  } catch (error: any) {
    routeLogger.error({ err: error, event: 'keyword_research_error' }, 'Failed to complete Google Ads multi-step generation pipeline');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});