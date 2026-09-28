import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import ReportingEngineClient from './_client';
import { STRAPI_URL } from '@/utils/constants';

export default async function ReportsPage() {
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialReports: any[] = [];

  try {
    // Fetch the latest 15 reports from Strapi, sorted by newest first
    const res = await fetch(`${STRAPI_URL}/api/meta-ads-reports?sort=createdAt:desc&pagination[limit]=100`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });

    const data = await res.json();
    if (data.data) {
      initialReports = data.data;
    }
  } catch (error) {
    console.error('Failed to fetch historical reports:', error);
  }

  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen flex flex-col">
      <Navbar hideLoginButton={true} />

      <ReportingEngineClient initialReports={initialReports} />

      <Footer />
    </div>
  );
}