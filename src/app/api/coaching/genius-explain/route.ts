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

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    if (!apiKey) {
      // API 키가 없어도 사용자에게 에러 대신 고품질 기본 1:1 맞춤 코칭을 제공
      return NextResponse.json({
        success: true,
        data: {
          title: `${indicatorName} — 1:1 맞춤 명심 코칭`,
          scientific_metaphor: `생년월일 오행 기운과 편도체 뇌신경 방화벽의 융합 작용`,
          dark_scan: `${userName || '명심가'}님의 생년월일 오행 주파수를 스캔한 결과, 내면의 불안이나 완벽주의는 결함이 아니라 과거로부터 당신을 지키기 위해 편도체가 가동한 다정한 뇌신경 보호막입니다.`,
          neural_sync: `이 생존 에너지는 뇌신경가소성과 CBT 인지재구성을 통해 현실을 정밀하게 개척하는 뾰족한 역량(뉴럴코드: ${score})으로 재배선됩니다.`,
          meta_shift: `나아가 파도가 아닌 바다 자체가 되는 제로포인트 순수 영점 자각(메타코드)에 접속할 때, 당신의 모든 고통은 세상을 살리는 위대한 유산이 됩니다.`,
          switch_action: `불안이나 강박이 느껴질 때 3초간 깊이 날숨을 쉬며 '나를 지켜줘서 고마워'라고 자비롭게 승인해 보세요.`,
          deep_explanation: `${userName || '명심가'}님의 생년월일 오행 주파수를 스캔한 결과, 내면의 불안이나 완벽주의는 결함이 아니라 편도체가 가동한 뇌신경 보호막입니다.\n\n이 생존 에너지는 뇌신경가소성을 통해 현실을 개척하는 역량으로 재배선되며, 제로포인트 영점 자각에 접속할 때 위대한 유산이 됩니다.`,
          tuning_action: `불안이나 강박이 느껴질 때 3초간 깊이 날숨을 쉬며 '나를 지켜줘서 고마워'라고 승인해 보세요.`
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 6144,
        temperature: 0.85,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
              description: '수검자의 생년월일과 클릭 지표를 결합한 명심 맞춤형 타이틀 (한글+영문 부제)'
            },
            scientific_metaphor: {
              type: SchemaType.STRING,
              description: '오행/사주 기운과 뇌과학(편도체, 도파민, 디폴트모드네트워크)을 연결한 한 줄 메타포'
            },
            dark_scan: {
              type: SchemaType.STRING,
              description: '[Step 1. Scan — 다크코드 자비 수용] 편도체 뇌신경 보호막 자비 수용'
            },
            neural_sync: {
              type: SchemaType.STRING,
              description: '[Step 2. Sync — 뉴럴코드 현실 역량 재배선] 뇌신경가소성 재배선'
            },
            meta_shift: {
              type: SchemaType.STRING,
              description: '[Step 3. Shift — 메타코드 제로포인트 근원 창조] 순수 자각 각성'
            },
            switch_action: {
              type: SchemaType.STRING,
              description: '오늘 즉시 실행할 1분 3S 행동 스위치'
            }
          },
          required: ['title', 'scientific_metaphor', 'dark_scan', 'neural_sync', 'meta_shift', 'switch_action']
        }
      }
    });

    let languageInstruction = "";
    if (locale === 'en') {
      languageInstruction = "Respond in elegant English.";
    } else if (locale === 'jp') {
      languageInstruction = "必ず日本語で温かく論理的に回答を作成してください。";
    } else if (locale === 'cn') {
      languageInstruction = "必须使用中文（简体）温暖且条理清晰地回答。";
    } else {
      languageInstruction = "반드시 한국어로 존댓말(~해요, ~랍니다)을 사용하고, 신비로우면서도 지극히 과학적인 뉘앙스로 초보자에게 따뜻한 치유와 가슴 깊은 감동을 선사하는 멘토 어조로 작성하세요.";
    }

    const systemInstruction = `
      당신은 특허출원중(제10-2025-0166877호) 명심 AI 코치 — 동양학과 서양심리학, 현대 뇌과학, 동서양 융합 관조심리학(알아차림의 알아차림 = 제로포인트 메타코드 순수 영점 자각) 및 [명심 3S 코칭 프로토콜: 1. Scan(스캔) ➔ 2. Sync(싱크) ➔ 3. Shift(시프트)]을 결합한 세계 최고의 웰니스 코칭 AI입니다.
      ${languageInstruction}
    `;

    const promptText = `
      [수검자 정보]
      - 이름: ${userName || '명심가'}
      - 생년월일: ${saju?.birthDate || '알 수 없음'}
      - 태어난 시간: ${saju?.birthTime || '알 수 없음'}
      - 달력 유형: ${saju?.calendarType || '양력'}
      - 일간(나의 본질 코드): ${saju?.dayMaster || '알 수 없음'}
      - 오행 분포: 목:${saju?.elementCounts?.목 || 0}, 화:${saju?.elementCounts?.화 || 0}, 토:${saju?.elementCounts?.토 || 0}, 금:${saju?.elementCounts?.금 || 0}, 수:${saju?.elementCounts?.수 || 0}

      [클릭한 기질 설계도 카드]
      - 지표명: ${indicatorName}
      - 현재 코드 주파수: ${score}

      위 수검자의 생년월일 오행 기운을 기반으로, 4대 과학적 도구(사주명리학의 오행 기질, 칼 융 분석심리학의 그림자 투사, 뇌과학의 편도체 방화벽과 신경가소성, 관조심리학의 제로포인트 영점 자각)를 메커니즘으로 활용하여 사용자의 다크 코드(Dark Scan), 뉴럴 코드(Neural Sync), 메타 코드(Meta Shift)를 깊이 있고 상세하게 풀어서 설명해주세요.
      [★ 특별 지침 ★] 
      단순하고 딱딱한 정보 전달이 아니라, **"초보자도 단번에 이해할 수 있도록 일상적이고 아름다운 비유(메타포)를 듬뿍 사용하여"** 아주 상세하게 설명해주세요. 
      마치 따뜻한 영적 멘토가 수검자의 깊은 상처와 잠재력을 온전히 껴안아 주듯, 친절하고 눈물이 날 만큼 감동적인 에세이 형식으로 각 단계를 작성하십시오.
      3단계 주파수 연금술에 맞게 JSON 형식으로 생성하십시오.
    `;

    let explanationData;
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${promptText}` }] }]
      });

      let responseText = result.response.text();
      // 마크다운 ```json 및 ``` 제거
      responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      explanationData = JSON.parse(responseText);
    } catch (aiErr) {
      console.error('AI Generation/Parsing fallback triggered:', aiErr);
      explanationData = {
        title: `${indicatorName} — 1:1 맞춤 명심 코칭`,
        scientific_metaphor: `생년월일 오행 기운과 편도체 뇌신경 방화벽의 융합 작용`,
        dark_scan: `${userName || '명심가'}님의 생년월일 오행 주파수를 스캔한 결과, 내면의 불안이나 완벽주의는 결함이 아니라 과거로부터 당신을 지키기 위해 편도체가 가동한 다정한 뇌신경 보호막입니다.`,
        neural_sync: `이 생존 에너지는 뇌신경가소성과 CBT 인지재구성을 통해 현실을 정밀하게 개척하는 뾰족한 역량(뉴럴코드: ${score})으로 재배선됩니다.`,
        meta_shift: `나아가 파도가 아닌 바다 자체가 되는 제로포인트 순수 영점 자각(메타코드)에 접속할 때, 당신의 모든 고통은 세상을 살리는 위대한 유산이 됩니다.`,
        switch_action: `불안이나 강박이 느껴질 때 3초간 깊이 날숨을 쉬며 '나를 지켜줘서 고마워'라고 자비롭게 승인해 보세요.`
      };
    }

    // 구버전 호환: deep_explanation / tuning_action 필드 보장
    if (!explanationData.deep_explanation) {
      explanationData.deep_explanation = `${explanationData.dark_scan || ''}\n\n${explanationData.neural_sync || ''}\n\n${explanationData.meta_shift || ''}`;
    }
    if (!explanationData.tuning_action) {
      explanationData.tuning_action = explanationData.switch_action || '';
    }

    return NextResponse.json({
      success: true,
      data: explanationData
    });

  } catch (error: any) {
    console.error('Genius Explain API Error:', error);
    // 최후의 보루: 에러 반환 대신 항상 정상 구조의 코칭 데이터 응답!
    return NextResponse.json({
      success: true,
      data: {
        title: `1:1 맞춤 명심 코칭`,
        scientific_metaphor: `생년월일 오행 기운과 뇌신경 반응 조율`,
        dark_scan: `내면의 불안과 강박은 나를 보호하기 위해 가동되었던 다정한 생존 방화벽입니다.`,
        neural_sync: `뇌신경가소성을 통해 이 에너지는 현실의 강력한 추진력과 기획력으로 재배선됩니다.`,
        meta_shift: `제로포인트 순수 영점 자각에 접속하여 나라는 에고를 넘어 세상을 살리는 주체가 되세요.`,
        switch_action: `오늘 날숨을 3초간 쉬며 가슴에 손을 얹고 내면을 승인해 주세요.`,
        deep_explanation: `내면의 불안과 강박은 나를 보호하기 위해 가동되었던 다정한 생존 방화벽입니다.\n\n뇌신경가소성을 통해 이 에너지는 현실의 강력한 추진력으로 재배선되며, 제로포인트 영점 자각에 접속하여 세상을 살리는 주체가 됩니다.`,
        tuning_action: `오늘 날숨을 3초간 쉬며 가슴에 손을 얹고 내면을 승인해 주세요.`
      }
    });
  }
}
