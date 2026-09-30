/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/meta-agent/[accountId]/reports/page.tsx
import { headers } from 'next/headers';
import ReportingEngineClient from './_client';

export const dynamic = 'force-dynamic';

export default async function ReportsPage({ params }: { params: Promise<{ accountId: string }> }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;

  let initialReports = [];
  let activeAccountName = 'Select Account';

  try {
    const headersList = await headers();

    // 1. Fetch account name for the UI
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

    // 2. Fetch historical reports directly from Strapi STRICTLY for this account
    const STRAPI_URL = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_STRAPI_URL : 'http://localhost:1338';
    const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

    const reportsRes = await fetch(`${STRAPI_URL}/api/meta-ads-reports?filters[meta_account][documentId][$eq]=${activeAccountId}&sort=createdAt:desc&pagination[limit]=100`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    });
    const reportsData = await reportsRes.json();
    if (reportsData.data) initialReports = reportsData.data;

  } catch (error) {
    console.error('Failed to fetch reports:', error);
  }

  // Navbar, Footer, and containers are handled by layout.tsx!
  return (
    <ReportingEngineClient
      initialReports={initialReports}
      activeAccountId={activeAccountId}
      activeAccountName={activeAccountName}
    />
  );
}