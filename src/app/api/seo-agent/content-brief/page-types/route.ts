import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
    const res = await fetch(`${STRAPI_URL}/api/page-type-rules`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch from Strapi');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Page Types API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch page types' }, { status: 500 });
  }
}