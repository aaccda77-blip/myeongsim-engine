'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VALUE_DATABASE, ValueProfile } from '@/modules/SocialValueModule';

type Phase = 'SELECT' | 'REVEAL';

export default function SocialValueDiscovery() {
    const [phase, setPhase] = useState<Phase>('SELECT');
    const [selectedProfile, setSelectedProfile] = useState<ValueProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'value' | 'mission' | 'action'>('value');

    const handleSelect = (profile: ValueProfile) => {
        setSelectedProfile(profile);
        setActiveTab('value');
        setPhase('REVEAL');
    };

    const handleBack = () => {
        setPhase('SELECT');
        setSelectedProfile(null);
    };

    // Element selector button styles
    const elementButtonStyles: Record<string, string> = {
        growth: 'border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        ignition: 'border-orange-500/40 hover:border-orange-400 hover:bg-orange-950/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]',
        secure: 'border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        decision: 'border-slate-400/40 hover:border-slate-300 hover:bg-slate-900/30 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]',
        deep: 'border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    };

    // Accent colors for revealed state
    const accentColors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
        growth: { text: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.1)]' },
        ignition: { text: 'text-orange-300', border: 'border-orange-500/30', bg: 'bg-orange-950/20', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.1)]' },
        secure: { text: 'text-amber-300', border: 'border-amber-500/30', bg: 'bg-amber-950/20', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.1)]' },
        decision: { text: 'text-slate-300', border: 'border-slate-400/30', bg: 'bg-slate-900/20', glow: 'shadow-[0_0_30px_rgba(148,163,184,0.1)]' },
        deep: { text: 'text-cyan-300', border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.1)]' },
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#070A12] text-gray-200 font-sans relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>
            {/* Ambient glow */}
            <div className="fixed top-[-20%] right-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-teal-700/8 rounded-full blur-[150px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-15%] left-[-10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-amber-700/8 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Header */}
            <header className="relative z-10 p-4 border-b border-teal-900/40 bg-black/40 backdrop-blur-md">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {phase === 'REVEAL' && (
                            <button onClick={handleBack} className="mr-2 text-gray-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        )}
                        <span className="text-xl">🌏</span>
                        <div>
                            <h1 className="text-sm font-bold text-teal-200">사회적 가치 발견</h1>
                            <p className="text-[10px] text-teal-500/70 font-mono">SOCIAL_VALUE_DISCOVERY v1.0</p>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full border border-teal-600/30 text-[10px] font-mono tracking-widest text-teal-500 bg-teal-950/20">
                        DEMO
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 relative z-10 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                    {phase === 'SELECT' && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl mx-auto px-5 py-10"
                        >
                            {/* Intro */}
                            <div className="text-center mb-10">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="text-5xl mb-5"
                                >
                                    🌏
                                </motion.div>
                                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-amber-200 mb-3">
                                    나의 사회적 가치 발견하기
                                </h2>
                                <p className="text-sm text-gray-400 leading-relaxed break-keep max-w-sm mx-auto">
                                    당신의 코어 드라이브(Core Drive)를 선택하면, 명심 마스터가 그 에너지를 
                                    <strong className="text-teal-300"> &apos;세상에 줄 수 있는 선물&apos;</strong>로 재정의해 드립니다.
                                </p>
                            </div>

                            {/* Element Selector Cards */}
                            <div className="grid grid-cols-1 gap-4">
                                {VALUE_DATABASE.map((profile, i) => (
                                    <motion.button
                                        key={profile.elementKey}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i + 0.3 }}
                                        onClick={() => handleSelect(profile)}
                                        className={`relative w-full text-left p-5 rounded-2xl border bg-black/30 backdrop-blur-sm transition-all duration-300 group ${elementButtonStyles[profile.elementKey]}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">{profile.emoji}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-base font-bold text-white">{profile.elementName}</span>
                                                    <span className="text-[10px] font-mono text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">{profile.elementHanja}</span>
                                                </div>
                                                <div className="text-xs text-gray-400">{profile.archetype}</div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-300 transition-colors transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footnote */}
                            <div className="mt-10 text-center text-[10px] text-gray-600 font-mono">
                                ※ 데모 버전: 코어 드라이브를 직접 선택합니다. 정식 버전에서는 명식 분석을 통해 자동 판별됩니다.
                            </div>
                        </motion.div>
                    )}

                    {phase === 'REVEAL' && selectedProfile && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-2xl mx-auto px-5 py-8"
                        >
                            {/* Hero Card */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                                className={`relative p-6 rounded-3xl border ${accentColors[selectedProfile.elementKey].border} ${accentColors[selectedProfile.elementKey].bg} ${accentColors[selectedProfile.elementKey].glow} overflow-hidden mb-6`}
                            >
                                {/* Decorative bar */}
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedProfile.gradientFrom} ${selectedProfile.gradientTo}`}></div>
                                
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                        className="text-5xl mb-4"
                                    >
                                        {selectedProfile.emoji}
                                    </motion.div>
                                    <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-widest">YOUR SOCIAL VALUE ARCHETYPE</div>
                                    <h2 className={`text-xl font-black ${accentColors[selectedProfile.elementKey].text} mb-1`}>
                                        {selectedProfile.archetype}
                                    </h2>
                                    <p className="text-xs text-gray-400">{selectedProfile.elementName} · {selectedProfile.coreValue}</p>
                                </div>
                            </motion.div>

                            {/* Tab Navigation */}
                            <div className="flex gap-1 mb-6 bg-black/30 rounded-xl p-1 border border-gray-800/50">
                                {(['value', 'mission', 'action'] as const).map((tab) => {
                                    const labels = { value: '💎 가치 수용', mission: '🚀 사회적 미션', action: '⚡ 오늘의 실천' };
                                    const isActive = activeTab === tab;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${
                                                isActive
                                                    ? `${accentColors[selectedProfile.elementKey].bg} ${accentColors[selectedProfile.elementKey].text} ${accentColors[selectedProfile.elementKey].border} border`
                                                    : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                        >
                                            {labels[tab]}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'value' && (
                                    <motion.div
                                        key="tab-value"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-5"
                                    >
                                        {/* Reframing Message */}
                                        <div className={`p-5 rounded-2xl border ${accentColors[selectedProfile.elementKey].border} bg-black/30`}>
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">관점 전환 (REFRAMING)</div>
                                            <p className="text-[13px] text-gray-200 leading-relaxed break-keep">
                                                {selectedProfile.reframingMessage}
                                            </p>
                                        </div>

                                        {/* Psychology Insight */}
                                        <div className="p-5 rounded-2xl border border-gray-800/50 bg-black/20">
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">🧠 심리학적 통찰</div>
                                            <p className="text-[13px] text-gray-300 leading-relaxed break-keep italic">
                                                {selectedProfile.psychInsight}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'mission' && (
                                    <motion.div
                                        key="tab-mission"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-5"
                                    >
                                        {/* Mission Declaration */}
                                        <div className={`p-6 rounded-2xl border ${accentColors[selectedProfile.elementKey].border} ${accentColors[selectedProfile.elementKey].bg} relative overflow-hidden`}>
                                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${selectedProfile.gradientFrom} ${selectedProfile.gradientTo}`}></div>
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">🏴 나의 사회적 미션 선언문</div>
                                            <p className={`text-[15px] font-bold ${accentColors[selectedProfile.elementKey].text} leading-relaxed break-keep`}>
                                                &ldquo;{selectedProfile.socialMission}&rdquo;
                                            </p>
                                        </div>

                                        {/* Master Quote */}
                                        <div className="p-5 rounded-2xl border border-gray-800/50 bg-[#0B0F19]/60">
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">💬 명심 마스터의 한 마디</div>
                                            <p className="text-[13px] text-gray-300 leading-relaxed break-keep">
                                                {selectedProfile.masterQuote}
                                            </p>
                                            <div className="mt-3 text-right text-[10px] text-gray-600 font-mono">— SOVEREIGN MASTER</div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'action' && (
                                    <motion.div
                                        key="tab-action"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-5"
                                    >
                                        {/* Daily Action */}
                                        <div className={`p-6 rounded-2xl border ${accentColors[selectedProfile.elementKey].border} ${accentColors[selectedProfile.elementKey].bg}`}>
                                            <div className="text-[10px] font-mono text-gray-500 mb-3 tracking-wider">⚡ 오늘의 가치 실천 과제</div>
                                            <p className="text-[14px] text-gray-200 leading-relaxed break-keep font-medium">
                                                {selectedProfile.dailyAction}
                                            </p>
                                        </div>

                                        {/* CBT-style Thought Record */}
                                        <div className="p-5 rounded-2xl border border-gray-800/50 bg-black/20">
                                            <div className="text-[10px] font-mono text-gray-500 mb-4 tracking-wider">📝 인지 전환 기록 (CBT Thought Record)</div>
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-start">
                                                    <span className="shrink-0 w-6 h-6 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center text-[10px]">❌</span>
                                                    <div>
                                                        <div className="text-[10px] text-red-400/70 mb-1">부정적 자동사고 (Before)</div>
                                                        <div className="text-xs text-gray-400">&ldquo;나는 이 세상에 쓸모없는 존재야. 내가 뭘 해도 안 돼.&rdquo;</div>
                                                    </div>
                                                </div>
                                                <div className="w-px h-4 bg-gray-800 ml-3"></div>
                                                <div className="flex gap-3 items-start">
                                                    <span className={`shrink-0 w-6 h-6 rounded-full ${accentColors[selectedProfile.elementKey].bg} ${accentColors[selectedProfile.elementKey].border} border flex items-center justify-center text-[10px]`}>✨</span>
                                                    <div>
                                                        <div className={`text-[10px] mb-1 ${accentColors[selectedProfile.elementKey].text} opacity-70`}>가치 기반 재구성 (After)</div>
                                                        <div className={`text-xs ${accentColors[selectedProfile.elementKey].text}`}>
                                                            &ldquo;나는 {selectedProfile.elementName}의 에너지를 가진 <strong>{selectedProfile.archetype}</strong>이다. 
                                                            나의 존재는 {selectedProfile.coreValue}로서 세상에 기여한다.&rdquo;
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Encouragement */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-center py-4"
                                        >
                                            <p className="text-xs text-gray-500 break-keep">
                                                당신의 {selectedProfile.elementName} 에너지는 결핍이 아닙니다.<br />
                                                <span className={`font-bold ${accentColors[selectedProfile.elementKey].text}`}>세상이 당신에게 부여한 고유한 선물</span>입니다.
                                            </p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="relative z-10 p-4 border-t border-gray-800/50 bg-[#070A12]/90 backdrop-blur-md">
                <div className="max-w-2xl mx-auto text-center text-[10px] text-gray-600 font-mono tracking-widest">
                    MYEONGSIM_SOCIAL_VALUE // DEMO v1.0
                </div>
            </footer>
        </div>
    );
}
