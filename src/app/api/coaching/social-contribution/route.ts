import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { 
      userName, 
      birthOhaeng, 
      giveElement, 
      receiveElement 
    } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `당신은 동양의 사주명리학과 현대 사회학, 그리고 인지심리학을 통합한 최고 권위의 '명심(明心) 상생 공헌 라이프 아키텍트'입니다.
사용자 이름: ${userName || '익명'}

[사용자 선천 오행 분포]
- 전체 오행 정보: ${JSON.stringify(birthOhaeng || {})}
- 나눔 오행(가장 강해 사회에 기부해야 할 축복의 에너지): ${giveElement || '알 수 없음'}
- 채움 오행(가장 약해 타인과의 협력으로 상생해 채워야 할 결핍의 에너지): ${receiveElement || '알 수 없음'}

위 오행 상생(相生)의 원리를 바탕으로, 사용자가 자신의 넘치는 오행 에너지를 어떻게 세상에 아낌없이 베풀어 기여하고(나눔), 비어 있는 오행의 틈새를 어떻게 타인의 지혜로 부드럽게 채워 조화를 이룰지(채움)에 대한 초개인화된 정밀 리포트를 작성해 주세요.

[작성 규칙]
1. 난해한 한자어나 기계적인 풀이 대신, 초보자도 바로 이해하고 감동받을 수 있도록 일상의 다정한 언어로 풀어 쓰세요.
2. 기부와 협력이라는 주제에 맞게 "우리는 연결되어 있으며, 내 부족함은 타인의 나눔을 위한 고마운 빈 그릇"이라는 따뜻하고 울림 있는 문체로 작성하세요.
3. 가독성을 위해 적절히 마크다운 개행 문자를 텍스트에 포함해 주세요.
4. 반드시 아래 JSON 형식 스펙을 완벽하게 지켜서 마크다운 백틱 없이 순수한 JSON으로만 응답하세요.

{
  "harmonyScore": 90, // 사용자의 상생 조화 지수 (0~100)
  "intro": "나의 오행과 세상이 맺은 상생의 약속 1줄 요약",
  "giveInsight": "가장 강한 오행을 활용해 세상에 베풀어야 할 상생 공헌 방식 상세 설명 (150~250자)",
  "receiveInsight": "가장 비어 있는 오행을 타인과의 협력 및 수용으로 극복하고 조화하는 상세 설명 (150~250자)",
  "microAction": "오늘 바로 실천할 수 있는 아주 사소하고 다정한 1가지 상생 공헌 행동 처방"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Social Contribution API generation error:', error);
    
    // 에러 발생 시 부드러운 Fallback 데이터 제공
    const fallbackData = {
      harmonyScore: 85,
      intro: '나의 가득 찬 기운을 흘려보내고, 비어 있는 틈새로 타인의 온기를 담아내는 우주적 상생의 궤적',
      giveInsight: '당신의 가장 충만한 오행 기운은 이미 세상을 널리 이롭게 할 준비를 마친 위대한 선물입니다. 이것을 내 안에 억지로 가두어 두지 않고, 도움이 필요한 이웃이나 사회적 가치를 위해 흘려보낼 때 당신의 내면 서버는 과부하 없이 맑고 가벼운 에너지를 유지하게 됩니다. 당신의 존재 자체가 세상에 건네는 따뜻한 유산입니다.',
      receiveInsight: '가장 비어 있는 오행 기운은 결코 부끄러워해야 할 단점이 아닙니다. 오히려 다른 기운을 가진 인연이 당신의 삶 속에 들어와 아름다운 역할을 할 수 있도록 남겨둔 "고마운 마음의 공터"입니다. 혼자서 모든 것을 완벽히 해내려 버둥거리지 않고, 타인의 강점을 기꺼이 감사히 수용할 때 비로소 우주적인 균형이 조화를 이루게 됩니다.',
      microAction: '주변 동료나 소중한 사람에게 "당신 덕분에 내가 참 든든하다"고 다정한 진심 전해보기.'
    };
    
    return NextResponse.json({ success: true, data: fallbackData });
  }
}
