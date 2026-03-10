interface SimpleMessage {
    role: string;
    content: string;
}

export interface NeuroscienceAnalysisResult {
    isLateNight: boolean; // 22:00-06:00
    isCognitiveOverload: boolean;
    hasNeuroplasticity: boolean; // 7-day positive pattern
    guidancePrompt?: string;
}

/**
 * NeuroscienceModule
 * 뇌과학 전문가 관점: Circadian Rhythm, Cognitive Load, Neuroplasticity
 */
export class NeuroscienceModule {

    /**
     * Analyze current context for neuroscience optimization
     */
    static analyze(
        history: SimpleMessage[],
        currentMsg: string,
        currentHour: number, // KST hour (0-23)
        userId?: string
    ): NeuroscienceAnalysisResult {

        const result: NeuroscienceAnalysisResult = {
            isLateNight: false,
            isCognitiveOverload: false,
            hasNeuroplasticity: false
        };

        // 1. Circadian Rhythm Check (일주기 리듬)
        // 밤 10시~새벽 6시: 전두엽 활동 저하 시간
        if (currentHour >= 22 || currentHour < 6) {
            result.isLateNight = true;
            result.guidancePrompt = `
[🧠 NEUROSCIENCE ALERT: LATE NIGHT / EARLY MORNING]
Time: ${currentHour}시 (Prefrontal Cortex Low Activity Period)
- DO NOT encourage major decisions or problem-solving.
- SUGGEST: "지금은 전두엽 활동이 낮은 시간이에요. 중요한 결정은 내일 아침으로 미루세요."
- TONE: Gentle, sleep-encouraging.
`;
        }

        // 2. Cognitive Load Detection (인지 과부하 감지)
        // 사용자 메시지가 길고 복잡하면 과부하 상태
        const wordCount = currentMsg.split(/\s+/).length;
        const questionCount = (currentMsg.match(/\?|어떻게|왜|무엇|어디/g) || []).length;

        if (wordCount > 50 && questionCount >= 2) {
            result.isCognitiveOverload = true;
            result.guidancePrompt = (result.guidancePrompt || '') + `
[🧠 NEUROSCIENCE ALERT: COGNITIVE OVERLOAD DETECTED]
User message is long (${wordCount} words) with multiple questions (${questionCount}).
- SIMPLIFY your response: Use SHORT sentences.
- PROVIDE CHOICES: "A와 B 중 하나만 골라주세요."
- AVOID complex explanations.
`;
        }

        // 3. Neuroplasticity Tracker (신경가소성 추적)
        // 7일간 긍정 메시지 반복 감지 (간단한 로직: localStorage or Supabase 필요)
        // 현재는 간단히 "긍정 키워드" 7회 이상 등장 체크
        const fullHistory = [...history, { role: 'user', content: currentMsg }];
        const userMessages = fullHistory.filter(m => m.role === 'user');

        const positiveKeywords = ['좋아', '행복', '감사', '성공', '이루', '해냈', '잘했', '발전'];
        let positiveCount = 0;

        userMessages.slice(-10).forEach(msg => {
            if (positiveKeywords.some(k => msg.content.includes(k))) {
                positiveCount++;
            }
        });

        if (positiveCount >= 3) { // 최근 10개 중 3개 이상 긍정
            result.hasNeuroplasticity = true;
            result.guidancePrompt = (result.guidancePrompt || '') + `
[🧠 NEUROSCIENCE ALERT: NEUROPLASTICITY DETECTED]
User has shown ${positiveCount} positive patterns in recent messages.
- CELEBRATE: "축하합니다! 🧠✨ 뇌의 신경회로가 재설계되고 있어요. 이런 긍정 패턴이 반복되면 새로운 습관이 뇌에 고정됩니다!"
- REINFORCE: Encourage continuity.
`;
        }

        return result;
    }
}
