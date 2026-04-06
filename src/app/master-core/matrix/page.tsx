'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MATRIX_PHASES, SAMPLE_CASES, MatrixPhase, SampleCase } from '@/modules/MindHackingMatrixModule';

type ViewMode = 'OVERVIEW' | 'PHASE_DETAIL' | 'CASE_STUDY';

export default function MindHackingMatrixPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('OVERVIEW');
    const [selectedPhase, setSelectedPhase] = useState<MatrixPhase | null>(null);
    const [selectedCase, setSelectedCase] = useState<SampleCase | null>(null);
    const [activeCasePhase, setActiveCasePhase] = useState<number>(1);

    const handlePhaseClick = (phase: MatrixPhase) => {
        setSelectedPhase(phase);
        setViewMode('PHASE_DETAIL');
    };

    const handleCaseClick = (cs: SampleCase) => {
        setSelectedCase(cs);
        setActiveCasePhase(1);
        setViewMode('CASE_STUDY');
    };

    const handleBack = () => {
        setViewMode('OVERVIEW');
        setSelectedPhase(null);
        setSelectedCase(null);
    };

    // Phase accent colors
    const phaseColors: Record<string, { text: string; border: string; bg: string; glow: string; pill: string }> = {
        red: { text: 'text-red-300', border: 'border-red-500/30', bg: 'bg-red-950/15', glow: 'shadow-[0_0_25px_rgba(239,68,68,0.08)]', pill: 'bg-red-500/20 text-red-300 border-red-500/30' },
        violet: { text: 'text-violet-300', border: 'border-violet-500/30', bg: 'bg-violet-950/15', glow: 'shadow-[0_0_25px_rgba(139,92,246,0.08)]', pill: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
        sky: { text: 'text-sky-300', border: 'border-sky-500/30', bg: 'bg-sky-950/15', glow: 'shadow-[0_0_25px_rgba(14,165,233,0.08)]', pill: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
        amber: { text: 'text-amber-300', border: 'border-amber-500/30', bg: 'bg-amber-950/15', glow: 'shadow-[0_0_25px_rgba(245,158,11,0.08)]', pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#070A12] text-gray-200 font-sans relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>
            <div className="fixed top-[-25%] left-[-15%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] bg-red-700/5 rounded-full blur-[160px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] bg-amber-700/5 rounded-full blur-[130px] pointer-events-none z-0"></div>

            {/* Header */}
            <header className="relative z-10 p-4 border-b border-red-900/30 bg-black/40 backdrop-blur-md">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {viewMode !== 'OVERVIEW' && (
                            <button onClick={handleBack} className="mr-2 text-gray-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        )}
                        <span className="text-xl">⚔️</span>
                        <div>
                            <h1 className="text-sm font-bold text-red-200">4D 마인드 해킹 매트릭스</h1>
                            <p className="text-[10px] text-red-500/70 font-mono">SOVEREIGN_4D_MATRIX v1.0</p>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full border border-red-600/30 text-[10px] font-mono tracking-widest text-red-500 bg-red-950/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        PATENT DEMO
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 relative z-10 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">

                    {/* ============= OVERVIEW ============= */}
                    {viewMode === 'OVERVIEW' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto px-5 py-8"
                        >
                            {/* Hero */}
                            <div className="text-center mb-8">
                                <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="text-4xl mb-4">⚔️</motion.div>
                                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-white to-amber-300 mb-2">
                                    Sovereign 4D-Mind Hacking Matrix
                                </h2>
                                <p className="text-[11px] text-gray-500 break-keep max-w-sm mx-auto leading-relaxed">
                                    동양 사주명리의 원형(Archetype) 데이터 × 서양 제3동향(3rd Wave) 심리치료의<br/>
                                    <strong className="text-gray-300">세계 최초 하이브리드 융합 코칭 프레임워크</strong>
                                </p>
                            </div>

                            {/* Patent Declaration Box */}
                            <div className="relative p-5 rounded-2xl border border-gray-700/50 bg-[#0B0F19]/80 mb-8 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-violet-500 via-sky-500 to-amber-500"></div>
                                <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">INNOVATION_DECLARATION</div>
                                <p className="text-[12px] text-gray-300 leading-relaxed break-keep italic">
                                    &ldquo;수천 년간 동양의 제왕들이 사람을 읽기 위해 사용했던 원형 데이터(60갑자)를, 
                                    서양의 가장 진보한 3세대 인지행동과학(CBT·MBCT·DBT·ACT)의 메스로 해부하다.&rdquo;
                                </p>
                                <div className="mt-3 text-right text-[9px] text-gray-600 font-mono">— Sovereign Myeongsim Coaching System</div>
                            </div>

                            {/* 4 Phase Cards */}
                            <div className="space-y-3 mb-10">
                                <div className="text-[10px] font-mono text-gray-600 tracking-widest mb-2 px-1">4-PHASE MATRIX ARCHITECTURE</div>
                                {MATRIX_PHASES.map((phase, i) => {
                                    const colors = phaseColors[phase.color];
                                    return (
                                        <motion.button
                                            key={phase.code}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.08 * i + 0.3 }}
                                            onClick={() => handlePhaseClick(phase)}
                                            className={`relative w-full text-left p-5 rounded-2xl border ${colors.border} ${colors.bg} ${colors.glow} backdrop-blur-sm transition-all duration-300 group hover:scale-[1.01]`}
                                        >
                                            {/* Phase number accent */}
                                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${phase.gradientFrom} ${phase.gradientTo} rounded-l-2xl`}></div>
                                            
                                            <div className="flex items-center gap-4 pl-2">
                                                <div className="text-2xl">{phase.emoji}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${colors.pill}`}>PHASE {phase.id}</span>
                                                        <span className="text-xs font-bold text-white">{phase.code}</span>
                                                        <span className="text-[10px] text-gray-500">×</span>
                                                        <span className="text-[10px] text-gray-400">사주명리</span>
                                                    </div>
                                                    <div className={`text-sm font-bold ${colors.text} mb-0.5`}>{phase.subtitle}</div>
                                                    <div className="text-[11px] text-gray-500 truncate">{phase.koreanName} ({phase.fullName})</div>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-300 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Sample Cases */}
                            <div className="mb-8">
                                <div className="text-[10px] font-mono text-gray-600 tracking-widest mb-3 px-1">INTEGRATED CASE SIMULATION</div>
                                {SAMPLE_CASES.map((cs, i) => (
                                    <motion.button
                                        key={cs.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        onClick={() => handleCaseClick(cs)}
                                        className="w-full text-left p-4 rounded-2xl border border-gray-800/50 bg-black/20 mb-3 hover:border-gray-600/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-gray-700/50 flex items-center justify-center text-xs font-bold text-gray-300">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-gray-200 mb-0.5">{cs.title}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{cs.sajuProfile}</div>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ============= PHASE DETAIL ============= */}
                    {viewMode === 'PHASE_DETAIL' && selectedPhase && (
                        <motion.div
                            key="phase-detail"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto px-5 py-8"
                        >
                            {(() => {
                                const colors = phaseColors[selectedPhase.color];
                                return (
                                    <div className="space-y-5">
                                        {/* Hero */}
                                        <motion.div
                                            initial={{ scale: 0.95 }}
                                            animate={{ scale: 1 }}
                                            className={`relative p-6 rounded-3xl border ${colors.border} ${colors.bg} ${colors.glow} overflow-hidden`}
                                        >
                                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedPhase.gradientFrom} ${selectedPhase.gradientTo}`}></div>
                                            <div className="text-center">
                                                <div className="text-4xl mb-3">{selectedPhase.emoji}</div>
                                                <div className={`text-[10px] font-mono ${colors.pill} px-3 py-1 rounded-full border inline-block mb-2`}>PHASE {selectedPhase.id}</div>
                                                <h2 className={`text-lg font-black ${colors.text} mb-1`}>{selectedPhase.subtitle}</h2>
                                                <p className="text-xs text-gray-400">{selectedPhase.code} · {selectedPhase.koreanName}</p>
                                                <p className="text-[10px] text-gray-600 mt-1">{selectedPhase.fullName}</p>
                                            </div>
                                        </motion.div>

                                        {/* Fusion Principle */}
                                        <div className={`p-5 rounded-2xl border ${colors.border} bg-black/30`}>
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">🔬 융합 원리 (FUSION PRINCIPLE)</div>
                                            <p className="text-[13px] text-gray-200 leading-relaxed break-keep">{selectedPhase.fusionPrinciple}</p>
                                        </div>

                                        {/* Mechanism */}
                                        <div className="p-5 rounded-2xl border border-gray-800/50 bg-black/20">
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">⚙️ 작동 방식 (MECHANISM)</div>
                                            <p className="text-[13px] text-gray-300 leading-relaxed break-keep">{selectedPhase.mechanism}</p>
                                        </div>

                                        {/* Coaching Voice */}
                                        <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bg} relative overflow-hidden`}>
                                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${selectedPhase.gradientFrom} ${selectedPhase.gradientTo}`}></div>
                                            <div className="pl-2">
                                                <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">💬 명심 마스터 화법 (COACHING VOICE)</div>
                                                <p className={`text-[14px] font-medium ${colors.text} leading-relaxed break-keep italic`}>
                                                    &ldquo;{selectedPhase.coachingVoice}&rdquo;
                                                </p>
                                            </div>
                                        </div>

                                        {/* Two Column: Saju Mapping + Science */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl border border-gray-800/50 bg-black/20">
                                                <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-wider">☯️ 사주명리 대응</div>
                                                <p className="text-[12px] text-gray-400 leading-relaxed break-keep">{selectedPhase.sajuMapping}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl border border-gray-800/50 bg-black/20">
                                                <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-wider">🧠 심리학 근거</div>
                                                <p className="text-[12px] text-gray-400 leading-relaxed break-keep">{selectedPhase.psychScience}</p>
                                            </div>
                                        </div>

                                        {/* User Experience */}
                                        <div className="p-5 rounded-2xl border border-gray-800/50 bg-[#0B0F19]/60">
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">📱 사용자 체험 시나리오</div>
                                            <p className="text-[13px] text-gray-300 leading-relaxed break-keep">{selectedPhase.userExperience}</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    )}

                    {/* ============= CASE STUDY ============= */}
                    {viewMode === 'CASE_STUDY' && selectedCase && (
                        <motion.div
                            key="case-study"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto px-5 py-8"
                        >
                            {/* Case Hero */}
                            <div className="relative p-5 rounded-2xl border border-gray-700/40 bg-[#0B0F19]/80 mb-6 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-violet-500 via-sky-500 to-amber-500"></div>
                                <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-wider">INTEGRATED CASE SIMULATION</div>
                                <h3 className="text-lg font-black text-white mb-1">{selectedCase.title}</h3>
                                <p className="text-xs text-gray-400 font-mono">{selectedCase.sajuProfile}</p>
                            </div>

                            {/* Dark Code (Problem) */}
                            <div className="p-4 rounded-2xl border border-red-900/30 bg-red-950/10 mb-6">
                                <div className="text-[10px] font-mono text-red-500/70 mb-2 tracking-wider">🔴 다크 코드 (DARK CODE)</div>
                                <p className="text-[13px] text-red-200 break-keep italic">{selectedCase.darkCode}</p>
                            </div>

                            {/* Phase Navigator */}
                            <div className="flex gap-1 mb-5 bg-black/30 rounded-xl p-1 border border-gray-800/50">
                                {MATRIX_PHASES.map((phase) => {
                                    const isActive = activeCasePhase === phase.id;
                                    const colors = phaseColors[phase.color];
                                    return (
                                        <button
                                            key={phase.id}
                                            onClick={() => setActiveCasePhase(phase.id)}
                                            className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all duration-300 flex flex-col items-center gap-0.5 ${
                                                isActive
                                                    ? `${colors.bg} ${colors.text} ${colors.border} border`
                                                    : 'text-gray-600 hover:text-gray-400'
                                            }`}
                                        >
                                            <span>{phase.emoji}</span>
                                            <span>{phase.code}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Phase Content */}
                            <AnimatePresence mode="wait">
                                {(() => {
                                    const phaseData = MATRIX_PHASES.find(p => p.id === activeCasePhase)!;
                                    const colors = phaseColors[phaseData.color];
                                    const caseTexts: Record<number, string> = {
                                        1: selectedCase.phase1_cbt,
                                        2: selectedCase.phase2_mbct,
                                        3: selectedCase.phase3_dbt,
                                        4: selectedCase.phase4_act,
                                    };
                                    return (
                                        <motion.div
                                            key={`case-phase-${activeCasePhase}`}
                                            initial={{ opacity: 0, x: 15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -15 }}
                                            className={`p-5 rounded-2xl border ${colors.border} ${colors.bg} ${colors.glow} relative overflow-hidden mb-6`}
                                        >
                                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${phaseData.gradientFrom} ${phaseData.gradientTo}`}></div>
                                            <div className="pl-2">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-lg">{phaseData.emoji}</span>
                                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${colors.pill}`}>PHASE {phaseData.id}: {phaseData.code}</span>
                                                    <span className={`text-xs font-bold ${colors.text}`}>{phaseData.subtitle}</span>
                                                </div>
                                                <p className="text-[13px] text-gray-200 leading-relaxed break-keep">
                                                    {caseTexts[activeCasePhase]}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })()}
                            </AnimatePresence>

                            {/* Final Declaration (only show after viewing all phases or always) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-5 rounded-2xl border border-gray-700/40 bg-gradient-to-br from-[#0B0F19] to-[#111827] text-center"
                            >
                                <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">🏆 최종 주권 선언문 (SOVEREIGN DECLARATION)</div>
                                <p className="text-[14px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-violet-300 via-sky-300 to-amber-300 leading-relaxed break-keep">
                                    &ldquo;{selectedCase.finalDeclaration}&rdquo;
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="relative z-10 p-4 border-t border-gray-800/50 bg-[#070A12]/90 backdrop-blur-md">
                <div className="max-w-2xl mx-auto text-center text-[10px] text-gray-600 font-mono tracking-widest">
                    SOVEREIGN_4D_MIND_HACKING_MATRIX // CBT × MBCT × DBT × ACT × 사주명리
                </div>
            </footer>
        </div>
    );
}
