/**
 * /bio-care/med-literacy/jardiance-guide/page.tsx
 * 자디앙 심화 가이드 - 수분 관리 & 케톤산증 조기 발견
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
}

const KETOACIDOSIS_QUIZ: QuizOption[] = [
    {
        id: 'a',
        text: '혈당이 높을 때만 발생한다',
        isCorrect: false,
        feedback: '❌ 자디앙 복용 시 혈당이 정상이어도 케톤산증이 발생할 수 있습니다. (정상 혈당 케톤산증)'
    },
    {
        id: 'b',
        text: '혈당이 정상이어도 발생할 수 있다',
        isCorrect: true,
        feedback: '✅ 정답! SGLT-2 억제제는 "정상 혈당 케톤산증"을 일으킬 수 있어 더욱 주의가 필요합니다.'
    }
];

export default function JardianceGuidePage() {
    const router = useRouter();
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswerSelect = (optionId: string) => {
        setSelectedAnswer(optionId);
        setShowFeedback(true);
    };

    const selectedOption = KETOACIDOSIS_QUIZ.find(q => q.id === selectedAnswer);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.back()}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    자디앙 심화 가이드
                </h2>
            </header>

            <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                {/* Hero */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-6 text-center">
                    <span className="text-5xl mb-3 block">💧</span>
                    <h1 className="text-white text-xl font-bold mb-2 font-serif">
                        자디앙과 수분 관리
                    </h1>
                    <p className="text-cyan-200 text-sm">
                        왜 물을 많이 마셔야 할까요?
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        자디앙(엠파글리플로진)은 SGLT-2 억제제로, 신장에서 당을 소변으로 배출하는 약물입니다.
                        하지만 <strong className="text-white">당과 함께 수분도 빠져나가기 때문에</strong>
                        탈수 위험이 높아집니다.
                    </p>
                </div>

                {/* Section 1: 작용 기전 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-cyan-400">science</span>
                        1. 자디앙은 어떻게 작동할까?
                    </h3>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            신장은 혈액을 걸러 소변을 만들 때, 당을 다시 흡수하여 혈액으로 되돌립니다.
                            자디앙은 이 <strong className="text-cyan-300">'재흡수 통로(SGLT-2)'</strong>를 막아
                            당을 소변으로 배출합니다.
                        </p>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-cyan-300 text-sm mb-2">
                                ✓ <strong>장점:</strong> 혈당을 효과적으로 낮춤
                            </p>
                            <p className="text-orange-300 text-sm">
                                ⚠️ <strong>주의점:</strong> 당과 함께 수분도 배출되어 탈수 위험 증가
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: 수분 관리 전략 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">water_drop</span>
                        2. 수분 관리 3대 전략
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">💧</span>
                                하루 2L 이상 물 섭취
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">
                                커피나 차가 아닌 순수한 물로 섭취하세요.
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 팁: 500ml 물병 4개 분량으로 생각하면 쉬워요
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">🎨</span>
                                소변 색깔 체크
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">
                                연한 노란색 = 적정 수분<br />
                                진한 노란색 = 수분 부족
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 팁: 아침 첫 소변은 진해도 정상입니다
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                전해질 균형 유지
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">
                                나트륨, 칼륨이 함께 빠져나가므로 전해질 음료 병행
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 팁: 운동 후나 땀을 많이 흘렸을 때 특히 중요
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 3: 케톤산증 조기 발견 (핵심!) */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-400">emergency</span>
                        3. 케톤산증 조기 발견법 (생명 안전)
                    </h3>
                    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-4">
                        <div className="bg-red-500/20 rounded-xl p-4">
                            <h4 className="text-red-300 font-bold mb-2">
                                ⚠️ 정상 혈당 케톤산증이란?
                            </h4>
                            <p className="text-red-200 text-sm leading-relaxed">
                                SGLT-2 억제제 복용 시 <strong>혈당이 정상이어도</strong> 케톤산증이 발생할 수 있습니다.
                                이는 일반적인 케톤산증보다 발견이 늦어져 더 위험합니다.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-red-300 font-bold mb-3">즉시 병원 방문이 필요한 증상</h4>
                            <ul className="space-y-2">
                                <li className="text-red-200 text-sm flex items-start gap-2 bg-red-500/10 rounded-lg p-3">
                                    <span className="text-red-400 mt-1 text-xl">🚨</span>
                                    <div>
                                        <strong>메스꺼움 + 구토</strong>
                                        <p className="text-xs text-red-300 mt-1">특히 식사를 못할 정도로 심한 경우</p>
                                    </div>
                                </li>
                                <li className="text-red-200 text-sm flex items-start gap-2 bg-red-500/10 rounded-lg p-3">
                                    <span className="text-red-400 mt-1 text-xl">🚨</span>
                                    <div>
                                        <strong>복통 + 빠른 호흡</strong>
                                        <p className="text-xs text-red-300 mt-1">숨이 가빠지고 배가 아픈 증상</p>
                                    </div>
                                </li>
                                <li className="text-red-200 text-sm flex items-start gap-2 bg-red-500/10 rounded-lg p-3">
                                    <span className="text-red-400 mt-1 text-xl">🚨</span>
                                    <div>
                                        <strong>극심한 피로감 + 의식 혼미</strong>
                                        <p className="text-xs text-red-300 mt-1">평소와 다르게 심하게 졸리거나 멍한 상태</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-red-500/30 rounded-xl p-4 border-2 border-red-500">
                            <p className="text-red-100 text-sm font-bold text-center">
                                ☎️ 위 증상 발생 시 즉시 119 또는 응급실 방문<br />
                                "자디앙 복용 중"이라고 반드시 알리세요!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Quiz */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-400">quiz</span>
                        이해도 체크 퀴즈
                    </h3>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
                        <p className="text-white text-sm mb-4">
                            자디앙 복용 시 케톤산증은 언제 발생할까요?
                        </p>
                        <div className="space-y-2">
                            {KETOACIDOSIS_QUIZ.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswerSelect(option.id)}
                                    disabled={showFeedback}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${selectedAnswer === option.id
                                            ? option.isCorrect
                                                ? 'bg-green-500/20 border-2 border-green-500'
                                                : 'bg-red-500/20 border-2 border-red-500'
                                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
                                >
                                    <span className="text-white text-sm">{option.text}</span>
                                </button>
                            ))}
                        </div>

                        {showFeedback && selectedOption && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 p-4 rounded-xl ${selectedOption.isCorrect
                                        ? 'bg-green-500/20 border border-green-500/30'
                                        : 'bg-red-500/20 border border-red-500/30'
                                    }`}
                            >
                                <p className={`text-sm ${selectedOption.isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                                    {selectedOption.feedback}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Section 4: 예방 수칙 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400">shield</span>
                        4. 케톤산증 예방 수칙
                    </h3>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                        <ul className="space-y-3">
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">저탄수화물 식단 주의</strong>
                                    <p className="text-xs text-gray-400 mt-1">극단적 저탄수화물은 케톤 생성 증가</p>
                                </div>
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">수술/검사 전 약물 중단</strong>
                                    <p className="text-xs text-gray-400 mt-1">의사에게 자디앙 복용 사실 알리기</p>
                                </div>
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">충분한 수분 섭취</strong>
                                    <p className="text-xs text-gray-400 mt-1">탈수는 케톤산증 위험 증가</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 수분 트래커 링크 */}
                <button
                    onClick={() => router.push('/bio-care/med-literacy/jardiance-hydration')}
                    className="w-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-5 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-cyan-400">water_drop</span>
                                수분 섭취 트래커 사용하기
                            </h4>
                            <p className="text-gray-400 text-sm">
                                매일 목표 달성하고 탈수 예방하세요
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-cyan-400">arrow_forward</span>
                    </div>
                </button>

                {/* 의료법 준수 안내 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-purple-200 text-xs leading-relaxed">
                        📚 <strong>보건교육 목적 콘텐츠</strong><br />
                        본 가이드는 일반적인 건강 증진 정보 제공을 목적으로 하며, 개인별 의학적 분석이나 코칭 계획을 대신할 수 없습니다.
                        구체적인 건강 문제는 반드시 의사, 약사 등 의료 전문가와 상담하세요.
                    </p>
                </div>
            </main>
        </div>
    );
}
