"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SajuWongukCard from './SajuWongukCard'; // [NEW] Premium Design
import LifeCurveChart from './LifeCurveChart';

interface Props {
    onClose: () => void;
    onChatIntent: (intent: string, prompt: string) => void;
    birthDate?: Date;
    userProfile?: any;
    onEditBirthdate?: () => void;
}

export default function VisualSajuDashboard({ onClose, onChatIntent, birthDate, userProfile, onEditBirthdate }: Props) {
    const [selectedAge, setSelectedAge] = useState<{ age: number, score: number } | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-[#0f1115] z-[2000] overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 bg-[#0f1115]/80 backdrop-blur-md p-4 flex justify-between items-center z-10 border-b border-white/5">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🔮 내 운명의 설계도
                </h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 pb-32">
                {/* 1. Premium Saju Wonguk Card */}
                <div className="mb-8">
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 px-1">기본 태생 (Nature)</h3>
                    <SajuWongukCard userProfile={userProfile} onEditBirthdate={onEditBirthdate} />
                </div>

                {/* 2. Life Graph */}
                <div className="mb-4">
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-1 px-1">사용자의 기질 데이터 (Flow)</h3>
                    <LifeCurveChart onSelectAge={(age, score) => setSelectedAge({ age, score })} birthDate={birthDate} />
                </div>

                {/* Interaction Feedback */}
                <AnimatePresence>
                    {selectedAge && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 mt-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-purple-300 font-bold">{selectedAge.age}세 무렵</span>
                                <span className="text-2xl font-bold text-white">{Math.round(selectedAge.score)}점</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                {selectedAge.score > 80 ? "인생의 황금기입니다! 이 시기의 기회를 놓치지 마세요." :
                                    selectedAge.score < 40 ? "내실을 다지는 인내의 시기입니다." :
                                        "안정적으로 성장하는 시기입니다."}
                            </p>

                            <button
                                onClick={() => {
                                    onChatIntent(
                                        'DAEWOON_QUESTION',
                                        `제 ${selectedAge.age}세 때 라이프 웨이브 그래프 점수가 ${Math.round(selectedAge.score)}점이던데, 이 시기에 구체적으로 어떤 일이 일어날까요? 그리고 어떻게 대비해야 할까요?`
                                    );
                                }}
                                className="w-full mt-3 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold flex items-center justify-center gap-2"
                            >
                                💬 이 시기 상담하기
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!selectedAge && (
                    <div className="text-center text-gray-600 text-sm mt-8 animate-pulse">
                        👆 그래프의 굴곡을 터치해보세요
                    </div>
                )}
            </div>
        </motion.div>
    );
}
