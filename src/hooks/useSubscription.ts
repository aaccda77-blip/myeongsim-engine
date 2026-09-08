'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { grantUserApprovalSync } from '@/lib/authGuardUtils';

export type UserTier = 'GUEST' | 'BOOK_ZERO_POINT' | 'MONTHLY_98K';

export interface SubscriptionState {
    isMonthlyVip: boolean;
    isBookZeroPoint: boolean;
    isPaidUser: boolean;
    isExpired: boolean;
    userTier: UserTier;
    canAccessDeepFeatures: boolean;
    canAccessZeroPoint: boolean;
    openModal: (feature?: string) => void;
    closeModal: () => void;
    isModalOpen: boolean;
    modalFeatureName: string;
    refreshStatus: () => Promise<void>;
    isCheckingApproval: boolean;
}

export function useSubscription(): SubscriptionState {
    const [isMonthlyVip, setIsMonthlyVip] = useState(false);
    const [isBookZeroPoint, setIsBookZeroPoint] = useState(false);
    const [isPaidUser, setIsPaidUser] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFeatureName, setModalFeatureName] = useState('프리미엄 기능');
    const [isCheckingApproval, setIsCheckingApproval] = useState(false);
    const isSyncingRef = useRef(false);

    // 서버의 실제 관리자 승인 상태와 동기화 (클라이언트 임의 조작 방지)
    const syncWithServer = useCallback(async () => {
        if (typeof window === 'undefined' || isSyncingRef.current) return;
        isSyncingRef.current = true;
        setIsCheckingApproval(true);

        try {
            // 세션 유저 정보 우선 획득 (구글 로그인 등)
            let sessionUid = '';
            let sessionEmail = '';
            try {
                const { supabase } = await import('@/lib/supabaseClient');
                const { data: { session } } = await supabase.auth.getSession();
                sessionUid = session?.user?.id || '';
                sessionEmail = session?.user?.email || '';
            } catch (_) {}

            const storedUserId = sessionUid || localStorage.getItem('user_id') || localStorage.getItem('myeongsim_user_id') || localStorage.getItem('myeongsim_phone') || '';
            const storedName = localStorage.getItem('user_name') || localStorage.getItem('myeongsim_depositor_name') || localStorage.getItem('myeongsim_user_name') || '';
            const storedEmail = sessionEmail || localStorage.getItem('user_email') || localStorage.getItem('myeongsim_email') || '';
            const storedPhone = localStorage.getItem('myeongsim_phone') || '';
            const storedOrder = localStorage.getItem('myeongsim_verified_order') || '';

            // 사용자 식별 정보가 있으면 서버에 승인 여부 확인
            if (storedUserId || storedName || storedEmail || storedPhone || storedOrder) {
                const params = new URLSearchParams();
                if (storedUserId) params.set('userId', storedUserId);
                if (storedName) params.set('name', storedName);
                if (storedEmail) params.set('email', storedEmail);
                if (storedPhone) params.set('phone', storedPhone);
                if (storedOrder) params.set('orderNumber', storedOrder);

                const res = await fetch(`/api/payment/check-approval?${params.toString()}&t=${Date.now()}`, {
                    cache: 'no-store'
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.approved) {
                        grantUserApprovalSync(data.tier);
                        localStorage.setItem('myeongsim_approved_tier', data.tier || 'MONTHLY_98K');
                    } else if (data.locked === true) {
                        // 관리자가 명시적으로 잠금(닫기) 처리한 경우에만 로컬 VIP 플래그 회수
                        localStorage.removeItem('myeongsim_server_approved');
                        localStorage.removeItem('myeongsim_site_access');
                        localStorage.removeItem('myeongsim_monthly_vip');
                        localStorage.removeItem('myeongsim_smartstore_vip');
                        localStorage.removeItem('myeongsim_book_verified');
                        localStorage.removeItem('myeongsim_paid_user');
                    }
                }
            }
        } catch (e) {
            console.warn('[useSubscription] sync error:', e);
        } finally {
            isSyncingRef.current = false;
            setIsCheckingApproval(false);
        }
    }, []);

    const refreshStatus = useCallback(async () => {
        if (typeof window === 'undefined') return;

        // 1. 관리자 세션 즉각 감지 (관리자는 100% 무조건 모든 기능 영구 해금)
        const isAdmin = typeof document !== 'undefined' && (
            document.cookie.includes('admin_session=') ||
            sessionStorage.getItem('myeongsim_admin_authed') === 'true' ||
            sessionStorage.getItem('myeongsim_admin_authenticated') === 'true' ||
            localStorage.getItem('myeongsim_admin_authenticated') === 'true'
        );

        if (isAdmin) {
            grantUserApprovalSync('MONTHLY_98K');
            setIsMonthlyVip(true);
            setIsBookZeroPoint(true);
            setIsPaidUser(true);
            setIsExpired(false);
            return;
        }

        // 2. 서버 승인 상태 동기화
        await syncWithServer();

        // 3. 권한 확인: 쿠키, 사이트 액세스, 로컬스토리지 권한 종합 인정
        const siteAccessCookie = typeof document !== 'undefined' && (
            document.cookie.includes('myeongsim_site_access=granted') ||
            document.cookie.includes('myeongsim_site_access_client=granted') ||
            document.cookie.includes('admin_session=')
        );
        const siteAccess = siteAccessCookie || localStorage.getItem('myeongsim_site_access') === 'granted';
        const serverApproved = localStorage.getItem('myeongsim_server_approved') === 'true';
        const monthly = localStorage.getItem('myeongsim_monthly_vip') === 'true';
        const book = localStorage.getItem('myeongsim_smartstore_vip') === 'true' || 
                     localStorage.getItem('myeongsim_book_verified') === 'true';
        const paid = siteAccess || serverApproved || localStorage.getItem('myeongsim_paid_user') === 'true';

        // 만료일 체크 (무료 맛보기 체험자에게만 적용, 승인/유료 회원은 영구 또는 30일 유효)
        const isTrialActive = localStorage.getItem('myeongsim_trial_active') === 'true';
        let expired = false;
        if (isTrialActive && !serverApproved && !monthly && !book && !siteAccess && !isAdmin) {
            const expiresAtStr = localStorage.getItem('myeongsim_expires_at');
            if (expiresAtStr) {
                const expTime = new Date(expiresAtStr).getTime();
                if (!isNaN(expTime) && Date.now() > expTime) {
                    expired = true;
                }
            }
        }
        setIsExpired(expired);

        const isVipFull = Boolean(isAdmin || monthly || serverApproved || siteAccess);
        setIsMonthlyVip(isVipFull);
        setIsBookZeroPoint(Boolean(book || isVipFull));
        setIsPaidUser(Boolean(isVipFull || book || paid) && !expired);
    }, [syncWithServer]);

    useEffect(() => {
        refreshStatus();

        const handleStorage = () => refreshStatus();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('myeongsim_auth_change', handleStorage);
        window.addEventListener('focus', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('myeongsim_auth_change', handleStorage);
            window.removeEventListener('focus', handleStorage);
        };
    }, [refreshStatus]);

    const openModal = useCallback((feature: string = '프리미엄 심화 기능') => {
        setModalFeatureName(feature);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // 3-Tier Authority
    // 1. GUEST: 미결제 / 관리자 미승인 (모든 앱 완전 잠금)
    // 2. BOOK_ZERO_POINT: 도서 구매 승인자 (기본 제로포인트 e-Book, 기본 리포트만 해금, 심화 기능 잠금)
    // 3. MONTHLY_98K: 월 98,000원 VIP 정액권 승인자 (124개 전 서비스 무제한 올패스 해금)
    const userTier: UserTier = isMonthlyVip 
        ? 'MONTHLY_98K' 
        : (isBookZeroPoint || isPaidUser) 
        ? 'BOOK_ZERO_POINT' 
        : 'GUEST';

    const canAccessDeepFeatures = Boolean(isMonthlyVip);
    const canAccessZeroPoint = Boolean(isMonthlyVip || isBookZeroPoint || isPaidUser);

    return {
        isMonthlyVip,
        isBookZeroPoint,
        isPaidUser,
        isExpired,
        userTier,
        canAccessDeepFeatures,
        canAccessZeroPoint,
        openModal,
        closeModal,
        isModalOpen,
        modalFeatureName,
        refreshStatus,
        isCheckingApproval
    };
}

