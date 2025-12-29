export interface ReportData {
    userName: string;
    sajuElements: {
        wood: number;
        fire: number;
        earth: number;
        metal: number;
        water: number;
    };
    keywords: string[];
    psychology: {
        shadowTitle: string;
        shadowDescription: string;
        cognitiveDistortions: string[];
    };
    timeline: {
        year: number;
        weather: 'sun' | 'cloud' | 'rain';
        description: string;
    }[];
    actionPlan: {
        affirmation: string;
        todos: string[];
    };
}

export const mockReportData: ReportData = {
    userName: "김명심", // Changed from placeholder to a realistic name
    sajuElements: {
        wood: 80,
        fire: 45,
        earth: 30,
        metal: 90,
        water: 60,
    },
    keywords: ["#창의적_예술가", "#내면의_불꽃", "#강철같은_의지"],
    psychology: {
        shadowTitle: "완벽주의의 그림자",
        shadowDescription: "당신은 높은 기준을 가지고 자신을 몰아세우는 경향이 있습니다. 때로는 불완전함을 있는 그대로 받아들이는 것이 진정한 성장의 시작입니다.",
        cognitiveDistortions: [
            "모 아니면 도 (All-or-Nothing Thinking)",
            "지나친 일반화 (Overgeneralization)",
            "해야만 한다 (Should Statements)"
        ]
    },
    timeline: [
        { year: 2024, weather: 'rain', description: "성찰과 휴식의 시기" },
        { year: 2025, weather: 'cloud', description: "구름 사이로 햇살이 비치는 준비의 시기" },
        { year: 2026, weather: 'sun', description: "노력이 결실을 맺는 황금기" },
    ],
    actionPlan: {
        affirmation: "나는 불완전함 속에서도 빛나는 존재입니다.",
        todos: [
            "하루 10분, 아무것도 하지 않고 하늘 보기",
            "감정 일기 쓰기 (판단하지 않고 기록하기)",
            "나에게 작은 선물 하기"
        ]
    }
};
