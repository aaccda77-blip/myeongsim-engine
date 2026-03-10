
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/secure/trait-description
 * 
 * [REINFORCED MODULE V2]
 * - Completely Dynamic Generation via Gemini 2.5 Flash
 * - Hyper-Personalized based on User's Saju Element
 * - "One-Time" Unique Insight (Never the same text twice)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { trait, saju } = body;

        if (!trait) return NextResponse.json({ error: 'Trait Missing' }, { status: 400 });

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Extract Five Elements for personalization
        const dayMaster = saju?.dayPillar?.stem || 'Unknown';
        const dominantEl = getDominantElement(saju?.ohaeng);

        const prompt = `
        You are 'MyeongI', a wise destiny counselor.
        
        [TASK]
        The user clicked on their strength: "${trait}".
        Generate a unique, poetic, and actionable insight card for them.
        
        [USER PROFILE]
        - Day Master (Soul): ${dayMaster}
        - Dominant Element: ${dominantEl}
        
        [OUTPUT FORMAT]
        Return a valid JSON object ONLY:
        {
            "title": "A mystical 4-word title (Korean)",
            "subTitle": "1 sentence defining this trait uniquely for them (Korean)",
            "desc": "2-3 sentences explaining this strength using nature metaphors (Water/Fire/Tree etc) matching their element (${dominantEl}) (Korean)",
            "advice": "1 specific psychological tip (Korean)",
            "mission": "1 very small, actionable daily mission (Korean)",
            "superpower_badge": "A cool name for this ability"
        }
        
        [TONE]
        - Mystical but practical
        - Modern Sage vibe
        - Use metaphors related to ${dominantEl} (e.g., if Fire -> Flame, Warmth; if Water -> Flow, Ocean)
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
        console.error('Dynamic Trait Gen Error:', error);
        // Fallback for reliability
        return NextResponse.json({
            success: true,
            data: {
                title: "숨겨진 잠재력 발견",
                subTitle: "당신 안의 빛나는 원석을 찾았습니다.",
                desc: "지금 AI가 당신의 에너지를 깊이 분석하고 있습니다. 잠시 후 다시 시도하면 더 정밀한 분석이 제공됩니다.",
                advice: "자신의 강점을 믿으세요.",
                mission: "심호흡을 한번 깊게 하세요.",
                superpower_badge: "잠재력 마스터"
            }
        });
    }
}

function getDominantElement(ohaeng: any): string {
    if (!ohaeng) return 'Energy';
    const sorted = Object.entries(ohaeng).sort(([, a]: any, [, b]: any) => b - a);
    return sorted[0][0]; // e.g., 'fire', 'water'
}
