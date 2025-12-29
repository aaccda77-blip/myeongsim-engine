'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck, Activity, Brain } from 'lucide-react';

const LOADING_STEPS = [
    { text: "System Access...", icon: Terminal, color: "text-green-500" },
    { text: "Bio-Data Scan...", icon: Activity, color: "text-blue-500" },
    { text: "Gap Analysis...", icon: ShieldCheck, color: "text-yellow-500" },
    { text: "Neural Mapping...", icon: Brain, color: "text-purple-500" },
];

export default function PatentLoadingTerminal() {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 800); // Switch every 0.8s

        return () => clearInterval(interval);
    }, []);

    const currentStep = LOADING_STEPS[stepIndex];
    const Icon = currentStep.icon;

    return (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-black/80 border border-green-500/30 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,255,0,0.1)] font-mono">
            {/* Animated Icon */}
            <div className="mb-4 relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                <motion.div
                    key={stepIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Icon className={`w-8 h-8 ${currentStep.color}`} />
                </motion.div>
            </div>

            {/* Terminal Text */}
            <div className="h-6 overflow-hidden relative w-full flex justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={stepIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-green-500 text-xs">root@master-h:~$</span>
                        <span className={`text-sm font-bold ${currentStep.color}`}>
                            {currentStep.text}
                        </span>
                        <span className="w-2 h-4 bg-green-500 animate-pulse ml-1" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
            </div>

            <p className="text-[10px] text-gray-500 mt-2">
                Patent 10-2025-0166877 Activated
            </p>
        </div>
    );
}
