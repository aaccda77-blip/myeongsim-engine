'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    onComplete: () => void;
}

const CYCLE_DURATION = 12;
const PHASES = {
    INHALE: { text: "숨을 깊게 들이마시세요", scale: 1.5, opacity: 1, guideAudio: '/sounds/voice_inhale.mp3' },
    HOLD: { text: "잠시 멈춥니다", scale: 1.5, opacity: 0.8, guideAudio: '/sounds/voice_hold.mp3' },
    EXHALE: { text: "천천히 내뱉으세요", scale: 1.0, opacity: 0.6, guideAudio: '/sounds/voice_exhale.mp3' },
};

export default function PremiumBreathingWidget({ onComplete }: Props) {
    // States
    const [hasStarted, setHasStarted] = useState(false); // [Fix 1] 인터랙션 체크
    const [timeLeft, setTimeLeft] = useState(180);
    const [phase, setPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
    const [isMuted, setIsMuted] = useState(false);
    const [windowSize, setWindowSize] = useState({ w: 1000, h: 1000 }); // [Fix 2] SSR 대응

    // Refs
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const voiceRef = useRef<HTMLAudioElement | null>(null);
    const duckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 1. [Fix 2] Window Size Init (Client Only)
    useEffect(() => {
        setWindowSize({ w: window.innerWidth, h: window.innerHeight });

        // 오디오 객체 미리 생성
        // Note: Ensure these files exist in public/sounds/ 
        bgmRef.current = new Audio('/sounds/528hz_healing_bgm.mp3');
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.4;

        voiceRef.current = new Audio();
        voiceRef.current.volume = 1.0;

        return () => {
            // Cleanup
            bgmRef.current?.pause();
            voiceRef.current?.pause();
            if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
        };
    }, []);

    // 2. [Fix 1] 시작 버튼 클릭 시 재생 (Autoplay Policy 준수)
    const handleStart = async () => {
        setHasStarted(true);
        try {
            if (bgmRef.current) {
                await bgmRef.current.play();
                fadeInBGM();
            }
        } catch (e) {
            console.warn("Audio play failed (File missing or blocked):", e);
        }
    };

    // BGM Fade In Logic
    const fadeInBGM = () => {
        if (!bgmRef.current) return;
        bgmRef.current.volume = 0;
        let vol = 0;
        const interval = setInterval(() => {
            if (!bgmRef.current) { clearInterval(interval); return; }
            vol += 0.05;
            if (vol >= 0.4) {
                bgmRef.current.volume = 0.4;
                clearInterval(interval);
            } else {
                bgmRef.current.volume = vol;
            }
        }, 200);
    };

    // 3. 타이머 로직 (hasStarted가 true일 때만 동작)
    useEffect(() => {
        if (!hasStarted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });

            const elapsed = 180 - timeLeft;
            const cycleTime = elapsed % CYCLE_DURATION;

            let nextPhase: 'INHALE' | 'HOLD' | 'EXHALE' = 'INHALE';
            if (cycleTime < 4) nextPhase = 'INHALE';
            else if (cycleTime < 8) nextPhase = 'HOLD';
            else nextPhase = 'EXHALE';

            if (phase !== nextPhase) {
                setPhase(nextPhase);
                triggerVoiceWithDucking(nextPhase);
                triggerHaptic();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, timeLeft, phase, onComplete]);

    // Voice & Ducking Logic
    const triggerVoiceWithDucking = (currentPhase: keyof typeof PHASES) => {
        if (isMuted || !voiceRef.current || !bgmRef.current) return;

        // Ducking
        bgmRef.current.volume = 0.1;

        // Play Voice
        voiceRef.current.src = PHASES[currentPhase].guideAudio;
        voiceRef.current.play().catch(() => { });

        // Restore BGM after 3.5s
        if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
        duckTimeoutRef.current = setTimeout(() => {
            if (bgmRef.current && !isMuted) {
                // Smooth restore could be implemented here
                bgmRef.current.volume = 0.4;
            }
        }, 3500);
    };

    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const toggleSound = () => {
        setIsMuted(!isMuted);
        if (bgmRef.current) bgmRef.current.muted = !isMuted;
        if (voiceRef.current) voiceRef.current.muted = !isMuted;
    };

    const currentConfig = PHASES[phase];

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center w-full h-full bg-[#0f172a] overflow-hidden text-white touch-none">

            {/* Background Particles (Hydration Safe) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

                {/* Floating Particles - Client Side Only Logic */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-20"
                        initial={{
                            x: Math.random() * windowSize.w,
                            y: Math.random() * windowSize.h,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ width: Math.random() * 4 + 1, height: Math.random() * 4 + 1 }}
                    />
                ))}
            </div>

            {/* Close Button */}
            <button
                onClick={onComplete}
                className="absolute top-6 right-6 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
                <X size={24} />
            </button>

            {/* Main Content */}
            {!hasStarted ? (
                // [Fix 1] Start Screen (Interaction Gate)
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="z-20 flex flex-col items-center text-center px-6"
                >
                    <div className="mb-8 p-6 bg-primary-olive/20 rounded-full animate-pulse-slow">
                        <Play size={48} className="text-primary-olive ml-2" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-4">마음 챙김 호흡</h2>
                    <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
                        3분간의 호흡을 통해<br />
                        불안한 마음을 진정시키고<br />
                        나에게 집중하는 시간을 갖습니다.
                    </p>
                    <button
                        onClick={handleStart}
                        className="px-10 py-4 bg-primary-olive text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        호흡 시작하기
                    </button>
                </motion.div>
            ) : (
                // Breathing UI
                <>
                    <div className="absolute top-6 left-6 z-30">
                        <button onClick={toggleSound} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
                        <div className="h-24 flex items-center justify-center mb-8 w-full">
                            <AnimatePresence mode='wait'>
                                <motion.h2
                                    key={phase}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl md:text-3xl font-light tracking-wide text-center font-serif text-shadow-lg"
                                >
                                    {currentConfig.text}
                                </motion.h2>
                            </AnimatePresence>
                        </div>

                        {/* Orb */}
                        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
                            <motion.div
                                animate={{ scale: currentConfig.scale, opacity: currentConfig.opacity }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary-olive/30 rounded-full blur-3xl"
                            />

                            <motion.div
                                animate={{ scale: currentConfig.scale }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-full h-full border-2 border-white/20 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(101,140,66,0.3)] z-10"
                            >
                                <span className="text-4xl font-thin tabular-nums tracking-widest font-mono">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </motion.div>

                            {/* SVG Ring */}
                            <svg className="absolute w-full h-full -rotate-90 pointer-events-none z-20" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                                <motion.circle
                                    cx="50" cy="50" r="48"
                                    fill="none" stroke="#658c42" strokeWidth="2"
                                    strokeDasharray="301.59"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: 301.59 * (timeLeft / 180) }}
                                    transition={{ duration: 1, ease: 'linear' }}
                                    strokeLinecap="round"
                                    className="drop-shadow-md"
                                />
                            </svg>
                        </div>

                        <p className="mt-16 text-xs text-primary-olive/50 tracking-[0.3em] uppercase">
                            Myeongsim Coaching
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
