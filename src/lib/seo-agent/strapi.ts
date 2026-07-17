/* eslint-disable @typescript-eslint/no-explicit-any */
// src/shared/lib/strapi.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface AuditPayload {
  target_url: string;
  industry?: string;
  audit_data: any;
  audit_status: 'processing' | 'completed' | 'failed';
}

export async function saveAuditToStrapi(payload: AuditPayload) {
  const response = await fetch(`${STRAPI_URL}/api/website-audits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
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

export async function getAuditsHistory() {
  // We use ?sort=createdAt:desc to get the newest first
  const response = await fetch(`${STRAPI_URL}/api/website-audits?sort=createdAt:desc`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error(`Strapi Fetch Error: ${response.status} - ${errorDetails}`);
    return [];
  }

  const result = await response.json();
  return result.data;
}

export async function getAuditById(id: string) {
  const response = await fetch(`${STRAPI_URL}/api/website-audits/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch audit ${id}`);
    return null;
  }

  const result = await response.json();
  return result.data;
}

export async function fetchPageSpeedData(url: string) {
  const apiKey = process.env.GOOGLE_PSI_API_KEY || '';
  const strategy = 'mobile';

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.log(`PageSpeed API failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) return null;

    // 1. Extract the Core Category Scores (Multiplying by 100 to match your UI)
    const scores = {
      performance: lighthouse.categories?.performance?.score * 100 || 'Unknown',
      accessibility: lighthouse.categories?.accessibility?.score * 100 || 'Unknown',
      best_practices: lighthouse.categories?.['best-practices']?.score * 100 || 'Unknown',
      seo: lighthouse.categories?.seo?.score * 100 || 'Unknown',
    };

    // 2. Extract Core Web Vitals
    const web_vitals = {
      first_contentful_paint: lighthouse.audits['first-contentful-paint']?.displayValue || 'Unknown',
      largest_contentful_paint: lighthouse.audits['largest-contentful-paint']?.displayValue || 'Unknown',
      cumulative_layout_shift: lighthouse.audits['cumulative-layout-shift']?.displayValue || 'Unknown',
      total_blocking_time: lighthouse.audits['total-blocking-time']?.displayValue || 'Unknown',
      speed_index: lighthouse.audits['speed-index']?.displayValue || 'Unknown',
    };

    // 3. Extract Specific Diagnostics & Opportunities (Only if they are flagged as issues)
    const rawAudits = lighthouse.audits;
    const diagnostics: string[] = [];

    // Loop through all audits and keep the ones that represent an opportunity (score < 1)
    // We only take the title and display value to keep the payload lightweight for the LLM
    for (const key in rawAudits) {
      const audit = rawAudits[key];
      // If it's a metric that can be improved (score < 1) and has a display value (like "Est savings of 150ms")
      if (audit.score !== null && audit.score < 1 && audit.displayValue) {
        diagnostics.push(`${audit.title} - ${audit.displayValue}`);
      } else if (audit.score !== null && audit.score < 1 && audit.details?.type === 'opportunity') {
        diagnostics.push(audit.title);
      }
    }

    const compiledData = {
      scores,
      web_vitals,
      // Cap the diagnostics to the top 15 most critical issues to protect LLM context windows
      critical_diagnostics: diagnostics.slice(0, 15)
    };

    console.log(`Expanded PageSpeed data fetched for ${url}. Issues found: ${compiledData.critical_diagnostics.length}`);
    console.log({ compiledData });
    return compiledData;

  } catch (error) {
    console.error("Failed to fetch PageSpeed data:", error);
    return null;
  }
}

export async function updateAuditInStrapi(documentId: string, backgroundData: any) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338'; // Aligned port
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_TOKEN) {
    console.error("Missing STRAPI_API_TOKEN. Cannot update document in background.");
    return null;
  }

  try {
    // 1. Fetch the existing audit data using the CORRECT endpoint
    const getRes = await fetch(`${STRAPI_URL}/api/website-audits/${documentId}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });

    if (!getRes.ok) throw new Error(`Failed to fetch existing document: ${getRes.statusText}`);

    const existingDoc = await getRes.json();

    // Safely extract existing audit_data (handles both Strapi v4 attributes wrapper and v5 flat structures)
    const currentAuditData = existingDoc.data?.attributes?.audit_data || existingDoc.data?.audit_data || {};

    // 2. Safely inject BOTH the raw spider data and the AI synthesis
    const updatedAuditData = {
      ...currentAuditData,
      raw_spider_data: backgroundData.raw_spider_data, // The hard proof
      domain_architecture: backgroundData.domain_architecture // The deterministic math summary
    };

    // 3. Save it back to Strapi using the CORRECT endpoint
    const updateRes = await fetch(`${STRAPI_URL}/api/website-audits/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          audit_data: updatedAuditData,
        },
      }),
    });

    if (!updateRes.ok) throw new Error(`Strapi update failed: ${updateRes.statusText}`);
    return await updateRes.json();
  } catch (error) {
    console.error("Failed to update Strapi from background worker:", error);
    return null;
  }
}