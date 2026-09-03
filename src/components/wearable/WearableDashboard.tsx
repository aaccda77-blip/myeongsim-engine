'use client';

import React, { useState } from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { useViewMode } from '@/hooks/useViewMode';
import { WearableAppShell } from './WearableAppShell';
import { WearableFlowRing } from './WearableFlowRing';
import { WearableInsight } from './WearableInsight';
import { WearableActionCard } from './WearableActionCard';
import { WearableCheckIn } from './WearableCheckIn';
import { WearableStreak } from './WearableStreak';
import { WearableQuickCoach } from './WearableQuickCoach';

export function WearableDashboard() {
    const vm = useDashboardViewModel();
    const { setViewMode } = useViewMode();
    const [page, setPage] = useState(0);

    const totalPages = 6;

    const renderPage = () => {
        switch (page) {
            case 0:
                return (
                    <WearableFlowRing
                        score={vm.flow.score}
                        stateTitle={vm.flow.stateTitle}
                        levelLabel={vm.flow.levelLabel}
                        onNext={() => setPage(1)}
                    />
                );
            case 1:
                return (
                    <WearableInsight
                        pointDesc={vm.dailyInsight.pointDesc}
                        keywords={vm.dailyInsight.keywords}
                        onNext={() => setPage(2)}
                    />
                );
            case 2:
                return (
                    <WearableActionCard
                        title={vm.action.title}
                        description={vm.action.description}
                        onNext={() => setPage(3)}
                    />
                );
            case 3:
                return (
                    <WearableCheckIn
                        onNext={() => setPage(4)}
                    />
                );
            case 4:
                return (
                    <WearableStreak
                        days={vm.streak.days}
                        weekStatus={vm.streak.weekStatus}
                        onNext={() => setPage(5)}
                    />
                );
            case 5:
                return (
                    <WearableQuickCoach
                        question={vm.quickCoach.question}
                        options={vm.quickCoach.options}
                        onSwitchToMobile={() => setViewMode('simple')}
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
        >
            {renderPage()}
        </WearableAppShell>
    );
}
