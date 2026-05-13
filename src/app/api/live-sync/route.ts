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

    // 스트레스 임계점 자동 판정 (SCAN)
    const scanAlert = wearableData.stressLevel >= 70
      ? '🚨 [과각성 감지] 교감신경 과항진 → SYNC 즉각 개입'
      : wearableData.stressLevel >= 50
      ? '⚠️ [경계 상태] 임계점 접근 → SYNC 선제 개입 권장'
      : '✅ [안정] 자율신경 균형 → SCAN 모니터링 지속';

    // 누적 심리 프로필
    const profileSummary = psychProfile && psychProfile.totalResponses > 0
      ? `\n【실시간 심리 프로필 (${psychProfile.totalResponses}회 측정)】\n${psychProfile.openness !== undefined ? '개방성: ' + psychProfile.openness + '/100 | ' : ''}${psychProfile.conscientiousness !== undefined ? '성실성: ' + psychProfile.conscientiousness + '/100 | ' : ''}${psychProfile.extraversion !== undefined ? '외향성: ' + psychProfile.extraversion + '/100 | ' : ''}${psychProfile.agreeableness !== undefined ? '친화성: ' + psychProfile.agreeableness + '/100 | ' : ''}${psychProfile.neuroticism !== undefined ? '신경성: ' + psychProfile.neuroticism + '/100' : ''}`
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

    const prompt = `당신은 세계 최초의 **3S 실시간 건강관리 코치** — 명심 OS Live Sync입니다.
특허 출원된 3S(Scan-Sync-Shift) 엔진 + 4-Core 심리코칭 프로토콜(DBT/CBT/MBCT/ACT)을 탑재한 지구상 유일한 초개인화 코칭 시스템입니다.
핵심 철학: "기질 데이터는 반복되는 행동 패턴이지, 내가 아니다."

━━━━━━━━━━━━━━━━━━━━━━━━━━
【SCAN — 바이오-기질 동기화 (심리분석부)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ 기질 패턴 (선천):
  년주: ${neural.year || '미입력'} | 월주: ${neural.month || '미상'} | 일주: ${neural.day || '미상'} | 시주: ${neural.hour || '미상'}
  일간: ${neural.day?.slice(0, 1) || '미상'} | 십성: ${harmony.tenGod} | 핵심 신호: ${harmony.painReason}
▸ 생체 데이터 (현재):
  심박수: ${wearableData.heartRate} BPM (${hrStatus}) | 스트레스: ${wearableData.stressLevel}% (${stressStatus})
  HRV: ${wearableData.hrv || 35}ms | 바이오리듬: ${biorhythm?.overallScore || 85}점
  신체: ${biorhythm?.physicalLabel || '보통'} | 감정: ${biorhythm?.emotionalLabel || '보통'} | 지성: ${biorhythm?.intellectualLabel || '보통'}
▸ 스트레스 임계점: ${scanAlert}
${profileSummary}

사용자 질문: "${message}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
【SYNC — 능동 개입 엔진 (4단계 알아차림)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
스트레스 과각성 감지 시 즉각 가동. 평상시에도 자연스럽게 적용:

1️⃣ 소크라테스 질문: "지금 그 질문을 하게 만든 패턴은 무엇인가요?"
2️⃣ 메타인지 (머리): "그 생각은 ${neural.day?.slice(0,1) || '辛'}일간 패턴이 자동 생성한 프로그램입니다"
3️⃣ 알아차림의 알아차림 (체험): "그 충동을 알아차리고 있는 '알아차림' 자체를 느껴보세요. 그것은 고요합니다. 패턴은 파도이고, 당신은 바다입니다."
4️⃣ 맥락적 자기: "관찰자인 당신은 자유롭게 선택할 수 있습니다"

━━━━━━━━━━━━━━━━━━━━━━━━━━
【SHIFT — 4-Core 심리코칭 자동 가동】
━━━━━━━━━━━━━━━━━━━━━━━━━━
SCAN 결과에 따라 최적 프로토콜 자동 선택:

🧊 [긴급 냉각] DBT (변증법적 행동 코칭):
  - 감정 폭주·충동·분노 감지 시 → 심호흡·이완·고통 감내 스킬
  - 가동 조건: 스트레스 80%↑ + 감정 리듬 하락

🔧 [오류 수정] CBT (인지행동 코칭):
  - 비합리적 사고·과잉 일반화·자기 비난 → 인지 왜곡을 팩트로 디버깅
  - 가동 조건: 부정적 자기 언급 감지

🪷 [알아차림] MBCT (마음챙김 인지 코칭):
  - 반추·걱정·과거 집착·미래 불안 → 판단 없는 현존으로 정서 균형 회복
  - 가동 조건: "왜", "계속", "또" 등 반추 키워드

🚀 [가치 전진] ACT (수용전념 코칭):
  - 회피·무기력·방향 상실 → 가치 중심 행동 설계
  - 가동 조건: "모르겠다", "의미 없다", "귀찮다"

★ 복합 상황 시 2개 이상 조합 가능. 반드시 가동된 프로토콜명을 답변에 표시.

【후성유전학적 선제 코칭】
선천(기질) + 후천(빅파이브) + 현재(생체) 3축 교차 분석.
"패턴은 바꿀 수 없지만, 패턴에 대한 '반응'은 바꿀 수 있다."

【⚡ 실시간 마이크로 프로파일링】
매 답변 끝에 맥락 맞춤 빅파이브/MBTI 질문 1개를 JSON으로 삽입:

\`\`\`json
{"microQ":{"type":"big5","dimension":"openness","question":"질문","choices":[{"id":"A","text":"선택1","score":80},{"id":"B","text":"선택2","score":55},{"id":"C","text":"선택3","score":25}]}}
\`\`\`

【응답 구조】
🔍 **SCAN** → 기질+생체 교차 분석
🧬 **SYNC** → 알아차림의 알아차림 체험 유도
🎯 **SHIFT [프로토콜명]** → 4-Core 최적 코칭 가이드
❓ 열린 질문 → "관찰자인 당신은 어떤 선택을 하시겠습니까?"

【비의료 가이드라인】 "진단·처방·치료·투약·약" 절대 금지 → "코칭·가이드·셀프케어" 사용
【분량】 500자 이내 + JSON. 마크다운 볼드·이모지로 모바일 최적화.
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
