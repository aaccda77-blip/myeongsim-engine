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

        const isBusinessMode = codeType === '비즈니스 메커니즘' || codeType === '천명 BM' || codeType === '직업 아키텍처';

        let prompt = '';

        if (isBusinessMode) {
            prompt = `
당신은 대한민국 최고의 동양역학(주역/사주) ✕ 지식 비즈니스 아키텍처 융합 설계자 '명심 비즈니스 마스터'입니다.
수신인: ${userName || '도반'} 님 (사주 일주: ${dayMaster || '금'}, 원국: ${sajuPillars || '맞춤 원국'})
선택한 코드: ${codeTitle} (${codeCategory})

[핵심 미션]:
수신인의 사주 원국과 선택된 괘의 상괘/하괘 및 주역 효사를 바탕으로, 단순한 성향 분석을 넘어 **명확한 ‘직업적 메커니즘(비즈니스 모델/BM)’**을 1:1 맞춤형으로 도출하세요.

[필수 구조]:
1. 한 줄 직업적 정체성: "타인의 [핵심 문제]를 [고유 솔루션]으로 해방시키고([괘명]), 이를 현실적인 [비즈니스 형태]로 구현하는 [직업적 페르소나]" 형식으로 명쾌하게 정의.
2. 1단계: 하괘/오행 중심 — 문제와 병목의 포착 (진단 영역 / Analyst)
   - 타인이 어디서 불안해하고 어떤 인지적·현실적 오류에 갇혀 에너지를 낭비하는지 본능적으로 꿰뚫어 보는 진단자 역할.
3. 2단계: 상괘/효사 중심 — 급소 타격과 프레임워크 (솔루션 영역 / Solution Architect)
   - 단순 위로가 아닌 명쾌한 이론·알고리즘·시스템으로 막힌 곳을 단번에 뚫어내는 솔루션 설계자 기제 (황금 화살 원리).
4. 3단계: 일주/시주/십성 중심 — 시스템화와 실질적 부가가치 (수익·사업 영역 / Product Builder)
   - 추상적 지식에 머물지 않고 책·플랫폼·교육·컨설팅 등 구체적 프로덕트로 패키징하여 수익과 가치로 치환하는 방법.
5. 구체적 프로덕트 제안: 지금 당장 런칭할 수 있는 1순위 지식 비즈니스 프로덕트 예시 (책, VOD, 1:1 컨설팅 등).

반드시 순수한 JSON 형식만 출력하세요:
{
  "oneLinerIdentity": "한 줄로 정의되는 강력한 직업적 정체성",
  "stage1Title": "1단계: [하괘/오행명] — 문제와 병목의 포착 (진단 영역)",
  "stage1Role": "진단자 (Analyst)",
  "stage1Desc": "타인의 불안과 인지적 속박을 꿰뚫어 보는 진단 메커니즘 상세 설명",
  "stage2Title": "2단계: [상괘/효사명] — 급소 타격과 프레임워크 (솔루션 영역)",
  "stage2Role": "설계자 (Solution Architect)",
  "stage2Desc": "명쾌한 알고리즘과 황금 화살로 막힌 곳을 단번에 뚫어내는 설계 기제 상세 설명",
  "stage3Title": "3단계: [십성/오행명] — 시스템화와 실질적 부가가치 (수익·사업 영역)",
  "stage3Role": "프로덕트 빌더 (Product Builder)",
  "stage3Desc": "책, 플랫폼, 교육 프로그램 등 구체적 결과물로 패키징하여 수익화하는 방법 상세 설명",
  "productPackaging": "추천 1순위 지식 상품 패키징 (예: 전자책 + 프레임워크 워크시트 + VIP 컨설팅)",
  "targetAudience": "가장 열광할 핵심 타겟 고객군 정의"
}
`;
        } else {
            prompt = `
당신은 대한민국 최고의 동양역학 ✕ 인지신경과학 융합 코칭 마스터 '명심 코치'입니다.
수신인: ${userName || '도반'} 님 (사주 일주: ${dayMaster || '금'}, 원국: ${sajuPillars || '맞춤 원국'})
선택한 코드: ${codeTitle} (${codeCategory})
분석 요청 유형: ${codeType || '심층 감동 에세이'}

[코칭 작성 규칙]:
1. 초보자도 1초 만에 이해할 수 있도록 따뜻한 일상 비유와 다정한 어조로 작성하세요.
2. 수신인의 이름을 다정하게 부르며, 그동안 겪었을 무의식적 고통과 조급함을 깊이 위로하세요.
3. 의료법에 위반되는 '치료, 처방, 진단, 환자' 등의 용어를 절대 쓰지 말고, '주권 회복, 에너지 이완, 행동 솔루션 코칭' 등의 명심코칭 용어를 사용하세요.
4. 해외 저작권(진키) 용어 대신 '명심 64 뉴럴코드, 주역 64 천명괘, 다크코드, 뉴럴코드, 메타코드'를 사용하세요.
5. 절대로 '1. 괘 번호 검증', '100% 일치', '검증 결과' 같은 시스템 디버그/검증 과정 문장을 출력하지 마세요. 최종 정제된 감동적 코칭 인사이트만 출력하세요.
6. 마지막에는 ${userName} 님이 가슴에 손을 얹고 읽을 수 있는 1줄 '황금 앵커 확언'을 선물하세요.

반드시 순수한 JSON 형식만 출력하세요:
{
  "essayTitle": "감동적인 에세이 제목",
  "essayContent": "줄바꿈이 포함된 3~4문단의 따뜻한 심층 치유 에세이 전문",
  "goldenAffirmation": "1줄 황금 앵커 확언",
  "actionSolution": "오늘 당장 10분 만에 할 수 있는 실천 솔루션"
}
`;
        }

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
            isBusiness: isBusinessMode,
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