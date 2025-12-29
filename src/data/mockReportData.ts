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
    userName: "이름을 입력하세요",
    sajuElements: {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0,
    },
    keywords: ["#...", "#...", "#..."],
    psychology: {
        shadowTitle: "정보 없음",
        shadowDescription: "사주 정보를 입력하시면 자세한 분석을 받아보실 수 있습니다.",
        cognitiveDistortions: []
    },
    timeline: [],
    actionPlan: {
        affirmation: "",
        todos: []
    }
};
