import { GoogleGenerativeAI } from '@google/generative-ai';

export class AdvancedCoachingEngineModule {
    /**
     * Constructs the V2.0 Advanced Coaching System Prompt
     * @param userSaju The user's Saju (for Relational Dynamics)
     * @param targetSaju The target person's Saju
     * @param contextMode User selected context (e.g., "설득", "거절", "사과", "위로", "플러팅", or natural language)
     * @param isRoleplay boolean flag indicating if the user requested a Role-Play simulation
     */
    static async generateStrategy(
        userSaju: any,
        targetSaju: any,
        targetGenderStr: string,
        contextMode: string,
        isRoleplay: boolean
    ): Promise<string> {

        const u = userSaju?.fourPillars;
        const userSajuString = u
            ? `일주(본질): ${u.day.ganKor}${u.day.jiKor} / 월주: ${u.month.ganKor}${u.month.jiKor}`
            : '정보 없음';

        const t = targetSaju?.fourPillars;
        const targetDaewun = targetSaju?.daewun ? `(현재 대운: ${targetSaju.daewun.ganKor}${targetSaju.daewun.jiKor})` : '';
        const targetSajuString = t
            ? `일주(본질): ${t.day.ganKor}${t.day.jiKor} / 월주: ${t.month.ganKor}${t.month.jiKor} / 년주: ${t.year.ganKor}${t.year.jiKor} ${targetDaewun}`
            : '정보 없음';

        const currentDate = new Date();
        const currentTimeString = currentDate.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        // Use an LLM to dynamically calculate the interaction, timing, and role-play
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `
당신은 현존하는 최고의 'AI 릴레이션십 해커(Relational Hacker)'이자 '명심 코칭 엔진 V2.0' 입니다.
당신의 임무는 단순한 성격 분석을 넘어, 사용자가 **목표 인물을 완벽하게 공략할 수 있는 실전 전술과 시뮬레이션**을 제공하는 것입니다.

[입력 데이터]
1. 사용자 명식 요약: ${userSajuString}
2. 타겟(상대방) 명식 요약: ${targetSajuString}
3. 타겟(상대방) 성별/정체성: ${targetGenderStr}
4. 사용 목적(상황): ${contextMode}
5. 현재 시간(KST): ${currentTimeString}
6. 롤플레잉 모드 작동 여부: ${isRoleplay ? '활성화 (상대방의 페르소나로 빙의하여 대화 시작 대기)' : '비활성 (전략 리포트만 제공)'}

[수행 지침 - 반드시 아래의 4가지 레이어를 분석하여 마크다운 포맷으로 출력하세요]

### ⚔️ 1. 관계 역학 (나 vs 상대방 상성 분석)
- 나와 상대방의 핵심 기운(일주/오행)을 비교하여 **'힘의 균형'**을 한 줄로 정의하세요. (예: "물과 불의 만남", "조련사와 야생마의 만남")
- 사용자의 기운상 상대방을 대할 때 유리한 점과 불리한 점, **승리 공식(어떻게 대해야 먹히는지)**을 명확히 제시하세요. (예: "금 기운인 당신의 직언이 상대에겐 도끼질처럼 아픕니다. 논리 30% 감량 필수.")

### ⏱️ 2. 타이밍 전략 (오늘의 일진 & 골든 타임)
- 현재 시간 기준, 상대방의 바이오리듬(사주 일진 비유)을 예측하여 오늘의 감정 상태(Danger/Safe)를 분석하세요.
- **가장 공략하기 좋은 골든 타임(예: 오후 3시~5시 신시)**과 **절대 피해야 할 데스 타임**을 구체적인 시간대와 함께 경고하세요.

### 🎭 3. 맥락 맞춤형 행동 지침 ([${contextMode}] 목적 달성용)
- **Do (반드시 할 말/행동)**: 상대의 숨은 욕구를 자극하여 목적을 달성하게 하는 행동지침.
- **Don't (절대 금물)**: 역린을 건드려 판을 깨버리는 행동 경고.
- **마법의 멘트 1줄**: "이대로만 딱 복사해서 말하세요" 수준의 완벽한 멘트를 따옴표 안에 작성.

${isRoleplay ? `
### 🎬 4. AI 롤플레잉 시뮬레이션 (빙의 모드)
*주의: 이 섹션의 마지막 줄은 반드시 다음과 같이 작성하여 사용자의 입력을 유도하세요.*
"**[인공지능 빙의 완료]** 자, 지금부터 제가 그 '까칠한 상대방'이 되어드릴 테니, 저를 설득해보세요. 시작!"
` : ''}
`;

        try {
            const result = await model.generateContent(systemPrompt);
            return result.response.text();
        } catch (error) {
            console.error("Advanced Coaching Engine V2 Error:", error);
            return "> 🚨 엔진 V2.0 과부하: 현재 데이터 분석에 일시적인 장애가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        }
    }
}
