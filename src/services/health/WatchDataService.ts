import { useState, useEffect } from 'react';

/**
 * [Web Simulator] WatchDataService
 * Simulates biometric data streams for the Bio-Sync Dashboard.
 * In a real mobile app, this would bridge to 'mobile-bridge/hooks/useBioSync'.
 */

export interface WatchData {
    bpm: number;
    hrv: number;
    steps: number;
    stressLevel: 'LOW' | 'MODERATE' | 'HIGH';
    stressScore: number; // 0 ~ 100
    autonomicBalance: {
        sympathetic: number; // 교감신경 %
        parasympathetic: number; // 부교감신경 %
    };
    zeroPointAlignment: number; // 제로포인트 정렬도 0 ~ 100%
    respirationRate: number; // 호흡수 (회/분)
    recoveryScore: number; // 심신 회복 점수 0 ~ 100
    status: 'SYNCING' | 'CONNECTED' | 'DISCONNECTED';
}

export const useWatchData = () => {
    const [data, setData] = useState<WatchData>({
        bpm: 72,
        hrv: 48,
        steps: 3420,
        stressLevel: 'LOW',
        stressScore: 28,
        autonomicBalance: { sympathetic: 42, parasympathetic: 58 },
        zeroPointAlignment: 88,
        respirationRate: 14,
        recoveryScore: 85,
        status: 'SYNCING'
    });

    useEffect(() => {
        // Mock connection delay
        const timer = setTimeout(() => {
            setData(prev => ({ ...prev, status: 'CONNECTED' }));
        }, 1200);

        // Mock Real-time Updates
        const interval = setInterval(() => {
            setData(prev => {
                // Random fluctuation simulation
                const newBpm = 64 + Math.floor(Math.random() * 20); // 64-84 BPM
                const newHrv = 32 + Math.floor(Math.random() * 42); // 32-74 ms

                let stress: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
                let stressScore = 25;
                if (newHrv < 38) {
                    stress = 'HIGH';
                    stressScore = 70 + Math.floor(Math.random() * 25);
                } else if (newHrv < 52) {
                    stress = 'MODERATE';
                    stressScore = 40 + Math.floor(Math.random() * 25);
                } else {
                    stress = 'LOW';
                    stressScore = 15 + Math.floor(Math.random() * 20);
                }

                // 자율신경계 비율 (교감 + 부교감 = 100)
                const sympathetic = Math.min(85, Math.max(20, Math.round(stressScore * 0.7 + (newBpm - 60) * 0.5)));
                const parasympathetic = 100 - sympathetic;

                // 제로포인트 정렬도 (HRV와 부교감신경이 높을수록 상승)
                const zeroPointAlignment = Math.min(99, Math.max(40, Math.round((newHrv / 75) * 50 + (parasympathetic / 100) * 50)));

                // 회복 점수
                const recoveryScore = Math.min(100, Math.max(30, Math.round(zeroPointAlignment * 0.9 + (100 - stressScore) * 0.1)));

                return {
                    ...prev,
                    bpm: newBpm,
                    hrv: newHrv,
                    steps: prev.steps + (Math.random() > 0.4 ? Math.floor(Math.random() * 6) : 0),
                    stressLevel: stress,
                    stressScore,
                    autonomicBalance: { sympathetic, parasympathetic },
                    zeroPointAlignment,
                    respirationRate: 13 + Math.floor(Math.random() * 4),
                    recoveryScore
                };
            });
        }, 2500); // 2.5초마다 갱신

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return data;
};

