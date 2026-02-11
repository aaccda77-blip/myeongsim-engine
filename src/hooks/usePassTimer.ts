// src/hooks/usePassTimer.ts
import { useState, useEffect } from 'react';

export const usePassTimer = (expiryTimestamp: string | null, tier: string = 'PASS_24H', onExpire?: () => void) => {
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

            // 2. 시간 포맷팅 (D-Day + HH:MM:SS or just HH:MM:SS)
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // [UX] 24시간 이상이면 "D-N HH:MM" 형식, 아니면 "HH:MM:SS"
            let formatted = '';
            if (days > 0) {
                formatted = `D-${days} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            } else {
                formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
            setTimeLeft(formatted);

            // 3. 남은 시간 퍼센트 계산 (Tier별 총 시간 기준)
            let totalDuration = 24 * 60 * 60 * 1000; // Default: 24h
            if (tier === 'VIP' || tier === 'VIP_7D') totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 Days
            if (tier === 'TRIAL' || tier === 'TRIAL_30M') totalDuration = 30 * 60 * 1000; // 30 Mins

            const currentPercent = Math.min(100, (distance / totalDuration) * 100);
            setPercent(currentPercent);

            // 4. 긴급 모드 (10분 미만 남았을 때)
            setIsUrgent(distance < 10 * 60 * 1000);

        }, 1000);

        return () => clearInterval(interval);
    }, [expiryTimestamp, tier]);

    return { timeLeft, percent, isUrgent, isExpired };
};
