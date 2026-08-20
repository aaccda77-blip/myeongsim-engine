'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Briefcase, Copy, Check, ChevronRight,
    TrendingUp, Shield, FileText, CheckCircle2, Crown,
    Award, ArrowRight, Building, HelpCircle, Layers, Zap,
    Cpu, BookOpen, Compass, Globe, Server, Database, BarChart3
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
    const [activeTab, setActiveTab] = useState<'scan' | 'sync' | 'shift' | 'scaleup'>('scan');
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

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 font-sans animate-fade-in">
                <div className="bg-[#0c101c] border-2 border-amber-500/40 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.25)] relative text-white space-y-4 custom-scrollbar text-left">
                    
                    {/* Top Status & Role Model Switch */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-mono font-bold text-amber-400">
                                🏛️ 국세청 표준산업분류 1:1 비즈니스 아키텍처
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

                    {/* 4-Step Navigation Tabs (Scan ➔ Sync ➔ Shift ➔ Scale-up) */}
                    <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-center">
                        <button
                            onClick={() => setActiveTab('scan')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'scan'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            1. 기질 스캔 (Scan)
                        </button>
                        <button
                            onClick={() => setActiveTab('sync')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'sync'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            2. 국세청 업종 (Sync)
                        </button>
                        <button
                            onClick={() => setActiveTab('shift')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'shift'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            3. 행정 & 절세 (Shift)
                        </button>
                        <button
                            onClick={() => setActiveTab('scaleup')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'scaleup'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            4. 성장 전략 (Scale)
                        </button>
                    </div>

                    {/* ========================================================
                        TAB 1: 1. 비즈니스 기질 및 핵심 역량 스캔 (Scan)
                        ======================================================== */}
                    {activeTab === 'scan' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* Identity Title Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 space-y-1.5 shadow-inner">
                                <div className="text-amber-400 font-mono font-black flex items-center gap-1.5 text-[11px]">
                                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                                    <span>핵심 비즈니스 정체성 (Core Archetype)</span>
                                </div>
                                <h4 className="text-base sm:text-lg font-black text-white">
                                    "{currentProfile.identityTitle}"
                                </h4>
                                <p className="text-gray-300 leading-relaxed">
                                    단순 용역 프리랜서를 넘어, 지식재산권(IP)과 소프트웨어/플랫폼 인프라를 결합하여 고부가가치를 창출하는 솔루션 빌더입니다.
                                </p>
                            </div>

                            {/* 4 Pillars Breakdown Grid */}
                            <div className="space-y-2">
                                <div className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                                    <span>명식 4주(四柱) 팔자별 비즈니스 엔진 분해</span>
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
                                    <span>3대 핵심 비즈니스 역량 스캔</span>
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
                        TAB 2: 2. 맞춤 국세청 업태 · 종목 분류 매핑 (Sync)
                        ======================================================== */}
                    {activeTab === 'sync' && (
                        <div className="space-y-4 animate-fade-in text-xs">
                            {/* Business Architecture Diagram Card */}
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                <div className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px]">
                                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                                    <span>[비즈니스 아키텍처 구조도]</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono space-y-1.5 text-gray-300 leading-relaxed">
                                    <div className="text-amber-300 font-bold">
                                        ⚡ 메인 인프라 (정보통신/SW) ──┐
                                    </div>
                                    <div className="text-emerald-300 font-bold">
                                        💎 전문 솔루션 (경영/사회과학) ──┼──➔ <span className="text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">[{currentProfile.businessArchitectureMap.targetPlatform}]</span>
                                    </div>
                                    <div className="text-cyan-300 font-bold">
                                        📚 콘텐츠 & IP (출판/온라인교육) ──┘
                                    </div>
                                </div>
                            </div>

                            {/* Section 1: 주업종 1 (메인 인프라) */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/20 border-2 border-amber-500/40 space-y-2.5 relative shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10.5px]">
                                        {currentProfile.primaryBusiness1.badge}
                                    </span>
                                    <span className="text-[11px] text-amber-300 font-bold">
                                        업태: {currentProfile.primaryBusiness1.mainCategory}
                                    </span>
                                </div>

                                <h4 className="text-sm font-black text-white">
                                    {currentProfile.primaryBusiness1.sectionTitle}
                                </h4>

                                <p className="text-[11px] text-gray-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                                    💡 <strong>추천 사유:</strong> {currentProfile.primaryBusiness1.matchReason}
                                </p>

                                {/* Codes List */}
                                <div className="space-y-1.5">
                                    <div className="font-bold text-gray-400 text-[10.5px]">국세청 종목 및 6자리 코드:</div>
                                    {currentProfile.primaryBusiness1.subCategories.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px]">
                                            <div className="space-y-0.5">
                                                <div className="font-black text-white flex items-center gap-1.5">
                                                    <span className="text-amber-400 font-mono tracking-wider">[{item.code}]</span>
                                                    <span>{item.title}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400">{item.businessModel}</div>
                                            </div>
                                            <button
                                                onClick={() => handleCopyCode(item.code, item.title)}
                                                className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/40 transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                                            >
                                                <Copy size={11} />
                                                <span>복사</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2: 주업종 2 (전문 B2B 자문) */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/20 border-2 border-emerald-500/40 space-y-2.5 relative shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10.5px]">
                                        {currentProfile.primaryBusiness2.badge}
                                    </span>
                                    <span className="text-[11px] text-emerald-300 font-bold">
                                        업태: {currentProfile.primaryBusiness2.mainCategory}
                                    </span>
                                </div>

                                <h4 className="text-sm font-black text-white">
                                    {currentProfile.primaryBusiness2.sectionTitle}
                                </h4>

                                <p className="text-[11px] text-gray-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                                    💡 <strong>추천 사유:</strong> {currentProfile.primaryBusiness2.matchReason}
                                </p>

                                {/* Codes List */}
                                <div className="space-y-1.5">
                                    <div className="font-bold text-gray-400 text-[10.5px]">국세청 종목 및 6자리 코드:</div>
                                    {currentProfile.primaryBusiness2.subCategories.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px]">
                                            <div className="space-y-0.5">
                                                <div className="font-black text-white flex items-center gap-1.5">
                                                    <span className="text-emerald-400 font-mono tracking-wider">[{item.code}]</span>
                                                    <span>{item.title}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400">{item.businessModel}</div>
                                            </div>
                                            <button
                                                onClick={() => handleCopyCode(item.code, item.title)}
                                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/40 transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                                            >
                                                <Copy size={11} />
                                                <span>복사</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 3: 부업종 (출판/교육/이커머스) */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/20 border border-cyan-500/40 space-y-2.5 relative shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black text-[10.5px]">
                                        {currentProfile.secondaryBusiness.badge}
                                    </span>
                                    <span className="text-[11px] text-cyan-300 font-bold">
                                        업태: {currentProfile.secondaryBusiness.mainCategory}
                                    </span>
                                </div>

                                <h4 className="text-sm font-black text-white">
                                    {currentProfile.secondaryBusiness.sectionTitle}
                                </h4>

                                <p className="text-[11px] text-gray-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                                    💡 <strong>추천 사유:</strong> {currentProfile.secondaryBusiness.matchReason}
                                </p>

                                {/* Codes List */}
                                <div className="space-y-1.5">
                                    <div className="font-bold text-gray-400 text-[10.5px]">국세청 종목 및 6자리 코드:</div>
                                    {currentProfile.secondaryBusiness.subCategories.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px]">
                                            <div className="space-y-0.5">
                                                <div className="font-black text-white flex items-center gap-1.5">
                                                    <span className="text-cyan-400 font-mono tracking-wider">[{item.code}]</span>
                                                    <span>{item.title}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400">{item.businessModel}</div>
                                            </div>
                                            <button
                                                onClick={() => handleCopyCode(item.code, item.title)}
                                                className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400/40 transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-2"
                                            >
                                                <Copy size={11} />
                                                <span>복사</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        TAB 3: 3. 실전 사업자등록 & 행정 실행 가이드 (Shift)
                        ======================================================== */}
                    {activeTab === 'shift' && (
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
                                    <span>행정 절차 3단계 체크리스트</span>
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
                                    <span>세제 혜택 & 창업 감면 (최대 50~100% 절세)</span>
                                </div>
                                <p className="text-gray-300 text-[11px] leading-relaxed">
                                    {currentProfile.hometaxRegistrationGuide.taxBenefits}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================
                        TAB 4: 4. 명심코칭 비즈니스 성장 전략 (Scale-up)
                        ======================================================== */}
                    {activeTab === 'scaleup' && (
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

                    {/* Bottom Action Footer */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                        <button
                            onClick={() => {
                                onClose();
                                if (onStartChatCoaching) {
                                    onStartChatCoaching(
                                        `내 비즈니스 정체성("${currentProfile.identityTitle}")과 추천 국세청 업종(데이터베이스/온라인정보 724000, 경영컨설팅 741400, 교육출판 930921)을 바탕으로, 1인 지식 플랫폼 30일 론칭 사업계획서를 1:1로 코칭해 줘!`
                                    );
                                }
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <Briefcase className="w-4 h-4 fill-slate-950" />
                            <span>💼 이 아키텍처로 1:1 맞춤 사업계획서 코칭받기 ↗</span>
                        </button>

                        <p className="text-[10px] text-gray-500 text-center">
                            💡 본 아키텍처는 국세청 표준산업분류와 창업중소기업 세액감면 요건을 기반으로 설계된 실무형 가이드입니다.
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
