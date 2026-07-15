// src/app/seo-agent/audit/history/[id]/page.tsx
import { notFound } from 'next/navigation';
import AuditDetailView from './_detail/page';
import { getAuditById } from '@/lib/seo-agent/strapi';

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
    <div className="min-h-screen px-8 py-16 text-slate-100 bg-slate-950 font-jost">
      <div className="max-w-5xl mx-auto">
        <AuditDetailView record={record} />
      </div>
    </div>
  );
}