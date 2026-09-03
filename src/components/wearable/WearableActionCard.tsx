'use client';

import React, { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

interface WearableActionCardProps {
    title: string;
    description: string;
    onNext: () => void;
}

export function WearableActionCard({ title, description, onNext }: WearableActionCardProps) {
    const [isDone, setIsDone] = useState(false);

    const handleToggleDone = () => {
        setIsDone(!isDone);
    };

    return (
        <div className="flex flex-col items-center justify-between h-full py-4 px-3 text-center select-none">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                {title}
            </span>

            <div className="my-auto space-y-2.5 max-w-[230px]">
                <div className={`p-3.5 rounded-2xl border transition-all ${
                    isDone 
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200' 
                        : 'bg-[#111C2F] border-white/10 text-gray-200'
                }`}>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">
                        “{description}”
                    </p>
                </div>

                {isDone && (
                    <p className="text-[11px] font-bold text-emerald-300 animate-fade-in flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>오늘의 실천 완료! 🌱</span>
                    </p>
                )}
            </div>

            <div className="w-full max-w-[220px] space-y-1.5">
                <button
                    onClick={handleToggleDone}
                    className={`w-full py-2.5 px-3 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                        isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
                    }`}
                >
                    <Check size={13} strokeWidth={3} />
                    <span>{isDone ? '실천 완료됨' : '실천 완료하기'}</span>
                </button>
            </div>
        </div>
    );
}
