/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { AlertTriangle, Type, Copy, XCircle } from 'lucide-react';

export default function ContentQualityCard({ contentData }: { contentData: any }) {
  const [activeTab, setActiveTab] = useState<'density' | 'grammar' | 'duplicates'>('density');

  const {
    deterministic_keyword_density = [],
    grammar_issues_found = [],
    grammar_total_errors = 0,
    readability_score = 0,
  } = contentData;

  const duplicates = contentData.raw_dom_data?.content_metrics?.internal_duplicates_found || [];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm font-jost">

      {/* HEADER & SCORE */}
      <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-neutral-900 mb-1">Content Integrity</h3>
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-medium">Deterministic NLP Analysis</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-light text-neutral-900">{readability_score}</span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">Readability Score</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-neutral-200 bg-neutral-50">
        <TabButton
          active={activeTab === 'density'}
          onClick={() => setActiveTab('density')}
          label="Keyword Density"
          icon={<Type size={14} />}
          count={deterministic_keyword_density.length}
        />
        <TabButton
          active={activeTab === 'grammar'}
          onClick={() => setActiveTab('grammar')}
          label="Grammar & Syntax"
          icon={<AlertTriangle size={14} />}
          count={grammar_total_errors}
          alert={grammar_total_errors > 5}
        />
        <TabButton
          active={activeTab === 'duplicates'}
          onClick={() => setActiveTab('duplicates')}
          label="Internal Duplicates"
          icon={<Copy size={14} />}
          count={duplicates.length}
          alert={duplicates.length > 0}
        />
      </div>

      {/* CONTENT AREA */}
      <div className="p-0">

        {/* 1. KEYWORD DENSITY VIEW */}
        {activeTab === 'density' && (
          <div className="divide-y divide-neutral-100">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-50/50 text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-500 border-b border-neutral-100">
              <div className="col-span-5">Target Keyword</div>
              <div className="col-span-2 text-center">Count</div>
              <div className="col-span-2 text-center">Density</div>
              <div className="col-span-3 text-right">Status</div>
            </div>
            {deterministic_keyword_density.map((kw: any, idx: number) => (
              <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm hover:bg-neutral-50 transition-colors">
                <div className="col-span-5 font-medium text-neutral-900">{kw.keyword}</div>
                <div className="col-span-2 text-center text-neutral-600">{kw.count}</div>
                <div className="col-span-2 text-center text-neutral-600 font-medium">{kw.density}%</div>
                <div className="col-span-3 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border ${kw.status.includes('Critical') ? 'bg-red-50 text-red-700 border-red-200' :
                      kw.status.includes('Warning') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                    {kw.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. GRAMMAR VIEW */}
        {activeTab === 'grammar' && (
          <div className="divide-y divide-neutral-100">
            {grammar_issues_found.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-medium text-sm">No critical grammar issues detected.</div>
            ) : (
              grammar_issues_found.map((issue: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-2">{issue.message}</h4>
                      <p className="text-xs text-neutral-600 bg-neutral-100 p-3 rounded-lg font-mono leading-relaxed border border-neutral-200">
                        &apos;... {issue.context} ...&apos;
                      </p>
                      {issue.suggestions?.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500">Fix:</span>
                          {issue.suggestions.map((s: string, sIdx: number) => (
                            <span key={sIdx} className="text-xs bg-white text-neutral-800 px-2 py-1 rounded border border-neutral-200 shadow-sm font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. DUPLICATE CONTENT VIEW */}
        {activeTab === 'duplicates' && (
          <div className="divide-y divide-neutral-100">
            {duplicates.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-medium text-sm">No internal duplicate paragraphs found.</div>
            ) : (
              duplicates.map((dup: any, idx: number) => (
                <div key={idx} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2">
                      <AlertTriangle size={12} /> Jaccard Match: {dup.similarity * 100}%
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                    {dup.text}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for the tabs
function TabButton({ active, onClick, label, icon, count, alert }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${active
          ? 'bg-white text-neutral-900 border-b-2 border-neutral-900'
          : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50 border-b-2 border-transparent'
        }`}
    >
      {icon}
      {label}
      <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${alert
          ? 'bg-red-50 text-red-600 border border-red-200'
          : 'bg-neutral-200 text-neutral-600'
        }`}>
        {count}
      </span>
    </button>
  );
}