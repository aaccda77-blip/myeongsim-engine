'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // [Deep Tech] Lazy Loading의 핵심
import { useReportStore } from '@/store/useReportStore';
import BookLayout from '@/components/layout/BookLayout';
import { useRouter } from 'next/navigation';

// [Optimization] 무거운 컴포넌트는 필요할 때만 로드합니다 (Code Splitting)
// ssr: false로 설정하여 클라이언트 전용 라이브러리(Recharts, Framer Motion) 충돌 방지
const loadingView = () => (
    <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary-olive border-t-transparent rounded-full animate-spin" />
    </div>
);

const CoverView = dynamic(() => import('@/components/pages/CoverView'), { loading: loadingView });
const ScienceIntroView = dynamic(() => import('@/components/pages/ScienceIntroView'), { loading: loadingView });
const IdentityView = dynamic(() => import('@/components/pages/IdentityView'), { loading: loadingView });
const SajuPaljaView = dynamic(() => import('@/components/pages/SajuPaljaView'), { loading: loadingView });
const RadarChartView = dynamic(() => import('@/components/pages/RadarChartView'), { loading: loadingView });
const TalentStatsView = dynamic(() => import('@/components/pages/TalentStatsView'), { loading: loadingView });
const FlipCardView = dynamic(() => import('@/components/pages/FlipCardView'), { loading: loadingView });
const RelationBubbleView = dynamic(() => import('@/components/pages/RelationBubbleView'), { loading: loadingView });
const WealthGaugeView = dynamic(() => import('@/components/pages/WealthGaugeView'), { loading: loadingView });
const LifeWaveView = dynamic(() => import('@/components/pages/LifeWaveView'), { loading: loadingView });
const TimelineView = dynamic(() => import('@/components/pages/TimelineView'), { loading: loadingView });
const ActionItemsView = dynamic(() => import('@/components/pages/ActionItemsView'), { loading: loadingView });
const EpilogueView = dynamic(() => import('@/components/pages/EpilogueView'), { loading: loadingView });
const NewPageView = dynamic(() => import('@/components/pages/NewPageView'), { loading: loadingView });

// Fallback
const PlaceholderView = ({ step }: { step: number }) => (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
        <h2 className="text-4xl font-bold text-gray-600 mb-4">{step}</h2>
        <p className="font-serif">페이지 준비 중입니다...</p>
    </div>
);

function ReportContent() {
    const { currentStep, reportData } = useReportStore();
    const router = useRouter();

    // [Guard Logic] 데이터가 없는데 중간 페이지로 진입하면 커버로 보냄
    useEffect(() => {
        // 1페이지(커버)와 2페이지(인트로)는 데이터 없이도 볼 수 있다고 가정
        // 3페이지(Identity)부터는 데이터 필수
        if (currentStep >= 3 && !reportData) {
            // 알림 없이 조용히 보내거나, 토스트 메시지 띄우기
            useReportStore.getState().setStep(1);
        }
    }, [currentStep, reportData]);

    switch (currentStep) {
        case 1: return <CoverView />;
        case 2: return <ScienceIntroView />;
        case 3: return <SajuPaljaView />;
        case 4: return <IdentityView />;
        case 5: return <RadarChartView />;
        case 6: return <TalentStatsView />;
        case 7: return <FlipCardView />;
        case 8: return <RelationBubbleView />;
        case 9: return <WealthGaugeView />;
        case 10: return <LifeWaveView />;
        case 11: return <TimelineView />;
        case 12: return <ActionItemsView />;
        case 13: return <EpilogueView />;
        case 14: return <NewPageView />;
        default: return <PlaceholderView step={currentStep} />;
    }
}

export default function ReportPage() {
    // [Fix Hydration] 클라이언트 마운트 여부 체크
    // Next.js에서 Persist Store를 쓸 때 필수적인 패턴입니다.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 서버 사이드 렌더링 중이거나 아직 마운트 안 됐으면 껍데기만 보여줌 (에러 방지)
    if (!isMounted) {
        return (
            <div className="min-h-[100dvh] w-full bg-[#050505] flex justify-center items-center">
                <div className="w-full max-w-md h-[100dvh] bg-deep-slate animate-pulse" />
            </div>
        );
    }

    return (
        <BookLayout>
            <ReportContent />
        </BookLayout>
    );
}
