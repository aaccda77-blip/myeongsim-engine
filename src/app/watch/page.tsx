'use client';

import React from 'react';
import { WearableDashboard } from '@/components/wearable/WearableDashboard';
import { Sparkles, ArrowLeft, ShieldCheck, Heart, Headphones, Wind, Zap, Box, Waves } from 'lucide-react';
import Link from 'next/link';


import { useSubscription } from '@/hooks/useSubscription';
import UnifiedSubscriptionModal from '@/components/modals/UnifiedSubscriptionModal';

export default function WatchShowcasePage() {
    const { isMonthlyVip, isModalOpen, openModal, closeModal } = useSubscription();

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-between font-sans selection:bg-cyan-500/30">
            {/* 상단 글로벌 헤더 */}
            <header className="w-full border-b border-white/10 bg-[#070d1d]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/report"
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>리포트로 돌아가기</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                            <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
                            <span>ZERO-PULSE WEARABLE 2.0</span>
                        </span>

                        {isMonthlyVip ? (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-black">
                                <Sparkles size={11} className="text-amber-400" />
                                <span>VIP ALL-PASS 활성</span>
                            </span>
                        ) : (
                            <button
                                onClick={() => openModal('스마트워치 9대 킬러 다이얼')}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[10px] font-black shadow-sm transition-all cursor-pointer"
                            >
                                <Sparkles size={11} />
                                <span>월 98,000원 특가 해금</span>
                            </button>
                        )}
                    </div>

                    <Link
                        href="/library"
                        className="text-xs text-gray-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                        도서관
                    </Link>
                </div>
            </header>

            <UnifiedSubscriptionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                featureName="스마트워치 9대 킬러 다이얼"
            />

            {/* 메인 스마트워치 인터랙티브 영역 */}
            <main className="w-full flex-1 flex flex-col items-center justify-center p-4">
                <WearableDashboard />
            </main>

            {/* 하단 기능 소개 하이라이트 배너 */}
            <footer className="w-full border-t border-white/10 bg-[#060b18] py-6 px-4">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest text-center mb-4">
                        삼성·애플워치에 없는 명심코칭만의 독보적 킬러 워치 웰니스 아키텍처
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-cyan-500/20 flex flex-col items-center gap-1">
                            <Sparkles size={16} className="text-cyan-400" />
                            <span className="text-xs font-bold text-white">5대 오행 퀀텀 레이더</span>
                            <span className="text-[10px] text-gray-400">간·심·비·폐·신 실시간 생체 밸런스</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-indigo-500/20 flex flex-col items-center gap-1">
                            <Box size={16} className="text-indigo-400" />
                            <span className="text-xs font-bold text-white">3S 의식공간 3D 체적</span>
                            <span className="text-[10px] text-gray-400">자각·방하착·주체성 텐서 볼륨</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-amber-500/20 flex flex-col items-center gap-1">
                            <Waves size={16} className="text-amber-400" />
                            <span className="text-xs font-bold text-white">메타코드 주파수 파동</span>
                            <span className="text-[10px] text-gray-400">다크 ➔ 뉴럴 ➔ 메타코드 골든타임</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-emerald-500/20 flex flex-col items-center gap-1">
                            <Headphones size={16} className="text-emerald-400" />
                            <span className="text-xs font-bold text-white">손목 뇌파 사운드 랩</span>
                            <span className="text-[10px] text-gray-400">딥 브라운 & 528Hz 즉시 재생</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
