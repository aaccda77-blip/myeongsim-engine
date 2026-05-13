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
    const { sajuData, clientDate, harmony, biorhythm } = body; // ✅ 바이오리듬 추가 수신

    // ── 서버사이드 사주 계산 ─────────────────
    const neural = calculateNeuralCode(sajuData);
    debugNeuralCode = neural.pillars;

    // ── 클라이언트 날짜 기준 세운·월운·일진 계산 ─
    const { yearGanZhi, monthGanZhi, dayGanZhi } = getTodayUngi(clientDate);

    // ── 10성 기반 모듈식 강제 지침 세팅 ────────
    const tenGod = harmony?.tenGod || '비견';
    
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
        shiftContext: '사이드 프로젝트를 멈추고 현재 통제 가능한 단 하나의 명확한 타겟에만 집중(정밀 타격)하라는 3가지 액션 플랜 제시.'
      },
      '정재': {
        theme: '디테일 강박에 의한 메인 프로세스 지연 (System Freezing)',
        instruction: '오늘은 1%의 사소한 결함에 집착하다가 정작 가장 중요한 99%의 메인 일정(데드라인)을 무너뜨리는 병목 현상이 발생할 위험이 높습니다. 마이크로매니징의 비효율성을 경고하세요.',
        shiftContext: '완벽주의 스캐너를 강제 종료하고, 80% 완성 시 무조건 릴리즈하며 큰 그림을 보라는 3가지 액션 플랜 제시.'
      },
      '편관': {
        theme: '감당 불가능한 외부 타격과 데미지 오버로드 (External Attack)',
        instruction: '오늘은 물리적/정신적으로 내가 통제할 수 없는 강력한 압박이나 스트레스(건강 악화, 무리한 책임)가 방화벽을 뚫고 들어올 위험이 높습니다. 억지로 맞서다가는 메인보드가 파손됨을 경고하세요.',
        shiftContext: '정면 승부를 피하고 책임에서 우회하거나 타인에게 SOS(네트워크 연결)를 치는 철저한 생존/방어 위주의 3가지 액션 플랜 제시.'
      },
      '정관': {
        theme: '과도한 규정 집착으로 인한 시스템 경직 (Rigidity)',
        instruction: '오늘은 "남들이 어떻게 볼까", "규칙대로 해야만 한다"는 강박에 얽매여 시스템의 융통성이 완전히 굳어버릴 위험이 높습니다. 체면 차리다 속이 썩어들어가는 교착 상태를 경고하세요.',
        shiftContext: '타인의 시선을 신경 쓰는 프로세스를 강제 종료하고, 매뉴얼을 벗어나 유연성(윤활유)을 발휘하라는 3가지 액션 플랜 제시.'
      },
      '편인': {
        theme: '끝없는 의심과 오버띵킹 루프 (Infinite Negative Loop)',
        instruction: '오늘은 팩트(Data)가 없음에도 상대방의 의도를 넘겨짚거나 비관적인 가상 시나리오를 무한 반복하며 에너지를 낭비할 위험이 높습니다. 스스로 만든 악성 루프의 위험성을 경고하세요.',
        shiftContext: '머릿속 시뮬레이션을 즉시 강제 킬(Kill)하고, 야외 런닝 등 물리적인 신체 활동으로 뇌를 환기하라는 3가지 액션 플랜 제시.'
      },
      '정인': {
        theme: '과도한 수용에 의한 실행 지연 및 무기력증 (Execution Failure)',
        instruction: '오늘은 "아직 준비가 덜 됐다"는 핑계로 계속 정보만 빨아들이고 정작 단 한 줄의 출력(실행)도 하지 않는 나태함과 무기력이 시스템을 지배할 위험이 높습니다. 실행 부재의 치명성을 경고하세요.',
        shiftContext: '추가적인 인풋(정보 수집)을 즉각 차단하고, 아무리 형편없더라도 당장 5분 안에 할 수 있는 아웃풋을 실행하라는 3가지 액션 플랜 제시.'
      }
    };

    const currentModule = TEN_GOD_MODULES[tenGod] || TEN_GOD_MODULES['비견'];

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
- 오늘 일진의 십성(TenGod): ${tenGod}

${biorhythm ? `[내담자 현재 생체 에너지(바이오리듬)]
- 통합 컨디션 점수: ${biorhythm.overallScore} / 100
- 상세 상태: 신체(${biorhythm.physicalLabel}), 감정(${biorhythm.emotionalLabel}), 지성(${biorhythm.intellectualLabel})` : ''}

🔥 [절대 준수 지침: ${tenGod}의 날 특별 모듈] 🔥
오늘의 메인 테마: "${currentModule.theme}"
AI 분석 톤앤매너: ${currentModule.instruction}
Action Plan(Shift) 지침: ${currentModule.shiftContext}

[분석 지침]
다음 구조로 분석하세요. '일진 ${dayGanZhi}의 기운이...'처럼 오늘 일진을 반드시 문장에 녹여내세요.

1. 일진의 천간이 내담자 원국과 어떤 관계인지 분석
2. 일진이 세운(${yearGanZhi})·월운(${monthGanZhi})과 만나 어떤 화학반응을 일으키는지 분석
3. 상관견관, 귀문관살, 원진살 등 구체적 기제를 '최대 2개'만 도출하되, **반드시 위에서 제시된 메인 테마(${tenGod})의 관점에서 사이버펑크 디버깅 뉘앙스로 설명할 것.**
4. narrative는 아래 구조로 핵심만 임팩트 있게 작성 (공백 포함 400~500자 내외):
   - "오늘 일진 ${dayGanZhi}(${tenGod})의 기운이 내담자의 [日干]과 만나..."
   - Scan(현상) → Sync(조화/충돌) → Shift(전략) 구조로 전개하며, 메인 테마를 강렬하게 부각시킬 것.
   ${biorhythm ? `- 🔥 [한계 돌파 융합 분석] narrative의 결론부에는 반드시 내담자의 [생체 에너지 통합 점수(${biorhythm.overallScore}점)]를 언급하며 운(명리)과 신체(바이오리듬)를 융합하여 서술할 것. (예: 압박이 강한 일진이나 생체 에너지가 높으면 "막중한 책임이 떨어졌지만 당신의 빵빵한 생체 에너지가 이를 비웃습니다. 성장을 위한 바벨로 삼으십시오!" 반대로 에너지가 낮으면 "에너지가 고갈된 상태이므로 철저한 방어가 우선입니다" 처럼 초고도화하여 표현)` : ''}
5. shift는 위 [Action Plan 지침]을 철저히 반영하여 3가지 실천 전략 도출

반드시 마크다운 코드블록 없이 JSON 객체 하나만 출력하세요. "{" 로 시작하여 "}" 로 끝낼 것.

{
  "level": "CAUTION",
  "levelLabel": "${tenGod}의 늪 주의",
  "levelEmoji": "⚠️",
  "headline": "[${tenGod}] 일진 ${dayGanZhi}과 내담자 원국 충돌 분석",
  "intro": "오늘 일진 ${dayGanZhi}의 에너지 흐름이 내담자와 만나 [1~2문장 요약]",
  "clashes": [
    {
      "term": "기제명 (예: 상관견관)",
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
