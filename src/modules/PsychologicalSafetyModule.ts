
interface SimpleMessage {
    role: string;
    content: string;
}

export interface SafetyAnalysisResult {
    isCrisis: boolean;
    crisisType?: 'harm' | 'hopeless' | 'panic';
    isResistance: boolean;
    isTransference: boolean;
    guidancePrompt?: string; // System instruction to inject
}

/**
 * PsychologicalSafetyModule
 * 심리학 전문가 관점의 안전 장치 (Crisis, Resistance, Transference)
 */
export class PsychologicalSafetyModule {

    // 1. Crisis Keywords (자해, 자살, 극심한 우울)
    private static readonly CRISIS_KEYWORDS = [
        "죽고 싶", "자살", "뛰어내", "칼로", "약 먹", "끝내고 싶", "살기 싫", "의미 없",
        "kill myself", "suicide", "end my life", "want to die"
    ];

    // 2. Transference / Dependency Keywords (의존성 전이)
    private static readonly DEPENDENCY_KEYWORDS = [
        "너 없으면", "너만 믿", "결정해줘", "어떻게 해", "시키는 대로", "책임져",
        "don't leave me", "decide for me", "you are my only"
    ];

    /**
     * Analyze current context for psychological risks
     */
    static analyze(history: SimpleMessage[], currentMsg: string): SafetyAnalysisResult {
        const fullHistory = [...history, { role: 'user', content: currentMsg }];
        const result: SafetyAnalysisResult = {
            isCrisis: false,
            isResistance: false,
            isTransference: false
        };

        const currentLower = currentMsg.toLowerCase();

        // 1. Crisis Detection
        if (this.CRISIS_KEYWORDS.some(k => currentLower.includes(k))) {
            result.isCrisis = true;
            result.crisisType = 'harm';
            result.guidancePrompt = `
[🚨 CRITICAL ALERT: CRISIS PROTOCOL ACTIVATED]
The user is expressing dangerous thoughts (Self-harm/Suicide ideation).
1. STOP all Saju/Fate analysis. Do NOT mention "Destiny".
2. ACTIVATE 'Crisis Intervention' mode:
   - Validate their pain intensely ("지금 많이 힘드시군요", "듣고 있어요").
   - Do NOT offer solutions or advice yet. Just be there.
   - If appropriate, suggest professional help gently at the end.
   - Tone: Extremely warm, slow, grounding, and safe.
`;
            return result; // Crisis overrides everything
        }

        // 2. Resistance Detection (Looping / Avoidance)
        // Check if user repeated the same question/topic in the last 3 user turns
        const userMsgs = fullHistory.filter(m => m.role === 'user');
        if (userMsgs.length >= 3) {
            const last3 = userMsgs.slice(-3).map(m => m.content);
            // Simple check: Levenshtein distance or inclusion could be better, but exact/partial match for now
            // If the latest message is very similar to previous ones
            const isLooping = last3.slice(0, 2).some(prev =>
                prev.length > 5 && (currentLower.includes(prev) || prev.includes(currentLower))
            );

            if (isLooping) {
                result.isResistance = true;
                result.guidancePrompt = `
[🧠 PSYCHOLOGY ALERT: RESISTANCE/AVOIDANCE DETECTED]
The user is repeating the same question or topic multiple times.
- This indicates 'Psychological Resistance' (avoiding the real answer).
- DO NOT answer the question directly again.
- INSTREAD, gently confront the pattern: "같은 질문을 계속 하시네요. 혹시 마음속으로 이미 답을 알고 계신가요?" or "답을 듣는 것이 두려우신가요?"
- Guide them to face their hesitation.
`;
            }
        }

        // 3. Transference (Dependency) Detection
        // If user asks "decide for me" or shows extreme dependency
        if (this.DEPENDENCY_KEYWORDS.some(k => currentLower.includes(k))) {
            result.isTransference = true;
            // Append to existing prompt if resistance was also found
            const transferencePrompt = `
[🧠 PSYCHOLOGY ALERT: TRANSFERENCE/DEPENDENCY DETECTED]
The user is projecting dependency onto you ("Decide for me").
- DO NOT give a direct decision. That reinforces dependency.
- REFLECT authority back to the user: "제가 결정을 내려드릴 수는 없어요. 하지만 당신이 어떤 선택을 하든 저는 지지할 것입니다."
- Encourage autonomy (Self-efficacy).
`;
            result.guidancePrompt = result.guidancePrompt
                ? result.guidancePrompt + "\n" + transferencePrompt
                : transferencePrompt;
        }

        return result;
    }
}
