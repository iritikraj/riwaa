/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { renderTracker } from '@/lib/creative-studio/renderTracker';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. UPDATED: Extract the new multi-scene payload variables
    const { compositionId, theme_color, scenes, durationInFrames } = body;

    const jobId = `job_${Date.now()}`;

    (async () => {
      const entryPoint = path.resolve(process.cwd(), 'src/app/remotion/index.ts');

      const serveUrl = await bundle({
        entryPoint,
      });

      const localChromePath = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

      // 2. UPDATED: Pass the new schema into inputProps
      // 1. Select the composition (Keep this the same)
      const composition = await selectComposition({
        serveUrl,
        id: compositionId,
        inputProps: { theme_color, scenes },
        browserExecutable: localChromePath,
      });

      // 2. THE FIX: Override the duration directly on the composition object!
      composition.durationInFrames = durationInFrames || 270;

      const outputLocation = path.resolve(`./public/renders/${jobId}.mp4`);

      // 3. Render the video
      await renderMedia({
        serveUrl,
        outputLocation,
        composition, // This now contains the dynamically updated duration
        codec: 'h264',
        inputProps: { theme_color, scenes },
        browserExecutable: localChromePath,
        timeoutInMilliseconds: 60000,
        onProgress: ({ progress }) => {
          const percent = Math.round(progress * 100);
          renderTracker.updateProgress(jobId, percent);
        },
      });

      renderTracker.updateProgress(jobId, 100);
    })().catch(err => {
      console.error("Render execution failed:", err);
      renderTracker.updateProgress(jobId, -1);
    });

    return NextResponse.json({ success: true, jobId });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}