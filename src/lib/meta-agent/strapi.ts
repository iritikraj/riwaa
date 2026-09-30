// riwaa/src/lib/meta-agent/strapi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
});

// Settings / Guardrails

/**
 * Fetches the dynamic safety limits configured in the Strapi Admin panel.
 * UPDATED: Now queries a collection type filtered by the specific meta_account.
 */
export async function getMetaAgentSettings(accountId: string) {
  const query = new URLSearchParams({
    'filters[meta_account][documentId][$eq]': accountId,
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/meta-agent-settings?${query}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch Meta Agent Settings');

  const json = await res.json();

  // If the admin hasn't created specific settings for this account, return safe defaults
  if (!json.data || json.data.length === 0) {
    return {
      max_budget_change_pct: 20,
      min_spend_threshold: 50,
      min_impressions_threshold: 1000,
      disallow_pause_actions: false,
    };
  }

  const attributes = json.data[0].attributes || json.data[0];
  return attributes;
}

// Audit Logs

/**
 * Creates an immutable paper trail of every decision the agent and the human make.
 * UPDATED: Now requires accountId and userId for traceability.
 */
export async function createAuditLog(eventType: string, details: Record<string, any>, accountId: string, userId: string) {
  const res = await fetch(`${STRAPI_URL}/api/meta-audit-logs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        event_type: eventType,
        details: details,
        meta_account: accountId,
        triggered_by: userId
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
 * UPDATED: Links the recommendation to a specific meta account.
 */
export async function createRecommendation(recData: any, accountId?: string) {
  const targetAccountId = accountId || recData.meta_account;

  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        ...recData,
        status: 'pending',
        meta_account: targetAccountId
      },
    }),
  });

  if (!res.ok) throw new Error('Failed to create recommendation: ' + await res.text());
  const json = await res.json();
  return { id: json.data.documentId || json.data.id, ...(json.data.attributes || json.data) };
}

/**
 * Fetches all recommendations that are waiting for human approval.
 * UPDATED: Filters strictly by accountId and populates relations.
 */
export async function getPendingRecommendations(accountId: string) {
  const query = new URLSearchParams({
    'filters[status][$eq]': 'pending',
    'filters[meta_account][documentId][$eq]': accountId,
    'sort[0]': 'createdAt:desc',
    'populate': '*'
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations?${query}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch pending recommendations');
  const json = await res.json();
  return json.data.map((item: any) => ({
    id: item.documentId || item.id,
    ...(item.attributes || item),
  }));
}

/**
 * Fetches a single recommendation by its Strapi ID.
 * UPDATED: Populates the meta_account so the API route knows which account to authorize.
 */
export async function getRecommendationById(id: string | number) {
  const res = await fetch(`${STRAPI_URL}/api/meta-recommendations/${id}?populate[meta_account]=*`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch recommendation ${id}`);
  const json = await res.json();
  return { id: json.data.documentId || json.data.id, ...(json.data.attributes || json.data) };
}

/**
 * Updates a recommendation's status (approved, rejected, executed, failed) and logs the reason.
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
  return { id: json.data.documentId || json.data.id, ...(json.data.attributes || json.data) };
}

// Reports

/**
 * Creates a historical Meta Ads AI Report.
 * UPDATED: Accepts meta_account to satisfy the new relation in Strapi.
 */
export async function createMetaAdsReport(payload: {
  client_name: string;
  date_preset: string;
  metrics: any;
  markdown_content: string;
  meta_account: string;
}) {
  const res = await fetch(`${STRAPI_URL}/api/meta-ads-reports`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ data: payload }),
  });

  if (!res.ok) {
    console.error('Failed to save report to Strapi:', await res.text());
    throw new Error('Failed to save report to Strapi');
  }

  return res.json();
}

// Accounts (Multi-Tenant Context)

/**
 * Fetches the isolated credentials and assignment data for a specific ad account.
 * UPDATED: Requests the assigned_users relation mapping to the frontend users collection.
 */
export async function fetchMetaAccountFromStrapi(requestedAccountId: string) {
  try {
    const query = new URLSearchParams({
      'filters[$or][0][documentId][$eq]': requestedAccountId,
      'filters[$or][1][id][$eq]': requestedAccountId,
      'filters[$or][2][ad_account_id][$eq]': requestedAccountId,
      'populate[assigned_users]': '*',
    }).toString();

    const res = await fetch(`${STRAPI_URL}/api/meta-accounts?${query}`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Strapi error fetching meta account:', res.statusText);
      return null;
    }

    const json = await res.json();

    if (!json.data || json.data.length === 0) return null;

    const account = json.data[0];
    const attributes = account.attributes || account;

    return {
      id: account.id,
      documentId: account.documentId || account.id,
      name: attributes.name,
      ad_account_id: attributes.ad_account_id,
      page_id: attributes.page_id,
      pixel_id: attributes.pixel_id,
      access_token: attributes.access_token,
      is_active: attributes.is_active,
      assigned_users: attributes.assigned_users?.data || attributes.assigned_users || [],
      ...attributes
    };
  } catch (error) {
    console.error('Failed to fetch Meta account:', error);
    return null;
  }
}

export async function getActiveMetaAccounts() {
  const res = await fetch(`${STRAPI_URL}/api/meta-accounts?populate=*`, {
    headers: getHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function getMetaAgentSettingsForAccount(accountId: string) {
  const res = await fetch(`${STRAPI_URL}/api/meta-agent-settings?filters[meta_account][documentId][$eq]=${accountId}&populate=*`, {
    headers: getHeaders(),
    cache: 'no-store'
  });
  if (!res.ok) return getDefaultSettings();
  const json = await res.json();
  const settings = json.data?.[0]?.attributes || json.data?.[0];
  return settings || getDefaultSettings();
}

function getDefaultSettings() {
  return {
    min_spend_threshold: 10,
    min_impressions_threshold: 100,
    max_budget_change_pct: 20,
    max_actions_per_run: 10,
    target_cpa: 25,
    protected_campaign_ids: [],
    disallow_pause_actions: false
  };
}