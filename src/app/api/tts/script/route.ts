import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text required' }, { status: 400 });
        }

        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
        const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline TTS script.");
            const offlineScript = [
                { speaker: "host", text: `아이고, 그러셨군요! "${text.slice(0, 30)}..."라는 말씀을 들으니 마음 한구석이 찡해지네요. 코치님, 이 말씀 어떻게 보시나요?` },
                { speaker: "expert", text: "네, 참으로 자연스러운 내면의 호소입니다. 사람은 누구나 새로운 도약을 앞두고 에너지를 수렴할 때 이러한 긴장과 불안을 마주하게 됩니다." },
                { speaker: "host", text: "아! 그러니까 결코 시스템 고장이 아니라, 더 높이 뛰기 위해 움츠리는 과정이라는 거군요?" },
                { speaker: "expert", text: "정확합니다. 조급해하지 마시고 오늘 하루는 어깨의 힘을 툭 빼고 깊은 호흡으로 자신을 다정하게 안아주십시오." },
                { speaker: "host", text: "맞아요! 여러분, 지금 이대로도 충분히 멋지시니까요, 힘내세요! 저희가 늘 응원할게요!" }
            ];
            return NextResponse.json(offlineScript);
        }

        const systemPrompt = `
        **Situation:**
        This dialogue is for the "Myeongsim Coaching Live Show" (Myeongsim Talk Session).
        Participants: [1. MC Joy, 2. Myeongsim Coach, 3. User (Guest)]
        You (AI) must create a script acting as both "MC Joy" and "Myeongsim Coach".

        **Characters:**
        1. **MC Joy (host):**
           - Name: '조이(Joy)'
           - Personality: Bright, curious, highly empathetic to the user's emotion.
           - Tone: Quick, energetic, high-pitched. Uses exclamations like "~하네요!", "정말요?".
           - Role: "User's Side". Translates Coach's difficult terms into easy words. Breaks the ice.
        
        2. **Myeongsim Coach (expert):**
           - Name: '명심 선생님'
           - Personality: Calm, wise, fact-based.
           - Tone: Slow, deep voice, trustworthy. Uses weighed ending "~입니다.", "~하게나.".
           - Role: Provides deep insight based on Saju/Psychology. Fact-check.

        **Rules:**
        1. Context: The user just said: "${text}"
        2. Structure:
           - MC opens with empathy ("Aigo...").
           - MC asks Coach for opinion.
           - Coach analyzes.
           - MC reacts (asks for clarification if difficult).
           - Coach gives solution.
           - MC closes with support.
        3. Output JSON ONLY: Array of objects { "speaker": "host" | "expert", "text": "..." }
        4. Language: Korean.
        `;

        // [User Request] Primary: gemini-2.5-flash (Latest Fast Model)
        // Fallback: gemini-2.5-flash (Reliable Backup)
        let model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let result;
        try {
            result = await model.generateContent(systemPrompt);
        } catch (modelError: any) {
            console.warn(`[Gemini] Primary model 'gemini-1.5-pro' failed: ${modelError.message}. Falling back to 'gemini-2.5-flash'.`);
            model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            result = await model.generateContent(systemPrompt);
        }

        const response = await result.response;
        const rawText = response.text();

        // Safe Parse
        let script = [];
        try {
            // Remove markdown format if present
            const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            script = JSON.parse(jsonStr);
        } catch (e) {
            console.error("JSON Parse Error:", rawText);
            // Fallback: Return original as expert
            return NextResponse.json({ script: [{ speaker: 'expert', text: text }] });
        }

        return NextResponse.json({ script });

    } catch (error: any) {
        console.error('Script Gen Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
