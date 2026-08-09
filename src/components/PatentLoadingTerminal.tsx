'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Sun, Compass } from 'lucide-react';
import MyeongsimSunLogo from './common/MyeongsimSunLogo';

const WARM_LOADING_STEPS = [
    { text: "당신의 마음에 공감하며 지혜를 모으는 중입니다...", icon: Heart, color: "text-amber-400" },
    { text: "깊은 안도감과 안정감을 선사할 문장을 정성껏 가다듬고 있습니다...", icon: Sun, color: "text-amber-300" },
    { text: "타고난 기질과 지혜의 빛을 융합하는 중입니다...", icon: Sparkles, color: "text-yellow-400" },
    { text: "당신만을 위한 따뜻한 명심 에세이를 완성하고 있습니다...", icon: Compass, color: "text-amber-200" },
];

export default function PatentLoadingTerminal() {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % WARM_LOADING_STEPS.length);
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const currentStep = WARM_LOADING_STEPS[stepIndex];
    const Icon = currentStep.icon;

    return (
        <div className="w-full flex flex-col items-center justify-center p-5 bg-gradient-to-b from-[#0D1525]/90 to-[#050B14]/90 border border-amber-500/30 rounded-2xl backdrop-blur-md shadow-[0_8px_30px_rgba(251,191,36,0.1)] font-sans">
            {/* Animated Sun Logo & Icon */}
            <div className="mb-3 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
                <motion.div
                    key={stepIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 flex items-center gap-2"
                >
                    <MyeongsimSunLogo size={36} />
                </motion.div>
            </div>

            {/* Warm Loading Text */}
            <div className="min-h-[40px] relative w-full flex justify-center items-center py-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stepIndex}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center gap-2 text-center px-2"
                    >
                        <Icon className={`w-4 h-4 ${currentStep.color} animate-pulse shrink-0`} />
                        <span className="text-xs md:text-sm font-medium text-amber-100/90 tracking-tight leading-relaxed break-keep">
                            {currentStep.text}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Subtle Golden Progress Bar */}
            <div className="w-3/4 h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}
