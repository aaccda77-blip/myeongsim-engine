'use client';

import React, { useState } from 'react';
import { Sparkles, Clock, Brain, CheckCircle2, Circle, Flame, ChevronRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ActionPlanItem {
    day: string;
    time?: string;
    action: string;
    duration: string;
    benefit: string;
}

interface ActionPlanCardProps {
    plan: ActionPlanItem[];
}

export default function ActionPlanCard({ plan }: ActionPlanCardProps) {
    if (!plan || !Array.isArray(plan) || plan.length === 0) return null;

    const [completedDays, setCompletedDays] = useState<number[]>([]);

    const toggleComplete = (idx: number) => {
        if (completedDays.includes(idx)) {
            setCompletedDays(completedDays.filter(i => i !== idx));
        } else {
            const next = [...completedDays, idx];
            setCompletedDays(next);

            // Trigger Confetti Burst
            try {
                confetti({
                    particleCount: 70,
                    spread: 60,
                    origin: { y: 0.8 },
                    colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#FBBF24']
                });
            } catch (e) {
                // Ignore if canvas-confetti is not loaded
            }
        }
    };

    const progressPercent = Math.round((completedDays.length / plan.length) * 100);

    const getTimeBadge = (time?: string) => {
        if (!time) return { label: '아침', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        if (time.includes('아침') || time.includes('오전')) {
            return { label: time, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        }
        if (time.includes('점심') || time.includes('오후')) {
            return { label: time, bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
        }
        return { label: time, bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    };

    return (
        <div className="w-full my-4 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border-2 border-amber-400/40 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:border-amber-400/60 font-sans">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                        <Flame className="w-5 h-5 fill-slate-950 stroke-[2]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                                3일 신경망 재배선 실천 퀘스트
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase font-mono">
                                3-Day Quest
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            뇌의 무의식 저항을 줄이고 행동을 활성화하는 맞춤 루틴
                        </p>
                    </div>
                </div>

                {/* Progress Badge */}
                <div className="text-right">
                    <div className="text-xs font-bold text-amber-400 font-mono">
                        {completedDays.length} / {plan.length} 완료 ({progressPercent}%)
                    </div>
                    <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Plan List */}
            <div className="relative z-10 space-y-3 mt-4">
                {plan.map((item, idx) => {
                    const isDone = completedDays.includes(idx);
                    const timeBadge = getTimeBadge(item.time);

                    return (
                        <div
                            key={idx}
                            onClick={() => toggleComplete(idx)}
                            className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                isDone
                                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                    : 'bg-slate-800/60 hover:bg-slate-800/90 border-slate-700/80 hover:border-amber-400/40'
                            }`}
                        >
                            <div className="flex items-start gap-3.5">
                                {/* Checkbox Icon */}
                                <button
                                    type="button"
                                    className="mt-0.5 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0"
                                    aria-label="미션 완료 체크"
                                >
                                    {isDone ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-slate-500 group-hover:text-amber-400" />
                                    )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {/* Badges Row */}
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black">
                                            {item.day || `${idx + 1}일차`}
                                        </span>
                                        {item.time && (
                                            <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${timeBadge.bg}`}>
                                                {timeBadge.label}
                                            </span>
                                        )}
                                        {item.duration && (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
                                                <Clock className="w-3 h-3 text-amber-400" />
                                                {item.duration}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Text */}
                                    <p className={`text-sm font-bold leading-relaxed break-keep ${
                                        isDone ? 'text-gray-400 line-through' : 'text-white'
                                    }`}>
                                        {item.action}
                                    </p>

                                    {/* Benefit */}
                                    {item.benefit && (
                                        <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-amber-200/90 bg-amber-950/30 px-2.5 py-1 rounded-xl border border-amber-500/20">
                                            <Brain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span>{item.benefit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Motivation */}
            <div className="relative z-10 mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1.5 text-amber-300/80 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>완벽하지 않아도 괜찮습니다. 지금 작은 1가지를 실천해 보세요!</span>
                </div>
            </div>
        </div>
    );
}
