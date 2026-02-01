/**
 * LevelAssessmentModal.tsx
 * 사용자의 건강 지식 수준을 측정하는 5문항 퀴즈 모달
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_ASSESSMENT_QUIZ, calculateLevel, LEVEL_DESCRIPTIONS, type DifficultyLevel } from '@/data/LevelAssessmentQuiz';

interface Props {
    onComplete: (level: DifficultyLevel) => void;
    onClose: () => void;
}

export default function LevelAssessmentModal({ onComplete, onClose }: Props) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [finalLevel, setFinalLevel] = useState<DifficultyLevel>('beginner');

    const handleAnswer = (points: number) => {
        const newTotal = totalPoints + points;
        setTotalPoints(newTotal);

        if (currentQuestion < LEVEL_ASSESSMENT_QUIZ.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // 마지막 질문 → 결과 표시
            const level = calculateLevel(newTotal);
            setFinalLevel(level);
            setShowResult(true);
        }
    };

    const handleFinish = () => {
        onComplete(finalLevel);
        onClose();
    };

    const progress = ((currentQuestion + 1) / LEVEL_ASSESSMENT_QUIZ.length) * 100;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg bg-[#1f2937] rounded-3xl p-8 shadow-2xl border border-gray-800"
            >
                {!showResult ? (
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-white text-2xl font-bold mb-2 font-serif">
                                🎯 나의 건강 지식 레벨은?
                            </h2>
                            <p className="text-gray-400 text-sm">
                                5가지 질문으로 당신에게 맞는 난이도를 찾아드려요
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>{currentQuestion + 1} / {LEVEL_ASSESSMENT_QUIZ.length}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#658c42]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-white text-lg font-medium mb-6 leading-relaxed">
                                    {LEVEL_ASSESSMENT_QUIZ[currentQuestion].question}
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {LEVEL_ASSESSMENT_QUIZ[currentQuestion].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswer(option.points)}
                                            className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#658c42] rounded-xl transition-all text-white"
                                        >
                                            {option.text}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </>
                ) : (
                    /* Result Screen */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="text-6xl mb-4">
                            {LEVEL_DESCRIPTIONS[finalLevel].emoji}
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2 font-serif">
                            {LEVEL_DESCRIPTIONS[finalLevel].label} 레벨
                        </h2>
                        <p className="text-gray-400 mb-6">
                            {LEVEL_DESCRIPTIONS[finalLevel].detail}
                        </p>

                        <div className="bg-[#658c42]/10 border border-[#658c42]/30 rounded-2xl p-6 mb-8">
                            <p className="text-[#658c42] text-sm leading-relaxed">
                                앞으로 <strong>{LEVEL_DESCRIPTIONS[finalLevel].description}</strong>으로 건강 지식을 제공해드릴게요!
                            </p>
                        </div>

                        <button
                            onClick={handleFinish}
                            className="w-full py-4 bg-[#658c42] text-white font-bold rounded-xl hover:bg-[#547a35] transition-colors"
                        >
                            시작하기
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
