import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, TextQuote, Tag } from 'lucide-react';
import { getCreativeAgentBySlug } from '@/lib/creative-agent/strapi';

export default async function CreativeDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const agent = await getCreativeAgentBySlug(resolvedParams.id);

  if (!agent) notFound();

  const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

  // Resolve image URLs
  const finalImage = agent.generated_creatives?.feed_square
    ? `${STRAPI_BASE}${agent.generated_creatives.feed_square}`
    : null;

  const rawBg = agent.background_image?.url
    ? `${STRAPI_BASE}${agent.background_image.url}`
    : null;

  return (
    <div className="min-h-screen bg-[#fcfcfb] font-jost text-neutral-900 selection:bg-[#b8924a]/20 pb-20">

      {/* Header */}
      <nav className="w-full bg-white border-b border-neutral-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/creative-agent/history" className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase">{agent.brand_name}</h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{agent.category.replace('_', ' ')} Campaign</p>
          </div>
        </div>
        {finalImage && (
          <a
            href={finalImage}
            download={`${agent.slug}-ad.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#b8924a] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#a17e3f] transition-colors flex items-center gap-2 shadow-lg shadow-[#b8924a]/20"
          >
            <Download size={14} /> Download Asset
          </a>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT: The Final Creative Asset */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="w-full bg-white rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-neutral-100">
            {finalImage ? (
              <img src={finalImage} alt="Final Creative" className="w-full rounded-2xl aspect-square object-contain bg-neutral-50" />
            ) : (
              <div className="w-full aspect-square rounded-2xl bg-neutral-50 border border-neutral-200 border-dashed flex items-center justify-center text-neutral-400">
                <span className="text-xs uppercase tracking-widest font-semibold">Still Processing...</span>
              </div>
            )}
          </div>

          {/* Status Indicator */}
          <div className="bg-white border border-neutral-100 rounded-xl p-4 flex items-center justify-between text-xs font-semibold uppercase tracking-widest shadow-sm">
            <span className="text-neutral-500">Render Status</span>
            <span className={agent.report_status === 'draft' ? "text-green-500" : "text-amber-500 animate-pulse"}>
              {agent.report_status}
            </span>
          </div>
        </div>

        {/* RIGHT: Campaign Details & AI Copy */}
        <div className="lg:col-span-6 space-y-8">

          {/* AI Copy Block */}
          {agent.ai_copy && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#b8924a] flex items-center gap-2 mb-6">
                <TextQuote size={14} /> AI Art Director Output
              </h3>

              <div className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">Generated Headline</span>
                  <p className="text-2xl font-light text-neutral-900 leading-tight">&apos;{agent.ai_copy.headline}&apos;</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">Call to Action (CTA)</span>
                  <span className="inline-block px-3 py-1 bg-neutral-100 rounded-md text-xs font-bold text-neutral-900 uppercase tracking-wide">
                    {agent.ai_copy.cta}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(agent.campaign_data || {}).map(([key, value]) => (
              <div key={key} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 block">
                  {key.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-neutral-900">{String(value)}</span>
              </div>
            ))}
          </div>

          {/* USPs Used */}
          {agent.usps && agent.usps.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2 mb-4">
                <Tag size={12} className="text-[#b8924a]" /> Brief USPs
              </h3>
              <div className="flex flex-wrap gap-2">
                {agent.usps.map((usp: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-lg text-xs">
                    {usp}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}