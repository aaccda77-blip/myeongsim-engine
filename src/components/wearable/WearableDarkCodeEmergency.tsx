'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle, HeartPulse } from 'lucide-react';
import { useWearableContext } from './WearableAppShell';
import { ActivityTracker } from '@/services/activityTracker';

interface WearableDarkCodeEmergencyProps {
    onComplete?: () => void;
}

export function WearableDarkCodeEmergency({ onComplete }: WearableDarkCodeEmergencyProps) {
    const { isLargeText } = useWearableContext();
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!isRunning || secondsLeft <= 0) return;

        const timer = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    setIsRunning(false);
                    setIsFinished(true);
                    ActivityTracker.track('🚨 30초 긴급 SOS 신경계 리셋 완료', 'WATCH', '미주신경 안정화');
                    if (onComplete) onComplete();
                    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                        try {
                            navigator.vibrate([100, 50, 100]);
                        } catch (e) {}
                    }
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, secondsLeft, onComplete]);

    const handleStart = () => {
        setIsRunning(true);
        setIsFinished(false);
        setSecondsLeft(30);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsFinished(false);
        setSecondsLeft(30);
    };

    // 3단계 프로토콜 정의
    const getStepInfo = () => {
        if (secondsLeft > 20) {
            return {
                step: '1단계: 시신경 이완',
                action: '시야를 좌우로 넓히세요',
                desc: '정면의 한 점 대신 양쪽 시야를 넓히면 편도체 경보가 즉각 꺼집니다.',
                color: 'text-amber-400'
            };
        } else if (secondsLeft > 10) {
            return {
                step: '2단계: 생리학적 한숨',
                action: '코로 2번 흡-흡, 입으로 길게 후-',
                desc: '폐포를 즉시 확장시켜 혈중 이산화탄소를 빠르게 배출합니다.',
                color: 'text-cyan-400'
            };
        } else {
            return {
                step: '3단계: 턱과 어깨 방하착',
                action: '어깨를 내리고 턱에 힘을 빼세요',
                desc: '치아를 살짝 벌리고 혀를 입천장에 부드럽게 얹으세요.',
                color: 'text-emerald-400'
            };
        }
    };

    const currentStep = getStepInfo();

    return (
        <div className="flex flex-col items-center justify-between h-full py-2 px-2 text-center select-none font-sans w-full">
            {/* 상단 라벨 */}
            {/* 상단 헤더 라벨 */}
            <div className="flex items-center justify-between w-full px-1.5 pt-1">
                <span className={`${isLargeText ? 'text-xs font-black text-red-300' : 'text-[10px] font-bold text-red-400'} font-mono tracking-wider flex items-center gap-1`}>
                    <ShieldAlert size={isLargeText ? 14 : 12} className={isRunning ? 'animate-pulse' : ''} />
                    <span>SOS CLEAR</span>
                </span>
                <span className={`${isLargeText ? 'text-[10px] px-2.5 py-0.5' : 'text-[9px] px-2 py-0.5'} rounded-full bg-red-500/20 text-red-300 font-mono font-black`}>
                    30초
                </span>
            </div>

            {/* 중앙 타이머 & 액션 가이드 */}
            <div className={`relative my-auto flex flex-col items-center justify-center ${isLargeText ? 'max-w-[260px]' : 'max-w-[230px]'}`}>
                {isFinished ? (
                    <div className="space-y-1.5 animate-fade-in">
                        <div className={`${isLargeText ? 'size-18' : 'size-16'} rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto`}>
                            <CheckCircle2 size={isLargeText ? 36 : 32} className="text-emerald-300 animate-bounce" />
                        </div>
                        <h4 className={`${isLargeText ? 'text-base' : 'text-sm'} font-black text-white`}>신경계 리셋 완료!</h4>
                        <p className={`${isLargeText ? 'text-[11px] font-bold' : 'text-[10px] font-medium'} text-emerald-300`}>
                            교감신경 과각성이 정상 수치로 회복되었습니다.
                        </p>
                    </div>
                ) : !isRunning ? (
                    <div className="space-y-2">
                        <div className={`${isLargeText ? 'size-16' : 'size-14'} rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto`}>
                            <HeartPulse size={isLargeText ? 32 : 28} className="text-red-400 animate-pulse" />
                        </div>
                        <p className={`${isLargeText ? 'text-sm font-black' : 'text-xs font-black'} text-gray-100 leading-snug`}>
                            가슴이 답답하거나 분노·불안이 엄습했나요?
                        </p>
                        <p className={`${isLargeText ? 'text-[11px] font-bold text-gray-300' : 'text-[10px] text-gray-400'}`}>
                            30초 신경계 리셋으로 심박수를 즉각 안정시킵니다.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className={`${isLargeText ? 'text-4xl sm:text-5xl' : 'text-3xl'} font-black text-white font-mono tracking-tighter`}>
                                {secondsLeft}
                            </span>
                            <span className={`${isLargeText ? 'text-xs font-black text-amber-300' : 'text-[10px] font-bold text-gray-400'}`}>초 남음</span>
                        </div>
                        <span className={`${isLargeText ? 'text-xs' : 'text-[10px]'} font-mono font-black ${currentStep.color} uppercase block`}>
                            {currentStep.step}
                        </span>
                        <div className={`p-2 rounded-xl ${isLargeText ? 'bg-black/70 border-red-500/30' : 'bg-white/[0.05] border-white/10'} border`}>
                            <p className={`${isLargeText ? 'text-[13px] font-black' : 'text-xs font-bold'} text-white leading-snug break-keep`}>
                                {currentStep.action}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 제어 버튼 */}
            <div className={`w-full ${isLargeText ? 'max-w-[230px]' : 'max-w-[210px]'} pb-1 flex items-center justify-center gap-1.5`}>
                {isFinished ? (
                    <button
                        onClick={handleReset}
                        className={`w-full ${isLargeText ? 'py-2.5 text-xs sm:text-sm' : 'py-2 text-xs'} px-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                    >
                        <RotateCcw size={isLargeText ? 15 : 13} />
                        <span>다시 하기</span>
                    </button>
                ) : !isRunning ? (
                    <button
                        onClick={handleStart}
                        className={`w-full ${isLargeText ? 'py-2.5 text-xs sm:text-sm' : 'py-2 text-xs'} px-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-black flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)] active:scale-95 transition-all cursor-pointer`}
                    >
                        <ShieldAlert size={isLargeText ? 15 : 13} />
                        <span>30초 긴급 리셋 시작</span>
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        className={`w-full ${isLargeText ? 'py-2 text-xs' : 'py-1.5 text-[11px]'} px-3 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 font-black transition-all cursor-pointer`}
                    >
                        중단하기
                    </button>
                )}
            </div>
        </div>
    );
}
