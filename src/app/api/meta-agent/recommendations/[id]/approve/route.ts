/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import {
  getRecommendationById,
  updateRecommendationStatus,
  createAuditLog
} from '@/lib/meta-agent/strapi';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const recId = resolvedParams.id;
  try {
    const meta = new MetaClient();

    // 1. Fetch the recommendation from Strapi
    const rec = await getRecommendationById(recId);
    if (!rec || rec.status !== 'pending') throw new Error('Invalid or already processed recommendation');

    let newValue = null;

    // 2. Execute the action based on the AI's recommendation
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

    // 3. Update Strapi
    await updateRecommendationStatus(recId, 'executed', `new_value=${newValue}`);
    await createAuditLog('action_executed', { ...rec, new_value: newValue });

    return NextResponse.json({ success: true, message: 'Action executed successfully', newValue });
  } catch (error: any) {
    console.error('Approve Error:', error);
    if (recId) {
      await updateRecommendationStatus(recId, 'failed', error.message).catch(() => { });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}