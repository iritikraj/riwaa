/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getCreativeAgentById } from '@/lib/creative-agent/strapi';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const documentId = resolvedParams.id;
    
    const data = await getCreativeAgentById(documentId);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}