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
        if (!isLoading) {
            // 레벨 진단 완료 여부와 관계없이 Q&A 표시
            const allQA = getRandomHealthQA();
            setQaData(allQA);
        }
    }, [level, isLoading]);

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
        // 레벨 변경 후 새로운 Q&A 로드
        const newQA = getRandomHealthQA();
        setQaData(newQA);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1f2937]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#658c42] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-medium">오늘의 건강상식을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!qaData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1f2937]">
                <div className="text-center">
                    <p className="text-white font-medium mb-4">Q&A를 불러올 수 없습니다.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-[#658c42] text-white rounded-full font-bold hover:bg-[#547a35] transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <HealthQAView
                qaData={qaData}
                onClose={() => router.back()}
            />

            {showAssessment && (
                <LevelAssessmentModal
                    onComplete={handleAssessmentComplete}
                    onClose={() => setShowAssessment(false)}
                />
            )}
        </>
    );
}
