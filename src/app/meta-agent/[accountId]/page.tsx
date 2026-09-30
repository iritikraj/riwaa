/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/meta-agent/[accountId]/page.tsx
import { headers } from 'next/headers';
import DashboardRecommendationsClient from './_client';

export default async function MetaApprovalDashboard({ params }: { params: Promise<{ accountId: string }> }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;

  let initialRecommendations = [];
  let activeAccountName = 'Select Account';

  try {
    const headersList = await headers();

    // 1. Fetch accounts to extract the specific name for the UI
    const accRes = await fetch(`${appUrl}/api/meta-agent/accounts`, {
      headers: headersList,
      cache: 'no-store'
    });
    const accData = await accRes.json();

    if (accData.success) {
      const activeAccount = accData.data.find((a: any) => a.id === activeAccountId);
      if (activeAccount) {
        activeAccountName = activeAccount.name;
      }
    }

    // 2. Fetch the recommendations specifically for this account
    const recRes = await fetch(`${appUrl}/api/meta-agent/recommendations?accountId=${activeAccountId}`, {
      headers: headersList,
      cache: 'no-store'
    });
    const recData = await recRes.json();
    if (recData.success) initialRecommendations = recData.data;

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }

  return (
    <DashboardRecommendationsClient
      initialRecommendations={initialRecommendations}
      activeAccountId={activeAccountId}
      activeAccountName={activeAccountName}
    />
  );
}