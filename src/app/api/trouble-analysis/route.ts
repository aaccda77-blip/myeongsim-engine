import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getCustomTroubleAnalysis } from '@/utils/zimidusuLogic';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sajuData, zimidusuChart, userName, category, question } = body;

    if (!sajuData || !zimidusuChart || !question) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API key is not configured, falling back to local analysis.");
      const fallbackData = getCustomTroubleAnalysis(category, question, sajuData, userName);
      return NextResponse.json(fallbackData);
    }

    const baseName = userName.endsWith('님') ? userName.slice(0, -1) : userName;
    const name = `${baseName}님`;
    const dayMaster = sajuData.day?.gan?.char || '';
    const dayMasterName = dayMaster === '신' ? '신금(辛金)' : `${dayMaster}금`;

    // Extract basic Zimidusu palace information
    const palaces = zimidusuChart.palaces || [];
    const getPalaceStars = (pName: string) => {
      const pal = palaces.find((p: any) => p.name === pName || p.name.includes(pName));
      return pal ? (pal.majorStars || []).map((s: any) => s.name).join(', ') : '밝고 온화한 별빛';
    };

    const jaebaekStars = getPalaceStars('재백');
    const bucheoStars = getPalaceStars('부처');

    const sajuString = `
      성명: ${name}
      년주: ${sajuData.year?.gan?.char}${sajuData.year?.ji?.char}
      월주: ${sajuData.month?.gan?.char}${sajuData.month?.ji?.char}
      일주: ${sajuData.day?.gan?.char}${sajuData.day?.ji?.char}
      시주: ${sajuData.time?.gan?.char}${sajuData.time?.ji?.char}
      일간(본질): ${dayMasterName}
    `;

    const prompt = `
      사주 명리학과 자미두수 명반 정보를 바탕으로 사용자의 구체적인 고뇌와 질문에 대해 1:1 맞춤형 인생 솔루션을 제공하는 감동적인 힐링 보고서를 작성해 주세요.
      
      사용자 정보:
      ${sajuString}
      자미두수 재백궁 주요 별: ${jaebaekStars}
      자미두수 부처궁 주요 별: ${bucheoStars}

      고민 분야: ${category} (job: 진로/이직, love: 사랑/인연, wealth: 재물/사업, general: 마음해독/대인관계)
      사용자의 질문: "${question}"

      [필수 구현 지침]
      1. 사용자의 사주가 1980년생 경신년 계미월 신사일 을미시이고 대운수 10인 경우:
         - 40대 정해대운 시기(40~49세)에는 일지 사화 정관과 해수가 충돌하는 '사해충'으로 인해 혼란과 마음의 시련을 겪고 진로를 닦아낸 시간이었음을 밝히세요.
         - 2025년 을사년에 AI 기술을 적극 도입하고, 2026년 병오년에 자신만의 지식 플랫폼을 구축 및 런칭 중인 현재 상황을 답변에 친절하고 상세하게 반영해 주세요.
         - 50세(50~59세) 무자 대운에 들어서면 정인 무토의 공식 문서 권리와 식신 자수의 신자합(申子合) 작용으로 큰 성공과 풍요의 궤도에 안착함을 짚어주어 현재의 플랫폼 구축 활동에 큰 용기를 주세요.
         - 60대(60~69세) 기축 대운에는 편인 간여지동의 단단함과 사축합(巳丑合)을 맞이하여 부를 완벽하게 수호하고 교육 재단/자산으로 완성해 나감을 설명하세요.
      2. 사용자 맞춤형으로 고민의 근원적 아키텍처 결함을 스캔하고, 마음챙김과 자기연민(MSC) 기법을 융합하여 마음을 따뜻하게 적시는 에세이 형태로 서술해 주세요.
      3. 초보자가 보아도 직관적으로 이해할 수 있게 너무 전문적인 명리 용어의 남용은 지양하고 친근한 일상적 비유를 사용하세요.

      반드시 아래 JSON 스키마를 완벽히 준수하여 JSON 문자열로만 응답해 주세요. 따옴표나 마크다운 포맷(e.g. \`\`\`json)은 생략하고 순수한 JSON만 반환해야 합니다:
      {
        "categoryLabel": "고민 분야 한글명 (예: 진로 및 이직 고민)",
        "solutionMetaphor": "비유적 은유 한 줄 제목",
        "analysisText": "사주 및 자미두수 분석을 통한 고민의 근본적 해독 및 위로 에세이 (매우 상세하게)",
        "briefing": "오늘부터 바로 실천할 수 있는 한 줄 마음챙김 가이드",
        "troubleLog": "Trouble Code (e.g. [JOB_DISORDER_RESOLVED]) 및 분석 완료 로그 메시지"
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
    
    const parsedData = JSON.parse(responseText.trim());
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Gemini Trouble Analysis API Error:", error);
    try {
      const body = await req.json().catch(() => ({}));
      const { category, question, sajuData, userName } = body;
      const fallbackData = getCustomTroubleAnalysis(category, question, sajuData, userName);
      return NextResponse.json(fallbackData);
    } catch (fallbackError) {
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
  }
}
