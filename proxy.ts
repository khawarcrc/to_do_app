import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that don't require authentication
const PUBLIC_PAGES = ['/login', '/signup', '/forgot-password', '/reset-password'];
// API routes that are always accessible (auth endpoints themselves)
const PUBLIC_API_PREFIX = '/api/auth/';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Always allow ──────────────────────────────────────────
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Auth API routes are always public
  if (pathname.startsWith(PUBLIC_API_PREFIX)) {
    return NextResponse.next();
  }

  // Public pages (login / signup / etc.)
  if (PUBLIC_PAGES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // ── Require auth ──────────────────────────────────────────
  const token = req.cookies.get('auth-token')?.value;

  if (!token) {
    return unauthorised(req);
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    // Token expired or invalid — clear the bad cookie and redirect
    const res = unauthorised(req);
    res.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
    return res;
  }
}

function unauthorised(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  // For API calls return JSON 401 instead of redirecting
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
