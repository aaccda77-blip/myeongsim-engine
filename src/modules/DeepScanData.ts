export interface DeepScanQuestion {
    id: string;
    category: 'BigFive' | 'MBTI' | 'Myeongsim';
    text: string;
    options: {
        label: string;
        value: number[]; // Vector impact (optional)
        gap: number;     // 0.1 (Neural/Healthy) ~ 0.9 (Dark/Unhealthy)
        type: 'NEURAL' | 'DARK' | 'GAP' | 'ACTIVE';
    }[];
}

export const DeepScanQuestions: DeepScanQuestion[] = [
    // [Phase 1: Instinct & Energy - 3 Questions]
    {
        id: 'scan_1', category: 'BigFive',
        text: '새로운 기회나 낯선 환경... 당신의 첫 본능은?',
        options: [
            { label: '가슴이 뛰고 호기심이 생긴다 (Openness)', value: [1, 0, 0, 0, 0], gap: 0.1, type: 'NEURAL' },
            { label: '불안해서 익숙한 곳에 머물고 싶다', value: [0, 0, 0, 0, 0], gap: 0.7, type: 'DARK' }
        ]
    },
    {
        id: 'scan_2', category: 'BigFive',
        text: '예상치 못한 스트레스가 덮쳐올 때, 당신은?',
        options: [
            { label: '잠시 멈추고 냉정하게 해결책을 찾는다', value: [0, 0, 0, 1, 0], gap: 0.1, type: 'NEURAL' },
            { label: '감정이 폭발하거나 회피해버린다', value: [0, 0, 0, 0, 0], gap: 0.8, type: 'DARK' }
        ]
    },
    {
        id: 'scan_3', category: 'MBTI',
        text: '에너지가 방전되었을 때, 충전하는 방식은?',
        options: [
            { label: '사람들과 만나 웃고 떠들며 푼다 (E)', value: [0, 0, 1, 0, 0], gap: 0.2, type: 'ACTIVE' },
            { label: '혼자만의 동굴에서 조용히 쉰다 (I)', value: [0, 0, 0, 0, 1], gap: 0.2, type: 'NEURAL' }
        ]
    },

    // [Phase 2: Judgment & Perception - 4 Questions]
    {
        id: 'scan_4', category: 'MBTI',
        text: '중요한 결정을 내려야 할 때, 무엇이 더 중요한가요?',
        options: [
            { label: '객관적인 사실과 논리적 원칙 (T)', value: [0, 1, 0, 0, 0], gap: 0.3, type: 'NEURAL' },
            { label: '나와 타인의 감정, 그리고 관계 (F)', value: [0, 0, 1, 0, 0], gap: 0.3, type: 'ACTIVE' }
        ]
    },
    {
        id: 'scan_5', category: 'MBTI',
        text: '여행이나 프로젝트를 시작할 때?',
        options: [
            { label: '철저하게 계획을 세워야 마음이 편하다 (J)', value: [0, 1, 0, 0, 0], gap: 0.2, type: 'NEURAL' },
            { label: '상황에 맞춰 유연하게 즐긴다 (P)', value: [1, 0, 0, 0, 0], gap: 0.2, type: 'ACTIVE' }
        ]
    },
    {
        id: 'scan_6', category: 'BigFive',
        text: '타인의 비판을 들었을 때 솔직한 마음은?',
        options: [
            { label: '성장할 기회라 생각하고 수용한다', value: [0, 0, 0, 1, 0], gap: 0.1, type: 'NEURAL' },
            { label: '나를 공격한다고 느껴져 화가 난다', value: [0, 0, 0, 0, 0], gap: 0.9, type: 'DARK' }
        ]
    },
    {
        id: 'scan_7', category: 'Myeongsim',
        text: '당신에게 `일(Work)`이란 무엇인가요?',
        options: [
            { label: '경제적 생존을 위한 어쩔 수 없는 수단', value: [0, 0, 0, 0, 0], gap: 0.6, type: 'GAP' },
            { label: '자아 실현과 성장의 도구', value: [0, 1, 0, 0, 0], gap: 0.1, type: 'ACTIVE' }
        ]
    },

    // [Phase 3: Soul & Destiny - 3 Questions]
    {
        id: 'scan_8', category: 'Myeongsim',
        text: '지금 당신의 삶에서 가장 부족하다고 느끼는 것은?',
        options: [
            { label: '진정한 마음의 평화와 안식', value: [0, 0, 0, 0, 1], gap: 0.5, type: 'GAP' },
            { label: '눈에 보이는 성취와 인정', value: [1, 0, 0, 0, 0], gap: 0.3, type: 'ACTIVE' }
        ]
    },
    {
        id: 'scan_9', category: 'Myeongsim',
        text: '운명(Destiny)에 대해 어떻게 생각하시나요?',
        options: [
            { label: '이미 정해져 있어 바꿀 수 없다', value: [0, 0, 0, 0, 0], gap: 0.8, type: 'DARK' },
            { label: '내가 주체적으로 만들어가는 것이다', value: [0, 0, 0, 1, 1], gap: 0.1, type: 'NEURAL' }
        ]
    },
    {
        id: 'scan_10', category: 'Myeongsim',
        text: '지금 이 순간, 당신은 행복하신가요?',
        options: [
            { label: '무엇인가 계속 채워져야 할 것 같다 (결핍)', value: [0, 0, 0, 0, 0], gap: 0.7, type: 'GAP' },
            { label: '살아있음 그 자체로 충만하다 (감사)', value: [1, 1, 1, 1, 1], gap: 0.0, type: 'NEURAL' }
        ]
    }
];
