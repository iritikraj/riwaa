/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { logGoogleAuditAction, updateUserBlueprint } from '@/lib/google-ads-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_SYSTEM_TOKEN = process.env.STRAPI_API_TOKEN;
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';


const googleAdsClient = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

export const POST = withLogger('/api/google-agent/deploy', async (req: NextRequest, routeLogger) => {
  try {
    const { accountId, blueprintId, blueprint } = await req.json();

    routeLogger.info({ event: 'deploy_start', accountId, blueprintId }, 'Starting deployment to Google Ads');

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('riwaa_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch Google Account credentials from Strapi
    const accountsRes = await fetch(`${STRAPI_URL}/api/google-accounts?filters[customerId][$eq]=${accountId}`, {
      headers: { Authorization: `Bearer ${STRAPI_SYSTEM_TOKEN}` }
    });

    if (!accountsRes.ok) throw new Error("Failed to fetch Google Account credentials from Strapi.");

    const accountsData = await accountsRes.json();
    const activeAccount = accountsData.data?.[0];
    const refreshToken = activeAccount?.attributes?.refreshToken || activeAccount?.refreshToken;
    const loginCustomerId = activeAccount?.attributes?.loginCustomerId || activeAccount?.loginCustomerId;

    if (!refreshToken) {
      throw new Error("No refresh token found. Please reconnect Google Ads.");
    }

    // Initialize the Google Ads Customer instance
    const customerConfig: any = {
      customer_id: accountId,
      refresh_token: refreshToken,
    };

    if (loginCustomerId) {
      customerConfig.login_customer_id = loginCustomerId;
    }

    const customer = googleAdsClient.Customer(customerConfig);

    routeLogger.info({ event: 'google_ads_auth_success' }, 'Authenticated with Google Ads API');

    // 2. Create the Campaign Budget (FIX: Wrapped payload in an array)
    const budgetRes = await customer.campaignBudgets.create([{
      name: `Riwaa Budget - ${blueprint.campaign_theme.substring(0, 50)} - ${Date.now()}`,
      amount_micros: 50000000,
      explicitly_shared: false,
    }]);

    const budgetResourceName = budgetRes.results[0].resource_name as string;

    // 3. Create the Campaign (FIX: Wrapped payload in an array)
    routeLogger.info({ event: 'deploy_campaign_create' }, 'Creating Campaign');
    const campaignRes = await customer.campaigns.create([{
      name: `${blueprint.campaign_theme} - ${Date.now()}`,
      status: enums.CampaignStatus.PAUSED, // Keeping it PAUSED so it doesn't spend real money yet
      advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
      campaign_budget: budgetResourceName,
      target_spend: {},
      contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
      network_settings: {
        target_google_search: true,
        target_search_network: true,
        target_content_network: false,
      }
    }]);

    const campaignResourceName = campaignRes.results[0].resource_name as string;

    // 3.5 Create and Attach Sitelinks from Blueprint
    if (blueprint.sitelinks && blueprint.sitelinks.length > 0) {
      routeLogger.info({ event: 'deploy_sitelinks', count: blueprint.sitelinks.length }, 'Deploying sitelink extensions from blueprint');

      const baseUrl = blueprint.final_url || "https://www.example.com";

      // A. Build Asset creation operations from Strapi sitelinks
      const sitelinkOperations = blueprint.sitelinks.map((link: any, idx: number) => ({
        type: enums.AssetType.SITELINK,
        sitelink_asset: {
          link_text: link.linkText,
          description1: link.description1,
          description2: link.description2,
        },
        // Google requires a final URL for each sitelink; append anchor/path or use base URL
        final_urls: [link.final_url || `${baseUrl}#sitelink-${idx + 1}`],
      }));

      const sitelinkAssetRes = await customer.assets.create(sitelinkOperations);

      // B. Attach created Sitelink Assets to the Campaign
      const campaignAssetOperations = sitelinkAssetRes.results.map((res: any) => ({
        campaign: campaignResourceName,
        asset: res.resource_name,
        field_type: enums.AssetFieldType.SITELINK,
        status: enums.AssetLinkStatus.ENABLED,
      }));

      await customer.campaignAssets.create(campaignAssetOperations);
      routeLogger.info({ event: 'deploy_sitelinks_success' }, 'Successfully attached sitelinks to campaign');
    }

    // 4. Create Ad Groups, Keywords, and Ads iteratively
    routeLogger.info({ event: 'deploy_adgroups_create' }, 'Creating Ad Groups, Keywords, and RSAs');

    for (const group of blueprint.ad_groups) {
      // A. Create Ad Group (FIX: Wrapped payload in an array)
      const agRes = await customer.adGroups.create([{
        campaign: campaignResourceName,
        name: group.name,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD
      }]);
      const agResourceName = agRes.results[0].resource_name as string;

      // B. Create Keywords (Already an array via .map(), so this is fine)
      if (group.keywords && group.keywords.length > 0) {
        const keywordOperations = group.keywords.map((kw: string) => ({
          ad_group: agResourceName,
          status: enums.AdGroupCriterionStatus.ENABLED,
          keyword: {
            text: kw,
            match_type: enums.KeywordMatchType.PHRASE
          }
        }));
        await customer.adGroupCriteria.create(keywordOperations);
      }

      // C. Create the 3 RSA Variations (Already an array via .map(), so this is fine)
      if (group.ads && group.ads.length > 0) {
        const adOperations = group.ads.map((ad: any) => ({
          ad_group: agResourceName,
          status: enums.AdGroupAdStatus.ENABLED,
          ad: {
            final_urls: [blueprint.final_url || "https://example.com"],
            responsive_search_ad: {
              headlines: ad.headlines.map((h: string) => ({ text: h })),
              descriptions: ad.descriptions.map((d: string) => ({ text: d })),
              path1: "property",
              path2: "dubai"
            }
          }
        }));
        await customer.adGroupAds.create(adOperations);
      }
    }

    routeLogger.info({ event: 'deploy_success', campaignResourceName }, 'Campaign deployed to Google Ads successfully');

    // 5. Update the Blueprint Status to 'live' in Strapi
    routeLogger.info({ event: 'strapi_update_attempt' }, 'Updating Blueprint status to live');

    // Safely extract the numeric Google Campaign ID (e.g., from "campaigns/123456789")
    const numericCampaignId = campaignResourceName.split('/')[1];

    // FIX: Only passing 2 arguments to match your Strapi helper definition
    await updateUserBlueprint(blueprintId, {
      approvalState: 'live',
      googleCampaignId: numericCampaignId,
      blueprintData: blueprint,
    });

    // 6. Write to Strapi Audit Log
    try {
      routeLogger.info({ event: 'audit_log_attempt' }, 'Writing deployment success to audit logs');

      const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      const userData = await userRes.json();
      const userId = userData.documentId || userData.id;

      // Ensure you import logGoogleAuditAction at the top of the file
      await logGoogleAuditAction(
        userId,
        accountId,
        'campaign_launched',
        'success',
        {
          campaignId: numericCampaignId,
          campaignName: blueprint.campaign_theme,
          adGroupsDeployed: blueprint.ad_groups.length,
          timestamp: new Date().toISOString()
        });
    } catch (logError) {
      routeLogger.error({ err: logError }, 'Failed to save audit log to Strapi');
    }

    return NextResponse.json({ success: true, message: 'Deployed successfully', campaignId: numericCampaignId });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'deploy_failed' }, 'Failed to deploy campaign to Google Ads');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});