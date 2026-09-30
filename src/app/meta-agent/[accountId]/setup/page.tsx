// riwaa/src/app/meta-agent/[accountId]/setup/page.tsx
import CampaignSetupClientPage from './_client';

export default async function CampaignSetupPage({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;

  // Navbar, Footer, and max-w containers are now handled by the layout.tsx wrapper!
  return <CampaignSetupClientPage activeAccountId={activeAccountId} />;
}