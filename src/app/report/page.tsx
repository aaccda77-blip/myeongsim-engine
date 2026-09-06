'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReportStore } from '@/store/useReportStore';
import BookLayout from '@/components/layout/BookLayout';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { ConsentService } from '@/lib/services/ConsentService';
import DailyMindWelcomeModal from '@/components/modals/DailyMindWelcomeModal';
import { useViewMode } from '@/hooks/useViewMode';
import { SimpleDashboard } from '@/components/simple/dashboard/SimpleDashboard';
import { WearableDashboard } from '@/components/wearable/WearableDashboard';
import { RefinedCoverView } from '@/components/refined/onboarding/RefinedCoverView';
import { RefinedDashboard } from '@/components/refined/dashboard/RefinedDashboard';
import { RefinedReportLayout } from '@/components/refined/layout/RefinedReportLayout';

// [Optimization] 무거운 컴포넌트는 필요할 때만 로드합니다 (Code Splitting)
// ssr: false로 설정하여 클라이언트 전용 라이브러리(Recharts, Framer Motion) 충돌 방지
const loadingView = () => (
    <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary-olive border-t-transparent rounded-full animate-spin" />
    </div>
);

const CoverView = dynamic(() => import('@/components/pages/CoverView'), { loading: loadingView, ssr: false });
const ScienceIntroView = dynamic(() => import('@/components/pages/ScienceIntroView'), { loading: loadingView, ssr: false });
const IdentityView = dynamic(() => import('@/components/pages/IdentityView'), { loading: loadingView, ssr: false });
const SajuPaljaView = dynamic(() => import('@/components/pages/SajuPaljaView'), { loading: loadingView, ssr: false });
const RadarChartView = dynamic(() => import('@/components/pages/RadarChartView'), { loading: loadingView, ssr: false });
const TalentStatsView = dynamic(() => import('@/components/pages/TalentStatsView'), { loading: loadingView, ssr: false });
const FlipCardView = dynamic(() => import('@/components/pages/FlipCardView'), { loading: loadingView, ssr: false });
const RelationBubbleView = dynamic(() => import('@/components/pages/RelationBubbleView'), { loading: loadingView, ssr: false });
const WealthGaugeView = dynamic(() => import('@/components/pages/WealthGaugeView'), { loading: loadingView, ssr: false });
const LifeWaveView = dynamic(() => import('@/components/pages/LifeWaveView'), { loading: loadingView, ssr: false });
const TimelineView = dynamic(() => import('@/components/pages/TimelineView'), { loading: loadingView, ssr: false });
const ActionItemsView = dynamic(() => import('@/components/pages/ActionItemsView'), { loading: loadingView, ssr: false });
const EpilogueView = dynamic(() => import('@/components/pages/EpilogueView'), { loading: loadingView, ssr: false });
const NewPageView = dynamic(() => import('@/components/pages/NewPageView'), { loading: loadingView, ssr: false });

// Fallback
const PlaceholderView = ({ step }: { step: number }) => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
        <h2 className="text-4xl font-bold text-gray-600 mb-4">{step}</h2>
        <p className="font-serif">페이지 준비 중입니다...</p>
    </div>
);

function ReportContent() {
    const { currentStep, reportData } = useReportStore();
    const router = useRouter();
    const { isRefined } = useViewMode();

    // [Guard Logic] 데이터가 없는데 중간 페이지로 진입하면 커버로 보냄
    useEffect(() => {
        // 1페이지(커버)와 2페이지(인트로)는 데이터 없이도 볼 수 있다고 가정
        // 3페이지(Identity)부터는 데이터 필수
        if (currentStep >= 3 && !reportData) {
            // 알림 없이 조용히 보내거나, 토스트 메시지 띄우기
            useReportStore.getState().setStep(1);
        }
    }, [currentStep, reportData]);

    switch (currentStep) {
        case 1: return isRefined ? <RefinedCoverView /> : <CoverView />;
        case 2: return <ScienceIntroView />;
        case 3: return <SajuPaljaView />;
        case 4: return <IdentityView />;
        case 5: return <RadarChartView />;
        case 6: return <TalentStatsView />;
        case 7: return <FlipCardView />;
        case 8: return <RelationBubbleView />;
        case 9: return <WealthGaugeView />;
        case 10: return <LifeWaveView />;
        case 11: return <TimelineView />;
        case 12: return <ActionItemsView />;
        case 13: return <EpilogueView />;
        case 14: return <NewPageView />;
        default: return <PlaceholderView step={currentStep} />;
    }
}

export default function ReportPage() {
    const router = useRouter();
    // 🌟 [Rule of Hooks 준수] 모든 훅을 early return 이전에 컴포넌트 최상단에서 무조건 호출 🌟
    const { isSimple, isWearable, isRefined, setViewMode } = useViewMode();
    const [isMounted, setIsMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isViewingReportDetail, setIsViewingReportDetail] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        let isSubscribed = true;

        // [Safety Guard] 어떤 경우에도 2.5초 이상 로딩 스피너에 갇히지 않도록 강제 해제 보장
        const safetyTimer = setTimeout(() => {
            if (isSubscribed) {
                console.warn('[ReportPage] Absolute safety timer triggered - forcing loading state false');
                setIsCheckingAuth(false);
            }
        }, 2500);

        // Helper: Check if token exists in localStorage synchronously
        const hasLocalStorageToken = () => {
            if (typeof window === 'undefined') return false;
            try {
                const keys = Object.keys(localStorage);
                return keys.some(k => k.includes('auth-token') || k.includes('sb-'));
            } catch (e) {
                return false;
            }
        };

        // 타임아웃 없이 안전하게 세션 획득
        const fetchSessionSafe = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) return { session, user: session.user };

                const { data: { user } } = await supabase.auth.getUser();
                if (user) return { session: { user }, user };
            } catch (e) {
                console.warn('[ReportPage] fetchSession error:', e);
            }
            return { session: null, user: null };
        };

        // Check authentication & Consent status
        const checkAuth = async () => {
            try {
                // 0. 관리자 승인 세션, 사전 승인 게이트 통과자, 또는 3분 맛보기 체험자 즉시 인증 승인!
                if (typeof window !== 'undefined') {
                    const hasAdmin = document.cookie.includes('admin_session=');
                    const hasGate = document.cookie.includes('myeongsim_site_access=granted') ||
                                    document.cookie.includes('myeongsim_site_access_client=granted') ||
                                    localStorage.getItem('myeongsim_site_access') === 'granted';
                    
                    let isTrialValid = false;
                    const isTrialActive = localStorage.getItem('myeongsim_trial_active') === 'true';
                    const expStr = localStorage.getItem('myeongsim_expires_at');
                    if (isTrialActive && expStr) {
                        const exp = new Date(expStr).getTime();
                        if (!isNaN(exp) && Date.now() <= exp) {
                            isTrialValid = true;
                        }
                    }

                    if (hasAdmin || hasGate || isTrialValid) {
                        console.log('[ReportPage] Admin, Gate access, or Free Trial verified! Entering Report View directly.');
                        if (isSubscribed) {
                            setIsAuthenticated(true);
                            setIsCheckingAuth(false);
                            useReportStore.getState().setStep(1);
                        }
                        return;
                    }

                    // httpOnly 쿠키 확인을 위해 서버 검증
                    try {
                        const gateCheckRes = await fetch('/api/gate/verify', { cache: 'no-store' });
                        if (gateCheckRes.ok) {
                            const gateData = await gateCheckRes.json();
                            if (gateData.hasAccess && isSubscribed) {
                                console.log('[ReportPage] Server httpOnly gate access verified!');
                                try {
                                    localStorage.setItem('myeongsim_site_access', 'granted');
                                } catch (e) {}
                                setIsAuthenticated(true);
                                setIsCheckingAuth(false);
                                useReportStore.getState().setStep(1);
                                return;
                            }
                        }
                    } catch (e) {}
                }

                // 1차 세션 획득 시도
                let { session, user } = await fetchSessionSafe();

                // 세션이 없지만 localStorage에 토큰 흔적이 있거나, URL에 auth_success 파라미터가 있다면 재시도 대기
                if (!session && !user && (hasLocalStorageToken() || window.location.search.includes('auth_success'))) {
                    console.log('[ReportPage] LocalStorage token or auth_success detected! Waiting for session hydration...');
                    const delays = [300, 800, 1500, 2500];
                    for (const delay of delays) {
                        await new Promise(r => setTimeout(r, delay));
                        const retry = await fetchSessionSafe();
                        if (retry.session || retry.user) {
                            session = retry.session;
                            user = retry.user;
                            console.log(`[ReportPage] Session hydrated after ${delay}ms retry!`);
                            break;
                        }
                    }
                }

                // 100% 확실히 세션이 없고 localStorage에도 토큰이 없을 때만 로그인 페이지로 리다이렉트
                if (!session && !user && !hasLocalStorageToken()) {
                    console.log('[ReportPage] No session and no local token found, redirecting to login');
                    if (isSubscribed) {
                        setIsAuthenticated(false);
                        window.location.href = '/login';
                    }
                    return;
                }

                // 세션이 확인되었거나 토큰이 존재하므로 화면 승인
                if (isSubscribed) {
                    setIsAuthenticated(true);
                    useReportStore.getState().setStep(1);
                }

                // 약관 검사는 화면 진입 후 백그라운드 비동기로 가볍게 처리
                if (user?.id) {
                    ConsentService.getConsents(user.id).then((consents) => {
                        if (consents && !ConsentService.isConsentValid(consents) && isSubscribed) {
                            console.log('[ReportPage] Consents invalid, redirecting to consent');
                            router.push('/consent');
                        }
                    }).catch((err) => {
                        console.warn('[ReportPage] ConsentService check non-blocking warning:', err);
                    });
                }
            } catch (error) {
                console.error('[ReportPage] Fatal auth check error:', error);
                if (isSubscribed) {
                    setIsAuthenticated(false);
                    router.push('/login');
                }
            } finally {
                // 어떤 경우에도 무조건 로딩 해제 보장
                if (isSubscribed) {
                    setIsCheckingAuth(false);
                    clearTimeout(safetyTimer);
                }
            }
        };

        // 1. Initial Check
        checkAuth();

        // 2. Realtime Auth State Listener for OAuth Session Completion
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[ReportPage] Auth event:', event, session ? 'Session Exists' : 'No Session');
            if (session && isSubscribed) {
                setIsAuthenticated(true);
                setIsCheckingAuth(false);
                clearTimeout(safetyTimer);
            }
        });

        return () => {
            isSubscribed = false;
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, [router]);

    // 서버 사이드 렌더링 중이거나 아직 마운트 안 됐으면 껍데기만 보여줌 (에러 방지)
    if (!isMounted || isCheckingAuth) {
        return (
            <div className="min-h-[100dvh] w-full bg-[#1e262f] flex flex-col justify-center items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#10b748] animate-spin" />
                <p className="text-xs text-gray-400 font-mono">인증 및 기질 데이터 확인 중...</p>
            </div>
        );
    }

    // If not authenticated, show friendly action view instead of blank null
    if (!isAuthenticated) {
        return (
            <div className="min-h-[100dvh] w-full bg-[#070A13] flex flex-col justify-center items-center gap-4 text-white p-6 selection:bg-amber-400 selection:text-slate-950">
                <div className="max-w-sm w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center shadow-2xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mx-auto">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">명심코칭에 입장하는 중입니다</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        화면이 멈춘 경우 아래 버튼을 터치하여 바로 입장하시거나 로그인해 주세요.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            onClick={() => {
                                setIsAuthenticated(true);
                                useReportStore.getState().setStep(1);
                            }}
                            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                        >
                            ✨ 바로 리포트 열기
                        </button>
                        <a
                            href="/login"
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium text-xs border border-white/10 transition-all text-center"
                        >
                            기존 계정으로 로그인
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ⌚ [웨어러블 워치모드 Presentation Layer] 초소형 스마트워치 최적화 뷰
    if (isWearable) {
        return <WearableDashboard />;
    }

    // ⭐ [리파인모드 Presentation Layer] 프로덕션 프리미엄 AI 코칭 대시보드 & 리포트
    if (isRefined) {
        const { currentStep, reportData } = useReportStore.getState();
        // Step 1에서 아직 생년정보를 입력하지 않은 신규 유저에게는 리파인 온보딩 폼을 보여줌
        if (currentStep === 1 && !reportData?.birthDate) {
            return <RefinedCoverView />;
        }
        
        // 사용자가 리포트 상세(14단계) 보기를 눌렀을 때 RefinedReportLayout으로 감싸서 렌더링
        if (isViewingReportDetail) {
            return (
                <RefinedReportLayout onReturnToDashboard={() => setIsViewingReportDetail(false)}>
                    <ReportContent />
                </RefinedReportLayout>
            );
        }

        return (
            <RefinedDashboard
                onOpenReport={() => {
                    useReportStore.getState().setStep(3);
                    setIsViewingReportDetail(true);
                }}
            />
        );
    }

    // 🌟 [간편모드 Presentation Layer] 기존 로직 무수정, 렌더링 레이어만 분기 🌟
    if (isSimple) {
        return (
            <SimpleDashboard
                onSwitchToClassicReport={() => {
                    setViewMode('classic');
                    useReportStore.getState().setStep(3);
                }}
            />
        );
    }

    // 🏛️ [기본모드 Classic Layer] 기존 UI 100% 무수정 보존
    return (
        <BookLayout>
            <ReportContent />
            <DailyMindWelcomeModal />
        </BookLayout>
    );
}

