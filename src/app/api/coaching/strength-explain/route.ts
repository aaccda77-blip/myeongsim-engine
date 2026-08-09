import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const categoryLabelMap: Record<string, string> = {
  forceField: '본질 에너지 포스필드 (Force Field)',
  talentProfile: '업무 & 행동 역량 프로필',
  cooperation: '협력 & 파트너십 시너지',
  powerbase: '조직 파워베이스 & 기여도',
  specificTalent: '핵심 특수 강점 슈퍼파워',
  total360: '세계 최고 360° 통합 다각도 통찰',
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

    if (!category || !itemLabel) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다 (category, itemLabel).' },
        { status: 400 }
      );
    }

    const categoryName = categoryLabelMap[category] || category;

    // [Fix] sajuPillars가 [object Object]로 파싱되는 현상을 완벽 방어
    let sajuText = '';
    if (typeof sajuPillars === 'string' && !sajuPillars.includes('[object Object]')) {
      sajuText = sajuPillars;
    } else if (sajuPillars && typeof sajuPillars === 'object') {
      try {
        const parts = Object.values(sajuPillars).map((p: any) => {
          if (typeof p === 'string') return p;
          if (typeof p === 'object' && p !== null) {
            const g = typeof p.gan === 'object' ? (p.gan.hangeul || p.gan.hanja || '') : (p.gan || '');
            const j = typeof p.ji === 'object' ? (p.ji.hangeul || p.ji.hanja || '') : (p.ji || '');
            return `${g}${j}`;
          }
          return '';
        }).filter(Boolean);
        sajuText = parts.join(' ');
      } catch (e) {
        sajuText = '';
      }
    }

    if (!sajuText || sajuText.includes('[object Object]')) {
      sajuText = userName ? `${userName}님의 타고난 생년월일 사주 명리 기질 원국` : '타고난 생년월일 사주 명리 기질 원국';
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });

    const isTotalReport = category === 'total360' || itemKey === 'total360';

    const prompt = isTotalReport
      ? `당신은 세계 최고 수준의 '3세대 최신 심리 과학적 도구 & 사주명리학 융합 웰니스 Master AI 코치'입니다.
사용자 이름: ${userName || '명심가'}
분석 대상 사주 기질 원국: ${sajuText}

[요청 사항]
${userName}님의 강점/재능 전체 데이터를 다각도(360도)로 통합 분석하여, 사용자가 삶과 일터에서 최고의 성과와 마음의 평온을 동시에 얻을 수 있는 '세계 최고 360° 강점 심층 통찰 총평'을 작성해 주세요.

절대로 데이터 연동 에러 메시지(예: [object Object])나 사주 미입력에 관한 사과문을 포함하지 마시고, 바로 밝고 품격 있는 명심 코칭 톤으로 답변을 시작하세요.

아래 5가지 파트로 구분하여 깊이 있고 격조 높게 작성해 주세요:
1. 🌟 360° 핵심 강점 총평 (본질 에너지의 근원과 독보적 강점)
2. 🌿 뇌신경 & 기질 융합 역량 (업무, 협력, 조직에서의 발현 방식)
3. 🔍 스트레스 방어 & 인지 탈융합 (주의해야 할 다크코드 및 회복 탄력성)
4. 💡 300% 성과 가속 스케일업 로드맵 (가장 잘 어울리는 역할과 파트너십)
5. ✨ 1분 제로포인트 영점 성찰 앵커 (오늘 바로 실천할 1분 행동 지침)

격려와 영감을 주는 다정한 톤으로, 깊은 통찰과 실용적인 지침을 제공해 주세요.`
      : `당신은 세계 최고 수준의 '3세대 최신 심리 과학적 도구 & 사주명리학 융합 웰니스 Master AI 코치'입니다.
사용자 이름: ${userName || '명심가'}
분석 대상 사주 기질 원국: ${sajuText}

분석 대상:
- 카테고리: ${categoryName}
- 항목: ${itemLabel}
- 점수/수치: ${itemValue}/100

위 항목에 대해 다각도(360도)로 깊이 있게 분석하여, 초보자도 한눈에 이해하고 무릎을 칠 수 있도록 다정하고 직관적으로 설명해 주세요:

1. 🌟 360° 다각도 역량 진단 (이 강점이 의미하는 핵심 가치와 뇌신경-기질의 결합)
2. 🌿 직무 & 커리어 발현 비유 (자연물이나 사회적 역할에 비유한 쉬운 설명)
3. 🔍 300% 레버리지 가속 스위치 (이 재능을 3배 더 효과적으로 활용하는 노하우)
4. 💡 인지 왜곡(다크코드) 예방 (과유불급일 때 주의할 점과 멘탈 밸런싱)
5. ✨ 1분 실천 성찰 앵커 (오늘 바로 삶에 적용할 한 줄 훈련법)

각 섹션은 이모지 헤더로 구분하고, 깊은 감동과 실용적 팁을 담아 친절하게 작성하세요.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error('Strength Explain API error:', error);

    return NextResponse.json(
      {
        explanation:
          '🌟 360° 다각도 분석 결과를 불러오는 중에 잠시 연결이 연장되고 있습니다.\n\n' +
          '🌿 잠시 후 다시 클릭해 주시면 당신의 독보적인 강점과 뇌신경 융합 분석을 완벽히 선보이겠습니다.\n\n' +
          '🔍 기다리는 순간에도 당신의 본질 에너지는 여전히 아름답게 빛나고 있습니다.\n\n' +
          '💡 차 한 잔의 여유로 마음의 주파수를 432Hz 평온으로 맞추어 보세요.\n\n' +
          '✨ 당신의 무한한 가능성을 항상 응원합니다.',
      },
      { status: 200 }
    );
  }
}
