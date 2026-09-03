'use client';

import React from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { RefinedHeader } from './RefinedHeader';
import { RefinedFlowSection } from './RefinedFlowSection';
import { RefinedInsightSection } from './RefinedInsightSection';
import { RefinedActionSection } from './RefinedActionSection';
import { RefinedFeatureGrid } from './RefinedFeatureGrid';
import { RefinedSecondarySections } from './RefinedSecondarySections';

interface RefinedDashboardProps {
    onOpenReport: () => void;
}

export function RefinedDashboard({ onOpenReport }: RefinedDashboardProps) {
    const vm = useDashboardViewModel();

    return (
        /* pb-32 및 safe-area 적용으로 하단 네비/스티키 바와 겹침 0% 완벽 차단 */
        <div className="relative min-h-screen w-full bg-[#182333] text-[#F4F6F8] font-sans pb-36 px-4 pt-3 max-w-xl mx-auto space-y-4 select-none animate-fade-in">
            {/* 0. HEADER */}
            <RefinedHeader userName={vm.user.name} isVip={vm.vip.isVip} />

            {/* 1. FLOW & 상태 (1순위) */}
            <RefinedFlowSection
                score={vm.flow.score}
                stateTitle={vm.flow.stateTitle}
                shortDesc={vm.flow.shortDesc}
                levelLabel={vm.flow.levelLabel}
            />

            {/* 2. 오늘의 핵심 인사이트 (2순위) */}
            <RefinedInsightSection
                pointTitle={vm.dailyInsight.pointTitle}
                pointDesc={vm.dailyInsight.pointDesc}
                keywords={vm.dailyInsight.keywords}
                dailyGanji={vm.dailyInsight.dailyGanji}
            />

            {/* 3. 오늘 추천 행동 & 코칭 (3순위) */}
            <RefinedActionSection
                actionTitle={vm.action.title}
                actionDesc={vm.action.description}
                coachingQuestion={vm.coaching.question}
            />

            {/* 4. 주요 솔루션 바로가기 (4순위) */}
            <RefinedFeatureGrid onOpenReport={onOpenReport} />

            {/* 5. 부가 기능 & VIP 정보 (5 & 6순위) */}
            <RefinedSecondarySections />
        </div>
    );
}
