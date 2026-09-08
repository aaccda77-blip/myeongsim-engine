'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import BusinessArchitectureDashboard, { BusinessTab } from '@/components/startup/BusinessArchitectureDashboard';

function StartupReportContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') as BusinessTab || 'dna';
    const { reportData } = useReportStore();

    return (
        <main className="min-h-screen bg-[#080811] text-white">
            {/* 상단 네비게이션 바 */}
            <div className="sticky top-0 z-50 bg-[#080811]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/5"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>이전 화면으로 돌아가기</span>
                </button>
                <span className="text-xs text-amber-400 font-mono font-bold">
                    🏛️ 명심 3S 비즈니스 아키텍처
                </span>
            </div>

            {/* 메인 풀스크린 대시보드 */}
            <div className="max-w-5xl mx-auto">
                <BusinessArchitectureDashboard
                    isFullScreen={true}
                    initialTab={['dna', 'wealth', 'timing'].includes(tabParam) ? tabParam : 'dna'}
                    userProfile={reportData}
                    onChatIntent={(intent, prompt) => {
                        router.push(`/?intent=${encodeURIComponent(intent)}&prompt=${encodeURIComponent(prompt)}`);
                    }}
                />
            </div>
        </main>
    );
}

export default function StartupStrategyReport() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#080811] flex items-center justify-center text-slate-400 text-sm">
                비즈니스 아키텍처 로딩 중...
            </div>
        }>
            <StartupReportContent />
        </Suspense>
    );
}
