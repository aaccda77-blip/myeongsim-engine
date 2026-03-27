/**
 * /app/demo/neural-scan/page.tsx
 * 명심코칭 — 동서양 융합 뉴럴 스캔 데모 페이지 (PSST 심사관용)
 * 기존 시스템에 영향 없는 독립 모듈 라우트
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NeuralArchitectureBlueprint from '@/components/chat/NeuralArchitectureBlueprint';
import NeuralHackingReportCard from '@/components/chat/NeuralHackingReportCard';
import BioSyncDashboard from '@/components/dashboard/BioSyncDashboard';

type TabType = 'architecture' | 'hacking' | 'biosync';

export default function NeuralScanDemoPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('architecture');

    // 바이오-싱크 데모용 시뮬레이션 데이터
    const [demoBioData, setDemoBioData] = useState({
        bpm: 72,
        hrv: 48,
        steps: 6842,
        stressLevel: 'MODERATE' as string,
    });

    // 데모용 실시간 시뮬레이션 (심박수 미세 변화)
    useEffect(() => {
        if (activeTab !== 'biosync') return;
        const interval = setInterval(() => {
            setDemoBioData(prev => ({
                ...prev,
                bpm: Math.max(60, Math.min(95, prev.bpm + Math.floor(Math.random() * 7) - 3)),
                hrv: Math.max(30, Math.min(65, prev.hrv + Math.floor(Math.random() * 5) - 2)),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, [activeTab]);

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

                {/* Tab Selector — 3 Tabs */}
                <div className="sticky top-[52px] z-40 bg-[#070A12]/95 backdrop-blur-xl border-b border-blue-900/20 px-3 py-3">
                    <div className="flex gap-1.5 max-w-lg mx-auto">
                        <button
                            onClick={() => setActiveTab('architecture')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'architecture'
                                    ? 'bg-blue-950/40 border-2 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                    : 'bg-black/20 border border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span>🌐</span> 시스템 청사진
                        </button>
                        <button
                            onClick={() => setActiveTab('hacking')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'hacking'
                                    ? 'bg-red-950/40 border-2 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                    : 'bg-black/20 border border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span>🔥</span> 뉴럴 해킹
                        </button>
                        <button
                            onClick={() => setActiveTab('biosync')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'biosync'
                                    ? 'bg-emerald-950/40 border-2 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                    : 'bg-black/20 border border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span>⌚</span> 바이오-싱크
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-2 md:px-4 py-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'architecture' && (
                            <motion.div
                                key="arch"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
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
                                key="hack"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="text-center mb-6 px-4">
                                    <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                        개인의 기질 코드에 맞춤 설계된 <strong className="text-red-300">3단계 뉴럴 해킹 프로토콜</strong>입니다.
                                        <br/>낡은 각본(Old Script)을 식별하고, 5단계 코칭 시퀀스로 신경 회로를 <span className="text-blue-300">재배선(Rewiring)</span>합니다.
                                    </p>
                                </div>
                                <NeuralHackingReportCard />
                            </motion.div>
                        )}

                        {activeTab === 'biosync' && (
                            <motion.div
                                key="bio"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Bio-Sync Intro */}
                                <div className="text-center mb-6 px-4">
                                    <p className="text-xs text-gray-400 break-keep leading-relaxed max-w-md mx-auto">
                                        <strong className="text-emerald-300">Apple HealthKit / Google Health Connect</strong>와 연동하여
                                        <br/>실시간 생체 데이터로 코칭 트리거를 자동 활성화하는 <span className="text-purple-300">특허 기반 바이오-싱크 기술</span>입니다.
                                    </p>
                                </div>

                                {/* Live Dashboard with Demo Data */}
                                <div className="px-2 md:px-4">
                                    <BioSyncDashboard data={demoBioData} />
                                </div>

                                {/* Bio-Sync Architecture Diagram */}
                                <div className="mx-4 md:mx-6 mt-6 p-5 bg-[#0B0F19] rounded-2xl border border-emerald-900/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-sm">⌚</div>
                                        <div>
                                            <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Patent-Based Technology</div>
                                            <div className="text-sm text-white font-bold">바이오-싱크 아키텍처</div>
                                        </div>
                                    </div>

                                    {/* Data Flow Cards */}
                                    <div className="space-y-3">
                                        {/* Step 1 */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300 shrink-0 mt-0.5">1</div>
                                            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3 flex-1">
                                                <div className="text-xs text-blue-300 font-bold mb-1">생체 신호 수집 (Wearable Input)</div>
                                                <p className="text-[11px] text-gray-400 leading-relaxed break-keep">
                                                    스마트워치에서 <strong className="text-gray-300">심박수(BPM)</strong>, <strong className="text-gray-300">심박변이도(HRV)</strong>, <strong className="text-gray-300">수면 패턴</strong>, <strong className="text-gray-300">활동량</strong>을 실시간 수집합니다.
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {['Apple HealthKit', 'Google Health Connect', 'Samsung Health'].map(sdk => (
                                                        <span key={sdk} className="text-[9px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/30 font-mono">{sdk}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex justify-center"><span className="text-gray-700 text-xs">▼</span></div>

                                        {/* Step 2 */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300 shrink-0 mt-0.5">2</div>
                                            <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-3 flex-1">
                                                <div className="text-xs text-purple-300 font-bold mb-1">기질 × 생체 융합 분석 (Bio-Neural Fusion)</div>
                                                <p className="text-[11px] text-gray-400 leading-relaxed break-keep">
                                                    수집된 생체 데이터와 사용자의 <strong className="text-gray-300">기질 신경망(Z축)</strong>을 교차 분석하여, 현재 스트레스가 어떤 <strong className="text-gray-300">다크코드(낡은 각본)</strong>를 활성화하는지 예측합니다.
                                                </p>
                                                <div className="mt-2 p-2 bg-black/30 rounded-lg">
                                                    <p className="text-[10px] text-gray-500 font-mono">예시: HRV 35ms 이하 + 주도성엔진 다크코드 → <span className="text-red-300">"고집불통 독재자" 모드 경고</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex justify-center"><span className="text-gray-700 text-xs">▼</span></div>

                                        {/* Step 3 */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-300 shrink-0 mt-0.5">3</div>
                                            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3 flex-1">
                                                <div className="text-xs text-emerald-300 font-bold mb-1">맞춤형 개입 트리거 (Auto-Coaching Trigger)</div>
                                                <p className="text-[11px] text-gray-400 leading-relaxed break-keep">
                                                    위험 신호가 감지되면 <strong className="text-gray-300">3단계 질문(산파술→재귀적→알아차림)</strong> + <strong className="text-gray-300">4대 심리치료(CBT/MBCT/DBT/ACT)</strong> 코칭을 자동으로 푸시합니다.
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {['번아웃 알림', '분노 폭주 감지', '수면 부채 경고', '에너지 충전 가이드'].map(t => (
                                                        <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/30">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex justify-center"><span className="text-gray-700 text-xs">▼</span></div>

                                        {/* Step 4 */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-300 shrink-0 mt-0.5">4</div>
                                            <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 flex-1">
                                                <div className="text-xs text-amber-300 font-bold mb-1">효과 검증 피드백 루프 (Verification Loop)</div>
                                                <p className="text-[11px] text-gray-400 leading-relaxed break-keep">
                                                    코칭 개입 전후의 <strong className="text-gray-300">HRV·심박수 변화</strong>를 수치로 기록하여, 코칭 효과를 <strong className="text-gray-300">과학적으로 검증</strong>합니다.<br/>
                                                    이 데이터는 AI 코칭 모델의 <strong className="text-gray-300">자가 학습(Self-Learning)</strong>에 피드백됩니다.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patent Reference */}
                                    <div className="mt-5 p-3 bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-500/20 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] text-purple-300 font-bold">🔒 특허 기술 기반</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-relaxed break-keep">
                                            <strong className="text-gray-300">특허명:</strong> 심리 및 생체데이터 기반 스트레스 관리 솔루션<br/>
                                            <strong className="text-gray-300">출원번호:</strong> 10-2025-0166877<br/>
                                            <strong className="text-gray-300">핵심:</strong> 동양 기질 데이터(Z축) + 실시간 생체 신호(Y축) + 신경가소성 훈련(X축)의 3축 통합 분석 시스템
                                        </p>
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div className="mx-4 md:mx-6 mt-4 p-4 bg-black/30 rounded-2xl border border-gray-800/50">
                                    <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-3">Integration SDKs</div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { icon: '🍎', name: 'Apple HealthKit', desc: 'iOS 심박/HRV/수면' },
                                            { icon: '🤖', name: 'Health Connect', desc: 'Android 생체 데이터' },
                                            { icon: '⌚', name: 'WearOS / watchOS', desc: '실시간 워치 싱크' },
                                        ].map(sdk => (
                                            <div key={sdk.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-center">
                                                <div className="text-lg mb-1">{sdk.icon}</div>
                                                <div className="text-[10px] text-gray-300 font-bold">{sdk.name}</div>
                                                <div className="text-[9px] text-gray-500 mt-0.5">{sdk.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
