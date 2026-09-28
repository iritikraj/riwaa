/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import ReportingEngineClient from './_client';

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_STRAPI_URL : 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function getHistoricalReports(): Promise<any[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/meta-ads-reports?sort=createdAt:desc&pagination[limit]=100`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Strapi error fetching reports:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch historical reports:', error);
    return [];
  }
}

export default async function ReportsPage() {
  const initialReports = await getHistoricalReports();
  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen flex flex-col">
      <Navbar hideLoginButton={true} />

      <ReportingEngineClient initialReports={initialReports} />

      <Footer />
    </div>
  );
}