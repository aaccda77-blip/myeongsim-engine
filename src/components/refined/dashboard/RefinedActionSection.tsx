'use client';

import React, { useState } from 'react';
import { RefinedSurface } from '../design-system/RefinedSurface';
import { RefinedButton } from '../design-system/RefinedButton';
import { CheckCircle2, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RefinedActionSectionProps {
    actionTitle: string;
    actionDesc: string;
    coachingQuestion: string;
}

export function RefinedActionSection({ actionTitle, actionDesc, coachingQuestion }: RefinedActionSectionProps) {
    const router = useRouter();
    const [isActionDone, setIsActionDone] = useState(false);

    return (
        <RefinedSurface className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs font-bold text-[#9AA7B7] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>오늘의 실천 제안</span>
                </span>
                {isActionDone && (
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 animate-fade-in">
                        <CheckCircle2 size={12} />
                        <span>실천 완료!</span>
                    </span>
                )}
            </div>

            {/* 실천 행동 카드 */}
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#0e1726] border border-white/[0.05]">
                <div className="space-y-1 text-left flex-1">
                    <h3 className="text-xs font-bold text-amber-300 font-mono">
                        {actionTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                        “{actionDesc}”
                    </p>
                </div>
                <button
                    onClick={() => setIsActionDone(!isActionDone)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isActionDone
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/10'
                    }`}
                >
                    {isActionDone ? '완료됨' : '완료하기'}
                </button>
            </div>

            {/* 코칭 질문 및 시작 버튼 */}
            <div className="space-y-2.5 pt-1">
                <div className="text-left space-y-1">
                    <span className="text-[11px] text-[#9AA7B7] flex items-center gap-1">
                        <MessageSquare size={11} className="text-cyan-400" />
                        <span>오늘의 1:1 코칭 화두</span>
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#F4F6F8] leading-snug">
                        “{coachingQuestion}”
                    </p>
                </div>

                <RefinedButton
                    onClick={() => router.push('/myeongsim-chat')}
                    variant="primary"
                    className="h-12 text-xs sm:text-sm justify-between px-5"
                >
                    <span>1:1 AI 코칭 시작하기</span>
                    <ArrowRight size={15} />
                </RefinedButton>
            </div>
        </RefinedSurface>
    );
}
