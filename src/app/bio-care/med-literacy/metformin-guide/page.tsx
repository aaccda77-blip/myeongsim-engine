/**
 * /bio-care/med-literacy/metformin-guide/page.tsx
 * 메트포르민 심화 가이드 - 비타민 B12 고갈 & 젖산산증
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

const B12_QUIZ: QuizOption[] = [
    {
        id: 'a',
        text: '복용 시작 직후부터 바로 나타난다',
        isCorrect: false,
        feedback: '❌ B12 고갈은 서서히 진행되어 보통 1~2년 후에 증상이 나타납니다.'
    },
    {
        id: 'b',
        text: '장기 복용 시 서서히 나타난다',
        isCorrect: true,
        feedback: '✅ 정답! 메트포르민은 장에서 B12 흡수를 방해하여 장기 복용 시 결핍이 발생할 수 있습니다.'
    }
];

export default function MetforminGuidePage() {
    const router = useRouter();
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswerSelect = (optionId: string) => {
        setSelectedAnswer(optionId);
        setShowFeedback(true);
    };

    const selectedOption = B12_QUIZ.find(q => q.id === selectedAnswer);

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
                    메트포르민 심화 가이드
                </h2>
            </header>

            <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                {/* Hero */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 rounded-2xl p-6 text-center">
                    <span className="text-5xl mb-3 block">💊</span>
                    <h1 className="text-white text-xl font-bold mb-2 font-serif">
                        메트포르민과 영양소 관리
                    </h1>
                    <p className="text-green-200 text-sm">
                        장기 복용 시 주의해야 할 영양소 고갈
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        메트포르민은 당뇨병 코칭의 1차 약물로 안전하고 효과적입니다.
                        하지만 <strong className="text-white">장기 복용 시 비타민 B12 흡수를 방해</strong>할 수 있어
                        주기적인 모니터링이 필요합니다.
                    </p>
                </div>

                {/* Section 1: 작용 기전 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400">science</span>
                        1. 메트포르민은 어떻게 작동할까?
                    </h3>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 space-y-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            메트포르민은 <strong className="text-green-300">간에서 당 생성을 줄이고</strong>,
                            근육이 당을 더 잘 사용하도록 돕습니다.
                            마치 몸의 '당 관리 시스템'을 개선하는 것과 같습니다.
                        </p>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-green-300 text-sm mb-2">
                                ✓ <strong>장점:</strong> 저혈당 위험이 낮고 체중 증가 없음
                            </p>
                            <p className="text-orange-300 text-sm">
                                ⚠️ <strong>주의점:</strong> 장기 복용 시 비타민 B12 흡수 방해
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: 비타민 B12 고갈 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-400">warning</span>
                        2. 비타민 B12 고갈: 왜 중요할까?
                    </h3>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 space-y-4">
                        <div className="bg-yellow-500/20 rounded-xl p-4">
                            <h4 className="text-yellow-300 font-bold mb-2">
                                🧬 B12의 역할
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    신경 세포 보호 (신경병증 예방)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    적혈구 생성 (빈혈 예방)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    DNA 합성 및 세포 분열
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-yellow-300 font-bold mb-3">B12 결핍 증상</h4>
                            <div className="space-y-2">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-yellow-200 text-sm font-bold mb-1">손발 저림 (말초신경병증)</p>
                                    <p className="text-gray-400 text-xs">당뇨 합병증과 구분 어려움</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-yellow-200 text-sm font-bold mb-1">극심한 피로감</p>
                                    <p className="text-gray-400 text-xs">빈혈로 인한 산소 공급 부족</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-yellow-200 text-sm font-bold mb-1">기억력 저하, 집중력 감소</p>
                                    <p className="text-gray-400 text-xs">신경 기능 저하</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: B12 관리 전략 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">health_and_safety</span>
                        3. B12 관리 3단계 전략
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">📅</span>
                                정기 검사
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">
                                메트포르민 1년 이상 복용 시 연 1회 B12 수치 검사
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 정상 범위: 200-900 pg/mL
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">🥩</span>
                                식이 보충
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">
                                B12 풍부 식품: 소고기, 달걀, 우유, 연어
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 채식주의자는 영양제 필수
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                                <span className="text-2xl">💊</span>
                                영양제 보충
                            </h4>
                            <p className="text-gray-300 text-sm mb-2">
                                결핍 시 1000mcg 고용량 보충 (의사 가이드)
                            </p>
                            <p className="text-blue-200 text-xs">
                                💡 설하정(혀 밑)이 흡수율 높음
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
                            메트포르민 복용 시 B12 결핍은 언제 나타날까요?
                        </p>
                        <div className="space-y-2">
                            {B12_QUIZ.map((option) => (
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

                {/* Section 4: 젖산산증 (희귀하지만 치명적) */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-400">emergency</span>
                        4. 젖산산증: 희귀하지만 치명적
                    </h3>
                    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-4">
                        <div className="bg-red-500/20 rounded-xl p-4">
                            <h4 className="text-red-300 font-bold mb-2">
                                ⚠️ 젖산산증이란?
                            </h4>
                            <p className="text-red-200 text-sm leading-relaxed">
                                혈액 내 젖산(lactic acid)이 과도하게 축적되어 혈액이 산성화되는 응급 상황입니다.
                                메트포르민 복용 중 <strong>신장 기능 저하 시</strong> 발생 위험이 높아집니다.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-red-300 font-bold mb-3">즉시 응급실 방문이 필요한 증상</h4>
                            <ul className="space-y-2">
                                <li className="text-red-200 text-sm flex items-start gap-2 bg-red-500/10 rounded-lg p-3">
                                    <span className="text-red-400 mt-1 text-xl">🚨</span>
                                    <div>
                                        <strong>심한 근육통 + 극심한 피로</strong>
                                        <p className="text-xs text-red-300 mt-1">젖산 축적으로 인한 근육 손상</p>
                                    </div>
                                </li>
                                <li className="text-red-200 text-sm flex items-start gap-2 bg-red-500/10 rounded-lg p-3">
                                    <span className="text-red-400 mt-1 text-xl">🚨</span>
                                    <div>
                                        <strong>호흡곤란 + 빠른 호흡</strong>
                                        <p className="text-xs text-red-300 mt-1">산증을 보상하려는 신체 반응</p>
                                    </div>
                                </li>
                                <li className="text-red-200 text-sm flex items-start gap-2 bg-red-500/10 rounded-lg p-3">
                                    <span className="text-red-400 mt-1 text-xl">🚨</span>
                                    <div>
                                        <strong>복통 + 구토 + 의식 저하</strong>
                                        <p className="text-xs text-red-300 mt-1">생명을 위협하는 응급 상황</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-red-500/30 rounded-xl p-4 border-2 border-red-500">
                            <p className="text-red-100 text-sm font-bold text-center">
                                ☎️ 위 증상 발생 시 즉시 119 또는 응급실 방문<br />
                                "메트포르민 복용 중"이라고 반드시 알리세요!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 5: 예방 수칙 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400">shield</span>
                        5. 안전한 복용을 위한 수칙
                    </h3>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                        <ul className="space-y-3">
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">식사와 함께 복용</strong>
                                    <p className="text-xs text-gray-400 mt-1">위장 부작용 감소</p>
                                </div>
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">알코올 섭취 제한</strong>
                                    <p className="text-xs text-gray-400 mt-1">젖산산증 위험 증가</p>
                                </div>
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">정기 신장 기능 검사</strong>
                                    <p className="text-xs text-gray-400 mt-1">연 1~2회 크레아티닌 수치 확인</p>
                                </div>
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">✓</span>
                                <div>
                                    <strong className="text-white">수술/검사 전 약물 중단</strong>
                                    <p className="text-xs text-gray-400 mt-1">조영제 사용 시 48시간 전후 중단</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

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
