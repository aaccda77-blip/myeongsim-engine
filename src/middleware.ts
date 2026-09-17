import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// 만료된 레이트 리밋 기록 주기적 청소 (메모리 누수 방지)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of rateLimitStore.entries()) {
            if (now > record.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

// 엔드포인트별 세밀한 Rate Limiting (AI API 토큰 소진 방어 및 DDoS 차단)
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
    '/api/chat': { maxRequests: 25, windowMs: 60000 },
    '/api/myeongsim-chat': { maxRequests: 25, windowMs: 60000 },
    '/api/coaching': { maxRequests: 30, windowMs: 60000 },
    '/api/zero-capsule': { maxRequests: 20, windowMs: 60000 },
    '/api/decode': { maxRequests: 15, windowMs: 60000 },
    '/api/deep-scan': { maxRequests: 10, windowMs: 60000 },
    '/api/report/generate': { maxRequests: 5, windowMs: 60000 },
    '/api/meditation/generate': { maxRequests: 10, windowMs: 60000 },
    '/api/tts': { maxRequests: 20, windowMs: 60000 },
    '/api/payment': { maxRequests: 15, windowMs: 60000 },
    '/api/auth': { maxRequests: 20, windowMs: 60000 },
    '/api/admin': { maxRequests: 25, windowMs: 5 * 60 * 1000 },
};

function getRateLimitConfig(pathname: string) {
    for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
        if (pathname.startsWith(prefix)) {
            return config;
        }
    }
    if (pathname.startsWith('/api/')) {
        return { maxRequests: 60, windowMs: 60000 };
    }
    return null;
}

function getRateLimitKey(ip: string, pathname: string): string {
    const apiGroup = pathname.split('/').slice(0, 3).join('/');
    return `${ip}:${apiGroup}`;
}

function checkRateLimit(request: NextRequest): NextResponse | null {
    const { pathname } = request.nextUrl;
    const rateLimitConfig = getRateLimitConfig(pathname);

    if (!rateLimitConfig) {
        return null; // No rate limit for this path
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'anonymous';

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

// 악성 취약점 스캐너 및 침투 도구 User-Agent 블랙리스트
const BLOCKED_USER_AGENTS = [
    'sqlmap', 'nikto', 'masscan', 'wpscan', 'acunetix', 
    'nmap', 'nessus', 'havij', 'dirbuster', 'gobuster', 
    'zgrab', 'censys', 'shodan', 'openvas'
];

// 악의적인 경로 탐색, 레거시 PHP 익스플로잇 및 민감 파일 접근 차단 패턴
const BLOCKED_PATH_PATTERNS = [
    /\/\.env/i,
    /\/\.git/i,
    /\/\.vscode/i,
    /\/\.aws/i,
    /\/\.ssh/i,
    /wp-admin/i,
    /wp-login/i,
    /xmlrpc\.php/i,
    /phpmyadmin/i,
    /\.(php|asp|aspx|jsp|cgi|pl|sh|bash)$/i,
    /\.\.\/|\.\.\\|%2e%2e/i, // Path Traversal
    /\/api\/admin\/super-secret/i,
    /\/admin\/config/i,
    /\/api\/debug\/env/i,
    /dump\.sql/i,
    /backup\.sql/i,
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // 🛡️ [SECURITY LAYER 1] 악성 취약점 스캐너 및 자동화 공격 봇 원천 차단
    if (BLOCKED_USER_AGENTS.some(agent => userAgent.includes(agent))) {
        return new NextResponse('Access Denied: Malicious Scanner Detected', { 
            status: 403,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

    // 🛡️ [SECURITY LAYER 2] 민감 설정 파일, 디렉터리 순회(Path Traversal), 허니팟 탐색 차단
    if (BLOCKED_PATH_PATTERNS.some(pattern => pattern.test(pathname))) {
        return new NextResponse('Access Denied: Forbidden Resource', { 
            status: 403,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

    // 🛡️ [SECURITY LAYER 3] 원본 PDF 직접 접근 및 다운로드 차단
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

    // 🛡️ [SECURITY LAYER 4] 외부 도메인의 API 무단 호출 및 토큰 착취 차단 (CORS & Origin Hardening)
    const origin = request.headers.get('origin');
    if (pathname.startsWith('/api/')) {
        // OPTIONS 프리플라이트 처리
        if (request.method === 'OPTIONS') {
            if (origin) {
                const isAllowedOrigin = 
                    origin === 'https://myeongsimcoaching.com' ||
                    origin.endsWith('.myeongsimcoaching.com') ||
                    origin.endsWith('.vercel.app') ||
                    origin.startsWith('http://localhost:') ||
                    origin.startsWith('http://127.0.0.1:');
                if (isAllowedOrigin) {
                    return new NextResponse(null, {
                        status: 204,
                        headers: {
                            'Access-Control-Allow-Origin': origin,
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                            'Access-Control-Max-Age': '86400',
                        },
                    });
                }
            }
            return new NextResponse(null, { status: 204 });
        }

        // 제3자 악성 사이트에서 브라우저 fetch로 API 도용 시 403 차단
        if (origin) {
            const isAllowedOrigin = 
                origin === 'https://myeongsimcoaching.com' ||
                origin.endsWith('.myeongsimcoaching.com') ||
                origin.endsWith('.vercel.app') ||
                origin.startsWith('http://localhost:') ||
                origin.startsWith('http://127.0.0.1:');

            if (!isAllowedOrigin) {
                return new NextResponse('Access Denied: Unauthorized Cross-Origin Request', {
                    status: 403,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            }
        }
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 🛡️ [SECURITY LAYER 5] Supabase Session Refresh
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => {
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

        await supabase.auth.getUser();
    }

    // 🛡️ [SECURITY LAYER 6] Rate Limiting check
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
