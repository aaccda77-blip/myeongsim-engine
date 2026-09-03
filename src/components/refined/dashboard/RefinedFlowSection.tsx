'use client';

import React from 'react';
import { RefinedSurface } from '../design-system/RefinedSurface';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RefinedFlowSectionProps {
    score: number;
    stateTitle: string;
    shortDesc: string;
    levelLabel: string;
}

export function RefinedFlowSection({ score, stateTitle, shortDesc, levelLabel }: RefinedFlowSectionProps) {
    const router = useRouter();

    return (
        <RefinedSurface elevated={true} className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#9AA7B7] uppercase tracking-wider font-mono">
                        오늘의 FLOW 상태
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                        {levelLabel}
                    </span>
                </div>
                <button
                    onClick={() => router.push('/neural-diagnosis')}
                    className="text-xs font-bold text-[#18C5D9] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                    <span>3D 정밀 진단</span>
                    <ChevronRight size={13} />
                </button>
            </div>

            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 text-left flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-[#F4F6F8] leading-snug">
                        “{stateTitle}”
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9AA7B7] leading-relaxed">
                        {shortDesc}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center size-20 rounded-2xl bg-[#0e1624] border border-amber-400/20 shrink-0">
                    <span className="text-3xl font-black text-[#FFAA00] font-mono leading-none">
                        {score}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono mt-1">
                        / 100
                    </span>
                </div>
            </div>

            {/* 3대 의식 미니 프로그레스 */}
            <div className="pt-2 grid grid-cols-3 gap-2 border-t border-white/[0.06]">
                <div className="p-2 rounded-xl bg-white/[0.03] text-left">
                    <span className="text-[10px] text-gray-400 font-mono block">집중력</span>
                    <span className="text-xs font-bold text-white font-mono">85% 안정</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] text-left">
                    <span className="text-[10px] text-gray-400 font-mono block">회복 탄력성</span>
                    <span className="text-xs font-bold text-cyan-300 font-mono">88% 원활</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] text-left">
                    <span className="text-[10px] text-gray-400 font-mono block">인지 유연성</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">82% 확장</span>
                </div>
            </div>
        </RefinedSurface>
    );
}
