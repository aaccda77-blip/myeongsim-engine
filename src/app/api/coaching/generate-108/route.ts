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

    // 사용자의 사주 정보를 텍스트 포맷으로 완벽하게 정리 (년월일시 4기둥 포함)
    const fp = sajuData.fourPillars || {};
    const getGanJi = (pillar: any) => {
      if (!pillar) return '?/?';
      const gan = pillar.gan || pillar.ganKor || '?';
      const ji = pillar.ji || pillar.jiKor || '?';
      return `${gan}${ji}`;
    };

    const yearGanJi = getGanJi(fp.year);
    const monthGanJi = getGanJi(fp.month);
    const dayGanJi = getGanJi(fp.day);
    const timeGanJi = getGanJi(fp.time);

    // 십신 분포 해석
    const tg = sajuData.tenGods || {};
    const el = sajuData.elements || {};
    
    const tenGodAnalysis = [];
    if ((tg.self || 0) >= 2) tenGodAnalysis.push('비겁 과다 → 자기주장이 강하고 경쟁심이 높음');
    else if ((tg.self || 0) === 0) tenGodAnalysis.push('비겁 부재 → 자기 지지 기반이 약하여 고독감을 느끼기 쉬움');
    if ((tg.output || 0) >= 2) tenGodAnalysis.push('식상 과다 → 표현력은 풍부하나 에너지 소모가 큼');
    else if ((tg.output || 0) === 0) tenGodAnalysis.push('식상 부재 → 감정 표현과 창의적 배출이 억제되어 있음');
    if ((tg.wealth || 0) >= 2) tenGodAnalysis.push('재성 과다 → 현실 감각은 뛰어나나 과도한 욕심 주의');
    else if ((tg.wealth || 0) === 0) tenGodAnalysis.push('재성 부재 → 현실적 목표 설정과 물질적 안정감이 약함');
    if ((tg.power || 0) >= 2) tenGodAnalysis.push('관성 과다 → 규율과 책임감에 과도한 압박을 느끼기 쉬움');
    else if ((tg.power || 0) === 0) tenGodAnalysis.push('관성 부재 → 외부 통제를 싫어하며 자유분방한 기질');
    if ((tg.resource || 0) >= 2) tenGodAnalysis.push('인성 과다 → 학습과 사색이 깊으나 행동으로 옮기기 어려움');
    else if ((tg.resource || 0) === 0) tenGodAnalysis.push('인성 부재 → 지적 탐구보다 실천 중심의 기질');

    const sajuBrief = `
## 사주 사기둥 (년월일시 완전 공개)
- 년주(年柱): ${yearGanJi} — 조상궁, 사회적 환경, 초년 운
- 월주(月柱): ${monthGanJi} — 부모궁, 성장 환경, 청년 운  
- 일주(日柱): ${dayGanJi} — 본인(가장 중요!), 배우자궁, 중년 운 🌟
- 시주(時柱): ${timeGanJi} — 자녀궁, 말년 운, 잠재력

## 일간(Day Master)
- ${sajuData.dayMaster || '알 수 없음'}

## 십신(十神) 분포 수치
- 비겁(比劫): ${tg.self || 0}개 | 식상(食傷): ${tg.output || 0}개 | 재성(財星): ${tg.wealth || 0}개 | 관성(官星): ${tg.power || 0}개 | 인성(印星): ${tg.resource || 0}개

## 십신 분포 심리 해석
${tenGodAnalysis.length > 0 ? tenGodAnalysis.map(a => `- ${a}`).join('\n') : '- 균형 잡힌 십신 분포'}

## 오행(五行) 점수
- 목(木): ${el.wood || 0} | 화(火): ${el.fire || 0} | 토(土): ${el.earth || 0} | 금(金): ${el.metal || 0} | 수(水): ${el.water || 0}

## 현재 대운 / 세운
- 현재 대운: ${sajuData.currentDaewoon || '정보 없음'}
- 현재 세운: ${sajuData.currentSeun || '정보 없음'}
    `.trim();

    const prompt = `
당신은 명심코칭의 수석 AI 무의식 디버깅 및 명리 치유 전문가입니다. 
당신의 임무는 아래 제공된 **내담자 사주 기질 데이터(년월일시 사기둥 포함)**를 바탕으로, **108 자각 백서의 특정 페이지 콘텐츠**를 내담자만을 위한 1대1 완전히 개인화된 맞춤형 힐링 스토리라인으로 새롭게 재작성하는 것입니다.

[내담자 사주 기질 데이터 - 완전한 사기둥(년월일시) 분석]
${sajuBrief}

[해당 페이지 원래 치유 컨셉 가이드]
- 페이지 코드: ${pageKey}
- 원래 제목: ${originalPage.title}
- 원래 설명: ${originalPage.desc}
- 원래 성찰 질문: ${originalPage.socratic}
- 원래 무한 확약문: ${originalPage.recursive}

[초개인화 재집필 지침 - 초고도화 버전]
1. **년월일시 사기둥 완전 반영**: 내담자의 년주·월주·일주·시주를 모두 읽고, 각 기둥이 상징하는 인생 영역(사회, 가정, 본인, 잠재력)의 특성을 콘텐츠에 녹여 넣으세요. 일주(일간)만 사용하는 얕은 분석을 절대 하지 마세요.
2. **십신 분포의 과다/부재 심리 해석 반영**: 위에 제공된 십신 심리 해석을 반드시 치유 설명문에 자연스럽게 녹여 넣되, "비겁이 0개이므로..." 같은 기계적 표현 대신 "당신 안에는 홀로 서야 하는 고독한 전사의 기질이 있습니다" 같은 따뜻한 은유적 표현을 사용하세요.
3. **오행 균형/불균형 반영**: 어떤 오행이 과다하고 어떤 것이 부족한지 파악하여, 부족한 오행의 기운을 치유적으로 채워주는 방향으로 서술하세요.
4. **다정한 톤앤매너**: 내담자를 지극히 아끼고 어루만지는 따뜻하고 격조 높은 힐링 톤앤매너를 시종일관 강하게 유지하세요.
5. **소크라테스 질문 최적화**: 내담자의 구체적인 십신 특성(예: 관성 과다의 압박감, 식상 부재의 표현 억제)에 기반한 예리하고 다정한 자각 질문을 만드세요.
6. **확약문 최적화**: 뇌 신경망에 깊은 평온을 인가할 수 있는, 시적이고 장엄하며 따스한 우주적 안식의 확약문으로 작성하세요.

⚠️ 중요: 내담자의 실제 사주 데이터에 없는 정보를 지어내지 마세요. 위에 명시된 데이터만 사용하세요.

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
