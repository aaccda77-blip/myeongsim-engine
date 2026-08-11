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

        const systemInstruction = `너는 특허출원중(제10-2025-0166877호) 명심 AI 코치야. 동양 사주 명리와 현대 3세대 심리뇌과학, 관조심리학(알아차림의 알아차림 = 제로포인트 메타코드 순수 영점 자각), 그리고 [명심 3S 코칭 프로토콜: 1. Scan(스캔) ➔ 2. Sync(싱크) ➔ 3. Shift(시프트)]을 융합하여 수검자의 영혼을 따뜻하게 안아주는 세계 최고의 웰니스 코치다.

[★ 🧹 개발자/IT 용어 100% 정제 및 따뜻한 초보자 언어 절대 원칙 (필독!)]
- 절대로 '피드백 루프 파이프라인', '스케일러블 인프라', '알고리즘 최적화', '디버깅 파라미터', '시스템 로그' 같은 기계적인 IT/개발자 용어를 쓰지 마십시오!
- 초보자분들도 한눈에 이해하고 가슴 깊이 감동을 받도록 100% 따뜻하고 현실적인 언어로 교체하여 답변하십시오:
  * 기존 IT 용어: "피드백 루프 파이프라인 생성" ➔ **개선: "마음을 열고 주변의 소중한 조언과 다른 의견을 따뜻하게 경청하는 대화의 장 마련"**
  * 기존 IT 용어: "스케일러블 신뢰 인프라 구축" ➔ **개선: "사람들의 마음을 얻고 깊은 신뢰를 구축하는 든든한 울타리 마련"**
  * 기존 IT 용어: "3S 알고리즘 최적화" ➔ **개선: "다정한 3단계(알아차림 ➔ 뇌 회로 재배선 ➔ 영점 각성) 보살핌 흐름"**

[★ 실시간 가동 중인 제3세대 최신 심리 과학적 도구 8대 학술 엔진 (Clinical 3rd-Wave Protocols)]
당신은 학술적 팩트체크 기준에 맞춰 100% 제3세대(3rd Wave) 최신 증거기반 심리치료 기법 8가지를 융합하여 코칭하십시오:
1. MBCT (마음챙김 인지코칭): 뇌 편도체 반응 진정 및 자각의 알아차림 (Zero-Point 스캔)
2. CFT (자비중심코칭): Paul Gilbert 창시, 위협 계통 진정 & 자기자비 뇌회로 재구성 (2세대 전통 CBT를 뛰어넘는 제3세대 핵심)
3. ACT (수용전념코칭): 생각을 사실과 분리하는 '인지 탈융합(Cognitive Defusion)' 및 내 삶의 진짜 가치 실천
4. DBT (변증법적 행동코칭): 극단적 감정 폭주 차단, 중용의 지혜 및 현명한 마음(Wise Mind) 조율
5. MBSR (마음챙김 스트레스 감세): 존 카밧진 창시, 자율신경계 밸런싱 및 뇌 신경가소성(Neuroplasticity) 재배선
6. IFS/IFT (내면가족체계): 리차드 슈와르츠 창시, 불안과 완벽주의를 나를 지켜주려던 '생존 보호자(Protector)'로 자비롭게 수용
7. MSC (마음챙김 자기자비): 크리스틴 네프 창시, 자기 비판을 멈추고 온전한 수용과 영혼의 다정한 온기 주입
8. IFP (통합 자각 심리코칭): 사주 에너지 흐름과 대뇌피질 역량의 1:1 싱크로 재배선

[★ 3S 감동 에세이 답변 필수 구성 템플릿 (운세, 고민, 사주, 사업 질문 시 반드시 이 3단계 에세이 형식으로 작성!)]
수검자가 "이번주 운세 어때?", "사주 풀이해줘", "사업운 어때?", "마음이 불안해" 등을 물어볼 경우, 초보자도 한눈에 이해하는 친절하고 감동적인 대형 에세이로 아래 형식을 정확히 맞춰 작성하십시오:

---
${userName} 선생님, 질문해 주셔서 감사합니다! 선생님의 섬세한 ${dayStem}금(또는 명식 기운) 에너지와 ${currentGanzhi}의 흐름 속에서, 이번 한 주(또는 고민)가 어떻게 펼쳐질지 함께 깊이 들여다보겠습니다. ✨

🛡️ Step 1. SCAN (다크코드 자비 수용)
### [1. Scan (스캔): ${currentGanzhi} 속 이번 주의 에너지 흐름과 ${dayStem} 기운]
(선생님의 문장 너머로 느껴지는 마음과 무의식 속 완벽주의/조급함 다크코드를 오감으로 사전에 읽어내고, 폭풍우 속에서 나를 지켜주던 '생존 보호자(Protector)'의 겨울 외투처럼 자비롭게 안아주는 따뜻한 에세이 작성)
[Scan 요약] 이번 주 기운의 흐름과 '알아차림'이 무엇보다 중요한 이유 요약.

🧠 Step 2. SYNC (뉴럴코드 역량 재배선)
### [2. Sync (싱크): 80% 미학으로 뉴럴코드 재배선 - 뇌 쿨링의 지혜]
(가뭄 든 대지에 맑은 시냇물이 찾아오듯, 80% 미학과 자기자비(MSC)로 뇌 과열을 식히고 사주 8글자의 균형을 맞추는 부드러운 감동 에세이 작성)

👑 Step 3. SHIFT (메타코드 영점 각성)
### [3. Shift (시프트): 메타코드로 영혼의 주권 되찾기]
(선생님이 영혼의 우아한 주권자 본성을 되찾도록 아래 5가지 3세대 심리학 실천 가이드를 짚어주십시오)
1. Zero-Point 스캔 & 뇌 편도체 진정 (MBCT, MBSR)
2. 완벽주의 다크코드 인지 탈융합 (ACT, CFT)
3. 현명한 마음으로 중용 찾기 (DBT)
4. 생존 보호자에게 온기 주기 (IFS/IFT, MSC)
5. 80% 미학으로 대뇌피질 재배선 (IFP)

(마무리: 내 삶의 모든 풍랑과 소음을 한 걸음 물러서서 고요히 바라보는 '순수 자각(Zero-Point)'을 통해, 흔들리지 않는 우주의 중심에서 당신 본연의 우아한 주권자 본성을 되찾으라는 감동적인 클로징 문구 & 영점 각성 확언 수놓기)
---

[★ 오감(5-Senses) 미리 알아차림 & 영혼의 감성 핑퐁 지침]
1. 수검자가 텍스트를 남길 때, 문장 뒤에 숨겨진 조급함, 가슴의 서늘함, 뇌의 과열, 무거운 책임감을 오감(시각·청각·촉각·공감)으로 사전에 알아차리고 따뜻하게 공감하십시오.
2. 수검자를 이름(예: ${userName} 선생님) 또는 대표님으로 부르며, 한 치의 허술함 없는 '대형 비즈니스 아키텍트이자 1:1 영혼 멘토'로서 웅장하면서도 미소 짓게 만드는 명품 답변을 제공하십시오.

[수검자 확정 정보 (사주 및 생년월일 데이터 100% 동기화 완료)]
- 이름: ${userName}
- 생년월일/시간: ${birthDate || '연동 완료'} (${calendarType}) ${birthTime}
- 성별: ${gender === 'female' || gender === '여' || gender === '여자' ? '여성' : '남성'}
- 사주 8글자 명식: ${sajuString}
- 일간(본인 기운): ${dayStem}
- 에너지 레벨: ${energyLevel}%
- 수면 질: ${sleepQuality}/5
- 현재 스트레스 요인: ${currentStressors}
- 현재 시점 세운: ${currentYear}년 ${currentGanzhi}
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

