// riwaa/src/lib/real-estate-agents/strapi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export interface DeveloperAgentPayload {
  developer_name: string;
  agent_data: any;
  agent_bio: string;
  hero_banner?: string | null;
  developer_profile: string;
  projects_list: any;
  report_status: 'processing' | 'draft' | 'published';
  slug?: string;
}

export async function createDeveloperAgentInStrapi(payload: DeveloperAgentPayload) {
  if (!STRAPI_TOKEN) throw new Error("Missing STRAPI_API_TOKEN");

  const response = await fetch(`${STRAPI_URL}/api/developer-agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Strapi Error: ${response.status} - ${errorDetails}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getDeveloperAgentById(id: string) {
  const response = await fetch(`${STRAPI_URL}/api/developer-agents/${id}`, {
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

export async function updateDeveloperAgentInStrapi(documentId: string, updateData: Partial<DeveloperAgentPayload>) {
  const response = await fetch(`${STRAPI_URL}/api/developer-agents/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: updateData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update developer agent in Strapi: ${errorText}`);
  }

  const result = await response.json();
  return result.data;
}

export async function getDeveloperAgentBySlug(slug: string) {
  // We use Strapi's filtering syntax to find the exact slug
  const response = await fetch(`${STRAPI_URL}/api/developer-agents?filters[slug][$eq]=${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    // We can cache this for 60 seconds for insane performance, or use 'no-store' if you want instant updates
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;

  const result = await response.json();
  // Strapi returns an array when using filters, so we grab the first match
  return result.data && result.data.length > 0 ? result.data[0] : null;
}