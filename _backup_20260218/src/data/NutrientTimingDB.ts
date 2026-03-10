/**
 * /data/NutrientTimingDB.ts
 * 영양제 타이밍 데이터베이스
 */

export type TimingCategory = 'morning' | 'meal' | 'evening';
export type SupplementCategory = 'vitamin' | 'mineral' | 'amino' | 'herb' | 'probiotic' | 'other';

export interface Supplement {
    id: string;
    name: string;
    category: SupplementCategory;
    optimalTiming: TimingCategory;
    fatSoluble: boolean;
    interactions: {
        synergy: string[];  // 시너지 영양소 ID
        conflict: string[]; // 방해 영양소 ID
    };
    description: string;
    reason: string; // 해당 시간대 권장 이유
}

export const SUPPLEMENT_DATABASE: Supplement[] = [
    // 비타민 B군
    {
        id: 'vitamin_b_complex',
        name: '비타민 B군',
        category: 'vitamin',
        optimalTiming: 'morning',
        fatSoluble: false,
        interactions: {
            synergy: ['vitamin_c'],
            conflict: []
        },
        description: '에너지 대사와 신경 기능에 필수적인 수용성 비타민',
        reason: '활력을 주는 성분이므로 아침 공복에 섭취하면 하루를 시작하는 데 도움이 됩니다'
    },
    // 비타민 D
    {
        id: 'vitamin_d',
        name: '비타민 D',
        category: 'vitamin',
        optimalTiming: 'meal',
        fatSoluble: true,
        interactions: {
            synergy: ['calcium', 'magnesium'],
            conflict: []
        },
        description: '뼈 건강과 면역 기능에 중요한 지용성 비타민',
        reason: '지용성 비타민으로 지방과 함께 섭취 시 흡수율이 높아집니다'
    },
    // 오메가3
    {
        id: 'omega3',
        name: '오메가3',
        category: 'other',
        optimalTiming: 'meal',
        fatSoluble: true,
        interactions: {
            synergy: ['vitamin_e'],
            conflict: []
        },
        description: '심혈관 건강과 뇌 기능에 도움을 주는 필수 지방산',
        reason: '식사와 함께 섭취하면 소화 불편감을 줄이고 흡수율을 높입니다'
    },
    // 마그네슘
    {
        id: 'magnesium',
        name: '마그네슘',
        category: 'mineral',
        optimalTiming: 'evening',
        fatSoluble: false,
        interactions: {
            synergy: ['vitamin_d', 'calcium'],
            conflict: ['calcium', 'iron']
        },
        description: '근육 이완과 신경 안정에 도움을 주는 미네랄',
        reason: '근육 이완 효과가 있어 저녁에 섭취하면 수면의 질을 높일 수 있습니다'
    },
    // 칼슘
    {
        id: 'calcium',
        name: '칼슘',
        category: 'mineral',
        optimalTiming: 'evening',
        fatSoluble: false,
        interactions: {
            synergy: ['vitamin_d', 'magnesium'],
            conflict: ['iron', 'magnesium']
        },
        description: '뼈와 치아 건강에 필수적인 미네랄',
        reason: '저녁에 섭취하면 밤사이 뼈 재생을 돕고 수면 유도에도 도움이 됩니다'
    },
    // 철분
    {
        id: 'iron',
        name: '철분',
        category: 'mineral',
        optimalTiming: 'morning',
        fatSoluble: false,
        interactions: {
            synergy: ['vitamin_c'],
            conflict: ['calcium', 'magnesium']
        },
        description: '적혈구 생성과 산소 운반에 필수적인 미네랄',
        reason: '공복에 섭취하면 흡수율이 높아지며, 비타민C와 함께 먹으면 더욱 좋습니다'
    },
    // 유산균
    {
        id: 'probiotic',
        name: '유산균',
        category: 'probiotic',
        optimalTiming: 'morning',
        fatSoluble: false,
        interactions: {
            synergy: [],
            conflict: []
        },
        description: '장 건강과 면역 기능에 도움을 주는 유익균',
        reason: '아침 공복에 섭취하면 위산의 영향을 덜 받아 장까지 도달할 확률이 높습니다'
    },
    // 비타민 C
    {
        id: 'vitamin_c',
        name: '비타민 C',
        category: 'vitamin',
        optimalTiming: 'morning',
        fatSoluble: false,
        interactions: {
            synergy: ['iron', 'vitamin_b_complex'],
            conflict: []
        },
        description: '항산화 작용과 면역 기능에 도움을 주는 수용성 비타민',
        reason: '수용성 비타민으로 아침에 섭취하면 하루 종일 항산화 효과를 유지할 수 있습니다'
    },
    // 테아닌
    {
        id: 'theanine',
        name: '테아닌',
        category: 'amino',
        optimalTiming: 'evening',
        fatSoluble: false,
        interactions: {
            synergy: ['magnesium'],
            conflict: []
        },
        description: '뇌 이완과 스트레스 완화에 도움을 주는 아미노산',
        reason: '이완 효과가 있어 저녁에 섭취하면 수면의 질을 높이고 스트레스를 완화합니다'
    },
    // 우루사 (UDCA)
    {
        id: 'udca',
        name: '우루사 (UDCA)',
        category: 'other',
        optimalTiming: 'meal',
        fatSoluble: false,
        interactions: {
            synergy: ['omega3'],
            conflict: []
        },
        description: '간 건강과 담즙 분비에 도움을 주는 성분',
        reason: '식후에 섭취하면 담즙 분비가 활발해져 소화를 돕고 간 보호 효과를 높입니다'
    },
    // 루테인
    {
        id: 'lutein',
        name: '루테인',
        category: 'other',
        optimalTiming: 'meal',
        fatSoluble: true,
        interactions: {
            synergy: ['omega3'],
            conflict: []
        },
        description: '눈 건강에 도움을 주는 카로티노이드',
        reason: '지용성 성분으로 지방과 함께 섭취 시 흡수율이 높아집니다'
    },
    // 아르기닌
    {
        id: 'arginine',
        name: '아르기닌',
        category: 'amino',
        optimalTiming: 'morning',
        fatSoluble: false,
        interactions: {
            synergy: ['udca'],
            conflict: []
        },
        description: '혈류 개선과 활력 증진에 도움을 주는 아미노산',
        reason: '활력을 주는 성분이므로 아침에 섭취하면 하루를 활기차게 시작할 수 있습니다'
    }
];

export const TIMING_INFO = {
    morning: {
        icon: 'wb_sunny',
        label: '아침 공복',
        color: 'amber',
        time: '07:00 - 08:00',
        description: '활력을 주는 영양소와 공복 흡수가 좋은 성분'
    },
    meal: {
        icon: 'restaurant',
        label: '식사 직후',
        color: 'green',
        time: '식후 30분 이내',
        description: '지용성 비타민과 소화 관련 성분'
    },
    evening: {
        icon: 'bedtime',
        label: '저녁/취침 전',
        color: 'indigo',
        time: '20:00 - 21:00',
        description: '이완과 수면 유도에 도움을 주는 성분'
    }
};

// 효율 점수 계산
export function calculateEfficiency(userSupplements: { id: string; currentTiming: TimingCategory }[]): number {
    if (userSupplements.length === 0) return 0;

    let correctCount = 0;
    userSupplements.forEach(userSup => {
        const supplement = SUPPLEMENT_DATABASE.find(s => s.id === userSup.id);
        if (supplement && supplement.optimalTiming === userSup.currentTiming) {
            correctCount++;
        }
    });

    return Math.round((correctCount / userSupplements.length) * 100);
}

// 개선 제안 생성
export function generateSuggestions(userSupplements: { id: string; currentTiming: TimingCategory }[]) {
    const suggestions: Array<{
        supplement: Supplement;
        currentTiming: TimingCategory;
        suggestedTiming: TimingCategory;
        reason: string;
    }> = [];

    userSupplements.forEach(userSup => {
        const supplement = SUPPLEMENT_DATABASE.find(s => s.id === userSup.id);
        if (supplement && supplement.optimalTiming !== userSup.currentTiming) {
            suggestions.push({
                supplement,
                currentTiming: userSup.currentTiming,
                suggestedTiming: supplement.optimalTiming,
                reason: supplement.reason
            });
        }
    });

    return suggestions;
}
