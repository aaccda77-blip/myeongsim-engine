'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, BookOpen, Music, Briefcase, Activity, ChevronRight } from 'lucide-react';

interface RefinedFeatureGridProps {
    onOpenReport: () => void;
}

export function RefinedFeatureGrid({ onOpenReport }: RefinedFeatureGridProps) {
    const router = useRouter();

    const features = [
        {
            id: 'report',
            title: '나의 기질 리포트',
            desc: '14단계 입체 기질·성향 진단서',
            icon: <FileText size={18} className="text-[#FFAA00]" />,
            badge: '핵심',
            onClick: onOpenReport
        },
        {
            id: 'library',
            title: '명심코칭 디지털 도서관',
            desc: '도서 《제로 포인트》 e-Book 전문',
            icon: <BookOpen size={18} className="text-[#18C5D9]" />,
            badge: '신간',
            onClick: () => router.push('/library')
        },
        {
            id: 'today',
            title: '코칭 에세이 & 432Hz 힐링송',
            desc: '사주 기질 맞춤형 헌정 치유 음원',
            icon: <Music size={18} className="text-pink-400" />,
            badge: '데일리',
            onClick: () => router.push('/today')
        },
        {
            id: 'startup',
            title: '국세청 창업·N잡 매핑',
            desc: '홈택스 6자리 표준 업종 1:1 추천',
            icon: <Briefcase size={18} className="text-emerald-400" />,
            badge: '비즈니스',
            onClick: () => router.push('/startup')
        },
        {
            id: 'bio',
            title: '바이오-싱크 (생체 동기화)',
            desc: '실시간 심박·스트레스 조율 솔루션',
            icon: <Activity size={18} className="text-cyan-300" />,
            badge: '특허출원',
            onClick: () => router.push('/bio-care')
        }
    ];

    return (
        <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#9AA7B7] uppercase tracking-wider font-mono">
                    주요 솔루션 바로가기
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((item) => (
                    <div
                        key={item.id}
                        onClick={item.onClick}
                        className="p-4 rounded-2xl bg-[#101B2E] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                                {item.icon}
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-bold text-[#F4F6F8]">
                                        {item.title}
                                    </h4>
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/[0.06] text-gray-300 border border-white/10">
                                        {item.badge}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#9AA7B7]">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-500 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
