'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VALUE_DATABASE, ValueProfile } from '@/modules/SocialValueModule';
import { useReportStore } from '@/store/useReportStore';

// ─────────────────────────────────────────────
// 일간(天干) → 오행(五行) → elementKey 매핑
// ─────────────────────────────────────────────
const DAYMASTER_TO_ELEMENT: Record<string, string> = {
    // 목(木) → growth
    '갑': 'growth', '甲': 'growth',
    '을': 'growth', '乙': 'growth',
    // 화(火) → ignition
    '병': 'ignition', '丙': 'ignition',
    '정': 'ignition', '丁': 'ignition',
    // 토(土) → secure
    '무': 'secure', '戊': 'secure',
    '기': 'secure', '己': 'secure',
    // 금(金) → decision
    '경': 'decision', '庚': 'decision',
    '신': 'decision', '辛': 'decision',
    // 수(水) → deep
    '임': 'deep', '壬': 'deep',
    '계': 'deep', '癸': 'deep',
};

// ── 사주 데이터 공망 추출 헬퍼 ──
function checkGongmangActive(reportData: any): boolean {
    if (!reportData) return false;
    const saju = reportData.saju?.fourPillars || reportData.saju || reportData.fourPillars || reportData;
    
    // 일간, 일지
    let dayStem = saju.day?.gan || saju.dayPillar?.charAt(0) || '';
    let dayBranch = saju.day?.ji || saju.dayPillar?.charAt(1) || '';
    
    // dayMaster 문자열 fallback ("甲" 등만 있을 경우 일지 없음)
    if (!dayStem && typeof saju.dayMaster === 'string') dayStem = saju.dayMaster.charAt(0);
    
    if (!dayStem || !dayBranch) return false;
    
    const STEMS = ['갑','을','병','정','무','기','경','신','임','계', '甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const BRANCHES = ['자','축','인','묘','진','사','오','미','신','유','술','해', '子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    
    let sIdx = STEMS.indexOf(dayStem);
    if(sIdx >= 10) sIdx -= 10; // 한글 매핑용
    
    let bIdx = BRANCHES.indexOf(dayBranch);
    if(bIdx >= 12) bIdx -= 12; // 한글 매핑용
    
    if (sIdx === -1 || bIdx === -1) return false;
    
    const diff = (bIdx - sIdx + 12) % 12;
    const g1 = BRANCHES[(diff + 10) % 12];
    const g2 = BRANCHES[(diff + 11) % 12];
    const g1H = BRANCHES[((diff + 10) % 12) + 12]; // 한자
    const g2H = BRANCHES[((diff + 11) % 12) + 12]; // 한자
    
    const yearB = saju.year?.ji || saju.yearPillar?.charAt(1) || '';
    const monthB = saju.month?.ji || saju.monthPillar?.charAt(1) || '';
    const timeB = saju.time?.ji || saju.hour?.ji || saju.timePillar?.charAt(1) || saju.hourPillar?.charAt(1) || '';
    
    const grounds = [yearB, monthB, timeB];
    return grounds.includes(g1) || grounds.includes(g2) || grounds.includes(g1H) || grounds.includes(g2H);
}

type Phase = 'SELECT' | 'REVEAL';

export default function SocialValueDiscovery() {
    const reportData = useReportStore((s) => s.reportData);
    const [phase, setPhase] = useState<Phase>('SELECT');
    const [selectedProfile, setSelectedProfile] = useState<ValueProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'value' | 'mission' | 'action' | 'ai'>('value');

    // ── AI 코칭 리포트 관련 상태 ──
    type AiReport = {
        career_analysis: string;
        meta_awareness: string;
        socratic_questions: string[];
        coaching_strategy: string;
        action_plan: string;
        gongmang_insight?: string;
    };
    const [userConcern, setUserConcern] = useState('');
    const [aiReport, setAiReport] = useState<AiReport | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    // ── 사주 데이터에서 일간 자동 추출 ──
    const autoElementKey = useMemo(() => {
        if (!reportData?.saju) return null;
        // dayMaster 필드 우선, 없으면 fourPillars.day.gan에서 추출
        const dayMaster =
            reportData.saju.dayMaster ||
            reportData.saju.fourPillars?.day?.gan ||
            '';
        // 한자 한 글자만 추출 (예: "甲木" → "甲")
        const firstChar = dayMaster.trim().charAt(0);
        return DAYMASTER_TO_ELEMENT[firstChar] || null;
    }, [reportData]);

    // ── 사주 데이터가 있으면 자동으로 REVEAL 단계로 ──
    useEffect(() => {
        if (autoElementKey && phase === 'SELECT') {
            const profile = VALUE_DATABASE.find((v) => v.elementKey === autoElementKey);
            if (profile) {
                setSelectedProfile(profile);
                setActiveTab('value');
                setPhase('REVEAL');
            }
        }
    }, [autoElementKey, phase]);

    // 사용자 이름 (표시용)
    const userName = reportData?.userName || '소버린';

    // 사주 일간 표시용 한자 (예: 甲, 乙...)
    const dayMasterChar = useMemo(() => {
        if (!reportData?.saju) return '';
        const dm = reportData.saju.dayMaster || reportData.saju.fourPillars?.day?.gan || '';
        return dm.trim().charAt(0);
    }, [reportData]);

    const isGongmang = useMemo(() => checkGongmangActive(reportData), [reportData]);

    const handleSelect = (profile: ValueProfile) => {
        setSelectedProfile(profile);
        setActiveTab('value');
        setPhase('REVEAL');
        // AI 리포트 초기화
        setAiReport(null);
        setAiError('');
        setUserConcern('');
    };

    // ── AI 코칭 리포트 생성 핸들러 ──
    const handleGenerateAiReport = async () => {
        if (aiLoading) return;
        setAiLoading(true);
        setAiError('');
        setAiReport(null);
        try {
            const res = await fetch('/api/social-coaching', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sajuData: reportData?.saju || reportData,
                    userConcern: userConcern.trim(),
                    isGongmang,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.report) throw new Error(data.error || 'AI 응답 오류');
            setAiReport(data.report);
        } catch (e: any) {
            setAiError(e.message || 'AI 코칭 리포트 생성에 실패했습니다.');
        } finally {
            setAiLoading(false);
        }
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
                        {phase === 'REVEAL' && !autoElementKey && (
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
                    {autoElementKey ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-600/40 text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {dayMasterChar}일간 자동연동
                        </div>
                    ) : (
                        <div className="px-3 py-1.5 rounded-full border border-gray-700/40 text-[10px] font-mono tracking-widest text-gray-500 bg-gray-950/20">
                            수동 선택
                        </div>
                    )}
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
                                <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/20 border border-yellow-500/30">
                                    <span className="text-yellow-400 text-xs">⚠️</span>
                                    <span className="text-yellow-300/80 text-xs">만세력 사주 정보가 없습니다.<br />코어 드라이브를 직접 선택해 주세요.</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed break-keep max-w-sm mx-auto">
                                    코어 드라이브(Core Drive)를 선택하면, 명심 마스터가 그 에너지를
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
                                ※ 사주 데이터가 없어 수동 선택 모드입니다. 만세력에서 생년월일시를 입력하면 자동 판별됩니다.
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
                                    {/* 사주 자동 연동 배지 */}
                                    {autoElementKey && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 mb-3"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            {userName} 님 · {dayMasterChar}일간 · 사주 자동 판별
                                        </motion.div>
                                    )}
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
                                {(['value', 'mission', 'action', 'ai'] as const).map((tab) => {
                                    const labels = { value: '💎 가치 수용', mission: '🚀 사회적 미션', action: '⚡ 오늘의 실천', ai: '🤖 AI 코칭' };
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
                                        {/* 공망(Quantum Void) 활성화 시 추가 브리핑 */}
                                        {isGongmang && selectedProfile.gongmangMessage && (
                                            <div className="p-5 rounded-2xl border border-purple-500/30" style={{ background: 'rgba(168,85,247,0.05)' }}>
                                                <p className="text-[10px] font-bold text-purple-400 flex items-center gap-1.5 mb-2 tracking-wider">
                                                    <span className="text-sm">🌌</span> QUANTUM VOID ACTIVATED
                                                </p>
                                                <p className="text-[12px] text-purple-300/90 leading-relaxed italic break-keep">
                                                    {selectedProfile.gongmangMessage}
                                                </p>
                                            </div>
                                        )}

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

                                {/* ── AI 코칭 리포트 탭 ── */}
                                {activeTab === 'ai' && (
                                    <motion.div
                                        key="tab-ai"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-5"
                                    >
                                        {/* 고민/직업 입력 */}
                                        <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/10">
                                            <div className="text-[10px] font-mono text-indigo-400 mb-2 tracking-wider">🔬 명심 AI 코칭엔진 — 맞춤형 분석 시작</div>
                                            <p className="text-xs text-gray-400 mb-3 leading-relaxed break-keep">
                                                현재 관심 있는 직업, 커리어 고민, 또는 사회 기여 방향을 입력해 주세요.
                                                <span className="text-gray-600"> (비워두면 사주 기질만으로 분석합니다)</span>
                                            </p>
                                            <textarea
                                                value={userConcern}
                                                onChange={(e) => setUserConcern(e.target.value)}
                                                placeholder="예: 코칭 전문가로 활동하고 싶은데, 완벽하지 않으면 시작이 두렵습니다..."
                                                maxLength={300}
                                                rows={3}
                                                className="w-full bg-black/40 border border-indigo-500/20 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-400/50 resize-none"
                                            />
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-[10px] text-gray-600">{userConcern.length}/300</span>
                                                <button
                                                    onClick={handleGenerateAiReport}
                                                    disabled={aiLoading}
                                                    className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-50"
                                                    style={{ background: aiLoading ? '#1e1b4b' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff' }}
                                                >
                                                    {aiLoading ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            AI 분석 중...
                                                        </span>
                                                    ) : '🤖 AI 코칭 리포트 생성'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* 에러 */}
                                        {aiError && (
                                            <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/10 text-xs text-red-400">
                                                ⚠️ {aiError}
                                            </div>
                                        )}

                                        {/* AI 리포트 결과 */}
                                        {aiReport && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="space-y-4"
                                            >
                                                {/* 공망 인사이트 (조건부) */}
                                                {aiReport.gongmang_insight && (
                                                    <div className="p-5 rounded-2xl border border-purple-500/30" style={{ background: 'rgba(168,85,247,0.05)' }}>
                                                        <p className="text-[10px] font-bold text-purple-400 mb-2 flex items-center gap-1.5 tracking-wider">
                                                            <span>🌌</span> QUANTUM VOID INSIGHT
                                                        </p>
                                                        <p className="text-xs text-purple-300/90 leading-relaxed italic break-keep">{aiReport.gongmang_insight}</p>
                                                    </div>
                                                )}

                                                {/* 1. 사회적 기여 & 직업 분석 */}
                                                <div className="p-5 rounded-2xl border border-teal-500/20 bg-teal-950/5">
                                                    <div className="text-[10px] font-mono text-teal-400 mb-2 tracking-wider">01 / 사회적 기여 & 직업 분석</div>
                                                    <p className="text-[13px] text-gray-200 leading-relaxed break-keep">{aiReport.career_analysis}</p>
                                                </div>

                                                {/* 2. 알아차림 (인지 탈융합) */}
                                                <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-950/5">
                                                    <div className="text-[10px] font-mono text-amber-400 mb-2 tracking-wider">02 / 알아차림 — 인지 탈융합</div>
                                                    <p className="text-[13px] text-gray-200 leading-relaxed break-keep italic">&ldquo;{aiReport.meta_awareness}&rdquo;</p>
                                                </div>

                                                {/* 3. 산파술 질문 */}
                                                <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-950/5">
                                                    <div className="text-[10px] font-mono text-rose-400 mb-3 tracking-wider">03 / 산파술적 질문 (Socratic)</div>
                                                    <div className="space-y-3">
                                                        {aiReport.socratic_questions.map((q, i) => (
                                                            <div key={i} className="flex gap-3 items-start">
                                                                <span className="shrink-0 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[10px] font-bold text-rose-400">{i + 1}</span>
                                                                <p className="text-sm text-gray-200 leading-relaxed break-keep">{q}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 4. 코칭 전략 */}
                                                <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-950/5">
                                                    <div className="text-[10px] font-mono text-blue-400 mb-2 tracking-wider">04 / 맞춤형 코칭 전략</div>
                                                    <p className="text-[13px] text-gray-200 leading-relaxed break-keep">{aiReport.coaching_strategy}</p>
                                                </div>

                                                {/* 5. 액션 플랜 */}
                                                <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/5">
                                                    <div className="text-[10px] font-mono text-emerald-400 mb-2 tracking-wider">05 / 오늘의 액션 플랜</div>
                                                    <p className="text-[13px] text-gray-200 leading-relaxed break-keep">{aiReport.action_plan}</p>
                                                </div>

                                                {/* 다시 생성 버튼 */}
                                                <button
                                                    onClick={handleGenerateAiReport}
                                                    disabled={aiLoading}
                                                    className="w-full py-3 rounded-xl text-[11px] font-bold text-indigo-400 border border-indigo-500/20 hover:border-indigo-400/40 hover:bg-indigo-950/20 transition-all"
                                                >
                                                    🔄 리포트 다시 생성하기
                                                </button>
                                            </motion.div>
                                        )}

                                        {/* 초기 안내 (리포트 없을 때) */}
                                        {!aiReport && !aiLoading && !aiError && (
                                            <div className="text-center py-8 space-y-3">
                                                <div className="text-4xl">🤖</div>
                                                <p className="text-sm text-gray-500 break-keep">
                                                    위 입력창에 고민을 작성하고<br />
                                                    <span className="text-indigo-400 font-bold">AI 코칭 리포트 생성</span> 버튼을 누르세요.
                                                </p>
                                                <p className="text-[10px] text-gray-600 font-mono">
                                                    사주 기질 + 명심 AI = 5단계 맞춤형 코칭 리포트
                                                </p>
                                            </div>
                                        )}
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
