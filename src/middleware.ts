import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Security Headers (Hacker Protection)
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // 2. Admin Route Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Skip login page
        if (request.nextUrl.pathname === '/admin/login') {
            return response;
        }

        const adminSession = request.cookies.get('admin_session');

        if (!adminSession || adminSession.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*',
    ],
};
