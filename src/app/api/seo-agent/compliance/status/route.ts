import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/compliance-audits/${id}?fields[0]=audit_status`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch status');

    const data = await res.json();
    // Accommodate both Strapi v4 and v5 response structures
    const status = data.data?.attributes?.audit_status || data.data?.audit_status || 'processing';

    return NextResponse.json({ status });
  } catch (error) {
    return NextResponse.json({ status: 'processing' }); // Fallback to keep polling if network blips
  }
}