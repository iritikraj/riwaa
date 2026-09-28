// riwaa/src/app/api/meta-agent/recommendations/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getPendingRecommendations } from '@/lib/meta-agent/strapi';

export async function GET() {
  try {
    const data = await getPendingRecommendations();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}