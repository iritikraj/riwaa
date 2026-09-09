/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/lib/logs/withLogger';
import { updateDeveloperAgentInStrapi } from '@/lib/real-estate-agents/strapi';

export const POST = withLogger('/api/real-estate-agents/developer-agents/save', async (req: NextRequest, routeLogger) => {
  try {
    const { documentId, finalData } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    routeLogger.info({ event: 'publishing_page', documentId }, 'Finalizing developer agent page...');

    // 1. Generate a clean URL slug (e.g., "emaar-john-doe-4f2a")
    const agentNameSlug = (finalData.agent_data?.name || 'agent').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const devNameSlug = (finalData.developer_name || 'dev').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const randomHash = Math.random().toString(36).substring(2, 6);
    const uniqueSlug = `${devNameSlug}-${agentNameSlug}-${randomHash}`;

    // 2. STRIP SYSTEM FIELDS: Remove id, createdAt, updatedAt, etc.
    const { id, documentId: docId, createdAt, updatedAt, publishedAt, ...cleanData } = finalData;

    // 3. Flip status to published and lock in the slug using ONLY the clean data
    const publishedRecord = await updateDeveloperAgentInStrapi(documentId, {
      ...cleanData,
      report_status: 'published',
      slug: uniqueSlug
    });

    routeLogger.info({ event: 'publish_success', slug: uniqueSlug }, 'Page published successfully');

    return NextResponse.json({ success: true, slug: uniqueSlug, data: publishedRecord });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'publish_failed' }, 'Failed to publish page');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});