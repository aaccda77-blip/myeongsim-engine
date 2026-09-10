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
import { isUserApprovedSync, grantUserApprovalSync } from '@/lib/authGuardUtils';
import { getTargetStepForStage } from '@/utils/StageMapping';

import { useSearchParams, useRouter } from 'next/navigation';
import MyeongsimContentGridView from '../coaching/MyeongsimContentGridView';
import MicroPassModal from '../coaching/MicroPassModal';
import Myeongsim64KeysModal from '../coaching/Myeongsim64KeysModal';
import OhaengContributionModal from '../coaching/OhaengContributionModal';
import MyeongsimGeniusReportModal from '../coaching/MyeongsimGeniusReportModal';
import NtsBusinessCareerModal from '../coaching/NtsBusinessCareerModal';
import SupportInquiryModal from '../modals/SupportInquiryModal';
import { ViewModeSwitcher } from '../simple/ViewModeSwitcher';

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

    // [NEW] 뷰 모드 스위치 (기본값: 생년월일 입력 및 14단계 리포트가 노출되는 'dashboard')
    const [viewMode, setViewMode] = useState<'grid' | 'dashboard'>('dashboard');
    const [showMicroPassModal, setShowMicroPassModal] = useState(false);
    const [show64KeysModal, setShow64KeysModal] = useState(false);
    const [showOhaengModal, setShowOhaengModal] = useState(false);
    const [showGeniusModal, setShowGeniusModal] = useState(false);
    const [showNtsModal, setShowNtsModal] = useState(false);
    const router = useRouter();

    // 🔮 생년월일 입력 페이지(Step 1: CoverView) 즉시 이동 핸들러
    const handleGoToBirthInput = () => {
        setIsChatOpen(false);
        setIsMapOpen(false);
        setViewMode('dashboard');
        useReportStore.getState().setStep(1);
        if (typeof window !== 'undefined') {
            if (window.location.pathname !== '/report') {
                router.push('/report');
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        try {
            // 생년월일이 없으면 무조건 생년월일 입력 폼(dashboard, step 1)으로 열리도록 보장
            const hasBirth = useReportStore.getState().reportData?.birthDate;
            if (!hasBirth) {
                setViewMode('dashboard');
            } else {
                const savedMode = localStorage.getItem('myeongsim_view_mode');
                if (savedMode === 'dashboard' || savedMode === 'grid') {
                    setViewMode(savedMode);
                }
            }
        } catch (e) {
            console.warn('LocalStorage access warning:', e);
        }

        const handleSwitchEvent = (e: any) => {
            const mode = e.detail || 'dashboard';
            if (mode === 'dashboard' || mode === 'grid') {
                setViewMode(mode);
            }
        };
        window.addEventListener('switch-view-mode', handleSwitchEvent);
        return () => window.removeEventListener('switch-view-mode', handleSwitchEvent);
    }, [reportData]);

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

    // [Zero-Flicker Commercial Strict Payment Lock]
    // 이미 승인된 회원은 마운트 0초 만에 잠금 해제(false)로 시작하여 깜빡임 완벽 차단!
    const [isLocked, setIsLocked] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return !isUserApprovedSync();
    });
    const [isLoadingLock, setIsLoadingLock] = useState(false);

    const checkUserStatus = async (): Promise<boolean> => {
        // 이미 승인된 유저는 0.0001ms 만에 통과!
        if (isUserApprovedSync()) {
            setIsLocked(false);
            setIsLoadingLock(false);
            return false;
        }

        setIsLoadingLock(true);
        let shouldLock = true; // 기본값: 완전 잠금

        try {
            // 1. 관리자 세션이거나 게이트 통과자, 로컬 권한 보유 확인
            if (typeof window !== 'undefined') {
                const isAdmin = document.cookie.includes('admin_session=');
                const isServerApproved = localStorage.getItem('myeongsim_server_approved') === 'true';
                const isMonthly = localStorage.getItem('myeongsim_monthly_vip') === 'true';
                const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true' || 
                                   localStorage.getItem('myeongsim_book_verified') === 'true';
                const isPaid = localStorage.getItem('myeongsim_paid_user') === 'true';
                const isSiteAccess = localStorage.getItem('myeongsim_site_access') === 'granted' ||
                                     document.cookie.includes('myeongsim_site_access=granted') ||
                                     document.cookie.includes('myeongsim_site_access_client=granted');
                const isTrialActive = localStorage.getItem('myeongsim_trial_active') === 'true';

                // 승인된 유료 회원 또는 관리자/사이트 액세스 권한 보유 시 무조건 잠금 해제
                if (isAdmin || isServerApproved || isMonthly || isSmartVip || isPaid || isSiteAccess) {
                    shouldLock = false;
                } else if (isTrialActive) {
                    // 무료 맛보기 체험 사용자만 만료일(3분) 검사
                    const expiresAtStr = localStorage.getItem('myeongsim_expires_at');
                    if (expiresAtStr) {
                        const exp = new Date(expiresAtStr).getTime();
                        if (!isNaN(exp) && Date.now() <= exp) {
                            shouldLock = false;
                        }
                    }
                }
            }

            // 2. Supabase 유저 및 서버 승인 상태 실시간 검증
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);
            if (authUser && typeof window !== 'undefined') {
                localStorage.setItem('user_id', authUser.id);
                if (authUser.email) localStorage.setItem('user_email', authUser.email);
            }

            if (typeof window !== 'undefined') {
                const userName = localStorage.getItem('user_name') || localStorage.getItem('myeongsim_book_buyer') || '';
                const queryId = authUser?.id || localStorage.getItem('user_id') || '';
                const queryEmail = authUser?.email || localStorage.getItem('user_email') || '';
                const orderNum = localStorage.getItem('myeongsim_book_order') || localStorage.getItem('myeongsim_verified_order') || '';
                const userPhone = localStorage.getItem('user_phone') || '';

                if (userName || queryId || queryEmail || orderNum || userPhone) {
                    try {
                        const params = new URLSearchParams();
                        if (userName) params.set('name', userName);
                        if (queryId) params.set('userId', queryId);
                        if (queryEmail) params.set('email', queryEmail);
                        if (orderNum) params.set('orderNumber', orderNum);
                        if (userPhone) params.set('phone', userPhone);
                        params.set('t', String(Date.now()));

                        const res = await fetch(`/api/payment/check-approval?${params.toString()}`, {
                            cache: 'no-store'
                        });
                        if (res.ok) {
                            const checkData = await res.json();
                            if (checkData.approved) {
                                shouldLock = false;
                                grantUserApprovalSync(checkData.tier);
                            }
                        }
                    } catch (e) {
                        console.warn('Check approval fetch warning:', e);
                    }
                }
            }

            if (authUser) {
                try {
                    const { data: profile } = await supabase.from('profiles').select('points').eq('id', authUser.id).single();
                    if (profile) setPoints(profile.points);
                } catch (e) {}

                try {
                    const orFilters: string[] = [`id.eq.${authUser.id}`];
                    if (authUser.email) orFilters.push(`email.eq.${authUser.email.toLowerCase().trim()}`);

                    const { data: subscription } = await supabase
                        .from('users')
                        .select('expires_at, membership_tier, is_active')
                        .or(orFilters.join(','))
                        .order('updated_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (subscription) {
                        const now = new Date();
                        const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;
                        const isExpired = !expiresAt || expiresAt < now;
                        const isAdmin = subscription.membership_tier === 'ADMIN';

                        if ((subscription.is_active && !isExpired) || isAdmin) {
                            shouldLock = false;
                            localStorage.setItem('myeongsim_server_approved', 'true');
                            localStorage.setItem('myeongsim_site_access', 'granted');
                            localStorage.setItem('myeongsim_paid_user', 'true');
                            document.cookie = "myeongsim_site_access=granted; path=/; max-age=2592000; SameSite=Lax";
                            document.cookie = "myeongsim_site_access_client=granted; path=/; max-age=2592000; SameSite=Lax";
                        }
                    }
                } catch (e) {}
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

        const handleAuthChange = () => checkUserStatus();
        window.addEventListener('storage', handleAuthChange);
        window.addEventListener('myeongsim_auth_change', handleAuthChange);

        // 3분 체험 만료 감지 타이머 (5초 간격)
        const expiryTimer = setInterval(() => {
            const expStr = typeof window !== 'undefined' ? localStorage.getItem('myeongsim_expires_at') : null;
            if (expStr) {
                const expTime = new Date(expStr).getTime();
                if (!isNaN(expTime) && Date.now() > expTime) {
                    checkUserStatus();
                }
            }
        }, 5000);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('myeongsim_auth_change', handleAuthChange);
            clearInterval(expiryTimer);
        };
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
                <header className="h-14 px-2 sm:px-3 flex items-center justify-between border-b border-white/5 bg-deep-slate/90 backdrop-blur-md z-50 absolute top-0 left-0 right-0">
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        <button
                            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-gray-400 hover:text-white shrink-0"
                            onClick={() => setIsMapOpen(true)}
                            title="전체 메뉴"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-amber-400 hover:text-amber-300 shrink-0"
                            onClick={() => setIsInquiryOpen(true)}
                            title="문의하기 게시판"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>

                        {/* 🔮 [대표님 요청] 생년월일 입력 페이지 상단 바로가기 메뉴 버튼 */}
                        <button
                            type="button"
                            onClick={handleGoToBirthInput}
                            className="h-8 px-2 sm:px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 transition-all whitespace-nowrap shrink-0"
                            title="생년월일 입력 및 사주 만세력 원국 분석 페이지로 이동"
                        >
                            <span className="text-xs">🔮</span>
                            <span className="font-extrabold whitespace-nowrap">생년월일</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        {/* 🌟 [간편모드 / 기본모드 전환 스위처] 🌟 */}
                        <ViewModeSwitcher />

                        {/* [NEW] 맞춤 코칭 플래너 적용 시 나타나는 🧭 버튼 */}
                        {isPlannerApplied && (
                            <button
                                className="p-1.5 hover:bg-white/5 rounded-xl relative transition-colors shrink-0 cursor-pointer"
                                onClick={() => {
                                    setPlannerOpen(!isPlannerOpen);
                                    if (isChatOpen) setIsChatOpen(false);
                                }}
                                title="맞춤 코칭 플래너"
                            >
                                <Compass className={`w-5 h-5 ${isPlannerOpen ? 'text-[#10b748]' : 'text-gray-400'}`} />
                                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </button>
                        )}

                        <button
                            className="p-1.5 hover:bg-white/5 rounded-xl relative transition-colors cursor-pointer shrink-0 text-gray-400 hover:text-white"
                            onClick={() => {
                                // Check if birthDate exists in reportData
                                const curData = useReportStore.getState().reportData;
                                if (!curData?.birthDate) {
                                    alert('먼저 생년월일을 입력하고 "만세력 분석하기"를 눌러주세요!\n생년월일 입력 화면으로 즉시 이동합니다. 🔮');
                                    setViewMode('dashboard');
                                    useReportStore.getState().setStep(1);
                                    return;
                                }
                                setIsChatOpen(!isChatOpen);
                                if (isPlannerOpen) setPlannerOpen(false);
                            }}
                            title="명심 AI 코칭 채팅"
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
                    {viewMode === 'grid' && reportData?.birthDate ? (
                        <div className="w-full h-full overflow-y-auto px-4 py-4 scrollbar-hide">
                            <MyeongsimContentGridView
                                userProfile={reportData}
                                onOpenMicroPassModal={() => setShowMicroPassModal(true)}
                                onOpen64KeysModal={() => setShow64KeysModal(true)}
                                onOpenOhaengModal={() => setShowOhaengModal(true)}
                                onOpenGeniusModal={() => setShowGeniusModal(true)}
                                onOpenFullPassModal={() => setShowMicroPassModal(true)}
                                onOpenNtsModal={() => setShowNtsModal(true)}
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
                {showNtsModal && (
                    <NtsBusinessCareerModal
                        isOpen={showNtsModal}
                        onClose={() => setShowNtsModal(false)}
                        userProfile={reportData}
                        onStartChatCoaching={(prompt) => {
                            setShowNtsModal(false);
                            setIntentParams({ intent: 'business_coaching', section: prompt });
                            setIsChatOpen(true);
                        }}
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
                    {isLocked && !isUserApprovedSync() && (
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
