// riwaa/src/app/api/google-agent/blueprints/[id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchBlueprintById } from '@/lib/google-ads-agent/strapi';
import { withLogger } from '@/utils/logs/withLogger';

export const GET = withLogger('/api/google-agent/blueprints/[id]', async (req: NextRequest, routeLogger, { params }: { params: { id: string } | Promise<{ id: string }> }) => {
  try {
    // Next.js 15 compatibility: await params if it's a promise
    const resolvedParams = await params;
    const blueprintId = resolvedParams.id;

    routeLogger.info({ event: 'fetch_blueprint_start', blueprintId }, 'Attempting to fetch campaign blueprint');

    const cookieStore = await cookies();
    const token = cookieStore.get('riwaa_session')?.value;

    if (!token) {
      routeLogger.warn({ event: 'fetch_blueprint_unauthorized', blueprintId }, 'Unauthorized access attempt: No session token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    routeLogger.info({ event: 'fetch_blueprint_strapi_attempt', blueprintId }, 'Fetching blueprint data from Strapi');

    const blueprintData = await fetchBlueprintById(blueprintId);

    routeLogger.info({ event: 'fetch_blueprint_success', blueprintId }, 'Successfully retrieved blueprint data');

    return NextResponse.json({ success: true, blueprint: blueprintData });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_blueprint_error', blueprintId: (await params).id }, 'Failed to fetch blueprint due to an internal error');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});