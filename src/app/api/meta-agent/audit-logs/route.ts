// riwaa/src/app/api/meta-agent/audit-logs/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export const GET = withLogger('/api/meta-agent/audit-logs', async (req: NextRequest, routeLogger) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || '50';

    routeLogger.info({ event: 'fetch_audit_logs_started', limit }, 'Fetching Meta audit logs from Strapi');

    // Fetch directly from Strapi sorted by newest
    const res = await fetch(`${STRAPI_URL}/api/meta-audit-logs?sort=createdAt:desc&pagination[limit]=${limit}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      routeLogger.warn({ event: 'fetch_audit_logs_failed', status: res.status }, 'Strapi returned a non-OK status for audit logs');
    }

    const json = await res.json();

    routeLogger.info({ event: 'fetch_audit_logs_success', count: json.data?.length }, 'Successfully fetched audit logs');

    return NextResponse.json({ success: true, data: json.data });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_audit_logs_error' }, 'Failed to fetch Meta audit logs');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});