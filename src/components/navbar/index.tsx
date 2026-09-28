// riwaa/src/components/navbar/index.tsx
import { cookies } from 'next/headers';
import NavbarClient from './_client';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('riwaa_session')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch server session:', error);
    return null;
  }
}

export default async function Navbar({ hideLoginButton }: { hideLoginButton?: boolean }) {
  const res = await getServerSession();

  let user = null;
  if (res) {
    const { username, email, isAdmin } = res;
    user = { username, email, isAdmin };
  }

  return <NavbarClient initialUser={user} hideLoginButton={hideLoginButton} />;
}