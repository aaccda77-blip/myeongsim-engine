/**
 * @module CodeDecoder
 * @description
 * Implements the '3-Step Code Decoder' logic based on the patent.
 * Translates the user's state (Gap, Code, MBTI) into a dramatic narrative structure.
 * 
 * Logic:
 * 1. Dark Code (Error): Active when Gap > 30%. Represents the specific 'Genre' of the problem.
 * 2. Neural Code (Solution): Specific action to bridge the gap.
 * 3. Meta Code (Mastery): The optimized state.
 */

export interface HelperContent {
    title: string;
    description: string;
    actionPlan: {
        step1: string; // Recognition
        step2: string; // Reframing
        step3: string; // Action
    };
}

export class CodeDecoder {

    /**
     * Decodes the user's current state into a 3-step narrative.
     * @param ncCode - The Gene Key / Saju Code (e.g., "NC-06")
     * @param gapLevel - The calculated Gap Level (0-100)
     * @param mbti - User's MBTI type
     */
    public static decodeState(ncCode: string, gapLevel: number, mbti: string): HelperContent {
        const codeId = ncCode.toUpperCase();
        const isHighGap = gapLevel > 30;

        // 1. Define Code Database (Extensible)
        const codeMap: Record<string, any> = {
            'NC-06': {
                name: 'Diplomat (외교관)',
                dark: {
                    genre: 'Psychological Thriller (심리 스릴러)',
                    desc: '타인의 시선과 정보 과부하로 인해 끊임없이 갈등하며 결정을 미루는 상태 (Analysis Paralysis).',
                    step1: '갈등의 원인이 내면의 불안임을 인지하세요.'
                },
                neural: {
                    genre: 'Strategic Drama (전략 드라마)',
                    desc: '객관적 팩트를 기반으로 감정을 분리하고 우선순위를 정하는 상태.',
                    step2: '감정을 배제하고 팩트 체크 리스트를 작성하세요.'
                },
                meta: {
                    genre: 'Epic (대서사시)',
                    desc: '갈등을 평화로 전환하여 모두에게 이익이 되는 최적의 합의를 도출한 상태.',
                    step3: '작은 결정부터 즉시 실행하여 피드백 루프를 만드세요.'
                }
            }
            // Add more codes here...
        };

        const data = codeMap[codeId];

        // 2. Fallback for Unknown Code
        if (!data) {
            return {
                title: `Self-Optimization Mode (${codeId || 'Unknown'})`,
                description: '현재 당신의 상태를 최적화하기 위한 일반적인 가이드입니다.',
                actionPlan: {
                    step1: '현재 자신의 감정 상태를 있는 그대로 관찰하세요.',
                    step2: '이 감정이 어디서 왔는지 객관적으로 분석하세요.',
                    step3: '지금 당장 할 수 있는 가장 작은 행동을 실천하세요.'
                }
            };
        }

        // 3. Construct Output based on Gap Logic
        if (isHighGap) {
            // Dark Code Active (Problem State)
            return {
                title: `⚠️ 경고: 당신의 장르는 현재 '${data.dark.genre}'입니다.`,
                description: `${data.dark.desc} (Gap Level: ${gapLevel}%)`,
                actionPlan: {
                    step1: `[인지] ${data.dark.step1}`,
                    step2: `[전환] ${data.neural.step2}`,
                    step3: `[해결] ${data.neural.step3}` // Pushing towards Neural action
                }
            };
        } else {
            // Neural/Meta Code Active (Flow State)
            return {
                title: `✨ 최적화: 당신은 현재 '${data.meta.genre}'의 주인공입니다.`,
                description: `${data.neural.desc} 당신의 에너지는 효율적으로 흐르고 있습니다.`,
                actionPlan: {
                    step1: `[유지] 현재의 흐름을 유지하며 자신을 신뢰하세요.`,
                    step2: `[확장] ${data.meta.desc}`,
                    step3: `[완성] ${data.meta.step3}`
                }
            };
        }
    }
}
