'use client';

import { useReportStore } from '@/store/useReportStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, MessageCircle, User, Compass } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // [Deep Tech] Lazy Loading의 핵심

import StageMap from '../coaching/StageMap';
import ChatInterface from '../chat/ChatInterface';

// Dynamically import MptiPlannerModal for the overlay mode
const MptiPlannerOverlay = dynamic(() => import('../coaching/MptiPlannerModal'), { ssr: false });

// [New Imports]
import { supabase } from '@/lib/supabaseClient';
import PaymentLockOverlay from '@/components/auth/PaymentLockOverlay';
import { getTargetStepForStage } from '@/utils/StageMapping';

import { useSearchParams } from 'next/navigation';

export default function BookLayout({ children }: { children: React.ReactNode }) {
    const { 
        currentStep, 
        totalSteps, 
        nextStep, 
        prevStep,
        isPlannerApplied,
        isPlannerOpen,
        setPlannerOpen,
        fptiResultType,
        fptiAnswers,
        fptiBirthOhaeng,
        fptiAvatarCode,
        reportData
    } = useReportStore();
    const searchParams = useSearchParams();

    // UI State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // [New] Auto-open chat if intent exists
    useEffect(() => {
        // [Safety Reset] Next.js useSearchParams가 Hydration 불일치나 캐시로 오작동하는 문제를 방지하기 위해 
        // 실제 브라우저 window.location.search의 intent 존재 여부도 함께 검증합니다.
        let hasIntent = false;
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('intent')) {
                hasIntent = true;
            }
        } else {
            hasIntent = !!searchParams.get('intent');
        }

        if (hasIntent) {
            setIsChatOpen(true);
        } else {
            setIsChatOpen(false);
            setPlannerOpen(false);
        }
    }, [searchParams, setPlannerOpen]);

    // [Removed] Legacy Auth & Payment State - Replaced by Premium System
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState(0);

    // [Deep Tech Logic] 실제 DB나 Store에서 단계를 가져와야 함 (데모용 State 분리)
    // const currentStageLevel = useReportStore(s => s.currentStageLevel) || 1;
    const [demoStage, setDemoStage] = useState(7); // [Demo] 7단계 모두 오픈

    const progressPercentage = (currentStep / totalSteps) * 100;

    // [Removed] Legacy Access Key System - Replaced by Premium Membership


    // [Strict Payment Lock]
    const [isLocked, setIsLocked] = useState(false);
    const [isLoadingLock, setIsLoadingLock] = useState(true);

    const checkUserStatus = async (): Promise<boolean> => {
        setIsLoadingLock(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        let shouldLock = false;

        if (user) {
            // 1. Fetch User Profile for Points
            const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
            if (profile) setPoints(profile.points);

            // 2. Fetch User Subscription Status (Detailed)
            const { data: subscription } = await supabase
                .from('users')
                .select('expires_at, membership_tier')
                .eq('id', user.id)
                .single();

            if (subscription) {
                const now = new Date();
                const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;

                // Lock if:
                // a) No expiration date (Never paid/approved)
                // b) Expiration date is in the past
                // UNLESS tier is 'ADMIN' (Just in case)
                const isExpired = !expiresAt || expiresAt < now;
                const isAdmin = subscription.membership_tier === 'ADMIN';

                if (isExpired && !isAdmin) {
                    shouldLock = true;
                    console.log("🔒 Access Locked: User is expired or has no pass.");
                } else {
                    shouldLock = false;
                    console.log("🔓 Access Granted.");
                }
            } else {
                // No record found? Lock it to be safe (or handle new user creation)
                // Assuming 'users' row is created on signup trigger
                shouldLock = true;
            }
        } else {
            // Not logged in? Handled by page.tsx redirect usually, 
            // but if we are here without user, maybe we shouldn't lock? 
            // BookLayout wraps content that usually requires auth.
            // Let's assume AuthGuard handles non-login. 
            // We only lock LOGGED IN but UNPAID users here.
            shouldLock = false;
        }

        setIsLocked(shouldLock);
        setIsLoadingLock(false);
        return shouldLock;
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

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

                        {/* [NEW] 맞춤 코칭 플래너 적용 시 나타나는 🧭 버튼 */}
                        {isPlannerApplied && (
                            <button
                                className="p-2 hover:bg-white/5 rounded-full relative transition-colors"
                                onClick={() => {
                                    setPlannerOpen(!isPlannerOpen);
                                    if (isChatOpen) setIsChatOpen(false);
                                }}
                            >
                                <Compass className={`w-5 h-5 ${isPlannerOpen ? 'text-[#10b748]' : 'text-gray-400'}`} />
                                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </button>
                        )}

                        <button
                            className="p-2 hover:bg-white/5 rounded-full relative transition-colors"
                            onClick={() => {
                                // Check if birthDate exists in reportData
                                const reportData = useReportStore.getState().reportData;
                                if (!reportData?.birthDate) {
                                    alert('먼저 생년월일을 입력하고 "만세력 분석하기"를 눌러주세요!');
                                    return;
                                }
                                setIsChatOpen(!isChatOpen);
                                if (isPlannerOpen) setPlannerOpen(false);
                            }}
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
                            <StageMap
                                currentStage={demoStage}
                                onSelectStage={(stage) => {
                                    setDemoStage(stage);

                                    // [Sync Logic] Update Report Step
                                    const targetStep = getTargetStepForStage(stage);
                                    useReportStore.getState().setStep(targetStep);
                                }}
                                onClose={() => setIsMapOpen(false)}
                            />
                        </div>
                    )}
                    {isChatOpen && (
                        <div className="absolute inset-0 z-[55] pt-14 pb-16 bg-deep-slate/95 backdrop-blur-sm">
                            <ChatInterface
                                key={demoStage}
                                onClose={() => {
                                    setIsChatOpen(false);
                                    useReportStore.getState().setStep(1); // Return to CoverView
                                }}
                                currentStage={demoStage}
                                initialIntent={searchParams.get('intent')} // [New] Pass Intent
                                initialSectionId={searchParams.get('section')} // [New] Pass Section ID for Deep Linking
                            />
                        </div>
                    )}
                    {isPlannerOpen && (
                        <div className="absolute inset-0 z-[55] pt-14 pb-16 bg-deep-slate/95 backdrop-blur-sm">
                            <MptiPlannerOverlay
                                isOpen={isPlannerOpen}
                                onClose={() => setPlannerOpen(false)}
                                resultType={fptiResultType || 'wood'}
                                answers={fptiAnswers || {}}
                                birthOhaeng={fptiBirthOhaeng || {}}
                                avatarCode={fptiAvatarCode || ''}
                                userProfile={reportData}
                                isOverlayMode={true}
                            />
                        </div>
                    )}
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

                {/* [Strict Payment Guardian] */}
                <AnimatePresence>
                    {isLocked && (
                        <PaymentLockOverlay onRefresh={checkUserStatus} userId={user?.id} />
                    )}
                </AnimatePresence>

                {/* 3. Footer - Progress Bar Only */}
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
                </footer>
            </div>
        </div>
    );
}
