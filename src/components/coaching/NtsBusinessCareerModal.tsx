'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Briefcase, Copy, Check, ChevronRight,
    TrendingUp, Shield, FileText, CheckCircle2, Crown,
    Award, ArrowRight, Building, HelpCircle, Layers, Zap,
    Cpu, BookOpen, Compass, Globe, Server, Database, BarChart3,
    HeartPulse, Clock, AlertTriangle, MessageSquare, Flame, CheckCheck,
    Users, DollarSign, Target, Rocket, RefreshCw, Landmark, ExternalLink
} from 'lucide-react';
import {
    generateNtsBusinessArchitecture,
    PRE_STARTUP_REPORT,
    EARLY_STARTUP_REPORT,
    RE_FOUNDER_REPORT,
    NtsBusinessArchitectureReport,
    StartupStageType
} from '@/lib/engine/ntsBusinessRecommender';

interface NtsBusinessCareerModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
    onStartChatCoaching?: (prompt: string) => void;
}

export default function NtsBusinessCareerModal({
    isOpen,
    onClose,
    userProfile,
    onStartChatCoaching
}: NtsBusinessCareerModalProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5'>('step1');
    const [selectedStage, setSelectedStage] = useState<StartupStageType>('solo_pre');
    const [viewRoleModel, setViewRoleModel] = useState<boolean>(false);
    const [copiedPsst, setCopiedPsst] = useState<boolean>(false);

    if (!isOpen) return null;

    const currentProfile: NtsBusinessArchitectureReport = viewRoleModel
        ? (selectedStage === 'early_team' ? EARLY_STARTUP_REPORT : selectedStage === 're_founder' ? RE_FOUNDER_REPORT : PRE_STARTUP_REPORT)
        : generateNtsBusinessArchitecture(userProfile, selectedStage);

    const handleCopyCode = (code: string, label: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(`${label} [${code}]`);
        setTimeout(() => setCopiedCode(null), 2200);
    };

    const handleCopyPsstBlueprint = () => {
        const p = currentProfile.psstBlueprint;
        const text = `[중기부 표준 PSST 사업계획서 뼈대 - ${currentProfile.identityTitle}]\n\n`
            + `1. 문제 인식 (Problem)\n- 시장 문제점: ${p.problem.marketPainPoint}\n- 해결의 시급성: ${p.problem.urgency}\n\n`
            + `2. 실현 가능성 (Solution)\n- 핵심 MVP: ${p.solution.coreMvp}\n- 차별화 요소: ${p.solution.differentiation}\n\n`
            + `3. 성장 전략 (Scale-up)\n- 수익 모델(BM): ${p.scaleUp.businessModel}\n- 확장 로드맵: ${p.scaleUp.expansionRoadmap}\n\n`
            + `4. 팀 구성 (Team)\n- 대표자 강점: ${p.team.founderStrength}\n- 추천 인재 영입: ${p.team.recommendedHiring}`;
        
        navigator.clipboard.writeText(text);
        setCopiedPsst(true);
        setTimeout(() => setCopiedPsst(false), 2500);
    };

    const handlePromptClick = (promptText: string) => {
        onClose();
        if (onStartChatCoaching) {
            onStartChatCoaching(promptText);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 font-sans animate-fade-in text-left">
                <div className="bg-[#0c101c] border-2 border-amber-500/40 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.25)] relative text-white space-y-4 custom-scrollbar">
                    
                    {/* Top Status & Role Model Switch */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-mono font-bold text-amber-400">
                                🏛️ [비즈니스 설계] 경영지도사 연계 5단계 웰니스 컨설팅
                            </span>
                        </div>

                        {/* Switch: 내 명식 ↔ 베스트 롤모델 예시 */}
                        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10.5px] font-bold">
                            <button
                                onClick={() => setViewRoleModel(false)}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                    !viewRoleModel
                                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                ✨ 내 명식 분석
                            </button>
                            <button
                                onClick={() => setViewRoleModel(true)}
                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                    viewRoleModel
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                👑 롤모델 예시 (辛巳)
                            </button>
                        </div>
                    </div>

                    {/* Stage Selector: 3대 창업 생애주기 탭 */}
                    <div className="p-1 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-3 gap-1 text-center text-xs font-bold">
                        <button
                            onClick={() => setSelectedStage('solo_pre')}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedStage === 'solo_pre'
                                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border border-amber-500/50 shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>1인 지식 / 예비창업</span>
                        </button>
                        <button
                            onClick={() => setSelectedStage('early_team')}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedStage === 'early_team'
                                    ? 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 text-emerald-300 border border-emerald-500/50 shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <Rocket className="w-3.5 h-3.5" />
                            <span>초기 스타트업 창업</span>
                        </button>
                        <button
                            onClick={() => setSelectedStage('re_founder')}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedStage === 're_founder'
                                    ? 'bg-gradient-to-r from-purple-500/30 to-indigo-600/30 text-purple-300 border border-purple-500/50 shadow-md'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>재창업 · 피봇팅</span>
                        </button>
                    </div>

                    {/* Header Banner */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0 mt-0.5">
                                {selectedStage === 'early_team' ? '🚀' : selectedStage === 're_founder' ? '🔄' : '💼'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                                        {currentProfile.sajuSummaryText}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold">
                                        {selectedStage === 'early_team' ? '중기부 초창패·TIPS 연계' : selectedStage === 're_founder' ? '재도전성공패키지 연계' : '예비창업패키지 연계'}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                                    {currentProfile.userName}님의 [{currentProfile.identityTitle}]
                                </h3>
                                <p className="text-xs text-amber-200/90 font-medium">
                                    💡 {currentProfile.slogan}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* 5-Step Navigation Tabs */}
                    <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-center">
                        <button
                            onClick={() => setActiveTab('step1')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step1'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            1. 아키타입
                        </button>
                        <button
                            onClick={() => setActiveTab('step2')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step2'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            2. 국세청 매핑
                        </button>
                        <button
                            onClick={() => setActiveTab('step3')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step3'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            3. 경영지도 4대
                        </button>
                        <button
                            onClick={() => setActiveTab('step4')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step4'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            4. PSST 계획서
                        </button>
                        <button
                            onClick={() => setActiveTab('step5')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step5'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            5. 행정&스케일업
                        </button>
                    </div>

                    {/* ========================================================
                        STEP 1: 인지 하드웨어 & 비즈니스 아키타입 진단
                        ======================================================== */}
                    {activeTab === 'step1' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* Identity Title Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 space-y-1.5 shadow-inner">
                                <div className="text-amber-400 font-mono font-black flex items-center gap-1.5 text-[11px]">
                                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                                    <span>비즈니스 페르소나 도출 ({selectedStage === 'early_team' ? '팀 빌딩 리더' : selectedStage === 're_founder' ? '피봇팅 마스터' : '1인 기업가'})</span>
                                </div>
                                <h4 className="text-base sm:text-lg font-black text-white">
                                    &quot;{currentProfile.identityTitle}&quot;
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    {currentProfile.slogan}
                                </p>
                            </div>

                            {/* 4 Pillars Breakdown Grid */}
                            <div className="space-y-2">
                                <div className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                                    <span>기질 프로파일링: 십신과 오행의 에너지 흐름</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {currentProfile.pillarBreakdowns.map((p, idx) => (
                                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-amber-500/30 transition-all">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-amber-300">{p.pillarName}</span>
                                                <span className="font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                                                    {p.ganji}
                                                </span>
                                            </div>
                                            <div className="text-white font-bold text-xs leading-snug">
                                                {p.corePower}
                                            </div>
                                            <p className="text-gray-400 text-[11px] leading-relaxed">
                                                {p.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3 Core Competencies */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                <div className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    <span>현대 인지과학적 3대 비즈니스 강점</span>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.coreCompetencies.map((comp, idx) => (
                                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-bold text-white">{comp.title}</span>
                                                <span className="font-mono text-amber-400 text-[10.5px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                                    {comp.tenGodFormula}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-[11px] leading-relaxed">
                                                {comp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 2: 국가 표준 업태 · 종목 최적화 매핑 (Taxonomy Mapping)
                        ======================================================== */}
                    {activeTab === 'step2' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* Taxonomy Overview Table */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                        <Building className="w-4 h-4 text-emerald-400" />
                                        <span>국세청 업태·종목 최적화 매핑 (4대 분류 체계)</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">코드 클릭 시 즉시 복사</span>
                                </div>

                                <div className="space-y-2.5">
                                    {currentProfile.taxonomyTable.map((tax, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-md ${
                                                    tax.colorTheme === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                                    tax.colorTheme === 'cyan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                                                    tax.colorTheme === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                    {tax.classification}
                                                </span>
                                                <span className="font-bold text-white text-xs">{tax.mainIndustry}</span>
                                            </div>

                                            {/* Sub Codes Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {tax.subIndustryAndCodes.map((item, cIdx) => (
                                                    <button
                                                        key={cIdx}
                                                        onClick={() => handleCopyCode(item.code, item.name)}
                                                        className="p-2 rounded-lg bg-slate-900/90 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                                                    >
                                                        <span className="text-gray-300 text-[11px] truncate pr-2 group-hover:text-emerald-200">
                                                            {item.name}
                                                        </span>
                                                        <span className="font-mono font-bold text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded text-[10px] shrink-0 flex items-center gap-1">
                                                            {item.code} <Copy className="w-2.5 h-2.5 text-gray-500 group-hover:text-amber-300" />
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="text-[10.5px] text-gray-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                                                🚀 <strong>비즈니스 모델 연계:</strong> {tax.businessModel}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Primary Section 1 */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-400 font-bold">{currentProfile.primaryBusiness1.sectionTitle}</span>
                                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                                        {currentProfile.primaryBusiness1.badge}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-[11px]">
                                    {currentProfile.primaryBusiness1.realWorldApplication}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 3: 국가공인 경영지도사 4대 영역 융합 진단 (NEW)
                        ======================================================== */}
                    {activeTab === 'step3' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-blue-400" />
                                    <span className="font-bold text-blue-200">국가공인 경영지도사 4대 실무 영역 1:1 융합 진단</span>
                                </div>
                                <span className="text-[10px] text-blue-300 font-mono font-bold bg-blue-900/60 px-2 py-0.5 rounded">
                                    중기부 표준 체계
                                </span>
                            </div>

                            {/* 4 Areas Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* 1. Marketing */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                            <Target className="w-3.5 h-3.5" />
                                            <span>1. 마케팅 & 시장성</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                            {currentProfile.consultant4Areas.marketing.sajuEngine}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                        <p className="text-gray-300">🎯 <strong>타깃 고객:</strong> {currentProfile.consultant4Areas.marketing.targetCustomer}</p>
                                        <p className="text-gray-300">📢 <strong>세일즈 채널:</strong> {currentProfile.consultant4Areas.marketing.salesChannel}</p>
                                        <p className="text-emerald-300 bg-emerald-950/30 p-1.5 rounded border border-emerald-500/20">
                                            💡 <strong>전환 전략:</strong> {currentProfile.consultant4Areas.marketing.conversionStrategy}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. HR / Org */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>2. 인사 & 조직 관리</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                            {currentProfile.consultant4Areas.hrOrg.sajuEngine}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                        <p className="text-gray-300">👥 <strong>이상적 팀 역할:</strong> {currentProfile.consultant4Areas.hrOrg.idealTeamRole}</p>
                                        <p className="text-rose-300">⚠️ <strong>갈등 유발 요인:</strong> {currentProfile.consultant4Areas.hrOrg.conflictTrigger}</p>
                                        <p className="text-cyan-300 bg-cyan-950/30 p-1.5 rounded border border-cyan-500/20">
                                            🛡️ <strong>위임 프로토콜:</strong> {currentProfile.consultant4Areas.hrOrg.delegationProtocol}
                                        </p>
                                    </div>
                                </div>

                                {/* 3. Finance & Tax */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            <span>3. 재무 & 세무 제도</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                            {currentProfile.consultant4Areas.financeTax.sajuEngine}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                        <p className="text-emerald-300 font-bold">💰 <strong>세액감면:</strong> {currentProfile.consultant4Areas.financeTax.taxReductionRate}</p>
                                        <p className="text-gray-300">📍 <strong>최적 사업장:</strong> {currentProfile.consultant4Areas.financeTax.recommendedLocation}</p>
                                        <p className="text-gray-300">🏛️ <strong>법인 구조:</strong> {currentProfile.consultant4Areas.financeTax.legalStructure}</p>
                                    </div>
                                </div>

                                {/* 4. Gov Funding Target */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                                            <Landmark className="w-3.5 h-3.5" />
                                            <span>4. 정부지원사업 타겟팅</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                                            경쟁력 {currentProfile.consultant4Areas.govSupportTarget.competitivenessScore}점
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 text-[11px]">
                                        {currentProfile.consultant4Areas.govSupportTarget.recommendedPrograms.map((prog, pIdx) => (
                                            <div key={pIdx} className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-0.5">
                                                <div className="flex items-center justify-between font-bold text-white">
                                                    <span>{prog.name}</span>
                                                    <span className="text-amber-400 font-mono text-[10px]">{prog.targetFunding}</span>
                                                </div>
                                                <p className="text-gray-400 text-[10px]">📌 {prog.tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 4: 중기부 표준 PSST 사업계획서 뼈대 자동 생성 (NEW)
                        ======================================================== */}
                    {activeTab === 'step4' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-rose-400" />
                                    <span className="font-bold text-rose-200">중소벤처기업부 표준 PSST 사업계획서 자동 뼈대</span>
                                </div>
                                <button
                                    onClick={handleCopyPsstBlueprint}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 text-rose-300 font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer"
                                >
                                    {copiedPsst ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedPsst ? '복사 완료!' : 'PSST 전체 복사'}</span>
                                </button>
                            </div>

                            {/* PSST 4-Cards */}
                            <div className="space-y-3">
                                {/* P: Problem */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[10px] border border-amber-500/40">P</span>
                                        <span>{currentProfile.psstBlueprint.problem.title}</span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">⚠️ <strong>시장 문제점:</strong> {currentProfile.psstBlueprint.problem.marketPainPoint}</p>
                                        <p className="text-amber-200/90">⏱️ <strong>해결의 시급성:</strong> {currentProfile.psstBlueprint.problem.urgency}</p>
                                    </div>
                                </div>

                                {/* S: Solution */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-[10px] border border-emerald-500/40">S</span>
                                        <span>{currentProfile.psstBlueprint.solution.title}</span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">💡 <strong>핵심 MVP:</strong> {currentProfile.psstBlueprint.solution.coreMvp}</p>
                                        <p className="text-emerald-300">✨ <strong>차별화 요소:</strong> {currentProfile.psstBlueprint.solution.differentiation}</p>
                                    </div>
                                </div>

                                {/* S: Scale-up */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-[10px] border border-cyan-500/40">S</span>
                                        <span>{currentProfile.psstBlueprint.scaleUp.title}</span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">📈 <strong>비즈니스 모델(BM):</strong> {currentProfile.psstBlueprint.scaleUp.businessModel}</p>
                                        <p className="text-cyan-300">🚀 <strong>확장 로드맵:</strong> {currentProfile.psstBlueprint.scaleUp.expansionRoadmap}</p>
                                    </div>
                                </div>

                                {/* T: Team */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-[10px] border border-purple-500/40">T</span>
                                        <span>{currentProfile.psstBlueprint.team.title}</span>
                                    </div>
                                    <div className="space-y-1 text-[11px] pl-7">
                                        <p className="text-gray-300">👑 <strong>대표자 강점:</strong> {currentProfile.psstBlueprint.team.founderStrength}</p>
                                        <p className="text-purple-300">👥 <strong>추천 인재 영입:</strong> {currentProfile.psstBlueprint.team.recommendedHiring}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 5: 번아웃 방지, 실전 행정 & 스케일업 로드맵
                        ======================================================== */}
                    {activeTab === 'step5' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* 3-Step Admin Checklist */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>지자체 인허가 ➔ 홈택스 ➔ 통신판매업 3단계 순서도</span>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.hometaxRegistrationGuide.adminChecklist.map((chk, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-black text-amber-300">{chk.step}</span>
                                                <span className="font-mono text-gray-400 text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                                                    {chk.place}
                                                </span>
                                            </div>
                                            <p className="text-gray-200 text-[11px] leading-relaxed">
                                                {chk.action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Energy Protocol */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span>창업가 일일 리듬 최적화 프로토콜 (Burnout Prevention)</span>
                                </div>

                                <div className="space-y-2">
                                    {currentProfile.burnoutGuide.dailyRhythmProtocol.map((slot, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-black text-amber-300">{slot.timeSlot}</span>
                                                <span className="font-mono text-emerald-300 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                                    {slot.sajuElement}
                                                </span>
                                            </div>
                                            <div className="text-white font-bold text-xs">{slot.energyFocus}</div>
                                            <p className="text-gray-300 text-[11px] leading-relaxed">
                                                {slot.action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Scale-up 3 Phases */}
                            <div className="space-y-2">
                                <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                    <span>3단계 스케일업 로드맵 (Zero to Infinity)</span>
                                </div>
                                {currentProfile.scaleUpRoadmap.map((step, idx) => (
                                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                        <div className="flex items-center justify-between text-amber-300 font-bold">
                                            <span className="text-white font-black">{step.phase}</span>
                                            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded">
                                                {step.keyword}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-[11px]">
                                            🎯 <strong>핵심 액션:</strong> {step.coreAction}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Copy Alert Toast */}
                    {copiedCode && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-bold text-center animate-fade-in shadow-lg">
                            ✨ {copiedCode}가 클립보드에 복사되었습니다! 홈택스 신청서에 바로 붙여넣으세요.
                        </div>
                    )}

                    {/* AI Assistant */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border-2 border-indigo-500/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                                <MessageSquare className="w-4 h-4 text-indigo-400" />
                                <span>AI 경영지도사에게 1:1 실시간 질문하기</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">1-Tap 1:1 코칭</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {currentProfile.chatAssitantPrompts.map((cp, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePromptClick(cp.prompt)}
                                    className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-400/60 text-left transition-all cursor-pointer group active:scale-[0.98] space-y-1"
                                >
                                    <div className="font-bold text-white text-[11px] flex items-center justify-between">
                                        <span>{cp.icon} {cp.title}</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                    <p className="text-gray-400 text-[10px] line-clamp-2 leading-relaxed group-hover:text-gray-300">
                                        &quot;{cp.prompt}&quot;
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                        <button
                            onClick={() => {
                                handlePromptClick(
                                    `내 비즈니스 정체성("${currentProfile.identityTitle}")과 국세청 업종(724000/741400), 그리고 중기부 PSST 사업계획서 뼈대를 바탕으로, 실전 사업화 및 정부지원사업(예창패/초창패) 통과 전략을 1:1로 코칭해 줘!`
                                );
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <Briefcase className="w-4 h-4 fill-slate-950" />
                            <span>💼 이 아키텍처로 1:1 맞춤 사업계획서 코칭 시작하기 ↗</span>
                        </button>

                        <p className="text-[10px] text-gray-500 text-center">
                            💡 내면의 본질(Being)을 정의하고 현실의 행동(Doing)을 표준 행정 체계로 풀어내는 글로벌 웰니스 솔루션
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
