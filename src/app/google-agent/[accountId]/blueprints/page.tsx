// riwaa/src/app/google-agent/[accountId]/blueprints/page.tsx
import { cookies } from 'next/headers';
import { fetchUserBlueprints } from '@/lib/google-ads-agent/strapi';
import BlueprintsListClient from './_client';

export default async function BlueprintsDashboardPage({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;
  const accountId = resolvedParams.accountId;

  const cookieStore = await cookies();
  const token = cookieStore.get('riwaa_session')?.value;

  let blueprints = [];
  if (token) {
    // Pass the active account ID to the fetch helper
    blueprints = await fetchUserBlueprints(accountId);
  }

  return <BlueprintsListClient blueprints={blueprints} accountId={accountId} />;
}