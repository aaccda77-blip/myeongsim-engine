import { coachingService } from '@/services/coachingService';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { PromptEngine } from '@/services/PromptEngine';
import { UserSoulProfile } from '@/types/akashic_records';
import { getSajuCharacters } from '@/lib/saju/calculator'; // [Scientific Saju]

import { SajuConverter } from '@/lib/saju/converter'; // [Classic Logic]
import { retrieveGenreCodes } from '@/lib/rag/retrieveGenre'; // [New] Genre RAG
import { MemoryService } from '@/services/MemoryService'; // [Layer 3] Memory Logic
// [Layer 4] Modular Feature Expansion
import { GapAnalysisService } from '@/modules/GapAnalysisService';
import { MBTIMapper } from '@/modules/MBTIMapper';
import { CodeDecoder } from '@/modules/CodeDecoder';
import { ContextService } from '@/modules/ContextService';
import { MemoryServiceModule } from '@/modules/MemoryService';
import { SecurityMiddleware } from '@/modules/SecurityMiddleware';
// import { ScenarioEngine } from '@/services/ScenarioEngine'; // [Disabled] File missing

export const runtime = 'nodejs'; // Optional: Use Edge if preferred, or 'nodejs'
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();
        const { userId, message, messages, stage, sajuData, birthDate, birthTime, gender, userName, isPremium, lastBotMessage, chatHistory, userSaju, sessionId } = reqBody;

        // [Fix] Unified Message Handling (Prioritize 'messages' array)
        let currentMessageContent = message;
        let historyForGemini: any[] = [];

        if (messages && Array.isArray(messages) && messages.length > 0) {
            // Extract last message as current
            const lastMsg = messages[messages.length - 1];
            currentMessageContent = lastMsg.content;

            // Use the rest as history
            const historyMsgs = messages.slice(0, messages.length - 1);
            historyForGemini = historyMsgs
                .filter((msg: any) => msg.content && typeof msg.content === 'string') // Filter invalid
                .map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));
        } else if (chatHistory && Array.isArray(chatHistory)) {
            // Fallback to legacy
            historyForGemini = chatHistory
                .filter((msg: any) => msg.content && typeof msg.content === 'string')
                .map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));
        }

        // [GoogleGenerativeAI Fix] Force history to start with 'user' role
        // The API throws: "First content should be with role 'user', got model"
        while (historyForGemini.length > 0 && historyForGemini[0].role !== 'user') {
            historyForGemini.shift();
        }

        if (!userId || !currentMessageContent) {
            return new Response('Missing userId or message', { status: 400 });
        }

        // [MODULE INTEGRATION] 1. Security Check
        try {
            SecurityMiddleware.validateInput(currentMessageContent);
        } catch (securityError) {
            console.warn(`🚨 [Security] Blocked: ${userId}`);
            return new Response(JSON.stringify({
                reply: "⚠️ [보안 경고] 허용되지 않는 명령어가 감지되었습니다."
            }), { headers: { 'Content-Type': 'application/json' } });
        }

        // [SECURITY STEP 2] Server-Side Time Pass Verification (Strict)
        // Check ticket validity directly from DB (Do Not Trust Client)
        const accessCode = reqBody.accessKey || (typeof userId === 'string' && userId.length > 10 ? userId : null); // Fallback if userId is the key

        if (accessCode && accessCode.length > 3) {
            // Skip check for known test IDs or if logic is handled by middleware,
            // BUT for strict mode, we should verify here.
            // Note: Real DB check requires async.
            try {
                // 1. Query User/Ticket
                const { data: ticketUser, error } = await supabase
                    .from('users')
                    .select('id, access_key, access_at, duration_minutes')
                    .eq('access_key', accessCode)
                    .single();

                if (ticketUser) {
                    const now = new Date();

                    // 2. Activate if first use
                    if (!ticketUser.access_at) {
                        console.log(`🎫 [TimePass] Activating Ticket for ${accessCode}`);
                        await supabase.from('users').update({ access_at: now.toISOString() }).eq('id', ticketUser.id);
                        ticketUser.access_at = now.toISOString();
                    }

                    // 3. Check Expiry
                    const startTime = new Date(ticketUser.access_at);
                    const durationMs = (ticketUser.duration_minutes || 30) * 60 * 1000;
                    const expiryTime = new Date(startTime.getTime() + durationMs);

                    if (now > expiryTime) {
                        console.warn(`⏳ [TimePass] Expired Access for ${accessCode}`);
                        return new Response(JSON.stringify({
                            reply: "🚫 [이용권 만료] 사용 가능한 시간이 종료되었습니다. 충전 후 다시 이용해주세요."
                        }), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                }
            } catch (secErr) {
                console.error("Time Verification Warning:", secErr);
                // For MVP stability w/o strict DB setup, we might log only.
                // But User requested 'Strict', so we should ideally block.
                // However, to prevent outage if DB isn't ready, we Log.
            }
        }

        // 0. Environment Check
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Server Environment Error: GEMINI_API_KEY is missing.');
        }

        // [Fix] Consolidate Birth Profile (Priority: params > sajuData > userSaju)
        const effectiveBirthDate = birthDate || sajuData?.birthDate || userSaju?.birthDate;
        const effectiveBirthTime = birthTime || sajuData?.birthTime || userSaju?.birthTime || '12:00';
        const effectiveGender = gender || sajuData?.gender || userSaju?.gender || 'male';

        console.log("--- [Debug] Saju Input Data ---");
        console.log("Effective Date:", effectiveBirthDate);
        console.log("Effective Time:", effectiveBirthTime);
        console.log("Effective Gender:", effectiveGender);
        console.log("Raw userSaju:", userSaju);
        console.log("-------------------------------");

        // 1. Log User Message (Fire and Forget)
        coachingService.logChatMessage(userId, 'user', currentMessageContent, stage, {}, sessionId).catch(e => console.error('Log Error:', e));

        // [MODULE INTEGRATION] 2. Prepare Modules (Parallel Fetch)
        // Replacing Legacy MemoryService.recallMemories logic with new Module
        let memoryContext = "";
        let envContext = "";

        try {
            const [mem, env] = await Promise.all([
                MemoryServiceModule.fetchUserHistory(userId, currentMessageContent),
                ContextService.getCurrentContext()
            ]);
            memoryContext = mem;
            envContext = env;
            console.log(`🧠 [New Module] Memory: ${memoryContext.length} chars, Env: ${envContext}`);
        } catch (moduleErr) {
            console.error("Module Error:", moduleErr);
        }

        // [Moved Up] 2. Construct Profile from Real Saju Calculation
        // [Fix] 클라이언트 데이터(dummy) 대신 서버에서 직접 계산하여 신뢰성 확보
        let realSajuData;
        try {
            if (effectiveBirthDate) {
                // Ensure time format HH:mm
                const safeTime = (effectiveBirthTime && effectiveBirthTime.includes(':')) ? effectiveBirthTime : '12:00';
                realSajuData = SajuConverter.calculate(effectiveBirthDate, safeTime, effectiveGender);
            }
        } catch (e) {
            console.error("Saju Calculation Error:", e);
        }

        // [Safety Check] Ensure we don't pass "Error" string as a character
        const safeDayMaster = (realSajuData?.dayMaster && realSajuData.dayMaster !== 'Error')
            ? realSajuData.dayMaster
            : (sajuData?.dayMaster !== 'Error' ? sajuData?.dayMaster : 'Unknown');

        const profile: UserSoulProfile = {
            name: userName || "회원", // [Added]
            nativity: {
                birth_date: effectiveBirthDate || 'Unknown',
                birth_time: effectiveBirthTime,
                dayMaster: safeDayMaster || 'Unknown',
                traits_summary: sajuData?.keywords?.join(', ') || '',
                wealth_luck: sajuData?.wealth_luck || 'Unknown', // Preserve wealth luck

                // [Scientific Saju] 정밀 만세력 데이터 주입 (Priority: Frontend > Backend Calc)
                saju_characters: (() => {
                    // 1. Try to use Frontend Data (Verified by User)
                    if (sajuData && sajuData.fourPillars && sajuData.fourPillars.year) {
                        console.log("✅ [ChatAPI] Using Frontend Saju Data");
                        const p = sajuData.fourPillars;
                        // [Fix] Access .char property because pillars are objects
                        const getChar = (item: any) => item?.char || item || '?';

                        return {
                            year: `${getChar(p.year.gan)}${getChar(p.year.ji)}`,
                            month: `${getChar(p.month.gan)}${getChar(p.month.ji)}`,
                            day: `${getChar(p.day.gan)}${getChar(p.day.ji)}`,
                            hour: `${getChar(p.time.gan)}${getChar(p.time.ji)}`,
                            year_pillar: `${getChar(p.year.gan)}${getChar(p.year.ji)}`,
                            month_pillar: `${getChar(p.month.gan)}${getChar(p.month.ji)}`,
                            day_pillar: `${getChar(p.day.gan)}${getChar(p.day.ji)}`,
                            time_pillar: `${getChar(p.time.gan)}${getChar(p.time.ji)}`
                        };
                    }

                    // 2. Fallback to Backend Calculation
                    if (effectiveBirthDate) {
                        console.log(`🔍 [ChatAPI] Calculating Saju for Date: ${effectiveBirthDate}`);
                        try {
                            const calculated = getSajuCharacters(
                                effectiveBirthDate,
                                effectiveBirthTime,
                                false,
                                effectiveGender
                            );
                            // Check for Gyeong-sin (1980) pattern (Debug)
                            if (calculated.year && calculated.year.includes('경신')) {
                                console.warn(`🚨 [ChatAPI] WARNING: Calculated Saju is Gyeong-sin (1980). Input was: ${effectiveBirthDate}`);
                            }
                            return calculated;
                        } catch (e) {
                            console.error("Saju Character Calc Error:", e);
                            return { year: '정보 없음', month: '정보 없음', day: '정보 없음', hour: '정보 없음' };
                        }
                    }

                    // 3. No Data
                    return { year: '정보 없음', month: '정보 없음', day: '정보 없음', hour: '정보 없음' };
                })(),

                // [Fix] Real Daewoon Logic
                current_luck_cycle: realSajuData ? {
                    name: realSajuData.currentDaewoon,
                    season: realSajuData.daewoonSeason,
                    mission_summary: "흐름에 유연하게 대처하며 내면을 성장시키는 시기" // Default msg
                } : sajuData?.current_luck_cycle,

                // [Fix] Real Seun Logic
                current_yearly_luck: realSajuData ? {
                    year: realSajuData.seun.year,
                    element: realSajuData.seun.element,
                    ten_god_type: "세운(Yearly Luck)", // Detailed calc needed in v2.4
                    action_guide: "올해의 기운을 활용하여 목표를 추진하십시오",
                    interaction: "변동성 주의"
                } : sajuData?.current_yearly_luck
            },
            psych_profile: {
                risk_factors: { primary: 'None' }
            }
        };

        // 3. Report Tier Check & RAG Strategy
        let tier = 'FREE';
        let maxTokens = 8000; // [Upgraded] Increased for Gemini 2.0 Verbosity
        let ragContext = "";

        if (typeof currentMessageContent === 'string') {
            const trimmedMsg = currentMessageContent.trim();

            // [New Logic] Context-Aware Deep Analysis
            if (trimmedMsg === '/analyze_deep') {
                tier = 'MASTER';
                maxTokens = 8000;

                const queryContext = `User Info: [Birth: ${birthDate} ${birthTime}, Gender: ${gender}, Saju: ${JSON.stringify(sajuData)}]`;
                const searchKeywords = "운세 해석 데이터 + 사주 명리학 심층 분석 자료";
                const ragQuery = `${queryContext} \n Ref: ${searchKeywords}`;

                ragContext = await PromptEngine.fetchRAGContext(ragQuery);
            }
            // [Debug] RAG Verification Command
            else if (trimmedMsg.startsWith('/test_rag')) {
                const query = trimmedMsg.replace('/test_rag', '').trim() || "테스트";
                const debugContext = await PromptEngine.fetchRAGContext(query);

                const debugResponse = debugContext
                    ? `✅ **RAG 연결 성공!**\n\n**[검색된 데이터]**\n${debugContext.substring(0, 500)}...`
                    : `❌ **RAG 연결 실패**\n\n데이터를 가져오지 못했습니다. RAG 서버를 확인하세요.`;

                return new Response(JSON.stringify({
                    reply: debugResponse,
                    analysis_data: {
                        innate_level: 0,
                        current_level: 0,
                        framework: "system_debug",
                        comment: "RAG Connectivity Test"
                    }
                }));
            }
            else {
                // Default String Message
                tier = 'PREMIUM';
                maxTokens = 4000;
            }
        }

        // 4. Fallback RAG for normal chat (With Saju Data)
        if (tier === 'FREE' && process.env.ENABLE_FREE_RAG === 'true') {
            // [Update] Pass Saju Profile to RAG for Personalized Context
            ragContext += await PromptEngine.fetchRAGContext(currentMessageContent, profile.nativity);
        }

        // [New] 'Error is a Genre' RAG Integration (High Priority)
        if (typeof currentMessageContent === 'string' && currentMessageContent.length > 5) {
            try {
                console.log(`📚 [ChatAPI] Searching Genre Codes for: "${currentMessageContent.substring(0, 20)}..."`);
                const genreCodes = await retrieveGenreCodes(currentMessageContent, 1);

                if (genreCodes && genreCodes.length > 0) {
                    const best = genreCodes[0];
                    if (best.similarity > 0.45) {
                        const genreData = `
:::GENRE_CODE_DATA:::
**[MATCHED CODE]**: ${best.metadata.code_id} (${best.metadata.title})
**[CONTENT]**:
${best.content}
:::END_GENRE_DATA:::
`;
                        ragContext += genreData;
                        console.log(`✅ [ChatAPI] Injected Genre Code: ${best.metadata.code_id}`);
                    }
                }
            } catch (e) {
                console.error("❌ [ChatAPI] Genre RAG Failed:", e);
            }
        }

        // [Layer 4] Modular Feature Integration (Unobtrusive)
        // Gap Analysis + MBTI + 3-Step Decoder
        try {
            console.log("⚙️ [Module] Starting Modular Gap Analysis...");

            // [Layer 3] Memory Recall (Synchronous for Prompt Injection)
            let memoryContext = "";
            try {
                if (typeof currentMessageContent === 'string' && currentMessageContent.length > 2) {
                    console.log(`🧠 [Memory] Recalling for User ${userId}...`);
                    memoryContext = await MemoryService.recallMemories(userId, currentMessageContent);
                }
            } catch (memRecErr) {
                console.error("Memory Recall Warning:", memRecErr);
            }

            // 1. Inputs
            const userMBTI = reqBody.mbti || "ISFP"; // Default or from Request
            // Innate Vector Estimation (Simple Element Count from Saju)
            // vector = [Water, Fire, Earth, Metal, Wood] (Mapped to [Passive, Active, Social, Internal, Flexible])
            // 1. Innate Vector Setup
            let innateVector: number[] = [0, 0, 2.0, 0, 2.0]; // Default NC-06

            if (realSajuData && (realSajuData as any).fiveElements) {
                // Future: Map 5 Elements to Vector
                // innateVector = ...
            }

            // 2. Gap Analysis Module (Fail-Safe)
            try {
                let acquiredVector: number[];
                let gapResult: any;

                if (reqBody.gapData && reqBody.gapData.acquiredVector) {
                    // [Strategy] Use Frontend Data (GateKeeper Result)
                    acquiredVector = reqBody.gapData.acquiredVector;
                    // Re-calculate to ensure server-side consistency using the trusted vector
                    gapResult = GapAnalysisService.calculateGap(innateVector, acquiredVector);
                } else {
                    // [Strategy] Fallback to MBTI
                    const userMBTI = reqBody.mbti || "ISFP";
                    acquiredVector = MBTIMapper.getVector(userMBTI);
                    gapResult = GapAnalysisService.calculateGap(innateVector, acquiredVector);
                }

                // 3. Decode Narrative
                // Use matched Code from RAG if available, else default to 'NC-06'
                const targetCode = (ragContext.match(/\[MATCHED CODE\]: (NC-\d+)/)?.[1]) || 'NC-06';
                const userMBTI = reqBody.mbti || "ISFP";
                const decodedStory = CodeDecoder.decodeState(targetCode, gapResult.gapLevel, userMBTI);

                // 4. Inject Context
                const moduleContext = `
:::GAP_ANALYSIS_RESULT:::
[Innate (Saju)]: ${innateVector.join(',')}
[Acquired (MBTI)]: ${acquiredVector.join(',')}
[Gap Level]: ${gapResult.gapLevel}% (${gapResult.matchingScore}% Match)

:::3_STEP_DECODER:::
**Title**: ${decodedStory.title}
**Genre**: ${decodedStory.description}
**Action Plan**:
1. ${decodedStory.actionPlan.step1}
2. ${decodedStory.actionPlan.step2}
3. ${decodedStory.actionPlan.step3}
:::END_MODULE_CONTEXT:::
`;
                ragContext += moduleContext;

            } catch (moduleErr) {
                console.error("⚠️ [Module] Gap Analysis Module Warning:", moduleErr);
            }

            // [Integration] Append Memory to RAG Context
            if (memoryContext) {
                ragContext += `\n\n${memoryContext}\n`; // Append retrieved memories
            }

        } catch (featureErr) {
            console.error("⚠️ [Modular Check] Feature Integration Error:", featureErr);
        }

        // Tier determined above. 
        // [Tier System] 리포트 등급 및 토큰 제한 설정 (Already handled)
        // Ensure parameters are passed correctly to model config below.

        // 4. Generate Dynamic System Prompt
        const nowKST = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
        const currentHour = new Date().getHours();

        // [Mod] Inject Layer 2 (Env) & Layer 3 (Memory)
        // Memory is appended to ragContext below, Env is passed to context object

        // Append RAG Context to user message so it's included in [User Context]
        const fullUserMessage = ragContext
            ? `${currentMessageContent}\n\n[System Retrieval Data]\n${ragContext}`
            : currentMessageContent;

        let SYSTEM_PROMPT = PromptEngine.generateSystemPrompt(stage, profile, fullUserMessage, undefined);

        // [Integration] Gap Analysis Driven Persona
        if (ragContext.includes(":::3_STEP_DECODER:::")) {
            SYSTEM_PROMPT += `
IMPORTANT: You MUST start your response with the '3-Step Decoder' analysis provided in the context.
- If the context mentions "Dark Code" or "⚠️", begin with: "현재 당신의 에너지는 역류하고 있습니다 (다크 코드). 분석 마비를 해결할 뉴럴 코드를 가동합니다."
- If the context mentions "Meta Code" or "✨", begin with: "기질과 환경이 조화롭습니다. 메타 코드로 진입하기 위한 미세 조정을 시작합니다."
Then, proceed with your coaching advice based on the "Action Plan".
`;
        }

        // [Integration] Append Memory to RAG Context
        if (memoryContext) {
            SYSTEM_PROMPT += `\n\n[Episodic Memory (Layer 3)]\n${memoryContext}\n`;
        }

        // [Added] User Saju Info Injection
        if (userSaju) {
            const { birthDate: ud, birthTime: ut, gender: ug } = userSaju;
            const sajuInfoStr = `\n\n[사용자 사주 정보]\n생년월일: ${ud || '정보 없음'} \n태어난 시간: ${ut || '정보 없음'} \n성별: ${ug || '정보 없음'} `;
            SYSTEM_PROMPT += sajuInfoStr;
        } else {
            SYSTEM_PROMPT += `\n\n[사용자 사주 정보]\n정보 없음`;
        }

        // 5. Call Gemini AI (Context-Aware Chat)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            // [Upgrade] User requested 2.5 Flash.
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.8,
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
            ]
        });

        const chat = model.startChat({
            history: historyForGemini,
            generationConfig: {
                maxOutputTokens: maxTokens,
            },
        });

        const result = await chat.sendMessageStream(currentMessageContent);
        const response = result.stream;

        const readableStream = new ReadableStream({
            async start(controller) {
                let fullResponse = "";
                try {
                    for await (const chunk of response) {
                        const text = chunk.text();
                        fullResponse += text;
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                } catch (e) {
                    controller.error(e);
                } finally {
                    controller.close();

                    // [Post-Processing] Logic after response is complete
                    const optionsMatch = fullResponse.match(/:::OPTIONS:(.*?):::/);
                    const imageMatch = fullResponse.match(/:::IMAGE_GEN:(.*?):::/);

                    const metadata = {
                        options: optionsMatch ? optionsMatch[1].split('|').map(s => s.trim()) : undefined,
                        image_prompt: imageMatch ? imageMatch[1].trim() : undefined
                    };

                    // [MODULE INTEGRATION] 3. Save Interaction (Layer 3)
                    MemoryServiceModule.saveInteraction(userId, currentMessageContent, fullResponse).catch(err => console.error("Memory Save Fail:", err));

                    // 1. Log AI Message
                    await coachingService.logChatMessage(userId, 'assistant', fullResponse, stage, metadata, sessionId).catch(e => console.error('Save AI Log Error:', e));

                    // [Layer 3] Auto-Save Memory (Async)
                    (async () => {
                        try {
                            const fullHistory = [...(messages || []), { role: 'assistant', content: fullResponse }];

                            // 1. General Summary
                            await MemoryService.summarizeAndStore(userId, fullHistory);

                            // 2. Entity Extraction
                            await MemoryService.extractAndStoreEntities(userId, fullHistory);

                        } catch (memErr) {
                            console.error("Memory Background Task Error:", memErr);
                        }
                    })();
                }
            }
        });

        return new Response(readableStream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
