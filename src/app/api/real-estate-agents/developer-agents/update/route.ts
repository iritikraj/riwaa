/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/lib/logs/withLogger';
import { updateDeveloperAgentInStrapi } from '@/lib/real-estate-agents/strapi';

export const PUT = withLogger('/api/real-estate-agents/developer-agents/update', async (req: NextRequest, routeLogger) => {
  try {
    const { documentId, updates } = await req.json();

    if (!documentId || !updates) {
      return NextResponse.json({ error: 'Missing documentId or updates payload' }, { status: 400 });
    }

    routeLogger.info({ event: 'updating_draft', documentId }, 'Saving inline edits to Strapi...');

    // We only allow updating specific fields to prevent overwriting the whole document accidentally
    const updatedRecord = await updateDeveloperAgentInStrapi(documentId, updates);

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'update_failed' }, 'Failed to save edits');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});