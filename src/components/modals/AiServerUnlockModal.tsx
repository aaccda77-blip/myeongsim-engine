'use client';

import React, { useState } from 'react';
import { useAds } from '@/contexts/AdContext';
import { X, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2, Cpu, Bot, Database } from 'lucide-react';

export default function AiServerUnlockModal() {
    const { isAiModalOpen, closeAiServerModal, purchaseAiServerService, restorePurchases } = useAds();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isAiModalOpen) return null;

    const handleBuy = async () => {
        setIsProcessing(true);
        try {
            await purchaseAiServerService();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#030712] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(168,85,247,0.25)] text-left overflow-hidden">
                {/* 배경 오라 이펙트 */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* 닫기 버튼 */}
                <button
                    onClick={closeAiServerModal}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* 헤더 뱃지 */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-black font-mono tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>GOOGLE PLAY VIP SUBSCRIPTION</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                        광고 100% OFF
                    </span>
                </div>

                {/* 타이틀: 3안 확정 명칭 */}
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 서비스
                </h2>
                <p className="text-xs sm:text-sm text-purple-300/90 font-medium mt-1">
                    AI 상세 분석 무제한 가동 + 광고 영구 중지
                </p>

                {/* 가격 안내 박스 */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-transparent border border-purple-500/40 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-gray-400 block font-bold">월간 정기구독 (언제든 구글에서 해지 가능)</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-black text-white">₩98,000</span>
                            <span className="text-xs text-purple-300 font-medium">/ 1개월</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-black">
                            VVIP 프리패스
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-1">1인 전담 자문관</span>
                    </div>
                </div>

                {/* 핵심 혜택 리스트 */}
                <div className="mt-5 space-y-2.5">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-white leading-snug">
                                AI 상세 분석
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                24시간 실시간 초고속 AI 상담 및 심층 분석을 무제한으로 제공합니다.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <Bot className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-white leading-snug">
                                3S 인지과학 & 국세청 업종 매핑 비즈니스 코칭 전면 해금
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                중기부 PSST 사업계획서, 정부지원사업 통과 전략, 1:1 창업 적성 AI 코치 무제한
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <Database className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-white leading-snug">
                                108 대뇌피질 심층 리포트 & 맞춤 헌정 주파수 음원 해금
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                사주 기질과 뇌파를 융합한 108가지 프리미엄 심층 보고서를 자유롭게 열람하세요.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-white leading-snug">
                                앱 내 모든 전면 및 배너 광고 100% 완전 중지
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                광고 시청 없이 끊김 없는 최고급 VIP 환경을 유지합니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 결제 버튼 */}
                <div className="mt-6 flex flex-col gap-2">
                    <button
                        onClick={handleBuy}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-base shadow-[0_10px_30px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>구글 플레이 결제창 연결 중...</span>
                            </>
                        ) : (
                            <>
                                <span>월 98,000원으로 AI 서버 이용료 해제하기</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={restorePurchases}
                        className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-200 transition-colors font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>기존 구글 플레이 구매 내역 복원하기</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
