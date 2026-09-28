/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import CampaignHistoryClient from './_client';
import { headers } from 'next/headers';

export default async function CampaignHistoryPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let initialCampaigns = [];

  try {
    // We pass the incoming headers (like cookies) so the internal API route stays authenticated
    const headersList = await headers();

    const res = await fetch(`${appUrl}/api/meta-agent/audit-logs?limit=100`, {
      headers: headersList,
      cache: 'no-store'
    });

    const data = await res.json();

    if (data.success) {
      initialCampaigns = data.data.filter((log: any) => {
        const attr = log.attributes || log;
        return attr.event_type === 'campaign_setup';
      });
    }
  } catch (error) {
    console.error('Failed to fetch history on server:', error);
  }

  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen">
      <Navbar />

      {/* 3. Pass the pre-fetched, pre-filtered data down as a prop */}
      <CampaignHistoryClient initialCampaigns={initialCampaigns} />

      <Footer />
    </div>
  );
}