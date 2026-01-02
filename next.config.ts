import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    // swcMinify: true, // Deprecated in Next.js 15+ (Enabled by default)
    productionBrowserSourceMaps: false, // [Security] Disable Source Maps in Prod
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
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
        },
    ],
};

export default nextConfig;

