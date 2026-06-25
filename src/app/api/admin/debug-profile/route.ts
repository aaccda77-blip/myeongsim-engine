import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: NextRequest) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent("테스트용 문장 하나를 생성해줘.");
        const text = result.response.text();

        // Simulate exact insert from PersonaProfileModule
        const { error, data } = await supabase
            .from('long_term_memory')
            .insert({
                user_id: 'd0e12271-47fb-4458-aa35-502d64f1d07b', // A safe valid format UUID 
                persona_id: 'CORE_PROFILE',
                content: text,
                metadata: { type: 'core_profile_debug' }
            })
            .select();

        return new Response(JSON.stringify({
            success: !error,
            geminiOutput: text,
            dbData: data,
            dbError: error || 'None'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ success: false, errorMessage: e.message, fullError: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
