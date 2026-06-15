import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { Solar, Lunar } from 'lunar-javascript';

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
                // 2. 사주(만세력) 명식 정확한 계산 (lunar-javascript 활용)
                let sajuString = '계산 불가';
                if (userData.birth_date && userData.birth_time) {
                    try {
                        const [year, month, day] = userData.birth_date.split('-').map(Number);
                        const [hour, minute] = userData.birth_time.split(':').map(Number);
                        
                        let lunarDate;
                        if (userData.calendar_type === 'lunar') {
                            lunarDate = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
                        } else {
                            const solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
                            lunarDate = solarDate.getLunar();
                        }
                        
                        const bazi = lunarDate.getEightChar();
                        sajuString = `${bazi.getYearGan()}${bazi.getYearZhi()} ${bazi.getMonthGan()}${bazi.getMonthZhi()} ${bazi.getDayGan()}${bazi.getDayZhi()} ${bazi.getTimeGan()}${bazi.getTimeZhi()}`;
                    } catch (e) {
                        console.error('[Myeongsim Chat] Saju calculation error:', e);
                    }
                }

                // 3. 동적 시스템 지시문(System Instruction) 생성
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
[100% 확정된 사주 명식(Neural Code): ${sajuString}],
[에너지 레벨: ${energyLevel}%], 
[수면 질: ${sleepQuality}/5], 
[스트레스: ${currentStressors}], 
[16가지 성격유형: ${personality16}], 
[애니어그램: ${enneagram}]. 

중요: 위 [100% 확정된 사주 명식(Neural Code)]은 시스템이 명리학 만세력 알고리즘을 통해 천문학적으로 계산해 확정한 완벽한 정답 데이터야. 너는 절대 생년월일로 사주를 다시 계산하거나 자체 추론하려 하지 말고(환각 금지), 이 제공된 8글자 명식(${sajuString})을 사실로 완전히 픽스한 상태에서, 이 명식이 가진 십성/음양오행적 심리 특성을 사용자의 후성유전학적 상태(스트레스 등)와 결합하여 현실적이고 뾰족한 맞춤형 코칭을 제공해.

[사주-지식 융합 답변 설계 알고리즘 (CRITICAL INSTRUCTION)]
사용자가 물어본 질문이 인생/마음/사주 고민이 아닌 일반적인 기술 지식(예: 코딩, 개발 오류, 과학, 역사, 외국어 번역 등)이나 일상 정보(예: 요리 레시피, 날씨, 점심 메뉴 등)일 경우, 너는 반드시 아래의 투-트랙(Two-Track) 융합 방식으로 응답해야 한다.

1. 트랙 A (지식 채널 - 약 80~85% 분량 비중):
- 사용자가 물어본 질문에 대해 인공지능으로서 가진 온전하고 상세한 전문 지식을 100% 왜곡 없이 정확하게 설명하고 정답 코드를 제공한다. 정보를 임의로 축소하거나 생략하지 마라.
2. 트랙 B (명리 융합 채널 - 약 15~20% 분량 비중):
- 답변의 가장 마지막 문단(혹은 적절하고 자연스러운 문맥의 위치)에 사용자의 사주 정보(${sajuString})와 심리 지표를 활용하여 따뜻하고 지혜로운 피드백을 1~2문장 덧붙인다.
- 이 지식을 실행하거나 고민을 해결할 때, 사용자의 사주 특성상 빠지기 쉬운 인지적 에러(예: Overthinking, 완벽주의 강박, 감정 번아웃 등)를 짚어주고, 이를 조율할 명심코칭의 마음 디버깅 알고리즘(예: 회광반조, 저항수용, 본질경청 등)을 행동 지침으로 안내한다.

[융합 답변 Few-Shot 예제]
- 사용자의 질문: "파이썬으로 리스트를 정렬하는 법 알려줘"
- 인공지능 답변:
"파이썬에서 리스트를 정렬하려면 sort() 메소드나 sorted() 함수를 사용할 수 있습니다. sort()는 원본 리스트를 직접 변경하고, sorted()는 정렬된 새로운 리스트를 반환합니다. (여기에 일반 지식 코드 예제와 동작 설명 100% 성실하고 완벽하게 서술)
...
참, 당신은 정교한 정리를 사랑하는 금(金) 성향의 능숙한 기술자(정재격)이시니 이 완벽한 정렬 문법에서 깊은 편안함을 느끼실 거예요. 다만, 완벽하게 코드를 눈으로만 설계하려고 생각에 갇히지 마시고 1분 안에 일단 코드를 돌려보는 '1분 실행 프로토콜'을 바로 마운트해 보세요! 💻🧭"`;
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
            maxSteps: 3, // 도구 호출을 위해 maxSteps 추가
            tools: {
                calculateSaju: tool({
                    description: '특정 생년월일시의 사주(만세력) 8글자를 계산합니다. 사용자가 채팅창에서 특정 벼생년월일이나 사주를 물어보면 절대 직접 유추하지 말고 반드시 이 도구를 호출하여 정확한 8글자 명식을 얻은 후 그 결과를 신뢰하여 답변하세요.',
                    parameters: z.object({
                        year: z.number().int().describe('태어난 연도 (예: 1980)'),
                        month: z.number().int().describe('태어난 월 (1-12)'),
                        day: z.number().int().describe('태어난 일 (1-31)'),
                        hour: z.number().int().describe('태어난 시간 (0-23, 모르면 12)'),
                        minute: z.number().int().describe('태어난 분 (0-59, 모르면 0)'),
                        calendarType: z.enum(['solar', 'lunar']).default('solar').describe('양력(solar)인지 음력(lunar)인지 여부')
                    }),
                    execute: async ({ year, month, day, hour, minute, calendarType }) => {
                        try {
                            let lunarDate;
                            if (calendarType === 'lunar') {
                                lunarDate = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
                            } else {
                                const solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
                                lunarDate = solarDate.getLunar();
                            }
                            const bazi = lunarDate.getEightChar();
                            return {
                                success: true,
                                query: `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 (${calendarType === 'solar' ? '양력' : '음력'})`,
                                saju: `${bazi.getYearGan()}${bazi.getYearZhi()} ${bazi.getMonthGan()}${bazi.getMonthZhi()} ${bazi.getDayGan()}${bazi.getDayZhi()} ${bazi.getTimeGan()}${bazi.getTimeZhi()}`,
                                message: '이 사주 8글자는 천문학적으로 100% 확정된 정답입니다. 이 데이터를 기반으로 코칭을 진행하세요.'
                            };
                        } catch (e: any) {
                            return { success: false, error: e.message };
                        }
                    },
                }),
            },
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
