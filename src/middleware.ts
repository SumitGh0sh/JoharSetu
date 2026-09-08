import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'joharsetu_sih2026_super_secure_jwt_secret_jharkhand'
);

const AUTH_COOKIE_NAME = 'joharsetu_token';

// Allowed roles per portal path
const ROLE_PERMISSIONS: Record<string, string[]> = {
  '/portal/citizen': ['CITIZEN', 'PANCHAYAT_OFFICER', 'SUPER_ADMIN'],
  '/portal/panchayat': ['PANCHAYAT_OFFICER', 'GOVT_OFFICER', 'SUPER_ADMIN'],
  '/portal/hei': ['STUDENT', 'FACULTY_MENTOR', 'DEPT_HEAD', 'HEI_DIRECTOR', 'SUPER_ADMIN'],
  '/portal/csr': ['INDUSTRY_CSR', 'SUPER_ADMIN'],
  '/portal/admin': ['GOVT_OFFICER', 'SUPER_ADMIN'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only intercept /portal routes
  if (pathname.startsWith('/portal')) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userRole = (payload.role as string) || 'CITIZEN';

      // Check specific portal path
      for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
        if (pathname.startsWith(routePrefix)) {
          if (!allowedRoles.includes(userRole)) {
            // Redirect to user's authorized portal
            let target = '/portal/citizen';
            if (userRole === 'PANCHAYAT_OFFICER') {
              target = '/portal/panchayat';
            } else if (['STUDENT', 'FACULTY_MENTOR', 'DEPT_HEAD', 'HEI_DIRECTOR'].includes(userRole)) {
              target = '/portal/hei';
            } else if (userRole === 'INDUSTRY_CSR') {
              target = '/portal/csr';
            } else if (['GOVT_OFFICER', 'SUPER_ADMIN'].includes(userRole)) {
              target = '/portal/admin';
            }
            const redirectUrl = new URL(target, req.url);
            redirectUrl.searchParams.set('unauthorized', 'true');
            return NextResponse.redirect(redirectUrl);
          }
          break;
        }
      }

      return NextResponse.next();
    } catch {
      // Invalid/expired token
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
