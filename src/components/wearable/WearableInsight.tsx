'use client';

import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface WearableInsightProps {
    pointDesc: string;
    keywords: string[];
    onNext: () => void;
}

export function WearableInsight({ pointDesc, keywords, onNext }: WearableInsightProps) {
    return (
        <div className="flex flex-col items-center justify-between h-full py-4 px-3 text-center select-none">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                오늘의 핵심
            </span>

            <div className="my-auto space-y-3 max-w-[230px]">
                <p className="text-sm sm:text-base font-bold text-[#F4F6F8] leading-snug">
                    “{pointDesc}”
                </p>

                {/* 3대 키워드 */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {keywords.map((kw, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-medium"
                        >
                            {kw}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full max-w-[220px] py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border border-white/10"
            >
                <span>행동 보기</span>
                <ArrowRight size={11} />
            </button>
        </div>
    );
}
