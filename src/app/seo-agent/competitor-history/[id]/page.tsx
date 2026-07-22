import { notFound } from 'next/navigation';
import { getCompetitorAuditById } from '@/lib/seo-agent/strapi';
import CompetitorDetailView from './_detail';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Competitor Analysis #${id} - Riwaa SEO Agent`,
  };
}

export default async function CompetitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch the record securely on the server
  const record = await getCompetitorAuditById(id);

  if (!record) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-16 md:px-12 text-neutral-900 font-jost bg-[#FCFBF8] print:bg-white selection:bg-neutral-200">
      <div className="max-w-5xl mx-auto">
        <CompetitorDetailView record={record} />
      </div>
    </div>
  );
}