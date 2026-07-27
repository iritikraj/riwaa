'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LayoutTemplate, CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { id: 'processing', label: 'Initializing Queue' },
  { id: 'downloading_brief', label: 'Downloading Brief' },
  { id: 'scraping_live_url', label: 'Extracting Live DOM' },
  { id: 'running_ai_analysis', label: 'Running Strict Comparison' },
];

export default function LiveProgressTracker({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<string>('processing');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/seo-agent/compliance/status?id=${documentId}`);
        const data = await res.json();

        if (data.status) {
          setCurrentStatus(data.status);
        }

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
          router.refresh();
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [documentId, router]);

  // Determine active step index
  const activeIndex = STEPS.findIndex(s => s.id === currentStatus);
  const displayIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="py-16 px-8 text-center border border-neutral-200 rounded-3xl bg-white shadow-sm max-w-2xl mx-auto print:hidden">
      <LayoutTemplate className="w-12 h-12 text-[#b8924a] mx-auto mb-6 animate-pulse" />
      <h3 className="text-xl font-light text-neutral-900 mb-2">Audit in Progress</h3>
      <p className="text-neutral-500 text-sm mb-10">Please hold on while the worker processes your request in real-time.</p>

      <div className="space-y-4 max-w-sm mx-auto text-left">
        {STEPS.map((step, index) => {
          const isCompleted = index < displayIndex;
          const isActive = index === displayIndex;

          return (
            <div key={step.id} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${isActive ? 'bg-emerald-50/50 border border-emerald-100' : 'border border-transparent'}`}>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-neutral-200 shrink-0" />
              )}
              <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-emerald-900' : isCompleted ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}