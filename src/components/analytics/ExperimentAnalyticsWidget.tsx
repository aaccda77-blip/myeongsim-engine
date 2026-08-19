'use client';

import React, { useState } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ReferenceLine
} from 'recharts';
import { calculateThompsonWeights, BanditArm } from '@/lib/mab/thompsonSampling';
import { Sparkles, Trophy, Activity, GitBranch, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';

interface ExperimentDataPoint {
    day: string;
    pValue: number;
    zScore: number;
    controlSample: number;
    variantSample: number;
    alphaThreshold: number; // 항상 0.05 기준선
}

const EXPERIMENT_TIMELINE: ExperimentDataPoint[] = [
    { day: 'Day 1', pValue: 0.6201, zScore: 0.495, controlSample: 120, variantSample: 115, alphaThreshold: 0.05 },
    { day: 'Day 2', pValue: 0.412, zScore: 0.821, controlSample: 340, variantSample: 350, alphaThreshold: 0.05 },
    { day: 'Day 3', pValue: 0.284, zScore: 1.072, controlSample: 710, variantSample: 690, alphaThreshold: 0.05 },
    { day: 'Day 4', pValue: 0.185, zScore: 1.326, controlSample: 1050, variantSample: 1080, alphaThreshold: 0.05 },
    { day: 'Day 5', pValue: 0.092, zScore: 1.684, controlSample: 1420, variantSample: 1450, alphaThreshold: 0.05 },
    { day: 'Day 6', pValue: 0.0482, zScore: 1.975, controlSample: 1800, variantSample: 1820, alphaThreshold: 0.05 }, // 🚨 최초 유의성 돌파 (p < 0.05)
    { day: 'Day 7', pValue: 0.0215, zScore: 2.298, controlSample: 2150, variantSample: 2190, alphaThreshold: 0.05 },
    { day: 'Day 8', pValue: 0.012, zScore: 2.512, controlSample: 2500, variantSample: 2540, alphaThreshold: 0.05 },
    { day: 'Day 9', pValue: 0.0068, zScore: 2.71, controlSample: 2890, variantSample: 2920, alphaThreshold: 0.05 },
    { day: 'Day 10', pValue: 0.0034, zScore: 2.94, controlSample: 3250, variantSample: 3310, alphaThreshold: 0.05 } // 🏆 승자 확정 안정권
];

export default function ExperimentAnalyticsWidget() {
    const [activeTab, setActiveTab] = useState<'pvalue' | 'zscore' | 'samples'>('pvalue');
    const [isPromoted, setIsPromoted] = useState<boolean>(true);

    // MAB Thompson Sampling state
    const [banditArms, setBanditArms] = useState<BanditArm[]>([
        { id: 'CONTROL', title: '기본형 (Control)', body: '1순위 과제를 마무리하고...', alpha: 186 + 3, beta: 434 + 7 },
        { id: 'VARIANT_B', title: '자비형 (Variant B)', body: '세상을 구하지 않아도...', alpha: 248 + 3, beta: 392 + 7 }
    ]);

    const allocated = calculateThompsonWeights(banditArms);
    const weightA = Math.round((allocated[0]?.trafficWeight || 0.5) * 100);
    const weightB = Math.round((allocated[1]?.trafficWeight || 0.5) * 100);

    return (
        <div className="w-full bg-[#080c14] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl font-sans text-left space-y-6">
            {/* Top Banner: Experiment Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                            Bayesian MAB & Convergence Active
                        </span>
                        <span className="text-xs text-slate-400 font-mono">EXP-2026-NIGHTLY-PUSH-B</span>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                        <span>통계적 유의성(p-value) 수렴 곡선 & MAB 톰슨 샘플링</span>
                    </h3>
                </div>

                {/* Status Badge & Action */}
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-right">
                        <div className="text-[10px] text-purple-400 font-semibold uppercase">판정 상태</div>
                        <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                            🏆 승자 확정 (Variant B 우세)
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsPromoted(!isPromoted);
                            alert(
                                isPromoted
                                    ? 'MAB 가변 트래픽 모드로 복귀했습니다.'
                                    : '🏆 승자(Variant B) 트래픽 100% 단일 배포가 가동되었습니다.'
                            );
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isPromoted
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        {isPromoted ? '승자 트래픽 100% 반영 중' : '수동 100% 승격 실행'}
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                    <div className="text-[11px] text-slate-400 mb-1">누적 표본 수 (N)</div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">6,560건</div>
                    <div className="text-[10px] text-teal-400 mt-0.5">목표 표본의 82% 달성</div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                    <div className="text-[11px] text-slate-400 mb-1">현재 Z-Score</div>
                    <div className="text-xl sm:text-2xl font-bold text-teal-300 font-mono">2.940</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">임계치 &gt; 1.96 확보</div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                    <div className="text-[11px] text-slate-400 mb-1">현재 p-value</div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-300 font-mono">0.0034</div>
                    <div className="text-[10px] text-purple-400 mt-0.5">p &lt; 0.05 (유의성 입증)</div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                    <div className="text-[11px] text-slate-400 mb-1">오픈율 개선율 (Uplift)</div>
                    <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono">+14.2%</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Control 대비 우수</div>
                </div>
            </div>

            {/* MAB Thompson Sampling Dynamic Traffic Bar */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-950 to-[#0c1220] border border-indigo-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">베이지안 톰슨 샘플링 실시간 트래픽 자동 배분율 (MAB)</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                        10,000회 몬테카를로 시뮬레이션 기반
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                        style={{ width: `${weightA}%` }}
                        className="bg-slate-500 transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
                        title="Control 트래픽"
                    />
                    <div
                        style={{ width: `${weightB}%` }}
                        className="bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white shadow-lg"
                        title="Variant B 트래픽"
                    />
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                        <span>대조군 A (Control): <strong>{weightA}%</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-teal-300 font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500" />
                        <span>실험군 B (자비형 문구): <strong>{weightB}%</strong> (우세 가중치)</span>
                    </div>
                </div>
            </div>

            {/* Chart Sub Tabs */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('pvalue')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === 'pvalue'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        p-value 수렴 곡선
                    </button>
                    <button
                        onClick={() => setActiveTab('zscore')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === 'zscore'
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Z-Score 추이
                    </button>
                    <button
                        onClick={() => setActiveTab('samples')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === 'samples'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        표본 누적량
                    </button>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                    기준선 α = 0.05 (신뢰수준 95%)
                </div>
            </div>

            {/* Main Recharts Area */}
            <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'pvalue' ? (
                        <ComposedChart data={EXPERIMENT_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis domain={[0, 0.7]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0d1527',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '0.75rem'
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} />
                            <ReferenceLine
                                y={0.05}
                                label={{ value: '유의수준 임계치 (α=0.05)', fill: '#ef4444', fontSize: 10, position: 'top' }}
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                            />
                            <Line
                                type="monotone"
                                dataKey="pValue"
                                name="p-value 추이"
                                stroke="#c084fc"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#c084fc' }}
                            />
                        </ComposedChart>
                    ) : activeTab === 'zscore' ? (
                        <ComposedChart data={EXPERIMENT_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis domain={[0, 3.5]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0d1527',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '0.75rem'
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} />
                            <ReferenceLine
                                y={1.96}
                                label={{ value: 'Z=1.96 임계선', fill: '#14b8a6', fontSize: 10, position: 'top' }}
                                stroke="#14b8a6"
                                strokeDasharray="4 4"
                            />
                            <Line
                                type="monotone"
                                dataKey="zScore"
                                name="Z-Score 추이"
                                stroke="#2dd4bf"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#2dd4bf' }}
                            />
                        </ComposedChart>
                    ) : (
                        <ComposedChart data={EXPERIMENT_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0d1527',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '0.75rem'
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} />
                            <Area
                                type="monotone"
                                dataKey="controlSample"
                                name="Control 표본"
                                fill="#64748b"
                                stroke="#64748b"
                                fillOpacity={0.2}
                            />
                            <Area
                                type="monotone"
                                dataKey="variantSample"
                                name="Variant 표본"
                                fill="#6366f1"
                                stroke="#6366f1"
                                fillOpacity={0.2}
                            />
                        </ComposedChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
