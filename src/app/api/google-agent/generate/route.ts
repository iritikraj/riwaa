// riwaa/src/app/api/google-agent/generate/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveNewBlueprint, logGoogleAuditAction } from '@/lib/google-ads-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const STRAPI_SYSTEM_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

const googleAdsClient = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

export const POST = withLogger('/api/google-agent/generate', async (req: NextRequest, routeLogger) => {
  try {
    const { brief, targetLocationId, customerId, campaignName } = await req.json();

    routeLogger.info(
      { event: 'blueprint_generation_start', customerId, campaignName },
      'Starting Google Ads blueprint generation pipeline'
    );

    // 1. Get the current user's session to link the blueprint relation
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('riwaa_session')?.value;

    if (!sessionToken) {
      routeLogger.warn({ event: 'unauthorized_generation_attempt' }, 'Missing session token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    routeLogger.info({ event: 'fetch_user_attempt' }, 'Fetching user details from Strapi');
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });

    if (!userRes.ok) throw new Error("Failed to authenticate user with Strapi");
    const userData = await userRes.json();
    const userId = userData.documentId || userData.id;

    // 2. Fetch the Google Ads refresh token securely using the System Token
    routeLogger.info({ event: 'fetch_credentials_attempt', customerId }, 'Fetching Google Account credentials from Strapi');

    const accountsRes = await fetch(`${STRAPI_URL}/api/google-accounts?filters[customerId][$eq]=${customerId}`, {
      headers: { Authorization: `Bearer ${STRAPI_SYSTEM_TOKEN}` }
    });

    if (!accountsRes.ok) {
      throw new Error("Failed to fetch Google Account credentials from Strapi.");
    }

    const accountsData = await accountsRes.json();
    const activeAccount = accountsData.data?.[0];
    const refreshToken = activeAccount?.attributes?.refreshToken || activeAccount?.refreshToken;
    const loginCustomerId = activeAccount?.attributes?.loginCustomerId || activeAccount?.loginCustomerId;

    if (!refreshToken) {
      routeLogger.warn({ event: 'missing_refresh_token', customerId }, 'No refresh token found for this account');
      return NextResponse.json({ error: 'No refresh token found for this account. Please reconnect Google Ads.' }, { status: 400 });
    }

    routeLogger.info({ event: 'fetch_credentials_success', customerId }, 'Successfully retrieved credentials');

    const customer = googleAdsClient.Customer({
      customer_id: customerId,
      // login_customer_id: loginCustomerId || "5426907660",
      refresh_token: refreshToken,
    });

    // 2.5 Extract Seed Keywords via Gemini BEFORE querying Google
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    routeLogger.info({ event: 'llm_seed_extraction_attempt' }, 'Extracting seed keywords from brief');
    const seedPrompt = `You are a Google Ads Strategist. Extract exactly 5 high-intent seed keywords (max 3 words each) from this brief: "${brief}". 
    Return a valid JSON object with a single array of strings under the key "seeds".`;

    const seedResult = await model.generateContent(seedPrompt);
    const { seeds } = JSON.parse(seedResult.response.text());
    routeLogger.info({ event: 'llm_seed_extraction_success', seeds }, 'Successfully extracted seed keywords');

    // 3. Query Google Ads with the clean seeds
    const requestPayload: any = {
      customer_id: customerId,
      language: 'languageConstants/1000',
      keyword_seed: { keywords: seeds },
      keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
    };

    if (targetLocationId) {
      requestPayload.geo_target_constants = [`geoTargetConstants/${targetLocationId}`];
    }

    routeLogger.info({ event: 'keyword_fetch_attempt', customerId, seeds }, 'Fetching keyword plan ideas from Google Ads API');
    const keywordResponse = await customer.keywordPlanIdeas.generateKeywordIdeas(requestPayload);

    const rawMetrics = keywordResponse.results?.map(idea => ({
      keyword: idea.text,
      volume: idea.keyword_idea_metrics?.avg_monthly_searches || 0,
    })) || [];

    routeLogger.info({ event: 'keyword_fetch_success', keywordCount: rawMetrics.length }, 'Successfully fetched keyword metrics');

    try {
      routeLogger.info({ event: 'audit_log_attempt' }, 'Writing keyword research success to audit logs');
      await logGoogleAuditAction(
        userId,
        customerId,
        'keyword_research_completed',
        'success',
        {
          phase: "Keyword Data Gathering",
          totalKeywordsFound: rawMetrics.length,
          googleData: rawMetrics,
          timestamp: new Date().toISOString()
        }
      );
    } catch (logError) {
      routeLogger.error({ err: logError }, 'Failed to save keyword audit log to Strapi');
    }

    const masterPrompt = `You are an elite Google Ads Media Buyer. Analyze these keywords and volumes: ${JSON.stringify(rawMetrics)}.
    
    TASK:
    1. Filter out low-intent junk. Group the winners into 2-3 specific "Ad Groups".
    2. Write EXACTLY 3 distinct Responsive Search Ad (RSA) variations for EACH group, differing in tone and angle. 
       - Headlines MUST be UNDER 30 characters (including spaces). Be concise.
       - Descriptions MUST be UNDER 90 characters (including spaces). 
    3. Create 4 account-level Sitelinks highly relevant to "${brief}".
       - Sitelink Text: MAX 25 characters. 
       - Sitelink Desc 1 & 2: STRICT MAX 35 characters (including spaces). 

    CRITICAL RULES:
    - You must manually count the characters before generating.
    - If a string exceeds the maximum character limit by even 1 character, the API will crash. 
    - Keep sentences punchy and short.

    Return EXACTLY this JSON structure:
    {
      "campaign_theme": "...",
      "ad_groups": [
        {
          "name": "...",
          "intent_description": "...",
          "keywords": ["...", "..."],
          "ads": [
            {
              "variation_name": "Aggressive Offer",
              "headlines": ["(max 30 chars)", "(max 30 chars)", "(max 30 chars)"],
              "descriptions": ["(max 90 chars)", "(max 90 chars)"]
            },
            {
              "variation_name": "Trust & Authority",
              "headlines": ["(max 30 chars)", "(max 30 chars)", "(max 30 chars)"],
              "descriptions": ["(max 90 chars)", "(max 90 chars)"]
            },
            {
              "variation_name": "Feature Focused",
              "headlines": ["(max 30 chars)", "(max 30 chars)", "(max 30 chars)"],
              "descriptions": ["(max 90 chars)", "(max 90 chars)"]
            }
          ]
        }
      ],
      "sitelinks": [
        {
          "linkText": "(max 25 chars)",
          "description1": "(max 35 chars)",
          "description2": "(max 35 chars)"
        }
      ]
    }`;

    routeLogger.info({ event: 'ai_generation_attempt', model: 'gemini-2.5-flash' }, 'Generating campaign blueprint with Gemini');

    const llmResult = await model.generateContent(masterPrompt);
    const blueprintData = JSON.parse(llmResult.response.text());

    routeLogger.info({ event: 'ai_generation_success' }, 'Successfully generated campaign blueprint');
    routeLogger.info({ event: 'strapi_save_attempt' }, 'Saving draft blueprint to Strapi');

    const savedBlueprint = await saveNewBlueprint({
      campaignName: campaignName || blueprintData.campaign_theme,
      brief: brief,
      approvalState: 'pending_approval',
      blueprintData: blueprintData,
      userId: userId,
      customerId: customerId
    }, STRAPI_SYSTEM_TOKEN);

    // Guarantee we extract the Strapi v5 documentId for routing
    const finalDocumentId = savedBlueprint.data?.documentId || savedBlueprint.data?.id;

    routeLogger.info({ event: 'strapi_save_success', documentId: finalDocumentId }, 'Blueprint successfully saved and linked to user');

    // 3. Write to Strapi Audit Log for successful generation
    try {
      routeLogger.info({ event: 'audit_log_attempt' }, 'Writing generation success to audit logs');
      await logGoogleAuditAction(
        userId,
        customerId,
        'blueprint_generated',
        'success',
        {
          blueprintId: finalDocumentId,
          campaignName: campaignName || blueprintData.campaign_theme,
          adGroupsGenerated: blueprintData.ad_groups?.length || 0,
          timestamp: new Date().toISOString()
        }
      );
    } catch (logError) {
      // Catch silently to avoid crashing the generation response
      routeLogger.error({ err: logError }, 'Failed to save generation audit log to Strapi');
    }

    return NextResponse.json({
      success: true,
      blueprintId: finalDocumentId,
      data: blueprintData
    });

  } catch (error: any) {
    routeLogger.error({ err: error, event: 'blueprint_generation_error' }, 'Failed to generate campaign blueprint');
    // Check if the error is specifically an expired/revoked token error
    const errorMessage = error?.message?.toLowerCase() || '';
    const isTokenError = errorMessage.includes('invalid_grant') || errorMessage.includes('unauthorized') || errorMessage.includes('authenticationerror');
    if (isTokenError) {
      return NextResponse.json({
        error: 'Your Google Ads connection has expired or been revoked. Please reconnect.',
        code: 'GOOGLE_AUTH_EXPIRED'
      }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});