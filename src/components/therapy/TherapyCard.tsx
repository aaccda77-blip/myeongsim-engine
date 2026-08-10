"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TherapyArchetype } from '@/data/TherapyDB';
import MetaPauseOverlay from './MetaPauseOverlay';

interface TherapyCardProps {
    archetype: TherapyArchetype;
    isOpen: boolean;
    onClose: () => void;
    onChatIntent?: (intent: string, prompt: string) => void;
}

// 코칭 유형별 색상
const THERAPY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'CBT': { bg: 'rgba(59, 130, 246, 0.1)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)' },
    'DBT': { bg: 'rgba(239, 68, 68, 0.1)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
    'ACT': { bg: 'rgba(16, 185, 129, 0.1)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' },
    'MBCT': { bg: 'rgba(139, 92, 246, 0.1)', text: '#A78BFA', border: 'rgba(139, 92, 246, 0.3)' }
};

const THERAPY_LABELS: Record<string, string> = {
    'CBT': '인지행동코칭',
    'DBT': '변증법적 행동코칭',
    'ACT': '수용전념코칭',
    'MBCT': '마음챙김 인지코칭'
};

/**
 * 코칭 아키타입 카드
 * 
 * DarkCode → NeuralCode → MetaCode 순서로 표시
 * 닫을 때 "The Pause" 경험 제공
 */
export default function TherapyCard({ archetype, isOpen, onClose, onChatIntent }: TherapyCardProps) {
    const [showPause, setShowPause] = useState(false);
    const [step, setStep] = useState<'dark' | 'neural' | 'meta'>('dark');

    const colors = THERAPY_COLORS[archetype.therapy_type];

    const handleClose = () => {
        // 닫기 전 The Pause 경험 제공
        setShowPause(true);
    };

    const handlePauseComplete = () => {
        setShowPause(false);
        setStep('dark');
        onClose();
    };

    const handleNextStep = () => {
        if (step === 'dark') setStep('neural');
        else if (step === 'neural') setStep('meta');
        else handleClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* The Pause Overlay */}
            <MetaPauseOverlay
                isVisible={showPause}
                onComplete={handlePauseComplete}
                customQuestion={archetype.meta_code.awareness_question}
            />

            {/* Main Card */}
            <AnimatePresence>
                {!showPause && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[1001] max-h-[85vh] overflow-y-auto"
                            style={{
                                background: 'linear-gradient(to bottom, #1a1d24, #0f1115)',
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                                borderTop: `1px solid ${colors.border}`
                            }}
                        >
                            {/* Handle Bar */}
                            <div className="flex justify-center pt-3">
                                <div className="w-12 h-1 bg-white/20 rounded-full" />
                            </div>

                            <div className="p-6 pb-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div
                                            className="inline-block px-2 py-1 rounded-full text-xs font-bold mb-2"
                                            style={{
                                                backgroundColor: colors.bg,
                                                color: colors.text,
                                                border: `1px solid ${colors.border}`
                                            }}
                                        >
                                            {THERAPY_LABELS[archetype.therapy_type]}
                                        </div>
                                        <h2 className="text-2xl font-black text-white">
                                            {archetype.name_ko}
                                        </h2>
                                        <p className="text-gray-500 text-sm">
                                            {archetype.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Step Progress */}
                                <div className="flex gap-2 mb-6">
                                    {['dark', 'neural', 'meta'].map((s, i) => (
                                        <div
                                            key={s}
                                            className={`h-1 flex-1 rounded-full transition-colors ${(s === 'dark' && step !== 'dark') ||
                                                    (s === 'neural' && step === 'meta') ||
                                                    s === step
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                    : 'bg-white/10'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Content Based on Step */}
                                <AnimatePresence mode="wait">
                                    {step === 'dark' && (
                                        <motion.div
                                            key="dark"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 mb-4">
                                                <h3 className="text-red-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                                    🌑 Dark Code
                                                    <span className="text-gray-500 font-normal normal-case">
                                                        (그림자 패턴)
                                                    </span>
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-gray-500 text-xs">트리거</span>
                                                        <p className="text-white">{archetype.dark_code.trigger}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 text-xs">자동 사고</span>
                                                        <p className="text-red-300 italic">"{archetype.dark_code.thought}"</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 text-xs">감정</span>
                                                        <p className="text-white">{archetype.dark_code.emotion}</p>
                                                    </div>
                                                    {archetype.dark_code.bodySignal && (
                                                        <div>
                                                            <span className="text-gray-500 text-xs">신체 반응</span>
                                                            <p className="text-white">{archetype.dark_code.bodySignal}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 'neural' && (
                                        <motion.div
                                            key="neural"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div
                                                className="rounded-2xl p-5 mb-4"
                                                style={{
                                                    backgroundColor: colors.bg,
                                                    border: `1px solid ${colors.border}`
                                                }}
                                            >
                                                <h3
                                                    className="text-xs font-bold uppercase mb-3 flex items-center gap-2"
                                                    style={{ color: colors.text }}
                                                >
                                                    🧠 Neural Code
                                                    <span className="text-gray-500 font-normal normal-case">
                                                        (가이드)
                                                    </span>
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-gray-500 text-xs">기법</span>
                                                        <p className="text-white font-bold">{archetype.neural_code.method}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 text-xs">행동</span>
                                                        <p className="text-white leading-relaxed">{archetype.neural_code.action}</p>
                                                    </div>
                                                    {archetype.neural_code.duration && (
                                                        <div className="flex gap-4">
                                                            <div>
                                                                <span className="text-gray-500 text-xs">권장 시간</span>
                                                                <p className="text-white">{archetype.neural_code.duration}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 text-xs">강도</span>
                                                                <p className="text-white capitalize">{archetype.neural_code.intensity}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 'meta' && (
                                        <motion.div
                                            key="meta"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-5 mb-4">
                                                <h3 className="text-purple-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                                    ✨ Meta Code
                                                    <span className="text-gray-500 font-normal normal-case">
                                                        (본질)
                                                    </span>
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-gray-500 text-xs">상태</span>
                                                        <p className="text-purple-300 font-bold">{archetype.meta_code.state}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 text-xs">설명</span>
                                                        <p className="text-white leading-relaxed">{archetype.meta_code.desc}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Affirmation */}
                                            <div className="text-center py-6 border-t border-white/10">
                                                <p className="text-gray-500 text-xs mb-2">오늘의 확언</p>
                                                <p className="text-white text-lg font-medium italic">
                                                    "{archetype.affirmation}"
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action Button */}
                                <button
                                    onClick={handleNextStep}
                                    className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                                    style={{
                                        background: step === 'meta'
                                            ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                                            : 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                                    }}
                                >
                                    {step === 'dark' && '→ 가이드 보기'}
                                    {step === 'neural' && '→ 본질로 가기'}
                                    {step === 'meta' && '🧘 The Pause 경험하기'}
                                </button>

                                {/* Chat Intent */}
                                {onChatIntent && (
                                    <button
                                        onClick={() => {
                                            onChatIntent(
                                                'THERAPY_CONSULT',
                                                `저는 '${archetype.name_ko}' 유형인 것 같아요. ${archetype.dark_code.trigger}일 때 "${archetype.dark_code.thought}"라는 생각이 들어요. 이 패턴에서 벗어나려면 어떻게 해야 할까요?`
                                            );
                                            onClose();
                                        }}
                                        className="w-full py-3 mt-3 rounded-xl bg-white/10 text-white font-medium flex items-center justify-center gap-2"
                                    >
                                        💬 이 패턴에 대해 상담하기
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
