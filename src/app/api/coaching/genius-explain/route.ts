import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: Request) {
  try {
    const { userName, saju, locale, indicatorName, score } = await request.json();

    if (!indicatorName) {
      return NextResponse.json({ error: '지표 정보가 필요합니다.' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2000,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING, description: '클릭한 지표에 매칭되는 명심코칭식 세련된 융합 한글/영문 타이틀' },
            scientific_metaphor: { type: SchemaType.STRING, description: '오행/십신 기운과 뇌과학/생리학적 작용 원리를 알기 쉽게 비유한 한 문장의 메타포 설명' },
            deep_explanation: { type: SchemaType.STRING, description: '초보자도 무릎을 탁 칠 만큼 쉽고 상세하며, 가슴 깊이 위로를 주고 감동을 선사하는 코칭 해설 텍스트 (약 3~4문장)' },
            tuning_action: { type: SchemaType.STRING, description: '이 기운의 점수 상태를 내 일상에서 조율하고 튜닝하기 위해 오늘 바로 실천할 구체적이고 사소한 1단계 액션 가이드' }
          },
          required: ['title', 'scientific_metaphor', 'deep_explanation', 'tuning_action']
        }
      }
    });

    let languageInstruction = "";
    if (locale === 'en') {
      languageInstruction = `
        - Respond in elegant and fluid English.
        - East-West Mapping: Ensure Eastern Myeongri/Saju terms (Bi-Geop, Sik-Sang, Jae-Seong, Gwan-Seong, In-Seong) are mapped to Carl Jung's psychological archetypes (The Sovereign / Self-Assertion, The Alchemist of Expression / Creative Force, The Master of Reality / Manifestation Energy, The Guardian of Order / Structural Discipline, The Mystic Sage / Deep Archetypal Thinker).
        - Structure all output properties (title, scientific_metaphor, deep_explanation, tuning_action) in beautiful English.
      `;
    } else if (locale === 'jp') {
      languageInstruction = "必ず日本語で温かく論理的に回答を作成してください。全てのプロパティの値を日本語で記述してください。";
    } else if (locale === 'cn') {
      languageInstruction = "必须使用中文（简体）温暖且条理清晰地回答。所有属性的文本均需使用中文記述。";
    } else {
      languageInstruction = "반드시 한국어로 존댓말(~해요, ~랍니다)을 사용하고, 신비로우면서도 지극히 과학적인 뉘앙스로 초보자에게 따뜻한 치유와 가슴 깊은 감동을 선사하는 멘토 어조로 작성하세요.";
    }

    const systemInstruction = `
      당신은 사주명리 오행/십신과 현대의 인지뇌과학, 심리분석학을 융합한 정신 조율 시스템 '명심 OS - 천부지표 AI 도슨트 모듈'입니다.
      사용자가 자신의 천부성정 지포트 그래프에서 특정 지표를 터치했을 때, 그 지표의 수치와 유저의 사주 특징을 바탕으로 해설 카드를 실시간 생성합니다.

      [지표 해설 원칙]
      1. 사주 용어(예: 비견, 편인 등)를 서술할 때는 현대 뇌과학적 메커니즘(예: 도파민 회로, 디폴트 모드 네트워크, 코티솔 관리, 편도체 안정)과 연계하여 아주 쉽게 설명해 주십시오.
      2. 수치가 높거나 낮음에 대한 해석을 이분법적 좋고 나쁨으로 분류하지 말고, '모든 기운은 그 자체로 완벽한 도구이자 에너지원'임을 일깨워주며 깊은 용기와 자기 수용(Self-Acceptance)을 이끌어내십시오.
      3. 강조를 나타낼 때는 마크다운 **강조**를 사용하고, 줄바꿈은 개행 문자(\\n)를 이용하십시오. 절대 HTML 태그를 사용하지 마십시오.

      ${languageInstruction}
    `;

    const promptText = `
      [유저 및 지표 정보]
      - 이름: ${userName || '명심가'}
      - 일간(나의 본질): ${saju?.dayMaster || '알 수 없음'}
      - 오행 분포: 목:${saju?.elementCounts?.목 || 0}, 화:${saju?.elementCounts?.화 || 0}, 토:${saju?.elementCounts?.토 || 0}, 금:${saju?.elementCounts?.금 || 0}, 수:${saju?.elementCounts?.수 || 0}
      - 클릭한 지표명: ${indicatorName}
      - 획득 점수/수치: ${score}

      이 지표에 대한 상세 도슨트 가이드를 JSON 형식으로 반환하십시오.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }]
    });

    const responseText = result.response.text();
    const explanationData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: explanationData
    });

  } catch (error: any) {
    console.error('Genius Explain API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI 도슨트 해설 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
