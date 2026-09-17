import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/secure/premium-report
 * 
 * 사용자 맞춤형 5파트 프리미엄 심층 리포트 생성 API
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { saju } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 사주 정보 추출 (다양한 페이로드 객체 구조 100% 지원)
        const fp = saju?.fourPillars || saju;
        
        const dayPillarGan = saju?.dayPillar?.stem || fp?.day?.ganKor || fp?.day?.gan?.char || fp?.day?.gan || saju?.dayMasterChar || '甲';
        const dayPillarJi = saju?.dayPillar?.branch || fp?.day?.jiKor || fp?.day?.ji?.char || fp?.day?.ji || '子';
        const dayPillar = `${dayPillarGan}${dayPillarJi}`;

        const yearPillarGan = saju?.yearPillar?.gan?.char || saju?.yearPillar?.gan || fp?.year?.ganKor || fp?.year?.gan?.char || fp?.year?.gan || '甲';
        const yearPillarJi = saju?.yearPillar?.ji?.char || saju?.yearPillar?.ji || fp?.year?.jiKor || fp?.year?.ji?.char || fp?.year?.ji || '子';
        const yearPillar = `${yearPillarGan}${yearPillarJi}`;

        const monthPillarGan = saju?.monthPillar?.gan?.char || saju?.monthPillar?.gan || fp?.month?.ganKor || fp?.month?.gan?.char || fp?.month?.gan || '甲';
        const monthPillarJi = saju?.monthPillar?.ji?.char || saju?.monthPillar?.ji || fp?.month?.jiKor || fp?.month?.ji?.char || fp?.month?.ji || '子';
        const monthPillar = `${monthPillarGan}${monthPillarJi}`;

        const hourPillarGan = saju?.hourPillar?.gan?.char || saju?.hourPillar?.gan || fp?.time?.ganKor || fp?.time?.gan?.char || fp?.time?.gan || '甲';
        const hourPillarJi = saju?.hourPillar?.ji?.char || saju?.hourPillar?.ji || fp?.time?.jiKor || fp?.time?.ji?.char || fp?.time?.ji || '子';
        const hourPillar = `${hourPillarGan}${hourPillarJi}`;

        const gongmangList = saju?.gongmang || ['申', '酉'];
        const gongmangStr = gongmangList.join(', ');

        const daewoonStartAge = saju?.daewoonStartAge || 10;
        const daewoonList = saju?.daewoonList || [];
        const daewoonString = daewoonList.map((d: any, i: number) => {
            const startAge = daewoonStartAge + i * 10;
            return `${startAge}세 대운 시작 (${d.startYear}년~${d.endYear}년) : ${d.ganZhi}`;
        }).join('\n');

        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline premium deep report.");
            const offlineReport = {
                overview: {
                    title: `${saju?.userName || '회원'}님만을 위한 프리미엄 심층 리포트`,
                    saju_analysis_name: `${dayPillarGan}일간의 고결한 지혜형`
                },
                part0: {
                    title: "0. 나를 알아보기",
                    subtitle: "성격 · 기질 · 장단점",
                    core_element: `${dayPillarGan} 일간 — 단단한 원석의 깊은 통찰과 중심`,
                    core_description: `${dayPillarGan}의 에너지는 겉으로 드러나는 요란함보다 내면에 축적된 단단한 지혜와 섬세한 감각을 상징합니다.`,
                    dark_code_analysis: "완벽해야만 안전하다는 생각의 방어막(다크코드)이 스스로를 쉽게 지치게 할 수 있습니다.",
                    neural_code_blueprint: "결과보다 과정의 리듬을 신뢰하는 유연한 인지 재배선(뉴럴코드)을 통해 고유한 에너지를 회복합니다.",
                    meta_code_analysis: "흔들리는 감정의 파도를 고요히 비추는 순수 자각(메타코드)의 자리에서 언제나 평온을 유지합니다."
                },
                part1: {
                    title: "1. 타이밍의 기술",
                    subtitle: "대운 흐름과 인생 날씨",
                    content: "대운의 흐름은 인생의 사계절과 같습니다. 봄에는 씨를 뿌리고 겨울에는 뿌리를 깊게 내리듯, 조급함을 내려놓을 때 최적의 타이밍이 찾아옵니다.",
                    mbsr_coaching: "호흡에 온전히 주의를 기울이며 현재 순간에 머무르는 스트레스 완화 훈련을 실천하세요.",
                    wealth_flow: {
                        labels: ["현재", "10년 뒤", "20년 뒤", "30년 뒤"],
                        values: [70, 85, 90, 95],
                        description: "전문성과 신뢰를 축적할수록 장기적인 부의 흐름이 단단하게 확장됩니다."
                    },
                    daewoon_flow: {
                        cycle_description: "대운의 전환기마다 새로운 지평이 열립니다.",
                        milestones: [
                            { year: 2026, age: 30, stem: "丙", branch: "午", score: 85, is_active: true, label: "개화기" }
                        ]
                    }
                },
                part2: {
                    title: "2. 마인드 디버깅",
                    subtitle: "생각과 감정 회로 리부트",
                    content: "불안과 두려움은 나를 지키기 위해 뇌가 띄우는 경고 신호일 뿐입니다. 판단 없이 가만히 바라볼 때 힘을 잃습니다.",
                    recursive_question: {
                        question: "내가 불안해하지 않는다면, 이 상황에서 지금 당장 할 수 있는 가장 단순한 행동은 무엇인가?",
                        guide: "머릿속 복잡한 계산을 멈추고 몸의 감각으로 돌아오세요."
                    },
                    meta_question: {
                        question: "이 모든 생각을 바라보고 있는 고요한 앎 자체는 누구인가?",
                        guide: "생각 뒤편의 텅 빈 공간에 편안히 머무르세요."
                    }
                },
                part3: {
                    title: "3. 관계의 기술",
                    subtitle: "관계의 거울과 온기",
                    content: "상대방의 반응에 휘둘리지 않고 내 안의 중심을 지킬 때, 가장 건강하고 자유로운 파트너십이 형성됩니다.",
                    socratic_question: "타인의 인정을 받지 않아도 나는 이미 온전한 존재인가?",
                    action_tip: "경계선을 지키되 따뜻한 감사의 말을 먼저 건네기"
                },
                part4: {
                    title: "4. 실천의 시작 & 마스터의 편지",
                    subtitle: "실천 수칙 및 인생 나침반",
                    content: "원석에서 보석으로 세공되는 과정에는 인내와 따스한 자비가 필요합니다.",
                    master_letter: `소중한 그대여, 그동안 스스로를 증명하려 얼마나 많은 긴장과 책임을 홀로 짊어져 왔습니까. 이제는 무거운 짐을 내려놓고 그대 본연의 맑고 고결한 빛을 믿으십시오. 그대의 길은 언제나 안전하게 빛나고 있습니다.`
                }
            };

            return NextResponse.json(offlineReport);
        }

        const prompt = `
        You are 'MyeongI Master Mentor', a legendary spiritual counselor and psychotherapist.
        
        [TASK]
        Generate an incredibly detailed, deeply touching, and highly personalized "Premium Deep Report" (심층 리포트) for the user based on their Saju and Gongmang (void).
        The report must weave traditional Saju interpretation with modern psychotherapies and consciousness structures.
        
        [USER SAJU]
        - Day Pillar (Self/Soul): ${dayPillar} (Day Master: ${dayPillarGan})
        - Year Pillar (Social Context): ${yearPillar}
        - Month Pillar (Life environment): ${monthPillar}
        - Hour Pillar (Hidden inner drive): ${hourPillar}
        - Gongmang (Void of Day Pillar): ${gongmangStr}
        
        [GONGMANG INTERPRETATION GUIDE]
        - If any pillar (especially Year, Month, or Hour) contains a Gongmang element, interpret this void not as a misfortune, but as a "quantum vacuum" or "mental infinity" where worldly attachments are dissolved, allowing infinite spiritual expansion (the Meta Code gateway).
        - For example, if Day Pillar is '辛巳', the Gongmang elements are '申' and '酉'. Year Pillar '庚申' contains '申' (년지 공망). Explain how this 년지 공망 makes their outer social background feel empty but fuels their inner drive for self-actualization and spiritual growth.
        
        [CRITICAL KEYWORDS TO INTEGRATE BEAUTIFULLY]
        You MUST explain and integrate these terms beautifully so even beginners can understand and feel touched:
        1. Psychotherapies: ACT (Acceptance and Commitment Therapy), CBT (Cognitive Behavioral Therapy), MBCT (Mindfulness-Based Cognitive Therapy), DBT (Dialectical Behavior Therapy), MBSR (Mindfulness-Based Stress Reduction), MSC (Mindful Self-Compassion)
        2. Consciousness Codes: 다크코드 (Dark Code - unconscious traps/shadows), 뉴럴코드 (Neural Code - neural habits/wiring), 메타코드 (Meta Code - transcending ego/pure meta-awareness)
        3. Socratic & Self-Inquiry Questions: 재귀적 질문 (Recursive questions tracing roots), 메타 질문 (Meta-perspective questions), 소크라테스 질문 (Challenging core beliefs), 알아차림의 알아차림 질문 (Pure awareness questions)
        
        [REPORT STRUCTURE - 5 PARTS]
        The response MUST follow this exact structure in the JSON output:
        
        - Part 0: 나를 알아보기 (Identity & Core)
          * Title/Theme: A poetic name based on their Day Master (e.g. for 辛金, "천 번 단련된 명검 - 신금 일간")
          * Analysis: Detail their core talent and their "다크코드" (perfectionist shadow, self-criticism) vs "뉴럴코드" (natural strengths) vs "메타코드" (transcending perspective and ultimate integration of Saju).
          
        - Part 1: 타이밍의 기술 (Timing & Rhythm)
          * Content: How to flow with their 10-year life wave. 
          * Integration: Use MBSR & MBCT to explain how to pause when their energy is dry, observing stress reactions instead of impulsively fighting the timing.
          * Wealth Flow (시기별 재산 흐름): Provide 4 numerical values representing their wealth index at different stages: [현재, 10년 뒤, 20년 뒤, 30년 뒤]. Values must be between 10 and 100. Write a brief description of this trend.
          * Daewoon Flow (나의 대운 흐름): Generate a structured timeline of 10 major 10-year Daewoon cycles (up to 100 years old). 
            You MUST build this timeline STRICTLY based on the user's actual computed Daewoon list:
            [USER DAEWOON LIST]
            ${daewoonString}
            
            Each milestone item in "milestones" must map exactly to these computed cycles:
            - "year": The start year of the cycle (from the list, e.g. 1990)
            - "age": The start age of the cycle (e.g. 10, 20, 30, 40, 50, 60, 70...)
            - "stem": The Heavenly Stem (1 character in Chinese, e.g. 壬)
            - "branch": The Earthly Branch (1 character in Chinese, e.g. 午)
            - "score": Energy score (10-100)
            - "label": "과도기", "준비기", "도약기", "황금기", "안정기", "성숙기", "수확기" 등
            - "is_active": true only for the cycle covering the user's actual current age group today.
          
        - Part 2: 마인드 디버깅 (Mind Debugging)
          * Content: Restructuring cognitive distortions (CBT) and regulating intense emotional states (DBT) using Saju traits.
          * Inquiry: Provide 1 "재귀적 질문" and 1 "메타 질문".
          
        - Part 3: 관계의 기술 (Relationship Mirror)
          * Content: Compassionate relationship guide.
          * Integration: Use MSC (Self-Compassion) to soothe wounds.
          * Inquiry: Provide 1 "소크라테스 질문".
          
        - Part 4: 실천의 시작 (Action Plan & Master Letter)
          * Content: Practical remedies. Ohaeng elements balance color/number/direction tips.
          * Integration: ACT (Commitment to values) to overcome perfectionism, and 1 "알아차림의 알아차림 질문".
          * Master Letter (마스터의 편지): Write a long, poetic, tear-inducing mentoring letter from 'Master' titled "원석에서 보석으로, 당신의 세공이 완료되는 날에 대하여".
          
        [TONE]
        - Extremely warm, deeply encouraging, and heart-melting.
        - Poetic but highly structured.
        
        [OUTPUT FORMAT]
        Return a valid JSON object ONLY. Do NOT wrap it in backticks or markdown.
        {
            "overview": {
                "title": "이경윤님만을 위한 심층 리포트 (or personalized name based on user data)",
                "saju_analysis_name": "e.g. 팔방미인형 (어디에 놓아도 자기 몫을 해내는 균형 잡힌 팔자)"
            },
            "part0": {
                "title": "0. 나를 알아보기",
                "subtitle": "성격 · 기질 · 장단점",
                "core_element": "e.g. 신금 일간 — 보석의 높은 기준과 날카로운 감각",
                "core_description": "Detailed explanation of their soul elements...",
                "dark_code_analysis": "Explanation of their '다크코드' (shadow habits)...",
                "neural_code_blueprint": "Explanation of their '뉴럴코드' (re-wired positive neural networks)...",
                "meta_code_analysis": "Explanation of their '메타코드' (transcending perspective and ultimate integration of Saju)..."
            },
            "part1": {
                "title": "1. 타이밍의 기술",
                "subtitle": "대운 흐름과 인생 날씨",
                "content": "Explanation of life cycle timing...",
                "mbsr_coaching": "MBSR & MBCT dynamic stress control and timing adjustment guides...",
                "wealth_flow": {
                    "labels": ["현재", "10년 뒤", "20년 뒤", "30년 뒤"],
                    "values": [60, 85, 40, 95],
                    "description": "시기별 재산 흐름에 대한 총평..."
                },
                "daewoon_flow": {
                    "cycle_description": "대운 주기 변동에 대한 설명...",
                    "milestones": [
                        { "year": 1990, "age": 10, "stem": "壬", "branch": "午", "score": 40, "is_active": false, "label": "과도기" }
                        // Construct 10 milestones in this array strictly corresponding to the computed [USER DAEWOON LIST] (10, 20, ..., 100)
                    ]
                }
            },
            "part2": {
                "title": "2. 마인드 디버깅",
                "subtitle": "생각과 감정 회로 리부트",
                "content": "Detailed CBT & DBT integration...",
                "recursive_question": {
                    "question": "The Recursive Question string...",
                    "guide": "How to contemplate..."
                },
                "meta_question": {
                    "question": "The Meta Question string...",
                    "guide": "How to contemplate..."
                }
            },
            "part3": {
                "title": "3. 관계의 기술",
                "subtitle": "신살 · 귀인 · 소통의 문",
                "content": "Relationship profiling and MSC application...",
                "socratic_question": {
                    "question": "The Socratic Question string...",
                    "guide": "How to use..."
                }
            },
            "part4": {
                "title": "4. 실천의 시작",
                "subtitle": "종합 리포트 + 액션플랜",
                "ohaeng_remedy": "Ohaeng balance color, number, direction advice...",
                "act_action_plan": "ACT-based action steps...",
                "awareness_question": {
                    "question": "The Awareness question string...",
                    "guide": "How to sync..."
                },
                "master_letter": {
                    "title": "💌 마스터의 편지: 원석에서 보석으로, 당신의 세공이 완료되는 날에 대하여",
                    "letter": "A long, deeply emotional, and beautiful mentorship letter..."
                }
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
        console.error('Premium Report Gen Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate premium report'
        }, { status: 500 });
    }
}
