import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for admin login and user is already authenticated
  if (pathname === '/admin/login') {
    const token = request.cookies.get('authToken')?.value || 
                  request.headers.get('authorization')?.replace('Token ', '');
    
    if (token) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/login',
  ],
};

