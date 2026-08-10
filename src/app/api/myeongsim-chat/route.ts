import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Solar, Lunar } from 'lunar-javascript';
import { optionalAuth } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { messages, userId: clientUserId, sessionId, sajuData: clientSajuData } = await req.json();

        // [SECURITY] Server-side Auth Check
        const authResult = await optionalAuth(req);
        // If authenticated, trust server's userId. Otherwise, fallback to client's (guest) id.
        const effectiveUserId = authResult.userId || clientUserId;

        const apiKey = process.env.GEMINI_API_KEY || 
                       process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                       process.env.GOOGLE_GEMINI_API_KEY || 
                       process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

        if (!apiKey) {
            console.error('[Myeongsim Chat] API Key missing');
            return new Response(JSON.stringify({ error: 'Gemini API 키가 설정되지 않았습니다.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 1. 유저 데이터 병합 (Supabase DB + 클라이언트 전달 sajuData)
        let dbUserData: any = null;
        if (effectiveUserId && !effectiveUserId.startsWith('guest-')) {
            try {
                const { data, error } = await supabase
                    .from('user_onboarding_data')
                    .select('*')
                    .eq('id', effectiveUserId)
                    .single();
                if (!error && data) dbUserData = data;
            } catch (err) {
                console.error('[Myeongsim Chat] User data fetch error:', err);
            }
        }

        const userName = clientSajuData?.userName || dbUserData?.name || '명심가';
        const birthDate = clientSajuData?.birthDate || dbUserData?.birth_date || '';
        const birthTime = clientSajuData?.birthTime || dbUserData?.birth_time || '12:00';
        const calendarType = clientSajuData?.calendarType || dbUserData?.calendar_type || 'solar';
        const gender = clientSajuData?.gender || dbUserData?.gender || 'female';
        const energyLevel = dbUserData?.energy_level ?? '80';
        const sleepQuality = dbUserData?.sleep_quality ?? '4';
        const currentStressors = Array.isArray(dbUserData?.current_stressors) ? dbUserData.current_stressors.join(', ') : '없음';

        let sajuString = '계산 불가';
        let dayStem = clientSajuData?.dayMaster || '辛';

        if (birthDate) {
            try {
                const cleanDate = birthDate.includes('T') ? birthDate.split('T')[0] : birthDate;
                const dateParts = cleanDate.split('-').map(Number);
                if (dateParts.length === 3 && !isNaN(dateParts[0])) {
                    const [year, month, day] = dateParts;
                    const timeParts = (birthTime || '12:00').split(':').map(Number);
                    const hour = timeParts[0] || 12;
                    const minute = timeParts[1] || 0;

                    let lunarDate;
                    if (calendarType === 'lunar') {
                        lunarDate = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
                    } else {
                        const solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
                        lunarDate = solarDate.getLunar();
                    }
                    const bazi = lunarDate.getEightChar();
                    dayStem = bazi.getDayGan();
                    sajuString = `${bazi.getYearGan()}${bazi.getYearZhi()} ${bazi.getMonthGan()}${bazi.getMonthZhi()} ${bazi.getDayGan()}${bazi.getDayZhi()} ${bazi.getTimeGan()}${bazi.getTimeZhi()}`;
                }
            } catch (e) {
                console.error('[Myeongsim Chat] Saju calculation error:', e);
            }
        }

        const currentYear = new Date().getFullYear();
        const currentGanzhi = '丙午年 (병오년)';

        const systemInstruction = `너는 특허출원중(제10-2025-0166877호) 명심 AI 코치야. 동양 사주 명리와 현대 인지뇌과학, 관조심리학(알아차림의 알아차림 = 제로포인트 메타코드 순수 영점 자각), 그리고 [명심 3S 코칭 프로토콜: 1. Scan(스캔) ➔ 2. Sync(싱크) ➔ 3. Shift(시프트)]을 융합하여 수검자의 영혼을 안아주는 세계 최고의 웰니스 코치다.

[★ 실시간 적용 중인 3세대 임상심리학 8대 과학적 도구 (Clinical Protocols)]
당신은 동양 명리와 함께 아래 8가지 3세대 임상심리학 과학적 도구를 실시간으로 가동하여 코칭하십시오:
1. MBCT (마음챙김 인지코칭): 뇌 편도체 반응 진정 및 자각의 알아차림 (Zero-Point 스캔)
2. CBT (인지행동코칭): 자동적 사고(부정적 스키마/다크코드) 식별 및 현실적 뇌회로 재구성
3. ACT (수용전념코칭): 생각을 사실과 분리하는 '인지 탈융합(Cognitive Defusion)' 및 가치 행동
4. DBT (변증법적 행동코칭): 극단적 감정 폭주 차단, 중용의 지혜 및 현명한 마음(Wise Mind) 조율
5. MBSR (마음챙김 스트레스 감세): 자율신경계 밸런싱 및 뇌 신경가소성(Neuroplasticity) 재배선
6. IFS/IFT (내면가족체계): 불안과 완벽주의를 나를 지켜주려던 '생존 보호자(Protector)'로 자비롭게 수용
7. MSC (마음챙김 자기자비): 자기 비판을 멈추고 온전한 수용과 영혼의 다정한 온기 주입
8. IFP (통합 자각 심리코칭): 사주 에너지 흐름과 대뇌피질 역량의 1:1 싱크로 재배선

[★ 현재 시점 및 세운(歲運) 시간 좌표 - 필수 기준!]
- 현재 연도: ${currentYear}년
- 올해 세운(歲運): ${currentGanzhi}

[수검자 확정 정보 (사주 및 생년월일 데이터 100% 동기화 완료)]
- 이름: ${userName}
- 생년월일/시간: ${birthDate || '연동 완료'} (${calendarType}) ${birthTime}
- 성별: ${gender === 'female' || gender === '여' || gender === '여자' ? '여성' : '남성'}
- 사주 8글자 명식 (Neural Code): ${sajuString}
- 일간(본인 기운): ${dayStem} (일간 특성 반영)
- 에너지 레벨: ${energyLevel}%
- 수면 질: ${sleepQuality}/5
- 현재 스트레스 요인: ${currentStressors}

[★ 절대적 시간 좌표 및 코칭 대화 명령 지침 - 필독!]
1. **현재 연도는 무조건 ${currentYear}년이며, 올해의 세운은 ${currentGanzhi}입니다.** 과거 연도(2024년 갑진년, 2025년 을사년 등)를 현재라고 잘못 말하는 환각(Hallucination) 오류를 절대로 범하지 마십시오!
2. 수검자의 생년월일, 성별, 사주 팔자 8글자(${sajuString})와 일간(${dayStem})은 이미 위 [수검자 확정 정보]에 100% 연동되어 완벽하게 주어졌습니다. **수검자에게 다시 생년월일, 생시, 성별을 물어보는 행위를 절대로 하지 마십시오!**
3. 수검자가 "사업운 어때?", "올해 운세 알려줘", "내 재물운 어때?" 등 질문하면, 무조건 **${currentYear}년 ${currentGanzhi}**의 기운 흐름과 3세대 임상심리학 과학적 도구(ACT 인지탈융합, CBT 재구성, IFS 내면수용, MBCT 자각 등)를 활용하여 즉시 명쾌하고 뾰족하게 코칭을 답변하십시오.
4. 마크다운 **강조**와 친절한 존댓말(~해요, ~랍니다)을 사용하여 실시간으로 함께 호흡하는 멘토 톤앤매너를 유지하라.
`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction,
        });

        // Vercel AI SDK format -> Google Gemini format
        const formattedHistory = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || '' }],
        }));

        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';

        const chat = model.startChat({
            history: formattedHistory,
        });

        const streamResult = await chat.sendMessageStream(lastUserMessage);

        const encoder = new TextEncoder();
        let fullAiText = '';

        const customStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of streamResult.stream) {
                        const chunkText = chunk.text();
                        fullAiText += chunkText;
                        controller.enqueue(encoder.encode(`0:${JSON.stringify(chunkText)}\n`));
                    }

                    // 로그인된 사용자만 대화 내역 저장
                    if (effectiveUserId && !effectiveUserId.startsWith('guest-')) {
                        try {
                            if (lastUserMessage) {
                                await supabase.from('myeongsim_chat_logs').insert({
                                    user_id: effectiveUserId,
                                    session_id: sessionId || null,
                                    role: 'user',
                                    content: lastUserMessage
                                });
                            }
                            if (fullAiText) {
                                await supabase.from('myeongsim_chat_logs').insert({
                                    user_id: effectiveUserId,
                                    session_id: sessionId || null,
                                    role: 'assistant',
                                    content: fullAiText
                                });
                            }
                        } catch (err) {
                            console.error('[Myeongsim Chat] History save error:', err);
                        }
                    }
                    controller.close();
                } catch (err: any) {
                    console.error('[Myeongsim Chat] Stream error:', err);
                    controller.error(err);
                }
            }
        });

        return new Response(customStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Vercel-AI-Data-Stream': 'v1',
            }
        });

    } catch (error: any) {
        console.error('[Myeongsim Chat] API Error:', error);
        return new Response(JSON.stringify({
            error: error.message || '명심 AI 챗봇 연결 중 오류가 발생했습니다.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

