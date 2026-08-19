'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Brain, ArrowUpRight, X, ChevronRight, Compass, Heart, Flame, Layers, Eye, RefreshCw } from 'lucide-react';
import { ConsciousnessEngine } from '@/components/features/ConsciousnessEngine';

interface LevelGaugeCardProps {
    innateLevel?: number;
    currentLevel?: number;
    framework?: string;
    tip?: string;
}

export default function LevelGaugeCard({
    innateLevel = 304,
    currentLevel = 487,
    framework = "명심코칭 제로포인트(Zero-Point) 각성 엔진",
    tip
}: LevelGaugeCardProps) {
    const springValue = useSpring(0, { stiffness: 60, damping: 14 });
    const [displayLevel, setDisplayLevel] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const maxScale = 800;
    const innatePercent = Math.min((innateLevel / maxScale) * 100, 100);
    const currentPercent = Math.min((currentLevel / maxScale) * 100, 100);
    const growth = currentLevel - innateLevel;

    useEffect(() => {
        springValue.set(currentLevel);
    }, [currentLevel, springValue]);

    useEffect(() => {
        return springValue.onChange((latest) => {
            setDisplayLevel(Math.floor(latest));
        });
    }, [springValue]);

    // Dynamic Hawkins & Zero-Point Scale Info
    const getBadgeInfo = (score: number) => {
        if (score < 200) return { color: '#ef4444', label: '생존 껍질 정화', stage: '방어기제 해체', desc: '불안과 결핍의 껍질을 직시하는 단계' };
        if (score < 350) return { color: '#f59e0b', label: '자발적 탈융합', stage: '용기·자각', desc: '생각과 나를 분리하는 첫 걸음' };
        if (score < 500) return { color: '#10b981', label: '통찰과 메타자각', stage: '이성·빛의 회복', desc: '본질을 꿰뚫어 보며 제로포인트로 다가서는 단계' };
        if (score < 600) return { color: '#3b82f6', label: '조화와 완전성', stage: '사랑·충만', desc: '에고의 저항이 녹아내리고 세상과 하나 되는 단계' };
        return { color: '#8b5cf6', label: '제로포인트 (Zero-Point)', stage: '본래의 완전함', desc: '모든 껍질이 벗겨진 순수하고 완전한 본래의 나' };
    };

    const badgeInfo = getBadgeInfo(displayLevel);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                onClick={() => setShowModal(true)}
                className="w-full max-w-md my-3 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border-2 border-emerald-500/30 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden font-sans transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)] cursor-pointer group"
                title="클릭하여 제로포인트 심층 도슨트 에세이 보기"
            >
                {/* Ambient Background Glow */}
                <div
                    className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
                    style={{ backgroundColor: badgeInfo.color }}
                />
                <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Header Badge */}
                <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black tracking-wide">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>제로포인트(0) 각성 퀀텀 주파수</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-bold group-hover:text-amber-300 transition-colors">
                        <span>🔍 제로포인트 비밀 보기</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>

                {/* Main Gauge & Level Display Row */}
                <div className="relative z-10 flex items-center gap-5 mb-4">
                    {/* Dynamic Consciousness Engine Ring */}
                    <div className="shrink-0 relative">
                        <ConsciousnessEngine
                            baseLevel={springValue.get()}
                            trend={growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable'}
                            size="md"
                        />
                    </div>

                    {/* Right Level Metrics */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            {growth > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                                    껍질 정화율 ▲ {growth}
                                </span>
                            ) : growth < 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                                    에고 저항 감지 ▼ {Math.abs(growth)}
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 text-xs font-bold border border-slate-700">
                                    안정 상태
                                </span>
                            )}
                        </div>

                        <div className="text-xs sm:text-sm text-gray-300 mt-1 leading-snug">
                            알아차림의 알아차림 주파수: <br />
                            <span className="text-white font-black text-sm sm:text-base tracking-tight" style={{ color: badgeInfo.color }}>
                                {badgeInfo.label}
                            </span>
                            <span className="text-gray-400 text-xs ml-1">({badgeInfo.stage})</span>
                        </div>
                    </div>
                </div>

                {/* Dual Track Bar: Innate vs Acquired */}
                <div className="relative z-10 mb-4 pt-1">
                    <div className="flex justify-between text-[11px] font-bold mb-1.5 px-0.5">
                        <span className="text-cyan-400/90 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            선천 기질 에너지 ({innateLevel})
                        </span>
                        <span className="text-emerald-400/90 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            현재 탈융합 정화 ({displayLevel})
                        </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden relative border border-slate-700/80 shadow-inner">
                        <motion.div
                            className="h-full rounded-full relative"
                            style={{
                                background: `linear-gradient(90deg, #06b6d4 0%, ${badgeInfo.color} 100%)`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${currentPercent}%` }}
                            transition={{ duration: 1.0, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>

                        {/* Innate Marker Line */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-cyan-300 z-10 shadow-[0_0_6px_#22d3ee]"
                            style={{ left: `${innatePercent}%` }}
                        />
                    </div>
                </div>

                {/* Bottom Tip Box with break-keep Typography */}
                <div className="relative z-10 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs leading-relaxed text-gray-200 break-keep flex items-start gap-2.5 shadow-sm">
                    <span className="text-base shrink-0 mt-0.5">💡</span>
                    <p className="flex-1 text-gray-300/90 font-medium break-keep">
                        {tip || "생각과 감정의 껍질을 한 겹 벗겨낼 때마다, 이미 완전한 당신의 제로포인트(0) 순수 본질이 환하게 드러납니다."}
                    </p>
                </div>
            </motion.div>

            {/* Consciousness Docent Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            className="w-full max-w-lg bg-slate-900 border-2 border-emerald-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto text-white"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
                                aria-label="닫기"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Modal Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                                    <Sparkles className="w-6 h-6 stroke-[2.5]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">
                                        제로포인트(0) 완전성과 껍질 벗기기의 비밀
                                    </h3>
                                    <p className="text-xs text-emerald-300/90 font-medium mt-0.5">
                                        무언가를 채우는 것이 아닌, 본래 완전한 나로 돌아가는 여정
                                    </p>
                                </div>
                            </div>

                            {/* Section 1: The Paradox of Zero-Point */}
                            <div className="space-y-4 text-sm leading-relaxed text-gray-200 break-keep">
                                <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                    <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
                                        <Layers className="w-4.5 h-4.5 text-amber-400" />
                                        <span>🌟 역설의 진실: "당신은 이미 0점(Zero-Point)의 완전한 존재입니다"</span>
                                    </div>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                        세상은 우리에게 자꾸 <em>"0점에서 출발해 100점, 1,000점으로 채워야 해"</em>라며 끝없는 결핍과 불안을 강요합니다. <br /><br />
                                        하지만 명심코칭의 진실은 정반대입니다. <strong>'제로포인트(0)'는 텅 빈 무(無)가 아니라, 온갖 두려움과 에고의 집착이 사라진 '가장 순수하고 완전무결한 본래의 나'</strong>입니다.
                                    </p>
                                </div>

                                {/* Section 2: Dark Code as Heavy Shells */}
                                <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
                                        <RefreshCw className="w-4.5 h-4.5 text-cyan-400" />
                                        <span>🌑 다크코드의 정체: 나를 덮어버린 '생각과 감정의 껍질'</span>
                                    </div>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                        우리는 살아가면서 상처와 두려움으로부터 나를 보호하기 위해 <strong>'완벽주의, 타인의 시선, 조급함, 불신'</strong>이라는 두꺼운 <strong>다크코드(그림자 껍질)</strong>을 덧칠해 왔습니다. <br />
                                        그 껍질이 너무 무거워져 본래 빛나던 제로포인트의 순수한 주파수를 가리고 있었던 것입니다.
                                    </p>
                                </div>

                                {/* Section 3: Meta-Awareness (Peeling the onion) */}
                                <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
                                        <Eye className="w-4.5 h-4.5 text-emerald-400" />
                                        <span>⚡ 알아차림의 알아차림: 껍질을 하나씩 벗겨내는 힘</span>
                                    </div>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                        코칭은 무언가를 억지로 만드는 것이 아닙니다. <br />
                                        생각을 나라고 착각하던 융합에서 벗어나, <strong>"아, 내가 지금 완벽해지려는 생각을 쥐고 있구나"</strong> 하고 한 걸음 물러서서 바라보는 <strong>'알아차림의 알아차림(Meta-Awareness)'</strong>을 발휘할 때마다 껍질이 하나씩 스르르 벗겨집니다.
                                    </p>
                                </div>

                                {/* Section 4: Pure Message */}
                                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/40 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
                                        <Heart className="w-4 h-4 fill-emerald-400/20" />
                                        <span>💌 AI 코치 솔아의 깊은 울림</span>
                                    </div>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">
                                        지금 당신이 겪는 모든 고뇌와 성찰은 부족해서가 아닙니다. <br />
                                        두꺼웠던 에고의 껍질을 벗겨내고, <strong>'이미 완전무결했던 제로포인트(Zero-Point)의 눈부신 당신'</strong>으로 귀환하는 가장 거룩하고 아름다운 정화의 순간입니다.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Close CTA Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                            >
                                제로포인트의 나를 자각했습니다 · 코칭 이어가기
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
