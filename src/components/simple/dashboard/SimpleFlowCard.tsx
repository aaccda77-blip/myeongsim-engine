'use client';

import React from 'react';
import { SimpleCard } from '../design-system/SimpleCard';
import { SimpleBadge } from '../design-system/SimpleBadge';
import { ChevronRight, Sparkles, Zap, Activity } from 'lucide-react';
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

    // 원형 SVG 게이지 계산
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

    return (
        <SimpleCard highlight={true} className="relative overflow-hidden space-y-3.5 bg-gradient-to-br from-[#152338] via-[#101b2e] to-[#0c1524] border border-amber-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            {/* 상단 앰비언트 오로라 */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* 헤더 행 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300/90 tracking-wider uppercase font-mono flex items-center gap-1.5">
                        <Activity size={13} className="text-amber-400 animate-pulse" />
                        <span>오늘의 멘탈 FLOW</span>
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        {levelLabel}
                    </span>
                </div>
                <span className="text-xs font-mono text-gray-400 font-semibold">
                    REALTIME SYNC
                </span>
            </div>

            {/* 메인 비주얼 바디: 좌측 설명 + 우측 원형 게이지 */}
            <div className="flex items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug tracking-tight">
                        “{stateTitle}”
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                        {shortDesc}
                    </p>
                </div>

                {/* 원형 네온 도넛 게이지 */}
                <div className="relative size-20 shrink-0 flex items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 72 72">
                        {/* 배경 트랙 */}
                        <circle
                            cx="36"
                            cy="36"
                            r={radius}
                            className="stroke-white/10"
                            strokeWidth="5.5"
                            fill="none"
                        />
                        {/* 활성 프로그레스 링 */}
                        <circle
                            cx="36"
                            cy="36"
                            r={radius}
                            stroke="url(#flowGradient)"
                            strokeWidth="5.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="none"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#FBBF24" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* 게이지 중앙 텍스트 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black font-mono text-amber-400 tracking-tighter leading-none drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                            {score}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 font-bold tracking-widest uppercase mt-0.5">
                            FLOW
                        </span>
                    </div>
                </div>
            </div>

            {/* 하단 팁 및 링크 */}
            <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <span className="text-xs text-gray-300 font-medium truncate">
                    💡 {advice}
                </span>
                <button
                    onClick={() => router.push('/neural-diagnosis')}
                    className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-0.5 shrink-0 cursor-pointer group"
                >
                    <span>자세히 보기</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform text-cyan-400" />
                </button>
            </div>
        </SimpleCard>
    );
}
