import GoogleCampaignSetupClient from "./_client";

export default async function GoogleCampaignSetupPage({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;
  return <GoogleCampaignSetupClient activeAccountId={resolvedParams.accountId} />;
}