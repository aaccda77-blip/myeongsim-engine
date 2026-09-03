'use client';

import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface WearableStreakProps {
    days: number;
    weekStatus: boolean[];
    onNext: () => void;
}

export function WearableStreak({ days, weekStatus, onNext }: WearableStreakProps) {
    const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

    return (
        <div className="flex flex-col items-center justify-between h-full py-4 px-3 text-center select-none">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                연속 기록
            </span>

            <div className="my-auto space-y-3 w-full max-w-[230px]">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl">🌱</span>
                    <span className="text-3xl font-black text-white font-mono">
                        {days}일째
                    </span>
                </div>

                <p className="text-[11px] text-gray-400 font-medium">
                    매일 나를 돌아보는 소중한 루틴
                </p>

                {/* 이번 주 닷 인디케이터 */}
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between px-3.5">
                    {dayLabels.map((lbl, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-mono text-gray-400">{lbl}</span>
                            <div className={`size-3 rounded-full transition-all ${
                                weekStatus[i]
                                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                    : 'bg-white/10 border border-white/15'
                            }`} />
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full max-w-[220px] py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer border border-white/10"
            >
                <span>코칭 받기</span>
                <ArrowRight size={11} />
            </button>
        </div>
    );
}
