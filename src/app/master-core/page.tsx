'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MasterCoreLandingPage() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#05070A] max-w-2xl mx-auto shadow-2xl overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-30%] right-[-20%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-blue-700/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-700/10 rounded-full blur-[120px]"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-30"></div>
            </div>

            {/* Content */}
            <main className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full text-center"
                >
                    {/* Access Subtitle */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/30 border border-blue-500/30 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-blue-400 text-[10px] font-mono tracking-widest uppercase">System Initialization</span>
                    </motion.div>

                    {/* Main Title */}
                    <h1 className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-500 font-black mb-6 tracking-tight drop-shadow-lg">
                        명심 마스터 코어
                    </h1>
                    
                    <p className="text-sm md:text-base text-blue-200/70 mb-12 max-w-sm mx-auto leading-relaxed break-keep">
                        동양 철학의 기질 데이터와 생체 뉴럴 스캔이 결합된 가장 진보된 의식 통제 시스템에 접속합니다.
                    </p>

                    {/* Cybernetic Info Box */}
                    <div className="relative p-6 mb-12 bg-[#0B0F19] border border-blue-500/20 rounded-2xl overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-600"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] text-blue-400 font-mono">CONNECTION_STATUS</span>
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                SECURE
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div>
                                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Neural Engine</div>
                                <div className="text-xs text-gray-300 font-bold">RAG AI + Bio-Sync</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Access Level</div>
                                <div className="text-xs text-purple-400 font-bold">Sovereign Matrix</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-md mx-auto">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/master-core/chat')}
                            className="relative group w-full overflow-hidden rounded-2xl p-[1px]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <div className="relative bg-[#070A12] px-4 py-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-0">
                                <span className="text-white font-bold text-sm tracking-wide mb-1">기질 스캔 (60갑자)</span>
                                <span className="text-[10px] text-blue-300/70 font-mono">SAJU_NETWORK</span>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/master-core/mental')}
                            className="relative group w-full overflow-hidden rounded-2xl p-[1px]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <div className="relative bg-[#070A12] px-4 py-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-0">
                                <span className="text-white font-bold text-sm tracking-wide mb-1">멘탈 해킹 (64코어)</span>
                                <span className="text-[10px] text-purple-300/70 font-mono">MENTAL_OS_MATRIX</span>
                            </div>
                        </motion.button>
                    </div>

                    {/* Social Value Button - Full Width */}
                    <div className="w-full max-w-md mx-auto mt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/master-core/value')}
                            className="relative group w-full overflow-hidden rounded-2xl p-[1px]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <div className="relative bg-[#070A12] px-4 py-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-0">
                                <span className="text-white font-bold text-sm tracking-wide mb-1">🌏 사회적 가치 발견</span>
                                <span className="text-[10px] text-teal-300/70 font-mono">SOCIAL_VALUE_DISCOVERY</span>
                            </div>
                        </motion.button>
                    </div>

                    {/* 4D Mind Hacking Matrix Button */}
                    <div className="w-full max-w-md mx-auto mt-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/master-core/matrix')}
                            className="relative group w-full overflow-hidden rounded-2xl p-[1px]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-violet-500 via-sky-500 to-amber-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <div className="relative bg-[#070A12] px-4 py-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-opacity-0">
                                <span className="text-white font-bold text-sm tracking-wide mb-1">⚔️ 4D 마인드 해킹 매트릭스</span>
                                <span className="text-[10px] text-red-300/70 font-mono">SOVEREIGN_4D_MATRIX · PATENT</span>
                            </div>
                        </motion.button>
                    </div>

                    {/* Footer Code */}
                    <div className="mt-16 text-[10px] text-gray-600 font-mono tracking-widest text-center">
                        BP-53 // MYEONGSIM_COACHING_SYSTEM v2.0
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
