/**
 * /api/bio-care/analyze-symptoms/route.ts
 * AI 증상 패턴 분석 API (Gemini)
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';

interface SymptomLog {
    date: string;
    symptoms: {
        nausea: string;
        vomit: string;
        dizziness: string;
        fatigue: string;
        irritability: string;
        abdominal_pain: string;
    };
    notes: string;
    mealTime?: string;
    medicationTaken?: boolean;
}

interface AnalysisRequest {
    logs: SymptomLog[];
    medication: 'saxenda' | 'jardiance' | 'metformin';
    analysisType: 'weekly' | 'monthly';
}

export async function POST(request: NextRequest) {
    try {
        const body: AnalysisRequest = await request.json();
        const { logs, medication, analysisType } = body;

        if (!logs || logs.length < 3) {
            return NextResponse.json(
                { error: '최소 3일 이상의 기록이 필요합니다.' },
                { status: 400 }
            );
        }

        // 약물별 특성 정보
        const medicationContext = {
            saxenda: {
                name: '삭센다 (GLP-1 수용체 작용제)',
                commonSideEffects: ['메스꺼움', '구토', '소화불량', '담낭 관련 증상'],
                warnings: ['담석증', '췌장염', '저혈당']
            },
            jardiance: {
                name: '자디앙 (SGLT-2 억제제)',
                commonSideEffects: ['탈수', '요로감염', '어지러움'],
                warnings: ['케톤산증', '신장 기능 저하', '저혈압']
            },
            metformin: {
                name: '메트포르민 (비구아나이드)',
                commonSideEffects: ['소화불량', '설사', '복통', '피로'],
                warnings: ['비타민 B12 결핍', '젖산산증', '신장 기능 저하']
            }
        };

        const medInfo = medicationContext[medication];

        // 증상 데이터 요약
        const symptomSummary = logs.map(log => {
            const symptomsText = Object.entries(log.symptoms)
                .filter(([_, value]) => value && value !== 'none')
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');

            return `[${log.date}] ${symptomsText || '증상 없음'}${log.notes ? ` | 메모: ${log.notes}` : ''}${log.mealTime ? ` | 식사: ${log.mealTime}` : ''}`;
        }).join('\n');

        // AI 프롬프트
        const prompt = `당신은 전문 보건교육사입니다. 사용자의 ${analysisType === 'weekly' ? '주간' : '월간'} 증상 기록을 분석하여 패턴과 인사이트를 제공해 주세요.

**복용 약물**: ${medInfo.name}
**일반적 부작용**: ${medInfo.commonSideEffects.join(', ')}
**주의 증상**: ${medInfo.warnings.join(', ')}

**증상 기록 (${logs.length}일)**:
${symptomSummary}

다음 형식으로 분석 결과를 JSON으로 반환해 주세요:

{
  "timePatterns": [
    {
      "title": "시간대별 패턴",
      "finding": "구체적인 패턴 설명",
      "severity": "low|medium|high"
    }
  ],
  "frequencyAnalysis": [
    {
      "title": "증상 빈도 분석",
      "finding": "증상 변화 추이",
      "severity": "low|medium|high"
    }
  ],
  "correlations": [
    {
      "title": "약물-증상 상관관계",
      "finding": "복약과 증상의 관계",
      "severity": "low|medium|high"
    }
  ],
  "warnings": [
    {
      "title": "주의가 필요한 조합",
      "finding": "위험 신호 설명",
      "severity": "high"
    }
  ],
  "recommendations": [
    {
      "title": "생활 습관 제안",
      "suggestion": "구체적인 실천 방법"
    }
  ],
  "medicalAdvice": "의료진 상담이 필요한 경우 명시"
}

**의료법 준수 원칙**:
1. 분석 표현 금지 ("~병입니다" → "~일 수 있습니다")
2. 가이드 표현 금지 ("~하세요" → "~를 고려해 보세요")
3. 모든 인사이트에 "의료진 상담 권장" 포함
4. 심각한 증상 조합 발견 시 즉시 병원 방문 권고

한국어로 친절하고 이해하기 쉽게 작성해 주세요.`;

        // Gemini API 호출
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API 키가 설정되지 않았습니다.' },
                { status: 500 }
            );
        }

        const { text } = await generateText({
            model: google('gemini-2.5-flash-exp') as any,
            prompt: prompt,
            temperature: 0.7,
        });

        // JSON 파싱
        let analysis;
        try {
            // JSON 블록 추출 (```json ... ``` 형식 처리)
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            analysis = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('JSON 파싱 실패:', text);
            return NextResponse.json(
                { error: 'AI 응답 파싱 실패', rawText: text },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            analysis,
            metadata: {
                medication: medInfo.name,
                period: analysisType,
                logCount: logs.length,
                analyzedAt: new Date().toISOString()
            }
        });

    } catch (error: any) {
        console.error('AI 분석 오류:', error);
        return NextResponse.json(
            { error: error.message || 'AI 분석 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
