export interface ReportData {
    userName: string;
    birthDate: string;
    saju: {
        elements: {
            wood: number;
            fire: number;
            earth: number;
            metal: number;
            water: number;
        };
        dayMaster: string;
        dayMasterTrait: string;
        keywords: string[];
    };
    stats: {
        creativity: number;
        leadership: number;
        empathy: number;
        wealth: number;
        execution: number;
    };
    relations: {
        helpful: string[];
        harmful: string[];
    };
    wealth: {
        score: number;
        description: string;
    };
    lifeWave: { age: number; score: number }[];
    psychology: {
        shadowTitle: string;
        shadowDescription: string;
        cognitiveDistortions: string[];
    };
    timeline: {
        month: number;
        weather: 'sun' | 'cloud' | 'rain';
        description: string;
    }[];
    actionPlan: {
        luckyItems: string[];
        colors: string[];
        affirmation: string;
        todos: string[];
    };
}
