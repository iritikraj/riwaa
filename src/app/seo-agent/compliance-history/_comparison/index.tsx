/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangle, CheckCircle, CheckCircle2, FileText, Globe, PlusCircle, XCircle } from "lucide-react";

export const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'pass') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  return <XCircle className="w-5 h-5 text-rose-500" />;
};

// --- Helper Functions ---
export const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

const normalize = (str: string) => {
  if (!str) return '';
  const stripInstructions = str.replace(/\s*[\(\[].*?[\)\]]\s*/g, ' ');
  return stripInstructions.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
};

const ComparisonRow = ({ label, expected, actual, status, message }: any) => {
  // Renders single strings (Meta Title, Description, H1)
  const renderSingleString = (content: any) => {
    if (!content) return <span className="text-neutral-400 italic">Not specified / Not found</span>;
    return <p className="leading-relaxed">{content}</p>;
  };

  // Renders and cross-references arrays (H2s, H3s)
  const renderArrayComparison = () => {
    const expArr = Array.isArray(expected) ? expected.filter(Boolean) : [];
    const actArr = Array.isArray(actual) ? actual.filter(Boolean) : [];

    const expNorms = expArr.map(normalize);
    const actNorms = actArr.map(normalize);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EXPECTED COLUMN */}
        <div className="rounded-xl bg-neutral-50 border border-neutral-200/60 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-3.5 h-3.5 text-[#b8924a]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#b8924a] font-bold">Brief Data (Expected)</span>
          </div>

          {expArr.length === 0 ? (
            <span className="text-neutral-400 italic text-sm">No items specified in brief.</span>
          ) : (
            <ul className="space-y-3">
              {expArr.map((item, i) => {
                const nItem = normalize(item);
                // Fuzzy match to see if expected item exists in actual array
                const isFound = actNorms.some(a => a.includes(nItem) || nItem.includes(a));

                return (
                  <li key={`exp-${i}`} className="flex items-start gap-2.5">
                    {isFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className={`text-sm ${isFound ? "text-neutral-700" : "text-rose-600 font-medium"}`}>
                        {toTitleCase(item)}
                      </span>
                      {!isFound && <span className="text-[9px] uppercase tracking-widest text-rose-500 mt-0.5">Missing</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ACTUAL COLUMN */}
        <div className={`rounded-xl border p-5 ${status === 'fail' ? 'bg-rose-50/30 border-rose-200' :
          status === 'warning' ? 'bg-amber-50/30 border-amber-200' :
            'bg-emerald-50/30 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className={`w-3.5 h-3.5 ${status === 'fail' ? 'text-rose-500' :
              status === 'warning' ? 'text-amber-500' :
                'text-emerald-500'
              }`} />
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${status === 'fail' ? 'text-rose-600' :
              status === 'warning' ? 'text-amber-600' :
                'text-emerald-600'
              }`}>
              Extracted Data (Actual)
            </span>
          </div>

          {actArr.length === 0 ? (
            <span className="text-neutral-400 italic text-sm">No elements found on page.</span>
          ) : (
            <ul className="space-y-3">
              {actArr.map((item, i) => {
                const nItem = normalize(item);
                if (!nItem) return null; // Skip empty scraped bullets

                // Fuzzy match to see if actual scraped item was in the brief
                const isExpected = expNorms.some(e => e.includes(nItem) || nItem.includes(e));

                return (
                  <li key={`act-${i}`} className="flex items-start gap-2.5">
                    {isExpected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <PlusCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className={`text-sm ${isExpected ? "text-neutral-700" : "text-blue-700 font-medium"}`}>
                        {toTitleCase(item)}
                      </span>
                      {!isExpected && (
                        <span className="text-[9px] uppercase tracking-widest text-blue-500/80 mt-0.5">
                          Not in brief (Extra)
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  };

  const isArrayData = Array.isArray(expected) || Array.isArray(actual);

  return (
    <div className="group rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 mb-4 gap-2">
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">{label}</h4>
        </div>
        {message && (
          <span className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full ${status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
            }`}>
            {message}
          </span>
        )}
      </div>

      {isArrayData ? (
        renderArrayComparison()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-neutral-50 border border-neutral-200/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-3.5 h-3.5 text-[#b8924a]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#b8924a] font-bold">Brief Data (Expected)</span>
            </div>
            <div className="text-sm text-neutral-700 font-medium">
              {renderSingleString(expected)}
            </div>
          </div>
          <div className={`rounded-xl border p-5 ${status === 'fail' ? 'bg-rose-50/30 border-rose-200' :
            status === 'warning' ? 'bg-amber-50/30 border-amber-200' :
              'bg-emerald-50/30 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe className={`w-3.5 h-3.5 ${status === 'fail' ? 'text-rose-500' :
                status === 'warning' ? 'text-amber-500' :
                  'text-emerald-500'
                }`} />
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${status === 'fail' ? 'text-rose-600' :
                status === 'warning' ? 'text-amber-600' :
                  'text-emerald-600'
                }`}>
                Extracted Data (Actual)
              </span>
            </div>
            <div className="text-sm text-neutral-700 font-medium">
              {renderSingleString(actual)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonRow;