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

// 천간/십성 계산 맵
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEM_ELEMENTS: Record<string, { element: number; yinYang: number }> = {
  '甲': { element: 0, yinYang: 1 }, // 목 +
  '乙': { element: 0, yinYang: 0 }, // 목 -
  '丙': { element: 1, yinYang: 1 }, // 화 +
  '丁': { element: 1, yinYang: 0 }, // 화 -
  '戊': { element: 2, yinYang: 1 }, // 토 +
  '己': { element: 2, yinYang: 0 }, // 토 -
  '庚': { element: 3, yinYang: 1 }, // 금 +
  '辛': { element: 3, yinYang: 0 }, // 금 -
  '壬': { element: 4, yinYang: 1 }, // 수 +
  '癸': { element: 4, yinYang: 0 }, // 수 -
};

const KOR_TO_HANJA: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
};

function normalizeStem(val: any): string {
  if (!val) return '';
  const str = (typeof val === 'object' ? (val.hanja || val.char || val.name || val.stem || '') : String(val)).trim();
  const hanjaMatch = str.match(/[甲乙丙丁戊己庚辛壬癸]/);
  if (hanjaMatch) return hanjaMatch[0];
  const korMatch = str.match(/[갑을병정무기경신임계]/);
  if (korMatch) return KOR_TO_HANJA[korMatch[0]] || '';
  return '';
}

function calculateTenGod(dayMaster: string, todayGan: string): string {
  const dm = STEM_ELEMENTS[dayMaster];
  const tg = STEM_ELEMENTS[todayGan];
  if (!dm || !tg) return '비견';

  const diff = (tg.element - dm.element + 5) % 5;
  const sameYinYang = dm.yinYang === tg.yinYang;

  if (diff === 0) return sameYinYang ? '비견' : '겁재';
  if (diff === 1) return sameYinYang ? '식신' : '상관';
  if (diff === 2) return sameYinYang ? '편재' : '정재';
  if (diff === 3) return sameYinYang ? '편관' : '정관';
  if (diff === 4) return sameYinYang ? '편인' : '정인';
  return '비견';
}

// ─── 서버사이드 만세력 엔진 ───────────────────────────────
function calculateNeuralCode(sajuData: any): {
  pillars: string;
  year: string; month: string; day: string; hour: string;
  dayMaster: string;
} {
  try {
    const { Solar, Lunar } = require('lunar-javascript');

    // 1. 이미 fourPillars 데이터가 존재하는 경우 직접 추출
    const fp = sajuData?.saju?.fourPillars || sajuData?.fourPillars;
    if (fp?.day?.gan) {
      const yrGan = normalizeStem(fp.year?.gan) || '庚';
      const yrJi = (typeof fp.year?.ji === 'object' ? (fp.year?.ji.hanja || fp.year?.ji.char) : fp.year?.ji) || '申';
      const mnGan = normalizeStem(fp.month?.gan) || '癸';
      const mnJi = (typeof fp.month?.ji === 'object' ? (fp.month?.ji.hanja || fp.month?.ji.char) : fp.month?.ji) || '未';
      const dyGan = normalizeStem(fp.day?.gan) || '辛';
      const dyJi = (typeof fp.day?.ji === 'object' ? (fp.day?.ji.hanja || fp.day?.ji.char) : fp.day?.ji) || '巳';
      const hrGan = normalizeStem(fp.time?.gan || fp.hour?.gan) || '乙';
      const hrJi = (typeof (fp.time?.ji || fp.hour?.ji) === 'object' ? ((fp.time?.ji || fp.hour?.ji).hanja || (fp.time?.ji || fp.hour?.ji).char) : (fp.time?.ji || fp.hour?.ji)) || '未';

      const yr = `${yrGan}${yrJi}`;
      const mn = `${mnGan}${mnJi}`;
      const dy = `${dyGan}${dyJi}`;
      const hr = `${hrGan}${hrJi}`;

      return {
        pillars: `年柱:${yr} 月柱:${mn} 日柱:${dy} 時柱:${hr}`,
        year: yr, month: mn, day: dy, hour: hr,
        dayMaster: dyGan
      };
    }

    const birthDate = sajuData?.birthDate || sajuData?.birth_date;
    const birthTime = sajuData?.birthTime || sajuData?.birth_time || '12:00';
    const calendarType = sajuData?.meta?.calendarType || sajuData?.calendar_type || 'solar';
    
    if (!birthDate) {
      const explicitDm = normalizeStem(sajuData?.dayMaster || sajuData?.saju?.dayMaster) || '辛';
      return { 
        pillars: `年柱:庚申 月柱:癸未 日柱:${explicitDm}巳 時柱:乙未`, 
        year: '庚申', month: '癸未', day: `${explicitDm}巳`, hour: '乙未',
        dayMaster: explicitDm
      };
    }

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
    const dm = dy.slice(0, 1);
    return {
      pillars: `年柱:${yr} 月柱:${mn} 日柱:${dy} 時柱:${hr}`,
      year: yr, month: mn, day: dy, hour: hr,
      dayMaster: dm
    };
  } catch (e: any) {
    return { 
      pillars: '年柱:庚申 月柱:癸未 日柱:辛巳 時柱:乙未', 
      year: '庚申', month: '癸未', day: '辛巳', hour: '乙未',
      dayMaster: '辛'
    };
  }
}

// ─── 오늘의 운기(세운·월운·일진) 계산 ─────────────────────
function getTodayUngi(clientDate?: string): { yearGanZhi: string; monthGanZhi: string; dayGanZhi: string; todayGan: string } {
  try {
    const { Solar } = require('lunar-javascript');
    
    let year: number, month: number, day: number;
    
    if (clientDate) {
      [year, month, day] = clientDate.split('-').map(Number);
    } else {
      const now = new Date();
      const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      year = kst.getUTCFullYear();
      month = kst.getUTCMonth() + 1;
      day = kst.getUTCDate();
    }
    
    const today = Solar.fromYmd(year, month, day);
    const lunar = today.getLunar();
    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const todayGan = dayGanZhi.slice(0, 1);

    return {
      yearGanZhi,
      monthGanZhi,
      dayGanZhi,
      todayGan
    };
  } catch (e: any) {
    return { yearGanZhi: '丙午', monthGanZhi: '庚辰', dayGanZhi: '癸卯', todayGan: '癸' };
  }
}

export async function POST(req: NextRequest) {
  let latestRawText = '';
  let debugNeuralCode = '';

  try {
    const body = await req.json();
    const { sajuData, clientDate, harmony, biorhythm } = body;

    // ── 서버사이드 사주 계산 ─────────────────
    const neural = calculateNeuralCode(sajuData);
    debugNeuralCode = neural.pillars;

    // 내담자 일간 확정
    const clientDayMaster = normalizeStem(body.dayMaster || harmony?.userDayMaster || sajuData?.dayMaster || sajuData?.saju?.dayMaster) || neural.dayMaster || '辛';

    // ── 클라이언트 날짜 기준 세운·월운·일진 계산 ─
    const { yearGanZhi, monthGanZhi, dayGanZhi, todayGan } = getTodayUngi(clientDate);

    // ── 십성 정확 연산 ────────
    const tenGod = calculateTenGod(clientDayMaster, todayGan);
    
    const TEN_GOD_MODULES: Record<string, { theme: string, instruction: string, shiftContext: string }> = {
      '비견': {
        theme: '독단적 실행에 의한 네트워크 고립 (Standalone Error)',
        instruction: '오늘은 "내가 맞고, 내 방식대로 하겠다"는 강한 자아가 발동하여 타인과의 협력을 단절시킬 위험이 높습니다. 시스템이 고립되는 현상(비견의 단점)을 사이버펑크 해킹 용어를 섞어 날카롭게 경고하세요.',
        shiftContext: '독단적인 프로세스를 멈추고 외부 API(타인의 피드백)를 수용할 것을 강력히 권고하는 3가지 액션 플랜 제시.'
      },
      '겁재': {
        theme: '과도한 경쟁심에 의한 리소스 소모 및 탈취 (Resource Hijacking)',
        instruction: '오늘은 타인의 성과를 질투하거나 불필요한 경쟁심이 발동하여 귀중한 멘탈/물리적 리소스가 소모될 위험이 높습니다. 불필요한 치킨게임으로 인한 코어 자산 손실을 경고하세요.',
        shiftContext: '타인과의 비교 프로세스를 당장 Kill하고 오직 자신의 로컬 데이터(본연의 목표)에만 100% 집중하라는 3가지 액션 플랜 제시.'
      },
      '식신': {
        theme: '통제 불능의 과잉 출력과 메모리 방전 (Battery Depletion)',
        instruction: '오늘은 이것저것 하고 싶은 것이 많고 열정이 앞서, 시스템의 한계(체력/시간)를 무시하고 무한 출력하다가 급격히 방전될 위험이 높습니다. 브레이크 고장난 과부하 상태를 경고하세요.',
        shiftContext: '멀티태스킹 스레드를 줄이고 잘 먹고 잘 쉬는(물리적 쿨링) 것에 집중하여 시스템 방전을 막는 3가지 액션 플랜 제시.'
      },
      '상관': {
        theme: '기존 규칙 파괴 및 권위에 대한 도발 (Jailbreak Attempt)',
        instruction: '오늘은 상사의 지시나 사회적 규칙을 거추장스럽게 여기고 날카로운 언어(출력)로 들이받고 싶은 강한 탈옥 충동이 생깁니다. 팩트 폭력이 가져올 치명적인 권한 박탈(불이익)을 경고하세요.',
        shiftContext: '입 밖으로 나가는 파괴적 언어 포트를 즉시 차단하고, 비판적 시각을 문서 기획으로 치환하라는 3가지 액션 플랜 제시.'
      },
      '편재': {
        theme: '용량 초과의 페이로드 탑재 및 통제력 상실 (Payload Too Large)',
        instruction: '오늘은 판을 너무 크게 벌리거나, 동시에 통제할 수 없는 많은 일을 한꺼번에 시도하다가 퀄리티 폭락과 함께 시스템 셧다운이 올 위험이 높습니다. 과시적 확장의 위험성을 경고하세요.',
        shiftContext: '불필요한 욕심과 잔가지를 쳐내고, 단 1개의 핵심 타깃에만 집중하여 통제권을 회복하는 3가지 액션 플랜 제시.'
      },
      '정재': {
        theme: '극단적 마이크로 매니징과 디테일 강박 (Stack Overflow)',
        instruction: '오늘은 사소한 숫자나 디테일에 지나치게 집착하여 큰 그림을 보지 못하고 시간과 에너지를 허비할 위험이 높습니다. 완벽주의라는 덫에 갇힌 시스템 병목을 경고하세요.',
        shiftContext: '80% 완성도에서 실행으로 넘어가는 빠른 릴리즈 마인드셋을 갖추라는 3가지 액션 플랜 제시.'
      },
      '편관': {
        theme: '외부 악성 패킷의 맹공과 코어 크래시 (DDoS Attack)',
        instruction: '오늘은 감당하기 힘든 무거운 책임, 상사의 압박, 돌발 위기가 한꺼번에 쏟아져 들어와 멘탈 방화벽이 붕괴될 위험이 높습니다. 코어 시스템 보호를 최우선으로 경고하세요.',
        shiftContext: '스스로를 자책하지 말고, 외부 요청의 우선순위를 재조정하여 방어벽을 세우는 3가지 액션 플랜 제시.'
      },
      '정관': {
        theme: '사회적 시선에 갇힌 자기 검열과 병목 (Firewall Stagnation)',
        instruction: '오늘은 체면, 규범, 타인의 평가를 너무 의식하여 당연히 해야 할 시도조차 검열하고 스스로를 질식시킬 위험이 높습니다. 답답한 원칙주의의 한계를 경고하세요.',
        shiftContext: '타인의 시선이라는 방화벽 규칙을 일시 완화하고, 유연하게 우회로를 찾는 3가지 액션 플랜 제시.'
      },
      '편인': {
        theme: '끝없는 의심과 오버씽킹 루프 (Infinite Loop)',
        instruction: '오늘은 일어나지도 않은 최악의 시나리오를 머릿속으로 수천 번 시뮬레이션하며 불필요한 불안과 의심의 무한 루프에 빠질 위험이 높습니다. 뇌의 가상 시뮬레이션 과부하를 경고하세요.',
        shiftContext: '머릿속 시뮬레이션을 즉시 중단하고, 산책이나 청소 등 신체 감각을 깨워 루프를 탈출하는 3가지 액션 플랜 제시.'
      },
      '정인': {
        theme: '과도한 정보 수용과 실행 지연 (Input Buffer Overflow)',
        instruction: '오늘은 배움과 공부라는 핑계 뒤로 숨어, 실제 필드 실행을 무한히 미루며 안락함에 안주할 위험이 높습니다. 지식의 과잉 축적으로 인한 소화불량 상태를 경고하세요.',
        shiftContext: '인풋(공부/자료조사)을 즉각 셧다운하고, 단 1줄이라도 아웃풋(글/실행/전화)을 내라는 3가지 액션 플랜 제시.'
      }
    };

    const currentModule = TEN_GOD_MODULES[tenGod] || TEN_GOD_MODULES['비견'];

    const model = google.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.75, maxOutputTokens: 3500 },
    });

    const prompt = `당신은 명심코칭의 수석 명리 분석가입니다. 아래 4개의 운기 데이터를 정밀하게 분석하세요.

[내담자 사주 원국]
${neural.pillars}
⚠️ 순서 주의: 年柱→月柱→日柱→時柱 순서입니다.
⚠️ 내담자의 일간(Day Master)은 반드시 [ ${clientDayMaster} ] 일간입니다! 절대 다른 일간(甲 등)으로 분석하지 마세요!

[오늘의 4단계 운기]
- 세운(년운): ${yearGanZhi}년
- 월운: ${monthGanZhi}월
- 일진: ${dayGanZhi}일 (오늘의 일진 천간: ${todayGan})
- 내담자 일간: ${clientDayMaster} (${clientDayMaster}일간)
- 오늘 일진의 십성(TenGod): ${tenGod} (내담자 ${clientDayMaster} 기준 오늘 ${todayGan}는 ${tenGod})

${biorhythm ? `[내담자 현재 생체 에너지(바이오리듬)]
- 통합 컨디션 점수: ${biorhythm.overallScore} / 100
- 상세 상태: 신체(${biorhythm.physicalLabel}), 감정(${biorhythm.emotionalLabel}), 지성(${biorhythm.intellectualLabel})` : ''}

🔥 [절대 준수 지침: ${tenGod}의 날 특별 모듈] 🔥
오늘의 메인 테마: "${currentModule.theme}"
AI 분석 톤앤매너: ${currentModule.instruction}
Action Plan(Shift) 지침: ${currentModule.shiftContext}

[분석 지침]
다음 구조로 분석하세요. '오늘 일진 ${dayGanZhi}의 ${tenGod} 기운이 내담자의 ${clientDayMaster}일간과 만나...'처럼 오늘 일진과 내담자의 정확한 일간(${clientDayMaster})을 반드시 문장에 일치시키세요.

1. 일진의 천간(${todayGan})이 내담자 일간(${clientDayMaster}) 및 원국과 어떤 관계인지 분석
2. 일진이 세운(${yearGanZhi})·월운(${monthGanZhi})과 만나 어떤 화학반응을 일으키는지 분석
3. 상관견관, 군겁쟁재, 식신제살 등 구체적 기제를 '최대 2개'만 도출하되, **반드시 위에서 제시된 메인 테마(${tenGod})의 관점에서 사이버펑크 디버깅 뉘앙스로 설명할 것.**
4. narrative는 아래 구조로 핵심만 임팩트 있게 작성 (공백 포함 400~500자 내외):
   - "오늘 일진 ${dayGanZhi}(${tenGod})의 기운이 내담자의 [${clientDayMaster}일간]과 만나..."
   - Scan(현상) → Sync(조화/충돌) → Shift(전략) 구조로 전개하며, 메인 테마를 강렬하게 부각시킬 것.
   ${biorhythm ? `- 🔥 [한계 돌파 융합 분석] narrative의 결론부에는 반드시 내담자의 [생체 에너지 통합 점수(${biorhythm.overallScore}점)]를 언급하며 운(명리)과 신체(바이오리듬)를 융합하여 서술할 것.` : ''}
5. shift는 위 [Action Plan 지침]을 철저히 반영하여 3가지 실천 전략 도출

반드시 마크다운 코드블록 없이 JSON 객체 하나만 출력하세요. "{" 로 시작하여 "}" 로 끝낼 것.

{
  "level": "CAUTION",
  "levelLabel": "${tenGod}의 늪 주의",
  "levelEmoji": "⚠️",
  "headline": "[${tenGod}] 일진 ${dayGanZhi}과 내담자(${clientDayMaster}) 원국 충돌 분석",
  "intro": "오늘 일진 ${dayGanZhi}의 에너지 흐름이 내담자(${clientDayMaster})와 만나 [1~2문장 요약]",
  "clashes": [
    {
      "term": "기제명 (예: 식신생재 / 인극식)",
      "title": "현상 제목 (해킹/시스템 에러 컨셉 섞기)",
      "logic": "명리 로직 (1문장)",
      "reality": "현실적 현상 (1문장)",
      "deepExplanation": "심층 해설 (1문장)"
    }
  ],
  "narrative": "Scan→Sync→Shift 구조의 400자 내외 상세 내러티브. 사이버펑크 명리학자 톤앤매너.",
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
