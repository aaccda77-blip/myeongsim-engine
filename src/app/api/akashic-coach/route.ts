import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sajuData, biorhythm, calendarDay } = body;

    if (!calendarDay || !calendarDay.detailData) {
      return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const { gan, zhi, status, detailData } = calendarDay;
    const dayMaster = sajuData?.dayMasterHanja || '알수없음';
    const bioScore = biorhythm?.overallScore || 50;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: { temperature: 0.8 },
    });

    const prompt = `당신은 명심코칭의 수석 AI 헬스케어 코치입니다.
내담자가 캘린더에서 특정 일자(트래픽 캘린더)를 클릭했습니다. 
해당 일자에 발생할 명리학적 충돌(사주 기제)과 내담자의 현재 생체 에너지(바이오리듬)를 융합하여,
기존의 딱딱한 코칭 지침을 현대적이고 친절하며 상세하게 초고도화하여 작성해 주세요.

[내담자 상태]
- 일간(본질): ${dayMaster}
- 바이오리듬(생체 에너지) 점수: ${bioScore}점 / 100점 (점수가 높을수록 방어력이 높고 긍정적임)

[클릭한 해당 일자의 정보]
- 일진 천간/지지: ${gan}${zhi}
- 상태: ${status} (위험도: danger/warning/green)
- 발생할 현상(원인): ${detailData.title} - ${detailData.cause}
- 기존 코칭(원문): ${detailData.action}

[요구사항]
1. 기존 코칭(원문)의 맥락을 살리되, "감정 기복 극대화." 같은 단답식 통보를 부드럽고 전문적인 헬스케어 코치의 언어로 3~4문장으로 풀어서 설명하세요.
2. 내담자의 바이오리듬 점수(${bioScore}점)를 반드시 언급하며 융합하세요. (예: "오늘의 강한 충돌 에너지가 발생하지만, 당신의 현재 생체 에너지가 85점으로 훌륭하게 방어하고 있습니다. 오늘 욱하는 마음이 들더라도 높은 지성 리듬을 믿고 5분만 참으세요." 등)
3. 불필요한 마크다운 코드블록이나 서론 없이, 곧바로 "사용자에게 띄워줄 최종 코칭 문구 텍스트"만 출력하세요.`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Akashic Coach API Error:', error);
    return NextResponse.json({ error: '코칭 지침 생성 중 에러가 발생했습니다.' }, { status: 500 });
  }
}
