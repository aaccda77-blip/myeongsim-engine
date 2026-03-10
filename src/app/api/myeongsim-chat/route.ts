import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// 환경 변수 안내 (.env.local에 추가 필요):
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
// SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
// GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '',
});

export async function POST(req: NextRequest) {
    try {
        const { messages, userId } = await req.json();

        // 기본 명심코칭 시스템 프롬프트 (데이터 오류/미입력 시 대체용 Fallback)
        let systemInstruction = `너는 사주 명리와 현대 심리학, 뇌과학을 결합한 '명심코칭'의 AI 코치야. 뻔한 위로가 아닌 현실적이고 뾰족한 맞춤형 코칭을 제공해.`;

        // 1. Supabase에서 유저 데이터 조회
        if (userId) {
            const { data: userData, error } = await supabase
                .from('user_onboarding_data')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && userData) {
                // 2. 동적 시스템 지시문(System Instruction) 생성
                const birthDate = userData.birth_date || '알 수 없음';
                const birthTime = userData.birth_time || '알 수 없음';
                const energyLevel = userData.energy_level !== null && userData.energy_level !== undefined ? userData.energy_level : '알 수 없음';
                const sleepQuality = userData.sleep_quality !== null && userData.sleep_quality !== undefined ? userData.sleep_quality : '알 수 없음';
                const currentStressors = (userData.current_stressors && Array.isArray(userData.current_stressors))
                    ? userData.current_stressors.join(', ')
                    : '없음';
                const personality16 = userData.personality_16 || '미입력';
                const enneagram = userData.enneagram || '미입력';

                systemInstruction = `너는 사주 명리와 현대 심리학, 뇌과학을 결합한 '명심코칭'의 AI 코치야. 
현재 사용자의 데이터: 
[생년월일/시간: ${birthDate} ${birthTime}], 
[에너지 레벨: ${energyLevel}%], 
[수면 질: ${sleepQuality}/5], 
[스트레스: ${currentStressors}], 
[16가지 성격유형: ${personality16}], 
[애니어그램: ${enneagram}]. 
이 후성유전학적 상태와 선천적 기질을 바탕으로 뻔한 위로가 아닌 현실적이고 뾰족한 맞춤형 코칭을 제공해.`;
            } else {
                console.warn('[Myeongsim Chat] User onboarding data not found or error fetching:', error?.message);
            }
        } else {
            console.warn('[Myeongsim Chat] No userId provided in request body. Using fallback prompt.');
        }

        // 3. 제미나이 API 연동 및 스트리밍 (Vercel AI SDK)
        const result = await streamText({
            model: google('gemini-2.5-flash') as any, // 필요시 gemini-2.5-pro 로 변경
            system: systemInstruction,
            messages: messages,
        });

        // 스트리밍 결과 반환
        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('[Myeongsim Chat] API Error:', error);
        return new Response(JSON.stringify({
            error: error.message || '인공지능 응답을 불러오는 중 오류가 발생했습니다.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
