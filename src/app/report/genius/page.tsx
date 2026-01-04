'use client';

import dynamic from 'next/dynamic';

// [Optimization] Heavy components loaded on demand
const GeniusReportContainer = dynamic(
    () => import('@/components/genius-report/GeniusReportContainer'),
    {
        loading: () => (
            <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-amber-400 text-sm animate-pulse">Genius Report 로딩 중...</p>
                </div>
            </div>
        ),
        ssr: false  // Client-only (Recharts compatibility)
    }
);

export default function GeniusReportPage() {
    return <GeniusReportContainer />;
}
