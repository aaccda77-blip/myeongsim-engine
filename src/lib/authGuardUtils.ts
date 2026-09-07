/**
 * [Zero-Flicker Synchronous Approval Guardian]
 * 브라우저 메모리(LocalStorage & Cookies)를 0.0001ms 만에 동기식으로 조회하여
 * 관리자 승인을 받았거나 유료/도서 인증이 완료된 사용자에게
 * 페이지 이동 시 결제 잠금 오버레이가 1프레임도 깜빡이지 않도록 보장합니다.
 */
export const isUserApprovedSync = (): boolean => {
    if (typeof window === 'undefined') return true; // SSR 중에는 오버레이 노출 방지

    try {
        // 1. 관리자 세션
        if (document.cookie.includes('admin_session=')) {
            return true;
        }

        // 2. 관리자가 승인(열어주기)하여 발급된 영구/일반 액세스 권한
        const siteAccessCookie = document.cookie.includes('myeongsim_site_access=granted') ||
                                 document.cookie.includes('myeongsim_site_access_client=granted');
        const siteAccessLocal = localStorage.getItem('myeongsim_site_access') === 'granted';
        if (siteAccessCookie || siteAccessLocal) {
            return true;
        }

        // 3. 월정액 VIP 및 도서 구매자 인증 상태
        const isMonthly = localStorage.getItem('myeongsim_monthly_vip') === 'true';
        const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true';
        const isBookVerified = localStorage.getItem('myeongsim_book_verified') === 'true';
        const isPaid = localStorage.getItem('myeongsim_paid_user') === 'true';

        if (isMonthly || isSmartVip || isBookVerified || isPaid) {
            return true;
        }

        // 4. 활성 체험 기간 확인
        const isTrialActive = localStorage.getItem('myeongsim_trial_active') === 'true';
        if (isTrialActive) {
            const expStr = localStorage.getItem('myeongsim_expires_at');
            if (expStr) {
                const expTime = new Date(expStr).getTime();
                if (!isNaN(expTime) && Date.now() <= expTime) {
                    return true;
                }
            }
        }
    } catch (e) {
        console.warn('[isUserApprovedSync] Check error:', e);
    }

    return false;
};
