'use client';

import React from 'react';
import { useAds } from '@/contexts/AdContext';
import { XCircle } from 'lucide-react';

export default function GoogleAdBanner() {
    const { isAdFree, openRemoveAdsModal } = useAds();

    // 🌟 3,300원 광고 제거 결제 완료 시 화면에서 완전 소멸
    if (isAdFree) {
        return null;
    }

    return (
        <div className="w-full bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-md fixed bottom-0 left-0 z-40 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.8)] transition-all">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
                {/* 광고 메인 영역 (AdMob / AdSense 반응형 슬롯) */}
                <div className="flex-1 flex items-center justify-center min-h-[48px] bg-slate-900/90 rounded-xl border border-slate-800 relative overflow-hidden group">
                    <div className="flex items-center gap-2.5 px-3 py-1 text-center">
                        <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                            AD
                        </span>
                        <p className="text-xs text-gray-300 font-medium truncate max-w-[220px] sm:max-w-md">
                            🌿 마음의 평온을 찾는 1:1 맞춤 사주 웰니스 코칭 솔루션
                        </p>
                    </div>
                </div>

                {/* 🚫 광고 제거 3,300원 퀵 버튼 */}
                <button
                    onClick={openRemoveAdsModal}
                    className="shrink-0 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-[11px] sm:text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="3,300원으로 모든 광고 평생 제거"
                >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>광고제거 ₩3,300</span>
                </button>
            </div>
        </div>
    );
}
