import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/auth',];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.includes(pathname);

    if (token) {
        // If user is logged in and tries to access login or signup, redirect to dashboard
        if (pathname === '/auth' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    } else {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [

        '/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)',
    ],
};
