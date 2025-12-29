import { coachingService } from '@/services/coachingService';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { userId, stage } = await req.json();

        if (!userId) {
            return new Response('Missing userId', { status: 400 });
        }

        // 1. Fetch Chat Logs for this stage
        const { data: logs, error } = await supabase
            .from('chat_logs')
            .select('role, content')
            .eq('user_id', userId)
            .eq('stage_context', stage)
            .order('created_at', { ascending: true });

        if (error || !logs || logs.length === 0) {
            return new Response(JSON.stringify({ summary: "상담 기록이 없습니다." }), { status: 200 });
        }

        // 2. Format logs for AI
        const conversationText = logs.map(l => `${l.role}: ${l.content}`).join('\n');

        // 3. Generate Summary with Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is missing');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
당신은 베테랑상담 전문가입니다. 다음의 상담 내용을 분석하여, '다음 상담(Next Session)'에 참고할 수 있는 핵심 요약본을 작성해주세요.

[상담 내용]
${conversationText}

[요청 사항]
1. 내담자의 핵심 고민과 현재 심리 상태를 1-2문장으로 요약하세요.
2. 내담자의 특징이나 성향(사주 관련 언급 포함)을 기록하세요.
3. 이번 상담에서 합의된 실천 사항(Action Item)이 있다면 적어주세요.
4. 다음 상담에서 AI 코치가 기억해야 할 맥락을 "Memo:"로 명확히 남겨주세요.
`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        // 4. Save to Coaching Sessions (Memory)
        await coachingService.saveStageSummary(userId, stage, summary);

        // 5. Update User Stage (Unlock Next Level - Optional Logic)
        // For now, we just save the summary. Triggering stage up can be done here or separately.

        return new Response(JSON.stringify({ success: true, summary }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Summary API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
