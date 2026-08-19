'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Moon, Sparkles, Play, Pause, RotateCcw, CheckCircle2, Waves, ArrowRight, ShieldCheck } from 'lucide-react';

interface OneMinuteCompassionBreathingProps {
    onCompleteToSleep?: () => void;
    onDismiss?: () => void;
}

export default function OneMinuteCompassionBreathing({
    onCompleteToSleep,
    onDismiss
}: OneMinuteCompassionBreathingProps) {
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [remainingSecs, setRemainingSecs] = useState<number>(60);
    const [cycleCount, setCycleCount] = useState<number>(1);
    const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [breathText, setBreathText] = useState<string>('코로 부드럽게 숨을 들이마십니다 (4초)');
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    // Web Audio API 432Hz Harmonic Sound Ref
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    // Start 432Hz Soothing Ambient Tone
    const start432HzTone = () => {
        try {
            if (!audioCtxRef.current) {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            stop432HzTone();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(432, ctx.currentTime);

            // Gentle fade-in
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();

            oscRef.current = osc;
            gainRef.current = gain;
        } catch (e) {
            console.error('Audio 432Hz start error:', e);
        }
    };

    const stop432HzTone = () => {
        try {
            if (gainRef.current && audioCtxRef.current) {
                const ctx = audioCtxRef.current;
                gainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
                setTimeout(() => {
                    oscRef.current?.stop();
                    oscRef.current?.disconnect();
                    gainRef.current?.disconnect();
                    oscRef.current = null;
                    gainRef.current = null;
                }, 1000);
            } else if (oscRef.current) {
                oscRef.current.stop();
                oscRef.current.disconnect();
                oscRef.current = null;
            }
        } catch (e) {}
    };

    const handleStart = () => {
        setIsRunning(true);
        setIsCompleted(false);
        setRemainingSecs(60);
        setCycleCount(1);
        start432HzTone();
    };

    const handleStop = () => {
        setIsRunning(false);
        stop432HzTone();
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsCompleted(false);
        setRemainingSecs(60);
        setCycleCount(1);
        stop432HzTone();
    };

    // 12s Physiological Sigh Cycle: Inhale 4s -> Hold 2s -> Exhale 6s (Total 5 cycles = 60s)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && remainingSecs > 0) {
            timer = setInterval(() => {
                setRemainingSecs((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setIsCompleted(true);
                        stop432HzTone();
                        return 0;
                    }
                    const next = prev - 1;
                    const elapsed = 60 - next;
                    const cycleTime = elapsed % 12; // 0 to 11
                    const currentCycle = Math.floor(elapsed / 12) + 1;
                    setCycleCount(Math.min(5, currentCycle));

                    if (cycleTime >= 0 && cycleTime < 4) {
                        setBreathState('inhale');
                        setBreathText('코로 깊게 들이마십니다 (4초)');
                    } else if (cycleTime >= 4 && cycleTime < 6) {
                        setBreathState('hold');
                        setBreathText('가슴에 잠시 머무릅니다 (2초)');
                    } else {
                        setBreathState('exhale');
                        setBreathText('입으로 길게 한숨 쉬듯 내쉽니다 (6초)');
                    }

                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, remainingSecs]);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6 text-white font-sans text-left">
            {/* Header / Zero-Shame Welcome */}
            <div className="w-full flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                        <Heart className="w-5 h-5 fill-slate-950" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-amber-200 flex items-center gap-2">
                            <span>오늘 하루 수고한 나를 위한 1분 자비 호흡</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-400/30">
                                432Hz HARMONIC
                            </span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            평가와 자책 없이, 오늘 하루를 온전히 살아낸 신경계를 이완하는 1분 선물
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isRunning ? (
                        <button
                            onClick={handleStop}
                            className="p-2.5 rounded-full bg-slate-800 text-gray-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                        >
                            <Pause className="w-4 h-4 fill-white" />
                        </button>
                    ) : (
                        <button
                            onClick={handleStart}
                            className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                        >
                            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                        </button>
                    )}
                    <button
                        onClick={handleReset}
                        className="p-2.5 rounded-full bg-slate-800 text-gray-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Interactive Breathing Sphere Area */}
            {!isCompleted ? (
                <div className="w-full min-h-[300px] rounded-3xl bg-gradient-to-b from-[#0c0d14] via-[#090b10] to-[#06070a] border border-amber-500/30 p-6 flex flex-col items-center justify-center relative overflow-hidden space-y-5 shadow-inner">
                    {/* Breathing Moon Sphere */}
                    <div className="relative w-44 h-44 flex items-center justify-center my-2">
                        {/* Outer Glow Wave */}
                        <motion.div
                            animate={{
                                scale: breathState === 'inhale' ? 1.35 : breathState === 'hold' ? 1.35 : 0.9,
                                opacity: breathState === 'inhale' ? 0.8 : breathState === 'hold' ? 0.9 : 0.2
                            }}
                            transition={{ duration: breathState === 'inhale' ? 4 : breathState === 'hold' ? 2 : 6, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-400/20 blur-xl pointer-events-none"
                        />

                        {/* Core Moonlight Sphere */}
                        <motion.div
                            animate={{
                                scale: breathState === 'inhale' ? 1.25 : breathState === 'hold' ? 1.25 : 0.85
                            }}
                            transition={{ duration: breathState === 'inhale' ? 4 : breathState === 'hold' ? 2 : 6, ease: 'easeInOut' }}
                            className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 shadow-[0_0_50px_rgba(251,191,36,0.6)] flex items-center justify-center text-slate-950 font-black text-sm z-10"
                        >
                            <span className="font-mono text-base">{remainingSecs}s</span>
                        </motion.div>
                    </div>

                    {/* Dynamic Breathing Caption */}
                    <div className="text-center space-y-1.5 z-10 max-w-md">
                        <div className="text-xs font-black text-amber-300 font-mono tracking-wide">
                            {isRunning ? `[CYCLE ${cycleCount} / 5] • ${breathState.toUpperCase()}` : '준비'}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-200 font-medium break-keep">
                            {isRunning ? breathText : '"화면을 가볍게 바라보며 가슴에 손을 얹고 [호흡 시작]을 누르세요."'}
                        </p>
                    </div>

                    {/* Cycle Progress Bar */}
                    <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden z-10">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${((60 - remainingSecs) / 60) * 100}%` }}
                        />
                    </div>
                </div>
            ) : (
                /* Completion: Self-Compassion Moonlight Card */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/60 p-6 sm:p-7 space-y-4 shadow-xl text-center"
                >
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 mx-auto shadow-md">
                        <Sparkles className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-black text-amber-200">
                            🌙 오늘 하루, 세상을 구하지 않아도 충분했습니다
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto break-keep">
                            완벽한 하루가 아니었어도, 숨을 고르고 나 자신을 돌본 1분은 무엇과도 바꿀 수 없는 소중한 진전입니다. 뇌의 과열된 스위치는 완전히 꺼졌습니다.
                        </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>신경계 항상성 리셋 완료 · 대시보드 무자책 호흡 기록(+1)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {onCompleteToSleep && (
                            <button
                                onClick={onCompleteToSleep}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <Moon className="w-4 h-4" />
                                <span>🌙 432Hz 델타파 수면 플레이어로 이동 →</span>
                            </button>
                        )}
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-gray-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                            >
                                🌿 편안한 마음으로 하루 마무리
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Physiological Sigh Neurological Principle */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-gray-400 leading-relaxed space-y-1">
                <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>생리적 한숨(Physiological Sigh)의 신경학적 원리</span>
                </div>
                <p>
                    4초 들숨 뒤 짧게 채우고 6초간 길게 날숨을 쉴 때, 폐포가 확장되고 횡격막 신경을 통해 <strong>미주신경(부교감신경)이 즉각 활성화</strong>되어 심박수가 자연스럽게 낮아집니다.
                </p>
            </div>
        </div>
    );
}
