/**
 * /components/bio-care/HangryCheck.tsx
 * 배고픔성 예민함(Hangry) 탐지 컴포넌트
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HangryResult {
    status: string;
    desc: string;
    action: string;
    color: string;
    emoji: string;
}

export default function HangryCheck() {
    const [lastMeal, setLastMeal] = useState<'short' | 'long' | null>(null);
    const [mood, setMood] = useState<'good' | 'irritated' | null>(null);
    const [showResult, setShowResult] = useState(false);

    const analyzeCondition = (): HangryResult | null => {
        if (mood === 'irritated' && lastMeal === 'long') {
            return {
                status: 'Hangry (배고픔성 예민)',
                desc: '뇌에 포도당이 부족해서 예민해진 상태입니다. 성격 문제가 아니에요!',
                action: '약간의 과일이나 견과류를 섭취해 혈당을 부드럽게 올려주세요.',
                color: 'from-red-500/20 to-orange-500/20 border-red-500/30',
                emoji: '🔋'
            };
        }
        if (mood === 'irritated' && lastMeal === 'short') {
            return {
                status: 'Stress (심리적 스트레스)',
                desc: '신체적 허기보다는 심리적 피로가 원인인 것 같습니다.',
                action: '테아닌 차를 마시거나 잠시 눈을 감고 심호흡을 하세요.',
                color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
                emoji: '🧠'
            };
        }
        if (mood === 'good' && lastMeal === 'long') {
            return {
                status: 'Good Energy (안정적)',
                desc: '공복이지만 기분이 좋다면 몸이 잘 적응하고 있는 상태입니다.',
                action: '다음 식사 전까지 수분을 충분히 섭취하세요.',
                color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
                emoji: '✨'
            };
        }
        if (mood === 'good' && lastMeal === 'short') {
            return {
                status: 'Optimal State (최적 상태)',
                desc: '식사도 했고 기분도 좋은 이상적인 상태입니다!',
                action: '이 컨디션을 유지하세요. 규칙적인 식사가 핵심입니다.',
                color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
                emoji: '🌟'
            };
        }
        return null;
    };

    const result = analyzeCondition();

    const handleReset = () => {
        setLastMeal(null);
        setMood(null);
        setShowResult(false);
    };

    const handleComplete = () => {
        if (lastMeal && mood) {
            setShowResult(true);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">psychology</span>
                마음-혈당 연결 로그
            </h3>
            <p className="text-gray-400 text-sm mb-6">
                짜증이 나는 이유가 성격이 아닐 수 있어요
            </p>

            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.div
                        key="questions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* 질문 1: 식사 시간 */}
                        <div>
                            <p className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">restaurant</span>
                                Q1. 마지막 식사는 언제였나요?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLastMeal('short')}
                                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${lastMeal === 'short'
                                            ? 'bg-[#658c42] border-[#658c42] text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    3시간 이내
                                </button>
                                <button
                                    onClick={() => setLastMeal('long')}
                                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${lastMeal === 'long'
                                            ? 'bg-[#658c42] border-[#658c42] text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    4시간 이상
                                </button>
                            </div>
                        </div>

                        {/* 질문 2: 기분 상태 */}
                        <div>
                            <p className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">mood</span>
                                Q2. 지금 기분은 어떤가요?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMood('good')}
                                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${mood === 'good'
                                            ? 'bg-[#658c42] border-[#658c42] text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    😊 평온함
                                </button>
                                <button
                                    onClick={() => setMood('irritated')}
                                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${mood === 'irritated'
                                            ? 'bg-[#658c42] border-[#658c42] text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    😤 짜증/불안
                                </button>
                            </div>
                        </div>

                        {/* 분석 버튼 */}
                        {lastMeal && mood && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleComplete}
                                className="w-full py-3 bg-[#658c42] hover:bg-[#7aa350] text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                            >
                                분석 결과 보기
                            </motion.button>
                        )}
                    </motion.div>
                ) : result ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-5 rounded-2xl bg-gradient-to-br ${result.color} border`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">{result.emoji}</span>
                            <div>
                                <h4 className="text-white font-bold text-lg">
                                    {result.status}
                                </h4>
                                <p className="text-gray-300 text-sm mt-1">
                                    {result.desc}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                            <p className="text-white text-sm font-bold mb-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                                추천 행동
                            </p>
                            <p className="text-gray-200 text-sm">
                                {result.action}
                            </p>
                        </div>

                        {/* 명언 (짜증 상태일 때만) */}
                        {mood === 'irritated' && (
                            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                                <p className="text-gray-300 text-xs italic leading-relaxed">
                                    💭 "화가 난 것이 아니라, 단지 에너지가 필요한 것뿐입니다.
                                    몸의 신호를 알아차리는 것이 자기 돌봄의 시작입니다."
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleReset}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                        >
                            다시 체크하기
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* 보건교육 안내 */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-200 text-xs leading-relaxed">
                    💡 <strong>보건교육사 Tip</strong><br />
                    삭센다 사용 중에는 식욕이 억제되어 배고픔을 느끼지 못할 수 있습니다.
                    하지만 뇌는 여전히 포도당이 필요하므로, 규칙적인 소량 식사가 중요합니다.
                </p>
            </div>
        </div>
    );
}
