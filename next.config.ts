import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: "standalone", // [DISABLED] Trying default build to fix Vercel error
    // swcMinify: true, // Deprecated in Next.js 15+ (Enabled by default)
    productionBrowserSourceMaps: false, // [Security] Disable Source Maps in Prod
    poweredByHeader: false, // [Security] Hide X-Powered-By: Next.js header
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false, // [Security] Strip debug logs in production
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'e7.pngegg.com' },
            { protocol: 'https', hostname: 'w7.pngwing.com' },
            { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
        ],
    },
    // 🔒 Security Headers
    headers: async () => [
        {
            source: '/:path*',
            headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
                { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
            ],
        },
    ],
};

export default nextConfig;

