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

export interface MetaClientConfig {
  accessToken: string;
  adAccountId: string;
  pageId?: string;
  pixelId?: string;
}

export class MetaClient {
  private account: AdAccount;
  private dryRun: boolean;

  public pageId?: string;
  public pixelId?: string;

  constructor(config: MetaClientConfig, dryRun: boolean = false) {
    if (!config.accessToken || !config.adAccountId) {
      throw new Error('Missing Meta API credentials in config');
    }

    this.dryRun = dryRun;
    this.pageId = config.pageId;
    this.pixelId = config.pixelId;

    // FIX: Initialize the SDK context for this request lifecycle
    // This satisfies the internal Cursor object used by getInsights()
    FacebookAdsApi.init(config.accessToken);

    const formattedAccountId = config.adAccountId.startsWith('act_')
      ? config.adAccountId
      : `act_${config.adAccountId}`;

    // The account now automatically inherits the initialized API context
    this.account = new AdAccount(formattedAccountId);
  }

  // Reads

  async getCampaigns(statusFilter?: string[]) {
    const params: any = {};
    if (statusFilter) params.effective_status = statusFilter;
    const fields = ['id', 'name', 'status', 'effective_status', 'daily_budget', 'lifetime_budget', 'objective'];

    const campaigns = await this.account.getCampaigns(fields, params);
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
    const insights = await this.account.getInsights(DEFAULT_INSIGHT_FIELDS, params);
    return insights.map((i: any) => i._data);
  }

  // Creates

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