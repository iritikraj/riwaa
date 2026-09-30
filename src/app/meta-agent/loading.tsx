// riwaa/src/app/meta-agent/loading.tsx
import { Activity } from 'lucide-react';

export default function WorkspaceLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FCFBF8] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#9C7A3C]/5 blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center z-10">
        {/* Icon Container with subtle spinning border */}
        <div className="flex h-16 w-16 items-center justify-center mb-6 relative">
          <Activity className="animate-spin text-[#9C7A3C] mb-4" size={32} />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#14181F]/60 font-jost">
            Connecting to your Workspace...
          </p>
        </div>
      </div>
    </div>
  );
}