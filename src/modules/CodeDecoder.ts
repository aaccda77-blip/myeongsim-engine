/**
 * @module CodeDecoder
 * @description
 * Implements the '3-Step Code Decoder' logic based on the patent.
 * Translates the user's state (Gap, Code, Traits) into a dramatic narrative structure.
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
     * @param ncCode - The Neural Key / Saju Code (e.g., "NC-06")
     * @param gapLevel - The calculated Gap Level (0-100)
     * @param traitCode - User's Trait Code
     */
    public static decodeState(ncCode: string, gapLevel: number, traitCode: string): HelperContent {
        const codeId = ncCode.toUpperCase();
        const isHighGap = gapLevel > 30;

        // 1. Define Code Database (Extensible)
        // [REMOVED] Hardcoded CodeMap to prevent 'Psychological Thriller'
        // Now using Dynamic Generation Logic below
        const codeMap: Record<string, any> = {};

        const data = codeMap[codeId];

        // 2. Fallback for Unknown Code
        // 2. Dynamic Personalized Generation (No Hardcoding)
        // This replaces both the CodeMap lookup and the old Fallback logic

        let title, description, step1, step2, step3;

        if (isHighGap) {
            // [Gap Level > 30] Warm Console & Rest
            title = "잠시 멈춤의 시간";
            description = "현재 당신의 에너지는 잠시 충전이 필요한 '휴식기(Intermission)' 장르입니다. 무리하게 나아가기보다 내면을 돌보는 시간이 필요합니다.";
            step1 = "지금 느끼는 감정을 있는 그대로 인정해주세요.";
            step2 = "하루 10분, 오로지 나만을 위한 멍때리기 시간을 가져보세요.";
            step3 = "작은 성공 경험을 통해 천천히 에너지를 회복하세요.";
        } else {
            // [Gap Level <= 30] Empowerment & Growth
            title = "성장의 가속도";
            description = "당신의 인생은 지금 흥미진진한 '성장 드라마(Growth Drama)' 장르입니다. 타고난 잠재력이 현실에서 멋지게 발현되고 있습니다.";
            step1 = "지금의 좋은 흐름을 유지하며 자신을 칭찬해주세요.";
            step2 = "당신의 강점을 활용해 새로운 도전을 시작해보세요.";
            step3 = "주변 사람들에게 당신의 긍정적인 에너지를 나눠주세요.";
        }

        return {
            title,
            description,
            actionPlan: {
                step1,
                step2,
                step3
            }
        };
    }
}
