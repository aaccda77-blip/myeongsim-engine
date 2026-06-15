import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { get3ThemeCrossoverValidation } from '@/utils/zimidusuLogic';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sajuData, zimidusuChart, userName } = body;

    if (!sajuData || !zimidusuChart) {
      return NextResponse.json({ error: 'Missing sajuData or zimidusuChart' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API key is not configured, falling back to local analysis.");
      const fallbackData = get3ThemeCrossoverValidation(sajuData, zimidusuChart, userName);
      return NextResponse.json(fallbackData);
    }

    const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
    const name = `${baseName}님`;
    const dayMaster = sajuData.day?.gan?.char || '';

    // Extract basic Zimidusu palace information
    const palaces = zimidusuChart.palaces || [];
    const getPalaceStars = (pName: string) => {
      const pal = palaces.find((p: any) => p.name === pName || p.name.includes(pName));
      return pal ? (pal.majorStars || []).map((s: any) => s.name).join(', ') : '밝고 온화한 별빛';
    };
    const jaebaekStars = getPalaceStars('재백');
    const bucheoStars = getPalaceStars('부처');

    // Format Saju data into a readable string
    const sajuString = `
      성명: ${name}
      년주: ${sajuData.year?.gan?.char}${sajuData.year?.ji?.char}
      월주: ${sajuData.month?.gan?.char}${sajuData.month?.ji?.char}
      일주: ${sajuData.day?.gan?.char}${sajuData.day?.ji?.char}
      시주: ${sajuData.time?.gan?.char}${sajuData.time?.ji?.char}
      일간(본질): ${dayMaster}
    `;

    const daewoonStartAge = sajuData.daewoonStartAge || 10;
    const daewoonList = sajuData.daewoon || [];
    const daewoonString = daewoonList.map((d: any) => `${d.age}세~${d.age + 9}세: ${d.ganzhi} 대운`).join(', ');

    const isTargetUser = 
      sajuData.year?.gan?.char === '경' && sajuData.year?.ji?.char === '신' &&
      sajuData.month?.gan?.char === '계' && sajuData.month?.ji?.char === '미' &&
      sajuData.day?.gan?.char === '신' && sajuData.day?.ji?.char === '사' &&
      sajuData.time?.gan?.char === '을' && sajuData.time?.ji?.char === '미';

    let daewoonInstruction = '';
    if (isTargetUser) {
      daewoonInstruction = `
      1. 대운수는 무조건 10입니다 (10세, 20세, 30세, 40세, 50세, 60세, 70세, 80세, 90세, 100세 단위로 운이 바뀜). 
         특히, 40대(40~49세)는 정해(丁亥) 대운, 50대(50~59세)는 무자(戊子) 대운, 60대(60~69세)는 기축(己丑) 대운, 70대(70~79세)는 경인(庚寅) 대운, 80대(80~89세)는 신묘(辛卯) 대운, 90대(90~99세)는 임진(壬辰) 대운, 100세 이상은 계사(癸巳) 대운으로 흘러갑니다.
      2. 사용자가 1980년생 경신년 계미월 신사일 을미시인 경우:
         - 40대 정해대운 시기(특히 초중반)에는 일지 사화 정관과 해수가 부딪히는 '사해충'으로 인해 혼란과 마음의 시련을 겪고 진로를 세밀하게 깎는 '연마기'였음을 설명하세요.
         - 2025년 을사년에 AI 기술을 도입하고, 2026년 병오년에 자신만의 지식 플랫폼을 런칭하고 구축 중인 현재 상황을 적극 반영하세요.
         - 50세(50~59세) 무자 대운에 진입하면 무토 정인의 정식 문서 권리와 자수 식신의 신자합(申子合) 작용으로 인생 최고의 대전성기 및 최고 수입 궤도에 정식 안착함을 설명하세요.
         - 60대(60~69세) 기축 대운에는 편인 간여지동의 견고함과 사축합(巳丑合)을 맞이하여 플랫폼을 라이선스화하고 교육 재단/자산으로 안착시켜 평생 번 부를 완벽하게 수호하고 사상적 거장(스승)으로 명예를 완결 지음을 설명하세요.
         - 70대(경인)부터 100세(계사) 이후까지의 노년기 인생 타이밍을 각각 자세히 짚어주세요.
      `;
    } else {
      daewoonInstruction = `
      1. 사용자의 실제 대운 시작 나이(대운수)는 ${daewoonStartAge}세이며, 10년 단위 대운 흐름은 다음과 같습니다: [${daewoonString}]
      2. 이 실제 대운 정보와 사주 원국을 바탕으로 사용자의 인생 흐름과 각 연령대별 라이프 로드맵을 100% 개인 맞춤식으로 설계하여 설명하세요.
         - 현재 사용자가 겪고 있거나 앞으로 지나갈 40대(40~49세), 50대(50~59세), 60대(60~69세), 70대~100세 이상의 대운 흐름을 주어진 대운 리스트[${daewoonString}]에서 해당 연령대의 대운 간지(예: O대운)를 정확히 찾아 매핑하고, 그 오행/십성적 특징을 바탕으로 현실적·심리적 흐름을 분석하세요.
         - 1980년생 기준의 해설(정해대운 사해충, 무자대운 신자합 등)은 절대 출력하지 말고, 제공된 실제 사주(${sajuString})와 대운 리스트[${daewoonString}]의 실제 정보를 기준으로 작성해야 합니다.
      `;
    }

    const prompt = `
      사주 명리학과 자미두수 자산을 크로스오버하여 사용자의 3대 라이프(재물운, 결혼/인연운, 인생 타이밍)를 교차 검증하는 감동적인 힐링 리포트를 생성해 주세요.
      
      사용자 정보:
      ${sajuString}
      자미두수 재백궁 주요 별: ${jaebaekStars}
      자미두수 부처궁 주요 별: ${bucheoStars}

      [필수 구현 지침]
      ${daewoonInstruction}
      3. 어조는 극도로 친절하고, 명리/자미 용어를 가급적 초보자도 한눈에 알기 쉽게 일상적인 따뜻한 비유와 시적인 언어로 순화하여 서술하세요.
      4. 마음챙김과 자기연민(MSC)을 결합하여 영혼에 따뜻한 위로를 주는 감동적인 힐링 에세이를 각 주제별로 반드시 작성하세요.
      
      반드시 아래 JSON 스키마를 완벽히 준수하여 JSON 문자열로만 응답해 주세요. 따옴표나 마크다운 포맷(e.g. \`\`\`json)은 생략하고 순수한 JSON만 반환해야 합니다:
      {
        "wealth": {
          "title": "💵 재물운 교차 검증 (Wealth Validation)",
          "metaphor": "비유적 은유 한 줄 제목",
          "sajuView": "사주명리학적 관점 상세 분석",
          "zimidusuView": "자미두수적 관점 상세 분석",
          "conclusion": "교차 검증 최종 결론 (연령대별 구체적인 최전성기 시점 및 재물 확장 전략)",
          "healingEssay": "자기연민을 기반으로 한 감동적인 힐링 에세이"
        },
        "marriage": {
          "title": "🪞 결혼운 교차 검증 (Marriage Validation)",
          "metaphor": "비유적 은유 한 줄 제목",
          "sajuView": "사주명리학적 관점 상세 분석",
          "zimidusuView": "자미두수적 관점 상세 분석",
          "conclusion": "교차 검증 최종 결론 (구체적인 결실 시점 및 관계 전략)",
          "healingEssay": "자기연민을 기반으로 한 감동적인 힐링 에세이"
        },
        "timing": {
          "title": "🧭 인생 타이밍 교차 검증 (Timing Validation)",
          "metaphor": "비유적 은유 한 줄 제목",
          "sajuView": "사주명리학적 관점 상세 분석 (40대 정해대운 및 50대 무자대운 등의 시너지)",
          "zimidusuView": "자미두수적 관점 상세 분석 (대한/유년궁 흐름)",
          "conclusion": "교차 검증 최종 결론 (40대, 50대, 60대, 70대, 80대, 90대, 100세+ 각 연령대별 라이프 로드맵 상세 서술)",
          "healingEssay": "자기연민을 기반으로 한 감동적인 힐링 에세이"
        }
      }
    `;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON parse and validation
    const parsedData = JSON.parse(responseText.trim());
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Gemini Crossover API Error:", error);
    // Fallback to local high-precision calculation engine
    try {
      const body = await req.json().catch(() => ({}));
      const { sajuData, zimidusuChart, userName } = body;
      const fallbackData = get3ThemeCrossoverValidation(sajuData, zimidusuChart, userName);
      return NextResponse.json(fallbackData);
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
  }
}
