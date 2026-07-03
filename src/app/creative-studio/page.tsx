/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

export default function StudioDashboard() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<'Square-1x1' | 'Vertical-9x16'>('Vertical-9x16');
  const [prompt, setPrompt] = useState('');

  const handleGenerateAd = async () => {
    setLoading(true);
    setProgress(0);
    setVideoUrl(null);

    const activePrompt = prompt.trim() || "A luxurious waterfront property teasing scale and consistency.";

    // 1. Mocked Architectural Video Assets (Replace with S3 Signed URLs later)
    const availableAssets = [
      "https://media.w3.org/2010/05/sintel/trailer.mp4",
      "https://media.w3.org/2010/05/bunny/trailer.mp4",
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ];

    try {
      // 2. Ping the Python CrewAI Director for the sequenced script
      const scriptResponse = await fetch('http://localhost:8000/api/v1/generate-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          available_assets: availableAssets,
          target_language: 'en'
        }),
      });

      const scriptResult = await scriptResponse.json();

      if (!scriptResult.success) {
        alert("The AI Director failed to sequence the script.");
        setLoading(false);
        return;
      }

      // 3. Build the dynamic payload for Remotion (Feeding the Scene array)
      const totalFrames = scriptResult.data.scenes.reduce((acc: any, scene: any) => acc + scene.duration_in_frames, 0);

      const aiPayload = {
        compositionId: "Vertical-9x16",
        theme_color: scriptResult.data.theme_color || "#bc9c22",
        scenes: scriptResult.data.scenes,
        // ADD THIS: Explicitly pass the total duration
        durationInFrames: totalFrames
      };

      // 4. Dispatch to your Next.js Remotion Renderer Route
      const renderResponse = await fetch('/api/creative-studio/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiPayload),
      });

      const renderData = await renderResponse.json();

      if (!renderData.success) {
        alert(`Failed to initialize render job: ${renderData.error}`);
        setLoading(false);
        return;
      }

      // 5. Stream the progress bar
      const { jobId } = renderData;
      const eventSource = new EventSource(`/api/creative-studio/progress?jobId=${jobId}`);

      eventSource.onmessage = (event) => {
        const progressData = JSON.parse(event.data);

        if (progressData.progress === -1) {
          alert("Render failed on the server.");
          eventSource.close();
          setLoading(false);
        } else {
          setProgress(progressData.progress);

          if (progressData.progress >= 100) {
            eventSource.close();
            setVideoUrl(`/renders/${jobId}.mp4`);
            setLoading(false);
          }
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
      };

    } catch (err) {
      console.error("Pipeline failure:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 font-sans selection:bg-[#bc9c22] selection:text-white pb-24">

      {/* HEADER */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#bc9c22] to-yellow-600 shadow-[0_0_15px_rgba(188,156,34,0.4)]" /> */}
            <h1 className="text-xl font-medium tracking-wide text-white">Creative <span className="text-neutral-500">Studio</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-12 flex flex-col gap-8">

        {/* GENERATION CONSOLE */}
        <div className="bg-[#121214] border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the ad campaign you want to generate..."
              className="w-full bg-transparent text-lg text-white placeholder-neutral-600 resize-none outline-none min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 px-4 pb-2">

            {/* FORMAT TOGGLES */}
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveFormat('Square-1x1')}
                className={`... px-2 rounded-sm ${activeFormat === 'Square-1x1' ? 'bg-neutral-800 text-white shadow-sm cursor-not-allowed' : 'cursor-pointer text-neutral-500 hover:text-neutral-300'}`}
              >
                1:1 Meta
              </button>
              <button
                onClick={() => setActiveFormat('Vertical-9x16')}
                className={`... px-2 rounded-sm ${activeFormat === 'Vertical-9x16' ? 'bg-neutral-800 text-white shadow-sm cursor-not-allowed' : 'cursor-pointer text-neutral-500 hover:text-neutral-300'}`}
              >
                9:16 TikTok
              </button>
            </div>

            {/* ACTION BUTTON */}
            <button
              disabled={loading}
              onClick={handleGenerateAd}
              className="bg-[#bc9c22] cursor-pointer hover:bg-[#a3871d] disabled:bg-[#bc9c22]/50 text-white px-6 py-2 rounded-lg font-medium tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(188,156,34,0.2)] hover:shadow-[0_0_25px_rgba(188,156,34,0.4)] disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Synthesizing...
                </>
              ) : 'Generate'}
            </button>
          </div>
        </div>

        {/* PROGRESS STATE */}
        {progress !== null && !videoUrl && (
          <div className="animate-pulse bg-[#121214] border border-[#bc9c22]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(188,156,34,0.05)]">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#bc9c22] font-medium tracking-wider uppercase text-xs">Orchestrating Agents & Rendering Video</span>
              <span className="text-white font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-yellow-700 to-[#bc9c22] h-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]" />
              </div>
            </div>
          </div>
        )}

        {/* FINAL OUTPUT */}
        {videoUrl && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex flex-col items-center mt-4">
            <div className={`relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black ${activeFormat === 'Vertical-9x16' ? 'w-[320px] aspect-[9/16]' : 'w-[500px] aspect-square'}`}>
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-6 text-sm text-neutral-500 font-mono">
              Creative successfully generated via Remotion Engine.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}