'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MindGrowthStages() {
    // 임시 상태 (1: 애쓰기, 2: 실망하기, 3: 진정한 수용)
    const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(2);
    const [showAICoach, setShowAICoach] = useState(false);

    const stages = [
        {
            id: 1,
            title: '애쓰기',
            desc: '더 좋아지려고 노력하는 열병의 단계'
        },
        {
            id: 2,
            title: '실망하기',
            desc: '여전히 단점이 많은 내 모습에 실망하는 단계'
        },
        {
            id: 3,
            title: '진정한 수용',
            desc: '"불완전해도 이대로 충분해" 친구가 되는 단계'
        }
    ];

    const handleStageClick = (stageId: number) => {
        if (stageId === 2) {
            setShowAICoach(true);
        } else {
            setShowAICoach(false);
        }
        setCurrentStage(stageId as 1 | 2 | 3);
    };

    return (
        <div className="w-full flex flex-col gap-6 mt-2 pb-8">
            <div className="px-2">
                <h2 className="text-lg font-serif font-bold tracking-widest text-violet-300/90 drop-shadow-md">
                    마음 성장 3단계
                </h2>
                <p className="text-[0.8rem] text-gray-400 mt-1">
                    명상을 해도 왜 금방 편해지지 않을까? 나의 현재 위치를 확인하세요.
                </p>
            </div>

            <div className="relative p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-violet-500/5 to-transparent blur-3xl pointer-events-none" />
                
                {/* 프로그레스 바 */}
                <div className="relative z-10 flex flex-col gap-8">
                    {stages.map((stage, index) => (
                        <div 
                            key={stage.id} 
                            className={`relative flex items-start gap-4 cursor-pointer transition-opacity duration-300 ${
                                currentStage >= stage.id ? 'opacity-100' : 'opacity-40'
                            }`}
                            onClick={() => handleStageClick(stage.id)}
                        >
                            {/* 연결선 */}
                            {index !== stages.length - 1 && (
                                <div className={`absolute top-8 left-4 w-[2px] h-[4.5rem] -ml-[1px] ${
                                    currentStage > stage.id ? 'bg-violet-500/50' : 'bg-white/10'
                                }`} />
                            )}
                            
                            {/* 상태 아이콘 */}
                            <motion.div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                                    currentStage === stage.id 
                                    ? 'border-violet-400 bg-violet-900 shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                                    : currentStage > stage.id 
                                        ? 'border-violet-500 bg-violet-500/20' 
                                        : 'border-white/20 bg-black/50'
                                }`}
                                animate={currentStage === stage.id ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <span className="text-xs font-bold text-white">{stage.id}</span>
                            </motion.div>

                            {/* 내용 */}
                            <div className="flex flex-col pt-1">
                                <h3 className={`text-base font-bold ${currentStage === stage.id ? 'text-violet-300' : 'text-gray-300'}`}>
                                    {stage.title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {stage.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI 코치 위로 모달 (2단계 클릭 시) */}
            <AnimatePresence>
                {showAICoach && currentStage === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-400/30 shadow-lg relative"
                    >
                        <div className="flex gap-3">
                            <span className="text-2xl pt-1">🤖</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-blue-300 mb-1">AI 명심 코치</span>
                                <p className="text-sm text-blue-100 leading-relaxed break-keep">
                                    "노력했는데도 실망스러운 마음이 드는군요. 
                                    하지만 기억하세요. 이것은 명상을 하는 누구나 반드시 거쳐 가는 **가장 자연스러운 과정**이며, 결코 당신의 잘못이 아닙니다. 
                                    잘하고 있어요. 조금만 더 힘을 빼볼까요?"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
