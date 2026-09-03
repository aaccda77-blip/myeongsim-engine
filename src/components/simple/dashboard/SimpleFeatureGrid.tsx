'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Music, Briefcase, ChevronRight, Layers } from 'lucide-react';

interface SimpleFeatureGridProps {
    onOpenAllFeatures: () => void;
    onOpenReport: () => void;
}

export function SimpleFeatureGrid({ onOpenAllFeatures, onOpenReport }: SimpleFeatureGridProps) {
    const router = useRouter();

    const features = [
        {
            id: 'report',
            title: '나의 리포트',
            desc: '선천 기질 및 강점 분석',
            icon: <FileText size={18} className="text-[#FFAA00]" />,
            onClick: onOpenReport
        },
        {
            id: 'library',
            title: '명심코칭 도서관',
            desc: '《제로 포인트》 e-Book',
            icon: <BookOpen size={18} className="text-[#18C5D9]" />,
            onClick: () => router.push('/library')
        },
        {
            id: 'music',
            title: '코칭 에세이 & 노래',
            desc: '1:1 맞춤 432Hz 주파수',
            icon: <Music size={18} className="text-pink-400" />,
            onClick: () => router.push('/today')
        },
        {
            id: 'nts',
            title: '국세청 창업·N잡',
            desc: '표준 업태/종목 1:1 매핑',
            icon: <Briefcase size={18} className="text-emerald-400" />,
            onClick: () => router.push('/startup')
        }
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-left">
                <h3 className="text-xs font-bold text-[#9AA7B7] tracking-wider uppercase font-mono">
                    나의 공간
                </h3>
                <button
                    onClick={onOpenAllFeatures}
                    className="text-xs font-bold text-[#18C5D9] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                    <Layers size={13} />
                    <span>전체 기능 보기</span>
                    <ChevronRight size={13} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                {features.map((item) => (
                    <div
                        key={item.id}
                        onClick={item.onClick}
                        className="p-3.5 rounded-2xl bg-[#111C2F] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer active:scale-[0.98] text-left space-y-1.5 shadow-sm"
                    >
                        <div className="size-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#F4F6F8]">
                                {item.title}
                            </h4>
                            <p className="text-[10px] text-[#9AA7B7] truncate">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
