'use client';

import { useState, useEffect } from 'react';

/**
 * useSubscription - 이용권 상태 확인 훅
 * 
 * localStorage의 myeongsim_expiry_date를 확인하여 이용권 만료 여부를 반환합니다.
 */
export function useSubscription() {
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);

    useEffect(() => {
        const checkSubscription = () => {
            if (typeof window === 'undefined') {
                setIsLoading(false);
                return;
            }

            try {
                const expiryStr = localStorage.getItem('myeongsim_expiry_date');

                if (!expiryStr) {
                    // 만료일 정보가 없으면 만료되지 않은 것으로 처리 (최초 사용자)
                    setIsExpired(false);
                    setIsLoading(false);
                    return;
                }

                const expiry = new Date(expiryStr);
                const now = new Date();

                setExpiryDate(expiry);
                setIsExpired(now > expiry);
            } catch (e) {
                console.error('[useSubscription] Error checking expiry:', e);
                setIsExpired(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkSubscription();

        // 1분마다 이용권 상태 재확인
        const interval = setInterval(checkSubscription, 60000);
        return () => clearInterval(interval);
    }, []);

    return { isExpired, isLoading, expiryDate };
}
