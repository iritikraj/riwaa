import { notFound } from 'next/navigation';
import { getAuditById } from '@/lib/seo-agent/strapi';
import AuditDetailView from './_detail/page';

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  return {
    title: `Audit Report #${id} - Riwaa SEO Agent`,
  };
}

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Fetch the specific record from Strapi securely on the server
  const record = await getAuditById(id);

  if (!record) {
    notFound(); // Triggers Next.js 404 page if ID doesn't exist
  }

  return (
    <div className="min-h-screen px-6 py-16 md:px-12 text-neutral-900 bg-[#FCFBF8] font-jost selection:bg-neutral-200">
      <div className="max-w-4xl mx-auto">
        <AuditDetailView record={record} />
      </div>
    </div>
  );
}