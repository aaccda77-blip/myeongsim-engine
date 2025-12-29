export interface ReportData {
    userName: string;
    birthDate: string;
    birthTime?: string; // [Fix] Server-side Saju Calculation requires time
    gender?: 'male' | 'female'; // [Fix] Add gender field for correct Daewoon calc
    meta?: {
        calendarType: 'solar' | 'lunar';
        isLeapMonth: boolean;
        gender: 'male' | 'female';
        isTimeUnknown: boolean;
    };
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
        fourPillars: {
            year: { gan: string; ji: string; ganColor: string; jiColor: string };
            month: { gan: string; ji: string; ganColor: string; jiColor: string };
            day: { gan: string; ji: string; ganColor: string; jiColor: string };
            time: { gan: string; ji: string; ganColor: string; jiColor: string };
        };
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
        year: number;
        weather: 'sun' | 'cloud' | 'rain' | 'wind';
        description: string;
    }[];
    actionPlan: {
        luckyItems: string[];
        colors: string[];
        affirmation: string;
        todos: string[];
    };
}
