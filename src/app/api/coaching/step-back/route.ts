import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || '').trim());

export async function POST(req: NextRequest) {
  try {
    const {
      birthDate,
      birthTime,
      userName,
      sajuPillars,
      userConcern,
    } = await req.json();

    if (!birthDate) {
      return NextResponse.json(
        { error: '생년월일 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `당신은 마음의 고통을 씻어내고 의식의 눈을 뜨게 돕는 명심코칭(明心)의 거울 마스터입니다.
구도자가 자신의 생년월일(혹은 사주)과 현재 겪고 있는 내면의 흔들림(통증, 감정, 고민)을 고백하고, 주객의 분리를 깨고 평온으로 도약하는 [거울 뒤로 한 걸음 (안팎 조망)] 셀프코칭 세션에 참여하고 있습니다.

[구도자 정보]
- 이름: ${userName || '익명의 구도자'}
- 생년월일: ${birthDate}
- 태어난 시간: ${birthTime && birthTime !== 'unknown' ? birthTime : '모름/미입력'}
- 사주 원국 정보: ${sajuPillars ? JSON.stringify(sajuPillars) : '미추출'} (※ 만약 사용자가 새로 기입한 생년월일/태어난 시간 정보가 사주 원국 정보와 다를 경우, 새로 기입한 생년월일과 태어난 시간 정보를 최우선 기준으로 삼아 기질을 유추하여 리포트를 생성해 주세요.)
- 현재 겪고 있는 고통/고민: "${userConcern || '구체적인 고민을 적지 않고 침묵 속에 있음'}"

[명심코칭 '거울 뒤로 한 걸음' 핵심 철학]
1. 육체적 통증이나 심리적 감정은 100% 사실인 '생물학적 느낌'일 뿐이며, "내가 아프다"거나 "내가 화난다"고 결합하는 것은 덧씌워진 허망한 '생각(최면)'에 불과합니다.
2. 경험을 겪는 독자적인 주체인 '나'는 본래 실체가 없으며, 느껴지는 모든 것은 단지 거울에 비쳐 지각되는 대상(객체)일 뿐입니다.
3. 시선을 좁은 육신에서 뒤로 한 걸음 물러나 '나(육체)'와 '눈앞의 세상'을 동시에 조망할 때, 안팎의 경계선이 사라지고 주객이 분리되지 않은 광활한 '한바탕(본래거울)'의 자유를 체득하게 됩니다.

[작성 요구사항]
- 사용자의 생년월일(사주) 기질과 현재의 고민을 따뜻하게 연계하여, 이 고통이 결코 '자신'이 아니며, 거울 뒤로 물러나면 즉시 사라질 그림자임을 깨닫게 해주는 최고급 셀프코칭 리포트를 생성해 주세요.
- 말투는 몹시 따뜻하고 감동적이며 친절한 경어체 (~해요, ~랍니다)를 사용하십시오.
- 절대로 복잡하거나 건조한 기술 용어를 쓰지 말고, 자연물(예: 거대한 바다와 파도, 비치는 맑은 시냇물, 구름 등)을 비유하여 시적으로 설명하세요.
- 반드시 아래 JSON 포맷을 엄격히 준수하여 순수 JSON 데이터만 리턴하세요. 마크다운 코드블록(\`\`\`json ...)은 절대 포함하지 마십시오.

[JSON 출력 형식]
{
  "greeting": "사용자의 생년월일/사주적 특성과 고민을 다정하게 위로하며 마음을 여는 한 줄 편지",
  "metaphor": "사용자의 타고난 에너지에 어울리는 자연의 비유와 '거울 뒤로 물러남'의 개념을 연결한 설명",
  "coaching_insight": "통증/고민과 나를 분리하는 구체적인 거울 자각 관점. (느낌과 생각의 쇠사슬을 어떻게 자를지 설명)",
  "self_dialogue": [
    "구도자가 스스로에게 던지며 나라는 착각을 깨트릴 수 있는 강력한 반조 질문 1",
    "구도자가 스스로에게 던지며 나라는 착각을 깨트릴 수 있는 강력한 반조 질문 2",
    "구도자가 스스로에게 던지며 나라는 착각을 깨트릴 수 있는 강력한 반조 질문 3"
  ],
  "blessing": "마음의 평온을 선물하는 한 줄의 아름다운 거울 축복송 또는 시"
}

반드시 순수 JSON 텍스트만 리턴해야 합니다.`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();
    
    // 백틱 코드블럭 청소 가드 로직
    if (text.startsWith("```")) {
      const lines = text.split('\n');
      if (lines[0].startsWith("```")) {
        lines.shift();
      }
      if (lines[lines.length - 1].startsWith("```")) {
        lines.pop();
      }
      text = lines.join('\n').trim();
    }

    // JSON 유효성 선행 검증 (실패 시 catch 블록의 듬직한 fallback JSON으로 우회)
    try {
      JSON.parse(text);
    } catch (e) {
      console.error("Gemini response is not valid JSON, using fallback. Raw text:", text);
      throw new Error("Invalid JSON response format from AI");
    }

    return new NextResponse(text, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Step back API error:', error);
    return NextResponse.json(
      {
        greeting: "잠시 마음의 거울에 먼지가 끼었습니다.",
        metaphor: "바람이 불어 구름이 걷히듯, 마음을 가만히 내려놓으면 본래의 맑은 거울이 비칩니다.",
        coaching_insight: "통증과 생각의 연결고리를 툭 내려놓고, 아픔을 지켜보는 텅 빈 앎의 자리에 가만히 머물러 보세요.",
        self_dialogue: [
          "이 아픔을 느끼는 '나'라는 주체가 고통 바깥에 따로 존재하나요?",
          "일어나는 감정의 파도는 어디서 와서 어디로 사라지나요?",
          "안과 밖을 구분 짓는 이 생각의 벽은 언제 세워진 것인가요?"
        ],
        blessing: "파도가 아무리 높게 일어도, 바다의 심연은 한없이 고요합니다."
      },
      { status: 200 }
    );
  }
}
