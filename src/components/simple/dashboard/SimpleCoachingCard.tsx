'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { MessageSquare, ArrowRight, Sparkles, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimpleCoachingCardProps {
    question: string;
    actionText: string;
    prompt: string;
}

export function SimpleCoachingCard({
    question,
    actionText,
    prompt
}: SimpleCoachingCardProps) {
    const router = useRouter();

    const handleStartCoaching = () => {
        if (typeof window !== 'undefined' && prompt) {
            sessionStorage.setItem('myeongsim_pending_prompt', prompt);
        }
        router.push('/myeongsim-chat');
    };

    return (
        <SimpleCard className="space-y-4 bg-gradient-to-br from-[#141b2d] via-[#101726] to-[#0c121f] border border-amber-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* 은은한 배경 오로라 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-amber-400" />
                    <span>오늘의 1:1 심층 자각 질문</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-1">
                    <Bot size={11} />
                    <span>AI COACH</span>
                </span>
            </div>

            {/* 질문 본문 */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] relative">
                <p className="text-sm sm:text-base font-black text-white leading-relaxed tracking-tight break-keep">
                    “{question}”
                </p>
            </div>

            {/* 액션 버튼 */}
            <button
                type="button"
                onClick={handleStartCoaching}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] group"
            >
                <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-slate-950" />
                    <span>{actionText}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono group-hover:translate-x-1 transition-transform">
                    <span>1:1 세션 입장</span>
                    <ArrowRight size={14} />
                </div>
            </button>
        </SimpleCard>
    );
}
