// riwaa/src/app/api/auth/login/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { withLogger } from '@/utils/logs/withLogger';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

export const POST = withLogger('/api/auth/login', async (req: NextRequest, routeLogger) => {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      routeLogger.warn({ event: 'login_missing_credentials' }, 'Missing credentials in login request');
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    routeLogger.info({ event: 'login_attempt', identifier }, 'Attempting to authenticate with Strapi');

    // 1. Authenticate with Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      routeLogger.warn({ event: 'login_failed_invalid_credentials', identifier }, 'Strapi rejected credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const safeUser = {
      username: data.user.username,
      email: data.user.email,
    };

    routeLogger.info({ event: 'login_success', identifier }, 'User successfully authenticated');

    const res = NextResponse.json({ success: true, user: safeUser });

    // 3. Set the HTTP-Only Session Cookie
    res.cookies.set({
      name: 'riwaa_session',
      value: data.jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // Automatic logout after two hours
    });

    return res;
  } catch (error: any) {
    routeLogger.error({ err: error, event: 'login_error' }, 'Login process failed with an internal error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});