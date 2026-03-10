/**
 * LevelSelectorModal.tsx
 * 사용자가 언제든 레벨을 변경할 수 있는 선택 모달
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LEVEL_DESCRIPTIONS, type DifficultyLevel } from '@/data/LevelAssessmentQuiz';

interface Props {
    currentLevel: DifficultyLevel;
    onSelectLevel: (level: DifficultyLevel) => void;
    onRetakeQuiz: () => void;
    onClose: () => void;
}

export default function LevelSelectorModal({ currentLevel, onSelectLevel, onRetakeQuiz, onClose }: Props) {
    const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-[#1f2937] rounded-3xl p-8 shadow-2xl border border-gray-800"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-white text-2xl font-bold mb-2 font-serif">
                        🎯 나에게 맞는 난이도는?
                    </h2>
                    <p className="text-gray-400 text-sm">
                        언제든 변경할 수 있어요
                    </p>
                </div>

                {/* Level Options */}
                <div className="flex flex-col gap-3 mb-6">
                    {levels.map((level) => {
                        const isSelected = level === currentLevel;
                        const desc = LEVEL_DESCRIPTIONS[level];

                        return (
                            <button
                                key={level}
                                onClick={() => {
                                    onSelectLevel(level);
                                    onClose();
                                }}
                                className={`
                                    w-full text-left p-5 rounded-2xl border-2 transition-all
                                    ${isSelected
                                        ? 'bg-[#658c42]/20 border-[#658c42]'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{desc.emoji}</div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold mb-1">
                                            {desc.label}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {desc.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-[#658c42]">
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Retake Quiz Button */}
                <button
                    onClick={() => {
                        onRetakeQuiz();
                        onClose();
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
                >
                    📝 레벨 테스트 다시하기
                </button>
            </motion.div>
        </div>
    );
}
