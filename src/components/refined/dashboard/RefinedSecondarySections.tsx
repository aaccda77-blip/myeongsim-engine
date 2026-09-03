'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RefinedSurface } from '../design-system/RefinedSurface';
import { Shield, Sparkles, ChevronRight, Info, HelpCircle } from 'lucide-react';

export function RefinedSecondarySections() {
    const router = useRouter();

    return (
        <div className="space-y-3.5 text-left">
            {/* VIP 프리미엄 안내 (과도한 팝업 경쟁 대신 차분한 품격의 카드) */}
            <RefinedSurface className="p-4 sm:p-5 border-amber-400/25 bg-gradient-to-br from-[#162035] to-[#101828]">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Sparkles size={13} className="text-amber-400" />
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                                VIP 마스터 프리미엄 패키지
                            </h4>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                            14단계 전면 무제한 열람 + 20회 심층 상담권 + 헌정 힐링송 작곡 무료 증정
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/support')}
                        className="px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs border border-amber-400/40 shrink-0 cursor-pointer ml-3 transition-all"
                    >
                        혜택 보기
                    </button>
                </div>
            </RefinedSurface>

            {/* 부가 유틸리티 리스트 */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                <button
                    onClick={() => router.push('/intro')}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                >
                    <Info size={12} />
                    <span>특허출원 제10-2025-0166877호</span>
                </button>
                <button
                    onClick={() => router.push('/support')}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                >
                    <HelpCircle size={12} />
                    <span>고객지원 및 1:1 문의</span>
                </button>
            </div>
        </div>
    );
}
