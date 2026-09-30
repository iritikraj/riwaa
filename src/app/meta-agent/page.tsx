// riwaa/src/app/meta-agent/page.tsx
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function MetaAgentRootRedirect() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let targetUrl = '/dashboard'; // Fallback destination

  try {
    const headersList = await headers();
    const res = await fetch(`${appUrl}/api/meta-agent/accounts`, {
      headers: headersList,
      cache: 'no-store'
    });

    const data = await res.json();

    if (data.success && data.data.length > 0) {
      // Set the target to their first assigned workspace
      targetUrl = `/meta-agent/${data.data[0].id}`;
    } else {
      // Failsafe: Handle users with zero accounts
      targetUrl = '/meta-agent/unauthorized?reason=no_meta_accounts';
    }
  } catch (error) {
    console.error('Failed to fetch accounts for redirect:', error);
  }

  // Execute the redirect OUTSIDE the try/catch block so Next.js doesn't trap it!
  redirect(targetUrl);
}