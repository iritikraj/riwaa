import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Use a Set for O(1) ultra-fast exact path lookups
const PROTECTED_ROUTES = new Set([
  '/creative-agent',
  '/real-estate',
  '/real-estate/advisors/create',
  '/real-estate/web-studio/create',
  '/seo-agent/audit',
  '/seo-agent/competitor',
  '/seo-agent/compliance',
  '/real-estate/developer-advisors',
  '/social-media-agent'
]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('riwaa_session')?.value;

  // 2. Unauthenticated user trying to access a protected route
  if (PROTECTED_ROUTES.has(path) && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // Append where they were trying to go so the login page knows where to send them back
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent authenticated users from accessing the login page
  if (path === '/auth/login' && token) {
    // If they already have a token, send them to their intended destination or home
    const nextPath = request.nextUrl.searchParams.get('next') || '/';
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  return NextResponse.next();
}

// Optimize the middleware to ignore static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)'],
};