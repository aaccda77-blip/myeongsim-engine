/**
 * /health-qa/page.tsx
 * 오늘의 건강상식 메인 페이지
 */

'use client';

import React, { useState, useEffect } from 'react';
import HealthQAView from '@/components/health-qa/HealthQAView';
import { getRandomHealthQA, type HealthQATemplate } from '@/data/HealthKnowledgeDB';
import { useRouter } from 'next/navigation';

export default function HealthQAPage() {
    const router = useRouter();
    const [qaData, setQaData] = useState<HealthQATemplate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDailyQA();
    }, []);

    const loadDailyQA = async () => {
        try {
            // TODO: API 호출로 오늘의 Q&A 가져오기
            // const response = await fetch('/api/health-qa/daily');
            // const data = await response.json();

            // 임시: 랜덤 Q&A 사용
            const randomQA = getRandomHealthQA();
            setQaData(randomQA);
        } catch (error) {
            console.error('Q&A 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
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
