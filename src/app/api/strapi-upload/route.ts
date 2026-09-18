/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const incomingForm = await req.formData();

    // Explicitly rebuild the form data to ensure Next.js doesn't strip the fileInfo string
    const strapiForm = new FormData();
    const file = incomingForm.get('files');
    const fileInfo = incomingForm.get('fileInfo');

    if (file) strapiForm.append('files', file);
    if (fileInfo) strapiForm.append('fileInfo', fileInfo as string);

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: strapiForm,
    });

    if (!response.ok) {
      throw new Error(`Strapi Upload Failed: ${await response.text()}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Upload Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}