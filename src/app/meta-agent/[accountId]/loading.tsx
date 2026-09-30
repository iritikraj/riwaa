// riwaa/src/app/meta-agent/[accountId]/loading.tsx
import { Activity } from 'lucide-react';

export default function WorkspaceLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <Activity className="animate-spin text-[#9C7A3C] mb-4" size={32} />
      <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#14181F]/60">
        Loading...
      </p>
    </div>
  );
}