import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/submit',
  '/admin',
  '/editor',
  '/settings',
  '/profile'
];

// Routes that require specific roles
const roleProtectedRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/editor': ['admin', 'editor']
};

// Public routes that don't need authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/article',
  '/search',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/editorial-standards',
  '/ethics-code'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Get token from request headers or cookies
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('token')?.value;
    
    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      return NextResponse.redirect(loginUrl);
    }
    
    // TODO: Add token validation here
    // For now, we'll let the client-side handle detailed auth checks
    
    // Check role-based access
    const requiredRoles = roleProtectedRoutes[pathname];
    if (requiredRoles) {
      // This would need server-side token verification
      // For now, we'll rely on client-side checks
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
