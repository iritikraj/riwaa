/* eslint-disable @typescript-eslint/no-explicit-any */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// 1. Dynamic Campaign Data Types
export interface RealEstateCampaign {
  location?: string;
  starting_price?: string;
  property_type?: string;
}

export interface GenericCampaign {
  [key: string]: string | number | boolean;
}

// 2. The Scalable Payload Interface
export interface CreativeAgentPayload {
  brand_name: string;
  category: 'real_estate' | 'ecommerce' | 'service' | 'saas' | 'other';
  campaign_data: RealEstateCampaign | GenericCampaign; // The dynamic bucket
  usps: string[];

  // Media fields in Strapi are often referenced by their ID when uploading/updating
  logo?: number | null;
  background_image?: number | null;

  ai_copy?: {
    headline: string;
    subhead?: string;
    cta: string;
  } | null;

  // Stores the relative Strapi /uploads/ paths mapped to their specific formats
  generated_creatives?: {
    feed_square?: string;
    story_vertical?: string;
    social_landscape?: string;
  } | null;

  report_status: 'processing' | 'draft' | 'published' | 'failed';
  slug?: string;
}

export async function createCreativeAgentInStrapi(payload: CreativeAgentPayload) {
  if (!STRAPI_TOKEN) throw new Error("Missing STRAPI_API_TOKEN");

  const response = await fetch(`${STRAPI_URL}/api/creative-agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Strapi Create Error: ${response.status} - ${errorDetails}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getCreativeAgentById(documentId: string) {
  const response = await fetch(`${STRAPI_URL}/api/creative-agents/${documentId}?populate=*`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const result = await response.json();
  return result.data;
}

export async function updateCreativeAgentInStrapi(documentId: string, updateData: Partial<CreativeAgentPayload>) {
  const response = await fetch(`${STRAPI_URL}/api/creative-agents/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: updateData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Strapi Update Error: ${errorText}`);
  }

  const result = await response.json();
  return result.data;
}

export async function uploadBufferToStrapi(buffer: Buffer, filename: string, folderId?: number): Promise<string> {
  if (!STRAPI_TOKEN) throw new Error("Missing STRAPI_API_TOKEN");

  const formData = new FormData();

  // Wrap the Node Buffer in a Uint8Array to satisfy the TypeScript BlobPart interface
  const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });
  formData.append('files', blob, filename);

  // Dynamically route to the correct folder if an ID is provided
  if (folderId) {
    formData.append('fileInfo', JSON.stringify({ folder: folderId }));
  }

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: formData as any,
  });

  if (!response.ok) throw new Error(`Upload failed: ${await response.text()}`);

  const result = await response.json();
  // Return the relative URL (e.g., /uploads/my-image.png)
  return result[0].url;
}

// Fetch all generated creatives for the history grid, sorted by newest
export async function getAllCreativeAgents() {
  if (!STRAPI_TOKEN) return [];

  const response = await fetch(`${STRAPI_URL}/api/creative-agents?populate=*&sort=createdAt:desc`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store', // ensures the history is always up to date
  });

  if (!response.ok) return [];
  const result = await response.json();
  return result.data;
}

// Fetch a specific creative by its slug
export async function getCreativeAgentBySlug(slug: string) {
  if (!STRAPI_TOKEN) return null;

  const response = await fetch(`${STRAPI_URL}/api/creative-agents?filters[slug][$eq]=${slug}&populate=*`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const result = await response.json();
  return result.data && result.data.length > 0 ? result.data[0] : null;
}

// Fetch the active template for a specific format
export async function getActiveTemplate(format: string) {
  if (!STRAPI_TOKEN) return null;

  const response = await fetch(`${STRAPI_URL}/api/creative-templates?filters[format][$eq]=${format}&filters[is_active][$eq]=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const result = await response.json();
  return result.data && result.data.length > 0 ? result.data[0] : null;
}