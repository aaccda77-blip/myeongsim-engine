/**
 * 바이오-케어 데이터베이스
 * 약물 정보, 영양소 상호작용, 이상 반응 체크리스트
 */

export interface MedicationInfo {
    id: string;
    name: string;
    genericName: string;
    category: '당뇨' | '고혈압' | '고지혈증' | '비만';
    mechanism: string; // 작용 기전 (쉬운 설명)
    commonSideEffects: string[];
    warningSignals: string[]; // 즉시 병원 방문 필요
    nutritionTips: string[];
    icon: string;
}

export interface NutrientSynergy {
    id: string;
    combination: string;
    components: string[];
    effect: 'positive' | 'negative' | 'neutral';
    description: string;
    recommendation: string;
}

export interface DrugNutrientDepletion {
    drugName: string;
    depletedNutrient: string;
    reason: string;
    supplementAdvice: string;
}

// 약물 정보 DB
export const MEDICATIONS: MedicationInfo[] = [
    {
        id: 'saxenda',
        name: '삭센다',
        genericName: '리라글루타이드',
        category: '비만',
        mechanism: 'GLP-1 수용체를 활성화하여 포만감을 높이고 식욕을 조절합니다. 마치 "배부르다"는 신호를 뇌에 더 강하게 보내는 것과 같아요.',
        commonSideEffects: ['구토', '메스꺼움', '설사', '변비'],
        warningSignals: [
            '심한 복통 (담석 가능성)',
            '지속적인 구토',
            '빠른 심박수',
            '호흡곤란'
        ],
        nutritionTips: [
            '지방 섭취를 줄여 담낭 부담 감소',
            '소량씩 자주 먹기',
            '수분 충분히 섭취'
        ],
        icon: 'medication'
    },
    {
        id: 'jardiance',
        name: '자디앙',
        genericName: '엠파글리플로진',
        category: '당뇨',
        mechanism: 'SGLT-2 억제제로, 신장에서 당을 소변으로 배출하는 통로를 엽니다. 혈당을 "버리는" 방식이에요.',
        commonSideEffects: ['소변 증가', '탈수', '요로감염'],
        warningSignals: [
            '심한 갈증',
            '어지러움 (탈수)',
            '배뇨 시 통증 (요로감염)',
            '케톤산증 증상 (구토, 복통, 빠른 호흡)'
        ],
        nutritionTips: [
            '하루 2L 이상 수분 섭취',
            '전해질 보충 (나트륨, 칼륨)',
            '저탄수화물 식단과 병행 시 케톤 모니터링'
        ],
        icon: 'water_drop'
    },
    {
        id: 'metformin',
        name: '메트포르민',
        genericName: '메트포르민',
        category: '당뇨',
        mechanism: '간에서 당 생성을 줄이고, 근육이 당을 더 잘 사용하도록 돕습니다. 몸의 "당 관리 시스템"을 개선하는 거예요.',
        commonSideEffects: ['설사', '복부 불편감', '메스꺼움'],
        warningSignals: [
            '젖산산증 (근육통, 호흡곤란, 심한 피로)',
            '지속적인 복통',
            '비정상적인 피로감'
        ],
        nutritionTips: [
            '비타민 B12 보충 (장기 복용 시)',
            '식사와 함께 복용하여 위장 부담 감소',
            '알코올 섭취 제한'
        ],
        icon: 'glucose'
    }
];

// 영양소 시너지 DB
export const NUTRIENT_SYNERGIES: NutrientSynergy[] = [
    {
        id: 'theanine-coffee',
        combination: '테아닌 + 커피',
        components: ['L-테아닌', '카페인'],
        effect: 'positive',
        description: '테아닌이 카페인의 각성 효과는 유지하면서 불안감과 떨림을 완화합니다.',
        recommendation: '커피 1잔당 테아닌 100-200mg 함께 섭취'
    },
    {
        id: 'magnesium-ursa',
        combination: '마그네슘 + 우루사',
        components: ['마그네슘', 'UDCA'],
        effect: 'positive',
        description: '마그네슘이 담즙 흐름을 개선하여 우루사(UDCA)의 간 보호 효과를 높입니다.',
        recommendation: '저녁 식후 함께 복용'
    },
    {
        id: 'calcium-iron',
        combination: '칼슘 + 철분',
        components: ['칼슘', '철분'],
        effect: 'negative',
        description: '칼슘이 철분 흡수를 방해합니다.',
        recommendation: '최소 2시간 간격으로 복용'
    }
];

// 약물-영양소 고갈 정보
export const DRUG_NUTRIENT_DEPLETIONS: DrugNutrientDepletion[] = [
    {
        drugName: '메트포르민',
        depletedNutrient: '비타민 B12',
        reason: '장에서 B12 흡수를 방해하는 메커니즘',
        supplementAdvice: '1년 이상 복용 시 연 1회 B12 수치 검사 권장. 필요 시 1000mcg 보충'
    },
    {
        drugName: '자디앙 (SGLT-2 억제제)',
        depletedNutrient: '전해질 (나트륨, 칼륨)',
        reason: '소변으로 당과 함께 전해질 배출 증가',
        supplementAdvice: '수분과 함께 전해질 음료 섭취. 어지러움 시 의사 상담'
    }
];

// 이상 반응 체크리스트
export const SYMPTOM_CHECKLIST = [
    { id: 'nausea', label: '메스꺼움', severity: ['없음', '약함', '중간', '심함'] },
    { id: 'vomit', label: '구토', severity: ['없음', '1-2회', '3-5회', '6회 이상'] },
    { id: 'dizziness', label: '어지러움', severity: ['없음', '약함', '중간', '심함'] },
    { id: 'fatigue', label: '피로감', severity: ['없음', '약함', '중간', '심함'] },
    { id: 'irritability', label: '짜증/불안', severity: ['없음', '약함', '중간', '심함'] },
    { id: 'abdominal_pain', label: '복통', severity: ['없음', '약함', '중간', '심함'] }
];

// 약물 검색 함수
export function getMedicationById(id: string): MedicationInfo | undefined {
    return MEDICATIONS.find(med => med.id === id);
}

export function getMedicationsByCategory(category: MedicationInfo['category']): MedicationInfo[] {
    return MEDICATIONS.filter(med => med.category === category);
}
