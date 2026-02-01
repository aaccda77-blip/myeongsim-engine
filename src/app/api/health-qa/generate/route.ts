/**
 * /api/health-qa/generate/route.ts
 * Vercel AI SDK를 활용한 Gemini 2.5 Flash 건강 Q&A 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

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
        const levelInstructions: Record<string, string> = {
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
${levelInstructions[level] || levelInstructions.beginner}

**사용자 질문**: ${question}

다음 JSON 형식으로만 답변하세요. 다른 텍스트 없이 순수 JSON만 출력하세요:

{
  "greeting": "공감과 격려가 담긴 인사말 (1-2문장)",
  "core_message": "핵심 답변 (2-3문장, 레벨에 맞는 설명)",
  "advice_cards": [
    {
      "icon": "fitness_center",
      "title": "조언 제목",
      "content": "구체적인 조언 내용"
    },
    {
      "icon": "restaurant",
      "title": "조언 제목",
      "content": "구체적인 조언 내용"
    },
    {
      "icon": "schedule",
      "title": "조언 제목",
      "content": "구체적인 조언 내용"
    }
  ],
  "closing": "격려 메시지 (💡 아이콘 포함)"
}
`;

        const { text } = await generateText({
            model: google('gemini-2.5-flash-preview-04-17'),
            prompt: prompt,
        });

        // JSON 파싱
        let parsedResponse;
        try {
            const cleanedText = text
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            parsedResponse = JSON.parse(cleanedText);
        } catch {
            console.error('JSON 파싱 실패:', text);
            throw new Error('AI 응답을 파싱할 수 없습니다.');
        }

        // HealthQATemplate 형식으로 변환
        const qaTemplate = {
            id: `ai_generated_${Date.now()}`,
            category: 'hypertension' as const,
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

        // 폴백 답변
        const fallbackAnswer = {
            id: `fallback_${Date.now()}`,
            category: 'general',
            question: '',
            answer: {
                greeting: "현재 AI 연결이 불안정하여 일반 가이드로 답변드릴게요.",
                core_message: "질문하신 내용은 전문가의 진단이 필요한 중요한 주제입니다. 무리하지 않는 선에서 시작하고, 통증 발생 시 즉시 중단하세요.",
                advice_cards: [
                    { icon: "priority_high", title: "안전 최우선", content: "새로운 운동이나 식단은 낮은 강도부터 시작하세요." },
                    { icon: "medical_services", title: "전문가 상담", content: "기저질환이 있다면 의사와 상담 후 진행하세요." },
                    { icon: "monitor_heart", title: "신체 반응 체크", content: "어지러움이나 흉통이 있다면 즉시 119에 연락하세요." }
                ],
                closing: "💡 잠시 후 다시 시도해주시면 더 자세히 알려드릴게요!"
            },
            tags: ['안전가이드'],
            difficulty: 'beginner'
        };

        return NextResponse.json(fallbackAnswer);
    }
}
