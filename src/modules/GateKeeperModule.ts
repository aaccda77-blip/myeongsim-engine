/**
 * @module GateKeeperModule
 * @description
 * Provides scenarios to guide users into the Gap Analysis survey when they attempt to skip it.
 * Strategies: Expert Authority, Visual Curiosity, Dark Code Warning.
 */

export class GateKeeperModule {

    // Scenarios
    private static scenarios = [
        {
            type: 'EXPERT',
            text: "데이터 분석이 완료되었습니다. 선생님은 **[NC-06 외교관]**의 강력한 기회를 타고나셨네요.\n하지만 똑같은 사주라도 현재 '격차(Gap)'가 얼마냐에 따라 운의 흐름은 180도 달라집니다.\n선생님의 잠재력이 지금 얼마나 발현되고 있는지 3가지만 체크해 볼까요? 그래야 정확한 '운명 처방전'이 나옵니다."
        },
        {
            type: 'CURIOSITY',
            text: "잠시만요! 현재 선생님의 **운명 게이지가 '0'**으로 표시되고 있어요.\n사주라는 설계도(INNATE)는 완벽한데, 지금 선생님이 실제 쓰고 있는 에너지(ACQUIRED)를 확인해야 게이지가 활성화됩니다.\n간단한 선택지 3개만 눌러주시면, 즉시 저 게이지를 채워 분석을 시작할게요."
        },
        {
            type: 'WARNING',
            text: "음... 선생님의 기질 데이터에서 **미세한 노이즈(Dark Code)**가 감지됩니다.\n이대로 사주만 풀이하면 오히려 독이 될 수 있어요. 현재 심리적 방어 기제가 작동 중인지 확인이 필요합니다.\n아래 질문에 솔직하게 답해 주시면, 노이즈를 제거하고 진짜 운을 쓰는 법을 알려드릴게요."
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
