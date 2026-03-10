'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    // [NEW] 오늘운세 메시지 클릭 시 챗봇 상담으로 이동
    const handleDailyMessageClick = (dailyGanji: string, message: string) => {
        // localStorage에 오늘운세 상담 요청 저장
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_today_consult', JSON.stringify({
                ganji: dailyGanji,
                message: message,
                requestedAt: new Date().toISOString()
            }));
        }
        // 챗봇 페이지로 이동
        router.push('/?intent=daily_fortune');
    };

    return (
        <TodayEnergyDashboard
            onBack={() => router.push('/')}
            onDailyMessageClick={handleDailyMessageClick}
        />
    );
}
