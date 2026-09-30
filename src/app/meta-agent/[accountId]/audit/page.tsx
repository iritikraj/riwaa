// riwaa/src/app/meta-agent/[accountId]/audit/page.tsx
import { headers } from 'next/headers';
import AuditLogClient from './_client';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage({ params }: { params: Promise<{ accountId: string }> }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resolvedParams = await params;
  const activeAccountId = resolvedParams.accountId;
  let initialLogs = [];

  try {
    const headersList = await headers();

    // IMPORTANT: Appended &accountId= to strictly fetch logs isolated to this specific client
    const res = await fetch(`${appUrl}/api/meta-agent/audit-logs?limit=100&accountId=${activeAccountId}`, {
      headers: headersList,
      cache: 'no-store'
    });

    const data = await res.json();
    if (data.success) {
      initialLogs = data.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch audit logs on server:', error);
  }

  // Navbar, Footer, and layout wrappers are injected automatically by the parent [accountId]/layout.tsx
  return <AuditLogClient initialLogs={initialLogs} />;
}