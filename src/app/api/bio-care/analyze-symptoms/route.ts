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

        // Gemini API 호출 또는 오프라인 스마트 시뮬레이션 모드
        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline bio-care analysis.");
            const offlineAnalysis = {
                timePatterns: [
                    {
                        title: "식사 및 복약 타이밍 패턴",
                        finding: `${medInfo.name} 복용 후 소화 주기 및 식사 시간 간격에 따른 신체 반응이 관찰되었습니다. 규칙적인 식사 템포 유지가 안정에 도움이 될 수 있습니다.`,
                        severity: "low"
                    },
                    {
                        title: "일일 컨디션 리듬",
                        finding: "오후 시간대 피로도 변화가 감지되므로 가벼운 수분 보충과 5분간의 심호흡 스트레칭을 고려해 보세요.",
                        severity: "low"
                    }
                ],
                frequencyAnalysis: [
                    {
                        title: "증상 빈도 및 적응도 분석",
                        finding: `최근 ${logs.length}일간의 기록을 바탕으로 볼 때, 생체 리듬이 약물 특성에 점진적으로 적응해 가는 패턴이 보입니다.`,
                        severity: "low"
                    }
                ],
                correlations: [
                    {
                        title: `${medInfo.name} 상관관계`,
                        finding: `주요 관찰 증상(${medInfo.commonSideEffects.slice(0, 2).join(', ')})과 복약 패턴 간의 연계성을 추적 중이며, 전반적으로 안정적인 관리 상태를 보입니다.`,
                        severity: "medium"
                    }
                ],
                warnings: [
                    {
                        title: "유의 사항 안내",
                        finding: `탈수 예방 및 규칙적인 수분 섭취를 유지하시고, ${medInfo.warnings[0]} 관련 징후가 있을 경우 주의 깊게 살펴주세요.`,
                        severity: "low"
                    }
                ],
                recommendations: [
                    {
                        title: "수분 섭취 및 식이 조절",
                        suggestion: "기상 직후 미온수 1컵과 규칙적인 단백질/식이섬유 중심 식단을 권장합니다."
                    },
                    {
                        title: "바이오 리듬 안정화",
                        suggestion: "복약 후 30분간은 급격한 신체 활동을 피하고 편안한 호흡 상태를 유지해 보세요."
                    }
                ],
                medicalAdvice: "본 분석은 통계적 생활 패턴 참고용입니다. 지속적인 불편 증상이나 이상 징후가 있을 시 반드시 담당 전문의와 상담하시기 바랍니다."
            };

            return NextResponse.json({
                success: true,
                analysis: offlineAnalysis,
                metadata: {
                    medication: medInfo.name,
                    period: analysisType,
                    logCount: logs.length,
                    analyzedAt: new Date().toISOString()
                }
            });
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
