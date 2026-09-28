/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') || '50';

    // Fetch directly from Strapi sorted by newest
    const res = await fetch(`${STRAPI_URL}/api/meta-audit-logs?sort=createdAt:desc&pagination[limit]=${limit}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });

    const json = await res.json();
    return NextResponse.json({ success: true, data: json.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}