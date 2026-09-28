// riwaa/src/lib/meta-agent/meta-client.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FacebookAdsApi, AdAccount, Campaign, AdSet, Ad } from 'facebook-nodejs-business-sdk';

const DEFAULT_INSIGHT_FIELDS = [
  'campaign_id',
  'campaign_name',
  'adset_id',
  'adset_name',
  'spend',
  'impressions',
  'clicks',
  'ctr',
  'cpc',
  'cpm',
  'actions',
  'action_values',
  'reach',
  'frequency',
];

export class MetaClient {
  private account: AdAccount;
  private dryRun: boolean;

  constructor(dryRun: boolean = false) {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      throw new Error('Missing Meta API credentials (META_ACCESS_TOKEN or META_AD_ACCOUNT_ID)');
    }

    this.dryRun = dryRun;

    const api = FacebookAdsApi.init(accessToken);

    // Pass the api instance explicitly as the context for the AdAccount
    this.account = new AdAccount(adAccountId, api as any);
  }

  // Reads

  async getCampaigns(statusFilter?: string[]) {
    const params: any = {};
    // const params: any = { limit: '1000' };
    if (statusFilter) params.effective_status = statusFilter;
    const fields = ['id', 'name', 'status', 'effective_status', 'daily_budget', 'lifetime_budget', 'objective'];

    const campaigns = await this.account.getCampaigns(fields, params);
    // The Node SDK stores raw JSON inside the ._data property
    return campaigns.map((c: any) => c._data);
  }

  async getAdsets(campaignId: string) {
    const fields = ['id', 'name', 'status', 'effective_status', 'daily_budget', 'lifetime_budget', 'bid_amount', 'bid_strategy'];
    const campaign = new Campaign(campaignId);
    const adsets = await campaign.getAdSets(fields);
    return adsets.map((a: any) => a._data);
  }

  async getObject(objectId: string, level: 'campaign' | 'adset' | 'ad', fields: string[]) {
    const objMap = { campaign: Campaign, adset: AdSet, ad: Ad };
    const obj = new objMap[level](objectId);
    const data = await obj.get(fields);
    return data._data;
  }

  async getAccountInsights(datePreset: string = 'last_7d', level: string = 'campaign') {
    const params = { date_preset: datePreset, level };
    // const params = { date_preset: datePreset, level, limit: '1000' };
    const insights = await this.account.getInsights(DEFAULT_INSIGHT_FIELDS, params);
    return insights.map((i: any) => i._data);
  }

  // ates

  async createCampaign(spec: any): Promise<string> {
    const safeSpec = {
      ...spec,
      status: 'PAUSED',
      special_ad_categories: ['NONE'],
      is_adset_budget_sharing_enabled: false
    };

    if (this.dryRun) {
      console.log('[DRY RUN] createCampaign:', safeSpec);
      return 'dryrun_campaign_id';
    }
    const campaign = await this.account.createCampaign([], safeSpec);
    return campaign._data.id;
  }

  async createAdset(campaignId: string, spec: any): Promise<string> {
    const safeSpec = { ...spec, campaign_id: campaignId, status: 'PAUSED' };
    if (this.dryRun) {
      console.log('[DRY RUN] createAdset:', safeSpec);
      return 'dryrun_adset_id';
    }
    const adset = await this.account.createAdSet([], safeSpec);
    return adset._data.id;
  }

  // Updates

  async updateBudget(objectId: string, level: 'campaign' | 'adset', newDailyBudgetMinorUnits: number) {
    if (this.dryRun) {
      console.log(`[DRY RUN] updateBudget(${level}/${objectId}) -> ${newDailyBudgetMinorUnits}`);
      return;
    }
    const objMap = { campaign: Campaign, adset: AdSet };
    const obj = new objMap[level](objectId);
    // Pass an empty array [] for fields, then the params object
    await obj.update([], { daily_budget: newDailyBudgetMinorUnits });
  }

  async updateBid(adsetId: string, newBidMinorUnits: number) {
    if (this.dryRun) {
      console.log(`[DRY RUN] updateBid(adset/${adsetId}) -> ${newBidMinorUnits}`);
      return;
    }
    const adset = new AdSet(adsetId);
    await adset.update([], { bid_amount: newBidMinorUnits });
  }

  async setStatus(objectId: string, level: 'campaign' | 'adset' | 'ad', status: 'ACTIVE' | 'PAUSED') {
    if (this.dryRun) {
      console.log(`[DRY RUN] setStatus(${level}/${objectId}) -> ${status}`);
      return;
    }
    const objMap = { campaign: Campaign, adset: AdSet, ad: Ad };
    const obj = new objMap[level](objectId);
    await obj.update([], { status });
  }

  async createCreative(spec: any): Promise<string> {
    if (this.dryRun) {
      console.log('[DRY RUN] createCreative:', spec);
      return 'dryrun_creative_id';
    }
    const creative = await this.account.createAdCreative([], spec);
    return creative._data.id;
  }

  async createAd(adsetId: string, creativeId: string, name: string): Promise<string> {
    const spec = {
      name,
      adset_id: adsetId,
      creative: { creative_id: creativeId },
      status: 'PAUSED',
    };
    if (this.dryRun) {
      console.log('[DRY RUN] createAd:', spec);
      return 'dryrun_ad_id';
    }
    const ad = await this.account.createAd([], spec);
    return ad._data.id;
  }

  async pause(objectId: string, level: 'campaign' | 'adset' | 'ad') {
    await this.setStatus(objectId, level, 'PAUSED');
  }

  async activate(objectId: string, level: 'campaign' | 'adset' | 'ad') {
    await this.setStatus(objectId, level, 'ACTIVE');
  }
}