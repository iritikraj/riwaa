/* eslint-disable @typescript-eslint/no-explicit-any */
interface ComparisonRowProps {
  label: string;
  targetVal: any;
  compVal: any;
  targetList?: string[];
  compList?: string[];
}

const ComparisonRow = ({ label, targetVal, compVal, targetList, compList }: ComparisonRowProps) => {
  const hasLists = (targetList && targetList.length > 0) || (compList && compList.length > 0);

  return (
    // UPDATED: Added print:break-inside-auto so massive lists can seamlessly span multiple printed pages
    <div className="py-3 border-b border-neutral-100 last:border-0 break-inside-avoid print:break-inside-auto">

      {/* Main Score Row */}
      {
        !hasLists && (
          <div className="grid grid-cols-3 items-center">
            <div className="text-sm font-medium text-neutral-600">{label}</div>
            <div className="text-sm text-neutral-900 font-jost text-center bg-emerald-50/30 py-1 rounded">{targetVal ?? '-'}</div>
            <div className="text-sm text-neutral-900 font-jost text-center bg-rose-50/30 py-1 rounded ml-4">{compVal ?? '-'}</div>
          </div>
        )
      }

      {/* Expanded URLs Section (Directly Rendered) */}
      {hasLists && (
        <div className="">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-96 overflow-y-auto print:max-h-none print:overflow-visible pr-2"
            style={{ scrollbarWidth: 'thin' }}
          >

            {/* Target Links */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mb-4 bg-emerald-50 py-1.5 px-3 rounded inline-block">
                Target URLs
              </div>
              {targetList && targetList.length > 0 ? (
                <div className="space-y-3">
                  {targetList.map((link: string, idx: number) => (
                    // Added print:break-inside-avoid to individual items so links don't get sliced in half across pages
                    <div key={`target-${idx}`} className="flex items-center p-3 border border-neutral-100 rounded-lg bg-neutral-50/50 print:break-inside-avoid">
                      {/* Added print:whitespace-normal to ensure long URLs wrap instead of truncating on paper */}
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-neutral-800 hover:text-emerald-600 truncate print:whitespace-normal print:break-all w-full transition-colors block">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-neutral-400 italic p-3 border border-dashed border-neutral-200 rounded-lg bg-neutral-50/30">
                  No links found.
                </div>
              )}
            </div>

            {/* Competitor Links */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-rose-700 font-semibold mb-4 bg-rose-50 py-1.5 px-3 rounded inline-block">
                Competitor URLs
              </div>
              {compList && compList.length > 0 ? (
                <div className="space-y-3">
                  {compList.map((link: string, idx: number) => (
                    <div key={`comp-${idx}`} className="flex items-center p-3 border border-neutral-100 rounded-lg bg-neutral-50/50 print:break-inside-avoid">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-neutral-800 hover:text-rose-600 truncate print:whitespace-normal print:break-all w-full transition-colors block">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-neutral-400 italic p-3 border border-dashed border-neutral-200 rounded-lg bg-neutral-50/30">
                  No links found.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonRow;