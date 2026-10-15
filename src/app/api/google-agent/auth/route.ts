import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET(req: NextRequest) {
  // Use your exact callback URL
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/google-agent/callback`;

  const client = new OAuth2Client(
    process.env.GOOGLE_ADS_CLIENT_ID,
    process.env.GOOGLE_ADS_CLIENT_SECRET,
    redirectUri
  );

  const authUrl = client.generateAuthUrl({
    access_type: 'offline', // CRITICAL: This tells Google you need background access
    prompt: 'consent',      // CRITICAL: Forces Google to issue a new refresh_token every time
    scope: ['https://www.googleapis.com/auth/adwords'],
  });

  return NextResponse.redirect(authUrl);
}