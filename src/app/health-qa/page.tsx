/**
 * /health-qa/page.tsx
 * 오늘의 건강상식 메인 페이지 (레벨 시스템 통합)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HealthQAView from '@/components/health-qa/HealthQAView';
import LevelAssessmentModal from '@/components/health-qa/LevelAssessmentModal';
import { getRandomHealthQA, type HealthQATemplate } from '@/data/HealthKnowledgeDB';
import { useHealthLevel } from '@/hooks/useHealthLevel';

export default function HealthQAPage() {
    const router = useRouter();
    const { level, setLevel, hasCompletedAssessment, markAssessmentCompleted, isLoading } = useHealthLevel();
    const [qaData, setQaData] = useState<HealthQATemplate | null>(null);
    const [showAssessment, setShowAssessment] = useState(false);

    // 레벨에 맞는 Q&A 가져오기
    useEffect(() => {
        if (!isLoading && hasCompletedAssessment) {
            // 레벨에 맞는 랜덤 Q&A 선택
            const allQA = getRandomHealthQA();
            // TODO: 실제로는 level에 맞는 것만 필터링해야 하지만, 현재는 일부만 확장했으므로 임시로 랜덤 선택
            setQaData(allQA);
        }
    }, [level, isLoading, hasCompletedAssessment]);

    // 최초 방문 시 레벨 진단 모달 표시
    useEffect(() => {
        if (!isLoading && !hasCompletedAssessment) {
            setShowAssessment(true);
        }
    }, [isLoading, hasCompletedAssessment]);

    const handleAssessmentComplete = (assessedLevel: typeof level) => {
        setLevel(assessedLevel);
        markAssessmentCompleted();
        setShowAssessment(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FDFCF8]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#583101] font-medium">오늘의 건강상식을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!qaData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FDFCF8]">
                <div className="text-center">
                    <p className="text-[#583101] font-medium mb-4">Q&A를 불러올 수 없습니다.</p>
                    <button
                        onClick={loadDailyQA}
                        className="px-6 py-3 bg-[#6B8E23] text-white rounded-full font-bold hover:bg-[#5A7A1E] transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <HealthQAView
            qaData={qaData}
            onClose={() => router.back()}
        />
    );
}
