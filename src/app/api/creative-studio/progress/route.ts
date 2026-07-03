/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderTracker } from '@/lib/creative-studio/renderTracker';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return new Response('Missing jobId', { status: 400 });
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Helper to safely write SSE formatted data strings
  const writeSSE = async (data: object) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Set up the listener function for the tracker's event emitter
  const progressListener = (progress: number) => {
    writeSSE({ progress });
    if (progress >= 100 || progress === -1) {
      cleanup();
    }
  };

  const cleanup = () => {
    renderTracker.off(`progress:${jobId}`, progressListener);
    try {
      writer.close();
    } catch (e: any) { console.log(e) }
    renderTracker.clearJob(jobId);
  };

  // Listen for progress updates
  renderTracker.on(`progress:${jobId}`, progressListener);

  // If the request closes unexpectedly, clean up listeners immediately
  request.signal.addEventListener('abort', () => cleanup());

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}