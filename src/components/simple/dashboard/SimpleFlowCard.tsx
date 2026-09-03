'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { SimpleBadge } from '../design-system/SimpleBadge';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimpleFlowCardProps {
    score: number;
    stateTitle: string;
    shortDesc: string;
    advice: string;
    levelLabel: string;
}

export function SimpleFlowCard({
    score,
    stateTitle,
    shortDesc,
    advice,
    levelLabel
}: SimpleFlowCardProps) {
    const router = useRouter();

    return (
        <SimpleCard highlight={true} className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#9AA7B7] tracking-wider uppercase font-mono">
                        오늘의 FLOW
                    </span>
                    <SimpleBadge variant="amber">{levelLabel}</SimpleBadge>
                </div>
                <span className="text-xl font-black text-[#FFAA00] font-mono">
                    FLOW {score}
                </span>
            </div>

            <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#F4F6F8] leading-snug">
                    “{stateTitle}”
                </h3>
                <p className="text-xs sm:text-sm text-[#9AA7B7] leading-relaxed">
                    {shortDesc}
                </p>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                    💡 {advice}
                </span>
                <button
                    onClick={() => router.push('/neural-diagnosis')}
                    className="text-xs font-bold text-[#18C5D9] hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
                >
                    <span>자세히 보기</span>
                    <ChevronRight size={13} />
                </button>
            </div>
        </SimpleCard>
    );
}
