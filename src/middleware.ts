import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// [Security] In-Memory Rate Limit Map (Reset on server restart)
const rateLimitMap = new Map();
// [Security] Suspicious Activity Tracker
const suspiciousIPs = new Map();
// [Security] Request Fingerprint Map
const fingerprintMap = new Map();

// [Helper] Detect suspicious patterns
function isSuspiciousRequest(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousPatterns = [
        /bot|crawler|spider|scraper/i,
        /curl|wget|python|java/i,
        /sqlmap|nikto|nmap/i,
        /\.\./,  // Path traversal
        /<script/i,  // XSS attempt
        /union.*select/i,  // SQL injection
    ];

    const url = request.nextUrl.pathname + request.nextUrl.search;

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(userAgent) || pattern.test(url)) {
            return true;
        }
    }
    return false;
}

// [Helper] Sanitize and validate request
function isValidRequest(request: NextRequest): boolean {
    const path = request.nextUrl.pathname;

    // Block common attack paths
    const blockedPaths = [
        '/wp-admin', '/wp-login', '/.env', '/.git',
        '/phpmyadmin', '/admin.php', '/config.php',
        '/.htaccess', '/web.config', '/server-status'
    ];

    if (blockedPaths.some(bp => path.toLowerCase().includes(bp))) {
        return false;
    }

    // Block excessively long URLs (potential buffer overflow)
    if (path.length > 500) {
        return false;
    }

    return true;
}

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';
    const now = Date.now();

    // ===== 0. IMMEDIATE BLOCK: Suspicious Requests =====
    if (isSuspiciousRequest(request)) {
        // Track suspicious activity
        const count = (suspiciousIPs.get(ip) || 0) + 1;
        suspiciousIPs.set(ip, count);

        // Block after 3 suspicious requests
        if (count >= 3) {
            console.warn(`[SECURITY] Blocked suspicious IP: ${ip}`);
            return new NextResponse('Forbidden', { status: 403 });
        }
    }

    // ===== 1. Block Invalid Requests =====
    if (!isValidRequest(request)) {
        console.warn(`[SECURITY] Blocked invalid path: ${request.nextUrl.pathname} from ${ip}`);
        return new NextResponse('Not Found', { status: 404 });
    }

    // ===== 2. Rate Limiting (Tiered) =====
    const windowMs = 60 * 1000;
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');
    const isAuthRoute = request.nextUrl.pathname.includes('/login') ||
        request.nextUrl.pathname.includes('/auth');

    // Stricter limits for sensitive routes
    let limit = 100;  // Default: 100 req/min
    if (isApiRoute) limit = 60;  // API: 60 req/min
    if (isAuthRoute) limit = 10;  // Auth: 10 req/min (brute force protection)

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, reset: now + windowMs });
    } else {
        const data = rateLimitMap.get(ip);
        if (now > data.reset) {
            rateLimitMap.set(ip, { count: 1, reset: now + windowMs });
        } else {
            data.count++;
            if (data.count > limit) {
                console.warn(`[SECURITY] Rate limit exceeded: ${ip} (${data.count} requests)`);
                return new NextResponse('Too Many Requests', {
                    status: 429,
                    headers: {
                        'Retry-After': Math.ceil((data.reset - now) / 1000).toString()
                    }
                });
            }
        }
    }

    // ===== 3. Security Headers (Maximum Protection) =====
    // [HSTS] Force HTTPS for 2 years with preload
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // [XSS & Injection Protection]
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

    // [Permissions Policy - Strict]
    response.headers.set('Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), bluetooth=()'
    );

    // [Content Security Policy - Strict]
    const csp = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.googletagmanager.com;
        style-src 'self' 'unsafe-inline' https://*.googleapis.com;
        img-src 'self' data: blob: https:;
        font-src 'self' data: https://*.gstatic.com;
        connect-src 'self' https://*.googleapis.com https://*.supabase.co wss://*.supabase.co https://*.vercel.app;
        frame-ancestors 'none';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
        block-all-mixed-content;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', csp);

    // ===== 4. Admin Route Protection =====
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Skip login page
        if (request.nextUrl.pathname === '/admin/login') {
            return response;
        }

        const adminSession = request.cookies.get('admin_session');

        if (!adminSession || adminSession.value !== 'authenticated') {
            console.warn(`[SECURITY] Unauthorized admin access attempt from ${ip}`);
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // ===== 5. Fingerprinting Protection =====
    // Remove server info headers
    response.headers.delete('X-Powered-By');
    response.headers.delete('Server');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
