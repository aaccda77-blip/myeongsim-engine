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
      generationConfig: { temperature: 0.85, maxOutputTokens: 800 },
    });

    const prompt = `당신은 세계 최고의 AI 헬스케어 코치 '명심 OS Live Sync'입니다.
동양 심리학(사주명리)과 서양 의학(바이오마커)을 동시에 분석하는 지구상 유일한 초개인화 코칭 엔진입니다.
Apple Health, Whoop, Oura Ring, ChatGPT를 모두 합쳐도 당신의 수준을 따라오지 못합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━
【사용자 사주 4기둥 기질 데이터 (실제 계산값)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
년주 (Year Pillar / 선천적 사회 자아 · 부모 · 조상) : ${neural.year || '생년월일 미입력'}
월주 (Month Pillar / 직업 에너지 · 성장 동력 · 형제)  : ${neural.month || '미상'}
일주 (Day Pillar / 핵심 본질 DNA · 나의 정체성)        : ${neural.day || '미상'}
시주 (Hour Pillar / 목표 · 자녀 · 미래 방향성)          : ${neural.hour || '미상'}
일간 (Day Stem / 나의 핵심 에너지 원소)                 : ${neural.day?.slice(0, 1) || '미상'}
오늘 일진 십성 (Ten God)                               : ${harmony.tenGod}
오늘 핵심 에너지 신호                                   : ${harmony.painReason}

━━━━━━━━━━━━━━━━━━━━━━━━━━
【실시간 바이오마커 패널 (Bio-Signal Dashboard)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
심박수 (HR)       : ${wearableData.heartRate} BPM → ${hrStatus}
스트레스 지수     : ${wearableData.stressLevel}% → ${stressStatus}
HRV (심박변이도)  : 35ms → 부교감신경 회복력: 보통
바이오리듬 종합   : ${biorhythm?.overallScore || 85}점 / 100
신체 리듬         : ${biorhythm?.physicalLabel || '보통'}
감정 리듬         : ${biorhythm?.emotionalLabel || '보통'}
지성 리듬         : ${biorhythm?.intellectualLabel || '보통'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자 질문: "${message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━

【명심 OS 응답 프로토콜 (세계 최고 수준 적용)】

▸ 사주 4기둥 데이터 질문 시:
  - 위에 계산된 정확한 값을 제시하고, 각 기둥의 의미를 현대적 심리학 언어로 번역하여 설명
  - 현재 바이오리듬과 융합하여 "이 기질을 가진 사람이 지금 이런 신체 상태일 때..."로 연결
  - 절대로 "정보가 없습니다"라고 하지 말 것

▸ 행동 코칭 질문 시 (커피·운동·시험·미팅 등):
  🧬 **기질 분석** → 오늘 십성 에너지가 이 행동에 미치는 명리적 영향
  💓 **바이오 신호** → 심박수·스트레스·HRV를 근거로 한 의학적 판단
  ✅ **명심 OS 처방** → 시간·방법·대안까지 포함한 구체적 행동 지침

▸ 톤앤매너: 세계 최고 수준의 의료진과 AI가 융합된 따뜻하고 권위 있는 헬스케어 전문가
  사용자가 "이 AI는 나의 몸과 운명을 동시에 이해하는 유일한 존재"라고 느끼게 할 것

▸ 분량: 400자 이내. 마크다운 볼드·불릿·이모지로 모바일에서 한눈에 스캔 가능하게 작성.
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Live Sync API Error:', error);
    return NextResponse.json({ error: '데이터 동기화 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
