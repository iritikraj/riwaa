// riwaa/src/app/api/meta-agent/optimize/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { metaOptimizerQueue } from '@/workers/queue';
import { withLogger } from '@/utils/logs/withLogger';

export const POST = withLogger('/api/meta-agent/optimize', async (req: NextRequest, routeLogger) => {
  try {
    routeLogger.info({ event: 'manual_optimization_triggered' }, 'Admin requested manual Meta optimization run');

    // Push a job into the BullMQ queue
    await metaOptimizerQueue.add('manual-optimization-run', {
      triggered_by: 'admin',
      timestamp: new Date().toISOString()
    });

    routeLogger.info({ event: 'manual_optimization_queued' }, 'Optimization job successfully added to BullMQ');

    return NextResponse.json({
      success: true,
      message: 'Optimization job queued successfully. Check terminal for worker logs.'
    });
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'manual_optimization_error' }, 'Failed to queue manual optimization job');
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});