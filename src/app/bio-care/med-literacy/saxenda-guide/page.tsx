/**
 * /bio-care/med-literacy/saxenda-guide/page.tsx
 * 삭센다 담낭 건강 심화 가이드
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

const QUIZ: QuizOption[] = [
    {
        id: 'a',
        text: '완전 단식',
        isCorrect: false,
        feedback: '❌ 단식은 담낭이 수축할 기회를 빼앗아 담즙이 고이게 만듭니다.'
    },
    {
        id: 'b',
        text: '규칙적인 소량 식사',
        isCorrect: true,
        feedback: '✅ 정답! 소량이라도 규칙적으로 먹으면 담낭이 주기적으로 수축하여 담즙이 고이지 않습니다.'
    }
];

export default function SaxendaGuidePage() {
    const router = useRouter();
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswerSelect = (optionId: string) => {
        setSelectedAnswer(optionId);
        setShowFeedback(true);
    };

    const selectedOption = QUIZ.find(q => q.id === selectedAnswer);

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
                    삭센다 담낭 건강 가이드
                </h2>
            </header>

            <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                {/* Hero */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 text-center">
                    <span className="text-5xl mb-3 block">🩺</span>
                    <h1 className="text-white text-xl font-bold mb-2 font-serif">
                        삭센다와 담낭 건강
                    </h1>
                    <p className="text-blue-200 text-sm">
                        왜 '잘 먹는 것'이 중요할까요?
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        체중 감량을 위해 삭센다(Liraglutide)를 사용하다 보면, 식욕이 줄어 식사를 거르는 경우가 많습니다.
                        하지만 보건교육사의 관점에서 볼 때, <strong className="text-white">'무조건 안 먹는 것'</strong>은
                        담낭 건강에 예상치 못한 문제를 불러올 수 있습니다.
                    </p>
                </div>

                {/* Section 1: 기전 이해 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-400">science</span>
                        1. 담즙이 고이는 원리 (기전 이해)
                    </h3>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 space-y-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            담낭은 우리 몸의 <strong className="text-yellow-300">'담즙 주머니'</strong>입니다.
                            우리가 음식을 먹으면 담낭이 꽉 짜지면서 담즙을 내보내 소화를 돕습니다.
                        </p>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-red-300 text-sm mb-2">
                                ⚠️ <strong>문제 상황:</strong> 식사를 너무 적게 하거나 거르면 담낭이 수축할 기회를 잃습니다.
                            </p>
                            <p className="text-gray-300 text-sm">
                                <strong>결과:</strong> 고여 있는 담즙이 끈적해지면서 '담즙 슬러지(찌꺼기)'가 생기고,
                                이것이 뭉쳐 담석이 됩니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: 생활 습관 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-400">health_and_safety</span>
                        2. 담낭 건강을 지키는 3가지 생활 습관
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <h4 className="text-green-300 font-bold mb-2">✓ 규칙적 식사</h4>
                            <p className="text-gray-300 text-sm mb-2">
                                소량이라도 하루 3끼를 규칙적으로 섭취하세요.
                            </p>
                            <p className="text-green-200 text-xs">
                                💡 기대 효과: 담낭의 주기적인 수축 유도
                            </p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <h4 className="text-green-300 font-bold mb-2">✓ 착한 지방</h4>
                            <p className="text-gray-300 text-sm mb-2">
                                견과류, 올리브유 등 건강한 지방을 조금씩 곁들이세요.
                            </p>
                            <p className="text-green-200 text-xs">
                                💡 기대 효과: 담즙 배출 신호(CCK 호르몬) 자극
                            </p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                            <h4 className="text-green-300 font-bold mb-2">✓ 충분한 수분</h4>
                            <p className="text-gray-300 text-sm mb-2">
                                하루 2L 이상의 물을 마시는 습관을 들이세요.
                            </p>
                            <p className="text-green-200 text-xs">
                                💡 기대 효과: 담즙의 농도를 적절히 유지
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Quiz */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-400">quiz</span>
                        인터랙티브 퀴즈
                    </h3>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
                        <p className="text-white text-sm mb-4">
                            담낭을 움직이게 하는 가장 좋은 방법은?
                        </p>
                        <div className="space-y-2">
                            {QUIZ.map((option) => (
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

                {/* Section 3: 알아차림 노트 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-400">warning</span>
                        3. 알아차림 노트: 이럴 땐 전문가와 상의하세요!
                    </h3>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                        <p className="text-red-200 text-sm mb-3">
                            교육의 핵심은 <strong>'적절한 시기에 의료진을 찾는 능력'</strong>을 길러주는 것입니다.
                        </p>
                        <ul className="space-y-2">
                            <li className="text-red-200 text-sm flex items-start gap-2">
                                <span className="mt-1">⚠️</span>
                                오른쪽 윗배나 명치 부위의 갑작스러운 통증
                            </li>
                            <li className="text-red-200 text-sm flex items-start gap-2">
                                <span className="mt-1">⚠️</span>
                                기름진 음식을 먹은 후 심해지는 소화불량과 메스꺼움
                            </li>
                            <li className="text-red-200 text-sm flex items-start gap-2">
                                <span className="mt-1">⚠️</span>
                                이유 없는 발열이나 황달 증세
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Section 4: 전문 정보 */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">school</span>
                        4. 전문 정보 리터러시: UDCA의 역할
                    </h3>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            학술적으로 알려진 바에 따르면, <strong className="text-blue-300">UDCA 성분</strong>은
                            담즙의 흐름을 개선하고 콜레스테롤 담석 형성을 억제하는 데 도움을 줄 수 있습니다.
                            삭센다 사용 중 담낭 건강이 우려된다면, 본인의 건강 상태에 맞는 적절한 함량에 대해
                            의료진이나 약사와 상담해 보시는 것이 좋습니다.
                        </p>
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
