'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import {
    THINKING_FORMULAS,
    FAILPROOF_STRATEGIES,
    GROWTH_TACTICS,
    BUSINESS_TYPES,
    ThinkingFormula,
    FailproofStrategy
} from '@/data/StartupContentDB';
import { ChevronLeft, Rocket, Brain, Target, Users, TrendingUp } from 'lucide-react';

/**
 * StartupStrategyReport - 스타트업 창업 전략 리포트
 * 
 * 사용자의 강점/인적자원 분석 결과에 기반하여
 * 맞춤형 창업 전략과 사고 공식을 추천합니다.
 */

// 해시 기반 결정적 선택 함수 (SoulArchiveReport와 동일)
function getHashIndex(key: string, max: number, seed: number = 0): number {
    let hash = 0;
    const str = key + seed.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash) % max;
}

function getDeterministicSubset<T>(data: T[], key: string, count: number, seedOffset: number = 0): T[] {
    if (data.length === 0) return [];
    const result: T[] = [];
    const usedIndices = new Set<number>();
    let currentIndex = getHashIndex(key, data.length, seedOffset);

    while (result.length < count && result.length < data.length) {
        if (!usedIndices.has(currentIndex)) {
            result.push(data[currentIndex]);
            usedIndices.add(currentIndex);
        }
        currentIndex = (currentIndex + 7) % data.length;
    }

    return result;
}

export default function StartupStrategyReport() {
    const { reportData } = useReportStore();

    // 사용자 일주 키 계산
    const iljuKey = useMemo(() => {
        const dayPillar = (reportData?.saju?.fourPillars as any)?.day;
        const gan = dayPillar?.gan?.char || reportData?.saju?.dayMaster || '갑';
        const ji = typeof dayPillar?.ji === 'string' ? dayPillar.ji : (dayPillar?.ji?.char || '자');
        return `${gan}${ji}`;
    }, [reportData]);

    // 맞춤형 콘텐츠 선택
    const myFormulas = useMemo(() =>
        getDeterministicSubset(THINKING_FORMULAS, iljuKey, 3, 100),
        [iljuKey]);

    const myStrategies = useMemo(() =>
        getDeterministicSubset(FAILPROOF_STRATEGIES, iljuKey, 2, 200),
        [iljuKey]);

    const myTactics = useMemo(() =>
        getDeterministicSubset(GROWTH_TACTICS, iljuKey, 3, 300),
        [iljuKey]);

    // 비즈니스 유형 매칭 (일주 기반)
    const myBusinessType = useMemo(() => {
        const index = getHashIndex(iljuKey, BUSINESS_TYPES.length, 400);
        return BUSINESS_TYPES[index];
    }, [iljuKey]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0915] via-[#1a1025] to-[#0B0915] text-white">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 bg-[#0B0915]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-orange-400" />
                            스타트업 창업 전략
                        </h1>
                        <p className="text-xs text-gray-400">강점 기반 맞춤형 창업 가이드</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
                {/* 일주 기반 맞춤 안내 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-3xl border border-orange-500/20"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-3xl">
                            🚀
                        </div>
                        <div>
                            <p className="text-sm text-orange-300">당신의 일주: <span className="font-bold text-white">{iljuKey}</span></p>
                            <h2 className="text-2xl font-bold text-white">{myBusinessType?.title}</h2>
                        </div>
                    </div>
                    <p className="text-gray-300">{myBusinessType?.description}</p>
                </motion.div>

                {/* Section 1: 사고 공식 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-bold">🧠 당신을 위한 사고 공식</h2>
                    </div>

                    <div className="grid gap-4">
                        {myFormulas.map((formula: ThinkingFormula, i: number) => (
                            <div
                                key={formula.id}
                                className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-purple-300">{formula.name}</h3>
                                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-sm font-mono">
                                        {formula.formula_text}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-4">{formula.description}</p>
                                <div className="p-3 bg-black/30 rounded-xl">
                                    <p className="text-xs text-gray-400 uppercase mb-1">📋 적용 방법</p>
                                    <p className="text-sm text-gray-200 whitespace-pre-line">{formula.application_guide}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Section 2: 무실패 전략 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-xl font-bold">🎯 무실패 전략</h2>
                    </div>

                    <div className="grid gap-4">
                        {myStrategies.map((strategy: FailproofStrategy, i: number) => (
                            <div
                                key={strategy.id}
                                className="p-6 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-2xl border border-emerald-500/20"
                            >
                                <h3 className="text-xl font-bold text-emerald-300 mb-1">{strategy.name}</h3>
                                <p className="text-sm text-emerald-200/60 mb-3">{strategy.subtitle}</p>
                                <p className="text-gray-300 mb-4">{strategy.core_concept}</p>

                                <div className="p-4 bg-black/30 rounded-xl mb-4">
                                    <p className="text-xs text-emerald-400 font-bold mb-2">💡 왜 효과적인가?</p>
                                    <p className="text-sm text-gray-300">{strategy.why_it_works}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs text-gray-400 uppercase">실행 단계</p>
                                    {strategy.action_steps.map((step, j) => (
                                        <div key={j} className="flex items-start gap-3 p-2 bg-white/5 rounded-lg">
                                            <span className="w-6 h-6 bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center rounded-full font-bold">
                                                {j + 1}
                                            </span>
                                            <p className="text-sm text-gray-300 flex-1">{step}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-emerald-500/10">
                                    <p className="text-xs text-emerald-400">🏆 성공 지표: {strategy.success_metric}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Section 3: 성장 전술 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold">📈 성장 전술</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {myTactics.map((tactic, i) => (
                            <div
                                key={tactic.id}
                                className="p-4 bg-white/5 rounded-2xl border border-white/10"
                            >
                                <span className={`inline-block px-2 py-1 text-xs rounded mb-2 ${tactic.category === 'marketing' ? 'bg-pink-500/20 text-pink-300' :
                                        tactic.category === 'product' ? 'bg-blue-500/20 text-blue-300' :
                                            tactic.category === 'team' ? 'bg-green-500/20 text-green-300' :
                                                'bg-amber-500/20 text-amber-300'
                                    }`}>
                                    {tactic.category.toUpperCase()}
                                </span>
                                <h4 className="font-bold text-white mb-2">{tactic.name}</h4>
                                <p className="text-sm text-gray-400 mb-3">{tactic.description}</p>
                                <div className="space-y-1">
                                    {tactic.key_actions.slice(0, 2).map((action, j) => (
                                        <p key={j} className="text-xs text-gray-500">• {action}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl text-center"
                >
                    <h3 className="text-xl font-bold mb-2">🔥 나만의 창업 로드맵이 필요하신가요?</h3>
                    <p className="text-sm text-white/80 mb-4">
                        AI 코칭으로 더 구체적인 실행 계획을 세워보세요.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
                    >
                        💬 AI 코칭 시작하기
                    </button>
                </motion.div>
            </main>
        </div>
    );
}
