// hooks/useAuthGuard.ts
import { useEffect, useState } from 'react';

interface UserStatus {
    isLoggedIn: boolean;
    hasActivePass: boolean;
    remainingCredits: number;
    userName: string;
}

export const useAuthGuard = () => {
    const [userStatus, setUserStatus] = useState<UserStatus>({
        isLoggedIn: false,
        hasActivePass: false,
        remainingCredits: 0,
        userName: ''
    });

    useEffect(() => {
        checkLocalSession();
    }, []);

    const checkLocalSession = async () => {
        // 1. 로컬 스토리지에서 저장된 토큰 확인 (새로고침/재접속 시 유지 목적)
        // [기존 고객 지원] myeongsim_token 또는 myeongsim_user_id 둘 다 확인
        const token = localStorage.getItem('myeongsim_token') || localStorage.getItem('myeongsim_user_id');

        if (token) {
            // 2. 토큰이 있다면 백엔드에 유효성 및 이용권 상태 확인 요청
            try {
                const response = await fetch('/api/user/status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.isValid) {
                    // 인증 성공 시 상태 업데이트
                    setUserStatus({
                        isLoggedIn: true,
                        hasActivePass: data.hasActivePass, // 이용권 유효 여부
                        remainingCredits: data.remainingCredits, // 남은 횟수
                        userName: data.userName
                    });

                    // [중요] 만료 시간을 localStorage에 저장 (TimeCapsule, UrgentNoticeModal 사용)
                    if (data.expiresAt) {
                        localStorage.setItem('myeongsim_expiry_date', data.expiresAt);
                    }

                    // [기존 고객 편의] 토큰 통일 (myeongsim_token으로)
                    if (!localStorage.getItem('myeongsim_token')) {
                        localStorage.setItem('myeongsim_token', token);
                    }

                    console.log("✅ 기존 회원 자동 인증 완료", {
                        tier: data.membershipTier,
                        hasPass: data.hasActivePass,
                        expiresAt: data.expiresAt
                    });
                } else {
                    // 토큰 만료 시 로그아웃 처리
                    logout();
                }
            } catch (error) {
                console.error("❌ 세션 확인 실패", error);
                // 네트워크 오류 시에도 로컬 데이터 유지 (오프라인 대응)
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('myeongsim_token');
        localStorage.removeItem('myeongsim_user_id');
        localStorage.removeItem('myeongsim_login_at');
        localStorage.removeItem('myeongsim_expiry_date'); // [Added] Clear expiry date
        setUserStatus({
            isLoggedIn: false,
            hasActivePass: false,
            remainingCredits: 0,
            userName: ''
        });
    };

    // 결제 모달을 띄워야 하는지 판단하는 함수
    const shouldShowPaymentModal = () => {
        // 로그인이 되어있고, 유효한 패스가 있다면 모달을 띄우지 않음 (False 반환)
        if (userStatus.isLoggedIn && userStatus.hasActivePass) {
            return false;
        }
        // 그 외의 경우(비로그인, 이용권 만료)에만 띄움
        return true;
    };

    return { userStatus, shouldShowPaymentModal, logout };
};
