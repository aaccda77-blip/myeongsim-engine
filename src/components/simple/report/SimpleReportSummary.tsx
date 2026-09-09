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
        <SimpleCard className="space-y-4 bg-gradient-to-br from-[#121c2e] via-[#0e1624] to-[#090e18] border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span>나의 핵심 성향 요약</span>
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                    CORE ANALYSIS
                </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080d16] border border-white/[0.06] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-500" />
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed pl-1.5 break-keep">
                    “{summary}”
                </p>
            </div>

            {/* 강점 3개 */}
            <div className="space-y-2 text-left">
                <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>핵심 강점 3가지 (STRENGTHS)</span>
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                    {strengths.map((str, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-100 font-medium flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>{str}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 주의할 점 2개 */}
            <div className="space-y-2 text-left">
                <span className="text-[11px] font-black text-amber-400 flex items-center gap-1.5 font-mono">
                    <AlertCircle size={13} className="text-amber-400" />
                    <span>마인드 브레이크 주의점 (CAUTION)</span>
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                    {cautions.map((cau, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-100 font-medium flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{cau}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 오늘의 제안 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-400/20 text-left space-y-1.5">
                <span className="text-[11px] font-black text-indigo-300 flex items-center gap-1.5 font-mono">
                    <Lightbulb size={13} className="text-indigo-400" />
                    <span>오늘의 멘탈 솔루션</span>
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-medium break-keep">
                    {recommendation}
                </p>
            </div>

            <button
                type="button"
                onClick={onViewFullReport}
                className="w-full py-3.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] group"
            >
                <span>14단계 전체 정밀 리포트 열람</span>
                <ArrowRight size={14} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
        </SimpleCard>
    );
}
