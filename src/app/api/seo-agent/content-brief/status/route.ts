export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';

export const GET = withLogger('/api/content-brief/status', async (req: NextRequest, routeLogger) => {
  routeLogger.info({ event: 'fetch_content_brief_status' }, 'Fetching content brief status...');

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    routeLogger.info({ event: 'fetch_content_brief_status_failed' }, 'Error while fetching content brief status: Missing document ID');
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }

  try {
    routeLogger.info({ event: 'fetch_content_brief_status_started', id }, 'Fetching content brief status...');
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/content-briefs/${id}?fields[0]=audit_status`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      routeLogger.info({ event: 'fetch_content_brief_status_failed' }, 'Failed to fetch status from Strapi');
      throw new Error('Failed to fetch status')
    };

    const data = await res.json();
    const status = data.data?.attributes?.audit_status || data.data?.audit_status || 'processing';

    // If completed, fetch the full data payload to render the brief
    let finalData = null;
    if (status === 'completed') {
      const fullRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/content-briefs/${id}?populate=*`, {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
        cache: 'no-store'
      });
      const fullJson = await fullRes.json();
      finalData = fullJson.data?.attributes?.generated_data || fullJson.data?.generated_data;
    }

    routeLogger.info({ event: 'fetch_content_brief_status_success' }, 'Successfully fetched content brief status.');
    return NextResponse.json({ status, generatedData: finalData });
  } catch (error) {
    routeLogger.info({ event: 'fetch_content_brief_status_failed', error }, 'Failed to fetch content brief status.');
    return NextResponse.json({ status: 'processing' });
  }
});