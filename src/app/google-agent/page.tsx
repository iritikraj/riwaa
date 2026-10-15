import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchActiveGoogleAccounts } from '@/lib/google-ads-agent/strapi';

export const dynamic = 'force-dynamic';

export default async function GoogleAgentRootRedirect() {
  let targetUrl = '/google-agent/unauthorized?reason=no_google_accounts';

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('riwaa_session')?.value;

    if (!token) {
      redirect('/login');
    }

    // Call Strapi directly to avoid internal fetch loop errors
    const accounts = await fetchActiveGoogleAccounts();

    if (accounts && accounts.length > 0) {
      const firstAccount = accounts[0];

      // Safely handle both Strapi v4 (attributes) and Strapi v5 (flattened)
      const customerId = firstAccount.attributes?.customerId || firstAccount.customerId;

      if (customerId) {
        targetUrl = `/google-agent/${customerId}/setup`;
      }
    }
  } catch (error) {
    console.error('Failed to fetch Google accounts from Strapi:', error);
  }

  // Execute the redirect OUTSIDE the try/catch block
  redirect(targetUrl);
}