/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import {
  getRecommendationById,
  updateRecommendationStatus,
  createAuditLog
} from '@/lib/meta-agent/strapi';
import { getSessionUser, getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recId = resolvedParams.id;

  try {
    const user = await getSessionUser();

    // 1. Fetch recommendation (ensure getRecommendationById populates 'meta_account')
    const rec = await getRecommendationById(recId);
    if (!rec || rec.status !== 'pending' || !rec.meta_account) {
      throw new Error('Invalid recommendation');
    }

    // 2. Extract the account ID from the recommendation
    const accountId = rec.meta_account.documentId || rec.meta_account.id;

    // 3. FIXED: Call the updated auth guard which only requires the accountId
    const metaAccount = await getAuthorizedMetaAccount(accountId);

    // 4. Safely extract Strapi attributes and secure the ID
    const attr = metaAccount.attributes || metaAccount;
    const safeAccountId = metaAccount.documentId || metaAccount.id;

    // 5. Initialize the MetaClient with the isolated credentials
    const meta = new MetaClient({
      accessToken: attr.access_token,
      adAccountId: attr.ad_account_id,
      pageId: attr.page_id,
      pixelId: attr.pixel_id
    });

    let newValue = null;

    // 6. Execute the action based on the AI's recommendation
    if (rec.action === 'pause') {
      await meta.setStatus(rec.object_id, rec.level as any, 'PAUSED');
    } else if (rec.action === 'increase_budget' || rec.action === 'decrease_budget') {
      const current = await meta.getObject(rec.object_id, rec.level as any, ['daily_budget']);
      const currentBudget = parseInt(current.daily_budget || '0');

      if (currentBudget <= 0) throw new Error('Could not read a valid daily_budget.');

      const newBudget = Math.round(currentBudget * (1 + (rec.change_pct / 100)));
      await meta.updateBudget(rec.object_id, rec.level as any, newBudget);
      newValue = newBudget;
    } else if (rec.action === 'increase_bid' || rec.action === 'decrease_bid') {
      if (rec.level !== 'adset') throw new Error('Bid changes only apply at the adset level.');

      const current = await meta.getObject(rec.object_id, 'adset', ['bid_amount']);
      const currentBid = parseInt(current.bid_amount || '0');

      if (currentBid <= 0) throw new Error('Could not read a valid bid_amount (ad set might be on automatic bidding).');

      const newBid = Math.round(currentBid * (1 + (rec.change_pct / 100)));
      await meta.updateBid(rec.object_id, newBid);
      newValue = newBid;
    }

    // 7. Update Strapi & log the event using the safeAccountId
    await updateRecommendationStatus(recId, 'executed', `new_value=${newValue}`);
    await createAuditLog('action_executed', { ...rec, new_value: newValue }, safeAccountId, user.id);

    return NextResponse.json({ success: true, message: 'Action executed successfully', newValue });
  } catch (error: any) {
    console.error('Approve Error:', error);
    if (recId) {
      await updateRecommendationStatus(recId, 'failed', error.message).catch(() => { });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}