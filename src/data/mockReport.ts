import { ReportData } from '@/types/report';

export const mockReport: ReportData = {
    userName: "이름을 입력하세요",
    birthDate: "", // Empty to prevent hardcoding
    saju: {
        elements: {
            wood: 20,
            fire: 20,
            earth: 20,
            metal: 20,
            water: 20,
        },
        dayMaster: "본원(태어난 날)", // Generic
        dayMasterTrait: "성향 키워드",
        fourPillars: {
            year: { gan: '?', ji: '?', ganColor: '#555', jiColor: '#555' },
            month: { gan: '?', ji: '?', ganColor: '#555', jiColor: '#555' },
            day: { gan: '?', ji: '?', ganColor: '#555', jiColor: '#555' },
            time: { gan: '?', ji: '?', ganColor: '#555', jiColor: '#555' },
        },
        keywords: ["키워드1", "키워드2"],
    },
    stats: {
        creativity: 50,
        leadership: 50,
        empathy: 50,
        wealth: 50,
        execution: 50,
    },
    relations: {
        helpful: ["긍정 오행"],
        harmful: ["부정 오행"],
    },
    wealth: {
        score: 50,
        description: "사주 정보를 입력하면 재물운이 분석됩니다.",
    },
    lifeWave: [
        { age: 10, score: 50 },
        { age: 20, score: 50 },
        { age: 30, score: 50 },
        { age: 40, score: 50 },
        { age: 50, score: 50 },
        { age: 60, score: 50 },
    ],
    psychology: {
        shadowTitle: "그림자 분석",
        shadowDescription: "사주 분석 후 그림자 데이터가 생성됩니다.",
        cognitiveDistortions: [
            "분석 대기 중"
        ]
    },
    timeline: [
        { year: 2024, weather: 'sun', description: "분석 대기 중" },
    ],
    actionPlan: {
        luckyItems: ["분석 대기"],
        colors: ["Gray"],
        affirmation: "운명을 스스로 개척하는 힘을 믿습니다.",
        todos: [
            "생년월일 입력하기"
        ]
    }
};
