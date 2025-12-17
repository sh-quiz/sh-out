import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/auth/login', '/auth/signup'];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    // Use a simple logic:
    // 1. If user has token and is on a public auth route (login/signup), redirect to dashboard
    // 2. If user has NO token and is on a private route, redirect to login

    if (token) {
        // If user is logged in and tries to access login or signup, redirect to dashboard
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/main', request.url));
        }
    } else {
        // If user is NOT logged in and tries to access a protected route
        if (!isPublicRoute) {
            // Allow access to public assets and api routes if needed, usually handled by matcher but good to be safe
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
