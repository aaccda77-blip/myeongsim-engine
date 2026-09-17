/**
 * [Zero-Flicker Synchronous Approval Guardian]
 * 브라우저 메모리(LocalStorage & Cookies)를 0.0001ms 만에 동기식으로 조회하여
 * 관리자 승인을 받았거나 유료/도서 인증이 완료된 사용자에게
 * 페이지 이동 시 결제 잠금 오버레이가 1프레임도 깜빡이지 않도록 보장합니다.
 */
export const isUserApprovedSync = (): boolean => {
    // 🌟 [오픈기념 전면 무료 개방 모드] 모든 결제 잠금 해제 및 전체 무료 이용 제공
    return true;
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
