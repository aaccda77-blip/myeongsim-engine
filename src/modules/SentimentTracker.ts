// import { Message } from "ai";

interface SimpleMessage {
    role: string;
    content: string;
    id?: string;
}

/**
 * SentimentTracker: 감정 궤적 분석을 통한 번아웃 감지 모듈
 */
export class SentimentTracker {

    // 번아웃 시그널 키워드 (한/영)
    private static readonly BURNOUT_KEYWORDS = [
        "지쳐", "그만", "힘들", "방전", "무의미", "포기", "도망", "우울", "몰라",
        "exhausted", "tired", "burnout", "hopeless", "give up", "nothing"
    ];

    /**
     * 대화 기록을 분석하여 번아웃 상태인지 판단
     * @param history 최근 대화 기록 (SimpleMessage[])
     */
    static analyze(history: SimpleMessage[]): { isBurnout: boolean, intensity: number } {
        if (!history || history.length < 3) return { isBurnout: false, intensity: 0 };

        // 1. 유저 메시지 필터링 (최근 5개)
        const userMsgs = history.filter(m => m.role === 'user').slice(-5);
        if (userMsgs.length < 2) return { isBurnout: false, intensity: 0 };

        let negativeCount = 0;
        let isShrinking = false;

        // 2. 키워드 분석
        userMsgs.forEach(msg => {
            const content = msg.content.toLowerCase();
            if (this.BURNOUT_KEYWORDS.some(k => content.includes(k))) {
                negativeCount++;
            }
        });

        // 3. 텍스트 길이 감소 패턴 감지 (Engagement Drop)
        // 예: 50자 -> 20자 -> 5자 (단답형으로 변함)
        const lengths = userMsgs.map(m => m.content.length);
        if (lengths.length >= 3) {
            const last = lengths[lengths.length - 1];
            const prev = lengths[lengths.length - 2];
            const first = lengths[0];

            if (last < 10 && prev > last * 2 && first > prev) {
                isShrinking = true;
            }
        }

        // 4. 번아웃 판단 로직
        // 조건: 부정 키워드가 2회 이상 반복되거나, 1회라도 있고 답변이 급격히 짧아질 때
        const isBurnout = negativeCount >= 2 || (negativeCount >= 1 && isShrinking);
        const intensity = isBurnout ? (negativeCount * 20) + (isShrinking ? 30 : 0) : 0;

        return {
            isBurnout,
            intensity: Math.min(intensity, 100) // Max 100
        };
    }
}
