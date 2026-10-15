/* eslint-disable @typescript-eslint/no-explicit-any */
import { redisOptions } from '@/workers/queue';
import { Job, Worker } from 'bullmq';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { getGoogleAccountByCustomerId, updateGoogleCampaignBlueprint } from '@/lib/google-ads-agent/strapi';

export const createGoogleAdsLaunchWorker = () => new Worker('launch-campaign-queue', async (job: Job) => {
  const { blueprintId, customerId, campaignData } = job.data;
  console.log(`[Google Ads Worker] Initiating Launch for Blueprint ${blueprintId}...`);

  try {
    // 1. Fetch the Google Account from Strapi using the helper
    const accountData = await getGoogleAccountByCustomerId(customerId);

    if (!accountData) {
      throw new Error(`No Google Account found in Strapi for Customer ID: ${customerId}`);
    }

    const refreshToken = accountData.refreshToken;
    const loginCustomerId = accountData.loginCustomerId || "5426907660";

    // 2. Initialize Google Ads Client
    const googleAdsClient = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    const customer = googleAdsClient.Customer({
      customer_id: customerId,
      // login_customer_id: loginCustomerId,
      refresh_token: refreshToken,
    });

    console.log(`[Google Ads Worker] Creating Budget & Campaign...`);

    // 3. Create Budget (Note the array brackets [])
    const budgetRes = await customer.campaignBudgets.create([{
      amount_micros: 50000000,
      explicitly_shared: false,
    }]);

    const budgetResourceName = budgetRes.results[0]?.resource_name;
    if (!budgetResourceName) throw new Error("Failed to retrieve budget resource name");

    // 4. Create Campaign (Note the array brackets [])
    const campaignRes = await customer.campaigns.create([{
      name: `${campaignData.campaign_theme} - ${Date.now()}`,
      status: enums.CampaignStatus.PAUSED,
      advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
      campaign_budget: budgetResourceName,
      network_settings: {
        target_google_search: true,
        target_search_network: true,
        target_content_network: false,
      }
    }]);

    const campaignResourceName = campaignRes.results[0]?.resource_name;
    if (!campaignResourceName) throw new Error("Failed to retrieve campaign resource name");

    const liveCampaignId = campaignResourceName.split('/')[3];

    console.log(`[Google Ads Worker] Campaign Created: ${liveCampaignId}. Building Ad Groups...`);

    // 5. Iterate and Create Ad Groups, Keywords, and RSAs
    for (const group of campaignData.ad_groups) {
      // 5A. Create Ad Group (Note the array brackets [])
      const adGroupRes = await customer.adGroups.create([{
        campaign: campaignResourceName,
        name: group.name,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD,
      }]);

      const adGroupResourceName = adGroupRes.results[0]?.resource_name;
      if (!adGroupResourceName) throw new Error(`Failed to create Ad Group: ${group.name}`);

      // 5B. Create Keywords (Exact Match)
      const keywordCriteria = group.keywords.map((kw: string) => ({
        ad_group: adGroupResourceName,
        status: enums.AdGroupCriterionStatus.ENABLED,
        keyword: {
          text: kw,
          match_type: enums.KeywordMatchType.EXACT,
        }
      }));

      // Use .create() directly with the mapped array instead of .mutate()
      if (keywordCriteria.length > 0) {
        await customer.adGroupCriteria.create(keywordCriteria);
      }

      // 5C. Create Responsive Search Ad (RSA)
      const headlines = group.ads.headlines.map((text: string) => ({ text }));
      const descriptions = group.ads.descriptions.map((text: string) => ({ text }));

      // Note the array brackets [] around the payload
      await customer.adGroupAds.create([{
        ad_group: adGroupResourceName,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: ["https://your-fallback-url.com"],
          responsive_search_ad: {
            headlines: headlines,
            descriptions: descriptions,
          }
        }
      }]);
    }

    console.log(`[Google Ads Worker] Successfully mutated Google Ads. Updating Strapi Blueprint...`);

    // 6. Update Strapi to mark as Live using the helper
    await updateGoogleCampaignBlueprint(blueprintId, {
      approvalState: 'live',
      googleCampaignId: liveCampaignId
    });

    console.log(`[Google Ads Worker] Job ${job.id} completely finished.`);
    return { success: true, liveCampaignId };

  } catch (error: any) {
    console.error(`[Google Ads Worker] Failed to launch campaign:`, error);

    // Update Strapi to Failed
    await updateGoogleCampaignBlueprint(blueprintId, {
      approvalState: 'failed'
    }).catch(e => console.error('Failed to update Strapi error state:', e));

    throw error;
  }
}, {
  connection: redisOptions as any,
  concurrency: 1
});