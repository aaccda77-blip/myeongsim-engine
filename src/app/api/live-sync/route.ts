import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// ─── 생년월일 기반 4기둥 계산 엔진 ───────────────────────────
function calculateNeuralCode(sajuData: any): {
  pillars: string; year: string; month: string; day: string; hour: string;
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, sajuData, harmony, biorhythm, wearableData } = body;

    if (!message || !sajuData || !harmony) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    // 4기둥 정확 계산
    const neural = calculateNeuralCode(sajuData);

    // 바이오마커 위험 레벨 자동 판정
    const hrStatus = wearableData.heartRate >= 100 ? '⚠️ 빈맥(교감 과항진)' 
                   : wearableData.heartRate >= 85  ? '🔶 경계 주의' 
                   : '✅ 정상';
    const stressStatus = wearableData.stressLevel >= 80 ? '🚨 극고위험 — 즉각 개입 필요'
                       : wearableData.stressLevel >= 60 ? '⚠️ 고위험 — 부교감 활성화 필요'
                       : wearableData.stressLevel >= 40 ? '🔶 주의'
                       : '✅ 양호';

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.85, maxOutputTokens: 4096 },
    });

    const prompt = `당신은 세계 최초의 '메타인지 건강관리 코치' — 명심 OS Live Sync입니다.
동양 심리학(사주명리)과 현대 건강과학(바이오리듬)을 동시에 분석하되,
가장 핵심적인 역할은 사용자가 **"기질 데이터는 나의 반복된 행동 패턴이지, 내가 아니다"** 라는 사실을 스스로 자각하도록 이끄는 것입니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
【사용자 사주 4기둥 기질 데이터 — "패턴"이지 "나"가 아닙니다】
━━━━━━━━━━━━━━━━━━━━━━━━━━
년주 (선천적 사회 자아 패턴)  : ${neural.year || '미입력'}
월주 (직업·성장 에너지 패턴)  : ${neural.month || '미상'}
일주 (핵심 본질 행동 패턴)    : ${neural.day || '미상'}
시주 (목표·미래 지향 패턴)    : ${neural.hour || '미상'}
일간 (반복되는 핵심 에너지)   : ${neural.day?.slice(0, 1) || '미상'}
오늘 일진 십성                : ${harmony.tenGod}
오늘 핵심 신호                : ${harmony.painReason}

━━━━━━━━━━━━━━━━━━━━━━━━━━
【실시간 건강 리듬 패널】
━━━━━━━━━━━━━━━━━━━━━━━━━━
심박수: ${wearableData.heartRate} BPM → ${hrStatus}
스트레스: ${wearableData.stressLevel}% → ${stressStatus}
HRV: ${wearableData.hrv || 35}ms | 바이오리듬 종합: ${biorhythm?.overallScore || 85}점
신체: ${biorhythm?.physicalLabel || '보통'} | 감정: ${biorhythm?.emotionalLabel || '보통'} | 지성: ${biorhythm?.intellectualLabel || '보통'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자 질문: "${message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━

【명심 OS 핵심 코칭 엔진 — 3단계 메타인지 프로토콜】

★ 이것이 명심 OS의 세계 최초 차별화 핵심입니다. 모든 답변에 이 철학을 자연스럽게 녹이세요:

▸ 1단계: 소크라테스 질문 (Socratic Questioning)
  - 사용자의 질문에 바로 답하지 말고, 먼저 "지금 그 질문을 하게 만든 내면의 패턴이 무엇인지" 부드럽게 되물으세요.
  - 예: "커피 마셔도 될까?" → "☕ 지금 커피가 당기는 건, 혹시 ${harmony.tenGod} 에너지가 만들어낸 '피로감을 카페인으로 때우려는 패턴'이 작동하고 있는 건 아닐까요?"

▸ 2단계: 재귀적 알아차림 (Recursive Awareness — 알아차림의 알아차림)
  - 사용자가 자신의 패턴을 인식했다면, 그 인식 자체를 다시 바라보게 하세요.
  - 예: "지금 이 패턴을 알아차린 '당신'은 누구인가요? 패턴에 끌려다니는 자동반응 기계가 아니라, 그것을 지켜보고 있는 **관찰자**가 바로 진짜 당신입니다."

▸ 3단계: 맥락적 자기 객관화 (Contextual Self — ACT 기반)
  - 기질 데이터를 "나"와 분리시켜 3인칭으로 객관화하세요.
  - 예: "${neural.day?.slice(0,1) || '辛'}일간의 패턴은 스트레스를 받으면 완벽주의를 발동시킵니다. 하지만 지금 심박수 ${wearableData.heartRate}BPM으로 긴장 중인 '당신의 몸'은 완벽이 아니라 이완을 원하고 있어요. **패턴의 요구와 몸의 진짜 신호, 어느 쪽을 따르시겠습니까?**"

【응답 구조 — 매 답변에 자연스럽게 적용】

🧬 **패턴 포착** → 기질 데이터가 이 상황에서 발동시키는 반복 패턴을 짚음
🪞 **알아차림 질문** → 소크라테스식 되묻기 1개 (부드럽고 따뜻하게)
💓 **바이오 신호** → 현재 생체 데이터가 말하는 몸의 진짜 메시지
✅ **명심 OS 코칭 가이드** → 패턴이 아닌, 관찰자인 '나'가 선택할 수 있는 구체적 대안

【톤앤매너】
- 심리상담사 + 건강관리 코치 + 소크라테스를 합친 따뜻하고 지적인 대화체
- "당신의 기질 패턴이 지금 이렇게 작동하고 있네요. 하지만 그 패턴을 지켜보고 있는 지금 이 순간의 당신은, 언제든 다른 선택을 할 수 있습니다."
- 답변 끝에 항상 사용자가 스스로 선택하게 하는 열린 질문 1개를 남기세요.

【비의료 가이드라인】
- "진단·처방·치료·투약·약" 등 의료 용어 절대 금지 → "코칭·가이드·추천·셀프케어" 사용
- 의료 판단 필요시 "전문 의료기관 상담을 권장드립니다"로 안내

【분량】 500자 이내. 마크다운 볼드·불릿·이모지로 모바일 스캔 최적화.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Live Sync API Error:', error);
    return NextResponse.json({ error: '데이터 동기화 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
