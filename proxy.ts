import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/auth/login', '/auth/signup'];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    if (token) {
        // If user is logged in and tries to access login or signup, redirect to dashboard
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    } else {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
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
         * - images/ (public images if any)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};
