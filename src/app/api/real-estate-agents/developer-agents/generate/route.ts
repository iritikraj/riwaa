/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { developerAgentQueue } from '@/workers/queue';
import { withLogger } from '@/utils/logs/withLogger';
import { DEVELOPERS_REGISTRY } from '@/utils/data/developers';
import { createDeveloperAgentInStrapi } from '@/lib/real-estate-agents/strapi';

export const POST = withLogger('/api/real-estate-agents/developer-agents/generate', async (req: NextRequest, routeLogger) => {
  try {
    const { developerId, propertyFinderUrl } = await req.json();

    if (!developerId || !propertyFinderUrl) {
      return NextResponse.json({ error: 'Missing developerId or propertyFinderUrl' }, { status: 400 });
    }

    const developerConfig = DEVELOPERS_REGISTRY[developerId];
    if (!developerConfig) {
      return NextResponse.json({ error: 'Invalid developer selected' }, { status: 400 });
    }

    // 1. Create placeholder record in Strapi
    routeLogger.info({ event: 'creating_placeholder' }, 'Creating initial processing record in Strapi...');
    const record = await createDeveloperAgentInStrapi({
      developer_name: developerConfig.name,
      developer_logo: developerConfig.logoUrl,
      report_status: 'processing',
      developer_profile: developerConfig.profileText,
      projects_list: developerConfig.projects,
      hero_banner: developerConfig.heroBanner || null,
      agent_data: {},
      agent_bio: '',
    });

    const documentId = record.documentId || record.id;

    // 2. Dispatch job to BullMQ
    routeLogger.info({ event: 'queueing_job', documentId }, 'Adding task to developerAgentQueue...');
    await developerAgentQueue.add('generate-developer-agent-page', {
      documentId,
      developerId,
      propertyFinderUrl,
    });

    // 3. Return immediately
    return NextResponse.json({ success: true, documentId });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'generate_route_error' }, 'Failed to initiate agent page generation');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
});