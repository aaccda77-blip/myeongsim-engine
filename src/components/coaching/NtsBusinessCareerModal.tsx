'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Briefcase, Copy, Check, ChevronRight,
    TrendingUp, Shield, FileText, CheckCircle2, Crown,
    Award, ArrowRight, Building, HelpCircle, Layers, Zap,
    Cpu, BookOpen, Compass, Globe, Server, Database, BarChart3,
    HeartPulse, Clock, AlertTriangle, MessageSquare, Flame, CheckCheck
} from 'lucide-react';
import {
    generateNtsBusinessArchitecture,
    GOLDEN_ROLE_MODEL_REPORT,
    NtsBusinessArchitectureReport
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
    const [viewRoleModel, setViewRoleModel] = useState<boolean>(false);

    if (!isOpen) return null;

    const currentProfile: NtsBusinessArchitectureReport = viewRoleModel
        ? GOLDEN_ROLE_MODEL_REPORT
        : generateNtsBusinessArchitecture(userProfile);

    const handleCopyCode = (code: string, label: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(`${label} [${code}]`);
        setTimeout(() => setCopiedCode(null), 2200);
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
                                🏛️ [비즈니스 설계] 5단계 웰니스 심층 리포트 & 1:1 어시스턴트
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

                    {/* Header Banner */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0 mt-0.5">
                                💼
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                                        {currentProfile.sajuSummaryText}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                                    {currentProfile.userName}님의 [1:1 비즈니스 아키텍처 & 국세청 업종 매핑]
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
                            Step 1. 아키타입
                        </button>
                        <button
                            onClick={() => setActiveTab('step2')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step2'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Step 2. 업종 매핑
                        </button>
                        <button
                            onClick={() => setActiveTab('step3')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step3'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Step 3. 번아웃 방지
                        </button>
                        <button
                            onClick={() => setActiveTab('step4')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step4'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Step 4. 실전 행정
                        </button>
                        <button
                            onClick={() => setActiveTab('step5')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'step5'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Step 5. 스케일업
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
                                    <span>비즈니스 페르소나 도출 (1차 정체성)</span>
                                </div>
                                <h4 className="text-base sm:text-lg font-black text-white">
                                    &quot;{currentProfile.identityTitle}&quot;
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    세상과 상호작용할 때 가장 저항이 적은 1차 정체성으로, 단순 프리랜서를 넘어 지식재산권(IP)과 소프트웨어/플랫폼 인프라를 결합하여 레버리지를 일으킵니다.
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
                                    <span>현대 인지과학적 3대 강점 번역</span>
                                </div>
                                <div className="space-y-2">
                                    {currentProfile.coreCompetencies.map((comp, idx) => (
                                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                            <div className="flex items-center justify-between text-[11.5px]">
                                                <span className="font-black text-white">{comp.title}</span>
                                                <span className="text-amber-400 font-mono font-bold text-[10px] bg-amber-400/10 px-2 py-0.5 rounded">
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
                            {/* Complete Taxonomy Mapping Table */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/40 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                        <Layers className="w-4 h-4 text-emerald-400" />
                                        <span>국가 표준 업태 · 종목 최적화 매핑 (Taxonomy Mapping)</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                        홈택스 등록용 표준 코드
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-[10.5px] text-gray-400 bg-slate-950/80">
                                                <th className="p-2.5">분류</th>
                                                <th className="p-2.5">추천 국세청 업태</th>
                                                <th className="p-2.5">세부 종목명 및 업종코드</th>
                                                <th className="p-2.5">비즈니스 모델 연계</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/80 text-[11px]">
                                            {currentProfile.taxonomyTable.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-2.5 font-bold text-amber-300 whitespace-nowrap">
                                                        {row.classification}
                                                    </td>
                                                    <td className="p-2.5 text-white font-medium whitespace-nowrap">
                                                        {row.mainIndustry}
                                                    </td>
                                                    <td className="p-2.5 space-y-1">
                                                        {row.subIndustryAndCodes.map((sub, sIdx) => (
                                                            <div key={sIdx} className="flex items-center justify-between gap-1.5 bg-slate-950 p-1.5 rounded border border-slate-800">
                                                                <span className="text-gray-200">
                                                                    • {sub.name} <strong className="text-emerald-400 font-mono">({sub.code})</strong>
                                                                </span>
                                                                <button
                                                                    onClick={() => handleCopyCode(sub.code, sub.name)}
                                                                    className="px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30 transition-all cursor-pointer shrink-0"
                                                                >
                                                                    복사
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="p-2.5 text-gray-300 text-[10.5px] leading-relaxed">
                                                        {row.businessModel}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Detailed 3 Business Sections */}
                            <div className="grid grid-cols-1 gap-3">
                                {/* 주업종 1 */}
                                <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-amber-300">
                                            {currentProfile.primaryBusiness1.sectionTitle}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            업태: {currentProfile.primaryBusiness1.mainCategory}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                                        💡 {currentProfile.primaryBusiness1.matchReason}
                                    </p>
                                </div>

                                {/* 주업종 2 */}
                                <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-emerald-300">
                                            {currentProfile.primaryBusiness2.sectionTitle}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            업태: {currentProfile.primaryBusiness2.mainCategory}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                                        💡 {currentProfile.primaryBusiness2.matchReason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 3: 번아웃 방지 & 에너지 효율화 가이드 (Energy Flow)
                        ======================================================== */}
                    {activeTab === 'step3' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* Cognitive Trap Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border-2 border-rose-500/40 space-y-3">
                                <div className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    <span>주의해야 할 인지적 함정 (Cognitive Traps)</span>
                                </div>

                                <div className="space-y-2.5">
                                    {currentProfile.burnoutGuide.cognitiveTrap.map((trap, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                                            <div className="font-black text-white flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px]">
                                                    !
                                                </span>
                                                <span>{trap.title}</span>
                                            </div>
                                            <p className="text-gray-400 text-[11px] pl-6">
                                                ⚠️ <strong>위험 요인:</strong> {trap.risk}
                                            </p>
                                            <p className="text-rose-200 text-[11px] pl-6 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                                                🛡️ <strong>행동 처방:</strong> {trap.prescription}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Rhythm Optimization Protocol */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span>일일 리듬 최적화 프로토콜 (Daily Energy Flow)</span>
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
                        </div>
                    )}

                    {/* ========================================================
                        STEP 4: 원클릭 실전 행정 & 인허가 블루프린트
                        ======================================================== */}
                    {activeTab === 'step4' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* Registration Combination Table */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                                    <Building className="w-3.5 h-3.5 text-amber-400" />
                                    <span>사업자등록 신청 권장 완성형 조합표</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-[11px]">
                                    <div>
                                        <span className="text-amber-400 font-bold">📌 주업태 / 주종목:</span>
                                        <div className="text-white font-mono font-bold mt-0.5 pl-2">
                                            {currentProfile.hometaxRegistrationGuide.mainSelection}
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-800 pt-2">
                                        <span className="text-cyan-400 font-bold">📌 부업태 / 부종목 (복수 등록):</span>
                                        <div className="space-y-1 mt-1 pl-2 text-gray-300 font-mono">
                                            {currentProfile.hometaxRegistrationGuide.subSelections.map((sub, idx) => (
                                                <div key={idx} className="flex items-start gap-1">
                                                    <span className="text-cyan-400">•</span>
                                                    <span>{sub}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

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

                            {/* Tax Benefits Alert */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-500/40 space-y-1.5">
                                <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>창업 중소기업 세액감면 가이드 (최대 50~100% 감면)</span>
                                </div>
                                <p className="text-gray-300 text-[11px] leading-relaxed">
                                    {currentProfile.hometaxRegistrationGuide.taxBenefits}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        STEP 5: 3단계 스케일업 로드맵 (Zero to Infinity)
                        ======================================================== */}
                    {activeTab === 'step5' && (
                        <div className="space-y-3.5 animate-fade-in text-xs">
                            {currentProfile.scaleUpRoadmap.map((step, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 hover:border-purple-500/30 transition-all">
                                    <div className="flex items-center justify-between text-amber-300 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-[10px] border border-purple-500/40">
                                                {idx + 1}
                                            </span>
                                            <span className="text-white font-black">{step.phase}</span>
                                        </span>
                                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/30">
                                            {step.keyword}
                                        </span>
                                    </div>

                                    <p className="text-gray-200 text-xs leading-relaxed font-sans bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                                        🎯 <strong>핵심 액션:</strong> {step.coreAction}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                        <div className="p-2 rounded-lg bg-slate-950/60 text-emerald-300 leading-snug">
                                            🌟 <strong>사주 엔진:</strong> {step.sajuEngine}
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-950/60 text-cyan-300 leading-snug">
                                            🚀 <strong>레버리지:</strong> {step.leveragePoint}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Copy Alert Toast */}
                    {copiedCode && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-bold text-center animate-fade-in shadow-lg">
                            ✨ {copiedCode}가 클립보드에 복사되었습니다! 홈택스 신청서에 바로 붙여넣으세요.
                        </div>
                    )}

                    {/* ========================================================
                        4. 챗봇 연계 1:1 실시간 어시스턴트 고도화
                        ======================================================== */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border-2 border-indigo-500/40 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                                <MessageSquare className="w-4 h-4 text-indigo-400" />
                                <span>내 비즈니스 설계 챗봇에게 실시간 질문하기</span>
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
                                    `내 비즈니스 정체성("${currentProfile.identityTitle}")과 국세청 업종(데이터베이스/온라인정보 724000, 경영컨설팅 741400, 교육출판 930921)을 바탕으로, 1인 지식 플랫폼 30일 론칭 사업계획서를 1:1로 코칭해 줘!`
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
