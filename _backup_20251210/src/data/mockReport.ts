import { ReportData } from '@/types/report';

export const mockReport: ReportData = {
    userName: "사용자",
    birthDate: "1980-07-07",
    saju: {
        elements: {
            wood: 15,
            fire: 15,
            earth: 30, // Mi, Mi
            metal: 30, // Gyeong, Shin, Sin
            water: 10, // Gye
        },
        dayMaster: "신 (Metal)",
        dayMasterTrait: "예리한 보석",
        keywords: ["섬세함", "정확성", "완벽주의"],
    },
    stats: {
        creativity: 70,
        leadership: 60,
        empathy: 50,
        wealth: 90,
        execution: 85,
    },
    relations: {
        helpful: ["따뜻한 흙 (Earth)", "맑은 물 (Water)"],
        harmful: ["지나친 불 (Fire)", "과도한 나무 (Wood)"],
    },
    wealth: {
        score: 90,
        description: "보석이 흙 속에 묻히지 않도록 물(식상)로 씻어내어 가치를 드러내야 재물이 따릅니다.",
    },
    lifeWave: [
        { age: 10, score: 30 },
        { age: 20, score: 50 },
        { age: 30, score: 85 },
        { age: 40, score: 70 },
        { age: 50, score: 90 },
        { age: 60, score: 60 },
    ],
    psychology: {
        shadowTitle: "완벽주의의 그림자",
        shadowDescription: "당신은 항상 더 나은 자신을 보여줘야 한다는 압박감을 느끼고 있습니다. 이 그림자는 사실 당신의 성장을 돕는 강력한 에너지원이기도 합니다.",
        cognitiveDistortions: [
            "전부 아니면 전무 (All-or-Nothing)",
            "해야만 한다 (Should Statements)",
            "부정적 예측 (Fortune Telling)"
        ]
    },
    timeline: [
        { month: 1, weather: 'sun', description: "새로운 시작이 좋은 달" },
        { month: 2, weather: 'sun', description: "귀인을 만나는 시기" },
        { month: 3, weather: 'cloud', description: "잠시 숨을 고르세요" },
        { month: 4, weather: 'rain', description: "무리한 투자는 금물" },
        { month: 5, weather: 'sun', description: "성과가 드러나는 달" },
        { month: 6, weather: 'cloud', description: "내실을 다져야 합니다" },
        { month: 7, weather: 'sun', description: "해외 운이 열립니다" },
        { month: 8, weather: 'sun', description: "가장 빛나는 시기" },
        { month: 9, weather: 'cloud', description: "건강 관리에 유의" },
        { month: 10, weather: 'rain', description: "말조심이 필요합니다" },
        { month: 11, weather: 'sun', description: "뜻밖의 횡재수" },
        { month: 12, weather: 'sun', description: "한 해의 완벽한 마무리" },
    ],
    actionPlan: {
        luckyItems: ["만년필", "새벽 5시", "등산"],
        colors: ["Deep Green", "Gold"],
        affirmation: "나는 불완전함 속에서도 가장 빛나는 별이다.",
        todos: [
            "하루 10분 멍때리기",
            "감정 일기 쓰기",
            "작은 성공 기록하기"
        ]
    }
};
