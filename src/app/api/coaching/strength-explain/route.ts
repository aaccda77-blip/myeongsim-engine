import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const categoryLabelMap: Record<string, string> = {
  forceField: '역장(Force Field) 분석',
  talentProfile: '재능 프로필',
  cooperation: '협력 역량',
  powerbase: '파워베이스',
  specificTalent: '세부 재능',
};

export async function POST(req: NextRequest) {
  try {
    const {
      category,
      itemKey,
      itemLabel,
      itemValue,
      userName,
      sajuPillars,
    } = await req.json();

    if (!category || !itemLabel || itemValue === undefined) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다 (category, itemLabel, itemValue).' },
        { status: 400 }
      );
    }

    const categoryName = categoryLabelMap[category] || category;

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });

    const prompt = `당신은 '명심코칭' 전문 사주명리 상담사입니다.
사용자 이름: ${userName || '익명'}
사주 원국 4주: ${sajuPillars ? JSON.stringify(sajuPillars) : '미입력'}

분석 대상:
- 카테고리: ${categoryName}
- 항목: ${itemLabel}
- 점수: ${itemValue}/100

위 항목에 대해 아래 형식으로 초보자도 이해할 수 있도록 상세히, 은유법과 비유법을 사용하여, 감동적이고 다정하게 설명해주세요:

[특별 가이드]
- 만약 분석 카테고리가 '파워베이스' 또는 '조직 기여'와 관련되어 있다면, 해당 항목(예: 지속가능성 유지, 구조와 체계 구축 등)이 회사나 모임 등의 사회 조직 속에서 실제로 어떻게 발현되는 강점인지 사주 십성(비겁, 식상, 재성, 관성, 인성) 기운의 뜻과 연결하여 아주 쉽게 풀어 설명해 주세요.
- 초보자가 사주나 십성을 전혀 모르더라도 "아, 내가 그래서 모임이나 일터에서 이런 행동을 하고 이 역할을 잘 해냈구나!" 하고 무릎을 치며 소름 돋아 할 만한 삶의 팁을 자연물이나 구체적 역할에 비유해서 다정하게 짚어주세요.

1. 🌟 한 줄 요약 (이 항목이 당신에게 의미하는 것)
2. 🌿 은유적 해석 (자연이나 일상의 비유로 쉽게 설명)
3. 🔍 상세 분석 (이 점수가 의미하는 구체적 내용, 3-4문장)
4. 💡 실천 조언 (일상에서 이 에너지를 활용하는 구체적 방법 2가지)
5. ✨ 명심 한마디 (한 줄 명언 형식의 격려)

각 섹션은 줄바꿈으로 구분하고, 초보자가 사주를 전혀 몰라도 이해할 수 있도록 쉬운 말로 작성하세요.
절대로 어려운 한자어나 전문용어를 날것으로 사용하지 마세요.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error('Strength Explain API error:', error);

    return NextResponse.json(
      {
        explanation:
          '🌟 지금은 분석 결과를 불러오는 중에 잠시 어려움이 있었어요.\n\n' +
          '🌿 마치 구름이 잠시 달을 가린 것처럼, 곧 다시 맑아질 거예요.\n\n' +
          '🔍 잠시 후 다시 시도해 주시면 더 정확한 분석을 보여드릴게요.\n\n' +
          '💡 잠깐의 여유를 가지고, 차 한 잔의 따스함을 느껴보세요.\n\n' +
          '✨ 기다림도 당신을 위한 시간입니다.',
      },
      { status: 200 }
    );
  }
}
