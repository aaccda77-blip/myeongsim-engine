/**
 * ===============================================================
 * 🔍 Myeongsim Deep Scan AI — 4단계 시스템 충돌 분석 API v3
 * API Route: /api/deep-scan/route.ts
 * ===============================================================
 * [Upgrade v3] 오늘의 일진·월운·세운을 서버에서 자동 계산하여
 * 사주 원국과 4단계 맞물림(원국+세운+월운+일진)을 완전히 분석.
 * ===============================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

// ─── 서버사이드 만세력 엔진 ───────────────────────────────
function calculateNeuralCode(sajuData: any): {
  pillars: string;
  year: string; month: string; day: string; hour: string;
} {
  try {
    const { Solar, Lunar } = require('lunar-javascript');
    const birthDate = sajuData.birthDate || sajuData.birth_date;
    const birthTime = sajuData.birthTime || sajuData.birth_time || '12:00';
    const calendarType = sajuData.meta?.calendarType || sajuData.calendar_type || 'solar';
    if (!birthDate) return { pillars: 'DATA_MISSING', year: '', month: '', day: '', hour: '' };

    const [y, mo, d] = birthDate.split('-').map(Number);
    const [h, m] = birthTime.split(':').map(Number);

    let lunarDate;
    if (calendarType === 'lunar') {
      lunarDate = Lunar.fromYmdHms(y, mo, d, h, m, 0);
    } else {
      lunarDate = Solar.fromYmdHms(y, mo, d, h, m, 0).getLunar();
    }
    const bazi = lunarDate.getEightChar();
    const yr = bazi.getYear();
    const mn = bazi.getMonth();
    const dy = bazi.getDay();
    const hr = bazi.getTime();
    return {
      pillars: `年柱:${yr} 月柱:${mn} 日柱:${dy} 時柱:${hr}`,
      year: yr, month: mn, day: dy, hour: hr,
    };
  } catch (e: any) {
    return { pillars: 'CALC_ERROR: ' + e.message, year: '', month: '', day: '', hour: '' };
  }
}

// ─── 오늘의 운기(세운·월운·일진) 계산 ─────────────────────
// ✅ 클라이언트에서 로컬 날짜를 전달받아 계산 (서버 UTC 시간대 문제 방지)
function getTodayUngi(clientDate?: string): { yearGanZhi: string; monthGanZhi: string; dayGanZhi: string } {
  try {
    const { Solar } = require('lunar-javascript');
    
    let year: number, month: number, day: number;
    
    if (clientDate) {
      // 클라이언트가 보낸 로컬 날짜 사용 (YYYY-MM-DD)
      [year, month, day] = clientDate.split('-').map(Number);
    } else {
      // fallback: KST 기준으로 계산 (UTC+9)
      const now = new Date();
      const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      year = kst.getUTCFullYear();
      month = kst.getUTCMonth() + 1;
      day = kst.getUTCDate();
    }
    
    const today = Solar.fromYmd(year, month, day);
    const lunar = today.getLunar();
    return {
      yearGanZhi: lunar.getYearInGanZhi(),
      monthGanZhi: lunar.getMonthInGanZhi(),
      dayGanZhi: lunar.getDayInGanZhi(),
    };
  } catch (e: any) {
    return { yearGanZhi: '丙午', monthGanZhi: '庚辰', dayGanZhi: '계산오류' };
  }
}


export async function POST(req: NextRequest) {
  let latestRawText = '';
  let debugNeuralCode = '';

  try {
    const body = await req.json();
    const { sajuData, clientDate } = body; // ✅ 클라이언트 로컬 날짜 수신

    // ── 서버사이드 사주 계산 ─────────────────
    const neural = calculateNeuralCode(sajuData);
    debugNeuralCode = neural.pillars;

    // ── 클라이언트 날짜 기준 세운·월운·일진 계산 ─
    const { yearGanZhi, monthGanZhi, dayGanZhi } = getTodayUngi(clientDate);

    const model = google.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.85, maxOutputTokens: 8192 },
    });

    const prompt = `당신은 명심코칭의 수석 명리 분석가입니다. 아래 4개의 운기 데이터를 정밀하게 분석하세요.

[내담자 사주 원국]
${neural.pillars}
⚠️ 순서 주의: 年柱→月柱→日柱→時柱 순서입니다.

[오늘의 4단계 운기]
- 세운(년운): ${yearGanZhi}년
- 월운: ${monthGanZhi}월
- 일진: ${dayGanZhi}일 ← 오늘 하루의 에너지
- 일간(내담자): ${neural.day.slice(0, 1)} (${neural.day})

[분석 지침]
다음 구조로 분석하세요. '일진 ${dayGanZhi}의 기운이...'처럼 오늘 일진을 반드시 문장에 녹여내세요.

1. 일진의 천간이 내담자 원국(특히 일간)과 어떤 관계인지 분석 (합·충·생·극)
2. 일진이 세운(${yearGanZhi})·월운(${monthGanZhi})과 만나 어떤 화학반응을 일으키는지 분석
3. 상관견관, 귀문관살, 원진살, 지망살, 천을귀인 등 구체적 기제를 '최대 2개'만 도출
4. narrative는 아래 구조로 핵심만 임팩트 있게 작성 (공백 포함 400~500자 내외):
   - "오늘 일진 ${dayGanZhi}의 기운이 내담자의 [日干]과 만나 [합/충/생/극]을 형성합니다..."
   - Scan(현상) → Sync(조화/충돌) → Shift(전략) 구조로 전개
5. shift는 오늘 일진을 활용하는 구체적 실천 전략 3가지

반드시 마크다운 코드블록 없이 JSON 객체 하나만 출력하세요. "{" 로 시작하여 "}" 로 끝낼 것.

{
  "level": "CAUTION",
  "levelLabel": "에너지 관리 주의",
  "levelEmoji": "⚠️",
  "headline": "일진 ${dayGanZhi}과 내담자 원국 충돌 분석",
  "intro": "오늘 일진 ${dayGanZhi}의 에너지 흐름이 내담자와 만나 [1~2문장 요약]",
  "clashes": [
    {
      "term": "기제명 (예: 상관견관)",
      "title": "현상 제목",
      "logic": "명리 로직 (1문장)",
      "reality": "현실적 현상 (1문장)",
      "deepExplanation": "심층 해설 (1문장)"
    }
  ],
  "narrative": "Scan→Sync→Shift 구조의 400자 내외 상세 내러티브. 오늘 일진 ${dayGanZhi}을 첫머리에 명시.",
  "shift": "오늘의 3단계 행동 전략"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    latestRawText = response.text();

    if (!latestRawText || latestRawText.trim().length === 0) {
      const blockReason = response.promptFeedback?.blockReason || 'UNKNOWN';
      const finishReason = response.candidates?.[0]?.finishReason || 'UNKNOWN';
      throw new Error(`AI 응답 없음 (blockReason: ${blockReason}, finishReason: ${finishReason})`);
    }

    const start = latestRawText.indexOf('{');
    const end = latestRawText.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('JSON 파싱 실패');

    const report = JSON.parse(latestRawText.substring(start, end + 1));

    // 오늘의 운기 정보도 함께 반환
    return NextResponse.json({
      success: true,
      report,
      todayUngi: { yearGanZhi, monthGanZhi, dayGanZhi },
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error?.message || '분석 중 오류 발생',
      details: latestRawText || 'No Output',
      neuralCode: debugNeuralCode,
    }, { status: 500 });
  }
}
