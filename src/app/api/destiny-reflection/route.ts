import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

// API Key가 없거나 에러가 났을 때 작동하는 폴백 데이터 생성 헬퍼 함수 (POST 바깥으로 이동)
function getDestinyReflectionFallback(userName: string, sajuData: any) {
  const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
  const name = `${baseName}님`;
  const dayMaster = sajuData?.day?.gan?.char || '신';
  
  const ganNames: Record<string, string> = {
    '갑': '갑목(甲木)', '을': '을목(乙木)', '병': '병화(丙火)', '정': '정화(丁火)',
    '무': '무토(戊土)', '기': '기토(己土)', '경': '경금(庚金)', '신': '신금(辛金)',
    '임': '임수(壬水)', '계': '계수(癸水)'
  };
  const dayMasterName = ganNames[dayMaster] || `${dayMaster}금`;

  const isTargetUser = 
    sajuData?.year?.gan?.char === '경' && sajuData?.year?.ji?.char === '신' &&
    sajuData?.month?.gan?.char === '계' && sajuData?.month?.ji?.char === '미' &&
    sajuData?.day?.gan?.char === '신' && sajuData?.day?.ji?.char === '사' &&
    sajuData?.time?.gan?.char === '을' && sajuData?.time?.ji?.char === '미';

  let harmonyContent = '';
  if (isTargetUser) {
    harmonyContent = `사주명리학이 10년 단위의 대운을 통해 ${name}이 밟아갈 거대한 인생의 대지이자 사계절의 날씨(언제, 어떤 에너지가 올지)를 조율한다면, 자미두수는 그 하늘 아래 12개의 방(궁) 속에 배치된 수많은 별들을 통해 ${name}이 내면에서 자원을 축적하고 행동하는 구체적이고 정교한 조각(어떤 방식으로, 얼마나)을 보여줍니다.\n\n대운수 10에 따라 40대 정해대운(사해충)의 깊은 바다와 같던 사색과 시련을 지나, 2025년 을사년 and 2026년 병오년에 자신만의 지식 플랫폼을 아름답게 런칭하는 흐름은 완벽하게 예고된 조화로운 길입니다. 다가오는 50대 무자대운의 찬란한 대전성기와 60대 기축대운의 사상적 거장의 반열까지, 대지와 별빛은 언제나 ${name}을 안전하게 지지하고 있습니다.`;
  } else {
    const daewoonStartAge = sajuData?.daewoonStartAge || 10;
    const daewoonList = sajuData?.daewoon || [];
    const daewoonString = daewoonList.slice(0, 5).map((d: any) => `${d.age}세~: ${d.ganzhi} 대운`).join(', ');
    
    harmonyContent = `사주명리학이 10년 단위의 대운을 통해 ${name}이 밟아갈 인생의 계절 날씨를 조율한다면, 자미두수는 그 하늘 아래 별들의 배치를 통해 ${name}의 마음에 숨겨진 보물지도를 그려 보여줍니다.\n\n사용자님의 대운은 ${daewoonStartAge}세에 시작되어 [${daewoonString}] 흐름으로 흘러가며, 이 계절적 변화 속에서 다가오는 대운의 기운을 조화롭게 활성화하고 나만의 고유한 정신적·실질적 영토를 수호하는 데 최적의 시기들을 맞이하고 있습니다. 대지와 하늘의 별빛은 언제나 ${name}을 든든히 지탱해 줍니다.`;
  }

  return {
    destinyReflection: {
      title: "🌸 AI 마음 온기 성찰소 (내 인생의 별빛과 대지)",
      intro: `반갑습니다, ${name}. 이곳은 10년마다 흘러가는 인생의 거대한 대지와 하늘에 수놓인 100여 개의 별빛 지도를 나란히 포개어 놓고, 오직 ${name}만을 위한 따뜻한 치유의 이야기를 들려주는 마음 성찰 공간입니다.`,
      acceptance: {
        title: "1. 운명의 수락: '나다움'으로 살아가는 길 🌾",
        content: `"${name}의 사주와 인생에는 아무런 잘못이 없습니다. 팔자가 꼬인다는 것은 나다운 기질을 억누르며 타인의 옷을 입으려 애썼기 때문이며, 팔자를 편다는 것은 내게 주어진 고유한 흐름과 리듬을 알아채고 온전히 활용하는 것입니다."\n\n${name}의 본질을 나타내는 ${dayMasterName}은 흙 속에 숨어 고결하게 빛나는 보석이자, 정밀하고 날카롭게 단련된 원석과 같습니다. 남이 시켜서 하는 억지 밥벌이보다 스스로의 세공력과 전문 라이선스를 가꾸어갈 때 가장 맑고 눈부시게 빛납니다. 당신의 예민함과 섬세한 안테나는 시스템의 고장이 아닌, 세상을 치유하고 가장 빛나는 결실을 빚어내기 위해 조율된 우주의 축복입니다.`
      },
      harmony: {
        title: "2. 대지와 별빛의 노래: 사주(흐름) × 자미두수(모습) 🌌",
        content: harmonyContent
      },
      prescription: {
        title: "3. 오늘의 마음 온기 처방전 💌",
        content: `손을 가만히 왼쪽 가슴 위에 얹고 따스하게 말해 봅니다. "그동안 세상을 향해 켜놓았던 예리한 안테나를 잠시 거두고, 완벽하려 애쓰던 무거운 책임감을 내려놓아도 괜찮아. 너는 존재 자체로 이미 훌륭하게 빛나고 있으며, 흐르는 모든 계절 속에서 언제나 안전하단다."\n\n오늘 하루는 스스로에게 따뜻한 봄 햇살 같은 다정한 수용의 미소를 건네주세요. 당신의 모든 발걸음이 아름다운 역사의 문장입니다.`
      }
    }
  };
}

export async function POST(req: NextRequest) {
  let sajuDataLocal: any = null;
  let userNameLocal: string = '회원님';
  
  try {
    const body = await req.json();
    const { sajuData, zimidusuChart, userName } = body;
    sajuDataLocal = sajuData;
    userNameLocal = userName || '회원님';

    if (!sajuData || !zimidusuChart) {
      return NextResponse.json({ error: 'Missing sajuData or zimidusuChart' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API key is not configured, falling back to local destiny reflection.");
      const fallback = getDestinyReflectionFallback(userNameLocal, sajuDataLocal);
      return NextResponse.json(fallback);
    }

    const baseName = userNameLocal.endsWith('님') ? userNameLocal.slice(0, -1) : userNameLocal;
    const name = `${baseName}님`;
    const dayMaster = sajuData.day?.gan?.char || '';

    // Extract basic Zimidusu palace information
    const palaces = zimidusuChart.palaces || [];
    const getPalaceStars = (pName: string) => {
      const pal = palaces.find((p: any) => p.name === pName || p.name.includes(pName));
      return pal ? (pal.majorStars || []).map((s: any) => s.name).join(', ') : '밝고 온화한 별빛';
    };
    const jaebaekStars = getPalaceStars('재백');
    const myeongStars = getPalaceStars('명궁');

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
         특히 40대(정해 대운 - 사해충으로 진로를 날카롭게 깎는 연마기), 50대(무자 대운 - 정인/식신의 대전성기 및 최고 수입 궤도), 60대(기축 대운 - 사축합으로 자산 수호 및 사상적/정신적 거장 도달)의 전반적 인생 지도 흐름을 따뜻한 위로와 연결해 주세요.
      2. 2025년 을사년 AI 기술 도입과 2026년 병오년에 자신만의 지식 플랫폼을 런칭하고 구축하는 흐름을 언급하며, 이 모든 것이 "나다운 삶을 살아내고 있는 증거"이자 "팔자를 펴나가는 위대한 여정"임을 격려해 주세요.
      `;
    } else {
      daewoonInstruction = `
      1. 사용자의 실제 대운 시작 나이(대운수)는 ${daewoonStartAge}세이며, 대운 흐름은 다음과 같습니다: [${daewoonString}]
      2. 이 실제 대운 정보[${daewoonString}]를 기반으로, 사용자가 현재 겪고 있거나 앞으로 밟아갈 10년 단위의 인생 계절 변화(40대, 50대, 60대, 70대~100세 이상)를 그 사람의 나이대별 대운 간지와 십성을 직접 추적하여 설명하세요. 
         그 대운의 계절적 기후(오행, 십성의 작용) 속에서 삶이 어떻게 조화롭게 펴지고 있는지, 결코 그 자체에는 잘못이 없고 온전히 나다운 빛을 빚기 위한 아름다운 궤적임을 다정하게 격려해 주세요. 
         (주의: 1980년생을 기준으로 정해대운 사해충, 2025~2026 플랫폼 런칭 등의 하드코딩 스토리는 절대 출력해서는 안 되며, 오직 제공된 실제 사주와 대운[${daewoonString}]을 매핑해야 합니다.)
      `;
    }

    const prompt = `
      사주 명리학과 자미두수 철학을 결합하여, 사용자의 고유한 성정과 인생 흐름을 바탕으로 오직 단 한 사람을 위로하는 'AI 마음 온기 성찰소' 리포트를 생성해 주세요.
      
      [철학적 배경]
      "사주팔자에는 잘못이 없습니다. 팔자가 꼬인다는 것은 타고난 사주대로 살지 못하고 있다는 뜻이고, 팔자를 폈다는 것은 타고난 흐름을 잘 활용하며 살고 있다는 뜻입니다. 종합풀이는 인생의 흐름과 타이밍을 조율하는 사주(대지)와 인생의 구체적 모습을 보여주는 자미두수(별빛)가 교차 분석되어 완벽한 나다움을 일깨우는 yr쇠입니다."
      이 이미지를 참고하여 여지껏 없던 감동적인 힐링 성찰 컨텐츠를 새로 구성해 주세요.
      
      사용자 정보:
      ${sajuString}
      자미두수 명궁 주요 별: ${myeongStars}
      자미두수 재백궁 주요 별: ${jaebaekStars}

      [필수 구현 및 내용 지침]
      ${daewoonInstruction}
      3. 아주 친절하고 초보자도 한눈에 알기 쉽게 일상적인 따뜻한 비유와 문학적인 은유법을 풍부하게 활용하여 작성해 주세요. (예: 다이아몬드 세공, 봄날의 햇살, 밤하늘의 나침반, 대지와 봄비 등)
      4. 마음챙김과 자기연민(MSC)을 결합하여 가슴이 따뜻해지고 위안을 주는 아름다운 긴 에세이 형태로 내용을 가득 채워주세요.
      
      반드시 아래 JSON 스키마를 완벽히 준수하여 JSON 문자열로만 응답해 주세요. 따옴표나 마크다운 포맷(e.g. \`\`\`json)은 생략하고 순수한 JSON만 반환해야 합니다:
      {
        "destinyReflection": {
          "title": "🌸 AI 마음 온기 성찰소 (내 인생의 별빛과 대지)",
          "intro": "성찰소 소개 및 사용자 환영 멘트",
          "acceptance": {
            "title": "1. 운명의 수락: '나다움'으로 살아가는 길 🌾",
            "content": "사주 일간과 자미두수 별자리를 연동한 '나다운 삶'에 대한 상세 성찰. '내 사주에는 잘못이 없다'는 철학적 관점의 비유적 해설."
          },
          "harmony": {
            "title": "2. 대지와 별빛의 노래: 사주(흐름) × 자미두수(모습) 🌌",
            "content": "사주(대지)의 큰 인생 환경/타이밍 변화와 자미두수(별빛)의 구체적인 마음 런타임의 상호작용 및 흐름에 대한 따뜻한 비유 해설."
          },
          "prescription": {
            "title": "3. 오늘의 마음 온기 처방전 💌",
            "content": "자기연민(MSC) 기반의 감동적이고 시적인 에세이. 오늘 하루를 따스하게 위로하고 다듬어주는 다정한 치유 메시지."
          }
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
    console.error("Gemini Destiny Reflection API Error:", error);
    // Fallback logic
    try {
      const fallback = getDestinyReflectionFallback(userNameLocal, sajuDataLocal);
      return NextResponse.json(fallback);
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to process destiny reflection request" }, { status: 500 });
    }
  }
}
