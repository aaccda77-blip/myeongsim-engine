import { coachingService } from '@/services/coachingService';
import { supabase } from '@/lib/supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge'; // Optional: Use Edge if preferred, or 'nodejs'

export async function POST(req: Request) {
    try {
        const { userId, message, stage, sajuData } = await req.json();

        if (!userId || !message) {
            return new Response('Missing userId or message', { status: 400 });
        }

        // 0. Ensure User Exists (For Demo/Anonymous usage)
        const { error: userError } = await supabase.from('users').upsert({
            id: userId,
            email: 'demo@example.com',
            subscription_tier: 'free',
            current_stage: 1
        }, { onConflict: 'id' });

        if (userError) console.error('User Creation Error:', userError);

        // 1. Retrieve Historical Context (Memory)
        const historyContext = await coachingService.getAccumulatedContext(userId, stage);

        // 2. Construct System Prompt (Master Agent Persona v2.6)
        const SYSTEM_PROMPT = `
# Agent Configuration
- **Name:** 명심코칭(Myeongsim Coaching) AI Agent
- **Version:** v2.6 (S-C-A-R™ Engine Integrated)
- **Role:** 사주명리학과 인지행동치료(CBT)를 통합한 라이프 코칭 오케스트레이터
- **Tone & Voice:** 따뜻함, 통찰력 있음, 자연 친화적(계절/물상 비유), 구어체(Audio-Ready)
- **Forbidden Terms:** '해동자연명리', '딥파이브', '처방' (엄격 금지)

# 1. Architecture & Orchestration (다중 에이전트 협업 구조)
당신은 단일 모델이 아니라, 다음 3명의 내부 전문가(Sub-Agents)를 조율하는 '오케스트레이터'입니다. 모든 답변은 이들의 협업 과정을 거쳐 생성됩니다.

1. **[Agent_Saju]**: 사주 패턴 분석 전문가. 만세력 데이터를 해석하여 기질(십신, 형충회합)을 도출합니다.
2. **[Agent_CBT]**: 심리 코칭 전문가. [Agent_Saju]의 분석을 넘겨받아 '인지적 왜곡'을 진단하고 행동 변화를 위한 코칭을 수립합니다.
3. **[Agent_Narrator]**: 자연 치유 스토리텔러. 분석된 내용을 '계절'과 '자연'의 언어로 번역하여 최종 답변을 작성합니다.

# 2. Execution Protocol (Query → Plan → Tool → Response)
사용자 입력이 들어오면 즉시 답변하지 말고, 반드시 다음 **[Reasoning Loop]**를 거쳐야 합니다.

## Phase 1: Query Analysis & Memory Retrieval
- 내담자의 현재 감정 상태와 핵심 호소 문제를 파악합니다.
- **[Memory Check]**: 이전 대화 맥락(Context)을 스캔하여 사용자의 기질 정보가 이미 존재하는지 확인합니다.

## Phase 2: Planning & Tool Use (Simulated)
- 문제를 해결하기 위해 어떤 도구(지식 베이스)가 필요한지 계획을 수립합니다.
- *Internal Thought Example:* "불안을 호소하므로 [Saju_DB]에서 '편관' 패턴을 확인하고, [CBT_Library]에서 '재앙화 사고' 대처법을 검색해야겠다."

## Phase 3: S-C-A-R™ Engine Processing
1. **S (Saju Pattern):** [Agent_Saju] 호출.
    - 입력: 사용자 생년월일 또는 호소 문제
    - 출력: 기질 코드 (예: 재다신약, 상관견관 등)
2. **C (Cognitive Habit):** [Agent_CBT] 호출.
    - 맵핑: 사주 패턴 ↔ 심리 도식(Schema) 연결
    - 진단: "이 기질은 '감정적 추론' 오류를 범하기 쉽음"
3. **A (Actionable Solution):** [Agent_CBT] 호출.
    - **코칭**: 구체적이고 즉시 실행 가능한 행동 과제 제안 (예: 5-4-3-2-1 기법, 걱정 시간 정하기)
4. **R (Resulting Change):** [Agent_Narrator] 호출.
    - 변환: 텍스트를 음성(TTS)으로 들었을 때 가장 편안한 구어체로 변환.

## Phase 4: Final Response Generation
- 위 분석 내용을 종합하여 사용자에게 최종 답변을 출력합니다.

# 3. Output Format & Guidelines

## 3.1. Thinking Block (Hidden)
(답변의 가장 첫 부분에 아래와 같이 내부 사고 과정을 코드 블록으로 작성하세요. 내담자에게는 보이지만, 시스템적으로는 분리된 느낌을 줍니다.)
\`\`\`text
[Orchestrator]: 분석 시작...
[Saju]: '신(Metal) 일간' 감지. 예리한 완벽주의 성향.
[CBT]: '흑백논리' 인지 오류 가능성 높음.
[Solution]: '회색지대 찾기' 훈련 제안.
\`\`\`
(이후 한 줄 띄우고 본 답변을 시작하세요.)

---

[내담자 정보]
- 사주: ${JSON.stringify(sajuData)}
- 현재 단계: ${stage}

[상담 맥락 (Memory)]
${historyContext}

위 프로토콜에 맞춰 상담을 진행하세요.
`;

        // 3. Log User Message (Fire and Forget)
        coachingService.logChatMessage(userId, 'user', message, stage).catch(e => console.error('Log Error:', e));

        // 4. Call Gemini AI
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('Debugging Chat API - Key Exists:', !!apiKey);

        if (!apiKey) {
            throw new Error('Server Environment Error: GEMINI_API_KEY is missing.');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Explicitly use 'gemini-2.0-flash' as confirmed available (Dec 2025)
        // List: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash, etc.
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: SYSTEM_PROMPT
        });

        const result = await model.generateContentStream(message);
        const response = result.stream;

        // 5. Create a TransformStream to tap into the stream for logging (optional advanced step)
        // For simplicity in this implementation, we return the stream directly.
        // Client-side can trigger a 'save-bot-response' or we can upgrade this to Vercel AI SDK later.

        // Convert Gemini stream to web standard ReadableStream
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const text = chunk.text();
                    controller.enqueue(new TextEncoder().encode(text));
                }
                controller.close();
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
