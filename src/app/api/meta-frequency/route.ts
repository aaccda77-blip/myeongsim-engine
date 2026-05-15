import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import {
  calculateDailyFrequency,
  getSelfInquiry,
  analyzeBioFrequencySync,
  CONSCIOUSNESS_STATES,
  ConsciousnessLevel,
} from '@/modules/MetaFrequencyEngine';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 오늘의 실제 일진(日辰)을 lunar-javascript로 자동 계산
 */
function getTodayDayPillar(): string {
  try {
    const { Solar } = require('lunar-javascript');
    const now = new Date();
    const solar = Solar.fromYmdHms(
      now.getFullYear(), now.getMonth() + 1, now.getDate(),
      now.getHours(), now.getMinutes(), 0
    );
    const lunar = solar.getLunar();
    const bazi = lunar.getEightChar();
    return bazi.getDay(); // 오늘의 일주 간지 (예: "己丑")
  } catch {
    return '己丑';
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userMessage,     // 사용자 메시지 (주파수 감지용)
      selectedLevel,   // 사용자가 선택한 주파수 레벨
      bio,             // 생체 데이터
      biorhythm,       // 바이오리듬
      sajuData,        // 사주 데이터 (추가 컨텍스트)
    } = body;

    // ★ 핵심: 오늘의 실제 일진을 서버에서 자동 계산 (사용자 생년 일주가 아님!)
    const todayPillar = getTodayDayPillar();
    const safeBio = bio || { stress: 55, hrv: 40, heartRate: 85 };
    
    // 사용자 일간 추출 (갑, 을, 병...)
    const userDayStem = sajuData?.dayPillar ? sajuData.dayPillar.charAt(0) : '갑';

    // 1. 오늘의 주파수 상태 산출 (실제 일진 기반)
    const dailyState = calculateDailyFrequency(
      userDayStem,
      todayPillar,
      userMessage || '',
      safeBio,
      biorhythm
    );

    // 2. 사용자 선택이 있으면 해당 레벨로 덮어쓰기
    const activeLevel: ConsciousnessLevel = selectedLevel || dailyState.currentLevel;
    const selfInquiry = getSelfInquiry(activeLevel);
    const bioSyncMessage = analyzeBioFrequencySync(activeLevel, safeBio);

    // 3. Gemini AI로 깊은 재귀적 코칭 생성
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.9, maxOutputTokens: 4096 },
    });

    const levelState = CONSCIOUSNESS_STATES[activeLevel];

    const prompt = `당신은 명심 OS의 '의식 주파수 마스터'입니다.
사용자의 현재 의식 주파수 위치를 읽고, 재귀적 자기질문을 통해 한 단계 더 깊은 자각으로 안내합니다.

【핵심 철학 — 절대 원칙】
- 기질 데이터는 "나"가 아닙니다. 내 주체가 아님을 아는 것이 첫 걸음입니다.
- 다크 코드를 "제거"하는 것이 아닙니다. 구름에 가려진 태양처럼, 동일시를 탈동일시하면 구름이 걷히고 자연스럽게 뉴럴 코드가 드러납니다.
- 뉴럴 코드로 도구처럼 잘 쓰는 것도 좋지만, 메타 코드는 잘 쓰는 것조차 집착하지 않는 것입니다.
- 메타 코드 = 하되 안 할 수도 있는 상태. 즐기되 열심히 하되 안 할 수도 있는 궁극의 자유.

【개인화된 에너지 분석】
사용자의 일간(${userDayStem})과 오늘의 일진(${todayPillar})이 만나 형성된 십성: ${dailyState.codeName}
🔻 다크 코드: [${dailyState.darkCode.tag}] ${dailyState.darkCode.desc}
🔹 뉴럴 코드: [${dailyState.neuralCode.tag}] ${dailyState.neuralCode.desc}
🚀 메타 코드: [${dailyState.metaCode.tag}] ${dailyState.metaCode.desc}

【사용자 현재 주파수】
${levelState.emoji} **${levelState.label}** — ${levelState.metaphor}
${userMessage ? `사용자 메시지: "${userMessage}"` : '(선택지를 통해 자기 진단)'}

【생체 데이터】
심박: ${safeBio.heartRate}BPM | 스트레스: ${safeBio.stress}% | HRV: ${safeBio.hrv}ms
바이오 교차: ${bioSyncMessage}

【당신의 역할】
${activeLevel === 'dark' ? `사용자는 현재 다크 코드에 동일시되어 있습니다.
"이 패턴이 나라고 믿고 있지 않나요?"라는 관점에서 부드럽지만 단호하게 탈동일시를 유도하세요.
패턴은 버려야 할 것이 아니라, 구름이 걷히면 저절로 보이는 태양(뉴럴 코드)을 가리킬 뿐입니다.
재귀적 질문: "${selfInquiry}"` : ''}
${activeLevel === 'neural' ? `사용자는 패턴을 도구로 활용하고 있습니다. 훌륭합니다.
하지만 "잘 써야 한다"는 미묘한 집착이 없는지 점검해 주세요.
도구를 내려놓아도, 당신은 여전히 온전합니다.
재귀적 질문: "${selfInquiry}"` : ''}
${activeLevel === 'meta' ? `사용자는 메타 코드 상태입니다. 
잘 쓰는 것조차 집착 없이, 하되 안 할 수도 있는 자유를 누리고 있습니다.
이 자유에서 자연스럽게 흘러나오는 사회적 기여의 방향을 함께 탐색해 주세요.
재귀적 질문: "${selfInquiry}"` : ''}

【응답 형식】
${levelState.emoji} **[${levelState.label} 주파수 감지]**
(현재 상태에 대한 뇌과학적/철학적 해석)

🪞 **[재귀적 자기질문]**
(한 단계 더 깊은 자각을 유도하는 강력한 질문)

🌅 **[의식의 다음 단계]**
(다크→뉴럴 또는 뉴럴→메타로의 자연스러운 전환 안내)

【비의료 가이드라인】 진단·처방·치료 용어 절대 금지. 코칭·가이드·셀프케어만 사용.
마크다운 볼드·이모지로 모바일 최적화. 문장이 중간에 끊기지 않도록 끝까지 완성.
`;

    const result = await model.generateContent(prompt);
    const aiReply = result.response.text();

    return NextResponse.json({
      success: true,
      dailyState: {
        todayPillar,
        codeName: dailyState.codeName,
        darkCode: dailyState.darkCode,
        neuralCode: dailyState.neuralCode,
        metaCode: dailyState.metaCode,
        currentLevel: activeLevel,
        selfInquiry,
        bioSyncMessage,
        frequencyQuestion: dailyState.frequencyQuestion,
      },
      aiReply,
    });
  } catch (error: any) {
    console.error('Meta Frequency API Error:', error);
    return NextResponse.json(
      { error: '의식 주파수 분석 중 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}
