/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import {
  MessageCircleQuestion,
  Target,
  Layers,
  FileText,
  Tags
} from 'lucide-react';

export default function DocumentViewer({ data }: { data: any }) {
  if (!data.architecture) return null;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm font-jost overflow-hidden">

      {/* 1. Header & Overview Section */}
      <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Content Architecture Brief
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight text-balance mb-8">
          <span className="mb-3 inline-flex text-center items-center justify-center px-2 py-1 mr-3 text-xs font-mono font-bold text-indigo-700 bg-indigo-100 rounded-md align-middle shadow-sm">
            H1
          </span>
          {data.h1}
        </h1>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700">Strategic Angle</h4>
          </div>
          <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed text-pretty">
            {data.strategic_summary}
          </p>
        </div>
      </div>

      {/* 2. Architecture Tree */}
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-2 mb-8">
          <Layers className="w-5 h-5 text-slate-700" />
          <h2 className="text-xl font-bold text-slate-900">Document Structure</h2>
        </div>

        <div className="space-y-8">
          {data.architecture.map((h2: any, index: number) => (
            <div key={index} className="relative">

              {/* H2 Node */}
              <div className="bg-white p-6 z-10 relative group hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    <span className="flex items-center justify-center px-2 py-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded">
                      H2
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">
                      {h2.heading}
                    </h2>
                    {h2.intent_direction && (
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {h2.intent_direction}
                      </p>
                    )}
                  </div>
                </div>

                {h2.assigned_entities && h2.assigned_entities.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <Tags className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {h2.assigned_entities.map((entity: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-full">
                        {entity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* H3 Children Tree */}
              {h2.children && h2.children.length > 0 && (
                <div className="relative pl-6 md:pl-10 mt-4 space-y-4 before:content-[''] before:absolute before:left-[1.35rem] md:before:left-[2.35rem] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                  {h2.children.map((h3: any, j: number) => (
                    <div key={j} className="relative flex items-start group">
                      {/* Tree connector line */}
                      <div className="absolute -left-6 md:-left-10 top-6 w-6 md:w-10 h-px bg-slate-200"></div>

                      <div className="px-5 pt-3 pb-5 flex-1 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            <span className="flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded">
                              H3
                            </span>
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-slate-800 mb-1.5">
                              {h3.heading}
                            </h3>
                            {h3.intent_direction && (
                              <p className="text-sm text-slate-500 leading-relaxed mb-3">
                                {h3.intent_direction}
                              </p>
                            )}

                            {h3.assigned_entities && h3.assigned_entities.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {h3.assigned_entities.map((entity: string, i: number) => (
                                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-medium rounded-md">
                                    {entity}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <div className="p-8 md:p-12 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircleQuestion className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Recommended FAQs</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.faqs.map((faq: any, index: number) => (
              <div key={index} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                    Q
                  </span>
                  <h4 className="font-medium text-slate-900 text-sm leading-snug pt-0.5">
                    {faq.question}
                  </h4>
                </div>
                <div className="flex items-start gap-3 pl-9">
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {faq.answer_direction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}