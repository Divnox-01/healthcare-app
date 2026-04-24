import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Paths requiring auth
  const isAuthRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isAuthRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Basic role routing (Note: in a real app, verify the JWT properly, here we just decode payload simply if possible, or assume dashboard APIs will reject if wrong role)
  // We can't use jsonwebtoken in Edge middleware easily, so we rely on backend API for strict checks.
  // But we can parse the JWT payload (base64)
  if (token && isAuthRoute) {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadStr = atob(payloadBase64);
      const payload = JSON.parse(payloadStr);

      const role = payload.role;
      
      if (request.nextUrl.pathname.startsWith('/dashboard/patient') && role !== 'PATIENT') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (request.nextUrl.pathname.startsWith('/dashboard/doctor') && role !== 'DOCTOR') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (request.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      // Ignore parsing errors, let backend handle invalid tokens
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
