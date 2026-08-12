/**
 * KarmicLoopModule.ts - 반복 질문 감지 및 1초 단칼 직언 유도 모듈
 */

export class KarmicLoopModule {
    public static buildKarmicLoopPrompt(): string {
        return this.generateKarmicPrompt(true);
    }

    public static generateKarmicPrompt(hasRepeatQuestions: boolean = false): string {
        return `
# ⚡ [반복 질문 감지 시 100% 명쾌 단칼 직언 프로토콜]
사용자가 같은 질문을 반복하거나 답을 촉구할 때:
- "IT용어 정제", "기존 vs 개선 후" 같은 메타 메세지를 출력하지 마십시오. 백엔드가 사전 정제한 완벽하고 따뜻한 언어로 직접 대화하십시오!
- 무조건 "결론부터 말씀드리면: [1초 단칼 판단]"과 정직한 이유, 제3의 대안을 직언하십시오.
`;
    }
}
