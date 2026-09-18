/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';
import { getDeveloperAgentById } from '@/lib/real-estate-agents/strapi';

export const GET = withLogger('/api/real-estate-agents/developer-agents/[id]', async (
  req: NextRequest,
  routeLogger,
  context: { params: Promise<{ id: string }> } // Type as a Promise
) => {
  try {
    // Await the params before destructuring
    const resolvedParams = await context.params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    routeLogger.info({ event: 'polling_document', documentId: id }, 'Checking background worker status...');

    const data = await getDeveloperAgentById(id);

    if (!data) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'fetch_single_failed' }, 'Failed to fetch agent document');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});