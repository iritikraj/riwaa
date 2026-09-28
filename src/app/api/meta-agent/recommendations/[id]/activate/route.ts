/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { MetaClient } from '@/lib/meta-agent/meta-client';
import { createAuditLog } from '@/lib/meta-agent/strapi';

export async function POST(req: NextRequest) {
  try {
    const { objectId, level } = await req.json();

    if (!objectId || !level) {
      return NextResponse.json({ error: 'Missing objectId or level' }, { status: 400 });
    }

    const meta = new MetaClient();

    // 1. Send the activation command to Facebook
    await meta.setStatus(objectId, level as any, 'ACTIVE');

    // 2. Log the manual override in the audit trail
    await createAuditLog('manual_activation', { object_id: objectId, level });

    return NextResponse.json({ success: true, message: `${level} ${objectId} activated successfully` });
  } catch (error: any) {
    console.error('Activate Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}