'use client';

import dynamic from 'next/dynamic';

// [Optimization] Heavy component loaded on demand
const SoulArchiveReport = dynamic(
    () => import('@/components/report/SoulArchiveReport'),
    {
        loading: () => (
            <div className="min-h-screen bg-[#0B0915] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-purple-400 text-sm animate-pulse">영혼의 설계도를 해독하는 중...</p>
                    <p className="text-gray-600 text-xs mt-2">80페이지 소울 아카이브 로딩 중</p>
                </div>
            </div>
        ),
        ssr: false
    }
);

export default function SoulArchivePage() {
    return <SoulArchiveReport />;
}
