import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import DashboardClient from './_client';
import { headers } from 'next/headers';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.riwaa.com"),
  title: "AI Agents for Real Estate Brokerages in Dubai",
  description:
    "RIWAA's AI agents for real estate brokerages in Dubai build advisor profiles, answer reviews, audit SEO and ship websites from one console. Book a walkthrough.",
};

export default async function MetaAgentPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let initialRecommendations = [];

  try {
    // Pass headers to maintain the secure session in the internal API route
    const headersList = await headers();

    const res = await fetch(`${appUrl}/api/meta-agent/recommendations`, {
      headers: headersList,
      cache: 'no-store' // Always check for fresh AI recommendations on load
    });

    const data = await res.json();
    if (data.success) {
      initialRecommendations = data.data;
    }
  } catch (error) {
    console.error('Failed to fetch recommendations on server:', error);
  }

  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen flex flex-col">
      {/* Server Component Navbar */}
      <Navbar hideLoginButton={true} />

      {/* Interactive Client Dashboard with Pre-fetched Data */}
      <DashboardClient initialRecommendations={initialRecommendations} />

      {/* Footer */}
      <Footer />
    </div>
  );
}