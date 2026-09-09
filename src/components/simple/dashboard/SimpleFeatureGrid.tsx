'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Music, Briefcase, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';

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
            desc: '선천 기질 및 14대 강점',
            tag: 'CORE',
            cardBg: 'from-amber-950/20 via-[#101b2e] to-[#0c1524]',
            border: 'border-amber-400/20 hover:border-amber-400/50',
            iconBg: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
            icon: <FileText size={18} />,
            onClick: onOpenReport
        },
        {
            id: 'library',
            title: '명심코칭 도서관',
            desc: '《제로 포인트》 e-Book',
            tag: 'BOOK',
            cardBg: 'from-cyan-950/20 via-[#101b2e] to-[#0c1524]',
            border: 'border-cyan-400/20 hover:border-cyan-400/50',
            iconBg: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
            icon: <BookOpen size={18} />,
            onClick: () => router.push('/library')
        },
        {
            id: 'music',
            title: '코칭 에세이 & 노래',
            desc: '1:1 맞춤 432Hz 치유 음원',
            tag: 'AUDIO',
            cardBg: 'from-pink-950/20 via-[#101b2e] to-[#0c1524]',
            border: 'border-pink-400/20 hover:border-pink-400/50',
            iconBg: 'bg-pink-400/10 text-pink-400 border-pink-400/30',
            icon: <Music size={18} />,
            onClick: () => router.push('/today')
        },
        {
            id: 'nts',
            title: '국세청 창업·N잡',
            desc: '표준 업태/종목 1:1 매핑',
            tag: 'BIZ',
            cardBg: 'from-emerald-950/20 via-[#101b2e] to-[#0c1524]',
            border: 'border-emerald-400/20 hover:border-emerald-400/50',
            iconBg: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
            icon: <Briefcase size={18} />,
            onClick: () => router.push('/startup')
        }
    ];

    return (
        <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-left">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1.5">
                    <span>나의 공간</span>
                    <span className="text-[10px] text-amber-400/80 font-bold font-mono">QUICK ACCESS</span>
                </h3>
                <button
                    type="button"
                    onClick={onOpenAllFeatures}
                    className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer transition-colors group"
                >
                    <Layers size={13} className="text-cyan-400" />
                    <span>전체 기능 보기</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                {features.map((item) => (
                    <div
                        key={item.id}
                        onClick={item.onClick}
                        className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.cardBg} border ${item.border} transition-all cursor-pointer active:scale-[0.98] text-left space-y-2 shadow-md relative overflow-hidden group`}
                    >
                        <div className="flex items-center justify-between">
                            <div className={`size-8 rounded-xl border flex items-center justify-center ${item.iconBg} shadow-sm`}>
                                {item.icon}
                            </div>
                            <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 group-hover:border-white/20">
                                {item.tag}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-white group-hover:text-amber-200 transition-colors flex items-center justify-between">
                                <span>{item.title}</span>
                                <ArrowUpRight size={12} className="text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                            </h4>
                            <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
