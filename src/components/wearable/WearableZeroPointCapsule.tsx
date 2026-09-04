'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Zap, BookOpen } from 'lucide-react';
import { useWearableContext } from './WearableAppShell';

interface WearableZeroPointCapsuleProps {
    onNext?: () => void;
}

const ZERO_POINT_QUOTES = [
    {
        title: '생각의 관찰자',
        quote: '생각은 내가 아닙니다. 나는 그 생각을 바라보는 텅 빈 순수 의식입니다.',
        sub: 'ZERO POINT · 제1원칙'
    },
    {
        title: '양자 붕괴 명상',
        quote: '지금 저항을 멈추면, 모든 고통은 본래의 영점(Zero Point)으로 붕괴합니다.',
        sub: 'ZERO POINT · 양자 평정'
    },
    {
        title: '현존 스위치',
        quote: '과거는 기억일 뿐이고 미래는 상상입니다. 온전한 생명력은 지금 이 찰나에만 있습니다.',
        sub: 'ZERO POINT · 완전한 현존'
    },
    {
        title: '방하착 (집착 비우기)',
        quote: '결과에 대한 통제욕을 내려놓을 때, 가장 거대한 가능성의 장이 열립니다.',
        sub: 'ZERO POINT · 순응의 힘'
    },
    {
        title: '고요한 내면의 바다',
        quote: '수면의 파도가 거칠어도, 바다 깊은 심해는 언제나 절대적 평온을 유지합니다.',
        sub: 'ZERO POINT · 중심 잡기'
    }
];

export function WearableZeroPointCapsule({ onNext }: WearableZeroPointCapsuleProps) {
    const { isLargeText } = useWearableContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isResetting, setIsResetting] = useState(false);
    const [resetCount, setResetCount] = useState(0);

    const currentQuote = ZERO_POINT_QUOTES[currentIndex];

    const handleNextQuote = () => {
        setCurrentIndex((prev) => (prev + 1) % ZERO_POINT_QUOTES.length);
    };

    const handleInstantReset = () => {
        setIsResetting(true);
        setResetCount((c) => c + 1);

        // 스마트폰/워치 웹 진동 햅틱 지원 시 동작
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate([40, 60, 40]);
            } catch (e) {}
        }

        setTimeout(() => {
            setIsResetting(false);
        }, 500);
    };

    return (
        <div className="relative flex flex-col items-center justify-between h-full py-2 px-2 text-center select-none font-sans w-full overflow-hidden">
            {/* 1초 리셋 플래시 오버레이 */}
            {isResetting && (
                <div className="absolute inset-0 bg-cyan-300/40 backdrop-blur-sm z-30 flex items-center justify-center animate-ping pointer-events-none" />
            )}

            {/* 상단 라벨 */}
            <div className="flex items-center justify-between w-full px-1.5 pt-1 z-10">
                <span className={`${isLargeText ? 'text-[11px] text-cyan-300 font-black' : 'text-[10px] text-indigo-400 font-bold'} font-mono tracking-wider flex items-center gap-1`}>
                    <Sparkles size={isLargeText ? 13 : 11} className="text-cyan-300" />
                    <span>ZERO POINT</span>
                </span>
                <span className={`${isLargeText ? 'text-[9.5px] px-2.5 py-0.5' : 'text-[9px] px-2 py-0.5'} rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30`}>
                    리셋 {resetCount}회
                </span>
            </div>

            {/* 중앙 핵심 각성 카드 */}
            <div className={`relative my-auto flex flex-col items-center justify-center ${isLargeText ? 'max-w-[265px]' : 'max-w-[230px]'} z-10`}>
                <span className={`${isLargeText ? 'text-[11px]' : 'text-[10px]'} font-mono text-cyan-400 font-black uppercase tracking-wider mb-1`}>
                    {currentQuote.title}
                </span>

                <div className={`p-3 rounded-2xl ${isLargeText ? 'bg-black/70 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'bg-white/[0.04] border-white/10 shadow-lg'} border`}>
                    <p className={`${isLargeText ? 'text-[14px] sm:text-[15px] font-black text-amber-100 leading-[1.7]' : 'text-xs sm:text-[13px] font-bold text-gray-100 leading-snug'} break-keep`}>
                        “{currentQuote.quote}”
                    </p>
                </div>

                <div className={`flex items-center gap-1 mt-1.5 ${isLargeText ? 'text-[10px] text-amber-300 font-bold' : 'text-[9px] text-gray-400 font-mono'}`}>
                    <BookOpen size={isLargeText ? 12 : 10} className="text-amber-400" />
                    <span>{currentQuote.sub}</span>
                </div>
            </div>

            {/* 하단 1초 마인드 리셋 버튼 */}
            <div className={`w-full ${isLargeText ? 'max-w-[230px]' : 'max-w-[210px]'} pb-1 flex items-center gap-1.5 z-10`}>
                <button
                    onClick={handleInstantReset}
                    className={`flex-1 ${isLargeText ? 'py-2.5 text-xs sm:text-sm' : 'py-2 text-xs'} px-3 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 text-slate-950 font-black flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.4)] active:scale-95 transition-all cursor-pointer`}
                >
                    <Zap size={isLargeText ? 15 : 13} fill="currentColor" />
                    <span>1초 영점 리셋</span>
                </button>

                <button
                    onClick={handleNextQuote}
                    className={`${isLargeText ? 'size-9' : 'size-8'} rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0`}
                    title="다음 문구"
                >
                    <RefreshCw size={isLargeText ? 14 : 12} />
                </button>
            </div>
        </div>
    );
}
