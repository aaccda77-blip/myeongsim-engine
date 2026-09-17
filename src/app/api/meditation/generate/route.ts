import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireAuth } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '');

export const POST = requireAuth(async (req: NextRequest, auth) => {
    try {
        const { codeNumber, title, subtitle, darkCode, gift, metaCode, journalPrompt } = await req.json();

        if (!codeNumber || !title) {
            return NextResponse.json({ error: 'Code data required' }, { status: 400 });
        }

        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline meditation script.");
            const offlineScript = `숨을 깊이 들이마시고... 천천히 내쉽니다.
오늘 우리가 함께 마주하는 주파수는 ${codeNumber}번, '${title}'입니다.

내면에서 올라오는 그림자(${darkCode?.name || '불안'})를 억지로 밀어내지 마세요. 그것은 당신이 상처받지 않도록 온 힘을 다해 지켜온 다정한 흔적입니다. 가만히 숨을 쉬며 그 그림자를 안아줍니다.

이제 그 너머에서 깨어나는 선물(${gift?.name || '지혜'})의 빛을 느껴보세요. 모든 애씀이 멈춘 고요한 자리, 바로 그 순수 자각의 메타코드(${metaCode?.name || '평온'}) 속에서 당신은 이미 온전합니다.

오늘의 질문을 마음에 품어봅니다: "${journalPrompt || '지금 이 순간 가장 진실한 나의 마음은 무엇인가요?'}"
평화로운 호흡과 함께 이 고요함에 머무르세요.`;

            return NextResponse.json({ script: offlineScript });
        }

        const systemPrompt = `
당신은 명심코칭의 전문 명상 가이드입니다. 
사용자가 선택한 뉴럴 코드를 바탕으로 깊이 있는 명상 가이드 스크립트를 작성해주세요.

**코드 정보:**
- 번호: ${codeNumber}번
- 제목: ${title}
- 부제: ${subtitle}
- 다크 코드: ${darkCode.name} - ${darkCode.description}
- 뉴럴코드: ${gift.name} - ${gift.description}
- 메타 코드: ${metaCode.name} - ${metaCode.description}
- 사색 질문: ${journalPrompt}

**가이드 스크립트 작성 규칙:**
1. 차분하고 명상적인 톤으로 작성
2. 약 2-3분 분량 (300-500자)
3. 다음 구조를 따름:
   - 도입: 코드 소개와 오늘의 사색 주제
   - 다크 코드 탐구: 그림자를 인정하고 받아들이기
   - 뉴럴코드 발견: 선물과 가능성 발견하기
   - 메타 코드 체험: 더 높은 차원의 깨달음
   - 마무리: 사색 질문과 함께 조용히 마무리

4. 호흡과 함께하는 명상 가이드 포함
5. 개인적이고 따뜻한 어조 사용
6. "당신"이라는 2인칭 사용

**출력 형식:**
순수한 명상 스크립트 텍스트만 반환하세요. 마크다운이나 다른 형식 없이 오직 읽어줄 텍스트만 작성하세요.
`;

        // Use Gemini 2.5 Flash
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const meditationScript = response.text().trim();

        return NextResponse.json({ script: meditationScript });

    } catch (error: any) {
        console.error('Meditation Script Gen Error:', error);

        // Don't expose internal error details to client
        const isProduction = process.env.NODE_ENV === 'production';
        const errorMessage = isProduction
            ? '명상 스크립트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : error.message;

        return NextResponse.json({
            error: errorMessage
        }, { status: 500 });
    }
});
