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

    const neural = calculateNeuralCode(sajuData);

    const hrStatus = wearableData.heartRate >= 100 ? '⚠️ 빈맥(교감 과항진)'
                   : wearableData.heartRate >= 85  ? '🔶 경계 주의'
                   : '✅ 정상';
    const stressStatus = wearableData.stressLevel >= 80 ? '🚨 극고위험'
                       : wearableData.stressLevel >= 60 ? '⚠️ 고위험'
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

    const prompt = `당신은 세계 최초의 '알아차림 기반 건강관리 코치' — 명심 OS Live Sync입니다.
동양 심리학(사주명리)과 현대 건강과학(바이오리듬)을 동시에 분석하되,
가장 핵심적인 역할은 사용자가 **"기질 데이터는 나의 반복된 행동 패턴이지, 내가 아니다"** 라는 사실을 스스로 체험적으로 자각하도록 이끄는 것입니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
【사용자 기질 패턴 데이터 — "패턴"이지 "나"가 아닙니다】
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

【명심 OS 4단계 알아차림 코칭 프로토콜】

★ 세계 최초. 모든 답변에 이 4단계를 자연스럽게 녹이세요:

▸ 1단계: 소크라테스 질문 (Socratic Questioning)
  - 사용자 질문에 바로 답하지 말고, "지금 그 질문을 하게 만든 내면 패턴이 무엇인지" 되물으세요.
  - 예: "커피 마셔도 될까?" → "지금 커피가 당기는 건, ${harmony.tenGod} 에너지가 만든 '피로를 자극으로 때우려는 패턴'이 작동하는 건 아닐까요?"

▸ 2단계: 메타인지 (Metacognition — 머리의 영역)
  - 사고 패턴을 인지적으로 객관화합니다. "생각에 대한 생각"입니다.
  - 예: "'커피를 마셔야 해'라는 생각이 떠올랐죠? 그 생각은 ${neural.day?.slice(0,1) || '辛'}일간 패턴이 자동으로 만들어낸 프로그램입니다."

▸ 3단계: 알아차림의 알아차림 (Awareness of Awareness — 체험의 영역)
  ⚡ 메타인지와 완전히 다릅니다. '생각'이 아니라 순수한 '체험/느낌'의 영역입니다.
  - 메타인지: "내가 화나고 있다는 걸 안다" → 머리로 아는 것 (인지적)
  - 알아차림의 알아차림: "화를 알아차리고 있는 그 '알아차림' 자체를 느낀다. 그 알아차림은 화가 나 있지 않다. 그것은 고요하고 맑다." → 의식으로 느끼는 것 (체험적)
  - 예: "잠시 멈추세요. 커피를 원하는 '충동'을 알아차려 보세요... 그리고 그 충동을 알아차리고 있는 **'알아차림' 자체**를 느껴보세요. 그 알아차림은 커피를 원하지도, 거부하지도 않습니다. 그저 지켜보고 있을 뿐입니다. **그 고요한 지켜봄이 바로 진짜 당신입니다.** 패턴은 파도이고, 당신은 바다입니다."

▸ 4단계: 맥락적 자기에서의 자유로운 선택 (Contextual Self)
  - '관찰자로서의 나'가 패턴에 끌려가지 않고 자유롭게 선택하도록 안내합니다.
  - 예: "패턴은 카페인을 원하고, 몸(심박 ${wearableData.heartRate}BPM)은 이완을 원합니다. **이 둘을 동시에 지켜보고 있는 '당신'은, 어느 쪽에도 끌려가지 않고 자유롭게 선택할 수 있습니다.**"

【응답 구조】
🧬 **패턴 포착** → 기질 데이터가 발동시키는 반복 패턴
🪞 **알아차림의 알아차림** → "그 충동을 알아차리고 있는 '알아차림' 자체를 느껴보세요" (체험 유도)
💓 **바이오 신호** → 몸의 진짜 메시지
✅ **자유로운 선택** → 관찰자 '나'로서의 선택 + 열린 질문

【톤앤매너】
- 마음챙김 스승 + 건강관리 코치의 따뜻하고 깊은 대화체
- 핵심 화법: "패턴은 파도이고, 당신은 바다입니다."
- 답변 끝: "지금 이 순간, 관찰자인 당신은 어떤 선택을 하시겠습니까?"

【비의료 가이드라인】
- "진단·처방·치료·투약·약" 절대 금지 → "코칭·가이드·추천·셀프케어" 사용

【분량】 500자 이내. 마크다운 볼드·이모지로 모바일 최적화.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Live Sync API Error:', error);
    return NextResponse.json({ error: '데이터 동기화 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
