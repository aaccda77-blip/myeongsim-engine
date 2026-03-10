export class ShadowTrackerModule {
    private static DENIAL_KEYWORDS = [
        "절대 아닙니다", "아니요", "그건 아니에요", "전혀 그렇지 않습니다",
        "관심 없습니다", "상관없습니다", "상관 안 합니다",
        "필요 없습니다", "별로", "안 그렇습니다", "아니라고"
    ];

    /**
     * Scans a user's message for defensive/denial patterns.
     * @param message The raw user message
     * @returns Extracted shadow context or null if none
     */
    static extractShadow(message: string): { trigger: string; timestamp: string } | null {
        if (!message) return null;

        for (const keyword of this.DENIAL_KEYWORDS) {
            if (message.includes(keyword)) {
                return {
                    trigger: message,
                    timestamp: new Date().toISOString()
                };
            }
        }
        return null;
    }

    /**
     * Joins the extracted shadow into the full shadow profile.
     * @param existingProfile existing shadow Array in user_metadata
     * @param newTrigger newly detected shadow
     * @returns updated shadow array (keeps last 5 to prevent bloat)
     */
    static updateShadowProfile(existingProfile: any[] = [], newTrigger: any): any[] {
        const updated = [...existingProfile, newTrigger];
        // Keep only top 5 recent denials
        if (updated.length > 5) {
            updated.shift();
        }
        return updated;
    }

    /**
     * Synthesize shadow instruction for AI
     */
    static buildShadowPrompt(shadowProfile: any[]): string {
        if (!shadowProfile || shadowProfile.length === 0) return "";
        const keywords = shadowProfile.map(s => `"${s.trigger.substring(0, 20)}..."`).join(", ");
        return `
        [그림자 추적 시스템 (Shadow Tracker)]:
        사용자는 과거 대화에서 다음과 같은 강한 부정/방어 기제를 보였습니다: ${keywords}
        *AI 지침*: 이 키워드들을 기억하십시오. 사용자가 이 주제를 회피하거나 억압하고 있을(Jungian Shadow) 가능성이 큽니다. 직면이 필요할 때 이를 부드럽게 찔러보세요 (예: "전에도 아니라고 하셨지만, 이 패턴이 반복되네요?").
        `;
    }
}
