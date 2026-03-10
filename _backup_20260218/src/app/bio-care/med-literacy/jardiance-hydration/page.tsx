/**
 * /bio-care/med-literacy/jardiance-hydration/page.tsx
 * 자디앙 수분 섭취 트래커
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface HydrationLog {
    timestamp: string;
    amount: number; // ml
}

const DAILY_GOAL = 2000; // 2L
const CUP_SIZES = [
    { label: '한 컵', amount: 200, icon: '☕' },
    { label: '물병', amount: 500, icon: '🍶' },
    { label: '텀블러', amount: 700, icon: '🥤' }
];

export default function JardianceHydrationPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<HydrationLog[]>([]);
    const [todayTotal, setTodayTotal] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);

    // 오늘 날짜 확인
    const today = new Date().toLocaleDateString('ko-KR');

    // 로컬 스토리지에서 데이터 로드
    useEffect(() => {
        const saved = localStorage.getItem('hydration_logs');
        if (saved) {
            const parsed = JSON.parse(saved);
            const todayLogs = parsed.filter((log: HydrationLog) =>
                new Date(log.timestamp).toLocaleDateString('ko-KR') === today
            );
            setLogs(todayLogs);
            const total = todayLogs.reduce((sum: number, log: HydrationLog) => sum + log.amount, 0);
            setTodayTotal(total);
        }
    }, [today]);

    const addWater = (amount: number) => {
        const newLog: HydrationLog = {
            timestamp: new Date().toISOString(),
            amount: amount
        };

        const updatedLogs = [...logs, newLog];
        setLogs(updatedLogs);

        const newTotal = todayTotal + amount;
        setTodayTotal(newTotal);

        // 로컬 스토리지 저장
        const allLogs = JSON.parse(localStorage.getItem('hydration_logs') || '[]');
        allLogs.push(newLog);
        localStorage.setItem('hydration_logs', JSON.stringify(allLogs));

        // 목표 달성 시 축하
        if (todayTotal < DAILY_GOAL && newTotal >= DAILY_GOAL) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
    };

    const progress = Math.min((todayTotal / DAILY_GOAL) * 100, 100);
    const remaining = Math.max(DAILY_GOAL - todayTotal, 0);

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
                    수분 섭취 트래커
                </h2>
            </header>

            <main className="flex-1 p-6 space-y-6 pb-8 overflow-y-auto">
                {/* Hero */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-6 text-center">
                    <span className="text-5xl mb-3 block">💧</span>
                    <h1 className="text-white text-xl font-bold mb-2 font-serif">
                        자디앙과 수분 관리
                    </h1>
                    <p className="text-blue-200 text-sm">
                        SGLT-2 억제제 복용 시<br />충분한 수분 섭취가 중요합니다
                    </p>
                </div>

                {/* Progress Circle */}
                <div className="relative">
                    <div className="w-48 h-48 mx-auto relative">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="#374151"
                                strokeWidth="12"
                                fill="none"
                            />
                            {/* Progress Circle */}
                            <motion.circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="url(#gradient)"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 88}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-4xl font-bold text-white">{Math.round(progress)}%</p>
                            <p className="text-gray-400 text-sm mt-1">{todayTotal}ml / {DAILY_GOAL}ml</p>
                        </div>
                    </div>

                    {/* Remaining */}
                    {remaining > 0 ? (
                        <p className="text-center text-gray-400 text-sm mt-4">
                            목표까지 <strong className="text-blue-400">{remaining}ml</strong> 남았어요!
                        </p>
                    ) : (
                        <p className="text-center text-green-400 text-sm mt-4 font-bold">
                            🎉 오늘의 목표 달성!
                        </p>
                    )}
                </div>

                {/* Quick Add Buttons */}
                <div>
                    <h3 className="text-white font-bold mb-3">빠른 기록</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {CUP_SIZES.map((cup) => (
                            <button
                                key={cup.amount}
                                onClick={() => addWater(cup.amount)}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-blue-500/50 transition-all active:scale-95"
                            >
                                <span className="text-3xl mb-2 block">{cup.icon}</span>
                                <p className="text-white text-sm font-bold">{cup.label}</p>
                                <p className="text-gray-500 text-xs">{cup.amount}ml</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Today's Log */}
                {logs.length > 0 && (
                    <div>
                        <h3 className="text-white font-bold mb-3">오늘의 기록</h3>
                        <div className="space-y-2">
                            {logs.slice().reverse().slice(0, 5).map((log, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-400">water_drop</span>
                                        <div>
                                            <p className="text-white text-sm font-bold">{log.amount}ml</p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(log.timestamp).toLocaleTimeString('ko-KR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Educational Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
                    <h3 className="text-blue-300 font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined">school</span>
                        왜 수분이 중요할까요?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            자디앙은 소변으로 당을 배출하면서 수분도 함께 빠져나갑니다
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            탈수 예방을 위해 하루 2L 이상 물 섭취가 권장됩니다
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            소변 색깔이 진한 노란색이면 수분 부족 신호입니다
                        </li>
                    </ul>
                </div>

                {/* Warning Signs */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                    <h3 className="text-red-300 font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined">warning</span>
                        탈수 증상 주의
                    </h3>
                    <ul className="space-y-2 text-sm text-red-200">
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            심한 갈증, 입 마름
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            어지러움, 두통
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠️</span>
                            배뇨 시 통증 (요로감염 가능성)
                        </li>
                    </ul>
                    <p className="text-red-200 text-xs mt-3">
                        위 증상 발생 시 즉시 의료진과 상담하세요.
                    </p>
                </div>

                {/* 의료법 준수 안내 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-purple-200 text-xs leading-relaxed">
                        📚 <strong>보건교육 목적 도구</strong><br />
                        본 트래커는 건강 증진을 위한 자가 모니터링 도구이며, 의학적 진단이나 처방을 대신할 수 없습니다.
                        개인별 적정 수분 섭취량은 의료진과 상담하세요.
                    </p>
                </div>
            </main>

            {/* Celebration Modal */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-center shadow-2xl">
                            <span className="text-7xl mb-4 block">🎉</span>
                            <h2 className="text-white text-2xl font-bold mb-2">목표 달성!</h2>
                            <p className="text-blue-100 text-sm">
                                오늘 하루 수분 섭취 목표를<br />완벽하게 달성하셨습니다!
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
