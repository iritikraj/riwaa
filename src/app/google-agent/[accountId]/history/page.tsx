import { fetchGoogleAuditLogs } from '@/lib/google-ads-agent/strapi';
import HistoryClient from './_client';

export default async function GoogleHistoryPage({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;
  const logs = await fetchGoogleAuditLogs(resolvedParams.accountId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <header className="mb-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase">
          Deployment Logs
        </p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-[0.01em] sm:text-5xl uppercase font-cormorant">
          Audit History
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-[#565C6B] max-w-2xl">
          A chronological ledger of all campaigns drafted and structural optimizations executed by the AI.
        </p>
      </header>

      {/* Render the new interactive client table */}
      <HistoryClient logs={logs} />
    </div>
  );
}