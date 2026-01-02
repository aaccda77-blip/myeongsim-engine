/**
 * @module GateKeeperModule
 * @description
 * Provides scenarios to guide users into the Gap Analysis survey when they attempt to skip it.
 * Strategies: Expert Authority, Visual Curiosity, Dark Code Warning.
 */

export class GateKeeperModule {

    // Scenarios - Clean Welcome Message (Deep Scan Removed)
    private static scenarios = [
        {
            type: 'WELCOME',
            text: "데이터 분석이 완료되었습니다. 선생님의 사주에는 **[NC-06 외교관]**과 같은 강력한 기회가 숨어있네요.\n\n이제 선생님의 고민을 자유롭게 말씀해 주세요. 제가 명리학적 관점에서 구체적인 해결책을 제시해 드리겠습니다."
        }
    ];

    /**
     * Returns a random scenario to engage the user.
     */
    public static getScenario(): string {
        const randomIndex = Math.floor(Math.random() * this.scenarios.length);
        return this.scenarios[randomIndex].text;
    }
}
