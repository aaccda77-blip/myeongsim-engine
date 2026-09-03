'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WearableFlowRingProps {
    score: number;
    stateTitle: string;
    levelLabel: string;
    onNext: () => void;
}

export function WearableFlowRing({ score, stateTitle, levelLabel, onNext }: WearableFlowRingProps) {
    return (
        <div className="flex flex-col items-center justify-between h-full py-4 px-3 text-center select-none">
            {/* 상단 라벨 */}
            <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    FLOW
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-mono">
                    {levelLabel}
                </span>
            </div>

            {/* 중앙 FLOW 점수 & 원형 아크 */}
            <div className="relative flex items-center justify-center size-32 my-auto">
                {/* SVG 미니 아크 링 */}
                <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-white/10 fill-none"
                        strokeWidth="6"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-amber-400 fill-none transition-all duration-700"
                        strokeWidth="6"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * Math.min(score, 100)) / 100}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-[#F4F6F8] font-mono tracking-tight">
                        {score}
                    </span>
                    <span className="text-[11px] font-bold text-cyan-300 -mt-1">
                        좋은 흐름
                    </span>
                </div>
            </div>

            {/* 상태 타이틀 */}
            <div className="space-y-2 w-full max-w-[220px]">
                <p className="text-xs sm:text-sm font-bold text-gray-200 leading-tight">
                    “{stateTitle}”
                </p>

                <button
                    onClick={onNext}
                    className="w-full py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                >
                    <span>오늘 보기</span>
                    <ArrowRight size={11} />
                </button>
            </div>
        </div>
    );
}
