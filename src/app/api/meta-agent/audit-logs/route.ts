// riwaa/src/app/api/meta-agent/audit-logs/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedMetaAccount } from '@/lib/meta-agent/auth-guard';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export const GET = withLogger('/api/meta-agent/audit-logs', async (req: NextRequest, routeLogger) => {
  try {
    const searchParams = new URL(req.url).searchParams;
    const limit = searchParams.get('limit') || '50';
    const accountId = searchParams.get('accountId');

    routeLogger.info({ event: 'fetch_audit_logs_started', limit }, 'Fetching Meta audit logs from Strapi');

    if (!accountId) return NextResponse.json({ error: 'accountId is required' }, { status: 400 });

    // 1. Get the authorized meta account which contains the numeric database ID
    const metaAccount = await getAuthorizedMetaAccount(accountId);

    // Fallback safely to extract the numeric ID
    const numericId = metaAccount.id || metaAccount.documentId;

    // 2. Query using Strapi's standard relation ID filter
    const query = new URLSearchParams({
      'sort': 'createdAt:desc',
      'pagination[limit]': limit,
      'filters[meta_account][id]': String(numericId),
      'populate': '*'
    }).toString();

    const res = await fetch(`${STRAPI_URL}/api/meta-audit-logs?${query}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errText = await res.text();
      routeLogger.error({ event: 'fetch_audit_logs_failed', status: res.status, errText }, 'Strapi rejected audit log query');
      return NextResponse.json({ success: false, error: 'Failed to fetch audit logs from database' }, { status: res.status });
    }

    const json = await res.json();

    routeLogger.info({ event: 'fetch_audit_logs_success', count: json.data?.length }, 'Successfully fetched audit logs');

    return NextResponse.json({ success: true, data: json.data });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_audit_logs_error' }, 'Failed to fetch Meta audit logs');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});