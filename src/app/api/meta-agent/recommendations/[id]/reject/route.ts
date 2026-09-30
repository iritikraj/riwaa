// riwaa/src/app/api/meta-agent/recommendations/[id]/reject/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationById, updateRecommendationStatus, createAuditLog } from '@/lib/meta-agent/strapi';
import { getSessionUser, getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Authenticate the session
    const user = await getSessionUser();

    const resolvedParams = await params;
    const recId = resolvedParams.id;
    const { reason } = await req.json().catch(() => ({ reason: '' }));

    // 2. Fetch the recommendation to find out which account it belongs to
    const rec = await getRecommendationById(recId);
    if (!rec || !rec.meta_account) throw new Error('Invalid recommendation or missing account link');

    // 3. Verify the user actually has access to the client account this recommendation belongs to
    const accountId = rec.meta_account.documentId || rec.meta_account.id;
    await getAuthorizedMetaAccount(accountId);

    // 4. Update Strapi to mark the recommendation as rejected
    await updateRecommendationStatus(recId, 'rejected', reason);

    // 5. Log the rejection in the audit trail, strictly linked to the client and user
    await createAuditLog('recommendation_rejected', { id: recId, reason }, accountId, user.id);

    return NextResponse.json({ success: true, message: 'Recommendation rejected successfully' });
  } catch (error: any) {
    console.error('Reject Error:', error);
    const status = error.message.includes('Forbidden') || error.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}