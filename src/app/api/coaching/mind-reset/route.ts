import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatFriendlyErrorMessage } from '@/utils/errorMessage';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { problem } = await req.json();

    if (!problem) {
      return NextResponse.json({ error: 'Problem text is required' }, { status: 400 });
    }

    const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (isMockMode || !apiKey) {
      console.log("Mock AI Mode enabled, returning customized offline mind-reset debugging.");
      const debuggingData = {
        sourceCode: `입력하신 고민("${problem.slice(0, 30)}...")의 이면에는 '모든 상황을 통제하고 완벽해야만 인정받을 수 있다'는 무의식적 핵심 신념(CBT)이 자리잡고 있습니다. 이는 과거의 상처로부터 자신을 지키려던 방어 기제(MBSR 과각성)가 현재 시점에 과도하게 활성화된 상태입니다.`,
        projectedReality: `이 긴장 상태는 일상에서 사소한 변수에도 쉽게 지치게 만들고, '결핍과 불안'의 렌즈로 현실을 바라보게 합니다. 그 결과 자신과 타인을 향한 지나친 경계심을 형성하며 에너지를 고갈시키고 있습니다.`,
        myeongsimCoaching: `그러나 기억하세요. 이 고통은 당신의 시스템이 고장 난 것이 아니라, 오히려 당신을 보호하려 애쓰던 내면의 다정한 흔적입니다.\n\n이제는 이 긴장을 억압하지 않고 온전히 품어주는 급진적 수용(DBT)을 통해 본래의 맑고 고요한 지혜로운 마음을 회복할 때입니다.`,
        socratesQuestion: "지금 당신을 괴롭히는 이 두려움이 100% 진실이라는 증거가 있는가? 이 생각 없이 당신은 누구인가?",
        recursiveQuestion: "이 방어 기제는 언제 처음 당신을 지켜주기 위해 시작되었으며, 지금도 그것이 유효한가?",
        step1: "올라오는 감정과 신체 감각을 좋고 나쁨의 판단 없이 제3자의 눈으로 3분간 가만히 지켜보세요(MBSR).",
        step2: "생각과 감정이 지나가는 하늘을 알아차리는 텅 빈 공간, 그 순수한 알아차림의 자리에 편안히 머무르세요.",
        zeroPointSolutions: [
          { title: "수용", text: "불안이 올라올 때 '아, 내가 긴장하고 있구나'라며 가만히 숨을 들이쉽니다." },
          { title: "현재 앵커링", text: "발바닥이 바닥에 닿는 감각이나 손끝의 온도에 10초간 주의를 기울입니다." },
          { title: "클린 코드 입력", text: "'나는 안전하며, 지금 이대로도 이미 온전하다'는 새로운 확언을 되뇝니다." },
          { title: "전념 행동", text: "고민 대신 지금 내가 할 수 있는 가장 작은 의미 있는 행동 1가지를 실행합니다." }
        ]
      };

      return NextResponse.json({ success: true, data: debuggingData });
    }

    const prompt = `당신은 명심 코칭의 디버깅 마스터입니다. 사용자의 고민을 분석하여 내면의 소스코드를 디버깅하세요.
사용자 고민: "${problem}"

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
    return NextResponse.json({ success: false, error: formatFriendlyErrorMessage(error) }, { status: 500 });
  }
}
