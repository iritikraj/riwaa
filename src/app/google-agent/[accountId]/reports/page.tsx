/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import { fetchActiveGoogleAccounts } from '@/lib/google-ads-agent/strapi';
import { fetchComprehensiveReportData, generateAIOverview } from '@/lib/google-ads-agent/analytics';
import ReportsClient from './_client';

export default async function GoogleReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const accountId = resolvedParams.accountId;
  const range = resolvedSearchParams.range || '30d';

  const cookieStore = await cookies();
  const token = cookieStore.get('riwaa_session')?.value;

  let reportData = null;
  let aiBrief = null;

  if (token) {
    const accounts = await fetchActiveGoogleAccounts();
    const activeAccount = accounts.find((acc: any) => {
      const id = acc.attributes?.customerId || acc.customerId;
      return id === accountId;
    });

    const refreshToken = activeAccount?.attributes?.refreshToken || activeAccount?.refreshToken;
    const loginCustomerId = activeAccount?.attributes?.loginCustomerId || activeAccount?.loginCustomerId;

    if (refreshToken) {
      reportData = await fetchComprehensiveReportData(accountId, refreshToken, loginCustomerId, range);
      if (reportData && parseFloat(reportData.summary.cost) > 0) {
        aiBrief = await generateAIOverview(reportData);
      }
    }
  }

  // Fallback defaults if account has 0 data or hasn't started serving
  const initialData = reportData || {
    summary: { cost: '0.00', clicks: '0', cpc: '0.00', impressions: '0', conversions: '0' },
    chartData: [],
    campaigns: [],
    devices: {
      raw: {
        MOBILE: { cost: 0, clicks: 0, impressions: 0 },
        DESKTOP: { cost: 0, clicks: 0, impressions: 0 },
        TABLET: { cost: 0, clicks: 0, impressions: 0 },
        CONNECTED_TV: { cost: 0, clicks: 0, impressions: 0 },
      },
      totals: { cost: '0.00', clicks: 0, impressions: 0 },
    },
    searchTerms: [],
  };

  return (
    <ReportsClient
      reportData={initialData}
      aiBrief={aiBrief}
      accountId={accountId}
      initialRange={range}
    />
  );
}