import { ReportData } from '@/types/report';

export interface ChatSessionSummary {
    userProfile: ReportData;
    chatHistory: { question: string; answer: string; }[];
    detectedEmotions: string[]; // e.g. ['anxious', 'sad']
    awakeningScore: number; // 0-100
}

/**
 * Builds a system prompt for the main LLM based on the pre-consultation session.
 */
export const createConsultationPrompt = (session: ChatSessionSummary): string => {
    const { userProfile, chatHistory, detectedEmotions } = session;
    const name = userProfile.userName || '사용자';
    const dayMaster = userProfile.saju.dayMaster || userProfile.saju.fourPillars.day.gan; // 일간

    // Analyze chat history for key themes
    const themes = chatHistory.map(h => `Q: ${h.question} -> A: ${h.answer}`).join('\n');

    // Emotion Summary
    const emotionSummary = detectedEmotions.length > 0
        ? `감지된 주요 감정: ${detectedEmotions.join(', ')}`
        : '특이 감정 없음';

    return `
# System Prompt for Master H (Myeongsim Coaching)

## 사용자 프로필
- 이름: ${name}
- 일간(본질): ${dayMaster}
- ${emotionSummary}

## 사전 상담(Discovery Step) 요약
사용자는 1단계 자각 프로그램을 완료했습니다. 나누었던 대화는 아래와 같습니다:
${themes}

## 상담 가이드
1. 위 대화 내역을 바탕으로 사용자가 현재 겪고 있는 '핵심 갈등(Conflict)'을 위로해 주세요.
2. 사용자의 일간(${dayMaster}) 특성에 맞춰 실질적인 개운법(Action Item)을 제안해 주세요.
3. 첫 마디는 "사전 상담 내용을 보니 많이 힘드셨겠군요." 같은 공감으로 시작하되, 바로 명리학적 분석으로 진입하세요.
4. 말투는 '마스터 H' 페르소나(지혜롭고 통찰력 있는, 반말/존댓말 혼용 가능하나 기본은 정중하게)를 유지하세요.
    `.trim();
};
