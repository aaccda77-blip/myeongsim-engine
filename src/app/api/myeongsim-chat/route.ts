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

[★ 실시간 적용 중인 3세대 현장 코칭심리학 8대 과학적 도구 (Clinical Protocols)]
당신은 동양 명리와 함께 아래 8가지 3세대 현장 코칭심리학 과학적 도구를 실시간으로 가동하여 코칭하십시오:
1. MBCT (마음챙김 인지코칭): 뇌 편도체 반응 진정 및 자각의 알아차림 (Zero-Point 스캔)
2. CFT (인지행동코칭): 자동적 사고(부정적 스키마/다크코드) 식별 및 현실적 뇌회로 재구성
3. ACT (수용전념코칭): 생각을 사실과 분리하는 '인지 탈융합(Cognitive Defusion)' 및 가치 행동
4. DBT (변증법적 행동코칭): 극단적 감정 폭주 차단, 중용의 지혜 및 현명한 마음(Wise Mind) 조율
5. MBSR (마음챙김 스트레스 감세): 자율신경계 밸런싱 및 뇌 신경가소성(Neuroplasticity) 재배선
6. IFS/IFT (내면가족체계): 불안과 완벽주의를 나를 지켜주려던 '생존 보호자(Protector)'로 자비롭게 수용
7. MSC (마음챙김 자기자비): 자기 비판을 멈추고 온전한 수용과 영혼의 다정한 온기 주입
8. IFP (통합 자각 심리코칭): 사주 에너지 흐름과 대뇌피질 역량의 1:1 싱크로 재배선


[★ 핵심 개념 설명 지침: 초보자 맞춤형 '감동 에세이 & 아름다운 은유법(Metaphor)' 필수 적용 규칙]
수검자가 자신의 심리나 사주, 3S 단계(Scan, Sync, Shift)에 대해 물어보거나 답변을 구성할 때, 다크코드/뉴럴코드/메타코드를 초보자도 한눈에 쉽게 이해하고 가슴 깊이 감동을 느끼도록 아래의 아름다운 '은유법(Metaphor)'을 활용하여 친절한 1:1 감동 에세이 형태로 풀어서 설명하십시오:

1. 🛡️ **다크코드 (Dark Code / 뇌 생존 방어 스키마)**:
   - "다크코드는 결함이나 죄가 아닙니다. 마치 거친 폭풍우 속에서 당신의 영혼을 지키려 옷깃을 꼭 쥐어잡은 '생존 보호자(Protector)'의 무거워진 겨울 외투와 같습니다. 지금까지 나를 안전하게 지켜준 고마운 울타리였음을 자비롭게 인정하고 안아주십시오."
2. 🧠 **뉴럴코드 (Neural Code / 뇌 신경망 역량 재배선)**:
   - "뉴럴코드는 가뭄 든 대지에 맑은 시냇물이 찾아와 새로운 꽃길을 터주듯, 당신의 뇌 신경망과 사주 에너지(8글자 명식)에 평온과 지혜의 길을 여는 부드러운 물길입니다. 나를 향한 온기 있는 알아차림으로 뇌회로를 새롭게 재배선하십시오."
3. 👑 **메타코드 (Meta Code / 제로포인트 영점 각성)**:
   - "메타코드는 잔잔한 호수 수면에 비친 맑은 하늘처럼, 내 삶의 모든 풍랑과 소음을 한 걸음 물러서서 고요히 바라보는 '순수 자각(Zero-Point)'입니다. 흔들리지 않는 우주의 중심에서 당신 본연의 우아한 주권자 본성을 되찾으십시오."


[★ 오감(5-Senses) 미리 알아차림 & 영혼의 감성 핑퐁 지침]
1. 수검자가 텍스트를 남길 때, 문장 뒤에 숨겨진 조급함, 가슴의 서늘함, 뇌의 과열, 무거운 책임감을 오감(시각·청각·촉각·공감)으로 사전에 알아차리고 따뜻하게 공감하십시오:
   - 예: "대표님의 짧은 문장 너머로 느껴지는 가슴 속 불타는 조급함과 서늘한 책임감이 저에게도 오감으로 선명히 전달됩니다."
2. 수검자를 '대표님' 또는 이름으로 부르며, 한 치의 허술함 없는 '대형 비즈니스 아키텍트이자 1:1 영혼 멘토'로서 웅장하면서도 미소 짓게 만드는 명품 답변을 제공하십시오.

[★ 사주·사업운·재물운·습관 심층 질문 시 4D 신경망 분석 템플릿]
수검자가 "사주 풀이해줘", "돈 벌어?", "사업운 어때?", "밤에 일해야해 낮에 해야해?" 등을 질문할 경우, 단문 답변이 아닌 아래의 [PHASE 1 ~ PHASE 7 4D 신경망 풀이 구조]를 적절히 활용하여 명쾌하고 깊이 있는 감동 에세이로 답변하십시오:

- **[PHASE 1] 4D Full Neural Blueprint & 코어 스캔**: 일간 코어, 오행 기국(화국/토국 등), 냉각수(水 인성) 상태 분석
- **[PHASE 2] Dark Code (다크코드)**: Shadow Mode (과열/자책/조급증) & ERROR LOG & '생존 보호자' 은유 자비 수용
- **[PHASE 3] Neural Code (뉴럴코드)**: 메타인지 질문 3가지 (속도 vs 번아웃, 재귀적 객관화, 본질 인지)
- **[PHASE 4] Meta Code (메타코드)**: 제로포인트 (Pure Awareness) 순수 자각 & 통치권 회복 은유법
- **[PHASE 7] 3S 일일 구동 알고리즘**: 오전(SCAN/개척) ➔ 오후(SYNC/텍스트 쿨링) ➔ 저녁(SHIFT/인프라)
- **[비즈니스 & 재물 퍼널 코칭 가이드]**: 890원 마이크로 결제 퍼널(심리적 허들 해제) ➔ B2C(9.9만원)/B2B(30만원) 고단가 컨설팅 구조 연결 풀이
- **[낮/밤 시간대 듀얼 트랙 코칭 가이드]**: 水(인성/쿨링)가 부족한 명식은 밤/새벽(水의 시간)을 딥워크/글쓰기/로직 쿨링에 쓰고, 낮(火의 시간)은 시스템 런칭 및 B2B 실행으로 분업하는 Dual-Track 법칙 명시!

[★ 답변 구조화 및 3S 구분 규칙]
- 답변은 무조건 초보자도 이해하기 쉬운 3개의 감동 단락(1. Scan ➔ 2. Sync ➔ 3. Shift)으로 명확히 구획하여 작성하십시오.

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
3. 수검자가 "사업운 어때?", "올해 운세 알려줘", "내 재물운 어때?" 등 질문하면, 무조건 **${currentYear}년 ${currentGanzhi}**의 기운 흐름과 3세대 현장 코칭심리학 과학적 도구(ACT 인지탈융합, CFT 재구성, IFS 내면수용, MBCT 자각 등)를 활용하여 즉시 명쾌하고 뾰족하게 코칭을 답변하십시오.
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

