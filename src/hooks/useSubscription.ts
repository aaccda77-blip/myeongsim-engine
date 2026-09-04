'use client';

import { useState, useEffect, useCallback } from 'react';

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
    refreshStatus: () => void;
}

export function useSubscription(): SubscriptionState {
    const [isMonthlyVip, setIsMonthlyVip] = useState(false);
    const [isBookZeroPoint, setIsBookZeroPoint] = useState(false);
    const [isPaidUser, setIsPaidUser] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFeatureName, setModalFeatureName] = useState('프리미엄 기능');

    const refreshStatus = useCallback(() => {
        if (typeof window === 'undefined') return;

        const monthly = localStorage.getItem('myeongsim_monthly_vip') === 'true';
        const book = localStorage.getItem('myeongsim_smartstore_vip') === 'true' || 
                     localStorage.getItem('myeongsim_book_verified') === 'true';
        const paid = localStorage.getItem('myeongsim_paid_user') === 'true';

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
    }, []);

    useEffect(() => {
        refreshStatus();

        // Listen to storage events across tabs or admin actions
        const handleStorage = () => refreshStatus();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('myeongsim_auth_change', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('myeongsim_auth_change', handleStorage);
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
    // 1. GUEST: No deep features, no zero point coaching
    // 2. BOOK_ZERO_POINT: Basic zero point coaching ONLY (myeongsim basic report, daily insight, 1-sec reset)
    // 3. MONTHLY_98K: All-Pass 123 pages unlimited access
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
        refreshStatus
    };
}
