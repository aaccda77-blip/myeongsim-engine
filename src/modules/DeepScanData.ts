export interface DeepScanQuestion {
    id: string;
    category: 'BigFive' | 'Traits' | 'Myeongsim';
    text: string;
    options: {
        label: string;
        value: number[]; // Vector impact (optional)
        gap: number;     // 0.1 (Neural/Healthy) ~ 0.9 (Dark/Unhealthy)
        type: 'NEURAL' | 'DARK' | 'GAP' | 'ACTIVE';
    }[];
}

// [EMERGENCY] Deep Scan Feature DISABLED by User Request
export const DeepScanQuestions: DeepScanQuestion[] = [];
