/**
 * /api/health-qa/generate/route.ts
 * Gemini API를 활용한 동적 건강 Q&A 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { question, level } = await request.json();

        if (!question || !level) {
            return NextResponse.json(
                { error: '질문과 레벨이 필요합니다.' },
                { status: 400 }
            );
        }

        // 레벨별 프롬프트 설정
        const levelInstructions = {
            beginner: `
일반인을 위한 쉬운 설명:
- 전문 용어 최소화
- 일상 언어 사용
- 비유와 예시 활용
- 핵심만 간단명료하게
            `,
            intermediate: `
운동 경험자를 위한 실용 지식:
- 기본 전문용어 포함 (RPE, MET, 인슐린 감수성 등)
- 운동 원리 설명
- 구체적인 수치와 방법 제시
            `,
            advanced: `
건강운동관리사 구술시험 수준:
- 생리학적 메커니즘 상세 설명
- ACSM, WHO, ADA 가이드라인 인용
- 전문 용어 적극 활용 (GLUT4, EPOC, VO2max, HRmax 등)
- 연구 결과 및 수치 포함
- Evidence-based 접근
            `
        };

        const prompt = `
당신은 30년 경력의 건강운동관리사이자 명심 AI 코치입니다.
친절하고 따뜻하면서도 전문적인 답변을 제공합니다.

**사용자 레벨**: ${level}
${levelInstructions[level as keyof typeof levelInstructions]}

**사용자 질문**: ${question}

다음 JSON 형식으로 답변하세요. 반드시 유효한 JSON만 출력하세요:

{
  "greeting": "공감과 격려가 담긴 인사말 (1-2문장)",
  "core_message": "핵심 답변 (2-3문장, 레벨에 맞는 설명)",
  "advice_cards": [
    {
      "icon": "material_icon_name",
      "title": "조언 제목",
      "content": "구체적인 조언 내용"
    },
    {
      "icon": "material_icon_name",
      "title": "조언 제목",
      "content": "구체적인 조언 내용"
    },
    {
      "icon": "material_icon_name",
      "title": "조언 제목",
      "content": "구체적인 조언 내용"
    }
  ],
  "closing": "격려 메시지 또는 팁 (💡 아이콘 포함)"
}

**Material Icons 예시**: 
- 운동: fitness_center, directions_run, pool, directions_bike
- 건강: favorite, monitor_heart, healing, medical_services
- 음식: restaurant, local_dining, water_drop
- 시간: schedule, bedtime, alarm
- 주의: warning, dangerous, info
- 과학: science, biotech, psychology

**중요**: 
1. 반드시 유효한 JSON 형식으로만 응답하세요
2. advice_cards는 정확히 3개 제공하세요
3. 레벨에 맞는 언어와 깊이로 설명하세요
4. 따뜻하고 격려하는 톤을 유지하세요
`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // JSON 파싱
        let parsedResponse;
        try {
            // 코드 블록 제거 (```json ... ``` 형식일 경우)
            const cleanedText = responseText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            parsedResponse = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON 파싱 실패:', responseText);
            throw new Error('AI 응답을 파싱할 수 없습니다.');
        }

        // HealthQATemplate 형식으로 변환
        const qaTemplate = {
            id: `ai_generated_${Date.now()}`,
            category: 'hypertension' as const, // 기본값
            question: question,
            answer: {
                greeting: parsedResponse.greeting,
                core_message: parsedResponse.core_message,
                advice_cards: parsedResponse.advice_cards,
                closing: parsedResponse.closing
            },
            tags: ['AI생성', level],
            difficulty: level as 'beginner' | 'intermediate' | 'advanced'
        };

        return NextResponse.json(qaTemplate);

    } catch (error) {
        console.error('Gemini API 오류:', error);
        return NextResponse.json(
            { error: 'AI 답변 생성에 실패했습니다.' },
            { status: 500 }
        );
    }
}
