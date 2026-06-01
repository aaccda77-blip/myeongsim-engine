import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { problem } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: 'Problem text is required' }, { status: 400 });
    }

    const prompt = `당신은 최상위 5D 의식 디버깅 및 심리 치유 마스터 '명심 코치'입니다.
사용자가 자신의 무기력함이나 부정적인 감정(다크 코드)을 입력했습니다.
다음 5대 심리 기법(CBT, DBT, ACT, MBCT, MBSR)을 완벽히 융합하여, 입력된 고민에 맞게 아래의 포맷을 정확히 유지하면서 각 항목의 텍스트를 작성해 주세요. 
반드시 각 항목은 사용자의 특정 상황을 깊게 위로하고 치유하는 통찰(Insight)을 담아야 합니다. 어투는 단호하면서도 매우 따뜻하고 감동적이어야 합니다. 

사용자의 고민: "${problem}"

응답 형식 (JSON):
- sourceCode (내면의 소스코드): 사용자의 고민 기저에 깔린 핵심 신념(CBT)과 왜곡, 과각성(MBSR), 파국적 시나리오(MBCT) 등을 해부하듯 분석. (약 3~4문장)
- projectedReality (투사된 현실): 이 다크 코드가 사용자의 일상에서 어떻게 '결핍의 주파수'를 방출하고 현실을 왜곡하여 고통을 가중시키고 있는지 설명. (약 3~4문장)
- myeongsimCoaching (명심 코칭 풀이): 이 고통의 진짜 원인은 에러가 아니라, 오히려 내면의 선한 의도나 한계를 지닌 인간성에서 기인함을 밝히며, 이를 전면적으로 수용(DBT)하고 지혜로운 마음을 회복하도록 돕는 따뜻한 통찰. (약 4~5문장, 두 문단 정도로 분리 가능하도록 줄바꿈 사용)
- socratesQuestion (소크라테스 문답): 사용자가 객관화할 수 있도록 던지는 날카로우면서도 통찰력 있는 질문. (약 2문장)
- recursiveQuestion (재귀적 질문): 언제부터 이 악성 코드가 시작되었는지 성찰하게 하는 질문. (약 2문장)
- step1 (메타 인지): 능력이 부족하거나 감정이 휘몰아치는 상황을 판단 없이 관찰(MBSR)하도록 하는 첫 번째 실천 행동 가이드. (약 3문장)
- step2 (알아차림의 알아차림): 텅 빈 자각 자체에 머무르도록 이끄는 두 번째 차원 상승 가이드. (약 3문장)
- zeroPointSolutions (배열, 크기 4): [수용], [현재 앵커링], [클린 코드 입력], [전념 행동] 이라는 제목(title)과 함께 각각의 행동 지침(text)을 구체적으로 제공.

참고: 생성되는 텍스트 안에서 각 심리기법의 주요 용어(예: CBT, DBT, ACT, MBCT, MBSR, 핵심 신념, 파국화, 경험 회피 등)를 적절히 활용하여 전문성을 강조하세요.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON 파싱
    const debuggingData = JSON.parse(responseText);

    return NextResponse.json({ success: true, data: debuggingData });

  } catch (error: any) {
    console.error('[Mind Reset API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
