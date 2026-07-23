/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/seo-agent/queue';
import { logger } from '@/lib/logs/logger';

const complianceQueue = new Queue('compliance-audit-queue', {
  connection: redisConnection as any,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await complianceQueue.getJob(params.id);

    if (!job) {
      logger.warn(`[STATUS_CHECK_WARNING] Job ID ${params.id} not found.`);
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
    logger.error(`[STATUS_CHECK_ERROR] Failed to fetch job status for ID ${params.id}: ${error?.message}`, error);
    return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 });
  }
}