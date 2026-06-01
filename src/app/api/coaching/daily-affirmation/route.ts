import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { dayMaster, todayGanji, relation, defaultAffirmation } = await req.json();

    if (!dayMaster || !todayGanji) {
      return NextResponse.json({ affirmation: defaultAffirmation || '오늘도 온전한 나의 중심으로 하루를 시작합니다.' });
    }

    const prompt = `당신은 명심코칭(Myeongsim Coaching)의 따뜻하고 통찰력 있는 마음 치유 코치입니다.
사용자의 사주 일간(타고난 영혼의 기질)과 오늘 일진(오늘의 우주적 에너지 흐름), 그리고 둘 사이의 관계성을 바탕으로, 오늘 하루 사용자에게 강력한 용기와 위로를 줄 수 있는 '오늘의 핵심 선언문(Daily Affirmation)'을 작성해주세요.

[정보]
- 사용자의 일간(나의 기질): ${dayMaster}
- 오늘 일진(오늘의 에너지): ${todayGanji}
- 오늘의 테마(관계성): ${relation} (예: PRESSURE 압박, SYNC 동기화, RESOURCE 흡수, FLOW 발산, ACHIEVEMENT 쟁취)
- 기존 고정된 선언문 참고용: "${defaultAffirmation}"

[작성 규칙]
1. 반드시 2~3문장 정도의 간결하고 강렬한 "나(I)"를 주어로 한 선언문 형태로 작성하세요. (예: "나는 ~한다.", "나의 ~은 ~이다.")
2. 기존 고정된 선언문의 틀에 얽매이지 말고, 일간(${dayMaster})과 일진(${todayGanji})이 만났을 때 일어나는 고유한 화학작용을 자연의 은유나 아름답고 시적인 비유로 표현해주세요.
3. 딱딱한 명리학 용어나 IT 용어를 피하고, 초보자가 들어도 가슴이 웅장해지거나 따뜻한 위로를 받을 수 있는 극도로 다정하고 힘 있는 문체로 작성하세요.
4. 오직 작성된 선언문 텍스트 2~3문장만 응답으로 출력하세요. (앞뒤 부연설명 절대 금지)
`;

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // 혹시라도 마크다운이나 따옴표가 붙어있다면 제거
    text = text.replace(/^["']|["']$/g, '');

    return NextResponse.json({ affirmation: text });
  } catch (error) {
    console.error('Daily affirmation generation error:', error);
    // 에러 발생 시 폴백 반환
    return NextResponse.json(
      { affirmation: '나를 향한 모든 흐름을 성장의 에너지로 전환하며, 나는 오늘도 나의 길을 흔들림 없이 걷습니다.' },
      { status: 500 }
    );
  }
}
