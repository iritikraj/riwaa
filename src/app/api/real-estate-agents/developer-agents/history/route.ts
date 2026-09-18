/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export const GET = withLogger('/api/real-estate-agents/developer-agents/history', async (_, routeLogger) => {
  try {
    routeLogger.info({ event: 'fetching_history' }, 'Retrieving developer agent pages...');

    // Fetch from Strapi, sorted by newest first
    const response = await fetch(`${STRAPI_URL}/api/developer-agents?sort=createdAt:desc`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Strapi Error: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'history_fetch_failed' }, 'Failed to fetch history');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});