import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory for serverless)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMITS = {
    '/api/meditation/generate': { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
    '/api/tts/supertone': { maxRequests: 20, windowMs: 60000 }, // 20 requests per minute
    '/api/chat': { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
    '/api/report/generate': { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute

    // [SECURITY] Admin Brute-Force Protection
    // Increased limit for usability: 100 attempts per 5 minutes.
    '/api/admin': { maxRequests: 100, windowMs: 5 * 60 * 1000 },
};

function getRateLimitKey(ip: string, path: string): string {
    return `${ip}:${path}`;
}

function checkRateLimit(request: NextRequest): NextResponse | null {
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
    const pathname = request.nextUrl.pathname;

    // Find matching rate limit config
    const rateLimitConfig = Object.entries(RATE_LIMITS).find(([path]) =>
        pathname.startsWith(path)
    )?.[1];

    if (!rateLimitConfig) {
        return null; // No rate limit for this path
    }

    const key = getRateLimitKey(ip, pathname);
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        // Create new record
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + rateLimitConfig.windowMs,
        });
        return null;
    }

    if (record.count >= rateLimitConfig.maxRequests) {
        // Rate limit exceeded
        return NextResponse.json(
            {
                error: 'Too Many Requests',
                message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                retryAfter: Math.ceil((record.resetTime - now) / 1000),
            },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
                    'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
                },
            }
        );
    }

    // Increment count
    record.count++;
    rateLimitStore.set(key, record);

    return null;
}

import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // [SECURITY DRM] 원본 PDF 직접 접근 및 다운로드 차단
    if (pathname.includes('zero-point.pdf') || pathname.startsWith('/books/')) {
        return new NextResponse(
            JSON.stringify({
                error: 'Forbidden',
                message: '보안 정책에 따라 원본 PDF 파일의 직접 다운로드가 차단되었습니다. 명심코칭 도서관(myeongsimcoaching.com/library)에서 정품 인증 후 안전하게 열람해주세요.',
            }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            }
        );
    }

    // [GATEWAY BYPASS LIST]
    const isGateBypass = 
        pathname === '/' ||
        pathname === '/gate' ||
        pathname.startsWith('/api/gate') ||
        pathname === '/admin/login' ||
        pathname.startsWith('/api/admin/login') ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/.test(pathname);

    if (!isGateBypass) {
        const siteAccessCookie = request.cookies.get('myeongsim_site_access')?.value || request.cookies.get('myeongsim_site_access_client')?.value;
        const adminSessionCookie = request.cookies.get('admin_session')?.value;

        const hasAccess = siteAccessCookie === 'granted' || !!adminSessionCookie;

        if (!hasAccess) {
            // If it's an API request, return 401
            if (pathname.startsWith('/api')) {
                return NextResponse.json(
                    { error: 'Site Under Construction', message: '아직 앱 스타트 준비 중입니다.' },
                    { status: 401 }
                );
            }
            // Redirect to /gate
            const gateUrl = new URL('/gate', request.url);
            if (pathname !== '/') {
                gateUrl.searchParams.set('redirect', pathname);
            }
            return NextResponse.redirect(gateUrl);
        }
    }
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 1. Supabase Session Refresh
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Refresh session if expired - required for Server Components
    await supabase.auth.getUser();

    // 2. Rate Limiting check
    const rateLimitResponse = checkRateLimit(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    // 3. Security Headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    );

    // HSTS (only in production)
    if (process.env.NODE_ENV === 'production') {
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://cdn.tailwindcss.com https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://texttospeech.googleapis.com wss://*.supabase.co",
            "media-src 'self' blob:",
            "frame-ancestors 'self' https://vercel.live https://*.vercel.live https://*.vercel.app",
        ].join('; ')
    );

    return response;
}

// Configure which routes to apply middleware to
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
