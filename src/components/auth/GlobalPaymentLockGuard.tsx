'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import PaymentLockOverlay from './PaymentLockOverlay';
import { supabase } from '@/lib/supabaseClient';
import { isUserApprovedSync, grantUserApprovalSync } from '@/lib/authGuardUtils';

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

        // ⚡ [Zero-Flicker Instant Pass] 이미 승인된 회원은 0.0001ms 만에 즉시 통과!
        if (isUserApprovedSync()) {
            setIsLocked(false);
            return false;
        }

        let shouldLock = true;

        try {
            // 0. Supabase Session 및 사용자 식별 정보 사전 로드 (모바일 구글 로그인 등)
            let sessionUid = '';
            let sessionEmail = '';
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    sessionUid = session.user.id || '';
                    sessionEmail = session.user.email || '';
                    if (sessionUid && !userId) setUserId(sessionUid);
                    if (typeof window !== 'undefined') {
                        if (sessionUid) localStorage.setItem('user_id', sessionUid);
                        if (sessionEmail) localStorage.setItem('user_email', sessionEmail);
                    }
                }
            } catch (_) {}

            // 1. 관리자 세션이거나 승인된 로컬 권한 보유 확인
            if (typeof window !== 'undefined') {
                const isAdmin = document.cookie.includes('admin_session=');
                const isServerApproved = localStorage.getItem('myeongsim_server_approved') === 'true';
                const isMonthly = localStorage.getItem('myeongsim_monthly_vip') === 'true';
                const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true' || 
                                   localStorage.getItem('myeongsim_book_verified') === 'true';
                const isPaid = localStorage.getItem('myeongsim_paid_user') === 'true';
                const isSiteAccess = localStorage.getItem('myeongsim_site_access') === 'granted' ||
                                     document.cookie.includes('myeongsim_site_access=granted');
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

            // 2. 서버 실시간 승인 확인 (관리자가 /admin/users에서 열어주었는지 조회)
            if (typeof window !== 'undefined') {
                const userName = localStorage.getItem('user_name') || localStorage.getItem('myeongsim_book_buyer') || '';
                const queryId = userId || sessionUid || localStorage.getItem('user_id') || '';
                const queryEmail = sessionEmail || localStorage.getItem('user_email') || '';
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
                        console.warn('[GlobalPaymentLockGuard] Server check warning:', e);
                    }
                }
            }

            // 3. Supabase Auth 및 users 테이블 확인 (UID 또는 이메일 매칭)
            try {
                const targetUid = sessionUid || userId;
                const targetEmail = sessionEmail || (typeof window !== 'undefined' ? localStorage.getItem('user_email') || '' : '');
                if (targetUid || targetEmail) {
                    const orFilters: string[] = [];
                    if (targetUid && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUid)) {
                        orFilters.push(`id.eq.${targetUid}`);
                    }
                    if (targetEmail && targetEmail.includes('@')) {
                        orFilters.push(`email.eq.${targetEmail.toLowerCase().trim()}`);
                    }

                    if (orFilters.length > 0) {
                        const { data: subscription } = await supabase
                            .from('users')
                            .select('expires_at, membership_tier, is_active')
                            .or(orFilters.join(','))
                            .order('updated_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();

                        if (subscription) {
                            const now = new Date().toISOString();
                            const expiresAt = subscription.expires_at;
                            const isExpired = !expiresAt || expiresAt < now;
                            const isAdmin = subscription.membership_tier === 'ADMIN';

                            if ((subscription.is_active && !isExpired) || isAdmin) {
                                shouldLock = false;
                                localStorage.setItem('myeongsim_site_access', 'granted');
                                localStorage.setItem('myeongsim_server_approved', 'true');
                                localStorage.setItem('myeongsim_paid_user', 'true');
                                if (subscription.membership_tier === 'MONTHLY_98K') {
                                    localStorage.setItem('myeongsim_monthly_vip', 'true');
                                } else if (subscription.membership_tier === 'BOOK_ZERO_POINT') {
                                    localStorage.setItem('myeongsim_smartstore_vip', 'true');
                                    localStorage.setItem('myeongsim_book_verified', 'true');
                                }
                                document.cookie = "myeongsim_site_access=granted; path=/; max-age=2592000; SameSite=Lax";
                                document.cookie = "myeongsim_site_access_client=granted; path=/; max-age=2592000; SameSite=Lax";
                            }
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

        // 3분 체험 만료 실시간 감지 타이머 (5초 간격)
        const expiryTimer = setInterval(() => {
            const expStr = typeof window !== 'undefined' ? localStorage.getItem('myeongsim_expires_at') : null;
            if (expStr) {
                const expTime = new Date(expStr).getTime();
                if (!isNaN(expTime) && Date.now() > expTime) {
                    checkLockStatus();
                }
            }
        }, 5000);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('myeongsim_auth_change', handleAuthChange);
            clearInterval(expiryTimer);
        };
    }, [pathname, checkLockStatus]);

    // 마운트 전이거나, 제외 경로이거나, 이미 승인된 사용자는 즉시 null 반환 (0초 완벽 통과)
    if (!mounted || isExemptRoute(pathname) || isUserApprovedSync()) {
        return null;
    }

    if (isLocked) {
        return <PaymentLockOverlay onRefresh={checkLockStatus} userId={userId} />;
    }

    return null;
}
