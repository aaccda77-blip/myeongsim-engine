/**
 * useHealthLevel.ts
 * 사용자의 건강 지식 레벨을 관리하는 커스텀 훅
 */

'use client';

import { useState, useEffect } from 'react';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

const STORAGE_KEY = 'myeongsim_health_level';
const ASSESSMENT_COMPLETED_KEY = 'myeongsim_assessment_completed';

export function useHealthLevel() {
    const [level, setLevelState] = useState<DifficultyLevel>('beginner');
    const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 초기 로드
    useEffect(() => {
        const savedLevel = localStorage.getItem(STORAGE_KEY) as DifficultyLevel | null;
        const assessmentCompleted = localStorage.getItem(ASSESSMENT_COMPLETED_KEY) === 'true';

        if (savedLevel) {
            setLevelState(savedLevel);
        }
        setHasCompletedAssessment(assessmentCompleted);
        setIsLoading(false);
    }, []);

    // 레벨 설정
    const setLevel = (newLevel: DifficultyLevel) => {
        setLevelState(newLevel);
        localStorage.setItem(STORAGE_KEY, newLevel);
    };

    // 분석 완료 표시
    const markAssessmentCompleted = () => {
        setHasCompletedAssessment(true);
        localStorage.setItem(ASSESSMENT_COMPLETED_KEY, 'true');
    };

    // 분석 초기화 (다시하기)
    const resetAssessment = () => {
        setHasCompletedAssessment(false);
        localStorage.removeItem(ASSESSMENT_COMPLETED_KEY);
    };

    return {
        level,
        setLevel,
        hasCompletedAssessment,
        markAssessmentCompleted,
        resetAssessment,
        isLoading
    };
}
