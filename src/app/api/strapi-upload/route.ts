/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const incomingForm = await req.formData();

    // 1. Grab ALL files, not just the first one
    const files = incomingForm.getAll('files');
    const fileInfo = incomingForm.get('fileInfo');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    const strapiForm = new FormData();

    // 2. Append all files to the new payload
    files.forEach((file) => {
      strapiForm.append('files', file);
    });

    // 3. BULLETPROOF THE FOLDER INSTRUCTION
    if (fileInfo) {
      try {
        const infoObj = JSON.parse(fileInfo as string);
        // Force it into an array matching the number of files so Strapi accepts it
        const infoArray = files.map(() => infoObj);
        strapiForm.append('fileInfo', JSON.stringify(infoArray));
      } catch (e) {
        // Fallback just in case parsing fails
        strapiForm.append('fileInfo', fileInfo as string);
      }
    }

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

export async function GET(req: NextRequest) {
  try {
    // Fetch the 100 most recent files from the main media library
    const fetchUrl = `${STRAPI_URL}/api/upload/files?sort=createdAt:desc&pagination[limit]=100`;

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${await response.text()}`);
    }

    const data = await response.json();

    // Safely filter the array to only return .png, .jpg, and .jpeg
    if (Array.isArray(data)) {
      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];

      const imageFiles = data.filter((file: any) => {
        if (!file.ext) return false;
        return allowedExtensions.includes(file.ext.toLowerCase());
      });

      return NextResponse.json(imageFiles);
    }

    // Fallback if data is not an array for some reason
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Fetch Media Proxy Error:', error);
    // Return an empty array on error so the frontend map() doesn't crash
    return NextResponse.json([]);
  }
}