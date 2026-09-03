'use client';

import React, { useState } from 'react';
import { useDashboardViewModel } from '@/hooks/useDashboardViewModel';
import { SimpleHeader } from './SimpleHeader';
import { SimpleFlowCard } from './SimpleFlowCard';
import { SimpleInsightCard } from './SimpleInsightCard';
import { SimpleCoachingCard } from './SimpleCoachingCard';
import { SimpleFeatureGrid } from './SimpleFeatureGrid';
import { SimpleAllFeaturesDrawer } from './SimpleAllFeaturesDrawer';
import { SimpleReportSummary } from '../report/SimpleReportSummary';
import { SimpleBottomNav } from './SimpleBottomNav';
import { useRouter } from 'next/navigation';

interface SimpleDashboardProps {
    onSwitchToClassicReport: () => void;
}

export function SimpleDashboard({ onSwitchToClassicReport }: SimpleDashboardProps) {
    const router = useRouter();
    const vm = useDashboardViewModel();
    const [isAllFeaturesOpen, setIsAllFeaturesOpen] = useState(false);
    const [activeNavTab, setActiveNavTab] = useState<'home' | 'coaching' | 'report' | 'all'>('home');

    const handleNavChange = (tab: 'home' | 'coaching' | 'report' | 'all') => {
        if (tab === 'all') {
            setIsAllFeaturesOpen(true);
            return;
        }
        if (tab === 'coaching') {
            router.push('/myeongsim-chat');
            return;
        }
        setActiveNavTab(tab);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#182333] text-[#F4F6F8] font-sans pb-28 px-4 pt-3 max-w-md mx-auto text-left space-y-4 select-none">
            
            {/* 1. HEADER */}
            <SimpleHeader userName={vm.user.name} />

            {activeNavTab === 'home' && (
                <div className="space-y-3.5 animate-fade-in">
                    {/* 2. 오늘의 FLOW */}
                    <SimpleFlowCard
                        score={vm.flow.score}
                        stateTitle={vm.flow.stateTitle}
                        shortDesc={vm.flow.shortDesc}
                        advice={vm.flow.advice}
                        levelLabel={vm.flow.levelLabel}
                    />

                    {/* 3. 오늘의 핵심 포인트 */}
                    <SimpleInsightCard
                        pointTitle={vm.dailyInsight.pointTitle}
                        pointDesc={vm.dailyInsight.pointDesc}
                        keywords={vm.dailyInsight.keywords}
                        dailyGanji={vm.dailyInsight.dailyGanji}
                    />

                    {/* 4. 오늘의 코칭 */}
                    <SimpleCoachingCard
                        question={vm.coaching.question}
                        actionText={vm.coaching.actionText}
                        prompt={vm.coaching.prompt}
                    />

                    {/* 5. 나의 공간 (4개 핵심 기능) */}
                    <SimpleFeatureGrid
                        onOpenAllFeatures={() => setIsAllFeaturesOpen(true)}
                        onOpenReport={() => setActiveNavTab('report')}
                    />
                </div>
            )}

            {/* 리포트 탭 선택 시 요약 화면 */}
            {activeNavTab === 'report' && (
                <div className="space-y-3.5 animate-fade-in">
                    <SimpleReportSummary
                        userName={vm.user.name}
                        summary={vm.coreTraits.summary}
                        strengths={vm.coreTraits.strengths}
                        cautions={vm.coreTraits.cautions}
                        recommendation={vm.coreTraits.recommendation}
                        onViewFullReport={onSwitchToClassicReport}
                    />
                </div>
            )}

            {/* 전체 기능 Drawer */}
            <SimpleAllFeaturesDrawer
                isOpen={isAllFeaturesOpen}
                onClose={() => setIsAllFeaturesOpen(false)}
                onSelectReport={onSwitchToClassicReport}
            />

            {/* 4개 탭 Simple Bottom Nav */}
            <SimpleBottomNav
                activeTab={activeNavTab}
                onTabChange={handleNavChange}
            />
        </div>
    );
}
