/**
 * useMyeongsimProfile.ts - 듀얼 엔진 통합 훅
 * 
 * 목적: Saju Engine + Astro Engine 두 엔진을 동시 호출하고 결과를 융합
 * 특징:
 *  - 사용자 생년월일 한 번 입력으로 두 엔진 동시 계산
 *  - 통합된 MyeongsimProfile 객체 반환
 *  - 주파수 감지 결과도 포함
 */

'use client';

import { useState, useCallback } from 'react';
import { calculateSaju, SajuResult } from '@/lib/saju/SajuEngine';
import {
    calculateMyeongsimProfile,
    parseBirthDate,
    MyeongsimProfile,
    formatGatePosition
} from '@/utils/GeneKeyCalculator';
import {
    analyzeFrequency,
    FrequencyAnalysis
} from '@/modules/FrequencyDetector';

// ============== 타입 정의 ==============
export interface DualEngineProfile {
    // 엔진 A: 사주 (만세력)
    saju: SajuResult | null;

    // 엔진 B: 천문 (진키/명심코칭)
    astro: MyeongsimProfile | null;

    // 융합 데이터
    fusion: {
        dayMaster: string;              // 일간 (갑, 을, 병...)
        dayMasterElement: string;       // 일간 오행 (목, 화, 토...)
        lifeOSGate: string;             // Life OS Gate.Line
        growthTriggerGate: string;      // Growth Trigger Gate.Line
        bioEngineGate: string;          // Bio Engine Gate.Line
        rootPurposeGate: string;        // Root Purpose Gate.Line
        summary: string;                // 통합 요약 문장
    } | null;

    // 현재 주파수 상태 (선택적)
    frequency: FrequencyAnalysis | null;

    // 메타 정보
    isCalculated: boolean;
    error: string | null;
}

// ============== 오행 매핑 ==============
const ELEMENT_MAP: Record<string, string> = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수',
    // 한자도 지원
    '甲': '목', '乙': '목',
    '丙': '화', '丁': '화',
    '戊': '토', '己': '토',
    '庚': '금', '辛': '금',
    '壬': '수', '癸': '수'
};

// ============== 통합 요약 생성 ==============
function generateFusionSummary(
    dayMaster: string,
    dayMasterElement: string,
    lifeOSGate: string
): string {
    const elementDescriptions: Record<string, string> = {
        '목': '성장과 확장의 에너지를 가진',
        '화': '열정과 표현의 에너지를 가진',
        '토': '안정과 포용의 에너지를 가진',
        '금': '결단과 정제의 에너지를 가진',
        '수': '지혜와 흐름의 에너지를 가진'
    };

    const gateNumber = lifeOSGate.split('.')[0];

    return `${elementDescriptions[dayMasterElement] || ''} ${dayMaster}일간으로, Gate ${gateNumber}의 Life OS를 탑재한 프로필입니다.`;
}

// ============== 메인 훅 ==============
export function useMyeongsimProfile() {
    const [profile, setProfile] = useState<DualEngineProfile>({
        saju: null,
        astro: null,
        fusion: null,
        frequency: null,
        isCalculated: false,
        error: null
    });

    const [isLoading, setIsLoading] = useState(false);

    /**
     * 듀얼 엔진 계산 실행
     */
    const calculate = useCallback(async (
        birthDate: string,           // YYYY-MM-DD
        birthTime: string = '12:00', // HH:MM
        calendarType: 'solar' | 'lunar' = 'solar',
        gender: 'male' | 'female' = 'male',
        timezoneOffset: number = 9   // KST = UTC+9
    ) => {
        setIsLoading(true);
        setProfile(prev => ({ ...prev, error: null }));

        try {
            // ===== 엔진 A: 사주 계산 =====
            const sajuResult = calculateSaju(birthDate, birthTime, calendarType, gender);

            // ===== 엔진 B: 천문 계산 =====
            const birthDateObj = parseBirthDate(birthDate, birthTime, timezoneOffset);
            const astroResult = calculateMyeongsimProfile(birthDateObj);

            // ===== 융합 데이터 생성 =====
            let fusionData = null;

            if (sajuResult.success && astroResult) {
                const dayMaster = sajuResult.dayMaster || '?';
                const dayMasterElement = ELEMENT_MAP[dayMaster] || '?';
                const lifeOSGate = formatGatePosition(astroResult.activation.lifeOS);

                fusionData = {
                    dayMaster,
                    dayMasterElement,
                    lifeOSGate,
                    growthTriggerGate: formatGatePosition(astroResult.activation.growthTrigger),
                    bioEngineGate: formatGatePosition(astroResult.activation.bioEngine),
                    rootPurposeGate: formatGatePosition(astroResult.activation.rootPurpose),
                    summary: generateFusionSummary(dayMaster, dayMasterElement, lifeOSGate)
                };
            }

            setProfile({
                saju: sajuResult,
                astro: astroResult,
                fusion: fusionData,
                frequency: null, // 주파수는 별도로 분석
                isCalculated: true,
                error: sajuResult.success ? null : (sajuResult.error || 'Saju calculation failed')
            });

        } catch (error) {
            setProfile(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Unknown error',
                isCalculated: false
            }));
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * 주파수 분석 (사용자 메시지 기반)
     */
    const analyzeUserFrequency = useCallback((
        userMessage: string,
        conversationHistory?: string[]
    ) => {
        const dayMaster = profile.fusion?.dayMaster;
        const frequencyResult = analyzeFrequency(userMessage, conversationHistory, dayMaster);

        setProfile(prev => ({
            ...prev,
            frequency: frequencyResult
        }));

        return frequencyResult;
    }, [profile.fusion?.dayMaster]);

    /**
     * 프로필 초기화
     */
    const reset = useCallback(() => {
        setProfile({
            saju: null,
            astro: null,
            fusion: null,
            frequency: null,
            isCalculated: false,
            error: null
        });
    }, []);

    return {
        profile,
        isLoading,
        calculate,
        analyzeUserFrequency,
        reset
    };
}

// ============== 서버 사이드용 함수 ==============
/**
 * 서버에서 듀얼 엔진 계산 (API route용)
 */
export function calculateDualEngineProfile(
    birthDate: string,
    birthTime: string = '12:00',
    calendarType: 'solar' | 'lunar' = 'solar',
    gender: 'male' | 'female' = 'male',
    timezoneOffset: number = 9
): DualEngineProfile {
    try {
        // 엔진 A: 사주
        const sajuResult = calculateSaju(birthDate, birthTime, calendarType, gender);

        // 엔진 B: 천문
        const birthDateObj = parseBirthDate(birthDate, birthTime, timezoneOffset);
        const astroResult = calculateMyeongsimProfile(birthDateObj);

        // 융합
        let fusionData = null;

        if (sajuResult.success && astroResult) {
            const dayMaster = sajuResult.dayMaster || '?';
            const dayMasterElement = ELEMENT_MAP[dayMaster] || '?';
            const lifeOSGate = formatGatePosition(astroResult.activation.lifeOS);

            fusionData = {
                dayMaster,
                dayMasterElement,
                lifeOSGate,
                growthTriggerGate: formatGatePosition(astroResult.activation.growthTrigger),
                bioEngineGate: formatGatePosition(astroResult.activation.bioEngine),
                rootPurposeGate: formatGatePosition(astroResult.activation.rootPurpose),
                summary: generateFusionSummary(dayMaster, dayMasterElement, lifeOSGate)
            };
        }

        return {
            saju: sajuResult,
            astro: astroResult,
            fusion: fusionData,
            frequency: null,
            isCalculated: true,
            error: sajuResult.success ? null : (sajuResult.error || 'Calculation failed')
        };

    } catch (error) {
        return {
            saju: null,
            astro: null,
            fusion: null,
            frequency: null,
            isCalculated: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
