// riwaa/src/app/api/google-agent/callback/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const STRAPI_SYSTEM_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided by Google' }, { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/google-agent/callback`;
  const client = new OAuth2Client(
    process.env.GOOGLE_ADS_CLIENT_ID,
    process.env.GOOGLE_ADS_CLIENT_SECRET,
    redirectUri
  );

  try {
    // 1. Exchange the temporary code for a permanent refresh token
    const { tokens } = await client.getToken(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      // If no refresh token is returned, the user likely didn't check the permissions box
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/google-agent/settings?error=no_refresh_token`);
    }

    // 2. Identify the active user session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('riwaa_session')?.value;

    let userId = null;
    if (sessionToken) {
      const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        userId = userData.documentId || userData.id;
      }
    }

    if (!userId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/google-agent/settings?error=unauthorized`);
    }

    // 3. Find the manually created Google Account for this user
    const existingAccountsRes = await fetch(`${STRAPI_URL}/api/google-accounts?filters[user][documentId][$eq]=${userId}`, {
      headers: { Authorization: `Bearer ${STRAPI_SYSTEM_TOKEN}` }
    });

    const existingAccountsData = await existingAccountsRes.json();
    const existingAccount = existingAccountsData.data?.[0];

    if (!existingAccount) {
      // Reject the connection if no manual account was set up beforehand
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/google-agent/settings?error=no_manual_account_found`);
    }

    const accountDocumentId = existingAccount.documentId || existingAccount.id;

    // 4. Update the existing record via PUT
    await fetch(`${STRAPI_URL}/api/google-accounts/${accountDocumentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_SYSTEM_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          refreshToken: refreshToken,
          accountState: 'active'
        }
      })
    });

    // 5. Redirect the user back to the application dashboard
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/google-agent/settings?success=google_connected`);

  } catch (error: any) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.json({ error: 'Failed to complete Google authentication' }, { status: 500 });
  }
}