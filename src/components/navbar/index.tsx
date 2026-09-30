/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import NavbarClient from './_client';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

async function getServerSession() {
  const cookieStore = await cookies();

  // 1. Fetch ALL cookies with this name instead of just the first one
  const tokens = cookieStore.getAll('riwaa_session');

  if (!tokens || tokens.length === 0) {
    return { user: null, debugError: "NO_COOKIE_SENT_TO_SERVER" };
  }

  let lastStatus = null;

  // 2. Loop through every token the browser sent until Strapi accepts one
  for (const tokenObj of tokens) {
    const cleanToken = decodeURIComponent(tokenObj.value).replace(/^"|"$/g, '');

    try {
      const res = await fetch(`${STRAPI_URL}/api/users/me?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${cleanToken}` },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        // We found the fresh token!
        return { user: data, debugError: null };
      }
      lastStatus = res.status;
    } catch (error: any) {
      return { user: null, debugError: `SERVER_FETCH_FAILED: ${error.message}` };
    }
  }

  // 3. Updated debug banner to show exactly how many tokens it tested
  return { user: null, debugError: `STRAPI_REJECTED_${lastStatus}_(Tried ${tokens.length} tokens)` };
}

export default async function Navbar({ hideLoginButton }: { hideLoginButton?: boolean }) {
  const { user, debugError } = await getServerSession();

  let safeUser = null;
  if (user) {
    const { username, email, isAdmin } = user;
    safeUser = { username, email, isAdmin };
  }

  return <NavbarClient initialUser={safeUser} hideLoginButton={hideLoginButton} debugError={debugError} />;
}