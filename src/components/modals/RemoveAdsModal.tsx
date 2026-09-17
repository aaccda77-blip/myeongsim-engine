'use client';

import React, { useState } from 'react';
import { useAds } from '@/contexts/AdContext';
import { X, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';

export default function RemoveAdsModal() {
    const { isModalOpen, closeRemoveAdsModal, purchaseRemoveAds, restorePurchases } = useAds();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isModalOpen) return null;

    const handleBuy = async () => {
        setIsProcessing(true);
        try {
            await purchaseRemoveAds();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-[#04060a] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-left overflow-hidden">
                {/* 닫기 버튼 */}
                <button
                    onClick={closeRemoveAdsModal}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* 헤더 뱃지 */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-[11px] font-black font-mono tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>GOOGLE PLAY IN-APP PURCHASE</span>
                    </span>
                </div>

                {/* 타이틀 */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    평생 광고 제거 VIP
                </h2>
                <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-1">
                    단 한 번 결제로 명심코칭의 모든 광고를 영구 삭제하세요!
                </p>

                {/* 가격 안내 박스 */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-gray-400 block font-bold">1회 결제 평생 소장</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-amber-400">₩3,300</span>
                            <span className="text-xs text-gray-400 line-through">₩9,900</span>
                        </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                        66% 특가 할인
                    </span>
                </div>

                {/* 3대 핵심 혜택 */}
                <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-white">모든 배너 및 전면 광고 영구 제거</p>
                            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">화면을 가리던 하단 배너와 팝업 광고가 즉시 사라집니다.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-white">대화 및 분석 속도 2배 쾌속 반응</p>
                            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">광고 로딩 없이 부드럽고 가볍게 앱이 구동됩니다.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-white">온전한 명상 & 마인드 웰니스 몰입</p>
                            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">방해받지 않고 내면의 알아차림과 코칭에 집중할 수 있습니다.</p>
                        </div>
                    </div>
                </div>

                {/* 결제 버튼 */}
                <button
                    onClick={handleBuy}
                    disabled={isProcessing}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-base shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    ) : (
                        <>
                            <span>구글 플레이로 ₩3,300 결제하기</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>

                {/* 복원 안내 버튼 */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
                    <span>이미 구매하셨나요?</span>
                    <button
                        onClick={restorePurchases}
                        className="text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                        구매 내역 복원하기
                    </button>
                </div>
            </div>
        </div>
    );
}
