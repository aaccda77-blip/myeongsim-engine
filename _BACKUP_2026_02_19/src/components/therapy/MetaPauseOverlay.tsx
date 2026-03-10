"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomMetaQuestion } from '@/data/TherapyDB';

interface MetaPauseOverlayProps {
    isVisible: boolean;
    onComplete: () => void;
    customQuestion?: string;
    duration?: number; // 밀리초 단위, 기본 5000ms
}

/**
 * The Pause (멈춤의 미학)
 * 
 * 사용자가 Neural Code 처방을 완료한 후 표시되는
 * Meta-Awareness 경험 오버레이
 * 
 * "알아차림의 알아차림"을 통해 관찰자 시점으로 이동시킴
 */
export default function MetaPauseOverlay({
    isVisible,
    onComplete,
    customQuestion,
    duration = 6000
}: MetaPauseOverlayProps) {
    const [phase, setPhase] = useState<'question' | 'silence' | 'answer'>('question');
    const question = customQuestion || getRandomMetaQuestion();

    useEffect(() => {
        if (!isVisible) {
            setPhase('question');
            return;
        }

        // Phase 1: 질문 (2초)
        const timer1 = setTimeout(() => setPhase('silence'), 2000);

        // Phase 2: 침묵 (3초)
        const timer2 = setTimeout(() => setPhase('answer'), 5000);

        // Phase 3: 답변 후 완료 (6초)
        const timer3 = setTimeout(() => onComplete(), duration);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [isVisible, duration, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ backgroundColor: '#000' }}
                    onClick={onComplete}
                >
                    {/* 배경 그라데이션 */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)'
                        }}
                    />

                    <div className="relative max-w-md px-8 text-center">
                        {/* Phase 1: 질문 */}
                        <AnimatePresence mode="wait">
                            {phase === 'question' && (
                                <motion.div
                                    key="question"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 1 }}
                                >
                                    <p className="text-white/80 text-lg leading-relaxed font-light">
                                        {question}
                                    </p>
                                </motion.div>
                            )}

                            {/* Phase 2: 침묵 */}
                            {phase === 'silence' && (
                                <motion.div
                                    key="silence"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* 호흡 원 */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="w-20 h-20 rounded-full border border-purple-500/50"
                                        style={{
                                            boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)'
                                        }}
                                    />
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        className="text-white/40 text-sm mt-6"
                                    >
                                        ...
                                    </motion.p>
                                </motion.div>
                            )}

                            {/* Phase 3: 답변 */}
                            {phase === 'answer' && (
                                <motion.div
                                    key="answer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="space-y-4"
                                >
                                    <motion.p
                                        className="text-purple-400 text-xl font-bold"
                                        animate={{
                                            textShadow: [
                                                '0 0 10px rgba(139, 92, 246, 0.5)',
                                                '0 0 30px rgba(139, 92, 246, 0.8)',
                                                '0 0 10px rgba(139, 92, 246, 0.5)'
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        그 고요한 자리가
                                    </motion.p>
                                    <p className="text-white text-2xl font-black">
                                        바로 당신의 본래 모습입니다
                                    </p>
                                    <p className="text-white/40 text-xs mt-6">
                                        화면을 터치하면 돌아갑니다
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
