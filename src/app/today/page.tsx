'use client';

import dynamic from 'next/dynamic';

// [Optimization] Heavy component loaded on demand
const TodayEnergyDashboard = dynamic(
    () => import('@/components/dashboard/TodayEnergyDashboard'),
    {
        loading: () => (
            <div className="min-h-screen bg-[#0B0915] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-amber-400 text-sm animate-pulse">에너지 분석 중...</p>
                </div>
            </div>
        ),
        ssr: false
    }
);

export default function TodayPage() {
    return <TodayEnergyDashboard />;
}
