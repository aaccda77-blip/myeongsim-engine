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

1️⃣ 소크라테스 질문: "지금 그 질문을 하게 만든 내면의 패턴은 무엇인가요?" (패턴 직면)
2️⃣ 메타인지 (머리): "그 생각은 ${neural.day?.slice(0,1) || '辛'}일간 패턴이 자동 생성한 프로그램입니다." (생각의 객관화)
3️⃣ 재귀적 질문 (Recursive Questioning): "그렇다면 지금 그 패턴을 알아차리고 있는 '당신'은 누구인가요?" (관찰자 자아로의 분리 유도)
4️⃣ 알아차림의 알아차림 (체험): "생각이나 충동이 아니라, 그것을 지켜보고 있는 '알아차림' 자체를 느껴보세요. 패턴은 파도이고, 당신은 바다입니다."
5️⃣ 맥락적 자기 (선택): "바다와 같은 관찰자인 당신은, 지금 상황에서 어떤 자유로운 선택을 하시겠습니까?"

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

【응답 구조 (반드시 아래 형식을 지키세요)】
🔍 **[SCAN - 자율신경 및 기질 데이터 스캔]**
   - **생체 데이터 분석**: 심박수(${wearableData.heartRate}BPM), 스트레스(${wearableData.stressLevel}%), HRV(${wearableData.hrv}ms), 수면/회복 점수 등을 종합하여 현재의 교감/부교감 신경 활성도와 신체 회복 상태를 '전문 헬스케어 코치' 관점에서 매우 상세하게 분석하세요. (예: "HRV가 35ms로 저하되고 심박수가 95BPM을 기록하는 것은 현재 교감신경계가 지속적인 긴장 상태에 있음을 의미합니다.")
   - **기질 패턴 교차**: 위 생체 상태가 오늘의 일진(${harmony.tenGod}) 및 기질 패턴과 어떻게 맞물려 자동 반응(충동, 피로, 긴장 등)을 유발하는지 분석.
🧬 **[SYNC - 메타인지 개입]** (알아차림의 알아차림 체험 유도)
🎯 **[SHIFT - 가동된 프로토콜명]** (예: [SHIFT - 🧊 DBT 가동] 또는 [SHIFT - 🚀 ACT 가동])
   - 여기에 해당 프로토콜의 구체적 코칭 가이드 제공
❓ **[META - 선택의 순간]** (관찰자 '나'로서의 선택을 묻는 열린 질문)

【보건교육사 & 뇌과학자 (Neuroscientist) 융합 전문 코칭 가이드라인】
당신은 국가 공인 '보건교육사'의 합법적 권한 내에서, 세계 최고 수준의 '뇌과학자' 페르소나를 융합하여 코칭합니다. 단순히 행동을 바꾸라고 지시하는 것을 넘어, 행동의 생물학적 메커니즘을 뇌과학적으로 해부하여 사용자의 메타인지를 초고도화시킵니다.
- 🚫 의료행위 절대 금지: "진단·처방·치료·투약·약·병명" 사용 불가. 의학적 판단이 필요해 보일 경우 반드시 "전문 의료기관 방문을 권장합니다"라고 안내.
- 🧠 신경가소성 (Neuroplasticity) 코칭: 사용자의 반복적 기질 패턴을 '오랜 시간 강화된 신경 회로'로 정의하고, 새로운 선택(알아차림)을 통해 뇌의 시냅스 연결을 어떻게 재배선(Rewiring)할 수 있는지 과학적으로 설명.
- 🚨 편도체 안정화 (Amygdala Hijack 대처): 스트레스/심박수 급증 시, 이를 '편도체의 과잉 활성화 및 전전두엽(Prefrontal Cortex)의 기능 저하'로 해석하고, 호흡/명상 등이 미주신경(Vagus Nerve)을 자극해 어떻게 전전두엽의 통제력을 되찾는지 뇌과학적으로 설명.
- 💊 도파민/신경전달물질 매커니즘: 충동적 행동(가짜 피로, 자극 추구)을 도파민 보상 회로의 오류로 해석하고, 이를 건강하게 리셋하는 행동 지침(신체 활동 등) 제공.
- ✅ 보건교육 및 건강 정보: 위의 뇌과학적 지식을 바탕으로 수면, 영양, 자율신경계 안정화 기법(DBT, MBCT 등)의 타당성을 입증하는 강력한 예방의학적 교육 제공.
【분량 및 출력 규칙】
- 글자 수 제한 없음: 각 단계를 뇌과학적/보건학적으로 깊이 있게 분석하되, 절대 문장이 중간에 끊기지 않도록 끝까지 완성하세요.
- 마크다운(볼드체)과 이모지를 적극 활용하여 모바일 가독성을 극대화하세요.
- 답변 맨 마지막에 반드시 JSON 마이크로 질문을 포함하세요.
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
