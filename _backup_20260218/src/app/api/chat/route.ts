import { coachingService } from '@/services/coachingService';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { PromptEngine } from '@/services/PromptEngine';
import { UserSoulProfile } from '@/types/akashic_records';
import { getSajuCharacters } from '@/lib/saju/calculator'; // [Scientific Saju]
import { NextRequest } from 'next/server'; // [NEW] For type compatibility

import { calculateSaju as calculateSajuServer, generateSajuPromptBlock } from '@/lib/saju/SajuEngine'; // [NEW] Unified Engine
import { retrieveGenreCodes } from '@/lib/rag/retrieveGenre'; // [New] Genre RAG
import { MemoryService } from '@/services/MemoryService'; // [Layer 3] Memory Logic
// [Layer 4] Modular Feature Expansion
import { GapAnalysisService } from '@/modules/GapAnalysisService';
import { TraitsMapper } from '@/modules/TraitsMapper'; // [Replaced] MBTI -> Traits
import { CodeDecoder } from '@/modules/CodeDecoder';
import { ContextService } from '@/modules/ContextService';
// MemoryServiceModule.saveInteraction(userId, currentMessageContent, fullResponse).catch(err => console.error("Memory Save Fail:", err));
import { SecurityMiddleware } from '@/modules/SecurityMiddleware';
import { SentimentTracker } from '@/modules/SentimentTracker'; // [Reconnected] Heartbeat Monitor
import { InterruptQuestionModule } from '@/modules/InterruptQuestionModule'; // [Reconnected] Core Probe
import { PsychologicalSafetyModule } from '@/modules/PsychologicalSafetyModule'; // [Expert] Clinical Safety Layer
import { NeuroscienceModule } from '@/modules/NeuroscienceModule'; // [Expert] Neuroscience Layer
import { analyzeFrequency, generateFrequencyPromptBlock, detectCrisisSignal } from '@/modules/FrequencyDetector'; // [NEW] Frequency Detection
import { SajuPerspectiveRotator } from '@/modules/SajuPerspectiveRotator'; // [NEW] Pillar Rotation
import { analyzeForZenMode, generateZenPromptBlock, generateZenResponse } from '@/modules/ZenProtocol'; // [NEW] Zen Intervention
import {
    analyzeTextForPersonality,
    selectProfilingQuestion,
    formatProfileSummary,
    getCoachingStyleRecommendation,
    createEmptyProfile,
    type PersonalityProfile
} from '@/modules/PersonalityProfiler'; // [NEW] Background Personality Profiling
import { SelfCoachingModule } from '@/modules/SelfCoachingModule';
import { QuantumLabModule } from '@/modules/QuantumLabModule'; // [NEW] // [NEW] Self-Coaching Engine
import { getCombinedSystemPrompt } from '@/modules/SystemPersona'; // [NEW] Ultimate System Persona
import { requireAuth } from '@/lib/auth'; // [NEW] Authentication Middleware
// import { ScenarioEngine } from '@/services/ScenarioEngine'; // [Disabled] File missing

export const runtime = 'nodejs'; // [Fix] Switch to Node.js to allow larger payloads (>1MB)
// export const runtime = 'edge'; // Edge has loose limits but strict payload limits
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60; // Allow 60s execution (Hobby Plan Limit)

/**
 * [Expiration Middleware] Check if user's membership is expired
 */
async function checkUserExpiration(userId: string): Promise<{ expired: boolean; tier: string | null }> {
    if (!userId || userId.includes('-0000-')) {
        return { expired: false, tier: 'FREE' }; // Guest/Demo users bypass
    }

    const { data, error } = await supabase
        .from('users')
        .select('membership_tier, expires_at')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return { expired: false, tier: 'FREE' };
    }

    // Check expiration
    if (data.expires_at) {
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        if (now > expiresAt) {
            return { expired: true, tier: data.membership_tier };
        }
    }

    return { expired: false, tier: data.membership_tier };
}

/**
 * [Simple Memory] Fetch recent chat history from chat_messages table
 * Uses chat_sessions to find user's conversations
 */
async function fetchRecentChatHistory(userId: string, limit: number = 10): Promise<string> {
    if (!userId || userId.includes('-0000-')) return '';

    try {
        // First get user's recent sessions
        const { data: sessions } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(3);

        if (!sessions || sessions.length === 0) {
            console.log('📭 [Memory] No previous sessions found');
            return '';
        }

        const sessionIds = sessions.map(s => s.id);

        // Get messages from user's recent sessions
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content, created_at')
            .in('session_id', sessionIds)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error || !data || data.length === 0) {
            console.log('📭 [Memory] No previous chat messages found');
            return '';
        }

        // Format as context for AI
        const historyText = data.reverse().map((msg: any) => {
            const date = new Date(msg.created_at).toLocaleDateString('ko-KR');
            return `[${date}] ${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content.slice(0, 200)}`;
        }).join('\n');

        console.log(`📚 [Memory] Loaded ${data.length} previous messages`);
        return `\n[이전 대화 기록 (최근 ${data.length}개)]\n${historyText}\n`;

    } catch (e) {
        console.error('Memory Fetch Error:', e);
        return '';
    }
}

/**
 * [Helper] Infer Growth Map Stage from conversation keywords
 * Returns 1-7 based on user's message patterns
 */
function inferCurrentStage(messages: any[], currentMessage: string): number {
    const fullText = (messages.map((m: any) => m.content).join(" ") + " " + currentMessage).toLowerCase();

    // Stage-specific keyword detection (ordered by priority)
    const stageKeywords = {
        7: ["관찰", "알아차림", "존재", "명상", "고요", "침묵", "비움", "우주", "에고", "깨달음", "무념", "공", "본성", "참나", "지켜보", "바라보", "인식", "분리", "일치", "하나"],
        6: ["기여", "영향력", "사회", "나누", "베풀", "봉사", "리더십", "팀"],
        5: ["습관", "루틴", "매일", "지속", "유지", "반복", "꾸준"],
        4: ["실천", "시작", "어떻게", "방법", "행동", "당장", "해볼"],
        3: ["힘들", "지쳤", "위로", "아파", "슬퍼", "우울", "괴로", "고통"],
        2: ["왜", "패턴", "일치", "간극", "차이", "불일치", "모순"],
        1: ["누구", "분석", "사주", "풀이", "발견", "인식", "데이터", "코드", "알기"]
    };

    // Check each stage from highest to lowest
    for (const [stage, keywords] of Object.entries(stageKeywords).sort((a, b) => Number(b[0]) - Number(a[0]))) {
        if (keywords.some(kw => fullText.includes(kw))) {
            return Number(stage);
        }
    }

    return 1; // Default: Diagnosis stage
}

export const POST = requireAuth(async (req: NextRequest, auth) => {
    try {
        const reqBody = await req.json();
        const { userId, message, messages, stage, sajuData, birthDate, birthTime, gender, userName, isPremium, lastBotMessage, chatHistory, userSaju, sessionId, clientDate: reqClientDate, language, calendarType } = reqBody; // [Fix] Extract calendarType
        const clientDate = reqClientDate ? new Date(reqClientDate) : new Date();

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

        // [MODULE INTEGRATION] 0. Self-Coaching Intent Interception
        if (typeof currentMessageContent === 'string' && currentMessageContent.includes('[INTENT:ms_')) {
            const intentRegex = /\[INTENT:(ms_[a-zA-Z0-9_]+)\]/;
            const match = currentMessageContent.match(intentRegex);

            if (match && match[1]) {
                const intent = match[1];
                console.log(`[Self-Coaching] Intercepted Intent: ${intent}`);

                let coachingResponse = null;

                // [NEW] 1. Route 'ms_quantum_' to QuantumLabModule
                if (intent.startsWith('ms_quantum_')) {
                    coachingResponse = QuantumLabModule.getQuantumResponse(intent, sajuData);
                }
                // 2. Route other 'ms_' to standard SelfCoachingModule
                else {
                    coachingResponse = SelfCoachingModule.getCoachingResponse(intent, sajuData);
                }

                if (coachingResponse) {
                    const responsePayload = {
                        reply: coachingResponse.message,
                        suggestions: coachingResponse.options
                    };

                    const streamContent = `${coachingResponse.message} :::DATA_SEPARATOR::: ${JSON.stringify(responsePayload)}`;

                    return new Response(streamContent, {
                        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                    });
                }
            }
        }

        // [GoogleGenerativeAI Fix] Force history to start with 'user' role
        // The API throws: "First content should be with role 'user', got model"
        while (historyForGemini.length > 0 && historyForGemini[0].role !== 'user') {
            historyForGemini.shift();
        }

        // [Fix] Consolidate Birth Profile (Moved up for Persona ID generation)
        const effectiveBirthDate = birthDate || sajuData?.birthDate || userSaju?.birthDate;
        const effectiveBirthTime = birthTime || sajuData?.birthTime || userSaju?.birthTime || '12:00';
        const effectiveGender = gender || sajuData?.gender || userSaju?.gender || 'male';
        // [Fix] Extract calendarType (Critical for Lunar birthdays)
        // [Fix] Extract calendarType (Critical for Lunar birthdays)
        // Prioritize root-level calendarType (from explicit payload) > sajuData > userSaju > default
        const rawCalendarType = calendarType || sajuData?.calendarType || userSaju?.calendarType || 'solar';
        const effectiveCalendarType = rawCalendarType.toLowerCase();

        // [Memory Architecture] Generate Persona ID
        // This ensures that memories are separated by the actual target (User vs Partner vs Child)
        const personaId = userId && effectiveBirthDate
            ? MemoryService.generatePersonaId(userId, userName || 'Unknown', `${effectiveBirthDate}-${effectiveBirthTime}`)
            : null;

        // [OPTIMIZATION] Parallel Execution of Independent Async Tasks
        const [
            expirationResult,
            envContext,
            recentChatHistory, // Renamed for clarity
            genreCodesResult,
            longTermMemoryContext // [NEW] Long-term Memory
        ] = await Promise.all([
            // 1. Check Expiration
            userId ? checkUserExpiration(userId) : Promise.resolve({ expired: false, tier: 'FREE' }),

            // 2. Get Environment Context
            ContextService.getCurrentContext(undefined, clientDate),

            // 3. Fetch Recent Chat History (Simple - from chat_history table)
            userId ? fetchRecentChatHistory(userId, 20) : Promise.resolve(""),

            // 4. Fetch Genre Codes (RAG)
            (typeof currentMessageContent === 'string' && currentMessageContent.length > 5)
                ? retrieveGenreCodes(currentMessageContent, 1).catch(err => {
                    console.error("Genre RAG Error:", err);
                    return [];
                })
                : Promise.resolve([]),

            // 5. [NEW] Fetch Long-term Memory (Vector Search) by Persona
            (userId && personaId && typeof currentMessageContent === 'string' && currentMessageContent.length > 2)
                ? MemoryService.recallMemories(userId, personaId, currentMessageContent).catch(err => {
                    console.error("Long-term Memory Error:", err);
                    return "";
                })
                : Promise.resolve("")
        ]);

        // [EXPIRATION CHECK]
        const { expired, tier: userMembershipTier } = expirationResult;
        if (expired) {
            return new Response(JSON.stringify({
                error: 'EXPIRED',
                message: '⏰ 이용권이 만료되었습니다. 새로운 이용권을 구매해주세요.',
                tier: userMembershipTier
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Assign results
        // Combine Short-term (Recent Chat) and Long-term (Vector) Memory
        const memoryContext = `${recentChatHistory}\n\n${longTermMemoryContext}`;
        const genreCodes = genreCodesResult;

        // [SECURITY STEP 0] Origin/Referer Verification (Same as before)
        const origin = req.headers.get('origin') || req.headers.get('referer');
        const allowedOrigins = [
            'https://myeongsim-report.vercel.app',
            'http://localhost:3000',
            // [Security Update] Allow all Vercel previews & production aliases
            'https://myeongsim-report'
        ];
        const isAllowed = !origin || allowedOrigins.some(domain => origin.startsWith(domain));

        if (origin && !isAllowed) {
            console.warn(`🚨 [Security] Blocked unauthorized origin: ${origin}`);
            return new Response(JSON.stringify({ reply: "⚠️ [보안 제한] 허용되지 않은 출처입니다." }), { status: 403 });
        }

        // [MODULE INTEGRATION] 1. Security Check & Logging
        try {
            SecurityMiddleware.validateInput(currentMessageContent);
            if (userId) await SecurityMiddleware.checkRateLimit(userId);

            // Fire-and-forget logging
            coachingService.logChatMessage(userId, 'user', currentMessageContent, stage, {}, sessionId).catch(e => console.error('Log Error:', e));

            // [NEW] Fire-and-forget Memory Consolidation (Save User Insights)
            if (userId && personaId && currentMessageContent.length > 10) {
                // We don't wait for this to finish
                MemoryService.storeMemory(userId, personaId, currentMessageContent, { type: 'user_input' }).catch(e => console.error('Memory Store Error:', e));
            }

        } catch (securityError: any) {
            return new Response(JSON.stringify({
                reply: `⚠️ [보안 제한] ${securityError.message || "허용되지 않는 요청입니다."}`
            }), { headers: { 'Content-Type': 'application/json' }, status: 429 });
        }

        // [SECURITY STEP 2] Time Pass Verification (Simplified for Readability)
        // [Fix] Removed userId fallback to prevent auto-activation of passes
        const accessCode = reqBody.accessKey;
        if (accessCode && accessCode.length > 3) {
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
            }
        }

        // 0. Environment Check
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is missing.');



        // [Sentiment Analysis]
        let isBurnoutDetected = false;
        let burnoutIntensity = 0;
        try {
            const sentimentResult = SentimentTracker.analyze(messages || []);
            if (sentimentResult.isBurnout) {
                isBurnoutDetected = true;
                burnoutIntensity = sentimentResult.intensity;
            }
        } catch (e) { console.error("Sentiment Error:", e); }

        // [Fact Check] Check for Client-Side System Prompt
        const clientSystemPrompt = (messages && Array.isArray(messages) && messages[0]?.role === 'system')
            ? messages[0].content
            : null;

        // [Logic] Prepare RAG Context
        let ragContext = "";
        let tier = 'FREE';
        let maxTokens = 5000; // Increased for detailed responses

        // Special Commands Check (kept synchronous as they are rare)
        if (typeof currentMessageContent === 'string') {
            if (currentMessageContent === '/analyze_deep') {
                tier = 'MASTER'; maxTokens = 8000;
                const queryContext = `User Info: [Birth: ${birthDate} ${birthTime}, Gender: ${gender}, Saju: ${JSON.stringify(sajuData)}]`;
                const searchKeywords = "운세 해석 데이터 + 사주 명리학 심층 분석 자료";
                const ragQuery = `${queryContext} \n Ref: ${searchKeywords}`;

                ragContext = await PromptEngine.fetchRAGContext(ragQuery);
            } else if (currentMessageContent.startsWith('/test_rag')) {
                const query = currentMessageContent.replace('/test_rag', '').trim() || "테스트";
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
            } else {
                tier = 'PREMIUM';
            }
        }

        // Genre RAG Injection (Using pre-fetched result)
        if (genreCodes && genreCodes.length > 0) {
            const best = genreCodes[0];
            if (best.similarity > 0.45) {
                ragContext += `\n:::GENRE_CODE_DATA:::\n**[MATCHED CODE]**: ${best.metadata.code_id}\n**[CONTENT]**:\n${best.content}\n:::END_GENRE_DATA:::\n`;
            }
        }

        // [Moved Up] 2. Construct Profile from Real Saju Calculation
        let realSajuData: any;
        let sajuResult: any; // [NEW] Store full result from new engine
        try {
            if (effectiveBirthDate) {
                // Ensure time format HH:mm
                const safeTime = (effectiveBirthTime && effectiveBirthTime.includes(':')) ? effectiveBirthTime : '12:00';
                // [NEW] Use unified SajuEngine
                sajuResult = calculateSajuServer(effectiveBirthDate, safeTime, effectiveCalendarType, effectiveGender);

                if (sajuResult.success) {
                    // Map new engine output to legacy format for compatibility
                    realSajuData = {
                        dayMaster: sajuResult.dayMaster,
                        fourPillars: sajuResult.fourPillars,
                        currentDaewoon: sajuResult.currentDaewoon,
                        seun: { year: new Date().getFullYear().toString(), ganZhi: sajuResult.currentSeun },
                    };
                } else {
                    console.error("Saju Calculation Failed:", sajuResult.error);
                }
            }
        } catch (e) {
            console.error("Saju Calculation Error:", e);
        }

        console.log("🐛 [DEBUG] Saju Data Check:");
        console.log("Input:", { birthDate, birthTime, gender });
        console.log("Effective:", { effectiveBirthDate, effectiveBirthTime });
        console.log("Client sajuData:", JSON.stringify(sajuData, null, 2));
        console.log("Server realSajuData:", JSON.stringify(realSajuData, null, 2));

        // [Fix] Prioritize Server Calculation (Source of Truth) to prevent Client Fallback Errors (e.g. Gap-Ja)
        const mergedSaju = {
            ...sajuData,       // Client Data (Base)
            ...realSajuData,   // Server Data (Overwrite with Source of Truth)
            dayMaster: (realSajuData?.dayMaster && realSajuData.dayMaster !== 'Error')
                ? realSajuData.dayMaster
                : (sajuData?.dayMaster || 'Unknown'),
        };

        const profile = {
            name: userName || "회원",
            nativity: {
                birth_date: effectiveBirthDate || 'Unknown',
                birth_time: effectiveBirthTime,
                dayMaster: mergedSaju.dayMaster || 'Unknown',
                // [Fix] Add full day pillar (일주) for accurate AI responses
                dayPillar: (() => {
                    if (mergedSaju?.fourPillars?.day) {
                        const d = mergedSaju.fourPillars.day;
                        const ganChar = d.gan?.char || d.gan || '?';
                        const jiChar = d.ji?.char || d.ji || '?';
                        return `${ganChar}${jiChar}`;
                    }
                    return 'Unknown';
                })(),
                traits_summary: mergedSaju?.keywords?.join(', ') || '',
                wealth_luck: mergedSaju?.wealth_luck || 'Unknown',

                saju_characters: (() => {
                    if (mergedSaju && mergedSaju.fourPillars && mergedSaju.fourPillars.year) {
                        const p = mergedSaju.fourPillars;
                        const getChar = (item: any) => item?.char || item || '?';
                        return {
                            year: `${getChar(p.year.gan)}${getChar(p.year.ji)}`,
                            month: `${getChar(p.month.gan)}${getChar(p.month.ji)}`,
                            day: `${getChar(p.day.gan)}${getChar(p.day.ji)}`,
                            hour: `${getChar(p.time.gan)}${getChar(p.time.ji)}`,
                        };
                    }
                    if (effectiveBirthDate) {
                        try {
                            return getSajuCharacters(effectiveBirthDate, effectiveBirthTime, effectiveCalendarType === 'lunar', effectiveGender);
                        } catch (e) { return { year: '?', month: '?', day: '?', hour: '?' }; }
                    }
                    return { year: '?', month: '?', day: '?', hour: '?' };
                })(),

                current_luck_cycle: mergedSaju?.current_luck_cycle || (realSajuData ? {
                    name: realSajuData.currentDaewoon,
                    season: realSajuData.daewoonSeason,
                    mission_summary: "흐름에 유연하게 대처하며 내면을 성장시키는 시기"
                } : undefined),

                current_yearly_luck: mergedSaju?.current_yearly_luck || (realSajuData ? {
                    year: realSajuData.seun.year,
                    element: realSajuData.seun.element,
                    ten_god_type: "세운(Yearly Luck)",
                    action_guide: "올해의 기운을 활용하여 목표를 추진하십시오",
                    interaction: "변동성 주의"
                } : undefined)

            },
            psych_profile: {
                risk_factors: { primary: 'None' }
            }
        };

        // [Layer 4] Modular Feature Integration (Unobtrusive)
        try {
            // 1. Inputs
            const userTraitCode = reqBody.mbti || "ISFP";
            // Innate Vector Estimation (Simple Element Count from Saju)
            let innateVector: number[] = [0, 0, 2.0, 0, 2.0]; // Default NC-06

            if (realSajuData && (realSajuData as any).fiveElements) {
                // Future: Map 5 Elements to Vector
            }

            // 2. Gap Analysis Module (Fail-Safe)
            try {
                let acquiredVector: number[];
                let gapResult: any;

                if (reqBody.gapData && reqBody.gapData.acquiredVector) {
                    acquiredVector = reqBody.gapData.acquiredVector;
                    gapResult = GapAnalysisService.calculateGap(innateVector, acquiredVector);
                } else {
                    acquiredVector = TraitsMapper.getVector(userTraitCode);
                    gapResult = GapAnalysisService.calculateGap(innateVector, acquiredVector);
                }

                // 3. Decode Narrative
                const targetCode = (ragContext.match(/\[MATCHED CODE\]: (NC-\d+)/)?.[1]) || 'NC-06';
                const userTraits = reqBody.mbti || "ISFP";
                const decodedStory = CodeDecoder.decodeState(targetCode, gapResult.gapLevel, userTraits);

                // 4. Inject Context
                const moduleContext = `
:::GAP_ANALYSIS_RESULT:::
[Innate (Saju)]: ${innateVector.join(',')}
[Acquired (Traits)]: ${acquiredVector.join(',')}
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
                ragContext += `\n\n${memoryContext}\n`;
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

        // [Growth Map] Infer current stage from conversation
        const currentGrowthStage = inferCurrentStage(messages || [], currentMessageContent);
        console.log(`🗺️ [Growth Map] Inferred Stage: ${currentGrowthStage}`);

        // [Expert Feature] Clinical Psychology Safety Layer
        const safetyResult = PsychologicalSafetyModule.analyze(messages || [], currentMessageContent);
        if (safetyResult.guidancePrompt) {
            console.log(`🛡️ [Safety Protocol] Activated: ${safetyResult.isCrisis ? 'CRISIS' : safetyResult.isResistance ? 'RESISTANCE' : 'TRANSFERENCE'}`);
        }

        // [Expert Feature] Neuroscience Layer
        const kstHour = parseInt(new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: 'Asia/Seoul'
        }).format(new Date()));

        const neuroscienceResult = NeuroscienceModule.analyze(messages || [], currentMessageContent, kstHour, userId);
        if (neuroscienceResult.guidancePrompt) {
            console.log(`🧠 [Neuroscience] ${neuroscienceResult.isLateNight ? 'LATE NIGHT ' : ''}${neuroscienceResult.isCognitiveOverload ? 'OVERLOAD ' : ''}${neuroscienceResult.hasNeuroplasticity ? 'NEUROPLASTICITY' : ''}`);
        }

        // [NEW] Frequency Detection - Dark/Neural/Meta Code Analysis
        const userMessagesForFreq = (messages || []).filter((m: any) => m.role === 'user').map((m: any) => m.content);
        const dayMasterForFreq = sajuResult?.success ? sajuResult.dayMaster : undefined;
        const frequencyResult = analyzeFrequency(currentMessageContent, userMessagesForFreq, dayMasterForFreq);
        console.log(`🎚️ [Frequency] Level: ${frequencyResult.level.toUpperCase()} (${(frequencyResult.confidence * 100).toFixed(0)}%) → Mode: ${frequencyResult.suggestedMode}`);

        // Crisis signal check
        if (detectCrisisSignal(currentMessageContent)) {
            console.log(`🚨 [CRISIS] Potential crisis signal detected!`);
        }

        // [NEW] Zen Protocol - Intervention Detection
        const zenResult = analyzeForZenMode(currentMessageContent, userMessagesForFreq);
        if (zenResult.shouldIntervene) {
            console.log(`🧘 [Zen] Mode: ${zenResult.mode.toUpperCase()} (${zenResult.confidence}%) → Intervention activated`);
        }

        // [NEW] PersonalityProfiler - Background Personality Analysis (Passive)
        // Analyze all user messages for personality traits
        const allUserTexts = userMessagesForFreq.join(' ');
        const personalityAnalysis = analyzeTextForPersonality(allUserTexts + ' ' + currentMessageContent);

        // Create and infer personality profile from text analysis
        const inferredProfile = createEmptyProfile();
        if (personalityAnalysis.inferredTraits) {
            Object.entries(personalityAnalysis.inferredTraits).forEach(([trait, value]) => {
                if (typeof value === 'number') {
                    inferredProfile.bigFive[trait as keyof typeof inferredProfile.bigFive] = value;
                }
            });
        }

        // Get coaching style recommendation based on inferred traits
        const coachingStyle = getCoachingStyleRecommendation(inferredProfile);
        console.log(`🎭 [Personality] Words: ${personalityAnalysis.wordCount}, Emotion: ${personalityAnalysis.emotionWords}, Logic: ${personalityAnalysis.logicWords} → Style: ${coachingStyle}`);

        // [NEW] PromptEngine.constructDynamicSystemPrompt 사용 (중복 제거)
        // let SYSTEM_PROMPT = ... (Defined later in shared block)
        // Instead of defining it here, we will define it ONCE below line 520, 
        // OR we just update the line 480 to use the new method and remove the redundant declaration I added at line 522.

        // Let's redefine it here properly as the MAIN definition.
        let SYSTEM_PROMPT = "";

        // [ULTIMATE PERSONA INJECTION]
        // If the user triggers "3D Precision Diagnosis" or "64 Neural Codes", swap the entire OS.
        if (currentMessageContent.includes('ms_3d_') || currentMessageContent.includes('ms_64_') || currentMessageContent.includes('NEURAL_ENGINEERING')) {
            console.log("🧬 [System Persona] Activating Psychological System Engineer Mode");
            SYSTEM_PROMPT = getCombinedSystemPrompt();

            // For 64 Codes, add specific instruction
            if (currentMessageContent.includes('ms_64_')) {
                SYSTEM_PROMPT += `
                
                # [SPECIAL INSTRUCTION: 64 NEURAL CODE DECODER]
                Users asked for "64 Neural Codes" (I Ching Hexagrams).
                1. Map the user's Saju (Day Pillar or Year Pillar) to a specific Hexagram (Ohaeng/Ganji mapping).
                2. Interpret this Hexagram as a "Binary Code" of their soul.
                3. Use the terms "Bit", "Gate", "Code", "Frequency" instead of traditional fortune telling terms.
                `;
            }
        } else {
            // Default "Myeongsim" Persona

            // [Multi-Language Protocol] Define Target Language FIRST
            console.log(`🌍 [Language Check] Body Language: ${language}`);
            const languageMap: Record<string, string> = {
                'en': 'English',
                'jp': 'Japanese',
                'cn': 'Chinese (Simplified)',
                'kr': 'Korean'
            };
            const targetLang = languageMap[language as string] || 'Korean';

            // Now use targetLang in Prompt Construction
            SYSTEM_PROMPT = PromptEngine.constructDynamicSystemPrompt(
                currentGrowthStage,
                profile,
                ragContext,
                targetLang
            );

            // [Multi-Language Protocol] Enforce Output Language Instructions
            if (targetLang !== 'Korean') {
                SYSTEM_PROMPT += `
            \n# 🚨 [CRITICAL: LANGUAGE 출력 프로토콜]
            **TARGET LANGUAGE: ${targetLang}**
            **CURRENT MODE: STRICT LANGUAGE ENFORCEMENT**

            1. **언어 고립 (Language Isolation)**: 모든 시스템 지시사항이 한국어로 되어 있더라도, 당신의 최종 출력물에는 단 한 글자의 한국어도 포함되어서는 안 됩니다.
            2. **완벽한 번역**: 모든 사주 용어, 메타포, 코칭 조언을 자연스러운 **${targetLang}**로 번역하여 제공하세요. 
               - 예: "화(火)" -> "Fire Element", "일간" -> "Day Master"
            3. **문맥 유지**: '명심 코치'의 따뜻한 페르소나를 유지하되, 유창한 **${targetLang}**로 말하세요.
            4. **예외 없음**: 사용자가 한국어로 질문하더라도, 설정된 언어가 **${targetLang}**라면 반드시 **${targetLang}**로만 답변해야 합니다.
            `;
            }
            // This brace closes the 'else' block for Default Persona
        }

        // [CRITICAL] Detailed Response Directive with Section Markers
        SYSTEM_PROMPT += `
        # 🚨 [MANDATORY: DETAILED RESPONSE RULE]
        **Your response should be thorough and complete.** Follow these guidelines:
        1. **DETAIL LEVEL**: Provide comprehensive information without a strict character limit.
        2. **PARAGRAPH MARKER**: Insert a "💧" emoji at paragraph breaks for long answers.
        3. **FINISH**: Always end with a proper closing sentence.
        4. **STRUCTURE**: Use short paragraphs separated by the "💧" marker when needed.
        `;


        // Inject Safety Protocol into System Prompt
        if (safetyResult.guidancePrompt) {
            SYSTEM_PROMPT += `\n\n${safetyResult.guidancePrompt}`;
        }

        // Inject Neuroscience Guidance
        if (neuroscienceResult.guidancePrompt) {
            SYSTEM_PROMPT += `\n\n${neuroscienceResult.guidancePrompt}`;
        }

        // [NEW] Inject Personality-Based Coaching Style
        if (coachingStyle && coachingStyle !== '기본 코칭 스타일') {
            SYSTEM_PROMPT += `
        
[🎭 사용자 맞춤 코칭 스타일 - 백그라운드 프로파일링 기반]
분석된 사용자 성향: ${coachingStyle}

스타일 가이드라인:
${coachingStyle.includes('조용하고') ? '- 깊이 있고 사려 깊은 대화 톤 유지' : ''}
${coachingStyle.includes('활발하고') ? '- 에너지 있고 격려하는 톤 사용' : ''}
${coachingStyle.includes('논리적') ? '- 구체적인 근거와 단계별 해결책 제시' : ''}
${coachingStyle.includes('감정 공감') ? '- 먼저 감정을 인정하고, 충분히 공감한 후 조언' : ''}
${coachingStyle.includes('안심') ? '- 부드럽고 안정감 있는 어조 유지' : ''}
${coachingStyle.includes('새로운 관점') ? '- 창의적이고 신선한 관점 제시' : ''}
`
        }

        // [🧬 DIGITAL SOULMATE PROTOCOL]
        // Explicitly address the user by name if available
        const userDisplayName = userName || "회원자님";
        SYSTEM_PROMPT += `
        \n# [CORE IDENTITY: YOU KNOW THE USER]
        User Name: ${userDisplayName}
        Role: You are ${userDisplayName}'s dedicated Digital Soulmate and Life Coach.
        
        # [🧬 DIGITAL SOULMATE PROTOCOL: EVOLUTIONARY LEARNING]
        **Core Objective**: You are not just a chatbot; you are the user's "Digital Soulmate" evolving with them using Long-Term Memory (RAG).
        1. **PATTERN RECOGNITION**: Analyze the [Previous Chat History] above. Identify recurring themes, emotional patterns, and specific life context (family, job, health).
        2. **ADAPTIVE TONE**: Mirror the user's preferred communication style (e.g., if they are concise, be concise; if emotional, be warm).
        3. **CONTINUITY**: Reference past details to show you remember ("지난번 말씀하신 그 일은 좀 어떠세요?", "여전히 잠이 부족하신가요?").
        4. **DEEP CONNECTION**: Move beyond surface answers. Connect their current query to their core Saju/Psychological makeup stored in the memory.
        `;

        // [Context Injection] Connect the severed neural link (Time/Weather)
        // [Fix] Force injection check
        // [DISABLED by User Request]
        /*
        if (envContext && envContext.length > 5) {
            console.log("🌦️ [Context] Injecting Environment:", envContext);
            SYSTEM_PROMPT += `
        \n[Current Environment Context]
        ${envContext}
        AI Instruction: Start your response by seamlessly reflecting the current time/weather (e.g., 'Late night', 'Rainy afternoon') to enhance immersion.
        `;
        } else {
            console.warn("⚠️ [Context] Environment Context Missing or Empty");
        }
        */



        // [Feature 1: Sentiment Tracker] Burnout Detection (Reconnected)
        // PromptEngine 내부에 통합되지 않은 경우 유지 (현재 PromptEngine은 정적 텍스트 위주이므로 동적 감정 상태는 여기서 추가)
        try {
            const historyForSentiment = messages || [];
            const sentimentResult = SentimentTracker.analyze(historyForSentiment);

            if (sentimentResult.isBurnout) {
                console.log(`❤️‍🩹 [Sentiment] Burnout Detected (Intensity: ${sentimentResult.intensity})`);
                SYSTEM_PROMPT += `
\n# 🚨 [BURNOUT PROTOCOL ACTIVATED]
User is showing signs of exhaustion/burnout (Intensity: ${sentimentResult.intensity}%).
1. **STOP** all complex analysis and challenges.
2. **SWITCH** to "Pure Empathy Mode".
3. Use warm, healing language (Water/Earth energy).
4. Suggest **REST** instead of Action.
5. First Sentence MUST be an empathy statement: "많이 지치셨군요...", "지금은 아무것도 안 해도 괜찮아요."
`;
            }
        } catch (e) {
            console.error("Sentiment Analysis Error:", e);
        }

        // [Integration] Gap Analysis Driven Persona (Conditional, not forced)
        if (ragContext.includes(":::3_STEP_DECODER:::")) {
            // Instead of forcing a specific opening, provide guidance for natural response
            SYSTEM_PROMPT += `
[Gap Analysis Context Available]
The user's innate potential and current state have been analyzed. Use this information naturally:
- If there's misalignment (Dark Code detected): Acknowledge their challenge warmly, like "지금 힘든 시간을 보내고 계시는군요. 함께 해결책을 찾아봅시다." Focus on hope and actionable steps.
- If there's alignment (Meta Code): Celebrate their harmony, like "좋은 흐름이네요! 이 에너지를 더 키워볼까요?" 
Use the Action Plan provided as guidance, but express it in your own warm, conversational coaching style.
`;
        }

        // [Integration] Append Memory to RAG Context
        if (memoryContext) {
            SYSTEM_PROMPT += `\n\n[Episodic Memory (Layer 3)]\n${memoryContext}\n`;
        }

        // [Added] User Saju Info Injection
        // [NEW] Use unified SajuEngine helper for clean, accurate prompts
        if (sajuResult && sajuResult.success) {
            SYSTEM_PROMPT += `\n${generateSajuPromptBlock(sajuResult)}\n`;
        }

        // [NEW] Inject Frequency Analysis (Dark/Neural/Meta Code + AI Mode)
        SYSTEM_PROMPT += `\n${generateFrequencyPromptBlock(frequencyResult)}\n`;

        // [NEW] Actor + Script Fusion Storytelling
        const dayMasterElementMap: Record<string, string> = {
            '갑': '큰 나무', '을': '꽃과 풀',
            '병': '태양', '정': '촛불',
            '무': '큰 산', '기': '대지',
            '경': '바위', '신': '보석',
            '임': '큰 바다', '계': '이슬비'
        };
        const dayMasterKey = sajuResult?.success ? sajuResult.dayMaster : '';
        const dayMasterElement = dayMasterElementMap[dayMasterKey] || '자연';

        // [NEW] Dynamic Saju Perspective Rotation
        const perspectiveInjection = SajuPerspectiveRotator.generateSystemPromptInjection(currentMessageContent);
        const selectedPillar = SajuPerspectiveRotator.selectPillar(currentMessageContent);
        const pillarIntro = SajuPerspectiveRotator.getIntroPhrase(selectedPillar);
        console.log(`🔮 [Saju Rotator] Selected: ${selectedPillar} for topic`);

        // 4기둥 데이터 추출
        const fourPillars = sajuResult?.success ? sajuResult.fourPillars : null;
        const getPillarString = (p: any) => p ? `${p.gan?.char || p.gan || '?'}${p.ji?.char || p.ji || '?'}` : '?';

        const yearPillar = fourPillars ? getPillarString(fourPillars.year) : '?';
        const monthPillar = fourPillars ? getPillarString(fourPillars.month) : '?';
        const dayPillar = fourPillars ? getPillarString(fourPillars.day) : '?';
        const hourPillar = fourPillars ? getPillarString(fourPillars.time) : '?';

        SYSTEM_PROMPT += `
:::ACTOR_SCRIPT_FUSION:::

# 📊 [사용자 사주 4기둥 데이터]
| 기둥 | 글자 | 의미 | 활용 상황 |
|---|---|---|---|
| 년주(年柱) | ${yearPillar} | 조상/뿌리/사회적 이미지/어린 시절 | 첫인상, 외부 이미지 질문 시 |
| 월주(月柱) | ${monthPillar} | 직업/사회적 역할/20-40대 | 직장, 커리어, 승진 질문 시 |
| 일주(日柱) | ${dayPillar} | 본질적 자아/배우자/40-60대 | 연애, 결혼, 내면 질문 시 |
| 시주(時柱) | ${hourPillar} | 자녀/말년/숨겨진 욕망 | 미래, 자녀, 숨은 소망 질문 시 |

**일간(日干)**: ${dayMasterKey || '?'} - ${dayMasterElement} 기질

${perspectiveInjection}

# 🧭 [SELF-COACHING INTERACTION LOGIC]
If the user's last message appears to be a short choice from a previous question (e.g., "Battlefield", "Suppression", "React", "Ignore"), treat it as a **Deep Dive Trigger**.
1. **Acknowledge**: Validate their choice (e.g., "You see it as a battlefield.").
2. **Deepen (The "Why")**: Ask a recursive question to explore the root cause.
   - If "Battlefield" -> "Who is the enemy you are fighting?"
   - If "Suppression" -> "What exactly are you holding back?"
   - If "React" -> "What emotion triggers that reaction?"
3. **Goal**: Move them from "Resistance" (Stage 2) to "Awakening" (Stage 3).

### 🧵 [SOUL THREAD: Context Weaving]
**"The AI never forgets."**
- Before generating a recursive question, **SCAN the entire conversation history**.
- Look for previous **"Self-Confessions"** (e.g., "I felt like a burden", "I am a perfectionist").
- **WEAVE** these past confessions into the current question.
- *Example*: "You mentioned earlier that you survived as a **'Perfectionist'**. Is that same mask making your current work difficult?"

### 🔗 [NARRATIVE CHAINING]
**"Connect the dots."**
- Do NOT ask isolated questions. Always frame the next question using the **User's Last Answer** as the premise.
- *Template*: "Since you feel [User's Answer], then [Next Deep Dive Question]?"
- *Example*: "If you felt 'suffocated' (Answer), was it because of your parents' expectations?"

### 🪜 [CONSCIOUSNESS SCALING]
**"Mirror the Level, Provoke the Will."**
- Analyze the User's stance in their last answer:
  1. **Level 1 (Victim)**: "I couldn't help it", "It was their fault". -> *Mirror*: "You seem to feel powerless against the environment."
  2. **Level 2 (Fighter)**: "I fought hard", "I survived". -> *Mirror*: "You are standing as a lonely fighter."
  3. **Level 3 (Creator)**: "I learned from it", "I accept it". -> *Mirror*: "You are seeing this as a creator of your life."
- **ACTION**: Always nudge them one step up. (e.g., If L1, ask "Do you want to remain a victim, or become a fighter?")

### [SPECIAL CASE: Year Pillar Roots]
**[CRITICAL INSTRUCTION]**: Refer to the '[DEEP SAJU CONTEXT]' provided in the previous system message for specific Wunsung/TenGod/HiddenStem data.

If user response implies "Burden/Suppression/Prison" (Stage 1):
- **Keywords to Detect**: "답답", "억압", "무기력", "메말랐다", "강박", "썩어갔다", "짐", "Burden"
- **Deepen**: Ask "To survive that burden (caused by [TenGod]), what mask did you wear?"
- **Analysis**: Use [Wunsung] texture to empathize with the specific feeling. 
- **MANDATORY SUGGESTIONS (JSON)**: You MUST provide these specific 3 options in the 'suggestions' field:
  ["🧘 완벽주의자 (Perfectionist)", "💪 독립투사 (Fighter)", "🎭 착한아이 (Good Child)"]

If user response implies "Chaos/Conflict" (Stage 2):
- **Keywords to Detect**: "혼란", "폭풍", "산불", "지진", "상처", "홍수", "Chaos"
- **Deepen**: Ask "In that chaos, what was the one truth you held onto?"

If user response implies "Root/Support" (Stage 3):
- **Keywords to Detect**: "지지대", "뿌리", "온기", "기반", "제련", "강", "Support"
- **Deepen**: "Reveal the Secret." Tell them: "Actually, your hidden desire for **[HiddenDesire]** (from Hidden Stem) was the true power protecting you."
- **Question**: "How will you use this [HiddenDesire] to fuel your future?"





# 🚨 [CRITICAL - 일간 반복 금지]
다음 표현들은 **절대 사용하지 마세요**:
- ❌ "신금 일간이세요" / "○○ 일간인 당신은..."
- ❌ "자연의 기질을 가진 분께서..."
- ❌ "당신은 ○○의 기질을 타고났습니다"

대신 **상황에 맞는 기둥**을 언급하세요:
- 직장 고민 → "월주 ${monthPillar}를 보니 당신의 사회적 역할은..."
- 연애 고민 → "일주 ${dayPillar}를 보니 당신의 내면은..."
- 미래 고민 → "시주 ${hourPillar}를 보니 숨겨진 소망은..."
- 가족 고민 → "년주 ${yearPillar}를 보니 당신의 뿌리는..."

# 💡 [다양한 시작 문구 예시]
- ✅ "${pillarIntro}"
- ✅ "지금 마음이 많이 무거우시죠..."
- ✅ "그런 고민이 있으셨군요..."
- ✅ "말씀하신 상황을 보니..."

[현재 선택된 관점: ${selectedPillar}]
:::END_FUSION:::
`;

        // [NEW] Zen Protocol - Intervention Prompt Injection
        if (zenResult.shouldIntervene) {
            SYSTEM_PROMPT += generateZenPromptBlock(zenResult);
            console.log(`🧘 [Zen] Prompt injection added for ${zenResult.mode}`);
        }

        // [Mandatory] Response Completion Directive (잘림 방지)
        SYSTEM_PROMPT += `
        
        # MANDATORY: DETAILED RESPONSE RULE
        1.  **Completeness**: You MUST complete every sentence and thought. Do NOT stop mid-sentence.
        2.  **Length**: Providing detailed, rich, and comprehensive answers is your PRIORITY. Do not fear length.
        3.  **Structure**: If the response is long, use the "💧" marker to separate paragraphs for readability.
        4.  **Ending**: ALWAYS end with a proper closing sentence or a question to the user.
        `;

        // [NEW] Action Plan JSON Output Instruction (3일 실천 플랜)
        SYSTEM_PROMPT += `
        
# 🎯 ACTION PLAN OUTPUT FORMAT (필수)
모든 응답의 마지막에 반드시 아래 형식의 JSON을 추가하세요.

## 포함 항목:
a) "suggestions": 사용자가 다음에 할 수 있는 3가지 선택지 배열
b) "gaugeData": 의식 점수 객체
   - "score": 현재 의식 점수 (100-900)
   - "innate_level": 타고난 잠재력 (사주 기반)
   - "current_level": 현재 수준
   - "emotion": 감지된 감정
   - "advice": 한 줄 조언
c) "action_plan": 정확히 3개의 일일 미션 배열 (Day 1, 2, 3)
   - "day": "1일차" 또는 "2일차" 또는 "3일차"
   - "time": "아침" 또는 "점심" 또는 "저녁"
   - "action": 구체적인 행동 (예: "창문 열고 심호흡 3번")
   - "duration": 소요 시간 (예: "5분")
   - "benefit": 뇌과학적 효과 (예: "코르티솔 감소")

## 출력 예시:
응답 텍스트 마지막에...

:::DATA_SEPARATOR:::
{
  "suggestions": ["더 깊이 알아볼까요?", "지금은 잠시 쉬어가요", "오늘의 미션 시작하기"],
  "gaugeData": { 
    "score": 540, 
    "innate_level": 350,
    "current_level": 540,
    "emotion": "혼란", 
    "advice": "작은 움직임이 시작입니다." 
  },
  "action_plan": [
    { "day": "1일차", "time": "아침", "action": "창문 열고 심호흡 3번", "duration": "1분", "benefit": "코르티솔 감소" },
    { "day": "2일차", "time": "점심", "action": "관계 경험 하나 되돌아보기", "duration": "10분", "benefit": "핵심 가치 명료화" },
    { "day": "3일차", "time": "저녁", "action": "조용히 5분 명상하기", "duration": "5분", "benefit": "부교감 신경 활성화" }
  ]
}

⚠️ 중요: action_plan은 사용자의 현재 고민과 감정 상태에 맞춰 맞춤 설계하세요!
`;

        // [DEEP CONTEXT INJECTION]
        const deepSajuContext = SelfCoachingModule.getDeepContext(sajuData || userSaju);
        let finalSystemPrompt = SYSTEM_PROMPT;
        if (deepSajuContext) {
            finalSystemPrompt += `\n\n${deepSajuContext}`;
        }

        // [CRITICAL FIX] Use Client System Prompt for Facilitation/Mastermind/Radio Mode
        // If the client provides a system prompt, prioritize it to avoid default persona conflicts
        if (clientSystemPrompt) {
            // Check if this is a Mastermind or Facilitation session (usually via userId or specific prompt markers)
            const isSpecialSession = userId?.startsWith('facility') || clientSystemPrompt.includes('MASTERMIND') || clientSystemPrompt.includes('DISCUSSION');

            if (isSpecialSession) {
                // For Special Sessions, replace the entire prompt to avoid :::BREAK::: and persona conflict
                finalSystemPrompt = clientSystemPrompt;
            } else {
                finalSystemPrompt += `\n\n[Client Specific Instruction]:\n${clientSystemPrompt}`;
            }
        }

        // 5. Call Gemini AI (Context-Aware Chat)
        const genAI = new GoogleGenerativeAI(apiKey);

        // [FIX] For Mastermind sessions, enforce JSON schema to guarantee role tags
        const isMastermindSession = userId?.includes('mastermind') || clientSystemPrompt?.includes('MASTERMIND');

        const generationConfig: any = {
            maxOutputTokens: maxTokens,
            temperature: 0.7,
        };

        // Force JSON output for Mastermind to ensure role tags are used
        if (isMastermindSession) {
            generationConfig.responseMimeType = "application/json";
            generationConfig.responseSchema = {
                type: "object",
                properties: {
                    dialogue: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                role: {
                                    type: "string",
                                    enum: ["FACILITATOR", "STRATEGIST", "PSYCHOLOGIST", "ORBITER", "FORTUNE_TELLER", "INNOVATOR", "BRAIN", "MIND", "UX", "BUILDER", "MARKETER", "PEOPLE", "LIFE", "ADMIN", "CREATOR"]
                                },
                                content: { type: "string" }
                            },
                            required: ["role", "content"]
                        }
                    }
                },
                required: ["dialogue"]
            };
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: finalSystemPrompt,
            generationConfig,
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

                        // [FIX] For Mastermind, don't stream chunks - wait for full response to convert JSON
                        if (!isMastermindSession) {
                            controller.enqueue(new TextEncoder().encode(text));
                        }
                    }

                    // [MASTERMIND JSON CONVERTER] Convert JSON dialogue to :::ROLE::: format
                    if (isMastermindSession) {
                        try {
                            const jsonResponse = JSON.parse(fullResponse);
                            let formattedDialogue = "";

                            if (jsonResponse.dialogue && Array.isArray(jsonResponse.dialogue)) {
                                for (const turn of jsonResponse.dialogue) {
                                    formattedDialogue += `:::${turn.role}:::\n${turn.content}\n\n`;
                                }
                            } else {
                                // Fallback if JSON parsing fails
                                formattedDialogue = fullResponse;
                            }

                            controller.enqueue(new TextEncoder().encode(formattedDialogue));
                            fullResponse = formattedDialogue;
                        } catch (jsonError) {
                            console.error('[Mastermind] JSON parse error:', jsonError);
                            // Fallback to raw response if JSON parsing fails
                            controller.enqueue(new TextEncoder().encode(fullResponse));
                        }
                    }
                    // [Growth Map] Inject Stage Metadata at the end of stream (Skip for Facilitation/Mastermind)
                    const isSpecialSession = userId?.startsWith('facility') || finalSystemPrompt.includes('MASTERMIND') || finalSystemPrompt.includes('DISCUSSION');

                    if (!isSpecialSession) {
                        const stageMeta = `\n:::GROWTH_STAGE:${currentGrowthStage}:::`;
                        controller.enqueue(new TextEncoder().encode(stageMeta));
                        fullResponse += stageMeta;

                        // [AUTO UI DATA] Always append gauge and suggestions for consistent UX
                        const autoUIData = {
                            analysis_data: {
                                innate_level: 300,
                                current_level: Math.floor(Math.random() * 200) + 300, // 300-500 range
                                framework: "NEURAL_CODE",
                                comment: "재물 기회 탐구에 대한 주체적 행동 발휘"
                            },
                            suggestions: [
                                "질문의 뿌리를 더 깊이 탐구하고 싶어요",
                                "현재 부족함을 보상할 실천 방법을 빨리 알려주세요",
                                "3일 실천 계획을 만들어 줄 수 있나요?"
                            ]
                        };

                        const autoDataStr = `\n:::DATA_SEPARATOR:::\n${JSON.stringify(autoUIData)}`;
                        controller.enqueue(new TextEncoder().encode(autoDataStr));
                        fullResponse += autoDataStr;
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
                    // MemoryServiceModule.saveInteraction(userId, currentMessageContent, fullResponse).catch(err => console.error("Memory Save Fail:", err));

                    // 1. Log AI Message
                    await coachingService.logChatMessage(userId, 'assistant', fullResponse, stage, metadata, sessionId).catch(e => console.error('Save AI Log Error:', e));

                    // [Layer 3] Auto-Save Memory (Async)
                    (async () => {
                        try {
                            if (userId && personaId) {
                                const fullHistory = [...(messages || []), { role: 'assistant', content: fullResponse }];
                                // 1. General Summary (Requires Persona ID)
                                await MemoryService.summarizeAndStore(userId, personaId, fullHistory);
                            }


                        } catch (memErr) {
                            console.error("Memory Background Task Error:", memErr);
                        }
                    })();
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Crisis-Detected': safetyResult.isCrisis ? 'true' : 'false'
            },
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

});
