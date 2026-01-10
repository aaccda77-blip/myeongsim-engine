'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: () => void; // Callback when user wants to connect to chat
}

type BreathingPhase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'complete';

const PHASE_DURATIONS = {
    inhale: 4000,   // 4초
    hold: 7000,     // 7초
    exhale: 8000    // 8초
};

export default function BreathingGuideModal({ isOpen, onClose, onComplete }: BreathingGuideModalProps) {
    const [phase, setPhase] = useState<BreathingPhase>('ready');
    const [cycleCount, setCycleCount] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioInhaleRef = useRef<HTMLAudioElement | null>(null);
    const audioHoldRef = useRef<HTMLAudioElement | null>(null);
    const audioExhaleRef = useRef<HTMLAudioElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Preload audio on mount
    useEffect(() => {
        audioInhaleRef.current = new Audio('/sounds/voice_inhale.mp3');
        audioHoldRef.current = new Audio('/sounds/voice_hold.mp3');
        audioExhaleRef.current = new Audio('/sounds/voice_exhale.mp3');

        return () => {
            // Cleanup
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const playAudio = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error('Audio play failed:', e));
        }
    };

    const startBreathing = () => {
        setIsPlaying(true);
        setCycleCount(0);
        runCycle();
    };

    const runCycle = () => {
        // Phase 1: Inhale
        setPhase('inhale');
        playAudio(audioInhaleRef);

        timeoutRef.current = setTimeout(() => {
            // Phase 2: Hold
            setPhase('hold');
            playAudio(audioHoldRef);

            timeoutRef.current = setTimeout(() => {
                // Phase 3: Exhale
                setPhase('exhale');
                playAudio(audioExhaleRef);

                timeoutRef.current = setTimeout(() => {
                    setCycleCount(prev => {
                        const newCount = prev + 1;
                        if (newCount >= 3) {
                            // Complete after 3 cycles
                            setPhase('complete');
                            setIsPlaying(false);
                        } else {
                            // Continue next cycle
                            runCycle();
                        }
                        return newCount;
                    });
                }, PHASE_DURATIONS.exhale);
            }, PHASE_DURATIONS.hold);
        }, PHASE_DURATIONS.inhale);
    };

    const stopBreathing = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsPlaying(false);
        setPhase('ready');
        setCycleCount(0);
    };

    const resetAndClose = () => {
        stopBreathing();
        onClose();
    };

    if (!isOpen) return null;

    const phaseText: Record<BreathingPhase, string> = {
        ready: "시작 버튼을 눌러주세요",
        inhale: "들숨... 천천히 숨을 들이마세요",
        hold: "멈춤... 잠시 숨을 참으세요",
        exhale: "날숨... 천천히 내쉬세요",
        complete: "잘하셨습니다. 당신은 혼자가 아닙니다."
    };

    const phaseEmoji: Record<BreathingPhase, string> = {
        ready: "🧘",
        inhale: "🌬️",
        hold: "⏸️",
        exhale: "💨",
        complete: "✅"
    };

    // Calculate animation scale based on phase
    const getScale = () => {
        switch (phase) {
            case 'inhale': return 1.3;
            case 'hold': return 1.3;
            case 'exhale': return 1.0;
            default: return 1.0;
        }
    };

    const getDuration = () => {
        switch (phase) {
            case 'inhale': return PHASE_DURATIONS.inhale / 1000;
            case 'hold': return PHASE_DURATIONS.hold / 1000;
            case 'exhale': return PHASE_DURATIONS.exhale / 1000;
            default: return 0.5;
        }
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        🆘 SOS 호흡 가이드
                    </h2>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="p-8 flex flex-col items-center space-y-6">

                    {/* Breathing Circle Animation */}
                    <motion.div
                        animate={{ scale: getScale() }}
                        transition={{ duration: getDuration(), ease: "easeInOut" }}
                        className={`w-40 h-40 rounded-full flex items-center justify-center text-6xl
                            ${phase === 'inhale' ? 'bg-cyan-500/30 border-4 border-cyan-400' : ''}
                            ${phase === 'hold' ? 'bg-purple-500/30 border-4 border-purple-400' : ''}
                            ${phase === 'exhale' ? 'bg-emerald-500/30 border-4 border-emerald-400' : ''}
                            ${phase === 'ready' ? 'bg-slate-700/50 border-4 border-slate-500' : ''}
                            ${phase === 'complete' ? 'bg-green-500/30 border-4 border-green-400' : ''}
                        `}
                    >
                        {phaseEmoji[phase]}
                    </motion.div>

                    {/* Phase Text */}
                    <p className="text-white text-center text-lg font-medium min-h-[3rem]">
                        {phaseText[phase]}
                    </p>

                    {/* Cycle Counter */}
                    {isPlaying && (
                        <p className="text-gray-400 text-sm">
                            사이클: {cycleCount + 1} / 3
                        </p>
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-4">
                        {phase === 'ready' && (
                            <button
                                onClick={startBreathing}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-bold text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                            >
                                <Play size={24} />
                                시작
                            </button>
                        )}

                        {isPlaying && (
                            <button
                                onClick={stopBreathing}
                                className="px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-full text-red-300 font-medium flex items-center gap-2 hover:bg-red-500/30 transition-all"
                            >
                                <Pause size={18} />
                                중지
                            </button>
                        )}

                        {phase === 'complete' && (
                            <>
                                <button
                                    onClick={() => { setPhase('ready'); setCycleCount(0); }}
                                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-all"
                                >
                                    <RotateCcw size={18} />
                                    다시 하기
                                </button>
                                {onComplete && (
                                    <button
                                        onClick={() => {
                                            stopBreathing();
                                            onClose();
                                            onComplete();
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                                    >
                                        💬 코치와 대화하기
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 pb-6">
                    <p className="text-gray-500 text-xs text-center">
                        4-7-8 호흡법 (들숨 4초 → 멈춤 7초 → 날숨 8초)
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
