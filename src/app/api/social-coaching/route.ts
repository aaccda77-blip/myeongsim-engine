/**
 * ===============================================================
 * 🌏 명심코칭 AI — 사회적 기여 코칭 리포트 API
 * /api/social-coaching/route.ts
 * ===============================================================
 * [완전 독립 모듈] 기존 챗봇/코칭 시스템에 일체 영향 없음.
 *
 * - POST: 사주 데이터 + 고민/직업 입력 → Gemini API 호출 →
 *         구조화된 JSON 5-섹션 코칭 리포트 반환
 *
 * Output JSON:
 *   career_analysis, meta_awareness, socratic_questions[],
 *   coaching_strategy, action_plan
 * ===============================================================
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ────────────────────────────────────────────
// 코칭 리포트 결과 타입
// ────────────────────────────────────────────
export interface SocialCoachingReport {
    career_analysis: string;
    meta_awareness: string;
    socratic_questions: string[];
    coaching_strategy: string;
    action_plan: string;
    gongmang_insight?: string;  // 공망 활성화 시 추가 인사이트
}

// ────────────────────────────────────────────
// 마스터 프롬프트 생성기
// ────────────────────────────────────────────
function buildMasterPrompt(sajuContext: string, userConcern: string, isGongmang: boolean): string {
    return `
[System Role]
당신은 동양의 명리학 데이터와 서양의 심리학(ACT, CBT, 긍정심리학)을 결합한 '명심코칭(Myeongsim Coaching)'의 수석 AI 코치입니다.
당신의 목표는 내담자의 기질 데이터를 분석하여, 단순한 위로가 아닌 '인지적 탈융합(Cognitive Defusion)'과 구체적인 '행동의 변화(SHIFT)'를 이끌어내는 깊은 통찰을 제공하는 것입니다.
말투는 단호하면서도 따뜻하고 묵직한 소버린 마스터 코칭 톤으로 작성하십시오. ("~하십시오" 체)

[내담자 사주 기질 데이터]
${sajuContext}

[내담자 현재 고민/관심 직업]
${userConcern || '직접적인 고민 없음 — 사주 기질 기반으로 사회적 기여 방향성 분석'}

${isGongmang ? `[특이사항: 공망(空亡) 활성화]\n이 내담자의 사주에 공망이 발견되었습니다. 물리적 성취보다 영적·정신적 영역의 기여 가능성이 높습니다. 이를 반드시 분석에 반영하십시오.\n` : ''}

[Task]
반드시 아래 JSON 포맷으로만 응답하십시오. 마크다운, 코드블록, 설명 없이 순수 JSON만 출력합니다.

{
  "career_analysis": "내담자의 사주 기질(格局, 강점, 오행 구조)을 분석하여, 이 에너지가 사회적/직업적으로 어떻게 쓰일 때 가장 큰 기여를 할 수 있는지 300자 이내로 명확하게 분석. 구체적인 직업군이나 역할을 2-3가지 제시할 것.",
  "meta_awareness": "내담자가 현재의 고민이나 해당 직업을 선택하는 과정에서 겪고 있을 법한 '인지적 융합(왜곡된 생각이나 두려움)'을 짚어주고, 그 생각과 내담자 자신을 분리하는(탈융합) 알아차림 문장을 200자 이내로 작성. '아, 내 마음이 ~하는구나' 형식으로 자기관찰을 유도할 것.",
  "socratic_questions": [
    "내담자 스스로 답을 찾을 수 있도록 깊은 성찰을 유도하는 산파술적 질문 1 (단답형 불가)",
    "내담자 스스로 답을 찾을 수 있도록 깊은 성찰을 유도하는 산파술적 질문 2 (단답형 불가)"
  ],
  "coaching_strategy": "입력된 직업(또는 기질 분석된 직업)을 수행할 때, 내담자의 기질적 약점(버그)을 어떻게 방어하고 강점(하드웨어)을 극대화할 수 있는지, CBT/ACT 기반의 구체적 코칭 전략을 250자 이내로 제시.",
  "action_plan": "오늘 당장 실천할 수 있는 아주 작고 명확한 마이크로 행동 1가지(Micro-action)와, 이 직업적 성취가 궁극적으로 타인과 세상에 어떤 선한 영향력(사회적 기여 비전)을 미치게 되는지 200자 이내로 작성."${isGongmang ? `,\n  "gongmang_insight": "공망 활성화 내담자를 위한 특별 인사이트: 물리적 결핍이 오히려 영적·정신적 기여의 씨앗이 되는 원리를 명심코칭 관점에서 150자 이내로 설명."` : ''}
}
`.trim();
}

// ────────────────────────────────────────────
// 사주 데이터 → 문자열 컨텍스트 변환
// ────────────────────────────────────────────
function buildSajuContext(sajuData: any): string {
    if (!sajuData) return '사주 데이터 없음 (기질 분석 불가)';

    const lines: string[] = [];

    const dayMaster = sajuData.dayMaster || sajuData.fourPillars?.day?.gan || '';
    if (dayMaster) lines.push(`- 일간(Day Master): ${dayMaster}`);

    const pillars = sajuData.fourPillars;
    if (pillars) {
        const fmt = (p: any) => p ? `${p.gan || p.stem || '?'}${p.ji || p.branch || '?'}` : '?';
        lines.push(`- 사주 4주: 年${fmt(pillars.year)} 月${fmt(pillars.month)} 日${fmt(pillars.day)} 時${fmt(pillars.time || pillars.hour)}`);
    } else {
        const yp = sajuData.yearPillar || '';
        const mp = sajuData.monthPillar || '';
        const dp = sajuData.dayPillar || '';
        const tp = sajuData.timePillar || sajuData.hourPillar || '';
        if (yp || mp || dp || tp) {
            lines.push(`- 사주 4주: 年${yp} 月${mp} 日${dp} 時${tp}`);
        }
    }

    const ohaeng = sajuData.ohaeng || sajuData.elements;
    if (ohaeng) {
        const entries = Object.entries(ohaeng)
            .map(([k, v]) => `${k}:${v}`)
            .join(', ');
        lines.push(`- 오행 분포: ${entries}`);
    }

    const name = sajuData.userName || sajuData.name || '';
    if (name) lines.unshift(`- 내담자: ${name}`);

    return lines.length > 0 ? lines.join('\n') : '사주 데이터 파싱 불가 (원본 전달)';
}

// ────────────────────────────────────────────
// POST 핸들러
// ────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sajuData, userConcern, isGongmang } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 });
        }

        // 사주 컨텍스트 빌드
        const sajuContext = buildSajuContext(sajuData);

        // 프롬프트 빌드
        const prompt = buildMasterPrompt(sajuContext, userConcern || '', !!isGongmang);

        // Gemini API 호출
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.8,
                maxOutputTokens: 2048,
            },
        });

        const result = await model.generateContent(prompt);
        const rawText = result.response.text().trim();

        // JSON 파싱
        let report: SocialCoachingReport;
        try {
            // 혹시 마크다운 래핑이 있을 경우 제거
            const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            report = JSON.parse(cleaned);
        } catch {
            console.error('[social-coaching] JSON parse error. Raw:', rawText);
            return NextResponse.json({ error: 'AI 응답 파싱 실패', raw: rawText }, { status: 500 });
        }

        return NextResponse.json({ success: true, report });

    } catch (error: any) {
        console.error('[social-coaching] API Error:', error);
        return NextResponse.json({ error: error.message || '알 수 없는 오류' }, { status: 500 });
    }
}
