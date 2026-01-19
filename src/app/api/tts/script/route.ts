import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text required' }, { status: 400 });
        }

        if (!process.env.GOOGLE_AI_API_KEY) {
            console.error("Missing GOOGLE_AI_API_KEY");
            return NextResponse.json({ error: 'Server Config Error: Missing Gemini Key' }, { status: 500 });
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

        // [User Request] Primary: gemini-2.5-flash
        // Fallback: gemini-1.5-flash if 2.5 fails
        let model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let result;
        try {
            result = await model.generateContent(systemPrompt);
        } catch (modelError: any) {
            console.warn(`[Gemini] Primary model 'gemini-2.5-flash' failed: ${modelError.message}. Falling back to 'gemini-1.5-flash'.`);
            model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
