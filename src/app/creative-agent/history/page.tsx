/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAllCreativeAgents } from '@/lib/creative-agent/strapi';
import Image from 'next/image';

export default async function CreativeAgentHistory() {
  const creatives = await getAllCreativeAgents();
  const STRAPI_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : 'https://riwaa.solvetude.com';

  return (
    <div className="min-h-screen bg-[#fcfcfb] font-jost text-neutral-900 selection:bg-[#b8924a]/20">
      {/* Top Navigation */}
      <nav className="w-full bg-[#fcfcfb] border-b border-neutral-200 md:border-neutral-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#14181F]/10 bg-white">
              <Image
                src="/riwa-logo-transparent.png"
                alt="RIWAA"
                width={30}
                height={30}
              />
            </div>

            <div className="leading-none hidden md:block">
              <p className="text-[15px] font-medium tracking-[0.22em] text-[#14181F]">
                RIWAA
              </p>
              <p className="mt-1 font-jost text-[9px] uppercase tracking-[0.22em] text-[#565C6B]">
                powered by
              </p>
            </div>

            <div className="mx-2 h-8 w-px bg-[#14181F]/15 hidden md:block" />

            <Image
              src="/solvetude-logo.png"
              alt="Solvetude"
              width={100}
              height={30}
              className="object-contain hidden md:block"
            />
          </Link>
        </div>
        <div className='hidden md:block mr-28'>
          <h1 className="text-sm font-bold tracking-widest uppercase">Creative Archive</h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Your generated campaigns</p>
        </div>
        <Link
          href="/creative-agent"
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
        >
          <Sparkles size={14} className="text-[#b8924a]" /> New Creative
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creatives.map((item: any) => {
            // Find the image to display (Prefer the first finalized variation, fallback to raw background)
            const displayImage = item.generated_creatives?.variations?.[0]
              ? `${STRAPI_BASE}${item.generated_creatives.variations[0]}`
              : item.background_images?.[0]?.url
                ? `${STRAPI_BASE}${item.background_images[0].url}`
                : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80";

            return (
              <Link
                key={item.id}
                href={`/creative-agent/history/${item.slug}`}
                className="group flex flex-col bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-[#b8924a]/30 transition-all duration-300"
              >
                {/* Image Thumbnail */}
                <div className="aspect-square w-full bg-neutral-100 relative overflow-hidden">
                  <img
                    src={displayImage}
                    alt={item.brand_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-1.5">
                      {item.report_status === 'draft' ? (
                        <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Completed</>
                      ) : (
                        <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Processing</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#b8924a] mb-1.5 block">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg font-medium text-neutral-900 line-clamp-1">{item.brand_name}</h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest font-medium">View Details</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}