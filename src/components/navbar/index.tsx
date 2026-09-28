/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import NavbarClient from './_client';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('riwaa_session')?.value;

  if (!token) return { user: null, debugError: "NO_COOKIE_SENT_TO_SERVER" };

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { user: null, debugError: `STRAPI_REJECTED_${res.status}` };
    }

    const data = await res.json();
    return { user: data, debugError: null };
  } catch (error: any) {
    // If the network fails, or DNS fails, this catches it
    return { user: null, debugError: `SERVER_FETCH_FAILED: ${error.message}` };
  }
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