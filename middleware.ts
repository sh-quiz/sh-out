import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    let token = request.cookies.get('access_token')?.value;
    
    // Handle invalid token strings
    if (token === 'undefined' || token === 'null') {
        token = undefined;
    }

    const { pathname } = request.nextUrl;

    // Define public routes that don't require authentication
    // Using startsWith to cover all auth routes (login, signup, callback, etc)
    const isPublicRoute = pathname === '/' || pathname.startsWith('/auth');

    if (token) {
        // If user is logged in and tries to access login or signup, redirect to dashboard
        if (pathname === '/auth' || pathname.startsWith('/auth/')) {
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
