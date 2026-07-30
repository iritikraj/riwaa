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

export async function updateAuditInStrapi(documentId: string, backgroundData: any) {
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

export async function appendResultToStrapi(documentId: string, url: string, auditResult: any = null, errorMsg: string | null = null) {



  // 1. STRIPPED NAKED URL: Removed ?publicationState=preview
  const endpoint = `${STRAPI_URL}/api/website-audits/${documentId}`;

  let fetchRes = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    cache: 'no-store'
  });

  // 2. Race Condition Protection (just in case SQLite is locked)
  if (fetchRes.status === 404) {
    console.warn(`[Strapi] Document ${documentId} locked. Retrying in 2 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    fetchRes = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });
  }

  const currentDoc = await fetchRes.json();

  if (!currentDoc.data) {
    console.error(`[Strapi] Fatal Error. Response:`, currentDoc);
    throw new Error(`Strapi Error: ${currentDoc?.error?.message || 'Not Found'}`);
  }

  // 3. Extract existing array safely
  const existingAuditData = currentDoc.data.attributes?.audit_data || currentDoc.data.audit_data || { is_batch: true, results: [] };
  const existingResults = existingAuditData.results || [];

  // 4. Append the new AI result
  const newEntry = errorMsg ? { url, error: errorMsg } : { url, ...auditResult };
  existingResults.push(newEntry);

  // 5. Update the document and mark the entire batch as completed
  const updateRes = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        audit_status: 'completed',
        audit_data: {
          ...existingAuditData,
          results: existingResults
        }
      }
    })
  });

  return updateRes.json();
}

/* 
====================================== COMPETITOR AUDIT STRAPI HELPERS ======================================
*/

export interface CompetitorAuditPayload {
  target_url: string;
  competitor_urls: string[];
  industry?: string;
  audit_data: any;
  audit_status: 'processing' | 'completed' | 'failed';
}

/**
  Creates the initial placeholder record in Strapi when a comparison is initiated.
 */
export async function saveCompetitorAuditToStrapi(payload: CompetitorAuditPayload) {
  if (!STRAPI_TOKEN) {
    throw new Error("Missing STRAPI_API_TOKEN in environment variables.");
  }

  const response = await fetch(`${STRAPI_URL}/api/competitor-audits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Strapi Error (${response.status}): ${errorDetails}`);
  }

  const result = await response.json();
  return result.data;
}

/**
  Fetches the complete history of competitor comparison reports.
 */
export async function getCompetitorAuditsHistory() {
  const response = await fetch(`${STRAPI_URL}/api/competitor-audits?sort=createdAt:desc`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error(`Strapi Competitor Fetch Error (${response.status}): ${errorDetails}`);
    return [];
  }

  const result = await response.json();
  return result.data;
}

/**
  Retrieves a single competitor audit record by documentId or ID.
 */
export async function getCompetitorAuditById(id: string) {
  const response = await fetch(`${STRAPI_URL}/api/competitor-audits/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch competitor audit ID: ${id}`);
    return null;
  }

  const result = await response.json();
  return result.data;
}

/**
  Updates the competitor audit with the final comparison payload generated by Gemini AI.
 */
export async function updateCompetitorAuditInStrapi(
  documentId: string,
  updatedAuditData: any,
  status: 'completed' | 'failed' = 'completed'
) {
  const endpoint = `${STRAPI_URL}/api/competitor-audits/${documentId}`;

  const updateRes = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: {
        audit_status: status,
        audit_data: updatedAuditData,
      },
    }),
  });

  if (!updateRes.ok) {
    const errorText = await updateRes.text();
    throw new Error(`Failed to update competitor audit in Strapi: ${errorText}`);
  }

  return await updateRes.json();
}

/* CONTENT COMPLIANCE STRAPI HELPERS */

/** Updates the compliance audit record with the final comparison payload and score from the worker. */
export async function updateComplianceAuditInStrapi(
  documentId: string,
  status: 'processing' | 'downloading_brief' | 'scraping_live_url' | 'running_ai_analysis' | 'completed' | 'failed',
  overallScore: number | null = null,
  reportData: any = null
) {

  if (!STRAPI_TOKEN) {
    throw new Error("Missing STRAPI_API_TOKEN in environment variables.");
  }

  const endpoint = `${STRAPI_URL}/api/compliance-audits/${documentId}`;

  // Build the update payload dynamically based on what the worker extracted
  const updateData: any = {
    audit_status: status,
  };

  if (overallScore !== null) updateData.overall_score = overallScore;
  if (reportData !== null) updateData.report_data = reportData;

  const updateRes = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: updateData,
    }),
  });

  if (!updateRes.ok) {
    const errorText = await updateRes.text();
    throw new Error(`Failed to update compliance audit in Strapi: ${errorText}`);
  }

  return await updateRes.json();
}

/**
  Fetches the complete history of compliance checks. 
  Uses populate=brief_file to retrieve the media URL for the frontend.
 */
export async function getComplianceAuditsHistory() {
  const response = await fetch(`${STRAPI_URL}/api/compliance-audits?sort=createdAt:desc&populate=brief_file`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error(`Strapi Compliance Fetch Error (${response.status}): ${errorDetails}`);
    return [];
  }

  const result = await response.json();
  return result.data;
}

/**
  Retrieves a single compliance audit record by documentId.
 */
export async function getComplianceAuditById(id: string) {
  const response = await fetch(`${STRAPI_URL}/api/compliance-audits/${id}?populate=brief_file`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch compliance audit ID: ${id}`);
    return null;
  }

  const result = await response.json();
  return result.data;
}

export async function getContentBriefById(id: string) {
  const response = await fetch(`${STRAPI_URL}/api/content-briefs/${id}?populate=*`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(`Failed to fetch content brief ID: ${id}`);
    return null;
  }

  const result = await response.json();
  return result.data;
}

/**
 * Fetches the complete history of Content Briefs.
 * Uses populate=page_type_rule to get the name of the rule used.
 */
export async function getContentBriefsHistory() {
  const response = await fetch(`${STRAPI_URL}/api/content-briefs?sort=createdAt:desc&populate=page_type_rule`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error(`Strapi Content Brief Fetch Error (${response.status}): ${errorDetails}`);
    return [];
  }

  const result = await response.json();
  return result.data;
}