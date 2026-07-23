/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/seo-agent/queue';
import { logger } from '@/lib/logs/logger';

const complianceQueue = new Queue('compliance-audit-queue', {
  connection: redisConnection as any,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object to extract the id
    const { id } = await params;

    const job = await complianceQueue.getJob(id);

    if (!job) {
      logger.warn(`[STATUS_CHECK_WARNING] Job ID ${id} not found.`);
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    const state = await job.getState();
    const progress = job.progress;

    // If completed, the worker should return the newly created Strapi Record ID
    const result = job.returnvalue;

    return NextResponse.json({
      jobId: job.id,
      state, // 'waiting', 'active', 'completed', 'failed'
      progress,
      result, // Contains the Strapi ID once completed
      failedReason: job.failedReason,
    });

  } catch (error: any) {
    logger.error(`[STATUS_CHECK_ERROR] Failed to fetch job status for ID: ${error?.message}`, error);
    return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 });
  }
}