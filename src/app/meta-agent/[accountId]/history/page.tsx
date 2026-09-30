/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/meta-agent/[accountId]/history/page.tsx
import { headers } from 'next/headers';
import CampaignHistoryClient from './_client';

export const dynamic = 'force-dynamic';

export default async function CampaignHistoryPage({ params }: { params: Promise<{ accountId: string }> }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;

  let initialCampaigns = [];

  try {
    const headersList = await headers();

    // IMPORTANT: Appended &accountId= so it strictly fetches logs for the active account
    const res = await fetch(`${appUrl}/api/meta-agent/audit-logs?limit=100&accountId=${activeAccountId}`, {
      headers: headersList,
      cache: 'no-store'
    });

    const data = await res.json();

    if (data.success) {
      initialCampaigns = (data.data || []).filter((log: any) => {
        const attr = log.attributes || log;
        return attr.event_type === 'campaign_setup';
      });
    }
  } catch (error) {
    console.error('Failed to fetch history on server:', error);
  }

  return <CampaignHistoryClient initialCampaigns={initialCampaigns} />;
}