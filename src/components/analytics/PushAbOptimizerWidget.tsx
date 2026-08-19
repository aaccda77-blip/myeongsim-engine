'use client';

import React, { useState } from 'react';
import { evaluatePushABTest, EvaluationResult } from '@/lib/abtest/evaluator';
import { Trophy, ShieldCheck, Zap, ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, AlertOctagon, RotateCcw } from 'lucide-react';

export default function PushAbOptimizerWidget() {
    // Control vs Variant State
    const [controlSent, setControlSent] = useState<number>(2400);
    const [controlOpened, setControlOpened] = useState<number>(720); // 30.0%
    const [controlUnsub, setControlUnsub] = useState<number>(12);   // 0.5%

    const [variantSent, setVariantSent] = useState<number>(2450);
    const [variantOpened, setVariantOpened] = useState<number>(955); // 39.0%
    const [variantUnsub, setVariantUnsub] = useState<number>(14);   // 0.57%

    const [daysRunning, setDaysRunning] = useState<number>(8);
    const [isAutoPromoted, setIsAutoPromoted] = useState<boolean>(true);

    // Calculate Z-test & Guardrails
    const result: EvaluationResult = evaluatePushABTest(
        { id: 'CONTROL', name: '기본형 (Control)', sent: controlSent, opened: controlOpened, unsubscribed: controlUnsub },
        { id: 'VARIANT_B', name: '자비형 (무자책 휴식 문구)', sent: variantSent, opened: variantOpened, unsubscribed: variantUnsub },
        { minSampleSizePerArm: 2000, minRunDays: 7, currentRunDays: daysRunning, alpha: 0.05, guardrailUnsubThreshold: 1.3 }
    );

    const controlRate = controlSent > 0 ? ((controlOpened / controlSent) * 100).toFixed(1) : '0';
    const variantRate = variantSent > 0 ? ((variantOpened / variantSent) * 100).toFixed(1) : '0';

    return (
        <div className="w-full rounded-3xl bg-[#090d16] border-2 border-indigo-500/40 p-5 sm:p-7 space-y-5 text-white font-sans text-left shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                            <span>양측 Z-검정 기반 A/B 최적화 & 100% 자동 채택 엔진</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-400/30">
                                p &lt; 0.05 AUTO-PROMOTION
                            </span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                            3대 가드레일(SRM, 최소 7일, 수신거부율) 검증 후 승자 문구에 100% 트래픽을 자동 배정합니다.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                        result.status === 'WINNER_PROMOTED'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : result.status === 'SRM_ERROR'
                            ? 'bg-red-950/70 text-red-300 border-red-500/50'
                            : result.status === 'LOSER_ROLLED_BACK'
                            ? 'bg-rose-950/70 text-rose-300 border-rose-500/50'
                            : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    }`}>
                        {result.status === 'WINNER_PROMOTED' && (
                            <>
                                <Trophy className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                                <span>승자 자동 채택 (p={result.pValue})</span>
                            </>
                        )}
                        {result.status === 'RUNNING' && (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                                <span>실험 진행 중 (RUNNING)</span>
                            </>
                        )}
                        {result.status === 'SRM_ERROR' && (
                            <>
                                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                                <span>SRM 왜곡 감지 (중단)</span>
                            </>
                        )}
                        {result.status === 'LOSER_ROLLED_BACK' && (
                            <>
                                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                                <span>안전 롤백 (이탈 급증)</span>
                            </>
                        )}
                        {result.status === 'INCONCLUSIVE' && (
                            <>
                                <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
                                <span>14일 무승부 종료 (기본 유지)</span>
                            </>
                        )}
                    </span>
                </div>
            </div>

            {/* 3 Guardrails Status Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    daysRunning >= 7
                        ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/80 border-amber-500/40 text-amber-300'
                }`}>
                    <span>1. 요일 편향 방지</span>
                    <span className="font-bold">{daysRunning}/7일 {daysRunning >= 7 ? '✅' : '⏳'}</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    controlSent >= 2000 && variantSent >= 2000
                        ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/80 border-amber-500/40 text-amber-300'
                }`}>
                    <span>2. 최소 표본수 (2천건)</span>
                    <span className="font-bold">{Math.min(controlSent, variantSent)}/2,000 {Math.min(controlSent, variantSent) >= 2000 ? '✅' : '⏳'}</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    result.status !== 'SRM_ERROR'
                        ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/80 border-red-500/40 text-red-300'
                }`}>
                    <span>3. SRM 50:50 분할</span>
                    <span className="font-bold">{result.status !== 'SRM_ERROR' ? '정상 (p>0.001) ✅' : 'SRM 경보 🚨'}</span>
                </div>
            </div>

            {/* Control vs Variant Simulation Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Control Box */}
                <div className="p-4.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-300">대조군 A (Control)</span>
                        <span className="text-xs font-mono font-black text-gray-400">{controlRate}%</span>
                    </div>
                    <p className="text-[11px] text-gray-400 italic">
                        "오늘 1순위 과제를 마무리하고 편안하게 쉬세요."
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                            <span className="text-[10px] text-gray-500 block">발송 수</span>
                            <input
                                type="number"
                                value={controlSent}
                                onChange={(e) => setControlSent(parseInt(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-500 block">오픈 수</span>
                            <input
                                type="number"
                                value={controlOpened}
                                onChange={(e) => setControlOpened(parseInt(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Variant B Box */}
                <div className="p-4.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300">실험군 B (무자책 자비 템플릿)</span>
                        <span className="text-xs font-mono font-black text-indigo-300">
                            {variantRate}% (+{result.upliftPercent > 0 ? result.upliftPercent : 0}%)
                        </span>
                    </div>
                    <p className="text-[11px] text-indigo-200/80 italic">
                        "세상을 구하지 않아도 괜찮았던 하루, 온전한 쉼에 드세요."
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                            <span className="text-[10px] text-gray-500 block">발송 수</span>
                            <input
                                type="number"
                                value={variantSent}
                                onChange={(e) => setVariantSent(parseInt(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-500 block">오픈 수</span>
                            <input
                                type="number"
                                value={variantOpened}
                                onChange={(e) => setVariantOpened(parseInt(e.target.value) || 0)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Engine Result Banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                    <div className="text-gray-400 font-mono">
                        <strong>통계 진단: </strong>
                        <span className="text-gray-200">{result.reason}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">
                        Z-Score: <strong>{result.zScore}</strong> | p-value: <strong>{result.pValue}</strong> (임계값 α = 0.05)
                    </div>
                </div>

                {result.status === 'WINNER_PROMOTED' && (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>트래픽 100% 자동 채택 완료</span>
                    </div>
                )}
            </div>
        </div>
    );
}
