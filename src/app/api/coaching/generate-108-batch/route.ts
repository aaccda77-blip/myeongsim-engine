/**
 * ===============================================================
 * 🌸 108 자각 백서 배치(Batch) AI 생성 API
 * API Route: /api/coaching/generate-108-batch/route.ts
 * 한 번의 호출로 여러 페이지를 한꺼번에 초개인화 생성
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel 타임아웃 60초

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pages, sajuData } = body;
    // pages: Array<{ pageKey: string, title: string, desc: string, socratic: string, recursive: string }>

    if (!pages || !Array.isArray(pages) || pages.length === 0 || !sajuData) {
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
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
    });

    // 사주 4기둥 완전 분석 데이터 구성
    const fp = sajuData.fourPillars || {};
    const getGanJi = (pillar: any) => {
      if (!pillar) return '?/?';
      const gan = pillar.gan || pillar.ganKor || '?';
      const ji = pillar.ji || pillar.jiKor || '?';
      return `${gan}${ji}`;
    };

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
- 년주: ${getGanJi(fp.year)} | 월주: ${getGanJi(fp.month)} | 일주: ${getGanJi(fp.day)} 🌟 | 시주: ${getGanJi(fp.time)}
## 일간(Day Master): ${sajuData.dayMaster || '알 수 없음'}
## 십신 분포: 비겁(${tg.self || 0}) | 식상(${tg.output || 0}) | 재성(${tg.wealth || 0}) | 관성(${tg.power || 0}) | 인성(${tg.resource || 0})
## 십신 심리 해석: ${tenGodAnalysis.join(' / ')}
## 오행: 목(${el.wood || 0}) 화(${el.fire || 0}) 토(${el.earth || 0}) 금(${el.metal || 0}) 수(${el.water || 0})
## 대운: ${sajuData.currentDaewoon || '정보 없음'} | 세운: ${sajuData.currentSeun || '정보 없음'}
    `.trim();

    // 페이지 목록을 프롬프트에 포함
    const pagesPrompt = pages.map((p: any, i: number) => `
[PAGE ${i + 1}: ${p.pageKey}]
- 원래 제목: ${p.title}
- 원래 설명: ${(p.desc || '').substring(0, 200)}...
- 원래 질문: ${p.socratic}
- 원래 확약문: ${p.recursive}
`).join('\n');

    const prompt = `
당신은 명심코칭의 수석 AI 무의식 디버깅 및 명리 치유 전문가입니다.
아래 내담자의 사주 기질 데이터를 바탕으로, ${pages.length}개의 108 자각 백서 페이지를 한꺼번에 내담자 맞춤형으로 재집필해 주세요.

[내담자 사주 기질 데이터]
${sajuBrief}

${pagesPrompt}

[초개인화 재집필 지침]
1. 년주·월주·일주·시주 사기둥 전체를 반영하세요. 일간만 보는 얕은 분석 금지.
2. 십신의 과다/부재 심리를 따뜻한 은유로 녹여 넣으세요.
3. 오행 균형/불균형을 반영하여 부족한 기운을 치유적으로 채워주세요.
4. 각 페이지마다 고유한 심리/뇌과학 치유 테마를 살리되 사주 기질과 유기적으로 결합하세요.
5. 다정하고 격조 높은 힐링 톤앤매너를 유지하세요.
6. desc는 200~350자 내외로 작성하세요.

⚠️ 반드시 JSON 배열만 출력하세요. "[" 로 시작하여 "]" 로 끝낼 것. 마크다운이나 코드블록 금지.

[
  {"pageKey": "${pages[0]?.pageKey}", "title": "맞춤형 제목", "desc": "맞춤형 설명", "socratic": "맞춤형 질문", "recursive": "맞춤형 확약문"},
  ...
]
`.trim();

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('AI 응답 없음');
    }

    // JSON 배열 파싱
    const arrStart = rawText.indexOf('[');
    const arrEnd = rawText.lastIndexOf(']');
    if (arrStart === -1 || arrEnd === -1) throw new Error('JSON 배열 파싱 실패');

    const parsedArray = JSON.parse(rawText.substring(arrStart, arrEnd + 1));
    
    // 결과를 pageKey 기준 객체로 변환
    const results: Record<string, any> = {};
    for (const item of parsedArray) {
      if (item.pageKey) {
        results[item.pageKey] = {
          title: item.title,
          desc: item.desc,
          socratic: item.socratic,
          recursive: item.recursive
        };
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('generate-108-batch API Error:', error);
    return NextResponse.json({
      error: error?.message || '배치 AI 생성 중 오류 발생',
    }, { status: 500 });
  }
}
