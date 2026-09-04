'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, CheckCircle2 } from 'lucide-react';
import { useWearableContext } from './WearableAppShell';

interface WearableBreathingPacerProps {
    onNext?: () => void;
}

type BreathPhase = 'INHALE' | 'HOLD_IN' | 'EXHALE' | 'HOLD_OUT';

export function WearableBreathingPacer({ onNext }: WearableBreathingPacerProps) {
    const { isLargeText } = useWearableContext();
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<BreathPhase>('INHALE');
    const [secondsLeft, setSecondsLeft] = useState(4);
    const [completedCycles, setCompletedCycles] = useState(0);

    const PHASE_CONFIG: Record<BreathPhase, { label: string; subtext: string; color: string; ringScale: string }> = {
        INHALE: {
            label: '들숨 (들이쉬기)',
            subtext: '코로 깊게 숨을 채우세요',
            color: 'text-cyan-300',
            ringScale: 'scale-110'
        },
        HOLD_IN: {
            label: '멈춤 (숨 참기)',
            subtext: '가득 찬 고요를 느끼세요',
            color: 'text-amber-300',
            ringScale: 'scale-110'
        },
        EXHALE: {
            label: '날숨 (내쉬기)',
            subtext: '입으로 천천히 비워내세요',
            color: 'text-emerald-300',
            ringScale: 'scale-90'
        },
        HOLD_OUT: {
            label: '비움 (잠시 멈춤)',
            subtext: '텅 빈 평온에 머무르세요',
            color: 'text-indigo-300',
            ringScale: 'scale-90'
        }
    };

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev > 1) {
                    return prev - 1;
                }

                // 단계 전환
                setPhase((currPhase) => {
                    if (currPhase === 'INHALE') return 'HOLD_IN';
                    if (currPhase === 'HOLD_IN') return 'EXHALE';
                    if (currPhase === 'EXHALE') return 'HOLD_OUT';
                    // 1사이클 완료
                    setCompletedCycles((c) => c + 1);
                    return 'INHALE';
                });
                return 4;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive]);

    const handleTogglePlay = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setPhase('INHALE');
        setSecondsLeft(4);
    };

    const currentConfig = PHASE_CONFIG[phase];

    return (
        <div className="flex flex-col items-center justify-between h-full py-2 px-2 text-center select-none font-sans w-full">
            {/* 상단 라벨 */}
            <div className="flex items-center justify-between w-full px-2 pt-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 flex items-center gap-1">
                    <Wind size={12} />
                    <span>4-4-4-4 BOX BREATH</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">
                    {completedCycles}회 완료
                </span>
            </div>

            {/* 중앙 인터랙티브 네온 호흡 링 */}
            <div className="relative my-auto flex flex-col items-center justify-center">
                {/* 팽창 / 수축 펄스 링 */}
                <div className="relative size-28 sm:size-32 flex items-center justify-center">
                    {/* 외곽 글로우 효과 */}
                    <div
                        className={`absolute inset-0 rounded-full blur-md transition-all duration-1000 ${
                            isActive
                                ? phase === 'INHALE' || phase === 'HOLD_IN'
                                    ? 'bg-cyan-500/30 scale-110'
                                    : 'bg-emerald-500/20 scale-90'
                                : 'bg-transparent'
                        }`}
                    />

                    {/* SVG 원형 트랙 & 아크 */}
                    <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className="stroke-white/10 fill-none"
                            strokeWidth="5"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            className={`fill-none transition-all duration-1000 ${
                                phase === 'INHALE'
                                    ? 'stroke-cyan-400'
                                    : phase === 'HOLD_IN'
                                    ? 'stroke-amber-400'
                                    : phase === 'EXHALE'
                                    ? 'stroke-emerald-400'
                                    : 'stroke-indigo-400'
                            }`}
                            strokeWidth="6"
                            strokeDasharray="264"
                            strokeDashoffset={264 - (264 * (4 - secondsLeft + 1)) / 4}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* 중앙 초 카운트다운 & 단계 */}
                    <div className="flex flex-col items-center justify-center z-10">
                        <span className={`${isLargeText ? 'text-5xl sm:text-6xl' : 'text-4xl'} font-black text-white font-mono tracking-tighter`}>
                            {isActive ? secondsLeft : '4:4'}
                        </span>
                        <span className={`${isLargeText ? 'text-sm' : 'text-[11px]'} font-black ${currentConfig.color} mt-0.5`}>
                            {isActive ? currentConfig.label.split(' ')[0] : '준비'}
                        </span>
                    </div>
                </div>

                {/* 하단 단계 가이드 문구 */}
                <p className={`${isLargeText ? 'text-[11px] text-amber-200 font-bold' : 'text-[10px] text-gray-300 font-medium'} mt-1`}>
                    {isActive ? currentConfig.subtext : '터치하여 4초 박스 호흡 시작'}
                </p>
            </div>

            {/* 하단 제어 버튼 */}
            <div className={`w-full ${isLargeText ? 'max-w-[225px]' : 'max-w-[210px]'} pb-1 flex items-center justify-center gap-2`}>
                <button
                    onClick={handleTogglePlay}
                    className={`flex-1 ${isLargeText ? 'py-2.5 text-xs sm:text-sm' : 'py-2 text-xs'} px-3 rounded-full font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                        isActive
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950'
                    }`}
                >
                    {isActive ? <Pause size={isLargeText ? 15 : 13} fill="currentColor" /> : <Play size={isLargeText ? 15 : 13} fill="currentColor" />}
                    <span>{isActive ? '일시 정지' : '호흡 시작'}</span>
                </button>

                {isActive && (
                    <button
                        onClick={handleReset}
                        className={`${isLargeText ? 'size-9' : 'size-8'} rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10`}
                        title="처음부터"
                    >
                        <RotateCcw size={isLargeText ? 14 : 12} />
                    </button>
                )}
            </div>
        </div>
    );
}
