export interface MyeongshimInput {
    dob: string;
    gender?: 'M' | 'F';
    daily_state: {
        physical_energy: number;
        mental_clarity: number;
        emotional_state: string;
    };
    [key: string]: any;
}

export interface MyeongshimContext {
    saju: {
        energy_level: 'Critical_Heat' | 'Balanced' | 'Cold' | 'Normal';
        is_gongmang: boolean;
        gongmang_type?: 'Resonant_Bell' | 'Standard_Void';
        sip_seong: string;
        unseong_phase: string;
    };
    gene_keys: {
        lifes_work: number;
        evolution: number;
        radiance: number;
        purpose: number;
        pearl?: number;
    };
    integral_synthesis: {
        recommended_mode: 'High_Focus' | 'Reset' | 'Expressive_Action' | 'Deep_Rest';
        reasoning: string;
        alchemical_anchor: string;
    };
}

export class MyeongshimEngine {
    public constructor() {}

    public static getInstance(): MyeongshimEngine {
        return new MyeongshimEngine();
    }

    public async evaluateContext(input: MyeongshimInput): Promise<MyeongshimContext> {
        try {
            const sajuContext = this._calculateSajuContext(input.dob || '1990-01-01');
            const geneKeys = this._calculateGeneKeys(input.dob || '1990-01-01');

            return {
                saju: sajuContext,
                gene_keys: { lifes_work: 53.1, evolution: 54.1, radiance: 51.3, purpose: 57.3, pearl: 40.2 },
                integral_synthesis: this._synthesizeIntegralState(input.daily_state || { physical_energy: 5, mental_clarity: 5, emotional_state: 'peaceful' }, sajuContext)
            };
        } catch (error) {
            console.error('MyeongshimEngine Evaluation Error:', error);
            return this._getFallbackContext();
        }
    }

    public async generateDailyCoaching(input: any): Promise<{ context: MyeongshimContext; advice: string }> {
        const context = await this.evaluateContext(input);
        const advice = `지금 당신의 몸과 마음 상태에 맞추어 [${context.integral_synthesis.alchemical_anchor}]의 기운을 회복할 때입니다. ${context.integral_synthesis.reasoning}`;
        return { context, advice };
    }

    private _calculateSajuContext(dob: string) {
        const isSummer = dob.includes('-06-') || dob.includes('-07-') || dob.includes('-08-');
        return {
            energy_level: isSummer ? ('Critical_Heat' as const) : ('Balanced' as const),
            is_gongmang: true,
            gongmang_type: 'Resonant_Bell' as const,
            sip_seong: '정관(正官) / 편재(偏財)',
            unseong_phase: '건록(建祿)'
        };
    }

    private _calculateGeneKeys(dob: string) {
        return {
            lifes_work: 53.1,
            evolution: 54.1,
            radiance: 51.3,
            purpose: 57.3,
            pearl: 40.2
        };
    }

    private _synthesizeIntegralState(
        daily: MyeongshimInput['daily_state'],
        saju: { energy_level: string; is_gongmang: boolean }
    ) {
        if (daily.physical_energy <= 3) {
            return {
                recommended_mode: 'Deep_Rest' as const,
                reasoning: '생체 에너지가 낮으므로 1분 자비 호흡과 432Hz 델타파 수면 이완이 최우선입니다.',
                alchemical_anchor: '57.3 손위풍(巽爲風) - 바람처럼 유연한 직관'
            };
        }

        return {
            recommended_mode: 'High_Focus' as const,
            reasoning: '신사일주의 정관 원칙과 53.1 풍산점의 점진적 시스템을 발동할 최적의 타이밍입니다.',
            alchemical_anchor: '53.1 풍산점(風山漸) - 점진적 완성의 미학'
        };
    }

    private _getFallbackContext(): MyeongshimContext {
        return {
            saju: {
                energy_level: 'Balanced',
                is_gongmang: false,
                sip_seong: '정관(正官)',
                unseong_phase: '장생(長生)'
            },
            gene_keys: {
                lifes_work: 53.1,
                evolution: 54.1,
                radiance: 51.3,
                purpose: 57.3,
                pearl: 40.2
            },
            integral_synthesis: {
                recommended_mode: 'High_Focus',
                reasoning: '기본 중심 궤도를 유지합니다.',
                alchemical_anchor: '53.1 풍산점'
            }
        };
    }
}