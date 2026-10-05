// riwaa/src/app/meta-agent/[accountId]/competitor-benchmarking/page.tsx
import AdLibraryClient from './_client';
import { fetchMetaAccountFromStrapi } from '@/lib/meta-agent/strapi';

export const dynamic = 'force-dynamic';

export default async function AdLibraryPage({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;
  let activeAccountName = 'Client Account';

  try {
    const account = await fetchMetaAccountFromStrapi(activeAccountId);
    if (account && account.name) {
      activeAccountName = account.name;
    }
  } catch (error) {
    console.error('Failed to fetch account for Ad Library:', error);
  }

  return (
    <AdLibraryClient
      activeAccountId={activeAccountId}
      activeAccountName={activeAccountName}
    />
  );
}