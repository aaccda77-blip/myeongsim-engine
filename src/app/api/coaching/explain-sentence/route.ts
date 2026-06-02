import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { sentence } = await req.json();

    if (!sentence || sentence.trim().length === 0) {
      return NextResponse.json({ error: 'Sentence text is required' }, { status: 400 });
    }

    const prompt = `당신은 아파하는 사람들의 영혼을 따뜻하게 다독여 주는 세계 최고의 웰니스 힐링 AI 코치 '명심 힐러'입니다.
사용자가 명심 마음 치유 리포트를 읽다가, 아래의 문장이 조금 어렵거나 마음에 와닿지 않아 '쉽고 자상한 해설'을 요청했습니다.

사용자가 드래그한 문장: "${sentence}"

위 문장 속에 담긴 심오한 심리적 의미나 사주명리학적 통찰을, [5세 아이도 듣자마자 무릎을 탁 치며 단번에 이해할 수 있을 만큼] 일상적이고 다정한 비유를 들어 아주 쉽게 풀어서 해설해 주세요.

[작성 규칙]
1. **전문 용어 전면 금지**: CBT, DBT, ACT, 십신, 오행, 일간 등 어려운 학술/명리 용어는 절대로 쓰지 마세요.
2. **다정하고 눈물겨운 위로의 어조**: 세상에서 가장 따뜻하고 포근한 선생님이나 엄마가 건네는 말투(예: "~랍니다", "~지요", "~해 보세요")로 작성하세요.
3. **일상적이고 사랑스러운 비유 활용**: 예컨대 "마음속에 켜둔 작은 비상등", "어깨에 지고 있던 무거운 모래주머니", "마음 밭에 내리는 보슬비" 같은 따뜻한 생활 속 비유를 들어 설명하세요.
4. **구체적인 실천 격려**: "이 말은 당신이 부족하다는 뜻이 아니라, 상처받지 않으려고 그동안 정말 열심히 마음의 비상벨을 켜두었던 것이니 이제는 편안하게 한숨 내려놓아도 괜찮다는 위로의 편지랍니다."라는 맥락의 깊은 응원을 담아주세요.
5. **텍스트 분량**: 4~5문장 내외로, 너무 길지 않고 스크롤 압박이 없도록 가독성 있게 작성하세요.

반드시 지혜롭고 눈물 나게 아름다운 한글로 출력해 주세요.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    return NextResponse.json({ success: true, explanation: responseText.trim() });

  } catch (error: any) {
    console.error('[Explain Sentence API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
