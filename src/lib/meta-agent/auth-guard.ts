// src/lib/meta-agent/auth-guard.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import { fetchMetaAccountFromStrapi } from "./strapi";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('riwaa_session')?.value;
  if (!token) throw new Error('Unauthorized');

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function getAuthorizedMetaAccount(accountId: string) {
  const user = await getSessionUser(); // Assuming this is your existing user fetcher
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  // FIX: Use filters to support both Document IDs (strings) and standard IDs (numbers)
  // We also must populate 'assigned_users' so we can verify their permissions
  const query = new URLSearchParams({
    'filters[$or][0][documentId][$eq]': accountId,
    'filters[$or][1][id][$eq]': accountId,
    'populate': 'assigned_users'
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/meta-accounts?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    cache: 'no-store'
  });

  const json = await res.json();

  // If the array is empty, the account doesn't exist
  if (!json.data || json.data.length === 0) {
    throw new Error('Account not found');
  }

  // Extract the first (and only) matching account
  const account = json.data[0];
  const accountData = account.attributes || account;

  // VERIFY PERMISSIONS
  if (!user.isAdmin) {
    const assignedUsers = accountData.assigned_users?.data || accountData.assigned_users || [];
    const isAssigned = assignedUsers.some((u: any) =>
      String(u.id) === String(user.id) || String(u.documentId) === String(user.id)
    );

    if (!isAssigned) {
      throw new Error('Unauthorized: You do not have access to this Meta account');
    }
  }

  return account;
}