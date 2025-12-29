'use client';

import BookLayout from '@/components/layout/BookLayout';
import ActionItemsView from '@/components/pages/ActionItemsView';
import CoverView from '@/components/pages/CoverView';
import EpilogueView from '@/components/pages/EpilogueView';
import FlipCardView from '@/components/pages/FlipCardView';
import IdentityView from '@/components/pages/IdentityView';
import LifeWaveView from '@/components/pages/LifeWaveView';
import PreviewSummaryView from '@/components/pages/PreviewSummaryView';
import RadarChartView from '@/components/pages/RadarChartView';
import RelationBubbleView from '@/components/pages/RelationBubbleView';
import ScienceIntroView from '@/components/pages/ScienceIntroView';
import TalentStatsView from '@/components/pages/TalentStatsView';
import TimelineView from '@/components/pages/TimelineView';
import WealthGaugeView from '@/components/pages/WealthGaugeView';
import { useReportStore } from '@/store/useReportStore';
import React from 'react';

// Fallback for incomplete pages
const PlaceholderView = ({ step }: { step: number }) => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
        <h2 className="text-4xl font-bold text-gray-600 mb-4">{step}</h2>
        <p>Content coming soon...</p>
    </div>
);

function ReportContent() {
    const { currentStep } = useReportStore();

    switch (currentStep) {
        case 1: return <CoverView />;
        case 2: return <ScienceIntroView />;
        case 3: return <IdentityView />;
        case 4: return <RadarChartView />;
        case 5: return <TalentStatsView />;
        case 6: return <FlipCardView />; // Shadow
        case 7: return <RelationBubbleView />;
        case 8: return <WealthGaugeView />;
        case 9: return <LifeWaveView />;
        case 10: return <TimelineView />; // Yearly Flow
        case 11: return <ActionItemsView />;
        case 12: return <EpilogueView />;

        // Hidden bonus or alternative view from previous step (PreviewSummary) could be 13 or accessible via button
        // For now we follow strict 12 page flow requested by user.

        default: return <PlaceholderView step={currentStep} />;
    }
}

export default function ReportPage() {
    return (
        <BookLayout>
            <ReportContent />
        </BookLayout>
    );
}
