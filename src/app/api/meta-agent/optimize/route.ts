/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { metaOptimizerQueue } from '@/workers/queue';

export async function POST() {
  try {
    // 2. Push a job into the BullMQ queue
    await metaOptimizerQueue.add('manual-optimization-run', {
      triggered_by: 'admin',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Optimization job queued successfully. Check terminal for worker logs.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}