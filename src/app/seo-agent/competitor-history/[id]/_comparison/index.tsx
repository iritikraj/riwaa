/* eslint-disable @typescript-eslint/no-explicit-any */
const ComparisonRow = ({ label, targetVal, compVal }: { label: string, targetVal: any, compVal: any }) => (
  <div className="grid grid-cols-3 py-3 border-b border-neutral-100 last:border-0 items-center">
    <div className="text-sm font-medium text-neutral-600">{label}</div>
    <div className="text-sm text-neutral-900 font-mono text-center bg-emerald-50/30 py-1 rounded">{targetVal ?? '-'}</div>
    <div className="text-sm text-neutral-900 font-mono text-center bg-rose-50/30 py-1 rounded ml-4">{compVal ?? '-'}</div>
  </div>
);

export default ComparisonRow;