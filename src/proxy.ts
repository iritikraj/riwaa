import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Use a Set for O(1) ultra-fast exact path lookups for static routes
const PROTECTED_ROUTES = new Set([
  '/creative-agent',
  '/real-estate',
  '/real-estate/advisors/create',
  '/real-estate/web-studio/create',
  '/seo-agent/audit',
  '/seo-agent/competitor',
  '/seo-agent/compliance',
  '/real-estate/developer-advisors',
  '/social-media-agent',
]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const originalToken = request.cookies.get('riwaa_session')?.value;
  let isValidToken = false;

  // 1. VALIDATE TOKEN
  if (originalToken) {
    try {
      // Decode the JWT payload (Edge-compatible)
      const payloadBase64 = originalToken.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      // Check if current time is less than expiration time
      if (payload.exp && Date.now() < payload.exp * 1000) {
        isValidToken = true;
      }
    } catch (e) {
      // If parsing fails, treat it as invalid
      isValidToken = false;
    }
  }

  // 2. AUTO-PURGE: If they have a cookie but it's expired/invalid, destroy it immediately.
  if (originalToken && !isValidToken) {
    const response = NextResponse.redirect(new URL(path, request.url));
    response.cookies.delete('riwaa_session');
    return response;
  }

  // 3. Protect internal API routes
  if (path.startsWith('/api/meta-agent') && !isValidToken) {
    return NextResponse.json({
      success: false,
      code: 'FORBIDDEN',
      error: 'Unauthorized: You do not have permission to access this resource.'
    }, { status: 401 });
  }

  // 4. Check if route requires auth
  const requiresAuth = PROTECTED_ROUTES.has(path) || path.startsWith('/meta-agent');

  // Unauthenticated user trying to access a protected route
  if (requiresAuth && !isValidToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // Append where they were trying to go so the login page knows where to send them back
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Prevent authenticated users from accessing the login page
  if (path === '/auth/login' && isValidToken) {
    // If they already have a token, send them to their intended destination or home
    const nextPath = request.nextUrl.searchParams.get('next') || '/';
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  return NextResponse.next();
}

// Optimize the proxy to ignore static files and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)'],
};