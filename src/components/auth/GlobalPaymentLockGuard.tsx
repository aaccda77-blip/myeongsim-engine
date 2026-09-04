'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import PaymentLockOverlay from './PaymentLockOverlay';
import { supabase } from '@/lib/supabaseClient';

export default function GlobalPaymentLockGuard() {
    const pathname = usePathname();
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');

    // 비잠금(공개/관리/인증/약관) 경로 판단
    const isExemptRoute = useCallback((path: string | null) => {
        if (!path) return true;
        if (
            path === '/' ||
            path === '/login' ||
            path === '/gate' ||
            path === '/privacy' ||
            path === '/terms' ||
            path === '/reset' ||
            path === '/consent' ||
            path.startsWith('/admin') ||
            path.startsWith('/api') ||
            path.startsWith('/auth')
        ) {
            return true;
        }
        return false;
    }, []);

    const checkLockStatus = useCallback(async (): Promise<boolean> => {
        if (isExemptRoute(pathname)) {
            setIsLocked(false);
            return false;
        }

        let shouldLock = true;

        try {
            // 1. 관리자 세션이거나 승인된 로컬 권한 보유 확인
            if (typeof window !== 'undefined') {
                const isAdmin = document.cookie.includes('admin_session=');
                const isMonthly = localStorage.getItem('myeongsim_monthly_vip') === 'true';
                const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true' || 
                                   localStorage.getItem('myeongsim_book_verified') === 'true';
                const isPaid = localStorage.getItem('myeongsim_paid_user') === 'true';

                // 만료일 검사
                const expiresAtStr = localStorage.getItem('myeongsim_expires_at');
                let isExpired = false;
                if (expiresAtStr) {
                    const exp = new Date(expiresAtStr).getTime();
                    if (!isNaN(exp) && Date.now() > exp) isExpired = true;
                }

                if (isAdmin || ((isMonthly || isSmartVip || isPaid) && !isExpired)) {
                    shouldLock = false;
                }
            }

            // 2. 서버 실시간 승인 확인 (관리자가 /admin/users에서 열어주었는지 조회)
            if (typeof window !== 'undefined') {
                const userName = localStorage.getItem('user_name') || localStorage.getItem('myeongsim_book_buyer') || '';
                const queryId = userId || localStorage.getItem('user_id') || '';

                if (userName || queryId) {
                    try {
                        const res = await fetch(`/api/payment/check-approval?name=${encodeURIComponent(userName)}&userId=${encodeURIComponent(queryId)}&t=${Date.now()}`);
                        if (res.ok) {
                            const checkData = await res.json();
                            if (checkData.approved) {
                                shouldLock = false;
                                if (checkData.tier === 'MONTHLY_98K' || checkData.tier?.includes('98000') || checkData.tier?.includes('MONTHLY')) {
                                    localStorage.setItem('myeongsim_monthly_vip', 'true');
                                    localStorage.setItem('myeongsim_paid_user', 'true');
                                } else if (checkData.tier === 'BOOK_ZERO_POINT' || checkData.tier?.includes('BOOK')) {
                                    localStorage.setItem('myeongsim_smartstore_vip', 'true');
                                    localStorage.setItem('myeongsim_book_verified', 'true');
                                    localStorage.setItem('myeongsim_paid_user', 'true');
                                } else {
                                    localStorage.setItem('myeongsim_paid_user', 'true');
                                }
                            }
                        }
                    } catch (e) {
                        console.warn('[GlobalPaymentLockGuard] Server check warning:', e);
                    }
                }
            }

            // 3. Supabase Auth 및 users 테이블 확인
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    const { data: subscription } = await supabase
                        .from('users')
                        .select('expires_at, membership_tier, is_active')
                        .eq('id', user.id)
                        .single();

                    if (subscription) {
                        const now = new Date().toISOString();
                        const expiresAt = subscription.expires_at;
                        const isExpired = !expiresAt || expiresAt < now;
                        const isAdmin = subscription.membership_tier === 'ADMIN';

                        if ((subscription.is_active && !isExpired) || isAdmin) {
                            shouldLock = false;
                        }
                    }
                }
            } catch (e) {}
        } catch (err) {
            console.error('[GlobalPaymentLockGuard] Error checking lock:', err);
        } finally {
            setIsLocked(shouldLock);
        }

        return shouldLock;
    }, [pathname, isExemptRoute, userId]);

    useEffect(() => {
        setMounted(true);
        checkLockStatus();

        const handleAuthChange = () => checkLockStatus();
        window.addEventListener('storage', handleAuthChange);
        window.addEventListener('myeongsim_auth_change', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('myeongsim_auth_change', handleAuthChange);
        };
    }, [pathname, checkLockStatus]);

    if (!mounted || isExemptRoute(pathname)) {
        return null;
    }

    if (isLocked) {
        return <PaymentLockOverlay onRefresh={checkLockStatus} userId={userId} />;
    }

    return null;
}
