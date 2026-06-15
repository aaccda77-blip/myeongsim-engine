import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const {
      userName,
      sajuPillars,
      mode,
      lastStep,
      bodyInput,
      thoughtInput,
      emotionInput,
      sensationInput,
      '108Answers': answers108
    } = await req.json();

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    let prompt = '';

    if (mode === '108steps') {
      prompt = `당신은 마음수용학(ACT)과 전통 명상을 융합하여 '몸이 참내가 아님'을 자각하도록 돕는 최고의 영적 각성 마스터 코치입니다.

사용자가 몸이 자신이 아닌 인지 대상(객체)임을 108가지 다양한 실생활 예시를 통해 깨달아가는 '108 몸의 해체 훈련'을 수행하고 있습니다.
사용자는 총 108단계 중 [${lastStep}단계]까지 도달했습니다.

사용자가 적은 묵상 기록 및 사주 정보를 바탕으로, 사용자의 몸의 집착을 완전히 씻어내고 변치 않는 투명한 순수 주체(참나)로 각성했음을 정밀하게 축복하고 가이드해주는 '순수 의식 각성 마스터 리포트'를 작성해 주세요.

[사용자 프로필 & 도달 단계]
- 이름: ${userName || '명심가'}
- 사주 원국: ${sajuPillars ? JSON.stringify(sajuPillars) : '미입력'}
- 도달 수준: 108단계 중 ${lastStep}단계 완료
- 사용자가 기록한 자각 묵상 흔적: 
${answers108 || '침묵으로 동의하며 계단을 걸어 올라감'}

[작성 규칙]
1. 불교나 힌두교의 난해한 범어 용어, 또는 딱딱한 한자어 대신에 초보자도 바로 깊은 전율과 내면의 평화를 느낄 수 있도록 시적이고 감동적인 한글로 작성해 주세요.
2. 손톱 깎기, 의수/의족 이식, 전신 마취, 노화, 우주 공간에서의 감각 변화 등 사용자가 걸어온 해체의 예시들을 따뜻하게 인용하며, 몸이 결코 참나가 아님을 가슴 깊이 납득시켜 주세요.
3. 사주 정보(선택)를 참고하여, 사용자의 타고난 사주 오행 기운이 이 순수 자각 상태에서 어떤 조화롭고 아름다운 아우라를 뿜어내는지 연결 지어 설명해 줍니다.
4. 반드시 아래 JSON 형식 스펙을 완벽하게 지켜서 마크다운 백틱 없이 순수한 JSON으로만 응답하세요.

{
  "title": "순수 의식 각성 마스터 리포트",
  "emptinessContemplation": "사용자가 ${lastStep}단계 동안 몸을 내려놓으며 비워낸 고백들과 묵상에 대한 깊은 공감 및 육체의 무거움을 정화하는 다정한 격려 (160~200자)",
  "trueSelfNature": "그 어떤 신체의 노화나 사고, 감각의 오류에도 닳거나 오염되지 않고 늘 고요히 살아 숨쉬는 사용자의 순수 주체(참나)의 빛깔과 성품 묘사 (160~200자)",
  "dailyAwarenessAnchor": [
    "일상생활 속에서 몸이 아프거나 피곤할 때 '이 몸은 내 관찰 대상일 뿐이다'라고 자각을 유지하는 앵커링 실천 수칙 1 (한글로 구체적 서술, 60~80자)",
    "일상생활 속에서 몸이 아프거나 피곤할 때 '이 몸은 내 관찰 대상일 뿐이다'라고 자각을 유지하는 앵커링 실천 수칙 2 (한글로 구체적 서술, 60~80자)"
  ],
  "soulQuote": "몸의 환상을 벗어나 본래 투명한 우주 자체인 참나를 상기시키는 깊고 아름다운 시적 경구 (40~60자)"
}
`;
    } else {
      prompt = `당신은 마음수용학(ACT)과 동양 전통 마음자각 명상을 결합하여 '참나(순수 주체, 알아차림)'로 이끄는 최고의 의식 자각 마스터 코치입니다.

사용자가 적은 4단계의 객체 해체(비움) 기록과 사주 정보를 보고, 사용자가 모든 대상(몸, 생각, 감정, 감각)으로부터 벗어나 변치 않는 순수 의식(주체, 알아차림)의 상태에 도달했음을 깨닫게 돕는 감동적인 '순수 주체 자각 리포트'를 작성해 주세요.

[사용자 프로필 및 성찰 기록]
- 이름: ${userName || '명심가'}
- 사주 원국: ${sajuPillars ? JSON.stringify(sajuPillars) : '미입력'}
- 1단계 [몸 해체]: "${bodyInput || '몸은 그저 잠시 머무는 옷일 뿐'}"
- 2단계 [생각 해체]: "${thoughtInput || '흘러가는 구름 같은 생각들'}"
- 3단계 [감정 해체]: "${emotionInput || '일어났다 사라지는 감정의 파도'}"
- 4단계 [감각 해체]: "${sensationInput || '감각은 단지 주변의 소리이자 촉감'}"

[작성 규칙]
1. 불교, 힌두교, 명리 등 어려운 전문용어나 한자어 대신 초보자도 바로 가슴 깊이 공감하고 위로와 해방감을 느낄 수 있는 시적이고 따뜻한 한국어로 서술해 주세요.
2. 사용자가 몸, 생각, 감정, 감각이라는 무거운 "객체(대상)"들을 성공적으로 내려놓고, 그 모든 것을 흔들림 없이 고요하게 비추고 있는 거울 같은 "주체(참나)"로 돌아왔음을 축복하고 격려해 주세요.
3. 사주 정보(선택)를 참고하여, 사용자의 선천적 성향이 이 순수한 자각 속에서 어떤 맑은 아우라를 띠는지 자연에 빗대어 따뜻하게 연결해 줍니다.
4. 반드시 아래 JSON 형식 스펙을 완벽하게 지켜서 마크다운 백틱 없이 순수한 JSON으로만 응답하세요.

{
  "title": "순수 주체 자각 리포트",
  "emptinessContemplation": "사용자가 적은 몸, 생각, 감정, 감각의 비움 고백을 깊이 공감해주고 정화하는 다정하고 영롱한 요약 및 격려 (150~200자)",
  "trueSelfNature": "그 모든 대상이 사라진 뒤에도 늘 한결같이 반짝이며 지켜보고 있는 사용자의 순수 주체(참나)의 빛깔과 성품을 사주 오행의 기운에 빗대어 묘사 (150~200자)",
  "dailyAwarenessAnchor": [
    "일상에서 생각이나 감정에 매몰될 때 '나는 몸이나 생각이 아닌, 그것을 비추는 거울'임을 즉시 상기할 수 있는 일상 속 아주 쉬운 메타인지 앵커링 실천 방법 1 (한글로 구체적 서술, 60~80자)",
    "일상 속 아주 쉬운 메타인지 앵커링 실천 방법 2 (한글로 구체적 서술, 60~80자)"
  ],
  "soulQuote": "참나의 고요함을 일깨우는 맑고 울림이 깊은 자각의 시적인 한 줄 문장 (40~60자)"
}
`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Mirror Awareness API generation error:', error);
    
    // 에러 발생 시 따뜻한 Fallback 데이터 제공
    const fallbackData = {
      title: '순수 의식 자각 리포트',
      emptinessContemplation: '당신의 비움 성찰은 당신 안의 넓고 고요한 호수에 일어났다 사라진 물결이었습니다. 신체적 껍데기들을 억지로 누르지 않고 있는 그대로 가만히 바라보고 내려놓은 당신의 용기에 따뜻한 박수를 보냅니다.',
      trueSelfNature: '모든 구름이 흩어진 밤하늘처럼, 당신의 본질은 늘 그곳에서 고요히 세상을 비추는 밝은 달빛과 같습니다. 나이가 들어도, 감정에 상처를 입어도, 심지어 깊은 잠에 빠져 있어도 변함없이 맑게 깨어 있는 당신이라는 찬란한 순수 의식은 결코 더럽혀지거나 닳지 않습니다.',
      dailyAwarenessAnchor: [
        '숨이 가쁘거나 화가 날 때, 가슴에 손을 얹고 "아, 지금 감정이 일어나 흘러가고 있구나. 나는 그것을 바라보는 거울이다"라고 마음속으로 소리 내어 말해 보세요.',
        '하루 세 번, 거울을 바라볼 때 육체의 얼굴 너머에서 조용히 거울을 응시하고 있는 변하지 않는 앎의 주체와 3초간 눈을 마주쳐 보세요.'
      ],
      soulQuote: '바람이 불어도 하늘은 상처 나지 않고, 파도가 쳐도 바다의 깊은 바닥은 늘 침묵합니다. 당신이 바로 그 하늘이자 바다입니다.'
    };
    
    return NextResponse.json({ success: true, data: fallbackData });
  }
}
