import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the NextAuth token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if the request is for admin login and user is already authenticated
  if (pathname === '/admin/login') {
    if (token) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  // Protect all other admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to login if not authenticated
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

