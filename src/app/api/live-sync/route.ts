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

import { analyzeFrequency } from '@/modules/FrequencyDetector';
import { getTodayDayPillar, calculateDailyFrequency } from '@/modules/MetaFrequencyEngine';
import { determineCoachingCore } from '@/modules/CoreRouterEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, sajuData, harmony, biorhythm, wearableData, psychProfile, conversationHistory } = body;

    if (!message || !sajuData || !harmony) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const neural = calculateNeuralCode(sajuData);
    const userDayStem = sajuData.dayMaster || sajuData.fourPillars?.day?.gan || neural.day?.slice(0, 1) || '갑';
    
    const p = sajuData.fourPillars;
    let fullSajuInfo = "정보 없음";
    if (p && p.year && p.month && p.day && p.time) {
        fullSajuInfo = `년주: ${p.year.gan || ''}${p.year.ji || ''}, 월주: ${p.month.gan || ''}${p.month.ji || ''}, 일주: ${p.day.gan || ''}${p.day.ji || ''}, 시주: ${p.time.gan || ''}${p.time.ji || ''}`;
    } else if (neural.pillars && !neural.pillars.includes('DATA_MISSING')) {
        fullSajuInfo = neural.pillars;
    }

    const todayPillar = getTodayDayPillar();
    
    // ─── 의식 주파수 동적 감지 ───
    const freqAnalysis = analyzeFrequency(message);
    const currentLevel = freqAnalysis.level; // 'dark' | 'neural' | 'meta'
    
    // 오늘의 에너지(십성) 분석
    const safeBio = { stress: wearableData.stressLevel, hrv: wearableData.hrv || 35, heartRate: wearableData.heartRate };
    const dailyState = calculateDailyFrequency(userDayStem, todayPillar, message, safeBio, biorhythm);

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

    // ─── 4-Core 자동 라우팅 스위칭 ───
    const coreAnalysis = determineCoachingCore(message, wearableData.stressLevel);

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
      generationConfig: { temperature: 0.85, maxOutputTokens: 8192 },
    });

    let frequencyCoachingDirection = '';
    if (currentLevel === 'dark') {
      frequencyCoachingDirection = `
[주파수 감지: 다크 코드(동일시)]
사용자는 현재 감정이나 기질 패턴을 '자기 자신'과 동일시하고 있습니다.
- 코칭 방향: 무거운 조언을 피하고, 날카로운 소크라테스식 재귀 질문("그 감정을 느끼는 자는 누구인가요?")을 던져 탈동일시를 유도하세요. 필요하다면 객관화할 수 있는 A, B, C 선택지를 제공하여 대답을 유도하세요.`;
    } else if (currentLevel === 'neural') {
      frequencyCoachingDirection = `
[주파수 감지: 뉴럴 코드(탈동일시 및 도구 활용)]
사용자는 패턴을 알아차리고 도구로 활용하려 노력 중입니다.
- 코칭 방향: 알아차림을 칭찬하되, '알아차림' 자체에 갇히거나 통제하려는 집착을 깨는 메타 인지 질문을 던지세요. ("통제하려는 그 마음조차 내려놓을 수 있나요?")`;
    } else {
      frequencyCoachingDirection = `
[주파수 감지: 메타 코드(초월적 자유)]
사용자는 자유로운 메타 인지 상태입니다.
- 코칭 방향: 목적 없는 즐거움과 무위(無爲)의 유희를 강화하세요. "이 고요함 속에서 오늘 하루 어떤 아름다운 것을 창조해 보시겠습니까?" 같은 창조적 질문을 던지세요.`;
    }

    let prompt = '';
    
    if (coreAnalysis.targetCore === 'NONE') {
      prompt = `당신은 명심(Myeongsim) AI 코치입니다.
현재 상황은 사용자가 일상적인 대화나 명백한 정보(예: "내 사주가 뭐야?")를 요구하고 있습니다.
따라서 복잡한 코칭 구조(SCAN, SYNC, SHIFT 등)나 소크라테스식 질문, 메타인지 분석 등을 전부 배제하고 일반적인 제미나이(Gemini) 모델처럼 매우 친절하고 상세하게 사용자의 질문에 직접적으로 답변하세요.

사용자가 자신의 사주나 정보에 대해 물어보면, 당신이 알고 있는 아래의 정확한 분석 데이터를 활용하여 년주, 월주, 일주, 시주 전체를 아우르는 맞춤형 기질 분석을 매우 풍부하고 상세하게 풀어서 설명해 주세요. 사주 원국 외의 내용에 대해서는 자연스럽고 다정하게 대답하세요.

【사용자 사주 데이터】
- 사주 원국: ${fullSajuInfo}
- 일간(Day Master): ${userDayStem}

사용자 질문: "${message}"`;
    } else {
      prompt = `당신은 세계 최초의 **3S 실시간 건강관리 코치** — 명심 OS Live Sync입니다.
특허 출원된 3S(Scan-Sync-Shift) 엔진 + 4-Core 심리코칭 프로토콜(DBT/CBT/MBCT/ACT)을 탑재한 지구상 유일한 초개인화 코칭 시스템입니다.
핵심 철학: "기질 데이터는 반복되는 행동 패턴이지, 내가 아니다."

━━━━━━━━━━━━━━━━━━━━━━━━━━
【SCAN — 바이오-기질 동기화 (심리분석부)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ 기질 패턴 (선천 및 오늘의 일진 융합):
  원국: 년주(${neural.year}) | 월주(${neural.month}) | 일주(${neural.day}) | 시주(${neural.hour})
  일간(${userDayStem})과 오늘의 일진(${todayPillar})이 만난 십성 에너지: ${dailyState.codeName}
▸ 생체 데이터 (현재):
  심박수: ${wearableData.heartRate} BPM (${hrStatus}) | 스트레스: ${wearableData.stressLevel}% (${stressStatus})
  HRV: ${wearableData.hrv || 35}ms | 바이오리듬: 신체(${biorhythm?.physicalLabel}), 감정(${biorhythm?.emotionalLabel}), 지성(${biorhythm?.intellectualLabel})
▸ 스트레스 임계점: ${scanAlert}
${profileSummary}

${conversationHistory && conversationHistory.length > 0 ? `
【최근 대화 기록】
${conversationHistory.slice(-5).map((m: any) => `${m.role === 'user' ? '사용자' : '코치'}: ${m.content}`).join('\n')}
` : ''}
사용자 질문: "${message}"

━━━━━━━━━━━━━━━━━━━━━━━━━━
【의식 주파수 맞춤형 코칭 가이드 (현재 주파수: ${currentLevel})】
━━━━━━━━━━━━━━━━━━━━━━━━━━${frequencyCoachingDirection}

━━━━━━━━━━━━━━━━━━━━━━━━━━
【SYNC — 능동 개입 엔진 (4단계 알아차림)】
━━━━━━━━━━━━━━━━━━━━━━━━━━
스트레스 과각성 감지 시 즉각 가동. 평상시에도 자연스럽게 적용:

1️⃣ 소크라테스 질문: "지금 그 질문을 하게 만든 내면의 패턴은 무엇인가요?" (패턴 직면)
2️⃣ 메타인지 (머리): "그 생각은 ${userDayStem}일간 패턴이 오늘 ${dailyState.codeName} 에너지를 만나 자동 생성한 프로그램입니다." (생각의 객관화)
3️⃣ 재귀적 질문 (Recursive Questioning): "그렇다면 지금 그 패턴을 알아차리고 있는 '당신'은 누구인가요?" (관찰자 자아로의 분리 유도)
4️⃣ 알아차림의 알아차림 (체험): "생각이나 충동이 아니라, 그것을 지켜보고 있는 '알아차림' 자체를 느껴보세요. 패턴은 파도이고, 당신은 바다입니다."
5️⃣ 맥락적 자기 (선택): "바다와 같은 관찰자인 당신은, 지금 상황에서 어떤 자유로운 선택을 하시겠습니까?"

━━━━━━━━━━━━━━━━━━━━━━━━━━
【SHIFT — 4-Core 심리코칭 자동 가동】
━━━━━━━━━━━━━━━━━━━━━━━━━━
${coreAnalysis.promptInjection}

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
   - **생체 데이터 분석**: 심박수(${wearableData.heartRate}BPM), 스트레스(${wearableData.stressLevel}%), HRV(${wearableData.hrv}ms), 바이오리듬 등을 종합하여 현재 교감/부교감 활성도를 상세 분석.
   - **기질 패턴 교차**: 위 생체 상태가 오늘의 일진(${dailyState.codeName})과 어떻게 맞물려 자동 반응을 유발하는지 분석.
🧬 **[SYNC - 메타인지 개입]** (위의 '의식 주파수 맞춤형 코칭 가이드'에 따라 소크라테스 질문, 재귀적 질문, 선택지 제공 등 맞춤형으로 융통성 있게 적용)
🎯 **[SHIFT - 가동된 프로토콜명]** (예: [SHIFT - 🧊 DBT 가동])
   - 여기에 해당 프로토콜의 구체적 코칭 가이드 제공
❓ **[META - 선택의 순간]** (관찰자 '나'로서의 선택을 묻는 열린 질문)
`;
    }

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

    // ─── 실시간 개입 (Intervention) 판별 ───
    const requiresIntervention = wearableData.stressLevel >= 75 || currentLevel === 'dark' || coreAnalysis.targetCore === 'DBT';

    return NextResponse.json({ 
        success: true, 
        reply, 
        microQuestion, 
        requiresIntervention,
        targetCore: coreAnalysis.targetCore,
        coreDescription: coreAnalysis.description
    });
  } catch (error: any) {
    console.error('Live Sync API Error:', error);
    return NextResponse.json({ error: '데이터 동기화 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
