import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  let latestRawText = '';

  try {
    const body = await req.json();
    const { bugInput } = body;

    console.log(`\n🔍 [mind-reset] ===== 마음 리셋 생성 요청 =====`);
    console.log(`📋 사용자 입력(Bug): "${bugInput}"`);

    if (!bugInput) {
      return NextResponse.json({ error: '입력된 감정/생각이 없습니다.' }, { status: 400 });
    }

    const jsonSchema: any = {
      type: SchemaType.OBJECT,
      properties: {
        innerCode: { type: SchemaType.STRING, description: "Phase 1: 내면의 소스코드 (사용자의 입력이 어떤 심리적 버그로 인해 발생했는지 진단)" },
        projectedReality: { type: SchemaType.STRING, description: "Phase 2: 투사된 현실 (버그로 인해 세상이 어떻게 왜곡되어 보이는지 설명)" },
        coachingSolution: { type: SchemaType.STRING, description: "Phase 3: 명심 코칭 풀이 (버그를 해제하는 따뜻한 관점 전환)" },
        socraticQuestion: { type: SchemaType.STRING, description: "Phase 4: 소크라테스 문답 (스스로 객관화할 수 있는 질문)" },
        recursiveQuestion: { type: SchemaType.STRING, description: "Phase 5: 재귀적 질문 (이 패턴이 과거 어디서부터 시작되었는지 묻는 질문)" },
        metaCognition: { type: SchemaType.STRING, description: "STEP 1: 메타 인지 (감정을 객관적으로 관찰하는 방법)" },
        pureAwareness: { type: SchemaType.STRING, description: "STEP 2: 알아차림의 알아차림 (텅 빈 배경, 순수 자각으로의 초대)" },
        zeroPointList: { 
          type: SchemaType.ARRAY, 
          description: "Zero Point 솔루션 4단계 (수용, 현재 앵커링, 클린 코드 입력, 전념 행동)",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              text: { type: SchemaType.STRING }
            },
            required: ["title", "text"]
          }
        },
        zeroPointEnding: { type: SchemaType.STRING, description: "마지막 감동적인 맺음말" }
      },
      required: ["innerCode", "projectedReality", "coachingSolution", "socraticQuestion", "recursiveQuestion", "metaCognition", "pureAwareness", "zeroPointList", "zeroPointEnding"]
    };

    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { 
        temperature: 0.85, 
        maxOutputTokens: 3000,
        responseMimeType: "application/json",
        responseSchema: jsonSchema
      },
    });

    const prompt = `
당신은 세계 최고의 디지털 치료제(DTx) AI, '소버린 마인드 리셋'의 핵심 엔진입니다.
사용자가 자신의 무력감, 고통, 혹은 부정적인 생각(심리적 다크 코드)을 입력했습니다.

사용자 입력: "${bugInput}"

이 입력을 바탕으로, CBT(인지행동치료), DBT(변증법적 행동치료), ACT(수용전념치료), MBCT(마음챙김 인지치료), MBSR(마음챙김 기반 스트레스 감소), 그리고 MSC(마음챙김 자기연민) 6가지 심리 기법을 모두 융합하여 완벽하게 개인화된 치유의 여정을 작성하세요.
초보자도 100% 이해하기 쉽도록 극도로 친절하고, 눈물이 날 만큼 따뜻하며 감동적인 '초고도화된 디지털 치료제'의 최고봉 수준으로 작성해야 합니다.

작성 지침:
1. 중요한 심리학적 기법명이나 핵심 키워드(예: [CBT: 인지적 융합], [MSC: 자기연민])를 강조할 때는 반드시 HTML <strong> 태그를 사용하세요. (예: <strong>[MSC: 자기연민]</strong>)
2. 줄바꿈이 필요한 곳은 <br/> 태그를 사용하세요.
3. 각 섹션의 분위기:
   - innerCode (내면의 소스코드): 사용자의 아픔을 시스템 버그로 은유하며 분석.
   - projectedReality (투사된 현실): 아픔으로 인해 왜곡된 세상을 묘사.
   - coachingSolution (명심 코칭 풀이): 다정하게 오해를 풀어주는 해결책 (MSC, CBT 활용).
   - socraticQuestion (소크라테스 문답): 객관화 및 효용성을 묻는 뼈때리면서도 따뜻한 질문.
   - recursiveQuestion (재귀적 질문): 언제부터 이 상처가 시작되었는지 내면 아이를 안아주는 질문.
   - metaCognition (메타 인지): 감정에 매몰되지 않고 한 발짝 떨어져 관찰하는 법 (MBSR 활용).
   - pureAwareness (순수 자각): 거대한 우주나 바다 같은 알아차림 속으로 초대 (ACT, MBCT 활용).
   - zeroPointList: 4개의 솔루션 (수용, 현재 앵커링, 클린 코드 입력, 전념 행동).
   - zeroPointEnding: 눈물이 날 만큼 따뜻하고 희망찬 맺음말.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    latestRawText = response.text();

    if (!latestRawText || latestRawText.trim().length === 0) {
      throw new Error('AI 응답 없음');
    }

    const start = latestRawText.indexOf('{');
    const end = latestRawText.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('JSON 파싱 실패');

    const pageData = JSON.parse(latestRawText.substring(start, end + 1));

    return NextResponse.json({
      success: true,
      data: pageData
    });

  } catch (error: any) {
    console.error('mind-reset API Error:', error);
    return NextResponse.json({
      error: error?.message || '실시간 AI 생성 중 오류 발생',
      details: latestRawText || 'No Output'
    }, { status: 500 });
  }
}
