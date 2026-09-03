'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { SimpleButton } from '../design-system/SimpleButton';
import { SimpleBadge } from '../design-system/SimpleBadge';
import { ArrowRight, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';

interface SimpleReportSummaryProps {
    userName: string;
    summary: string;
    strengths: string[];
    cautions: string[];
    recommendation: string;
    onViewFullReport: () => void;
}

export function SimpleReportSummary({
    userName,
    summary,
    strengths,
    cautions,
    recommendation,
    onViewFullReport
}: SimpleReportSummaryProps) {
    return (
        <SimpleCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-xs font-bold text-[#9AA7B7] uppercase tracking-wider font-mono">
                    나의 핵심 성향 요약
                </span>
                <SimpleBadge variant="cyan">CORE ANALYSIS</SimpleBadge>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-white/[0.05]">
                <p className="text-xs sm:text-sm font-bold text-[#F4F6F8] leading-relaxed">
                    “{summary}”
                </p>
            </div>

            {/* 강점 3개 */}
            <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>대표 강점 3가지</span>
                </span>
                <div className="grid grid-cols-1 gap-1">
                    {strengths.map((str, i) => (
                        <div key={i} className="p-2 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-gray-200">
                            {str}
                        </div>
                    ))}
                </div>
            </div>

            {/* 주의할 점 2개 */}
            <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>주의해야 할 점</span>
                </span>
                <div className="grid grid-cols-1 gap-1">
                    {cautions.map((cau, i) => (
                        <div key={i} className="p-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/20 text-xs text-gray-200">
                            • {cau}
                        </div>
                    ))}
                </div>
            </div>

            {/* 오늘의 제안 */}
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-400/20 text-left space-y-1">
                <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                    <Lightbulb size={12} />
                    <span>오늘의 제안</span>
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                    {recommendation}
                </p>
            </div>

            <SimpleButton
                onClick={onViewFullReport}
                variant="secondary"
                size="md"
                className="w-full justify-between"
            >
                <span>14단계 전체 분석 리포트 보기</span>
                <ArrowRight size={14} />
            </SimpleButton>
        </SimpleCard>
    );
}
