import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userName, dayMaster, sajuPillars, codeTitle, codeCategory, codeType } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, message: 'API Key not configured' }, { status: 400 });
        }

        const prompt = `
당신은 대한민국 최고의 동양역학 ✕ 인지신경과학 융합 코칭 마스터 '명심 코치'입니다.
수신인: ${userName || '도반'} 님 (사주 일주: ${dayMaster || '금'}, 원국: ${sajuPillars || '맞춤 원국'})
선택한 코드: ${codeTitle} (${codeCategory})
분석 요청 유형: ${codeType || '심층 감동 에세이'}

[코칭 작성 규칙]:
1. 초보자도 1초 만에 이해할 수 있도록 따뜻한 일상 비유와 다정한 어조로 작성하세요.
2. 수신인의 이름을 다정하게 부르며, 그동안 겪었을 무의식적 고통과 조급함을 깊이 위로하세요.
3. 의료법에 위반되는 '치료, 처방, 진단, 환자' 등의 용어를 절대 쓰지 말고, '주권 회복, 에너지 이완, 행동 솔루션 코칭' 등의 명심코칭 용어를 사용하세요.
4. 해외 저작권(진키) 용어 대신 '명심 64 뉴럴코드, 주역 64 천명괘, 다크코드, 뉴럴코드, 메타코드'를 사용하세요.
5. 마지막에는 ${userName} 님이 가슴에 손을 얹고 읽을 수 있는 1줄 '황금 앵커 확언'을 선물하세요.

반드시 순수한 JSON 형식만 출력하세요:
{
  "essayTitle": "감동적인 에세이 제목",
  "essayContent": "줄바꿈이 포함된 3~4문단의 따뜻한 심층 치유 에세이 전문",
  "goldenAffirmation": "1줄 황금 앵커 확언",
  "actionSolution": "오늘 당장 10분 만에 할 수 있는 실천 솔루션"
}
`;

        // 🌟 Google 공식 네이티브 REST API 호출 (gemini-2.5-flash)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API HTTP Error: ${response.statusText}`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(rawText);

        return NextResponse.json({
            success: true,
            model: 'gemini-2.5-flash',
            data: parsed
        });

    } catch (error: any) {
        console.error('Gemini 2.5 Flash API Error:', error);
        return NextResponse.json({
            success: false,
            fallback: true,
            message: error?.message || 'AI Generation Failed'
        }, { status: 500 });
    }
}