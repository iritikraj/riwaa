/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function JsonCodeBlock({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON', err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="cursor-pointer absolute top-3 right-3 p-2 bg-white/80 hover:bg-white border border-neutral-200 rounded-md shadow-sm text-neutral-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy JSON"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      </button>
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 overflow-auto max-h-[600px]">
        <pre className="text-xs text-neutral-600 font-mono whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}