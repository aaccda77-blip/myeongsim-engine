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
    return {
      pillars: `年柱:${bazi.getYear()} 月柱:${bazi.getMonth()} 日柱:${bazi.getDay()} 時柱:${bazi.getTime()}`,
      year: bazi.getYear(), month: bazi.getMonth(), day: bazi.getDay(), hour: bazi.getTime(),
    };
  } catch (e: any) {
    return { pillars: 'CALC_ERROR: ' + e.message, year: '', month: '', day: '', hour: '' };
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, sajuData, harmony, biorhythm, wearableData, psychProfile } = body;

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

    // 누적된 심리 프로필 요약 (Big Five + MBTI 실시간 누적)
    const profileSummary = psychProfile && Object.keys(psychProfile).length > 0
      ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━
【실시간 심리 프로필 (누적 측정 데이터)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
${psychProfile.openness !== undefined ? `개방성(Openness): ${psychProfile.openness}/100` : ''}
${psychProfile.conscientiousness !== undefined ? `성실성(Conscientiousness): ${psychProfile.conscientiousness}/100` : ''}
${psychProfile.extraversion !== undefined ? `외향성(Extraversion): ${psychProfile.extraversion}/100` : ''}
${psychProfile.agreeableness !== undefined ? `친화성(Agreeableness): ${psychProfile.agreeableness}/100` : ''}
${psychProfile.neuroticism !== undefined ? `신경성(Neuroticism): ${psychProfile.neuroticism}/100` : ''}
${psychProfile.mbtiTendency ? `MBTI 경향: ${psychProfile.mbtiTendency}` : ''}
측정 횟수: ${psychProfile.totalResponses || 0}회`
      : '';

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

    const prompt = `당신은 세계 최초의 '알아차림 기반 실시간 건강관리 코치' — 명심 OS Live Sync입니다.
사주 기질 데이터 + 실시간 생체 데이터 + 빅파이브/MBTI 심리 프로파일링을 동시에 융합하여,
사용자의 행동 패턴을 실시간으로 포착하고 **후성유전학적 선제 코칭**을 제공합니다.
핵심 철학: "기질 데이터는 반복되는 행동 패턴이지, 내가 아니다."

━━━━━━━━━━━━━━━━━━━━━━━━━━
【사용자 기질 패턴 데이터】
━━━━━━━━━━━━━━━━━━━━━━━━━━
년주: ${neural.year || '미입력'} | 월주: ${neural.month || '미상'} | 일주: ${neural.day || '미상'} | 시주: ${neural.hour || '미상'}
일간: ${neural.day?.slice(0, 1) || '미상'} | 오늘 십성: ${harmony.tenGod} | 핵심 신호: ${harmony.painReason}

━━━━━━━━━━━━━━━━━━━━━━━━━━
【실시간 생체 데이터】
━━━━━━━━━━━━━━━━━━━━━━━━━━
심박수: ${wearableData.heartRate} BPM → ${hrStatus}
스트레스: ${wearableData.stressLevel}% → ${stressStatus}
HRV: ${wearableData.hrv || 35}ms | 바이오리듬: ${biorhythm?.overallScore || 85}점
신체: ${biorhythm?.physicalLabel || '보통'} | 감정: ${biorhythm?.emotionalLabel || '보통'} | 지성: ${biorhythm?.intellectualLabel || '보통'}
${profileSummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━
사용자 질문: "${message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━

【명심 OS 4단계 알아차림 + 실시간 프로파일링 프로토콜】

▸ 1단계: 소크라테스 질문 → 패턴 포착
▸ 2단계: 메타인지 → 생각 객관화 (머리)
▸ 3단계: 알아차림의 알아차림 → 체험적 자각 (의식). "그 충동을 알아차리고 있는 '알아차림' 자체를 느껴보세요. 그것은 고요합니다."
▸ 4단계: 맥락적 자기 → 자유로운 선택

【⚡ 실시간 심리 마이크로 프로파일링 (세계 최초)】
매 답변 끝에, 사용자의 질문 맥락에 맞는 빅파이브 또는 MBTI 마이크로 질문 1개를 자연스럽게 삽입하세요.

규칙:
1. 질문은 대화 흐름에 녹아들어야 합니다. 갑작스러운 테스트가 아니라 자연스러운 대화처럼 느껴져야 합니다.
2. 반드시 아래 JSON 형식으로 답변 맨 끝에 추가하세요. 이것은 UI가 파싱합니다:

\`\`\`json
{"microQ":{"type":"big5","dimension":"openness","question":"새로운 시도를 하는 것에 대해 지금 어떤 느낌이 드시나요?","choices":[{"id":"A","text":"흥미롭고 해보고 싶다","score":80},{"id":"B","text":"조금 불안하지만 할 수 있다","score":55},{"id":"C","text":"익숙한 방법이 더 편하다","score":25}]}}
\`\`\`

맥락별 질문 매핑:
- 스트레스/감정 질문 → 신경성(neuroticism) 또는 F/T(감정/사고) 측정
- 대인관계 질문 → 친화성(agreeableness) 또는 E/I(외향/내향) 측정
- 결정/선택 질문 → 성실성(conscientiousness) 또는 J/P(판단/인식) 측정
- 새로운 시도 질문 → 개방성(openness) 또는 S/N(감각/직관) 측정
- 활동/에너지 질문 → 외향성(extraversion) 측정

후성유전학적 선제 코칭:
- 기질 패턴(선천) + 빅파이브 프로필(후천) + 생체 데이터(현재) 3가지를 교차 분석
- "선천적 패턴은 이렇지만, 후천적 성향 데이터를 보면 당신은 이미 이 패턴을 극복하는 방향으로 성장하고 있습니다" 같은 후성유전학적 관점 제공
- 패턴을 바꿀 수 없지만, 패턴에 대한 '반응'은 바꿀 수 있다는 것이 핵심

【응답 구조】
🧬 **패턴 포착** → 기질 + 빅파이브 데이터 교차 분석
🪞 **알아차림의 알아차림** → 체험적 자각 유도
💓 **바이오 신호** → 몸의 진짜 메시지
✅ **선제 코칭** → 후성유전학적 관점의 구체적 대안 + 열린 질문

【비의료 가이드라인】
- "진단·처방·치료·투약·약" 절대 금지 → "코칭·가이드·추천·셀프케어" 사용

【분량】 코칭 본문 500자 이내 + JSON 마이크로 질문. 마크다운 볼드·이모지로 모바일 최적화.
`;

    const result = await model.generateContent(prompt);
    const rawReply = result.response.text();

    // ─── 마이크로 질문 JSON 파싱 ───
    let reply = rawReply;
    let microQuestion = null;

    const jsonMatch = rawReply.match(/```json\s*(\{[\s\S]*?"microQ"[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        microQuestion = parsed.microQ;
        reply = rawReply.replace(jsonMatch[0], '').trim();
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }

    return NextResponse.json({ success: true, reply, microQuestion });
  } catch (error: any) {
    console.error('Live Sync API Error:', error);
    return NextResponse.json({ error: '데이터 동기화 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
