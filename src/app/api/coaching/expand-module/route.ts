/**
 * 🔍 모듈 상세 확장 API
 * 10개 모듈 중 하나를 클릭했을 때, 해당 모듈만 상세하게 풀어서 설명
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moduleType, shortContent, pageTitle, sajuProfile } = body;

    if (!moduleType || !shortContent) {
      return NextResponse.json({ error: '필수 데이터 누락' }, { status: 400 });
    }

    const sp = sajuProfile || {};

    const moduleLabels: Record<string, string> = {
      sajuAnalysis: '사주 기질 분석 — 내 사주가 이 주제에 미치는 영향',
      darkCodeCbt: '다크코드 (CBT 인지행동치료) — 생각의 함정 해체',
      metaCodeAct: '메타코드 (ACT 수용전념치료) — 기질을 강점으로 전환',
      neuralCodeDbt: '뉴럴코드 (DBT 변증법적 행동치료) — 위기 시 행동 처방전',
      socraticMbct: '마음챙김 자각 (MBCT 마음챙김 인지치료) — 내면 성찰 질문',
      relaxMbsr: '스트레스 이완 (MBSR 스트레스 감소) — 이완 실천법',
      selfCompassionMsc: '자기연민 (MSC 마음챙김 자기연민) — 나를 따뜻하게 안아주기',
      coachingSolution: '코칭 솔루션 — 오늘부터 실천할 행동 과제',
      mantra: '만트라 확언 — 평생 꺼내 읽는 확언문'
    };

    const moduleLabel = moduleLabels[moduleType] || moduleType;

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
        maxOutputTokens: 2048,
        // @ts-ignore
        thinkingConfig: { thinkingBudget: 512 }
      },
    });

    const prompt = `
당신은 명심코칭의 AI 심리 치유 전문가예요.
아래 짧은 요약을 바탕으로, 초보자도 100% 이해할 수 있도록 아주 상세하고 친절하며 감동적으로 풀어서 설명해 주세요.

[내담자 정보]
- 일간: ${sp.dayMasterChar || '알 수 없음'}
- 일간 은유: "${sp.dayMasterAnalogy || '알 수 없음'}"

[페이지 주제]
${pageTitle || '자기 이해'}

[모듈 종류]
${moduleLabel}

[요약 내용]
"${shortContent}"

[작성 규칙]
1. "~해요", "~거예요", "~죠" 같은 다정하고 따뜻한 친구 말투로 써주세요.
2. 전문 용어를 쓸 때는 반드시 쉬운 말로 풀어서 설명해 주세요. 예: "인지 왜곡(쉽게 말해, 생각의 함정이에요)"
3. 구체적인 예시를 들어주세요. 일상에서 겪을 수 있는 상황을 예로 들면 더 좋아요.
4. 읽는 사람이 위로받고 감동받을 수 있도록 시적이고 따뜻한 이야기체로 써주세요.
5. 300~500자로 충분히 상세하게 써주세요.
6. 마지막에는 따뜻한 응원의 말 한마디를 꼭 넣어주세요.

마크다운이나 JSON 없이, 순수한 텍스트로만 답변해 주세요.
`.trim();

    const result = await model.generateContent(prompt);
    const response = result.response;
    const detailedText = response.text();

    return NextResponse.json({
      success: true,
      detail: detailedText
    });

  } catch (error: any) {
    console.error('expand-module API Error:', error);
    return NextResponse.json({
      error: error?.message || '상세 설명 생성 중 오류',
    }, { status: 500 });
  }
}
