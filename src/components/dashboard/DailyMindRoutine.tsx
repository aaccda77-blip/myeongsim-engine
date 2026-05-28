'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyMindRoutine() {
    const [currentPeriod, setCurrentPeriod] = useState<'morning' | 'afternoon' | 'night'>('morning');
    const [showWelcome, setShowWelcome] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);

    useEffect(() => {
        // 시간에 따른 모드 설정
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setCurrentPeriod('morning');
        else if (hour >= 12 && hour < 20) setCurrentPeriod('afternoon');
        else setCurrentPeriod('night');

        // 첫 방문 체크
        if (typeof window !== 'undefined') {
            const hasSeenWelcome = localStorage.getItem('myeongsim_daily_welcome');
            if (!hasSeenWelcome) {
                setShowWelcome(true);
            }
        }
    }, []);

    const handleStartMorning = () => {
        setShowWelcome(false);
        localStorage.setItem('myeongsim_daily_welcome', 'true');
    };

    return (
        <div className="w-full flex flex-col gap-6 mt-6 pb-12">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-serif font-bold tracking-widest text-amber-300/90 drop-shadow-md text-center">
                    오늘의 마음 정렬 루틴
                </h2>
                <button 
                    onClick={() => setShowGuideModal(true)}
                    className="text-[0.7rem] text-amber-400/60 hover:text-amber-300 underline underline-offset-4 transition-colors"
                >
                    이 루틴은 무엇인가요? (초보자 가이드)
                </button>
            </div>

            {/* Morning Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 border ${
                    currentPeriod === 'morning' 
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/5 border-amber-400/30 shadow-[0_0_20px_rgba(252,211,77,0.15)]' 
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
            >
                {currentPeriod === 'morning' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
                )}
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-200 flex items-center gap-2">
                            <span className="text-xl">🌅</span> 맑은 시작 (07:00)
                        </h3>
                        {currentPeriod === 'morning' && (
                            <span className="px-2 py-1 rounded bg-amber-400/20 text-amber-400 text-xs font-bold">진행 중</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        눈을 뜨자마자 스마트폰을 보기 전, 몸과 마음을 맑게 깨웁니다.
                    </p>
                    <div className="flex flex-col gap-3 mt-2">
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-gray-200">💧 물 한 잔 마시기 (3분 음악)</span>
                            <span className="text-gray-500">▶</span>
                        </button>
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-gray-200">🫁 현재로 돌아오는 3분 호흡</span>
                            <span className="text-gray-500">▶</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Afternoon Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 border ${
                    currentPeriod === 'afternoon' 
                    ? 'bg-gradient-to-br from-blue-500/20 to-sky-500/5 border-blue-400/30 shadow-[0_0_20px_rgba(96,165,250,0.15)]' 
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
            >
                {currentPeriod === 'afternoon' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
                )}
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-200 flex items-center gap-2">
                            <span className="text-xl">☀️</span> 잡념 끄기 (13:00)
                        </h3>
                        {currentPeriod === 'afternoon' && (
                            <span className="px-2 py-1 rounded bg-blue-400/20 text-blue-400 text-xs font-bold">진행 중</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        불안하고 웅성거리는 마음을 가라앉히고 내 편이 되어줍니다.
                    </p>
                    <div className="flex flex-col gap-3 mt-2">
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-gray-200">🎮 오감 명상 게임 (잡념 끄기)</span>
                            <span className="text-gray-500">▶</span>
                        </button>
                        <button className="w-full py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-blue-200">💬 내 편 되어주기 (AI 코칭)</span>
                            <span className="text-blue-400">시작</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Night Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 border ${
                    currentPeriod === 'night' 
                    ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/5 border-violet-400/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
            >
                {currentPeriod === 'night' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400/10 rounded-full blur-3xl" />
                )}
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-200 flex items-center gap-2">
                            <span className="text-xl">🌌</span> 따뜻한 안아주기 (21:30)
                        </h3>
                        {currentPeriod === 'night' && (
                            <span className="px-2 py-1 rounded bg-violet-400/20 text-violet-400 text-xs font-bold">진행 중</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        하루의 정서적 찌꺼기를 청소하고 깊은 숙면으로 들어갑니다.
                    </p>
                    <div className="flex flex-col gap-3 mt-2">
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-gray-200">🎧 자애 오디오 가이드</span>
                            <span className="text-gray-500">▶</span>
                        </button>
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-gray-200">📝 5-감사일기 작성</span>
                            <span className="text-gray-500">▶</span>
                        </button>
                        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between px-4 transition-colors">
                            <span className="text-sm text-gray-200">🌊 뇌 속 물청소 수면 사운드</span>
                            <span className="text-gray-500">▶</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* 웰컴 모달 */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm bg-gradient-to-b from-[#1E1B4B] to-[#0B0915] border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[50px] pointer-events-none" />
                            
                            <h3 className="text-2xl font-serif text-amber-300 mb-6 leading-snug font-bold">
                                🌅 좋은 아침이에요.<br/>밤새 수많은 생각들로<br/>조금 지치셨나요?
                            </h3>
                            <p className="text-gray-300 text-[0.9rem] leading-relaxed mb-8 break-keep">
                                "오늘 하루는 세상의 속도에 맞추느라 애쓰지 않아도 괜찮습니다.<br/><br/>
                                눈을 뜨자마자 스마트폰 속 복잡한 세상으로 달려가기 전에, 가장 먼저 당신의 메마른 몸을 위해 따뜻한 물 한 잔을 선물해 주세요.<br/><br/>
                                세상이 아닌, 나 자신을 향해 첫인사를 건네는 시간.<br/>
                                당신의 고요하고 맑은 시작을 명심이 응원합니다."
                            </p>

                            <button 
                                onClick={handleStartMorning}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2"
                            >
                                <span>💧 물 한 잔 마시며 3분 호흡 시작하기</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 가이드 모달 */}
            <AnimatePresence>
                {showGuideModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setShowGuideModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-gradient-to-b from-gray-900 to-[#0B0915] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-y-auto max-h-[85vh] hide-scrollbar"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
                            
                            <h3 className="text-xl font-serif text-amber-300 mb-6 font-bold text-center tracking-wide">
                                📅 [명심코칭]<br/>초보자를 위한<br/>매일 마음 정렬 루틴
                            </h3>
                            
                            <div className="space-y-8 text-gray-300 text-sm leading-relaxed break-keep">
                                <div>
                                    <h4 className="text-base text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-xl">🌅</span> 07:00 | 맑은 시작
                                    </h4>
                                    <p className="mb-2 text-gray-400">무의식적으로 스마트폰을 보며 걱정을 시작하기 전에 내 몸과 마음에 가장 먼저 좋은 에너지를 넣어줍니다.</p>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-300/90">
                                        <li><strong className="text-amber-200">몸의 갈증을 풀어주는 물 한 잔:</strong> 기상 직후 따뜻한 물 한 잔을 마시며 세포를 깨웁니다.</li>
                                        <li><strong className="text-amber-200">마음을 현재로 돌리는 3분 숨쉬기:</strong> 걱정(미래)으로 도망치기 전, 아랫배 감각에 집중하며 맑게 깨어납니다.</li>
                                        <li><strong className="text-amber-200">세포를 비우는 건강 식단:</strong> 내 몸의 지방 창고를 비우고 활력을 주는 점심 미션입니다.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-base text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-xl">☀️</span> 13:00 | 잡념 끄기
                                    </h4>
                                    <p className="mb-2 text-gray-400">점심 식사 이후 스트레스로 인해 마음이 불안하고 웅성거릴 때 마음을 뚝 가라앉혀 줍니다.</p>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-300/90">
                                        <li><strong className="text-amber-200">머릿속 공회전 종료 (오감 명상):</strong> 주변에 보이는 5가지, 들리는 3가지를 터치하며 애쓰지 않고 잡념을 꺼버립니다.</li>
                                        <li><strong className="text-amber-200">내 편 되어주기 (AI 코칭):</strong> 속상한 일로 자책할 때, AI 챗봇이 "당신의 잘못이 아닙니다"라며 마음을 달래줍니다.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-base text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-xl">🌌</span> 21:30 | 따뜻한 안아주기
                                    </h4>
                                    <p className="mb-2 text-gray-400">하루 동안 쌓인 정서적 찌꺼기들을 청소하고 깊은 숙면으로 들어갑니다.</p>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-300/90">
                                        <li><strong className="text-amber-200">마음의 역류 현상 다독이기:</strong> 힘을 빼고(Let go), 물러나(Lean back), 부드럽게 다가가는 자애 오디오를 듣습니다.</li>
                                        <li><strong className="text-amber-200">행복을 저축하는 5-감사일기:</strong> 사소한 일상의 감사를 기록하며 나를 옥죄던 집착을 내려놓습니다.</li>
                                        <li><strong className="text-amber-200">뇌 속 물청소 사운드:</strong> 깊은 잠(서파 수면)에 들었을 때 노폐물을 청소하는 원리를 시각화하여 숙면을 돕습니다.</li>
                                    </ul>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowGuideModal(false)}
                                className="w-full mt-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm transition-all"
                            >
                                닫기
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
