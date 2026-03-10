'use client';

import dynamic from 'next/dynamic';

// [Optimization] Heavy components loaded on demand
const StrengthReportContainer = dynamic(
    () => import('@/components/strength-report/StrengthReportContainer'),
    {
        loading: () => (
            <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-amber-400 text-sm animate-pulse">본질 에너지 분석 리포트 로딩 중...</p>
                </div>
            </div>
        ),
        ssr: false  // Client-only (Recharts compatibility)
    }
);

export default function StrengthReportPage() {
    return <StrengthReportContainer />;
}
