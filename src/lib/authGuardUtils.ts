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
        if (
            document.cookie.includes('admin_session=') ||
            sessionStorage.getItem('myeongsim_admin_authenticated') === 'true' ||
            localStorage.getItem('myeongsim_admin_authenticated') === 'true'
        ) {
            return true;
        }

        // 2. 서버 승인 완료 플래그 (관리자가 승인했거나 결제 확인된 경우만)
        if (localStorage.getItem('myeongsim_server_approved') === 'true') {
            return true;
        }

        // 3. 월정액 VIP 및 도서 구매자 인증 상태 (반드시 서버 승인 플래그와 함께 있을 때만 유효)
        const isBookVerified = localStorage.getItem('myeongsim_book_verified') === 'true';
        const hasServerApproval = localStorage.getItem('myeongsim_server_approved') === 'true';

        if (isBookVerified && hasServerApproval) {
            return true;
        }

        // 5. 활성 체험 기간 확인 (유료 회원이 아닌 경우에만 시간 검사)
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

/**
 * [관리자 승인 / 결제 / 도서 인증 시 모든 잠금 해제 플래그 완벽 동기화]
 */
export const grantUserApprovalSync = (tier?: string) => {
    if (typeof window === 'undefined') return;
    try {
        const isBook = tier === 'BOOK_ZERO_POINT' || tier?.includes('BOOK');
        localStorage.setItem('myeongsim_server_approved', 'true');
        localStorage.setItem('myeongsim_paid_user', 'true');
        localStorage.setItem('myeongsim_site_access', 'granted');
        if (isBook) {
            localStorage.setItem('myeongsim_smartstore_vip', 'true');
            localStorage.setItem('myeongsim_book_verified', 'true');
        } else {
            localStorage.setItem('myeongsim_monthly_vip', 'true');
        }

        // 과거 3분 체험 만료 및 승인 대기 플래그 완전 제거
        localStorage.removeItem('myeongsim_trial_active');
        localStorage.removeItem('myeongsim_pending_approval');
        localStorage.removeItem('myeongsim_pending_wire');

        // 채팅 턴수 및 사용량 완전 초기화 (무제한/리셋)
        localStorage.setItem('myeongsim_total_user_messages', '0');
        localStorage.setItem('myeongsim_free_turns', '0');
        sessionStorage.setItem('freeTurns', '0');

        // 30일 여유 만료일 설정하여 모든 시간 만료 검사 통과 보장
        const freshExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        localStorage.setItem('myeongsim_expires_at', freshExpiry);
        localStorage.setItem('myeongsim_expiry_date', freshExpiry);

        // 브라우저 쿠키 영구 연동 (30일)
        document.cookie = "myeongsim_site_access=granted; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = "myeongsim_site_access_client=granted; path=/; max-age=2592000; SameSite=Lax";

        // 전체 컴포넌트 실시간 동기화 이벤트 발송
        window.dispatchEvent(new Event('myeongsim_auth_change'));
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.warn('[grantUserApprovalSync] Error:', e);
    }
};
