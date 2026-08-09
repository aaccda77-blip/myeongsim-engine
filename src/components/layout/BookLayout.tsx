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
import MyeongsimContentGridView from '../coaching/MyeongsimContentGridView';
import MicroPassModal from '../coaching/MicroPassModal';
import Myeongsim64KeysModal from '../coaching/Myeongsim64KeysModal';
import OhaengContributionModal from '../coaching/OhaengContributionModal';
import MyeongsimGeniusReportModal from '../coaching/MyeongsimGeniusReportModal';
import SupportInquiryModal from '../modals/SupportInquiryModal';

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

    // UI State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isInquiryOpen, setIsInquiryOpen] = useState(false);
    const [intentParams, setIntentParams] = useState<{ intent: string | null; section: string | null }>({ intent: null, section: null });

    // [NEW] 뷰 모드 스위치 (큐레이션 카드 모드 vs 딥 헬스케어 코칭 모드)
    const [viewMode, setViewMode] = useState<'grid' | 'dashboard'>('grid');
    const [showMicroPassModal, setShowMicroPassModal] = useState(false);
    const [show64KeysModal, setShow64KeysModal] = useState(false);
    const [showOhaengModal, setShowOhaengModal] = useState(false);
    const [showGeniusModal, setShowGeniusModal] = useState(false);

    useEffect(() => {
        try {
            const savedMode = localStorage.getItem('myeongsim_view_mode');
            if (savedMode === 'dashboard' || savedMode === 'grid') {
                setViewMode(savedMode);
            }
        } catch (e) {
            console.warn('LocalStorage access warning:', e);
        }
    }, []);

    const handleModeSwitch = (mode: 'grid' | 'dashboard') => {
        setViewMode(mode);
        try {
            localStorage.setItem('myeongsim_view_mode', mode);
        } catch (e) {
            console.warn('LocalStorage set warning:', e);
        }
    };

    // [New] Auto-open chat if intent exists (Safe Client-Only Parsing without Suspense deadlock)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const params = new URLSearchParams(window.location.search);
                const intent = params.get('intent');
                const section = params.get('section');
                
                if (intent) {
                    setIntentParams({ intent, section });
                    setIsChatOpen(true);
                    
                    const url = new URL(window.location.href);
                    url.searchParams.delete('intent');
                    url.searchParams.delete('section');
                    window.history.replaceState({}, '', url.pathname);
                }
            } catch (err) {
                console.warn('URL SearchParams parsing warning:', err);
            }
        }
    }, []);

    // [Removed] Legacy Auth & Payment State - Replaced by Premium System
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState(0);

    const [demoStage, setDemoStage] = useState(7); // [Demo] 7단계 모두 오픈
    const progressPercentage = (currentStep / totalSteps) * 100;

    // [Strict Payment Lock]
    const [isLocked, setIsLocked] = useState(false);
    const [isLoadingLock, setIsLoadingLock] = useState(true);

    const checkUserStatus = async (): Promise<boolean> => {
        setIsLoadingLock(true);
        let shouldLock = false;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                try {
                    const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
                    if (profile) setPoints(profile.points);
                } catch (e) {
                    console.warn('Profile points fetch warning:', e);
                }

                try {
                    const { data: subscription } = await supabase
                        .from('users')
                        .select('expires_at, membership_tier')
                        .eq('id', user.id)
                        .single();

                    if (subscription) {
                        const now = new Date();
                        const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;
                        const isExpired = !expiresAt || expiresAt < now;
                        const isAdmin = subscription.membership_tier === 'ADMIN';

                        if (isExpired && !isAdmin) {
                            shouldLock = true;
                        } else {
                            shouldLock = false;
                        }
                    }
                } catch (e) {
                    console.warn('Subscription fetch warning:', e);
                }
            }
        } catch (globalErr) {
            console.error('checkUserStatus error:', globalErr);
        } finally {
            setIsLocked(shouldLock);
            setIsLoadingLock(false);
        }

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
                <header className="h-14 px-3 flex items-center justify-between border-b border-white/5 bg-deep-slate/80 backdrop-blur-md z-50 absolute top-0 left-0 right-0">
                    <div className="flex items-center gap-1.5">
                        <button
                            className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                            onClick={() => setIsMapOpen(true)}
                            title="전체 메뉴"
                        >
                            <Menu className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                            className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-amber-400"
                            onClick={() => setIsInquiryOpen(true)}
                            title="문의하기 게시판"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>
                    </div>

                    {/* 📱 Mode Toggle Bar (큐레이션 카드 모드 ↔ 딥 헬스케어 코칭 모드) */}
                    <div className="flex items-center bg-black/70 border border-white/20 p-0.5 rounded-xl shadow-lg">
                        <button
                            onClick={() => handleModeSwitch('grid')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md scale-105'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            📱 카드 모드
                        </button>
                        <button
                            onClick={() => handleModeSwitch('dashboard')}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all cursor-pointer ${
                                viewMode === 'dashboard'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            🌌 코칭 모드
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
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
                        <div className="fixed inset-0 z-[55] pt-12 pb-2 sm:pb-3 bg-deep-slate/95 backdrop-blur-sm flex flex-col overflow-hidden">
                            <ChatInterface
                                key={demoStage}
                                onClose={() => {
                                    setIsChatOpen(false);
                                }}
                                currentStage={demoStage}
                                initialIntent={intentParams.intent}
                                initialSectionId={intentParams.section}
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
                <main className="flex-1 w-full relative pt-14 pb-20 overflow-hidden">
                    {viewMode === 'grid' ? (
                        <div className="w-full h-full overflow-y-auto px-4 py-4 scrollbar-hide">
                            <MyeongsimContentGridView
                                userProfile={reportData}
                                onOpenMicroPassModal={() => setShowMicroPassModal(true)}
                                onOpen64KeysModal={() => setShow64KeysModal(true)}
                                onOpenOhaengModal={() => setShowOhaengModal(true)}
                                onOpenGeniusModal={() => setShowGeniusModal(true)}
                                onOpenFullPassModal={() => setShowMicroPassModal(true)}
                            />
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
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
                    )}
                </main>

                {/* 팝업 모달 연동 */}
                {showMicroPassModal && (
                    <MicroPassModal
                        isOpen={showMicroPassModal}
                        onClose={() => setShowMicroPassModal(false)}
                    />
                )}
                {show64KeysModal && (
                    <Myeongsim64KeysModal
                        isOpen={show64KeysModal}
                        onClose={() => setShow64KeysModal(false)}
                    />
                )}
                {showOhaengModal && (
                    <OhaengContributionModal
                        isOpen={showOhaengModal}
                        onClose={() => setShowOhaengModal(false)}
                    />
                )}
                {showGeniusModal && (
                    <MyeongsimGeniusReportModal
                        isOpen={showGeniusModal}
                        onClose={() => setShowGeniusModal(false)}
                    />
                )}
                {isInquiryOpen && (
                    <SupportInquiryModal
                        isOpen={isInquiryOpen}
                        onClose={() => setIsInquiryOpen(false)}
                    />
                )}

                {/* [Strict Payment Guardian] */}
                <AnimatePresence>
                    {isLocked && (
                        <PaymentLockOverlay onRefresh={checkUserStatus} userId={user?.id} />
                    )}
                </AnimatePresence>

                {/* 3. Footer - Progress Bar & Page Navigation */}
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

                    {/* Page Navigation (Only show if on step >= 2 and reportData exists) */}
                    {reportData && currentStep >= 2 && (
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
                    )}
                </footer>
            </div>
        </div>
    );
}
