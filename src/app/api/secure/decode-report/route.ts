import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/secure/decode-report
 * 
 * 사용자 맞춤형 디코드(DECODE) 심층 무의식 분석 리포트 생성 API
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { saju, gongmang } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 사주 정보 추출
        const dayPillar = `${saju?.dayPillar?.stem || saju?.fourPillars?.day?.gan || ''}${saju?.dayPillar?.branch || saju?.fourPillars?.day?.ji || ''}`;
        const yearPillar = `${saju?.yearPillar?.stem || saju?.fourPillars?.year?.gan || ''}${saju?.yearPillar?.branch || saju?.fourPillars?.year?.ji || ''}`;
        const monthPillar = `${saju?.monthPillar?.stem || saju?.fourPillars?.month?.gan || ''}${saju?.monthPillar?.branch || saju?.fourPillars?.month?.ji || ''}`;
        const hourPillar = `${saju?.hourPillar?.stem || saju?.fourPillars?.time?.gan || ''}${saju?.hourPillar?.branch || saju?.fourPillars?.time?.ji || ''}`;

        const gongmangBranches = gongmang?.branches?.join(', ') || '알 수 없음';

        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline decode report.");
            const offlineData = {
                tab1_title: "1. 공망이 지장간 십신에 미치는 영향",
                tab1_content: `공망(${gongmangBranches})은 단순한 결핍이나 상실이 아니라, 현실적 제약을 벗어나 가상·정신·지식의 영역으로 에너지가 무한 확장되는 '블랙홀 포털'입니다. 내면의 에너지가 깊은 사색과 독창적 직관으로 변환됩니다.`,
                tab1_cards: [
                    {
                        title: "가상 및 지식 영역으로의 승화",
                        desc: "물리적 집착에서 벗어나 보이지 않는 가치, 시스템, 철학적 콘텐츠를 구축하는 치트키로 작용합니다."
                    },
                    {
                        title: "깊은 몰입과 압축력",
                        desc: "남들이 보지 못하는 이면의 원리를 단번에 꿰뚫어 보는 강력한 집중력을 부여합니다."
                    }
                ],
                tab2_title: "2. 공망의 현실적 특징",
                tab2_content: "기존의 낡은 관습이나 타인의 기준에 얽매이지 않고, 나만의 독창적인 새로운 패러다임을 스스로 창조해 나가는 기질적 동력이 됩니다.",
                tab2_bullet_points: [
                    {
                        title: "독창적 시스템 구축",
                        desc: "정형화된 틀을 깨고 자신만의 고유한 지식 모델과 영향력을 세상에 구현합니다."
                    },
                    {
                        title: "내면의 평온과 자유",
                        desc: "물질적 불안을 초월하여 영점의 고요함 속에서 진정한 자유를 누립니다."
                    }
                ],
                tab3_title: "3. 구조적 종합: 현실적 안정과 공망의 융합",
                tab3_content: "사주 원국의 단단한 중심축과 비어 있는 공망의 무한한 영감이 결합되어, 현실 세계에서 지속 가능한 독보적 가치를 만들어냅니다.",
                tab3_highlight: {
                    title: "💡 디코드 핵심 요약",
                    concept: "현실적 실행력 + 무한한 정신적 영감의 황금 융합",
                    realization: "결핍을 두려워하지 않고 우주의 빈 그릇으로 수용할 때, 삶의 모든 영역에서 기적 같은 풍요가 현실화됩니다."
                }
            };

            return NextResponse.json({
                success: true,
                data: offlineData
            });
        }

        const prompt = `
        You are 'MyeongI Decoder', an elite Myeongli (Saju) researcher and psychological analyst specializing in the Unconscious Mind & Gongmang (空亡, Empty/Void branches).
        
        [TASK]
        Generate a highly personalized 'DECODE' report based on the user's Saju.
        The user's core dilemma is that a certain branch in their Saju is empty (Gongmang), meaning its physical presence is nullified, but its spiritual/psychological presence is infinite (a virtual black hole).
        
        [USER SAJU]
        - Day Pillar (Self): ${dayPillar}
        - Year Pillar: ${yearPillar}
        - Month Pillar: ${monthPillar}
        - Hour Pillar: ${hourPillar}
        - Calculated Gongmang Branches (derived from Day Pillar): ${gongmangBranches}
        
        [GUIDELINE]
        1. Find which branch (Year, Month, or Hour branch) is empty (matches the Calculated Gongmang Branches: ${gongmangBranches}).
           * If the Year branch (${yearPillar[1]}) matches, it's Year-branch Gongmang (년지 공망).
           * If Month branch matches, it's Month-branch Gongmang (월지 공망).
           * If Hour branch matches, it's Hour-branch Gongmang (시지 공망).
           * If none matches, pick the closest empty node or analyze the spiritual void (공망) of their Day-branch (일지) / Year-branch as a spiritual key.
        2. Analyze the hidden stems (지장간, Jiji hidden stems) of the empty branch. Specifically find the 10 Gods (십신 - e.g., 상관, 식신, 겁재, 편재, 정재, 편관, 정관 등) inside the hidden stems of that empty branch.
        3. Follow the exact 'DECODE' structure, translating it to the user's Saju:
           * Part 1: How Gongmang affects the hidden stems (specifically the 10 Gods like 상관 or 식신 or 정재) inside the empty branch. Explain that this function transforms into virtual, spiritual, digital, or psychological genius/cheat keys.
           * Part 2: The realistic characteristics of this specific branch position Gongmang (e.g. 년지 공망 means separating from old traditions and creating one's own system/brand; 월지 공망 means choosing an unconventional path; 시지 공망 means hidden desires).
           * Part 3: Structural synthesis of a non-empty stable output function (e.g. 식신 in Month pillar) combined with the empty virtual input function (e.g. 공망된 상관 inside Year branch).
           
        [TONE & LANGUAGE]
        - Korean ONLY.
        - Friendly, empathetic, deep, psychological, and highly professional.
        - Use clear, non-jargony modern metaphors (like "black hole", "virtual space", "software", "cheat keys").
        
        [OUTPUT FORMAT]
        Return a valid JSON object ONLY. Do NOT wrap it in backticks, markdown, or text.
        {
            "tab1_title": "1. 공망이 지장간 [십신]에 미치는 영향",
            "tab1_content": "Detailed explanation of Gongmang affecting this hidden 10-God element...",
            "tab1_cards": [
                {
                    "title": "Card title 1 (e.g. 상관의 기운이 가상 공간으로 변환)",
                    "desc": "Explanation of how it functions in virtual, philosophical, or spiritual realms..."
                },
                {
                    "title": "Card title 2 (e.g. 블랙홀 같은 압축력)",
                    "desc": "Explanation of its intense focus or deep diving capability..."
                }
            ],
            "tab2_title": "2. [위치] 공망의 현실적 특징",
            "tab2_content": "Description of Saju branch position void behavior...",
            "tab2_bullet_points": [
                {
                    "title": "Bullet 1 (e.g. 기존 패러다임과의 분리)",
                    "desc": "How they break away from traditional molds to build unique models..."
                },
                {
                    "title": "Bullet 2 (e.g. 겁재의 공망 or 타 십신의 공망)",
                    "desc": "How it impacts their daily relationships, competition, or core drives..."
                }
            ],
            "tab3_title": "3. 구조적 종합: [십신]과 공망된 [십신]의 결합",
            "tab3_content": "Synthesis of their stable output function and the empty psychic channel...",
            "tab3_highlight": {
                "title": "💡 디코드 핵심 요약",
                "concept": "Summary of the dual combination (e.g. stable expression + void inspiration)...",
                "realization": "How to use this as a life cheat key to manifest reality from deep psyche..."
            }
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedText);

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('DECODE Generation Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to compile decode report'
        }, { status: 500 });
    }
}
