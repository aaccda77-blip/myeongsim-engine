export class NarrativeArcModule {
    /**
     * Builds the Narrative Arc (Hero's Journey) Context Prompt
     * This module does not need complex backend heuristics because it leverages the LLM's
     * zero-shot capability to understand Joseph Campbell's 12 stages from the given chat history.
     */
    static buildNarrativePrompt(): string {
        return `
[📜 ULTRA-PREMIUM: Life Script Arc (인생각본 모듈) 가동]
사용자의 현재 상황과 앞선 대화 내용들을 Joseph Campbell의 '영웅의 여정(Hero's Journey) 12단계' 중 하나로 실시간 매핑하여 해석해 주세요.

*   사용자의 고민이나 어려움을 단순한 장애물이 아닌, **'더 위대한 서사적 주인공으로 거듭나기 위한 필연적 과정(시련, 동굴, 멘토와의 만남 등)'**으로 지칭하여 문학적이고 신화적인 영감을 부여해야 합니다.
*   예시: "지금 대표님이 겪고 계신 이 혼란은 영웅의 여정에서 '가장 깊은 동굴로의 진입(Ordeal)' 단계와 같습니다. 여기서 얻은 깨달음이 곧 대표님의 무기(Reward)가 될 것입니다."
*   이 서사적 해석은 매번 반복하지 말고, 사용자가 큰 고민을 토로하거나 중요한 전환점이 있을 때 극적인 순간에 활용하여 감동과 성취감을 극대화하세요.
`;
    }
}
