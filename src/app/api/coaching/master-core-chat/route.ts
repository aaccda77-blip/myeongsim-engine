import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectMyeongsimPlugin } from '@/modules/saju60Modules';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { messages, selectedGapjaId, userMessage } = await req.json();

    if (!selectedGapjaId || !userMessage) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다 (selectedGapjaId, userMessage).' },
        { status: 400 }
      );
    }

    // 1. 사용자 메시지와 60갑자 기질에 연동된 동적 시스템 프롬프트 주입
    const systemInstruction = injectMyeongsimPlugin(userMessage, selectedGapjaId);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });

    // 2. Gemini 히스토리 형식으로 대화 내역 변환
    // 이전 메시지 중 시스템 지시어 노출 로그는 제외하고 정상적인 대화만 필터링합니다.
    const validMessages = messages.filter((m: any) => !m.isSystemPrompt);

    // 마지막 사용자 메시지 이전까지를 대화 히스토리로 구성
    const history = [];
    for (let i = 0; i < validMessages.length - 1; i++) {
      const msg = validMessages[i];
      history.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    // Gemini startChat 세션 생성 및 응답 연산
    const chatSession = model.startChat({
      history: history,
      systemInstruction: systemInstruction,
    });

    const result = await chatSession.sendMessage(userMessage);
    const text = result.response.text().trim();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Master Core Chat API Error:', error);
    return NextResponse.json(
      {
        text:
          '길을 비추는 마음의 등불이 잠시 어른거렸습니다.\n' +
          '불안해하지 마시고, 크게 한 번 숨을 들이마신 후 당신의 이야기를 다시 들려주십시오.\n' +
          '당신의 내면은 언제나 맑음이랍니다.',
      },
      { status: 200 }
    );
  }
}
