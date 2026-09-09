'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { Sparkles, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

interface SimpleInsightCardProps {
    pointTitle: string;
    pointDesc: string;
    keywords: string[];
    dailyGanji: string;
    doAction?: string;
    avoidAction?: string;
}

export function SimpleInsightCard({
    pointTitle,
    pointDesc,
    keywords,
    dailyGanji,
    doAction,
    avoidAction
}: SimpleInsightCardProps) {
    return (
        <SimpleCard className="space-y-3.5 bg-gradient-to-br from-[#121e33] via-[#0f1827] to-[#0c1422] border border-cyan-500/25 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            {/* 상단 헤더 & 키워드 칩 */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <Compass size={14} className="text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300">
                        {pointTitle} <span className="font-mono text-gray-400 font-normal">({dailyGanji})</span>
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {keywords.map((kw, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-500/20"
                        >
                            {kw}
                        </span>
                    ))}
                </div>
            </div>

            {/* 핵심 해설 텍스트 박스 */}
            <div className="p-3.5 rounded-2xl bg-[#090f1a]/80 border border-white/[0.07] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500" />
                <p className="text-xs sm:text-sm font-medium text-gray-200 leading-relaxed pl-1.5 break-keep">
                    “{pointDesc}”
                </p>
            </div>

            {/* 오늘의 3초 행동 강령 (DO & AVOID) */}
            {(doAction || avoidAction) && (
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    {doAction && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25 flex items-start gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <span className="text-[10px] font-black text-emerald-400 font-mono tracking-wider block">DO</span>
                                <p className="text-[11px] font-bold text-emerald-100 truncate">{doAction}</p>
                            </div>
                        </div>
                    )}
                    {avoidAction && (
                        <div className="p-2.5 rounded-xl bg-rose-950/25 border border-rose-500/25 flex items-start gap-1.5">
                            <AlertTriangle size={13} className="text-rose-400 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                                <span className="text-[10px] font-black text-rose-400 font-mono tracking-wider block">AVOID</span>
                                <p className="text-[11px] font-bold text-rose-100 truncate">{avoidAction}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </SimpleCard>
    );
}
