// riwaa/src/app/api/meta-agent/recommendations/[id]/activate/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { createAuditLog } from '@/lib/meta-agent/strapi';
import { getSessionUser, getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the session
    const user = await getSessionUser();

    // 2. Extract accountId alongside the target object payload
    const { objectId, level, accountId } = await req.json();

    if (!objectId || !level || !accountId) {
      return NextResponse.json({ error: 'Missing objectId, level, or accountId' }, { status: 400 });
    }

    // 3. Verify access for this specific account
    const metaAccount = await getAuthorizedMetaAccount(accountId);

    // 4. Instantiate isolated MetaClient 
    const meta = new MetaClient({
      accessToken: metaAccount.access_token,
      adAccountId: metaAccount.ad_account_id
    });

    // 5. Send the activation command to Facebook
    await meta.setStatus(objectId, level as any, 'ACTIVE');

    // 6. Log the manual override in the audit trail, firmly linked to the client and user
    await createAuditLog('manual_activation', { object_id: objectId, level }, metaAccount.id, user.id);

    return NextResponse.json({ success: true, message: `${level} ${objectId} activated successfully` });
  } catch (error: any) {
    console.error('Activate Error:', error);
    const status = error.message.includes('Forbidden') || error.message === 'Unauthorized' ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}