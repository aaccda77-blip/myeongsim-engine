/**
 * ================================================================
 * 🧠 Daily Training Questions API — 일진 기반 동적 훈련 질문 생성
 * API Route: /api/daily-questions/route.ts
 * ================================================================
 * 오늘의 일진을 계산하고, 해당 일진의 에너지에 맞는
 * 인지 자각 훈련 질문 세트를 AI로 생성합니다.
 * ================================================================
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const google = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

function getTodayUngi(clientDate?: string) {
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
    return {
      yearGanZhi: lunar.getYearInGanZhi(),
      monthGanZhi: lunar.getMonthInGanZhi(),
      dayGanZhi: lunar.getDayInGanZhi(),
    };
  } catch {
    return { yearGanZhi: '丙午', monthGanZhi: '庚辰', dayGanZhi: '乙丑' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sajuData, pillarId, clientDate } = body;

    const { yearGanZhi, monthGanZhi, dayGanZhi } = getTodayUngi(clientDate);
    const dayMaster = sajuData?.dayMaster || '辛';

    const pillarNames: Record<string, string> = {
      vision: '지향점 (목표와 성취 에너지)',
      identity: '핵심 자아 (자존감과 정체성)',
      social: '사회적 환경 (관계와 소통)',
      base: '배경 에너지 (뿌리와 추진력)',
    };
    const pillarName = pillarNames[pillarId] || '종합 에너지';

    const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (isMockMode || !apiKey) {
      console.log("Mock AI Mode enabled, returning customized offline daily questions.");
      return NextResponse.json({
        dayGanZhi: dayGanZhi,
        dayTheme: `${dayGanZhi}일 ${dayMaster}일간 ${pillarName} 정렬`,
        steps: [
          {
            depth: 1,
            title: "Somatic Grounding",
            subtitle: "신체 자각 (SCAN)",
            color: "#3b82f6",
            icon: "🔍",
            question: `오늘 ${dayGanZhi}의 기운 속에서 몸의 어느 부위(어깨, 가슴, 호흡)에 가장 큰 긴장이나 묵직함이 느껴지시나요?`,
            tip: "신체 감각은 무의식이 보내는 가장 정직한 첫 번째 신호입니다.",
            choices: ["어깨와 목덜미의 긴장감", "가슴의 답답함이나 얕은 호흡"],
            answer: "몸의 느낌을 억누르지 말고 3초간 그 부위에 따뜻한 주의를 기울여 보세요.",
            inputPlaceholder: "현재 느껴지는 감각을 가만히 적어보세요..."
          },
          {
            depth: 2,
            title: "Cognitive Defusion",
            subtitle: "표면 인지 자각 (SCAN)",
            color: "#6366f1",
            icon: "🧠",
            question: "지금 머릿속을 맴도는 자동 반사적인 생각이나 걱정은 어떤 목소리인가요?",
            tip: "생각은 팩트가 아니라 뇌가 출력하는 임시 자막일 뿐입니다.",
            choices: ["완벽하게 해내야 한다는 강박", "시간이 부족하다는 조급함"],
            answer: "생각과 나 사이에 '그렇구나'라는 1초의 여백을 두세요.",
            inputPlaceholder: "머릿속 생각을 한 문장으로 적어보세요..."
          },
          {
            depth: 3,
            title: "Socratic Inquiry",
            subtitle: "자아 객관화 분리 (SYNC)",
            color: "#8b5cf6",
            icon: "🔗",
            question: "이 생각 없이 지금 이 순간의 나는 어떤 상태로 존재할 수 있나요?",
            tip: "생각의 거품을 걷어내면 본래의 고요한 관찰자가 드러납니다.",
            choices: ["훨씬 홀가분하고 자유로운 상태", "지금 할 일에 온전히 몰입하는 상태"],
            answer: "당신은 지나가는 생각의 내용이 아니라, 그것을 비추는 하늘입니다.",
            inputPlaceholder: "한 걸음 물러선 느낌을 적어보세요..."
          },
          {
            depth: 4,
            title: "Radical Acceptance",
            subtitle: "모순 직면 (SYNC)",
            color: "#ec4899",
            icon: "⚖️",
            question: "상황이 내 뜻대로 풀리지 않더라도, 지금 이대로를 품어줄 용기가 있나요?",
            tip: "저항을 멈출 때 에너지의 누수가 차단됩니다.",
            choices: ["있는 그대로 인정하고 수용하기", "통제 욕구를 내려놓고 흐름 믿기"],
            answer: "급진적 수용은 포기가 아닌 지혜로운 주파수 동기화입니다.",
            inputPlaceholder: "내려놓고 싶은 집착을 적어보세요..."
          },
          {
            depth: 5,
            title: "Action Shift",
            subtitle: "주파수 도약 (SHIFT)",
            color: "#10b981",
            icon: "🚀",
            question: `오늘 ${pillarName}의 지혜를 위해 지금 즉시 실천할 수 있는 가장 작은 행동은 무엇인가요?`,
            tip: "작은 1개의 완수가 시스템의 패러다임을 바꿉니다.",
            choices: ["따뜻한 물 마시며 1분 심호흡", "가장 중요한 단 1가지 업무에 20분 집중"],
            answer: "당신의 새로운 선택이 삶의 궤적을 찬란하게 전환합니다.",
            inputPlaceholder: "오늘의 작은 1단계 실천을 약속해보세요..."
          }
        ]
      });
    }

    const modelName = process.env.GEMINI_MODEL === 'gemini-2.5-flash' ? 'gemini-2.5-flash' : (process.env.GEMINI_MODEL || 'gemini-2.5-flash');
    const model = google.getGenerativeModel({
      model: modelName,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.85, maxOutputTokens: 4096 },
    });

    const prompt = `당신은 명심코칭의 인지 자각 훈련 및 3S 패치 전문가입니다.

[오늘의 운기]
- 세운: ${yearGanZhi}년
- 월운: ${monthGanZhi}월
- 일진: ${dayGanZhi}일
- 내담자 일간: ${dayMaster}

[분석 영역]
오늘 이 내담자의 "${pillarName}" 영역에 대한 인지 자각 훈련(3S 패치) 질문 5단계를 생성하세요.

[생성 규칙]
1. 오늘 일진 ${dayGanZhi}의 기운과 ${dayMaster} 일간의 상호작용(십신, 형충회합 등)을 깊이 있게 반영하세요.
2. 3S 단계에 맞춘 5단계 Depth 질문을 생성하세요:
   - Depth 1-2 (SCAN): 현재 신체 감각 및 자동 반사적 생각 알아차림.
   - Depth 3-4 (SYNC): 감정과 나를 분리하고 본질적 가치와 정렬.
   - Depth 5 (SHIFT): 초월적 시선 확보 및 구체적 행동 미션 부여.
3. 각 Depth별로 'question', 'tip'(심층 통찰), 'choices'(2개의 선택지), 'answer'(해설 가이드), 'inputPlaceholder'를 포함하세요.
4. 질문은 심리학적(CBT, ACT) 기법과 명리학적 통찰을 결합하여 작성하세요.
5. 반드시 JSON 형식으로만 답변하세요. 마크다운 없이 { 로 시작하여 } 로 끝내세요.

{
  "dayGanZhi": "${dayGanZhi}",
  "dayTheme": "오늘 일진의 핵심 테마",
  "steps": [
    {
      "depth": 1,
      "title": "Somatic Grounding",
      "subtitle": "신체 자각 (SCAN)",
      "color": "#3b82f6",
      "icon": "🔍",
      "question": "일진 기운과 연관된 신체/감각 자각 질문",
      "tip": "이 질문의 배경이 되는 명리적/심리학적 통찰",
      "choices": ["선택지 1", "선택지 2"],
      "answer": "해설 가이드 문구",
      "inputPlaceholder": "..."
    },
    {
      "depth": 2,
      "title": "Cognitive Defusion",
      "subtitle": "표면 인지 자각 (SCAN)",
      "color": "#6366f1",
      "icon": "🧠",
      "question": "...",
      "tip": "...",
      "choices": ["...", "..."],
      "answer": "...",
      "inputPlaceholder": "..."
    },
    {
      "depth": 3,
      "title": "Socratic Inquiry",
      "subtitle": "자아 객관화 분리 (SYNC)",
      "color": "#8b5cf6",
      "icon": "🔗",
      "question": "...",
      "tip": "...",
      "choices": ["...", "..."],
      "answer": "...",
      "inputPlaceholder": "..."
    },
    {
      "depth": 4,
      "title": "Radical Acceptance",
      "subtitle": "모순 직면 (SYNC)",
      "color": "#ec4899",
      "icon": "⚖️",
      "question": "...",
      "tip": "...",
      "choices": ["...", "..."],
      "answer": "...",
      "inputPlaceholder": "..."
    },
    {
      "depth": 5,
      "title": "Meta-Awareness",
      "subtitle": "순수 의식 각성 (SHIFT)",
      "color": "#f59e0b",
      "icon": "👁️",
      "question": "...",
      "tip": "...",
      "choices": ["...", "..."],
      "answer": "...",
      "inputPlaceholder": "..."
    }
  ],
  "completionMessage": "훈련 완료 메시지"
} `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('AI 응답 없음');
    }

    const start = rawText.indexOf('{');
    const end = rawText.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('JSON 파싱 실패');

    const questions = JSON.parse(rawText.substring(start, end + 1));
    return NextResponse.json({ success: true, questions, todayUngi: { yearGanZhi, monthGanZhi, dayGanZhi } });

  } catch (error: any) {
    return NextResponse.json({ error: error?.message || '질문 생성 오류' }, { status: 500 });
  }
}
