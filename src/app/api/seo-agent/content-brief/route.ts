// src/app/api/seo-agent/content-brief/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { contentBriefQueue } from '@/workers/queue';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// export async function POST(req: NextRequest) {
export const POST = withLogger("/api/content-brief", async (req: NextRequest, routeLogger) => {
  try {
    routeLogger.info({ event: 'content_brief_api' }, 'Received content brief generation request...');

    const body = await req.json();
    const { topic, pageTypeId, urlPattern, internalBlueprintUrl, referenceUrls } = body;

    if (!topic || !pageTypeId || !urlPattern) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    routeLogger.info({ event: 'content_brief_save_started', topic }, 'Saving initial content brief batch to Strapi...');

    // 1. Create the placeholder record in Strapi
    const createRes = await fetch(`${STRAPI_URL}/api/content-briefs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          topic,
          // page_type_rule: pageTypeId, // Link to the relation
          page_type_rule: { connect: [pageTypeId] },
          url_pattern: urlPattern,
          internal_blueprint_url: internalBlueprintUrl || null,
          reference_urls: referenceUrls || [],
          audit_status: 'pending',
        },
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      routeLogger.error({ event: 'error_saving_content_brief', errorText }, 'Failed to create content brief record in Strapi');
      throw new Error('Failed to create content brief record in Strapi');
    }

    const recordData = await createRes.json();
    const documentId = recordData.data?.documentId || recordData.data?.id || recordData.id;

    // 2. Add Job to BullMQ Queue
    routeLogger.info({ event: 'queue_attempt' }, 'Triggering Content Brief Generation AI Worker...');

    const job = await contentBriefQueue.add('generate-brief', {
      documentId,
      topic,
      pageTypeId,
      urlPattern,
      internalBlueprintUrl,
      referenceUrls,
    }, {
      removeOnComplete: true,
      attempts: 2,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      documentId,
      message: 'Content brief generation queued.'
    });

  } catch (error: any) {
    routeLogger.error({ err: error }, 'Error in Content Brief Generation API');
    return NextResponse.json({ error: error?.message || 'Failed to process request.' }, { status: 500 });
  }
})