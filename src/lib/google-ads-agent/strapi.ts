/* eslint-disable @typescript-eslint/no-explicit-any */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_SYSTEM_TOKEN = process.env.STRAPI_API_TOKEN;

const getHeaders = (userToken?: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${userToken || STRAPI_SYSTEM_TOKEN}`,
});

export async function getGoogleAccountByCustomerId(customerId: string) {
  const res = await fetch(`${STRAPI_URL}/api/google-accounts?filters[customerId][$eq]=${customerId}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Failed to fetch Google Account: ${res.statusText}`);

  const json = await res.json();
  if (!json.data || json.data.length === 0) {
    return null;
  }

  return json.data?.length > 0 ? (json.data[0].attributes || json.data[0]) : null;
}

export async function updateGoogleCampaignBlueprint(blueprintId: string, data: any) {
  const res = await fetch(`${STRAPI_URL}/api/google-campaign-blueprints/${blueprintId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to update blueprint ${blueprintId}: ${errorData}`);
  }

  return res.json();
}

export async function saveNewBlueprint(data: any, token?: string) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const strapiToken = token || process.env.STRAPI_API_TOKEN;

  const res = await fetch(`${strapiUrl}/api/google-campaign-blueprints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
    },
    body: JSON.stringify({
      data: {
        campaignName: data.campaignName,
        brief: data.brief,
        approvalState: data.approvalState,
        blueprintData: data.blueprintData,
        user: data.userId,
        customerId: data.customerId
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to save blueprint in Strapi: ${errorText}`);
  }

  return await res.json();
}

export async function updateUserBlueprint(blueprintId: string, payloadData: any) {
  const res = await fetch(`${STRAPI_URL}/api/google-campaign-blueprints/${blueprintId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ data: payloadData }),
  });
  if (!res.ok) {
    throw new Error('Failed to update user blueprint in Strapi');
  }
  return res.json();
}

export async function getAllActiveGoogleAccounts() {
  const res = await fetch(`${STRAPI_URL}/api/google-accounts?filters[accountState][$eq]=active&populate=user`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch active Google Accounts');
  }
  const json = await res.json();
  return json.data || [];
}

export async function getGoogleAgentSetting(userId: string) {
  const res = await fetch(`${STRAPI_URL}/api/google-agent-settings?filters[user][id][$eq]=${userId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch Agent Settings');
  }
  const json = await res.json();
  return json.data?.length > 0 ? (json.data[0].attributes || json.data[0]) : null;
}

// Add customerId as the second parameter
export async function logGoogleAuditAction(userId: string, customerId: string, actionType: string, outcome: string, details: any) {
  await fetch(`${STRAPI_URL}/api/google-audit-logs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        actionType,
        outcome,
        details,
        user: userId,
        customerId
      }
    }),
  }).catch(e => console.error('Failed to write Google Audit Log:', e));
}

export async function fetchActiveGoogleAccounts() {
  const res = await fetch(`${STRAPI_URL}/api/google-accounts?filters[accountState][$eq]=active`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch active Google Accounts');
  const json = await res.json();
  return json.data || [];
}

export async function fetchGoogleAuditLogs(customerId: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/google-audit-logs?filters[customerId][$eq]=${customerId}&sort=createdAt:desc`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }
}

export async function createCampaignBlueprint(data: {
  customerId: string;
  campaignName: string;
  blueprintData: any;
  status?: string;
}) {
  const res = await fetch(`${STRAPI_URL}/api/google-campaign-blueprints`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      data: {
        customerId: data.customerId,
        campaignName: data.campaignName,
        status: data.status || 'draft',
        blueprintData: data.blueprintData,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to save blueprint in Strapi: ${errorText}`);
  }

  const json = await res.json();
  return json.data;
}

export async function fetchBlueprintById(documentId: string) {
  const res = await fetch(`${STRAPI_URL}/api/google-campaign-blueprints/${documentId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Blueprint not found');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchUserBlueprints(accountId: string) {
  const query = new URLSearchParams({ 'filters[customerId][$eq]': accountId, 'sort[0]': 'createdAt:desc' }).toString();

  const res = await fetch(`${STRAPI_URL}/api/google-campaign-blueprints?${query}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
}