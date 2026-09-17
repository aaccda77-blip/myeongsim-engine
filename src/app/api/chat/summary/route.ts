import { coachingService } from '@/services/coachingService';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const POST = requireAuth(async (req: Request, auth) => {
    try {
        const { stage } = await req.json();

        // Use authenticated user ID
        const userId = auth.userId;

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

        // 3. Generate Summary with Gemini or Offline Mock
        const isMockMode = process.env.GEMINI_MOCK_MODE === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
        const apiKey = process.env.GEMINI_API_KEY;

        let summary = '';
        if (isMockMode || !apiKey) {
            console.log("Mock AI Mode enabled, returning customized offline chat summary.");
            summary = `[상담 핵심 요약]
1. 핵심 고민: 내면의 불안과 미래에 대한 조급함을 직면하고 기질적 중심을 잡고자 함.
2. 기질 특성: 깊은 통찰력과 책임감을 지녔으나 완벽주의로 인한 에너지 소모 주의 필요.
3. 실천 사항: 매일 아침 1분간 제로포인트 호흡 및 우선순위 1개 집중 실천.
Memo: 다음 상담 시 내담자의 수면 리듬 및 감정 이완 상태를 우선 점검할 것.`;
        } else {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
            summary = result.response.text();
        }

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
});
