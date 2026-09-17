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

    const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (isMockMode || !apiKey) {
      console.log("Mock AI Mode enabled, returning customized master core chat reply.");
      const offlineReply = `[명심 마스터 코어 자각]
${selectedGapjaId} 기질의 고유한 주파수를 관조하며 말씀드립니다.

"${userMessage}"에 대해 깊이 공감합니다.
지금 올라오는 생각과 불안은 당신을 가두는 틀이 아니라, 당신의 의식이 새로운 도약을 위해 에너지를 응축하는 수렴의 과정입니다.

1. **Scan (자각)**: 현재의 감정을 밀어내지 말고 있는 그대로 인정해 주세요.
2. **Sync (정렬)**: ${selectedGapjaId} 본연의 맑고 고결한 내면 중심(제로포인트)으로 호흡을 맞추세요.
3. **Shift (전환)**: 이미 당신 안에 필요한 모든 해답과 회복 탄력성이 갖추어져 있습니다.

지금 이 순간, 어깨의 긴장을 풀고 가만히 미소 지어 보세요. 당신의 길은 언제나 안전하게 열려 있습니다. ✨`;

      return NextResponse.json({ text: offlineReply });
    }

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
