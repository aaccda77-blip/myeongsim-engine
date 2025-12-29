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
};

export default nextConfig;
