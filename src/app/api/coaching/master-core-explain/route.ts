import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const {
      moduleKey,
      moduleLabel,
      userName,
      sajuPillars,
    } = await req.json();

    if (!moduleKey || !moduleLabel) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다 (moduleKey, moduleLabel).' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });

    const prompt = `당신은 마음과 운명을 치유하는 따뜻하고 지혜로운 '명심코칭' 전문 카운셀러이자 영적 동반자입니다.
사용자 이름: ${userName || '익명'}
사주 원국 4주: ${sajuPillars ? JSON.stringify(sajuPillars) : '미입력'}

이번에 사용자가 관심을 가지고 알고자 하는 마음 코어 메뉴:
- 메뉴명: ${moduleLabel}
- 모듈 키: ${moduleKey}

각 모듈 키의 의미:
- chat: 내 안의 타고난 기질과 성격의 온도를 탐색하는 '내 안의 씨앗 찾기(기질 스캔)'
- mental: 내면의 불안과 스트레스를 치유하고 평온을 찾는 '지친 마음 위로하기(마음 다독임)'
- value: 나의 고유한 에너지가 세상과 만나 어떻게 이로운 가치를 창조할지 찾는 '세상과 따뜻하게 연결되기(사회적 가치 발견)'
- step-back: 육체적 통증과 생각의 연결고리를 끊고, 나와 온 세상을 동시에 바라보는 의식의 도약을 체험하는 '거울 뒤로 한 걸음(안팎 조망 및 주객 비이원 자각)'
- matrix: 고정관념에서 벗어나 4차원의 넓은 관점으로 의식을 도약시키는 '나의 마음 공간 넓히기(마음 성장)'
- cafe: 여러 감정과 생체 에너지가 조화롭게 흐를 수 있도록 돕는 '인생의 톱니바퀴 조율하기(조화와 조율)'

위 메뉴에 대해 이 사용자의 사주 정보를 바탕으로 "왜 이 분석과 체험이 이 사용자에게 지금 필요한지", "이 모듈을 통해 어떤 위로와 힘을 얻을 수 있는지"를 초보자도 한눈에 이해할 수 있는 아주 쉽고 다정한 한국어로 감동적으로 작성해 주세요.

[요구사항]
- 자연의 비유(예: 겨울의 땅 아래서 싹을 틔우는 씨앗, 잔잔하게 흐르는 강물, 단단하게 마음을 감싸는 숲 등)를 사용하여 설명해주세요.
- 복잡하고 차가운 IT 기술 용어(예: 알고리즘, 매트릭스, 시스템, 스캔 등)는 친근하고 직관적인 한국어(예: 인생의 흐름, 마음의 지도, 삶의 톱니바퀴, 내면의 거울 등)로 바꾸어서 감동적으로 풀어써주세요.
- 어려운 명리학 한자나 용어도 배제하거나 아주 쉽게 풀이해서 다정하게 짚어주세요.
- 사주 원국에 있는 글자(갑, 을, 병, 정... 자, 축, 인, 묘...)가 있다면 그 성격적 온도를 살짝 언급하며 다독여주면 더욱 소름 끼치고 감동적입니다.

[출력 형식]
1. 🌸 마음의 노크 (사용자의 현재 마음이나 사주와 연결된 따뜻한 한 줄 인사 및 의미 부여)
2. 🌿 따뜻한 메타포 (이 모듈을 자연의 모습에 빗대어 쉽게 풀어낸 비유적 설명)
3. 🔍 우리만의 비밀 이야기 (이 메뉴 안에서 사용자가 발견하게 될 구체적 가치와 내면의 힘, 3-4문장)
4. 💡 오늘의 작은 알아차림 (일상에서 실천해볼 수 있는 소박하지만 따뜻한 행동 제안 2가지)
5. ✨ 당신을 향한 한 장의 편지 (한 줄의 시적인 위로와 격려)

각 섹션은 줄바꿈으로 명확히 구분하고, 마음에 깊이 와닿는 다정한 말투(~해요, ~랍니다)를 사용하여 감동을 전해 주세요.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error('Master Core Explain API error:', error);

    return NextResponse.json(
      {
        explanation:
          '🌸 마음의 길을 찾는 중에 잠시 안개가 끼었어요.\n\n' +
          '🌿 안개는 곧 걷히고 햇살이 비추듯이, 곧 다시 온화한 가이드를 들려드릴게요.\n\n' +
          '🔍 우리 내면을 밝혀줄 지혜의 등불을 켜는 중이니, 잠시 후 다시 한 번 카드를 클릭해 주세요.\n\n' +
          '💡 크게 심호흡을 한 번 하고 어깨의 힘을 툭 빼보세요.\n\n' +
          '✨ 당신의 마음은 늘 흐림 뒤에 맑음이랍니다.',
      },
      { status: 200 }
    );
  }
}
