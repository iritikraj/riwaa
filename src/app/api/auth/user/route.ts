import { NextRequest, NextResponse } from 'next/server';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('riwaa_session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Session invalid');

    const user = await response.json();
    return NextResponse.json({ user });
  } catch (error) {
    // If token is expired/invalid, we should probably delete the cookie here too
    console.error('Failed to fetch user:', error);
    const res = NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    res.cookies.delete('riwaa_session');
    return res;
  }
}