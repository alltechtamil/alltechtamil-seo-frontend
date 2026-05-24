import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './constants/routes';

export function proxy(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname === ROUTES.LOGIN;
  const isAdminRoute = request.nextUrl.pathname.startsWith(ROUTES.ADMIN);
  const hasRefreshToken = request.cookies.has('refreshToken');

  // Protect all admin routes
  if (isAdminRoute && !hasRefreshToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    // Optionally preserve the intended destination to redirect back after a successful login
    if (request.nextUrl.pathname !== ROUTES.ADMIN) {
      loginUrl.searchParams.set('next', request.nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from visiting the login page
  if (isAuthRoute && hasRefreshToken) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN_DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware only to admin routes and the login page to minimize execution overhead on public pages
  // Note: matchers must be statically analysable, so we can't use ROUTES dynamically here.
  matcher: ['/admin/:path*', '/login'],
};
