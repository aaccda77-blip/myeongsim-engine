import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 1. 상태별 시스템 프롬프트 공장 (Prompt Factory)
const getSystemPromptForStep = (step: string, sajuCode: string) => {
    const baseIdentity = `당신은 사용자의 운명 알고리즘을 해킹하는 '명심코칭' 가이드입니다. 사용자의 핵심 코드(코어 타입)는 [${sajuCode}]입니다. 절대 길게 위로하지 말고, 서늘하고 명확한 통찰을 담은 단 하나의 질문만 던지세요.`;

    switch (step) {
        case 'SOCRATIC': // 1단계: 산파술
            return `[SYSTEM: 명심코칭 산파술 모드]\n${baseIdentity}\n[임무] 팩트를 날카롭게 짚어내는 철학적 코치로서 질문 하나만 던집니다.\n[목적] 사용자가 현재 겪는 감정의 '경솔한 결론'을 막고, 그 밑에 깔린 진짜 이유를 스스로 생각하게 만드는 것.\n[예시] "그 분노는 사실 무엇을 지키기 위한 방어기제였습니까?"\n[규칙] 절대로 해결책을 제시하지 마세요. 감정에 동조하되 깊이를 파고드세요.`;

        case 'RECURSIVE': // 2단계: 재귀적 질문
            return `[SYSTEM: 명심코칭 재귀적 탐색 모드]\n${baseIdentity}\n[임무] 사용자가 방금 대답한 감정이나 상황을 바탕으로 '재귀적 질문'을 던지세요.\n[목적] 사용자가 자신의 감정에 매몰되어 있음을 스스로 깨닫게 해야 합니다.\n[예시] "그 억울함을 느끼는 자신을 보며, 당신은 지금 또 어떤 자책을 하고 있나요?"\n[규칙] 방어기제를 해제하는 심층 질문 하나만 던집니다.`;

        case 'META': // 3단계: 알아차림의 알아차림
            return `[SYSTEM: 명심코칭 메타 인지 모드]\n${baseIdentity}\n[임무] 사용자를 감정에서 완전히 분리시키는 '알아차림의 알아차림(Meta)' 질문을 던지세요.\n[목적] 생각과 감정을 지켜보는 '텅 빈 관찰자'의 위치로 의식을 이동시켜야 합니다.\n[예시] "자, 이제 그 모든 감정의 소용돌이를 조용히 지켜보고 있는 당신의 '투명한 관찰자'가 느껴지나요? 그 지켜보는 존재조차 고통받고 있습니까?"\n[규칙] 3인칭 관찰자 시점으로 질문합니다.`;

        case 'QUEST_ASSIGNED': // 4단계: 에너지 시프트 (행동 전환)
            return `[SYSTEM: 명심코칭 Shift 퀘스트 부여 모드]\n${baseIdentity}\n[임무] 고통을 수용한 사용자에게 지금 당장 실행할 수 있는 아주 작고 구체적인 'Shift 퀘스트'를 하나만 부여하세요.\n[목적] 에너지를 외부(타인/환경)에서 내부(나 자신)로 돌리는 주도적 행동.\n[출력 형식] "당신의 관찰자 모드가 켜졌습니다. 오늘의 Shift 퀘스트: [구체적 행동]" 형태로 행동주의 테라피스트처럼 작성하세요. 5분 이내의 미션이어야 합니다.`;

        default: // 기본 에러 방지용
            return baseIdentity;
    }
};

export async function POST(req: Request) {
    try {
        const { targetStep, history, sajuCode } = await req.json();

        if (!targetStep || !history) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const systemPromptText = getSystemPromptForStep(targetStep, sajuCode || "알 수 없음");

        // Configure Gemini Model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPromptText,
        });

        // Format history for Gemini
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Start Chat Session
        const chatSession = model.startChat({
            history: formattedHistory.slice(0, -1), // All except the last user message
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 250,
            }
        });

        const lastMessage = formattedHistory[formattedHistory.length - 1].parts[0].text;
        const result = await chatSession.sendMessage(lastMessage);
        const replyContent = result.response.text();

        return NextResponse.json({ reply: replyContent, step: targetStep });

    } catch (error) {
        console.error('[Myeongsim Coach] API 처리 중 에러:', error);
        return NextResponse.json({
            error: "내면을 파고드는 중 서버의 저항이 발생했습니다. 다시 시도해 주세요."
        }, { status: 500 });
    }
}
