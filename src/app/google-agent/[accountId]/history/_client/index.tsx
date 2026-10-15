'use client';

import { useState } from 'react';
import { History as HistoryIcon, ArrowUpRight, CheckCircle2, XCircle, X } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HistoryClient({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  return (
    <>
      <div className="bg-white rounded-4xl border border-[#14181F]/10 shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center min-h-100">
            <div className="h-16 w-16 bg-[#FCFBF8] border border-[#14181F]/10 rounded-2xl flex items-center justify-center mb-6">
              <HistoryIcon size={28} className="text-[#14181F]/40" />
            </div>
            <h2 className="text-xl font-semibold text-[#14181F] mb-2">No History Found</h2>
            <p className="text-[14px] text-[#565C6B] max-w-sm">
              Once campaigns are generated and deployed to Google Ads, their execution logs will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#14181F]/5 bg-[#FCFBF8]">
                  <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-widest text-[#14181F]/60">Date</th>
                  <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-widest text-[#14181F]/60">Action</th>
                  <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-widest text-[#14181F]/60">Status</th>
                  <th className="px-8 py-5 text-[11px] font-semibold uppercase tracking-widest text-[#14181F]/60 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14181F]/5">
                {logs.map((log: any) => {
                  const data = log.attributes || log;
                  const isSuccess = data.outcome === 'success';

                  return (
                    <tr key={log.id} className="hover:bg-[#FCFBF8]/50 transition-colors">
                      <td className="px-8 py-5 text-[13px] text-[#565C6B]">
                        {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-8 py-5 text-[14px] font-medium text-[#14181F]">
                        {data.actionType === 'recommendation_applied' ? 'Applied AI Optimization' :
                          data.actionType === 'campaign_launched' ? 'Launched Blueprint' :
                            data.actionType === 'blueprint_generated' ? 'Generated Draft Blueprint' :
                              data.actionType === 'keyword_research_completed' ? 'Completed Keyword Research' :
                                data.actionType}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {isSuccess ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {data.outcome}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => setSelectedLog(data)}
                          className="text-[#9C7A3C] cursor-pointer hover:text-[#14181F] bg-[#9C7A3C]/5 hover:bg-[#14181F]/5 rounded-lg transition-colors p-2"
                        >
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal Popup */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14181F]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#14181F]/5 bg-[#FCFBF8]">
              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#9C7A3C] uppercase mb-1">
                  Log Details
                </h3>
                <p className="text-[15px] font-medium text-[#14181F]">
                  {selectedLog.actionType === 'recommendation_applied' ? 'Applied AI Optimization' :
                    selectedLog.actionType === 'campaign_launched' ? 'Launched Blueprint' :
                      selectedLog.actionType === 'blueprint_generated' ? 'Generated Draft Blueprint' :
                        selectedLog.actionType === 'keyword_research_completed' ? 'Completed Keyword Research' :
                          selectedLog.actionType}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 cursor-pointer text-[#14181F]/40 hover:text-[#14181F] hover:bg-[#14181F]/5 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (JSON Payload) */}
            <div className="p-6 overflow-y-auto bg-white flex-1">
              <pre className="bg-[#14181F] text-[#FCFBF8] p-5 rounded-2xl text-[13px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#14181F]/5 bg-[#FCFBF8] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 cursor-pointer text-[13px] font-medium bg-white border border-[#14181F]/10 rounded-xl hover:bg-[#14181F]/5 transition-colors text-[#14181F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}