/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { updateRecommendationStatus, createAuditLog } from '@/lib/meta-agent/strapi';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const recId = resolvedParams.id;
    const { reason } = await req.json().catch(() => ({ reason: '' }));

    // 1. Update Strapi to mark the recommendation as rejected
    await updateRecommendationStatus(recId, 'rejected', reason);

    // 2. Log the rejection in the audit trail
    await createAuditLog('recommendation_rejected', { id: recId, reason });

    return NextResponse.json({ success: true, message: 'Recommendation rejected successfully' });
  } catch (error: any) {
    console.error('Reject Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}