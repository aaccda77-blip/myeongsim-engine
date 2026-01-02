// src/hooks/usePassTimer.ts
import { useState, useEffect } from 'react';

export const usePassTimer = (expiryTimestamp: string | null, onExpire?: () => void) => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
    const [percent, setPercent] = useState<number>(0);
    const [isUrgent, setIsUrgent] = useState<boolean>(false);
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        if (!expiryTimestamp) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(expiryTimestamp).getTime();
            const distance = expiry - now;

            // 1. 만료 체크
            if (distance < 0) {
                clearInterval(interval);
                if (!isExpired) {
                    setIsExpired(true);
                    setTimeLeft("이용권 만료");
                    setPercent(0);
                    if (onExpire) onExpire();
                }
                return;
            }

            // 2. 시간 포맷팅 (HH:MM:SS)
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            setTimeLeft(formatted);

            // 3. 남은 시간 퍼센트 계산 (예: 24시간 기준)
            const totalDuration = 24 * 60 * 60 * 1000; // 24시간 패스라 가정
            const currentPercent = Math.min(100, (distance / totalDuration) * 100);
            setPercent(currentPercent);

            // 4. 긴급 모드 (1시간 미만 남았을 때)
            setIsUrgent(distance < 60 * 60 * 1000);

        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTimestamp]);

    return { timeLeft, percent, isUrgent, isExpired };
};
