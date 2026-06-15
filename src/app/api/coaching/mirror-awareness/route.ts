import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const {
      userName,
      sajuPillars,
      bodyInput,
      thoughtInput,
      emotionInput,
      sensationInput
    } = await req.json();

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `당신은 마음수용학(ACT)과 동양 전통 마음자각 명상을 결합하여 '참나(순수 주체, 알아차림)'로 이끄는 최고의 의식 자각 마스터 코치입니다.

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

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Mirror Awareness API generation error:', error);
    
    // 에러 발생 시 따뜻한 Fallback 데이터 제공
    const fallbackData = {
      title: '순수 주체 자각 리포트',
      emptinessContemplation: '당신이 고백하신 몸의 무거움, 생각의 소란함, 감정의 출렁임, 그리고 감각의 소음들은 모두 당신 안의 넓고 고요한 호수에 일어났다 사라진 물결이었습니다. 그것들을 억지로 누르지 않고 있는 그대로 가만히 바라보고 내려놓은 당신의 용기에 따뜻한 박수를 보냅니다.',
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
