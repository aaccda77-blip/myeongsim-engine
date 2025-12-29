'use client';

import { useReportStore } from '@/store/useReportStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';

import StageMap from '../coaching/StageMap';
import ChatInterface from '../chat/ChatInterface';
import ProfileModal from '../user/ProfileModal';
import { User } from 'lucide-react';

export default function BookLayout({ children }: { children: React.ReactNode }) {
    const { currentStep, totalSteps, nextStep, prevStep } = useReportStore();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [demoStage, setDemoStage] = useState(1); // For demo purpose

    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-deep-slate text-text-gray font-sans flex flex-col overflow-hidden relative selection:bg-primary-olive selection:text-white">
            {/* 1. Header */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-deep-slate/80 backdrop-blur-md z-50 fixed top-0 w-full max-w-md left-1/2 -translate-x-1/2">
                <div className="flex gap-2">
                    <button
                        className="p-2 hover:bg-white/5 rounded-full relative"
                        onClick={() => setIsMapOpen(true)}
                    >
                        <Menu className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                        className="p-2 hover:bg-white/5 rounded-full relative"
                        onClick={() => setIsProfileOpen(true)}
                    >
                        <User className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <h1 className="text-sm font-serif tracking-widest text-primary-olive uppercase">
                    Stage {demoStage}
                </h1>

                <button
                    className="p-2 hover:bg-white/5 rounded-full relative"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                >
                    <MessageCircle className={`w-5 h-5 ${isChatOpen ? 'text-primary-olive' : 'text-gray-400'}`} />
                    {!isChatOpen && <span className="absolute top-1 right-1 w-2 h-2 bg-primary-olive rounded-full animate-pulse" />}
                </button>
            </header>

            {/* Overlays */}
            <AnimatePresence>
                {isMapOpen && (
                    <StageMap
                        currentStage={demoStage}
                        onSelectStage={setDemoStage}
                        onClose={() => setIsMapOpen(false)}
                    />
                )}
                {isProfileOpen && (
                    <ProfileModal onClose={() => setIsProfileOpen(false)} />
                )}
                {isChatOpen && (
                    <ChatInterface
                        onClose={() => setIsChatOpen(false)}
                        currentStage={demoStage} // Pass stage to chat
                    />
                )}
            </AnimatePresence>

            {/* 2. Main Content (Book Page) */}
            <main className="flex-1 w-full max-w-md mx-auto relative pt-20 pb-24 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full px-6 overflow-y-auto hide-scrollbar"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* 3. Footer Navigation */}
            <footer className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-deep-slate/90 backdrop-blur-lg border-t border-white/5 z-50">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-800">
                    <motion.div
                        className="h-full bg-primary-olive shadow-[0_0_10px_#658c42]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-xs font-bold tracking-widest">PREV</span>
                    </button>

                    <span className="text-xs font-mono text-gray-500">
                        {currentStep} / {totalSteps}
                    </span>

                    <button
                        onClick={nextStep}
                        disabled={currentStep === totalSteps}
                        className="flex items-center gap-2 text-primary-olive hover:text-green-400 disabled:opacity-30 transition-colors"
                    >
                        <span className="text-xs font-bold tracking-widest">NEXT</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
