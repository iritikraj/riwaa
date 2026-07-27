import Link from 'next/link';
import { ArrowLeft, XCircle, Globe, Code2, Download, ExternalLink, LayoutTemplate, MinusCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
import { getComplianceAuditById } from '@/lib/seo-agent/strapi';
import { notFound } from 'next/navigation';
import ComparisonRow, { StatusIcon, toTitleCase } from '../_comparison';
import PrintButton from '../_print';

export const metadata = {
  title: 'Compliance Audit Report - Riwaa SEO Agent',
};

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : `${process.env.NEXT_PUBLIC_APP_URL}`;

export default async function ComplianceReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getComplianceAuditById(id);

  if (!audit) {
    notFound();
  }

  const isProcessing = audit.audit_status === 'processing';
  const isFailed = audit.audit_status === 'failed';
  const score = audit.overall_score;
  const results = audit.report_data?.comparison_results || {};

  const fileUrl = audit.brief_file?.url || audit.brief_file?.data?.attributes?.url;
  const fileName = audit.brief_file?.name || audit.brief_file?.data?.attributes?.name || 'Content_Brief.docx';

  // Extract raw FAQ lists for deep diff analysis
  const expectedFaqs: string[] =
    results.faq_schema?.expected_questions ||
    audit.report_data?.raw_expected?.faqs ||
    [];

  const actualFaqs: string[] =
    results.faq_schema?.actual_questions ||
    audit.report_data?.raw_actual?.faq_schema?.extracted_questions ||
    [];

  const normalize = (q: string) => {
    return q
      .replace(/^(h\d:?\s*)?/i, '')     // 1. Strips stray "H4:" or "H3:" if Gemini left them in
      .replace(/^\d+[\.\-\)]\s*/, '')   // 2. Strips leading numbers like "1. ", "2)", "3-"
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '');      // 3. Strips all punctuation and spaces for a bulletproof match
  };

  const actualSet = new Set(actualFaqs.map(normalize));
  const expectedSet = new Set(expectedFaqs.map(normalize));

  const missingFaqs = expectedFaqs.filter((q) => !actualSet.has(normalize(q)));
  const additionalFaqs = actualFaqs.filter((q) => !expectedSet.has(normalize(q)));
  const matchedFaqs = expectedFaqs.filter((q) => actualSet.has(normalize(q)));

  const reportDate = audit.createdAt
    ? new Date(audit.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
    : 'Date not available';

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-neutral-900 font-jost p-6 md:p-12 selection:bg-neutral-200">

      {/* 🚨 PRINT STYLES */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            nav, header a, button, .print\\:hidden {
              display: none !important;
            }
            body {
              background: white !important;
            }
            * {
              box-shadow: none !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .min-h-screen {
              min-height: auto !important;
            }
            @page {
              size: A4;
              margin: 12mm;
            }
          }
        `
      }} />

      <div className="max-w-6xl mx-auto">

        {/* 🚨 PRINT-ONLY HEADER (Hidden on screen) */}
        <div className="hidden print:flex justify-center flex-col pb-12">
          <div className="text-center pb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-2xl font-medium tracking-widest uppercase text-neutral-900">Riwaa</h2>
            </div>
            <span className="block text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-medium mb-3">by</span>
            {/* Make sure the path to your logo is correct */}
            <img src="/solvetude-logo.png" style={{ width: 180, height: 40 }} alt="Solvetude" className="mx-auto object-contain opacity-80" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="flex items-center justify-center gap-4 mb-4 text-3xl font-light tracking-tight text-neutral-900">
              <LayoutTemplate className="w-8 h-8 text-[#b8924a]" />
              Content Compliance Audit
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-500">
              <span>{reportDate}</span>
            </div>
            <a href={audit.target_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-600 transition-colors flex-wrap mt-12">
              <Globe className="w-4 h-4 shrink-0" /> Target URL -
              <span className="truncate">{audit.target_url}</span>
            </a>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 border-b border-neutral-200 print:border-none pb-6 print:pb-0">
          <Link href="/seo-agent/compliance-history" className="print:hidden inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Archives
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="print:hidden text-3xl font-light text-neutral-900 flex items-center gap-4 tracking-tight mb-4">
                <LayoutTemplate className="w-8 h-8 text-[#b8924a]" />
                Compliance Report
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium text-neutral-600">
                <a href={audit.target_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-600 transition-colors truncate max-w-md">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{audit.target_url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-50 print:hidden" />
                </a>
                <span className="hidden sm:inline text-neutral-300 print:hidden">|</span>
                {fileUrl && (
                  <a href={`${BASE_URL}${fileUrl}`} target="_blank" rel="noopener noreferrer" className="print:hidden flex items-center gap-2 hover:text-[#b8924a] transition-colors truncate">
                    <Download className="w-4 h-4 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center print:justify-center print:mb-10 gap-4">
              {!isProcessing && !isFailed && (
                <PrintButton title={audit.target_url} />
              )}

              {/* Score Badge */}
              {!isProcessing && !isFailed && score !== undefined && (
                <div className={`px-6 py-4 rounded-2xl border flex flex-col items-center justify-center min-w-35 shadow-sm ${score >= 80 ? 'bg-emerald-50 border-emerald-100' : score >= 50 ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
                  <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                    Overall Match
                  </span>
                  <span className={`text-4xl font-light tracking-tighter ${score >= 80 ? 'text-emerald-700' : score >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {score}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {isProcessing ? (
          <div className="py-20 text-center border-2 border-dashed border-neutral-200 rounded-3xl bg-white/50 print:hidden">
            <LayoutTemplate className="w-12 h-12 text-neutral-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Audit in Progress</h3>
            <p className="text-neutral-500 text-sm">The AI worker is currently analyzing the document and scraping the live page. Please refresh in a few moments.</p>
          </div>
        ) : isFailed ? (
          <div className="py-20 text-center border-2 border-dashed border-rose-200 rounded-3xl bg-rose-50/50 print:hidden">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-rose-900 mb-2">Audit Failed</h3>
            <p className="text-rose-600/80 text-sm">An error occurred during the extraction or comparison process. Please try running the audit again.</p>
          </div>
        ) : (
          <div className="space-y-6">

            {results.meta_title && (
              <ComparisonRow
                label="Meta Title"
                expected={results.meta_title.expected}
                actual={results.meta_title.actual}
                status={results.meta_title.status}
                message={results.meta_title.message}
              />
            )}

            {results.meta_description && (
              <ComparisonRow
                label="Meta Description"
                expected={results.meta_description.expected}
                actual={results.meta_description.actual}
                status={results.meta_description.status}
                message={results.meta_description.message}
              />
            )}

            {results.h1 && (
              <ComparisonRow
                label="H1 Tag"
                expected={results.h1.expected}
                actual={results.h1.actual}
                status={results.h1.status}
                message={results.h1.message}
              />
            )}

            {results.h2s && (
              <ComparisonRow
                label="H2 Tags"
                expected={results.h2s.expected}
                actual={results.h2s.actual}
                status={results.h2s.status}
                message={results.h2s.missing?.length > 0 ? `Missing ${results.h2s.missing.length} expected tag(s)` : ''}
              />
            )}

            {results.h3s && (
              <ComparisonRow
                label="H3 Tags"
                expected={results.h3s.expected}
                actual={results.h3s.actual}
                status={results.h3s.status}
                message={results.h3s.missing?.length > 0 ? `Missing ${results.h3s.missing.length} expected tag(s)` : ''}
              />
            )}

            {results.required_schemas && (
              <ComparisonRow
                label={`Required Schemas (${audit.report_data?.page_type || 'Selected Page Type'})`}
                expected={results.required_schemas.expected}
                actual={results.required_schemas.actual}
                status={results.required_schemas.status}
                message={results.required_schemas.missing?.length > 0 ? `Missing ${results.required_schemas.missing.length} expected schema(s)` : ''}
              />
            )}

            {/* Enhanced FAQ Schema Card */}
            {results.faq_schema && (
              <div className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={missingFaqs.length > 0 ? 'fail' : results.faq_schema.status} />
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                      FAQ Schema (JSON-LD)
                    </h4>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full ${missingFaqs.length === 0 && results.faq_schema.status === 'pass'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-700'
                    }`}>
                    {missingFaqs.length > 0
                      ? `${missingFaqs.length} Missing Question(s)`
                      : results.faq_schema.message}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${missingFaqs.length === 0 ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}>
                    <Code2 className={`w-6 h-6 ${missingFaqs.length === 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`} />
                  </div>

                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-neutral-600">
                      The brief requested <strong>{expectedFaqs.length}</strong> FAQs.
                      {results.faq_schema.found_on_page ? ` Found ${actualFaqs.length} question(s) in live schema (${matchedFaqs.length} matched).` : ' No valid FAQPage schema markup was found in the live DOM.'}
                    </p>

                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${results.faq_schema.found_on_page ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                      {results.faq_schema.found_on_page ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="text-sm font-medium text-emerald-900">
                            Valid FAQPage Schema detected
                            {missingFaqs.length > 0 && ", but it is missing requested questions."}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span className="text-sm font-medium text-rose-900">
                            Missing FAQPage Schema
                          </span>
                        </>
                      )}
                    </div>

                    {/* Missing Questions */}
                    {missingFaqs.length > 0 && (
                      <div className="bg-rose-50/80 border border-rose-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MinusCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span className="text-[11px] text-rose-800 uppercase tracking-wider font-bold">
                            Missing Questions from Schema ({missingFaqs.length}):
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-rose-900 font-medium">
                          {missingFaqs.map((q, idx) => (
                            <li key={idx}>{toTitleCase(q)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional / Unrequested Questions */}
                    {additionalFaqs.length > 0 && (
                      <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PlusCircle className="w-4 h-4 text-amber-700 shrink-0" />
                          <span className="text-[11px] text-amber-800 uppercase tracking-wider font-bold">
                            Additional Questions in Schema ({additionalFaqs.length}):
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-amber-900 font-medium">
                          {additionalFaqs.map((q, idx) => (
                            <li key={idx}>{toTitleCase(q)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Matched Questions */}
                    {matchedFaqs.length > 0 && (
                      <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-bold">
                            Matched Questions ({matchedFaqs.length}/{expectedFaqs.length}):
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700 font-medium">
                          {matchedFaqs.map((q, idx) => (
                            <li key={idx}>{toTitleCase(q)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}