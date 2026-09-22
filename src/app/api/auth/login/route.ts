/* eslint-disable @typescript-eslint/no-explicit-any */
import { STRAPI_URL } from '@/utils/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // 1. Authenticate with Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const safeUser = {
      username: data.user.username,
      email: data.user.email,
    };

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
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}