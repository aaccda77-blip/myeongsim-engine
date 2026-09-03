'use client';

import React from 'react';
import { Smartphone, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WearableQuickCoachProps {
    question: string;
    options: string[];
    onSwitchToMobile: () => void;
}

export function WearableQuickCoach({ question, options, onSwitchToMobile }: WearableQuickCoachProps) {
    const router = useRouter();

    const handleSelectOption = (opt: string) => {
        router.push(`/myeongsim-chat?topic=${encodeURIComponent(opt)}`);
    };

    return (
        <div className="flex flex-col items-center justify-between h-full py-4 px-3 text-center select-none">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                오늘의 코칭
            </span>

            <div className="my-auto space-y-2.5 w-full max-w-[230px]">
                <p className="text-xs sm:text-sm font-bold text-[#F4F6F8]">
                    “{question}”
                </p>

                {/* 빠른 4지선다 선택 */}
                <div className="grid grid-cols-2 gap-1.5">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleSelectOption(opt)}
                            className="py-2 px-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-gray-200 transition-all cursor-pointer active:scale-95"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onSwitchToMobile}
                className="w-full max-w-[220px] py-2 px-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
            >
                <Smartphone size={12} />
                <span>휴대폰에서 계속하기</span>
            </button>
        </div>
    );
}
