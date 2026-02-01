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

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
        console.error('Gemini API 처리 중 오류 발생:', error);

        // API 키 만료 등의 오류 발생 시 폴백(Fallback) 답변 제공
        // 사용자에게 에러를 보여주는 대신, 정해진 답변을 제공하여 경험 유지

        const fallbackAnswer = {
            id: `fallback_${Date.now()}`,
            category: 'general',
            question: question,
            answer: {
                greeting: "현재 AI 연결이 불안정하여 안전한 일반 가이드로 답변드릴게요.",
                core_message: "질문하신 내용은 전문가의 진단이 필요한 중요한 주제입니다. 일반적인 원칙으로는 무리하지 않는 선에서 시작하고, 통증 발생 시 즉시 중단하는 것이 중요합니다.",
                advice_cards: [
                    {
                        icon: "priority_high",
                        title: "안전 최우선",
                        content: "새로운 운동이나 식단을 시도할 때는 반드시 낮은 강도부터 시작하세요."
                    },
                    {
                        icon: "medical_services",
                        title: "전문가 상담",
                        content: "기저질환이 있다면 주취의와 상담 후 진행하는 것이 가장 안전합니다."
                    },
                    {
                        icon: "monitor_heart",
                        title: "신체 반응 체크",
                        content: "어지러움, 흉통, 심한 호흡 곤란이 있다면 즉시 119에 연락하세요."
                    }
                ],
                closing: "💡 잠시 후 다시 시도해주시면 명심 AI 코치가 더 자세히 알려드릴게요!"
            },
            tags: ['AI연결지연', '안전가이드'],
            difficulty: level
        };

        return NextResponse.json(fallbackAnswer);
    }
}
