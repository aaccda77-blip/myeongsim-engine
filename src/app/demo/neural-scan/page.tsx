/**
 * /app/demo/neural-scan/page.tsx
 * 명심코칭 — 동서양 융합 뉴럴 스캔 데모 페이지 (PSST 심사관용)
 * 기존 시스템에 영향 없는 독립 모듈 라우트
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeuralArchitectureBlueprint from '@/components/chat/NeuralArchitectureBlueprint';
import NeuralHackingReportCard from '@/components/chat/NeuralHackingReportCard';

export default function NeuralScanDemoPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'architecture' | 'hacking'>('architecture');

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#070A12] max-w-2xl mx-auto shadow-xl overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-purple-600/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#070A12]/90 backdrop-blur-xl px-4 py-3 border-b border-blue-900/30">
                <button
                    onClick={() => router.back()}
                    className="text-blue-400 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <h2 className="text-white text-base font-bold leading-tight flex-1 text-center pr-10">
                    동서양 융합 뉴럴 스캔
                </h2>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="px-6 pt-10 pb-8 text-center border-b border-blue-900/20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 mb-5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-blue-400 text-[10px] font-mono tracking-widest uppercase">Myeongsim Neural Scan Engine v2.0</span>
                    </div>

                    <h1 className="text-white text-2xl md:text-3xl font-black mb-3 leading-tight">
                        🌐 명심(明心) 뉴럴 아키텍처
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base mb-4 break-keep leading-relaxed max-w-md mx-auto">
                        2천 년 시계열 기질 데이터를 현대 <strong className="text-blue-300">뇌과학·심리학·사이버네틱스</strong> 관점으로 재구조화한 동서양 융합 코칭 엔진
                    </p>

                    {/* Formula Card */}
                    <div className="mt-6 mx-auto max-w-sm p-4 bg-black/40 rounded-2xl border border-blue-900/30 backdrop-blur-md">
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-2">Sovereign State Equation</p>
                        <p className="text-sm text-blue-200 font-mono leading-relaxed">
                            <span className="text-blue-400">Sovereign</span> = <span className="text-emerald-400">OS</span>(기질) × <span className="text-indigo-400">App</span>(인지) × <span className="text-green-400">Power</span>(에너지) ÷ <span className="text-red-400">Glitch</span>(변수)
                        </p>
                    </div>

                    {/* Patent Badge */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-full">
                        <span className="text-[10px] text-purple-300 font-mono">🔒 특허 기반 바이오-싱크 기술 (출원번호: 10-2025-0166877)</span>
                    </div>
                </motion.div>

                {/* Tab Selector */}
                <div className="sticky top-[52px] z-40 bg-[#070A12]/95 backdrop-blur-xl border-b border-blue-900/20 px-4 py-3">
                    <div className="flex gap-2 max-w-md mx-auto">
                        <button
                            onClick={() => setActiveTab('architecture')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'architecture'
                                    ? 'bg-blue-950/40 border-2 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                    : 'bg-black/20 border border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span>🌐</span> 시스템 청사진
                        </button>
                        <button
                            onClick={() => setActiveTab('hacking')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'hacking'
                                    ? 'bg-red-950/40 border-2 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                    : 'bg-black/20 border border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span>🔥</span> 뉴럴 해킹 리포트
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-2 md:px-4 py-6">
                    {activeTab === 'architecture' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Intro Text */}
                            <div className="text-center mb-6 px-4">
                                <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                    인간의 기질을 <strong className="text-blue-300">OS(운영체제)</strong>, <strong className="text-indigo-300">App(소프트웨어)</strong>, <strong className="text-emerald-300">배터리(에너지 위상)</strong>, <strong className="text-red-300">다크코드(변이 변수)</strong> 4개의 Layer로 해체합니다.
                                    <br/>각 Layer마다 <span className="text-purple-300">산파술</span> → <span className="text-purple-300">재귀적 질문</span> → <span className="text-pink-300">알아차림의 알아차림</span>으로 낡은 각본을 소각합니다.
                                </p>
                            </div>
                            <NeuralArchitectureBlueprint />
                        </motion.div>
                    )}

                    {activeTab === 'hacking' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Intro Text */}
                            <div className="text-center mb-6 px-4">
                                <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                    개인의 기질 코드에 맞춤 설계된 <strong className="text-red-300">3단계 뉴럴 해킹 프로토콜</strong>입니다.
                                    <br/>낡은 각본(Old Script)을 식별하고, 5단계 코칭 시퀀스로 신경 회로를 <span className="text-blue-300">재배선(Rewiring)</span>합니다.
                                </p>
                            </div>
                            <NeuralHackingReportCard archetypeId="BP-54" />
                        </motion.div>
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="px-6 py-10 text-center border-t border-blue-900/20">
                    <div className="max-w-sm mx-auto">
                        <p className="text-gray-500 text-xs mb-4 break-keep">
                            위 분석은 <strong className="text-gray-300">1980년 7월 7일 13:40</strong> 데이터 기반 샘플입니다.
                            <br/>실제 서비스에서는 사용자의 고유 데이터로 개인화됩니다.
                        </p>
                        <button
                            onClick={() => router.push('/myeongsim-chat')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        >
                            🧬 AI 코칭 체험하기
                        </button>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="px-6 py-6 bg-black/30 border-t border-gray-800/50">
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-gray-400 text-[10px] leading-relaxed break-keep">
                            ⚠️ 본 서비스는 보건복지부의 '비의료 건강관리 서비스 가이드라인'을 준수합니다.
                            제공되는 정보는 자기 주도적 건강 관리(Self-Care)를 위한 보조 수단이며, 의학적 진단·치료·처방을 대체할 수 없습니다.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
