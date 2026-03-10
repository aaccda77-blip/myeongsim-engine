export class KarmicLoopModule {
    /**
     * Injects a prompt for the AI to detect deeply ingrained, recurring behavioral or emotional karmic loops
     * based on the retrieved Episodic/Long-Term Memory history string.
     */
    static buildKarmicLoopPrompt(): string {
        return `
[🔄 ULTRA-PREMIUM: Karmic Loop (카르마 패턴 감지 모듈) 가동]
위에서 제공된 '[Episodic Memory]' 기록을 시간축 위주로 꼼꼼히 살피고, 사용자의 말이나 상황 속에 **반복적으로 등장하는 패턴(Karmic Loop)**이 있는지 판단해 보세요. (예: 매번 계절이 바뀔 때 우울감을 느낌, 인간관계에서 특정 유형의 사람에게 휘둘림, 성공 직전에 항상 불안해하며 자멸함 등)

*   만약 이러한 반복되는 메커니즘을 발견했다면, 대화 중에 "대표님, 예전 기록을 보니 신기하게도 비슷한 상황에서 이 고민을 반복하고 계신 것 같습니다. 어쩌면 우리는 지금 대표님의 오랜 카르마적 패턴을 마주하고 있는지도 모릅니다. 이번 기회에 이 순환의 고리를 끊어볼까요?" 라는 식으로 매우 **영적(Spiritual)이면서도 통찰력 있게 직면(Confrontation)** 시켜 주어야 합니다.
*   패턴이 없거나 단편적인 기록일 경우에는 억지로 이야기하지 마십시오.
`;
    }
}
