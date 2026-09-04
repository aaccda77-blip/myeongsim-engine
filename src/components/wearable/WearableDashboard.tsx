'use client';

import React, { useState } from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { useViewMode } from '@/hooks/useViewMode';
import { WearableAppShell } from './WearableAppShell';
import { WearableQuantumRadar } from './WearableQuantumRadar';
import { WearableDailyAffirmation } from './WearableDailyAffirmation';
import { WearableBioPulse } from './WearableBioPulse';
import { WearableBreathingPacer } from './WearableBreathingPacer';
import { WearableBrainwaveAudio } from './WearableBrainwaveAudio';
import { WearableZeroPointCapsule } from './WearableZeroPointCapsule';
import { WearableDarkCodeEmergency } from './WearableDarkCodeEmergency';
import { WearableFlowRing } from './WearableFlowRing';
import { WearableCheckIn } from './WearableCheckIn';

export function WearableDashboard() {
    const vm = useDashboardViewModel();
    const { setViewMode } = useViewMode();
    const [page, setPage] = useState(0);

    const totalPages = 9;
    const pageTitles = [
        '👑 퀀텀 킬러 레이더',
        '⭐ 1:1 일진 선언문',
        '1. 바이오 펄스',
        '2. 박스 호흡',
        '3. 손목 사운드',
        '4. 영점 리셋',
        '5. 긴급 SOS',
        '6. 몰입 플로우',
        '7. 감정 체크'
    ];

    const renderPage = () => {
        switch (page) {
            case 0:
                return (
                    <WearableQuantumRadar
                        onGoToBreath={() => setPage(3)}
                        onGoToSoundLab={() => setPage(4)}
                    />
                );
            case 1:
                return (
                    <WearableDailyAffirmation
                        onGoToSoundLab={() => setPage(4)}
                    />
                );
            case 2:
                return (
                    <WearableBioPulse
                        onGoToBreath={() => setPage(3)}
                        onGoToEmergency={() => setPage(6)}
                    />
                );
            case 3:
                return (
                    <WearableBreathingPacer
                        onNext={() => setPage(4)}
                    />
                );
            case 4:
                return (
                    <WearableBrainwaveAudio
                        onNext={() => setPage(5)}
                    />
                );
            case 5:
                return (
                    <WearableZeroPointCapsule
                        onNext={() => setPage(6)}
                    />
                );
            case 6:
                return (
                    <WearableDarkCodeEmergency
                        onComplete={() => setPage(0)}
                    />
                );
            case 7:
                return (
                    <WearableFlowRing
                        score={vm.flow.score}
                        stateTitle={vm.flow.stateTitle}
                        levelLabel={vm.flow.levelLabel}
                        onNext={() => setPage(8)}
                    />
                );
            case 8:
                return (
                    <WearableCheckIn
                        onNext={() => setPage(0)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <WearableAppShell
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageTitles={pageTitles}
        >
            {renderPage()}
        </WearableAppShell>
    );
}



