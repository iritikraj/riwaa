import Link from 'next/link';
import { ArrowLeft, XCircle, Globe, FileText, Search, Hash, ChevronRight } from 'lucide-react';
import { getContentBriefById } from '@/lib/seo-agent/strapi';
import { notFound } from 'next/navigation';
import ContentBriefProgressTracker from '../_progress';
import ExportDocxButton from '../_export-docx';
import JsonCodeBlock from '../_json-block';
import DocumentViewer from '../_document-viewer';
import PrintButton from '../_print';

export const metadata = {
  title: 'Content Strategy Brief - Riwaa SEO Agent',
};

export default async function ContentBriefReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = await getContentBriefById(id);

  if (!brief) {
    notFound();
  }

  const isFailed = brief.audit_status === 'failed';
  const isCompleted = brief.audit_status === 'completed';
  const data = brief.generated_data || {};

  const reportDate = brief.createdAt
    ? new Date(brief.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
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
            <img src="/solvetude-logo.png" style={{ width: 180, height: 40 }} alt="Solvetude" className="mx-auto object-contain opacity-80" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="flex items-center justify-center gap-4 mb-4 text-3xl font-light tracking-tight text-neutral-900">
              <FileText className="w-8 h-8 text-blue-600" />
              Content Strategy Brief
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-500">
              <span>{reportDate}</span>
            </div>
            <div className="flex items-center gap-2 mt-8 text-blue-800 font-medium text-lg">
              <Search className="w-5 h-5 shrink-0" /> Target Topic: {brief.topic}
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="mb-10 border-b border-neutral-200 print:border-none pb-6 print:pb-0">
          <Link href="/seo-agent/content-brief" className="print:hidden inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors mb-8 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="print:hidden text-3xl font-light text-neutral-900 flex items-center gap-4 tracking-tight mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                Content Strategy Brief
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium text-neutral-600">
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 max-w-md truncate">
                  <Search className="w-4 h-4 shrink-0" />
                  <span className="truncate">{brief.topic}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center print:justify-center print:mb-10 gap-3">
              {!isFailed && isCompleted && (
                <>
                  <PrintButton title={`Content Brief - ${brief.topic}`} />
                  <ExportDocxButton data={data} topic={brief.topic} />
                </>
              )}
            </div>
          </div>
        </header>

        {(!isFailed && !isCompleted) ? (
          <ContentBriefProgressTracker documentId={id} />
        ) : isFailed ? (
          <div className="py-20 text-center border-2 border-dashed border-rose-200 rounded-3xl bg-rose-50/50 print:hidden">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-rose-900 mb-2">Generation Failed</h3>
            <p className="text-rose-600/80 text-sm">An error occurred while the AI was analyzing competitors and generating the brief.</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* SEO Meta Data Card */}
            <div className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm break-inside-avoid">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
                <Globe className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  SEO Meta Data
                </h4>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Recommended URL Slug</span>
                  <code className="text-sm bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200 text-blue-700 font-medium">
                    {data.url_slug || 'Pending generation...'}
                  </code>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Meta Title</span>
                  <p className="text-[15px] text-neutral-800 leading-relaxed font-medium">
                    {data.meta_title || 'Pending generation...'}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Meta Description</span>
                  <p className="text-[14px] text-neutral-600 leading-relaxed">
                    {data.meta_description || 'Pending generation...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Brief Document */}
            <div className="break-inside-avoid">
              <div className="flex items-center gap-3 pb-4 mb-2">
                <Hash className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-semibold uppercase tracking-widest text-neutral-900">
                  Content Architecture
                </h4>
              </div>
              
              <DocumentViewer data={data} />
            </div>

            {/* Developer Raw JSON Toggle */}
            <details className="group print:hidden">
              <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors mb-4 list-none flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-neutral-200 flex items-center justify-center text-neutral-600 group-open:rotate-90 transition-transform">
                  <ChevronRight className="w-3 h-3" />
                </span>
                View Raw JSON Data
              </summary>
              <div className="pl-6">
                <JsonCodeBlock data={data} />
              </div>
            </details>

          </div>
        )}
      </div>
    </div>
  );
}