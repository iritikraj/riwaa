import { notFound } from 'next/navigation';
import { fetchBlueprintById } from '@/lib/google-ads-agent/strapi';
import BlueprintStudioClient from './_client';

export default async function BlueprintStudioPage({
  params,
}: {
  params: Promise<{ accountId: string; blueprintId: string }>;
}) {
  const { accountId, blueprintId } = await params;
  const blueprintRecord = await fetchBlueprintById(blueprintId);

  if (!blueprintRecord) {
    notFound();
  }

  const blueprintData =
    blueprintRecord.attributes?.blueprintData || blueprintRecord.blueprintData;
  const status = blueprintRecord.attributes?.status || blueprintRecord.status || 'draft';

  return (
    <BlueprintStudioClient
      accountId={accountId}
      blueprintId={blueprintId}
      initialBlueprint={blueprintData}
      status={status}
    />
  );
}