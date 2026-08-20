/**
 * /app/intro/page.tsx
 * 명심코칭 서비스 소개 페이지 (Bio-Code & Wellness Ver.)
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Compass, LockOpen, Quote, ChevronRight } from 'lucide-react';
import ImpactHookHeroCard from '@/components/landing/ImpactHookHeroCard';
import FounderWelcomeLetterBanner from '@/components/coaching/FounderWelcomeLetterBanner';

export default function IntroPage() {
    const router = useRouter();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#0b0f19] max-w-md mx-auto shadow-2xl overflow-hidden font-sans text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#0b0f19]/90 backdrop-blur-md p-4 border-b border-slate-800">
                <button
                    onClick={() => router.back()}
                    className="text-amber-400 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-base font-bold leading-tight flex-1 text-center pr-10">
                    명심코칭 서비스 소개 & 철학
                </h2>
            </header>

            <main className="flex-1 overflow-y-auto space-y-6 pb-20 custom-scrollbar">
                
                {/* ============================================================
                    1. [버전 3: 임팩트 중심 숏폼형] (시선 사로잡기 & 의심 해소)
                    ============================================================ */}
                <div className="px-5 pt-6">
                    <ImpactHookHeroCard onStartClick={() => router.push('/')} />
                </div>

                {/* ============================================================
                    2. [버전 1: 브랜드 스토리형] (가치관 전달 & 무료 개방의 품격화)
                    ============================================================ */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="px-5"
                >
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0e1726] to-[#0c101c] border-2 border-emerald-500/40 space-y-3.5 shadow-xl text-left">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10.5px] border border-emerald-500/30 w-fit">
                            <LockOpen className="w-3.5 h-3.5" />
                            <span>[버전 1: 브랜드 스토리 & 사명]</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-serif">
                            &quot;나를 이해하는 일에 비용의 문턱이 있어서는 안 되기에 전면 개방합니다.&quot;
                        </h3>

                        <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
                            <p className="font-bold text-emerald-300">
                                우리는 사주를 맹목적으로 믿으라고 말하지 않습니다.
                            </p>
                            <p className="text-gray-300">
                                내 안의 어떤 성격도, 어떤 기질도 억지로 버리거나 자책할 필요가 없습니다. 
                                <strong>&apos;왜 내 안에서 그런 메커니즘이 일어나는지&apos;</strong>를 명확히 이해할 때, 
                                진정한 삶의 균형과 잠재력의 폭발이 시작됩니다.
                            </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-[11px] text-gray-300">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>누구나 제한 없이 자신의 메커니즘을 탐색할 수 있는 권리</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>동양 심신학과 제3세대 심리학(CBT/ACT/DBT)의 융합 가치</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ============================================================
                    3. [버전 2: 감성 편지글형] (깊은 위로 & 리포트 몰입)
                    ============================================================ */}
                <div className="px-5">
                    <FounderWelcomeLetterBanner userName="당신" />
                </div>

                {/* Core 4 Pillars Tech Sections */}
                <div className="px-5 space-y-4">
                    <div className="border-t border-slate-800 pt-5">
                        <span className="text-xs font-mono font-bold text-amber-400">
                            🔬 명심코칭 4대 심신학 메커니즘
                        </span>
                    </div>

                    {/* Section 1: 코드를 읽다 (Decoding) */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left text-xs">
                        <div className="flex items-center gap-2 text-amber-400 font-bold">
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">01</span>
                            <span className="text-sm text-white">코드를 읽다 (Neural Archetype)</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            2천 년 시계열 통계 데이터와 현대 심리학을 결합하여, 타고난 인지 패턴과 강점/스트레스 취약점을 분석합니다.
                        </p>
                    </div>

                    {/* Section 2: 마음을 튜닝하다 (Tuning) */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left text-xs">
                        <div className="flex items-center gap-2 text-blue-400 font-bold">
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">02</span>
                            <span className="text-sm text-white">마음을 튜닝하다 (CBT & ACT)</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            부정적으로 고착된 생각의 자동 회로를 유연하게 재배선(Rewiring)하여 심리적 항상성을 유지합니다.
                        </p>
                    </div>

                    {/* Section 3: 몸을 세우다 (Bio-Syncing) */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left text-xs">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">03</span>
                            <span className="text-sm text-white">몸을 세우다 (Bio-Syncing)</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            국가공인 보건교육사 설계 기반으로 생체 리듬에 맞춘 생활 습관 및 뉴트리 밸런스를 코칭합니다.
                        </p>
                    </div>

                    {/* Section 4: 기술로 증명하다 (Patent) */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-left text-xs">
                        <div className="flex items-center gap-2 text-purple-400 font-bold">
                            <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">04</span>
                            <span className="text-sm text-white">기술로 증명하다 (특허 출원 10-2025-0166877)</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            생체 신호와 기질 데이터를 융합 분석하여 스트레스 해소 솔루션을 제공하는 특허 기반 시스템입니다.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="px-5 pt-4 text-center space-y-3">
                    <h3 className="text-white text-lg font-black font-serif">
                        &quot;오류(Error)가 아니라, 장르(Genre)입니다.&quot;
                    </h3>
                    <p className="text-gray-400 text-xs">
                        명심코칭과 함께 당신이라는 고유한 장르를 완성하세요.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all active:scale-[0.98] cursor-pointer"
                    >
                        🚀 무료로 나의 메커니즘 해독 시작하기
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="px-5 pt-4">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-gray-400 text-left leading-relaxed">
                        💡 <strong>서비스 이용 안내:</strong> 본 서비스는 보건복지부의 비의료 건강관리 가이드라인을 준수하며, 자기 주도적 웰니스 관리를 위한 과학적 보조 도구입니다.
                    </div>
                </div>
            </main>
        </div>
    );
}
