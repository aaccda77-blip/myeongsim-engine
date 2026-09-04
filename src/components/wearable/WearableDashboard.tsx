'use client';

import React, { useState } from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { useViewMode } from '@/hooks/useViewMode';
import { WearableAppShell } from './WearableAppShell';
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

    const totalPages = 7;
    const pageTitles = [
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
                    <WearableBioPulse
                        onGoToBreath={() => setPage(1)}
                        onGoToEmergency={() => setPage(4)}
                    />
                );
            case 1:
                return (
                    <WearableBreathingPacer
                        onNext={() => setPage(2)}
                    />
                );
            case 2:
                return (
                    <WearableBrainwaveAudio
                        onNext={() => setPage(3)}
                    />
                );
            case 3:
                return (
                    <WearableZeroPointCapsule
                        onNext={() => setPage(4)}
                    />
                );
            case 4:
                return (
                    <WearableDarkCodeEmergency
                        onComplete={() => setPage(0)}
                    />
                );
            case 5:
                return (
                    <WearableFlowRing
                        score={vm.flow.score}
                        stateTitle={vm.flow.stateTitle}
                        levelLabel={vm.flow.levelLabel}
                        onNext={() => setPage(6)}
                    />
                );
            case 6:
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

