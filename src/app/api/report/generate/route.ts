import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';
export const maxDuration = 60; // Allow up to 60 seconds for long report generation

interface ReportGenerateRequest {
    profile: {
        name: string;
        birthDate: string;
        birthTime: string;
        gender: string;
        dayMaster?: string;
    };
    tier: 'DELUXE' | 'PREMIUM';
}

const PREMIUM_REPORT_PROMPT = `
당신은 세계 최고의 사주명리학 전문가이자, 심리 코칭 박사입니다.
사용자의 사주 정보를 바탕으로, **책 한 권 분량**의 심층 분석 리포트를 작성해 주세요.

## 사용자 정보
- 이름: {userName}
- 생년월일: {birthDate}
- 태어난 시간: {birthTime}
- 성별: {gender}
- 일주 (Day Master): {dayMaster}

## 리포트 구조 (반드시 이 순서와 형식을 따르세요)

# Chapter 1: 사주 원국 심층 분석 (Your Soul Blueprint)
(이 챕터는 약 2000자 분량으로 작성)
- 사주팔자의 오행 구성과 그 의미
- 십성(十星)의 배치와 영향력
- 타고난 강점과 잠재적 약점
- 운명의 핵심 키워드 3가지

# Chapter 2: 성격 & 인간관계 분석 (Personality & Relationships)
(이 챕터는 약 2000자 분량으로 작성)
- 핵심 성격 패턴 3가지
- 스트레스 상황에서의 반응 유형 및 해소법
- 피해야 할 인연 유형
- 함께하면 좋은 인연 유형
- 개운법: 인간관계 풍수 조언

# Chapter 3: 직업 & 재물운 분석 (Career & Wealth)
(이 챕터는 약 2000자 분량으로 작성)
- 직업 적성: 직장인 vs 사업가 vs 프리랜서 중 어느 것이 유리한가?
- 재테크 성향 및 투자 스타일 조언
- 직업 변화 가능성 및 최적 시기
- 재물 개운법 (색깔, 방향, 숫자 등)

# Chapter 4: 연애 & 결혼운 분석 (Love & Marriage)
(이 챕터는 약 2000자 분량으로 작성)
- 연애 스타일과 끌리는 이성 유형
- 이상적인 배우자 성향 (사주적 궁합 포함)
- 결혼 적합 시기 (대운/세운 기준)
- 연애 개운법 및 결혼운을 높이는 팁

# Chapter 5: 대운의 흐름 (Life Path & Fortune Flow)
(이 챕터는 약 2000자 분량으로 작성)
- 지나온 대운 요약 (과거 10년)
- 현재 대운의 의미와 주의점
- 다가올 대운 예측 (향후 10년)
- 인생 전체의 그랜드 플랜 및 조언

---
## 중요 지침
- 각 챕터는 **마크다운 형식**으로 작성하세요 (# 제목, ## 소제목, - 리스트, **강조**).
- 전체 분량은 **최소 10,000자 이상**이어야 합니다. 짧게 쓰지 마세요.
- 사주학 용어를 사용할 때는 괄호 안에 쉬운 설명을 덧붙이세요.
- 마지막에 **"이 리포트는 명심코칭 AI가 작성한 참고용 자료입니다."** 문구를 추가하세요.
`;

export const POST = requireAuth(async (req: NextRequest, auth) => {
    try {
        const body: ReportGenerateRequest = await req.json();
        const { profile, tier } = body;

        if (!profile || !profile.birthDate) {
            return NextResponse.json({ error: '사주 정보가 필요합니다.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
        }

        // Build the prompt with user data
        const finalPrompt = PREMIUM_REPORT_PROMPT
            .replace('{userName}', profile.name || '회원')
            .replace('{birthDate}', profile.birthDate)
            .replace('{birthTime}', profile.birthTime || '시간 미상')
            .replace('{gender}', profile.gender || '미상')
            .replace('{dayMaster}', profile.dayMaster || '정보 없음');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash', // Use stable model for long content
            generationConfig: {
                maxOutputTokens: 16000, // Allow long output
                temperature: 0.85, // Slightly creative
            },
        });

        console.log(`📖 [Report Generation] Starting for ${profile.name || 'User'} (${tier})`);

        const result = await model.generateContent(finalPrompt);
        const response = result.response;
        const generatedText = response.text();

        console.log(`✅ [Report Generation] Completed. Length: ${generatedText.length} chars`);

        return NextResponse.json({
            success: true,
            content: generatedText,
            tier: tier,
            generatedAt: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('❌ [Report Generation] Error:', error);
        return NextResponse.json({
            error: error.message || '리포트 생성 중 오류가 발생했습니다.',
        }, { status: 500 });
    }
});
