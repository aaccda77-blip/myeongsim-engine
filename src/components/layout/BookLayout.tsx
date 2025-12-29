'use client';

import { useReportStore } from '@/store/useReportStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, MessageCircle, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import StageMap from '../coaching/StageMap';
import ChatInterface from '../chat/ChatInterface';

// [New Imports]
import { supabase } from '@/lib/supabaseClient';
import LoginModal from '../auth/LoginModal';
import ChargeModal from '../payment/ChargeModal';

export default function BookLayout({ children }: { children: React.ReactNode }) {
    const { currentStep, totalSteps, nextStep, prevStep } = useReportStore();

    // UI State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Auth & Payment State
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isChargeOpen, setIsChargeOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState(0);

    // [Deep Tech Logic] 실제 DB나 Store에서 단계를 가져와야 함 (데모용 State 분리)
    // const currentStageLevel = useReportStore(s => s.currentStageLevel) || 1;
    const [demoStage, setDemoStage] = useState(7); // [Demo] 7단계 모두 오픈

    const progressPercentage = (currentStep / totalSteps) * 100;

    // Check Access Key & Expiry
    useEffect(() => {
        const checkAccess = async () => {
            const key = localStorage.getItem('access_key');
            if (!key) {
                setIsLoginOpen(true);
                return;
            }

            // Verify with API (Security Check)
            try {
                const res = await fetch('/api/auth/verify-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accessKey: key })
                });
                const data = await res.json();

                if (!data.valid) {
                    // Start fresh if invalid/expired
                    localStorage.removeItem('access_key');
                    localStorage.removeItem('session_expires_at');
                    setIsLoginOpen(true);
                } else {
                    // Valid - close modal just in case
                    setIsLoginOpen(false);
                }
            } catch (e) {
                console.error("Auth Check Error", e);
                // On network error, maybe let them stay or block? 
                // For MVP, block if hesitant.
            }
        };

        checkAccess();
    }, []);

    // Existing User Check (Supabase) - Keep as secondary
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
                if (profile) setPoints(profile.points);
            }
        };
        checkUser();
    }, [isLoginOpen, isChargeOpen]);

    return (
        // [Fix 1] PC 배경과 앱 컨테이너 분리
        // 바깥쪽 div: PC 화면용 배경 (우주적 느낌)
        <div className="min-h-[100dvh] w-full bg-[#050505] flex justify-center items-center overflow-hidden">

            {/* PC용 배경 장식 (앱 뒤에 은은하게 깔리는 오로라) */}
            <div className="fixed inset-0 z-0 pointer-events-none hidden md:block">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-olive/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            {/* 실제 앱 컨테이너 (모바일 뷰포트) */}
            <div className="w-full max-w-md h-[100dvh] bg-deep-slate text-text-gray font-sans flex flex-col relative shadow-2xl md:border-x md:border-white/10 z-10">

                {/* 1. Header */}
                <header className="h-14 px-4 flex items-center justify-between border-b border-white/5 bg-deep-slate/80 backdrop-blur-md z-50 absolute top-0 left-0 right-0">
                    <div className="flex gap-2">
                        <button
                            className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            onClick={() => setIsMapOpen(true)}
                        >
                            <Menu className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* [Removed] Login/Charge Button hidden by user request */}

                        <button
                            className="p-2 hover:bg-white/5 rounded-full relative transition-colors"
                            onClick={() => setIsChatOpen(!isChatOpen)}
                        >
                            <MessageCircle className={`w-5 h-5 ${isChatOpen ? 'text-primary-olive' : 'text-gray-400'}`} />
                            {/* 알림 도트 (나중에 실제 알림 상태와 연동 필요) */}
                            {!isChatOpen && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-deep-slate" />}
                        </button>
                    </div>
                </header>

                {/* Overlays (Z-Index 관리 중요) */}
                <AnimatePresence>
                    {isMapOpen && (
                        <div className="absolute inset-0 z-[60]">
                            <StageMap currentStage={demoStage} onSelectStage={setDemoStage} onClose={() => setIsMapOpen(false)} />
                        </div>
                    )}
                    {isChatOpen && (
                        <div className="absolute inset-0 z-[55] pt-14 pb-16 bg-deep-slate/95 backdrop-blur-sm">
                            <ChatInterface key={demoStage} onClose={() => setIsChatOpen(false)} currentStage={demoStage} />
                        </div>
                    )}
                    {/* [Removed] LoginModal & ChargeModal hidden by user request */}
                    {/* 
                    {isLoginOpen && (
                        <LoginModal onClose={() => setIsLoginOpen(false)} />
                    )}
                    {isChargeOpen && user && (
                        <ChargeModal onClose={() => setIsChargeOpen(false)} userId={user.id} />
                    )}
                    */}
                </AnimatePresence>

                {/* 2. Main Content */}
                {/* [Fix 2] touch-none 제거하고 스크롤 영역 명시 */}
                <main className="flex-1 w-full relative pt-14 pb-20 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }} // 슬라이드 효과로 변경 (책 넘기는 느낌)
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full h-full overflow-y-auto scrollbar-hide"
                        >
                            <div className="px-5 py-6 pb-10 min-h-full">
                                {children}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* 3. Footer Navigation */}
                {/* [Fix 3] pb-safe 대신 표준 CSS 변수 사용 (아이폰 홈바 대응) */}
                <footer className="absolute bottom-0 left-0 right-0 bg-deep-slate/90 backdrop-blur-lg border-t border-white/5 z-50 pb-[env(safe-area-inset-bottom)]">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-800">
                        <motion.div
                            className="h-full bg-primary-olive shadow-[0_0_10px_#658c42]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <div className="flex items-center justify-between px-6 py-3">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 px-2 py-1 rounded-md text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-all active:scale-95"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Prev</span>
                        </button>

                        <span className="text-xs font-mono text-gray-500 select-none">
                            {currentStep} / {totalSteps}
                        </span>

                        <button
                            onClick={nextStep}
                            disabled={currentStep === totalSteps}
                            className="flex items-center gap-2 px-2 py-1 rounded-md text-primary-olive hover:text-green-400 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <span className="text-[10px] font-bold tracking-widest uppercase">Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
