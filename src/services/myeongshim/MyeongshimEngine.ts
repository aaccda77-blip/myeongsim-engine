import { calculateSaju } from '@/lib/saju/SajuEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EngineInput, MyeongshimContext, IntegralState } from '@/types/integral';

/**
 * Myeongshim Integral Engine
 * 
 * The "Brain" of the proactive coaching system.
 * Zero-dependency module (Sidecar Pattern).
 * Uses existing SajuEngine for reliable Saju calculations.
 */
export class MyeongshimEngine {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'MISSING_KEY';
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Main Entry Point
     */
    public async generateDailyCoaching(input: EngineInput): Promise<{ context: MyeongshimContext, advice: string }> {
        try {
            // 1. Calculate Saju using existing SajuEngine
            const sajuContext = this._calculateSaju(input.dob);

            // 2. Calculate Gene Keys (Simplified)
            const geneKeys = this._calculateGeneKeys(input.dob);

            // 3. Integral Synthesis
            const context: MyeongshimContext = {
                saju: sajuContext,
                gene_keys: geneKeys,
                integral_synthesis: this._synthesizeIntegralState(input.daily_state, sajuContext)
            };

            // 4. Generate AI Advice
            const advice = await this._callAI(context, input.daily_state);

            return { context, advice };

        } catch (error) {
            console.error("MyeongshimEngine Error:", error);
            return {
                context: {
                    saju: {
                        energy_level: 'Normal',
                        is_gongmang: false,
                        gongmang_type: undefined,
                        sip_seong: '비겁/겁재 (Self)',
                        unseong_phase: 'Normal'
                    },
                    gene_keys: {
                        lifes_work: 1.1,
                        evolution: 2.2,
                        radiance: 3.3,
                        purpose: 4.4
                    },
                    integral_synthesis: {
                        primary_issue: 'None',
                        action_mode: 'Rest'
                    }
                } as MyeongshimContext,
                advice: "잠시 명상하며 쉬어가는 하루 되세요. (현재 AI 사용량이 많아 기본 가이드를 제공합니다.)"
            };
        }
    }

    // =========================================================================
    // Module A: Saju Calculator (reuses SajuEngine)
    // =========================================================================

    private _calculateSaju(dobIso: string): MyeongshimContext['saju'] {
        try {
            const result = calculateSaju(dobIso, '12:00', 'solar', 'male');

            if (!result.success) {
                return {
                    energy_level: 'Normal',
                    is_gongmang: false,
                    gongmang_type: undefined,
                    sip_seong: '분석 불가',
                    unseong_phase: 'Normal'
                };
            }

            // Simple energy level based on day master element
            const dayMaster = result.dayMaster;
            let energyLevel: 'Critical_Heat' | 'Balanced' | 'Cold' | 'Normal' = 'Normal';

            if (dayMaster.includes('화')) {
                energyLevel = 'Critical_Heat';
            } else if (dayMaster.includes('수')) {
                energyLevel = 'Cold';
            }

            return {
                energy_level: energyLevel,
                is_gongmang: false, // Simplified for MVP
                gongmang_type: undefined,
                sip_seong: '비겁/겁재 (Self)',
                unseong_phase: 'Normal'
            };
        } catch (e) {
            console.error('Saju calculation error:', e);
            return {
                energy_level: 'Normal',
                is_gongmang: false,
                gongmang_type: undefined,
                sip_seong: '분석 불가',
                unseong_phase: 'Normal'
            };
        }
    }

    // =========================================================================
    // Module B: Gene Keys Mapper (Simplified)
    // =========================================================================

    private _calculateGeneKeys(dobIso: string): MyeongshimContext['gene_keys'] {
        const date = new Date(dobIso);

        // MVP Logic: Day of Year mapping
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        // Vernal Equinox is ~March 20 (Day 80).
        let longitude = ((dayOfYear - 80) / 365.25) * 360;
        if (longitude < 0) longitude += 360;

        // Dynamic Calculation Helper
        const getHexagram = (deg: number) => Math.floor(deg / (360 / 64)) + 1;
        const getLine = (deg: number) => Math.floor((deg % (360 / 64)) / (360 / 64 / 6)) + 1;

        const sunGate = getHexagram(longitude);
        const sunLine = getLine(longitude);
        const earthGate = getHexagram((longitude + 180) % 360);
        const earthLine = getLine((longitude + 180) % 360);

        return {
            lifes_work: parseFloat(`${sunGate}.${sunLine}`),
            evolution: parseFloat(`${earthGate}.${earthLine}`),
            radiance: 51.1,
            purpose: 57.1
        };
    }

    // =========================================================================
    // Module C: Integral Synthesis
    // =========================================================================

    private _synthesizeIntegralState(state: IntegralState, saju: MyeongshimContext['saju']): MyeongshimContext['integral_synthesis'] {
        if (state.ur_body <= 4 || state.symptoms.includes('sick') || state.symptoms.includes('hangover')) {
            return { primary_issue: 'Body', action_mode: 'Rest' };
        }
        if (state.ul_mind <= 4) {
            return { primary_issue: 'Mind', action_mode: 'Reset' };
        }
        if (state.ll_relation <= 4) {
            return { primary_issue: 'Relation', action_mode: 'Maintain' };
        }

        if (saju.gongmang_type === 'Resonant_Bell' && state.ul_mind > 5) {
            return { primary_issue: 'None', action_mode: 'Expand' };
        }

        return { primary_issue: 'None', action_mode: 'Expand' };
    }

    private async _callAI(context: MyeongshimContext, state: IntegralState): Promise<string> {
        // Upgrade to Gemini 2.5 Flash (User Request)
        const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are the 'Myeongshim Coach' (명심 코치).
Your goal is to provide insightful, holistic guidance based on Werner Pitzal's Integral Philosophy.

[USER PROFILE]
- Saju Energy: ${context.saju.energy_level} (${context.saju.unseong_phase})
- Gongmang: ${context.saju.is_gongmang ? context.saju.gongmang_type : 'None'}
- Gene Keys (Purpose): ${context.gene_keys.purpose}
- Integration Mode: ${context.integral_synthesis.action_mode}

[CURRENT STATE (Check-in)]
- Body: ${state.ur_body}/10
- Mind: ${state.ul_mind}/10
- Symptoms: ${state.symptoms.join(', ')}

[PHILOSOPHY RULES - STRICTLY FOLLOW]
1. **Somatic Awareness**: Before giving advice, ask the user to verify where they feel this issue in their body.
2. **Break Dependency**: Do not act like a Guru. Tell them the chart is only a map.
3. **Deconstruction**: If they say "I am anxious", reframe it as "You are experiencing an Anxiety pattern".
4. **Resonant Bell Logic**: If Gongmang type is 'Resonant_Bell', advise them to use Virtual/Online channels instead of physical ones.

[INSTRUCTION]
Synthesize the data.
- IF Body is low (<4), COMMAND them to REST. Ignore all 'Expansion' keys.
- IF Gongmang is active + High Mind, encourage 'Virtual Expansion' (YouTube, Content).
- Tone: Empathetic, Deep, Awakening. Korean Language.
- Do NOT output JSON. Output a natural conversation starter.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}
