import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const apiKey = process.env.GEMINI_API_KEY || '';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(apiKey);

// 응답 완성도 검증
function isResponseComplete(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const lastChar = trimmed[trimmed.length - 1];
  const completionChars = ['.', '!', '?', '다', '요', '오', '세', '✨', '🙏', '💖', '🌟', '💫', '🌸'];
  if (completionChars.includes(lastChar)) return true;
  const lastFew = trimmed.slice(-5);
  if (lastFew.includes('.') || lastFew.includes('!') || lastFew.includes('다')) return true;
  return false;
}

export async function POST(request: Request) {
  try {
    const { 
      userName, 
      sajuText, 
      gongWang, 
      indicatorType,
      indicatorName,
      indicatorValue,
      indicatorDesc
    } = await request.json();

    if (!indicatorName) {
      return NextResponse.json({ error: '분석할 천재성 지표 정보가 누락되었습니다.' }, { status: 400 });
    }

    const fullPrompt = `당신은 명심코칭 AI 천재성 도슨트입니다. 사주 명리와 마음 성찰을 결합하여 타고난 천재성을 일깨워주는 감동 해설을 작성합니다.

[규칙]
- 서양식 용어(Manifestor, Projector, Gift, Siddhi 등) 절대 금지. 명심코칭 용어만 사용: 다크코드, 뉴럴코드, 메타코드, 의식 영역
- 다크코드는 "잘못이 아니라 뇌신경이 당신을 지키려 가동한 보호막"이라고 자비롭게 감싸주세요
- 메타코드는 "파도가 아닌 바다 자체가 되는 알아차림"으로 시적 은유를 사용하세요
- 반드시 500~600자 이내로 완결하세요. 절대 중간에 끊기지 않도록 하세요.
- 마지막은 반드시 축복 마무리 문장으로 끝내세요 (예: "당신의 여정을 응원합니다.")
- 감동적 대화체, 적절한 줄바꿈, 이모티콘 활용

[사용자 정보]
이름: ${userName || '명심가'}님
사주: ${sajuText || '분석 중'}
공망: ${gongWang && gongWang.length > 0 ? gongWang.join(', ') : '없음'}

[선택 지표]
유형: ${indicatorType} (${indicatorType === 'talent' ? '천부 재능' : indicatorType === 'powerbase' ? '파워베이스' : '리더십 기질'})
이름: ${indicatorName}
수치: ${indicatorValue || '활성화'}
개념: ${indicatorDesc || '타고난 고유 성정'}

위 정보를 바탕으로 ${userName || '명심가'}님만을 위한 명심코칭 천재성 감동 해설을 작성하세요. 반드시 끝까지 완결하세요.`;

    const model = genAI.getGenerativeModel({ model: modelName });
    
    let responseText = '';
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: attempt === 0 ? 0.7 : 0.5,
        }
      });

      responseText = result.response.text();
      
      if (isResponseComplete(responseText) && responseText.length > 200) {
        break;
      }
      
      console.warn(`Genius Docent attempt ${attempt + 1}: Response may be incomplete (${responseText.length} chars)`);
      
      if (attempt === maxRetries) {
        if (responseText.length > 100 && !isResponseComplete(responseText)) {
          responseText += '\n\n✨ 당신의 내면에 잠든 빛이 깨어나는 그 여정을, 명심코칭이 늘 응원하고 축복합니다.';
        }
      }
    }

    return NextResponse.json({
      success: true,
      interpretation: responseText
    });

  } catch (error: any) {
    console.error('Genius Docent API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI 천재성 도슨트 해설을 생성하는 중에 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
