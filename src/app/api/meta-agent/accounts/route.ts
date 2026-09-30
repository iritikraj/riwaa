/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/api/meta-agent/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/meta-agent/auth-guard';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export const GET = withLogger('/api/meta-agent/accounts', async (req: NextRequest, routeLogger) => {
  try {
    const user = await getSessionUser();

    // If admin, fetch all. If standard user, fetch only accounts where they are assigned.
    const query = user.isAdmin
      ? '?populate=*'
      : `?filters[assigned_users][id][$eq]=${user.id}&populate=*`;

    const res = await fetch(`${STRAPI_URL}/api/meta-accounts${query}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });

    const json = await res.json();

    // Map to a clean frontend-friendly array
    const accounts = (json.data || []).map((acc: any) => ({
      id: acc.documentId || acc.id,
      name: acc.attributes?.name || acc.name,
      ad_account_id: acc.attributes?.ad_account_id || acc.ad_account_id,
    }));

    routeLogger.info({ event: 'fetch_user_accounts', count: accounts.length }, 'Fetched accessible Meta accounts');

    return NextResponse.json({ success: true, data: accounts });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
});