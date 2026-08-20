'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Briefcase, Copy, Check, ChevronRight,
    TrendingUp, Shield, FileText, CheckCircle2, Crown,
    Award, ArrowRight, Building, HelpCircle, Layers, Zap
} from 'lucide-react';
import { calculateNtsBusinessProfile, NtsBusinessProfile } from '@/lib/engine/ntsBusinessRecommender';

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
    const [activeTab, setActiveTab] = useState<'profile' | 'codes' | 'guide' | 'roadmap'>('profile');

    if (!isOpen) return null;

    const profile: NtsBusinessProfile = calculateNtsBusinessProfile(userProfile);

    const handleCopyCode = (code: string, label: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(`${label} [${code}]`);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 font-sans animate-fade-in">
                <div className="bg-[#0b0f19] border-2 border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.25)] relative text-white space-y-4 custom-scrollbar text-left">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-3">
                        <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center text-xl font-black shadow-lg shrink-0 mt-0.5">
                                💼
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                                        국세청 표준산업분류 1:1 연계
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                        홈택스 6자리 공식 업종코드
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-white">
                                    {profile.userName}님의 맞춤형 업태·종목 & 창업 리포트
                                </h3>
                                <p className="text-xs text-amber-200/90 font-medium">
                                    ✨ 사주 기질(십신·오행)과 국가 표준 코드를 결합한 실전 비즈니스 가이드
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

                    {/* Sub Navigation Tabs */}
                    <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-center">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'profile'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            1. 기질 진단
                        </button>
                        <button
                            onClick={() => setActiveTab('codes')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'codes'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            2. 추천 업종
                        </button>
                        <button
                            onClick={() => setActiveTab('guide')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'guide'
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            3. 행정 가이드
                        </button>
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                activeTab === 'roadmap'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            4. 창업 로드맵
                        </button>
                    </div>

                    {/* Tab 1: 기질 진단 */}
                    {activeTab === 'profile' && (
                        <div className="space-y-3.5 animate-fade-in">
                            {/* Archetype Card */}
                            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 space-y-2 shadow-inner">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-amber-400 font-mono font-black flex items-center gap-1.5">
                                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                                        <span>선천적 비즈니스 아키타입</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                                        {profile.dominantElement}
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-white">
                                    "{profile.archetypeTitle}"
                                </h4>
                                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                                    {profile.temperamentSummary}
                                </p>
                            </div>

                            {/* 3 Core Strengths */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    <span>3대 핵심 비즈니스 무기</span>
                                </div>
                                <div className="space-y-1.5 text-xs text-gray-300">
                                    {profile.businessStrengths.map((str, idx) => (
                                        <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                                            <span className="text-amber-400 font-bold font-mono shrink-0">0{idx + 1}.</span>
                                            <span className="leading-snug">{str}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: 추천 업종 (주업종 & 부업종 홈택스 6자리 코드) */}
                    {activeTab === 'codes' && (
                        <div className="space-y-3.5 animate-fade-in">
                            {/* Primary Business Card */}
                            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border-2 border-emerald-500/40 space-y-2.5 relative shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px]">
                                            ★ 메인 주업종
                                        </span>
                                        <span className="text-xs font-bold text-emerald-300 font-mono">
                                            적합도 {profile.primaryBusiness.fitScore}점
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(profile.primaryBusiness.industryCode, '주업종 코드')}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/40 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                        <Copy size={11} />
                                        <span>코드 복사</span>
                                    </button>
                                </div>

                                <div>
                                    <div className="text-[11px] text-gray-400 font-mono">
                                        [업태] {profile.primaryBusiness.mainCategory} · [업종코드] <strong className="text-emerald-300 text-sm tracking-wider">{profile.primaryBusiness.industryCode}</strong>
                                    </div>
                                    <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                                        [종목] {profile.primaryBusiness.subCategory}
                                    </h4>
                                </div>

                                <p className="text-xs text-gray-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                                    💡 <strong>선정 사유:</strong> {profile.primaryBusiness.matchReason}
                                </p>

                                <div className="space-y-1 text-[11px] text-gray-300">
                                    <div className="font-bold text-gray-400">🚀 실전 실행 포인트:</div>
                                    {profile.primaryBusiness.executionTips.map((tip, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5 pl-1">
                                            <span className="text-emerald-400 font-bold">•</span>
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Business Card */}
                            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/40 space-y-2.5 relative shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black text-[10px]">
                                            + 수익 다각화 부업종
                                        </span>
                                        <span className="text-xs font-bold text-cyan-300 font-mono">
                                            적합도 {profile.secondaryBusiness.fitScore}점
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(profile.secondaryBusiness.industryCode, '부업종 코드')}
                                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400/40 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                        <Copy size={11} />
                                        <span>코드 복사</span>
                                    </button>
                                </div>

                                <div>
                                    <div className="text-[11px] text-gray-400 font-mono">
                                        [업태] {profile.secondaryBusiness.mainCategory} · [업종코드] <strong className="text-cyan-300 text-sm tracking-wider">{profile.secondaryBusiness.industryCode}</strong>
                                    </div>
                                    <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                                        [종목] {profile.secondaryBusiness.subCategory}
                                    </h4>
                                </div>

                                <p className="text-xs text-gray-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                                    💡 <strong>시너지 사유:</strong> {profile.secondaryBusiness.matchReason}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: 행정 가이드 & 인허가 체크 */}
                    {activeTab === 'guide' && (
                        <div className="space-y-3.5 animate-fade-in text-xs">
                            {/* Hometax Step-by-Step */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                    <Building className="w-3.5 h-3.5 text-amber-400" />
                                    <span>국세청 홈택스 1분 사업자등록 절차</span>
                                </div>
                                <div className="space-y-1.5 text-gray-300 text-[11px]">
                                    {profile.hometaxGuide.registrationOrder.map((step, idx) => (
                                        <div key={idx} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 leading-relaxed">
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Permits & Tax Tips */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                    <div className="font-bold text-rose-300 flex items-center gap-1">
                                        <Shield className="w-3.5 h-3.5 text-rose-400" />
                                        <span>인허가 및 신고 주의사항</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        {profile.primaryBusiness.permitRequirements}
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                    <div className="font-bold text-emerald-300 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>초기 절세 & 감면 팁</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        {profile.primaryBusiness.taxTips}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: 창업 로드맵 */}
                    {activeTab === 'roadmap' && (
                        <div className="space-y-3 animate-fade-in text-xs">
                            {profile.roadmap.map((step, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-amber-300 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[10px] border border-amber-500/40">
                                                {idx + 1}
                                            </span>
                                            <span>{step.stage}</span>
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">{step.duration}</span>
                                    </div>

                                    <p className="text-gray-200 text-xs leading-relaxed font-sans bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                                        🎯 <strong>핵심 액션:</strong> {step.coreAction}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                                        <div className="text-emerald-400/90">
                                            🌟 <strong>사주 강점 레버리지:</strong> {step.sajuAdvantage}
                                        </div>
                                        <div className="text-rose-400/90">
                                            🛡️ <strong>리스크 방어:</strong> {step.riskDefense}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Copy Alert Toast */}
                    {copiedCode && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-xs font-bold text-center animate-fade-in shadow-lg">
                            ✨ {copiedCode}가 클립보드에 복사되었습니다! 홈택스에 붙여넣으세요.
                        </div>
                    )}

                    {/* Main CTA Button: 1:1 AI Business Coaching */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                        <button
                            onClick={() => {
                                onClose();
                                if (onStartChatCoaching) {
                                    onStartChatCoaching(
                                        `내 사주 비즈니스 아키타입("${profile.archetypeTitle}")과 추천 국세청 업종(${profile.primaryBusiness.subCategory} / 코드 ${profile.primaryBusiness.industryCode})을 바탕으로, 초기 1인 사업계획서와 30일 실행 로드맵을 1:1로 코칭해 줘!`
                                    );
                                }
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            <Briefcase className="w-4 h-4 fill-slate-950" />
                            <span>💼 이 업종으로 1:1 맞춤 사업계획서 코칭받기 ↗</span>
                        </button>

                        <p className="text-[10px] text-gray-500 text-center">
                            💡 홈택스 사업자등록 시 본 추천 업종코드를 그대로 검색하여 입력하시면 안전하게 등록됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
