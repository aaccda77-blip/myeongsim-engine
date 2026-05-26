/**
 * ===============================================================
 * 🌸 108 자각 백서 실시간 AI 개인화 생성 API
 * API Route: /api/coaching/generate-108/route.ts
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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
    const { pageKey, sajuData, originalPage } = body;

    if (!pageKey || !sajuData || !originalPage) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
    });

    // 사용자의 사주 정보를 텍스트 포맷으로 보기 좋게 정리
    const sajuBrief = `
- 일간(Day Master): ${sajuData.dayMaster || '알 수 없음'}
- 사주 십신 분포: 비겁(${sajuData.tenGods?.self || 0}), 식상(${sajuData.tenGods?.output || 0}), 재성(${sajuData.tenGods?.wealth || 0}), 관성(${sajuData.tenGods?.power || 0}), 인성(${sajuData.tenGods?.resource || 0})
- 현재 대운: ${sajuData.currentDaewoon || '황금 대운'}
- 사주 오행 점수: 목(Wood:${sajuData.ohaeng?.wood || 0}), 화(Fire:${sajuData.ohaeng?.fire || 0}), 토(Earth:${sajuData.ohaeng?.earth || 0}), 금(Metal:${sajuData.ohaeng?.metal || 0}), 수(Water:${sajuData.ohaeng?.water || 0})
    `.trim();

    const prompt = `
당신은 명심코칭의 수석 AI 무의식 디버깅 및 명리 치유 전문가입니다. 
당신의 임무는 아래 제공된 **내담자 사주 기질 데이터**를 바탕으로, **108 자각 백서의 특정 페이지 콘텐츠**를 내담자만을 위한 1대1 완전히 개인화된 맞춤형 힐링 스토리라인으로 새롭게 재작성하는 것입니다.

[내담자 사주 기질 데이터]
${sajuBrief}

[해당 페이지 원래 치유 컨셉 가이드]
- 페이지 코드: ${pageKey}
- 원래 제목: ${originalPage.title}
- 원래 설명: ${originalPage.desc}
- 원래 성찰 질문: ${originalPage.socratic}
- 원래 무한 확약문: ${originalPage.recursive}

[초개인화 재집필 지침]
1. **내용의 완전한 1대1 재구성**: 단순히 단어 몇 개를 치환하는 것에 절대 만족하지 마세요. 내담자의 사주 일간(예: 갑목이면 나무의 기질, 임수면 바다의 기질 등)과 십신 분포의 과다/결핍적 특성(예: 비겁이 많으면 경쟁심 디버깅, 관성이 많으면 압박감 극복)을 읽고, 이 페이지가 가진 근본적인 심리/뇌과학 치유 테마와 유기적으로 결합하여 **설명(desc) 텍스트를 통째로 부드럽고 다정하게 새롭게 재작술(Rewriting)** 하세요.
2. **다정한 톤앤매너**: 내담자를 지극히 아끼고 어루만지는 따뜻하고 격조 높은 힐링 톤앤매너를 시종일관 강하게 유지하세요.
3. **소크라테스 질문 및 확약문 최적화**: 
   - 'socratic'(질문)은 내담자가 자신의 사주 기질적 한계(예: 완벽주의, 조바심, 분노 센서 등)를 깨닫고 스스로 답해볼 수 있는 매우 다정하고 예리한 심리학적 거울 형태의 질문으로 고도화하세요.
   - 'recursive'(참나 확약문)는 뇌 신경망에 깊은 평온을 인가할 수 있는, 시적이고 장엄하며 따스한 우주적 안식의 확약문으로 작성하세요.

반드시 다른 군더더기 텍스트나 마크다운 코드블록(\`\`\`) 없이 오직 JSON 객체 하나만 출력하세요. "{" 로 시작하여 "}" 로 끝낼 것.

{
  "title": "새롭게 작명된 내담자 맞춤형 제목",
  "desc": "내담자의 사주 기질에 딱 맞춰 새롭게 재집필된 300~400자 내외의 감동적인 치유 및 뇌과학 융합 설명문",
  "socratic": "내담자 맞춤형 심리학적 자각 거울 질문",
  "recursive": "내담자 맞춤형 뇌 신경망 수랭 이완 확약문"
}
`.trim();

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
      pageData
    });

  } catch (error: any) {
    console.error('generate-108 API Error:', error);
    return NextResponse.json({
      error: error?.message || '실시간 AI 생성 중 오류 발생',
      details: latestRawText || 'No Output'
    }, { status: 500 });
  }
}
