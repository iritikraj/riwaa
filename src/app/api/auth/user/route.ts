/* eslint-disable @typescript-eslint/no-explicit-any */
// riwaa/src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

export const GET = withLogger('/api/auth/user', async (req: NextRequest, routeLogger) => {
  const token = req.cookies.get('riwaa_session')?.value;

  if (!token) {
    routeLogger.info({ event: 'user_fetch_no_token' }, 'No session token found in cookies');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Session invalid or expired');

    const user = await response.json();

    routeLogger.info({ event: 'user_fetch_success', username: user.username }, 'Successfully validated session and fetched user');
    return NextResponse.json({ user });
  } catch (error: any) {
    // If token is expired/invalid, we should probably delete the cookie here too
    routeLogger.warn({ err: error, event: 'user_fetch_invalid' }, 'Failed to fetch user, invalidating session cookie');

    const res = NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    res.cookies.delete('riwaa_session');
    return res;
  }
});