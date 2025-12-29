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
    status: 'SYNCING' | 'CONNECTED' | 'DISCONNECTED';
}

export const useWatchData = () => {
    const [data, setData] = useState<WatchData>({
        bpm: 72,
        hrv: 45,
        steps: 0,
        stressLevel: 'LOW',
        status: 'SYNCING'
    });

    useEffect(() => {
        // Mock connection delay
        const timer = setTimeout(() => {
            setData(prev => ({ ...prev, status: 'CONNECTED' }));
        }, 1500);

        // Mock Real-time Updates
        const interval = setInterval(() => {
            setData(prev => {
                // Random fluctuation simulation
                const newBpm = 65 + Math.floor(Math.random() * 20); // 65-85 BPM
                const newHrv = 30 + Math.floor(Math.random() * 40); // 30-70 ms

                let stress: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
                if (newHrv < 35) stress = 'HIGH';
                else if (newHrv < 50) stress = 'MODERATE';

                return {
                    ...prev,
                    bpm: newBpm,
                    hrv: newHrv,
                    steps: prev.steps + Math.floor(Math.random() * 5),
                    stressLevel: stress
                };
            });
        }, 3000); // Update every 3 seconds

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return data;
};
