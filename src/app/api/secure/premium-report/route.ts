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

        // 사주 정보 추출
        const dayPillarGan = saju?.dayPillar?.stem || '辛';
        const dayPillarJi = saju?.dayPillar?.branch || '巳';
        const dayPillar = `${dayPillarGan}${dayPillarJi}`;

        const yearPillarGan = saju?.yearPillar?.gan?.char || saju?.yearPillar?.gan || '庚';
        const yearPillarJi = saju?.yearPillar?.ji?.char || saju?.yearPillar?.ji || '申';
        const yearPillar = `${yearPillarGan}${yearPillarJi}`;

        const monthPillarGan = saju?.monthPillar?.gan?.char || saju?.monthPillar?.gan || '癸';
        const monthPillarJi = saju?.monthPillar?.ji?.char || saju?.monthPillar?.ji || '未';
        const monthPillar = `${monthPillarGan}${monthPillarJi}`;

        const hourPillarGan = saju?.hourPillar?.gan?.char || saju?.hourPillar?.gan || '乙';
        const hourPillarJi = saju?.hourPillar?.ji?.char || saju?.hourPillar?.ji || '未';
        const hourPillar = `${hourPillarGan}${hourPillarJi}`;

        const gongmangList = saju?.gongmang || ['申', '酉'];
        const gongmangStr = gongmangList.join(', ');

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
          * Daewoon Flow (나의 대운 흐름): Generate a structured timeline of 7 major 10-year Daewoon cycles with year, age, Heavenly Stem (stem) and Earthly Branch (branch) in Chinese characters, a score (10-100), label (e.g., "성장기", "황금기"), and is_active (true only for the current age group).
          
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
                    "cycle_description": "이경윤님의 대운 주기는 N년 주기로 변하며...",
                    "milestones": [
                        { "year": 1996, "age": 17, "stem": "庚", "branch": "戌", "score": 40, "is_active": false, "label": "과도기" },
                        { "year": 2006, "age": 27, "stem": "己", "branch": "酉", "score": 60, "is_active": false, "label": "준비기" },
                        { "year": 2016, "age": 37, "stem": "戊", "branch": "申", "score": 75, "is_active": false, "label": "도약기" },
                        { "year": 2026, "age": 47, "stem": "丁", "branch": "未", "score": 90, "is_active": true, "label": "황금기" },
                        { "year": 2036, "age": 57, "stem": "丙", "branch": "午", "score": 65, "is_active": false, "label": "안정기" },
                        { "year": 2046, "age": 67, "stem": "乙", "branch": "巳", "score": 50, "is_active": false, "label": "성숙기" },
                        { "year": 2056, "age": 77, "stem": "甲", "branch": "辰", "score": 80, "is_active": false, "label": "수확기" }
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
