/* eslint-disable @typescript-eslint/no-explicit-any */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Make sure to add STRAPI_API_TOKEN to your .env.local
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
});

// Settings / Guardrails

/**
 * Fetches the dynamic safety limits configured in the Strapi Admin panel.
 * Replaces the Python config.py environment variable reading.
 */
export async function getMetaAgentSettings() {
  const res = await fetch(`${STRAPI_URL}/api/meta-agent-setting`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch Meta Agent Settings');

  const json = await res.json();
  return json.data?.attributes || {
    max_budget_change_pct: 20,
    min_spend_threshold: 50,
    min_impressions_threshold: 1000,
    disallow_pause_actions: false,
  };
}

// Audit Logs

/**
 * Creates an immutable paper trail of every decision the agent and the human make.
 * Replaces the storage.log_event() method from Python.
 */
export async function createAuditLog(eventType: string, details: Record<string, any>) {
  const res = await fetch(`${STRAPI_URL}/api/meta-audit-logs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        event_type: eventType,
        details: details,
      },
    }),
  });

  if (!res.ok) {
    console.error(`[Audit Log Failed] ${eventType}:`, await res.text());
  }
}

// Recommendations (Queue)

/**
 * Adds a new recommendation from the AI optimizer to the pending queue.
 * Replaces storage.add_recommendation()
 */
export async function createRecommendation(recData: any) {
  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        ...recData,
        status: 'pending',
      },
    }),
  });

  if (!res.ok) throw new Error('Failed to create recommendation: ' + await res.text());
  const json = await res.json();
  return { id: json.data.id, ...json.data.attributes };
}

/**
 * Fetches all recommendations that are waiting for human approval.
 * Replaces storage.list_recommendations(status="pending")
 */
export async function getPendingRecommendations() {
  // Sort by newest first and only get 'pending'
  const query = `?filters[status][$eq]=pending&sort[0]=createdAt:desc`;
  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations${query}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch pending recommendations');
  const json = await res.json();
  return json.data.map((item: any) => ({
    id: item.id,
    ...item.attributes,
  }));
}

/**
 * Fetches a single recommendation by its Strapi ID.
 */
export async function getRecommendationById(id: string | number) {
  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations/${id}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch recommendation ${id}`);
  const json = await res.json();
  return { id: json.data.id, ...json.data.attributes };
}

/**
 * Updates a recommendation's status (approved, rejected, executed, failed) and logs the reason.
 * Replaces storage.resolve_recommendation()
 */
export async function updateRecommendationStatus(id: string | number, status: string, resolutionNote: string = '') {
  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        status: status,
        resolution_note: resolutionNote,
      },
    }),
  });

  if (!res.ok) throw new Error(`Failed to update recommendation ${id}: ` + await res.text());
  const json = await res.json();
  return { id: json.data.id, ...json.data.attributes };
}

export async function createMetaAdsReport(payload: {
  client_name: string;
  date_preset: string;
  metrics: any;
  markdown_content: string; // Updated key
}) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  const res = await fetch(`${STRAPI_URL}/api/meta-ads-reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  if (!res.ok) {
    console.error('Failed to save report to Strapi:', await res.text());
    throw new Error('Failed to save report to Strapi');
  }

  return res.json();
}