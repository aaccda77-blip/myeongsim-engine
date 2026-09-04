'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
            const storedUserId = localStorage.getItem('myeongsim_user_id') || localStorage.getItem('myeongsim_phone') || '';
            const storedName = localStorage.getItem('myeongsim_depositor_name') || localStorage.getItem('myeongsim_user_name') || '';

            // 사용자 식별 정보가 있으면 서버에 승인 여부 확인
            if (storedUserId || storedName) {
                const params = new URLSearchParams();
                if (storedUserId) params.set('userId', storedUserId);
                if (storedName) params.set('name', storedName);

                const res = await fetch(`/api/payment/check-approval?${params.toString()}&t=${Date.now()}`, {
                    cache: 'no-store'
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.approved) {
                        const isMonthly = data.tier === 'MONTHLY_98K';
                        const isBook = data.tier === 'BOOK_ZERO_POINT';

                        localStorage.setItem('myeongsim_server_approved', 'true');
                        localStorage.setItem('myeongsim_approved_tier', data.tier || 'MONTHLY_98K');
                        if (isMonthly) {
                            localStorage.setItem('myeongsim_monthly_vip', 'true');
                            localStorage.setItem('myeongsim_paid_user', 'true');
                        } else if (isBook) {
                            localStorage.setItem('myeongsim_smartstore_vip', 'true');
                            localStorage.setItem('myeongsim_book_verified', 'true');
                            localStorage.setItem('myeongsim_paid_user', 'true');
                            localStorage.removeItem('myeongsim_monthly_vip');
                        }
                    } else {
                        // 관리자가 승인하지 않았거나 잠금 처리함 -> 로컬 VIP 플래그 강제 회수
                        localStorage.removeItem('myeongsim_server_approved');
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

        // 1. 서버 승인 상태 동기화
        await syncWithServer();

        // 2. 서버 승인 마크가 있는 경우에만 유효
        const serverApproved = localStorage.getItem('myeongsim_server_approved') === 'true';
        const monthly = serverApproved && localStorage.getItem('myeongsim_monthly_vip') === 'true';
        const book = serverApproved && (
            localStorage.getItem('myeongsim_smartstore_vip') === 'true' || 
            localStorage.getItem('myeongsim_book_verified') === 'true'
        );
        const paid = serverApproved && localStorage.getItem('myeongsim_paid_user') === 'true';

        // 만료일 체크
        const expiresAtStr = localStorage.getItem('myeongsim_expires_at');
        let expired = false;
        if (expiresAtStr) {
            const expTime = new Date(expiresAtStr).getTime();
            if (!isNaN(expTime) && Date.now() > expTime) {
                expired = true;
            }
        }
        setIsExpired(expired);

        setIsMonthlyVip(monthly && !expired);
        setIsBookZeroPoint(book);
        setIsPaidUser((monthly || book || paid) && !expired);
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

    const canAccessDeepFeatures = isMonthlyVip;
    const canAccessZeroPoint = isMonthlyVip || isBookZeroPoint || isPaidUser;

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

