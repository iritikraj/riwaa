import Navbar from '@/components/navbar';
import { Footer } from '@/app/(home)/_footer';
import AuditLogClient from './_client';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let initialLogs = [];

  try {
    // Pass headers to maintain the secure session in the internal API route
    const headersList = await headers();

    const res = await fetch(`${appUrl}/api/meta-agent/audit-logs?limit=100`, {
      headers: headersList,
      cache: 'no-store' // Always fetch the freshest logs on load
    });

    const data = await res.json();
    if (data.success) {
      initialLogs = data.data;
    }
  } catch (error) {
    console.error('Failed to fetch audit logs on server:', error);
  }

  return (
    <div className="bg-[#FCFBF8] font-jost min-h-screen flex flex-col">
      {/* Server Component Navbar */}
      <Navbar hideLoginButton={true} />

      {/* Interactive Client UI */}
      <AuditLogClient initialLogs={initialLogs} />

      {/* Footer */}
      <Footer />
    </div>
  );
}