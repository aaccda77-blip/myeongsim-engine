'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    speaker: 'facilitator' | 'coach' | 'user';
    content: string;
    timestamp: Date;
}

import { useReportStore } from '@/store/useReportStore'; // [Import]
import { useVoice } from '@/hooks/useVoice'; // [Feature] Voice

export default function FacilitationPage() {
    const router = useRouter();
    const { reportData } = useReportStore(); // [Store]
    const { speak, isPlaying: isVoicePlaying, stop: stopVoice } = useVoice(); // [Feature] Voice

    // [Radio Mode] State
    const [radioTopic, setRadioTopic] = useState<string | null>(null);
    const [radioStage, setRadioStage] = useState(0); // 0:Intro, 1:Deepening, 2:Strategy, 3:Conclusion/Loop
    const [isRadioActive, setIsRadioActive] = useState(false);
    const radioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [canInterrupt, setCanInterrupt] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // [Fix] Separate state for API calls
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // [Auto-TTS] Removed in favor of manual sequencing in response handlers to ensure audio-visual sync

    // [Radio Loop] Auto-continue when silence is detected
    useEffect(() => {
        if (!isRadioActive || isLoading || isVoicePlaying) {
            if (radioTimeoutRef.current) clearTimeout(radioTimeoutRef.current);
            return;
        }

        // If voice finished and we are in Radio Mode, wait 3s then continue
        radioTimeoutRef.current = setTimeout(() => {
            handleAutoContinue();
        }, 3000); // 3 seconds silence -> Next Segment

        return () => {
            if (radioTimeoutRef.current) clearTimeout(radioTimeoutRef.current);
        };
    }, [isVoicePlaying, isLoading, isRadioActive, messages]);

    const startSession = async (topic: string) => {
        setRadioTopic(topic);
        setIsSessionActive(true);
        setCanInterrupt(true);
        setIsRadioActive(true);
        await generateOpeningRemarks(topic);
    };

    const handleAutoContinue = async () => {
        if (isLoading) return;
        setIsFetching(true);
        setIsLoading(true);

        try {
            // [Stage Logic] Deterministic Progression (Infinite Loop)
            const stages = [
                {
                    name: "DEEPENING_ANALYSIS",
                    instruction: "인트로가 끝났습니다. 이제 [진행자]는 '근본 원인'에 대해 날카롭고 탐구적인 질문을 던져야 합니다. [코치]는 사주 원리(오행/십성)를 활용해 구체적으로 답변하세요."
                },
                {
                    name: "TIKI_TAKA_DEBATE",
                    instruction: "[진행자]는 악마의 대변인 역할을 수행하세요. 코치의 의견에 반론을 제기하거나 의문을 표하세요 (예: '하지만 그건 너무 위험하지 않을까요?'). [코치]는 실제 사례와 함께 자신의 통찰을 방어하세요."
                },
                {
                    name: "ACTIONABLE_STRATEGY",
                    instruction: "실행 전략으로 전환합니다. [진행자]는 '그래서 지금 당장 무엇을 해야 하죠?'라고 묻습니다. [코치]는 단 하나의 간단하고 구체적인 실행 행동을 제시하세요."
                },
                {
                    name: "NEW_ANGLE_TRIGGER",
                    instruction: "대화를 마무리하지 마세요. 새로운 문을 여세요. [코치]는 갑자기 이 주제를 건강, 재물, 혹은 팀 역학 등 다른 측면과 연결하세요. 열기를 유지하세요!"
                }
            ];

            const currentStageInfo = stages[radioStage % stages.length];
            const nextStageIndex = (radioStage + 1) % stages.length;
            setRadioStage(nextStageIndex); // Increment for next turn

            const systemPrompt = `
                [역할 정의: 라이브 라디오 패널]
                1. [진행자] (Female Voice): 호기심 많고, 회의적이며, 자극적인 질문을 던짐.
                   - 업무: 코치의 말에 반응한 후, 날카롭고 짧은 질문을 던지세요.
                2. [코치] (Male Voice): 자신감 있고, 통찰력 있는 전문가.
                   - 업무: 심도 있는 사주 통찰을 제공하세요. 비유를 활용하세요.
                
                [지시사항: 티키타카(Tiki-Taka)]
                - 반드시 한국어(Korean)로만 대답하세요.
                - 캐릭터들이 서로 상호작용해야 합니다. "잠깐만요 코치님...", "좋은 지적입니다, 설명해 드리죠..." 같은 문구를 사용하세요.
                - 문장은 짧고 간결하게 유지하세요. 긴 단락은 금지입니다.
                - 대화를 앞으로 진전시키세요. 과거를 요약하지 마세요.
                
                [현재 단계: ${currentStageInfo.name}]
                단계 목표: ${currentStageInfo.instruction}
                
                [출력 형식]
                :::FACILITATOR::: (리액션 & 질문)
                :::COACH::: (답변 & 통찰)
                * JSON 출력 금지. 데이터 포함 금지.
            `;

            // [CRITICAL FIX] Trigger message with explicit progression instruction and Language check
            const forcedInstruction = `[SYSTEM_TRIGGER]: '${radioTopic}'에 대한 토론을 계속하세요. 현재 포커스: ${currentStageInfo.name}. 새로운 통찰로 나아가세요. 반드시 한국어로 대답하세요.`;

            const previousMessages = messages.map(m => ({
                role: m.speaker === 'user' ? 'user' : 'assistant',
                content: `${m.speaker === 'facilitator' ? '[FACILITATOR]: ' : m.speaker === 'coach' ? '[COACH]: ' : ''}${m.content} `
            }));

            await fetchChatResponse(systemPrompt, forcedInstruction, previousMessages);

        } catch (e) {
            console.error("Radio Loop Error:", e);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    };

    const generateOpeningRemarks = async (topic: string) => {
        setIsFetching(true);
        setIsLoading(true);
        try {
            // [Data Prep]
            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const systemPrompt = `
                [역할 정의]
                당신은 스타트업 창업자(${userName})를 위한 "3인 협업 퍼실리테이션 세션"을 시뮬레이션하고 있습니다. 반드시 한국어(Korean)로 대답하세요.

                역할:
                1. [진행자] (The Mirror):
                   - 목표: 사용자의 "관점 수준"을 높임 (생존 -> 전략 -> 비전 -> 본질).
                   - 행동: 질문을 그대로 전달하지 마세요. 사용자가 자신의 깊은 의도나 불안을 인식하게 만드는 "성찰적 질문"을 하세요.
                   - 톤: 따뜻하고 통찰력 있으며, 자기 성찰을 돕는 말투.
                
                2. [코치] (The Navigator):
                   - 목표: "사주(Saju)"를 고정된 운명이 아닌, 자유 의지를 위한 "상업적 에너지 자원"으로 해석하세요.
                   - 행동: "전략적 선택지"를 제공하세요. 결과를 예측하는 대신, 현재의 에너지를 어떻게 활용할 수 있는지 설명하세요.
                   - 톤: 예리하고 분석적이며, 힘을 실어주는 말투.

                [목표]
                사용자가 세션을 시작했습니다.
                [진행자]: 사용자를 환영하세요. 현재 상태를 감지하고, [코치]에게 사용자의 "창업 에너지"를 분석하여 잠재력을 실현하도록 도와달라고 하세요.
                [코치]: 사주 데이터를 분석하세요. 이를 사용자가 휘두를 수 있는 '도구'로 프레임화하세요. 이 에너지를 어떻게 사용하고 싶은지 물어보세요.

                [형식]
                ::: FACILITATOR:::
                (환영 및 성찰적 오프닝)
                ::: COACH:::
                (에너지 자원 분석 및 전략적 선택지 제시)
                
                * JSON이나 ':::DATA_SEPARATOR:::'를 출력하지 마세요. 오직 대화만 출력하세요. 한국어만 사용하세요.
            `;

            await fetchChatResponse(systemPrompt, `[SYSTEM_TRIGGER]: '${topic}'에 대한 라디오 세션을 시작하세요.`, []);

        } catch (e) {
            console.error(e);
            setMessages([{ id: '1', speaker: 'facilitator', content: '연결 오류가 발생했습니다.', timestamp: new Date() }]);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    };

    // Helper for API Call (Refactored to avoid duplication)
    const fetchChatResponse = async (sysPrompt: string, userMsg: string, prevMsgs: any[]) => {
        try {
            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: reportData?.userName ? `facility - ${reportData.userName} ` : 'facility-guest',
                    userName: userName,
                    message: userMsg,
                    messages: [{ role: 'system', content: sysPrompt }, ...prevMsgs],
                    stage: 1,
                    clientTimestamp: new Date().toISOString(),
                    birthDate: reportData?.birthDate,
                    birthTime: reportData?.birthTime,
                    gender: reportData?.gender,
                    userSaju: {
                        birthDate: reportData?.birthDate,
                        birthTime: reportData?.birthTime,
                        gender: reportData?.gender
                    },
                    sajuData: userSaju
                })
            });

            // ... (rest of function) ...


            if (!response.ok) throw new Error('API Error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullContent += decoder.decode(value, { stream: true });
                }
            }

            // Parsing Logic (Safe Filter for Data Separators)
            // Remove any potential backend-injected JSON data
            const cleanContent = fullContent.split(':::DATA_SEPARATOR:::')[0];

            const facilitatorMatch = cleanContent.split(':::FACILITATOR:::')[1]?.split(':::COACH:::')[0]?.trim();
            const coachMatch = cleanContent.split(':::COACH:::')[1]?.trim();

            // Sequential Display and Audio Triggering
            if (facilitatorMatch) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    speaker: 'facilitator',
                    content: facilitatorMatch,
                    timestamp: new Date()
                }]);

                const textToSpeak = facilitatorMatch
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\[.*?\]/g, '')
                    .trim();

                // Await until facilitator finishes speaking before showing the next bubble
                await speak(textToSpeak, 'facilitator', { interrupt: false });
            }

            if (coachMatch) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    speaker: 'coach',
                    content: coachMatch,
                    timestamp: new Date()
                }]);

                const textToSpeak = coachMatch
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\[.*?\]/g, '')
                    .trim();

                // Await until coach finishes speaking
                await speak(textToSpeak, 'coach', { interrupt: false });
            }

        } catch (e) {
            console.error(e);
            // Fallback
            setMessages([
                {
                    id: '1',
                    speaker: 'facilitator',
                    content: '안녕하세요! 진행을 맡은 AI입니다. 바로 코치님 연결해드리겠습니다.',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    };

    // [AI Integration] Real Chat Logic
    const handleUserMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const userMsgContent = userInput;
        const newUserMessage: Message = {
            id: Date.now().toString(),
            speaker: 'user',
            content: userMsgContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsFetching(true);
        setIsLoading(true);
        stopVoice(); // Stop any ongoing speech

        try {
            // [System Prompt] 3-Way Facilitation - ENGAGING & STORY-DRIVEN
            const systemPrompt = `
[CRITICAL MISSION]
You are NOT a generic advisor. You are a LIVE RADIO SHOW with two distinct voices creating an ADDICTIVE, STORY-DRIVEN coaching experience.

[CHARACTER PROFILES]

1. **FACILITATOR (The Provocateur)**
   - PERSONALITY: Sharp, curious, skeptical. Like a great journalist who won't accept surface answers.
   - NEVER says: "좋은 질문입니다" (boring filler)
   - INSTEAD: Uses CONCRETE scenarios from the user's life
   - Example: "지난주에 당신이 가장 화났던 순간을 떠올려보세요. 그때 상대방이 뭐라고 했나요? 그게 왜 당신을 건드렸을까요?"
   - ROLE: Challenge assumptions, dig deeper, connect dots the user hasn't seen

2. **COACH (The Pattern Decoder)**
   - PERSONALITY: Insightful storyteller who uses REAL EXAMPLES from history/business
   - NEVER says: "사주의 원리로 보면..." (abstract theory)
   - INSTEAD: "스티브 잡스도 당신과 비슷한 사주 패턴을 가졌어요. 그는 이 에너지를 이렇게 활용했죠..."
   - USES: Concrete metaphors (not "균형" but "당신의 엔진은 6기통 중 2개만 돌아가고 있어요")
   - GIVES: ONE specific action, not vague advice

[DIALOGUE RULES]

✅ DO:
- Use the user's ACTUAL WORDS back at them ("당신이 '힘들다'고 했는데, 정확히 어떤 힘듦인가요?")
- Tell mini-stories (30 seconds max) about real people/companies
- Ask questions that trigger PHYSICAL memories ("그때 가슴이 답답했나요? 머리가 복잡했나요?")
- Give ONE clear next step ("오늘 저녁, 당신이 가장 신뢰하는 사람 한 명에게 이 질문을 던져보세요: ...")

❌ DON'T:
- Repeat "좋은 질문입니다" / "정확한 지적입니다" (BANNED PHRASES)
- Use abstract concepts without examples
- Give 3+ action items (overwhelming)
- Talk about "균형" / "조화" without concrete imagery

[OUTPUT FORMAT]
:::FACILITATOR:::
(Sharp question OR concrete scenario from user's life)

:::COACH:::
(Mini-story OR specific pattern + ONE action)

[EXAMPLE OF GOOD DIALOGUE]

User: "팀원들이 제 말을 안 들어요."

:::FACILITATOR:::
어제 회의에서 당신이 아이디어를 냈을 때, 팀원들의 표정을 기억하세요? 그들이 고개를 끄덕였나요, 아니면 눈을 피했나요? 그 순간 당신은 뭐라고 말했죠?

:::COACH:::
당신의 사주를 보면, 당신은 '결론'을 먼저 말하는 사람이에요. 마치 책의 마지막 장을 먼저 보여주는 거죠. 하지만 팀원들은 '과정'을 원해요. 넷플릭스 CEO 리드 헤이스팅스도 비슷한 패턴이었는데, 그는 이렇게 바꿨어요: 결론 전에 "내가 왜 이 생각을 하게 됐는지 30초만 들어줘"라고 먼저 말했죠. 내일 회의 때 딱 한 번만 시도해보세요.

[CRITICAL]
- NO JSON, NO :::DATA_SEPARATOR:::, NO metadata
- ONLY pure, engaging dialogue
- Make the user think "와, 이거 나한테 하는 말이네" every 30 seconds
            `;

            // Prepare context
            const previousMessages = messages.map(m => ({
                role: m.speaker === 'user' ? 'user' : 'assistant',
                content: `${m.speaker === 'facilitator' ? '[FACILITATOR]: ' : m.speaker === 'coach' ? '[COACH]: ' : ''}${m.content} `
            }));

            // [Data Prep]
            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: reportData?.userName ? `facility - ${reportData.userName} ` : 'facility-guest',
                    userName: userName,
                    message: `[SYSTEM_INSTRUCTION]: ${systemPrompt} \n\n[USER_INPUT]: ${userMsgContent} `,
                    messages: previousMessages,
                    stage: 1,
                    clientTimestamp: new Date().toISOString(),
                    // [Real Data Injection]
                    birthDate: reportData?.birthDate,
                    birthTime: reportData?.birthTime,
                    gender: reportData?.gender,
                    userSaju: {
                        birthDate: reportData?.birthDate,
                        birthTime: reportData?.birthTime,
                        gender: reportData?.gender
                    },
                    sajuData: userSaju
                })
            });

            if (!response.ok) throw new Error('API Error');

            // [Stream Handling & Parsing]
            // Ideally we stream, but for script parsing, full buffering is safer for now to ensure we split correctly.
            // But let's try reading the stream to build the full text first.
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fullContent += decoder.decode(value, { stream: true });
                }
            }

            // [Script Parsing Protocol]
            // Expected format options:
            // 1. :::FACILITATOR::: ... :::COACH::: ...
            // 2. :::COACH::: ... (Direct answer)
            // 3. Just text (Fallback to Facilitator)

            // Remove any potential backend-injected JSON data
            const cleanContent = fullContent.split(':::DATA_SEPARATOR:::')[0];

            const facilitatorMatch = cleanContent.split(':::FACILITATOR:::')[1]?.split(':::COACH:::')[0]?.trim();
            const coachMatch = cleanContent.split(':::COACH:::')[1]?.trim();

            // Fallback Logic if AI ignores format
            let facilitatorText = facilitatorMatch;
            let coachText = coachMatch;

            if (!facilitatorText && !coachText) {
                // Determine who should speak based on content or random
                if (fullContent.includes("명리학") || fullContent.includes("운세") || fullContent.includes("전략")) {
                    coachText = fullContent;
                } else {
                    facilitatorText = fullContent;
                }
            }

            // [Display Logic] Sequential Display synced with Audio
            if (facilitatorText) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    speaker: 'facilitator',
                    content: facilitatorText,
                    timestamp: new Date()
                }]);

                const textToSpeak = facilitatorText
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\[.*?\]/g, '')
                    .trim();

                await speak(textToSpeak, 'facilitator', { interrupt: false });
            }

            if (coachText) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    speaker: 'coach',
                    content: coachText,
                    timestamp: new Date()
                }]);

                const textToSpeak = coachText
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\[.*?\]/g, '')
                    .trim();

                await speak(textToSpeak, 'coach', { interrupt: false });
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                speaker: 'facilitator',
                content: '죄송합니다. 통신 상태가 좋지 않아 답변을 가져오지 못했습니다. 다시 말씀해 주시겠습니까?',
                timestamp: new Date()
            }]);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    };

    const getSpeakerInfo = (speaker: Message['speaker']) => {
        switch (speaker) {
            case 'facilitator':
                return {
                    name: '진행자',
                    icon: 'record_voice_over',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    textColor: 'text-blue-400'
                };
            case 'coach':
                return {
                    name: 'AI 코치',
                    icon: 'psychology',
                    color: 'from-purple-500 to-pink-500',
                    bgColor: 'bg-purple-500/10',
                    textColor: 'text-purple-400'
                };
            case 'user':
                return {
                    name: '나',
                    icon: 'person',
                    color: 'from-emerald-500 to-teal-500',
                    bgColor: 'bg-emerald-500/10',
                    textColor: 'text-emerald-400'
                };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/startup')}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="text-sm font-medium">대시보드로</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
                            <span className="material-symbols-outlined text-white text-2xl">groups</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight text-white">팀 퍼실리테이션 <span className="ml-2 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">LIVE AI</span></h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">3-Way Coaching Session</p>
                        </div>
                    </div>
                    <div className="w-24"></div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-10 mb-20 md:mb-0">
                {!isSessionActive ? (
                    // Start Screen
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-8"
                    >
                        <div className="inline-flex items-center justify-center size-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                            <span className="material-symbols-outlined text-6xl text-purple-400">groups</span>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white">3자 토론 코칭 세션</h2>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                진행자와 AI 코치가 대화를 나누는 동안, 언제든지 끼어들어 질문하고 토론할 수 있습니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                                <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 mx-auto">
                                    <span className="material-symbols-outlined">record_voice_over</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">진행자</h3>
                                <p className="text-sm text-slate-400">대화 흐름을 조율하고 핵심 주제를 제시합니다</p>
                            </div>
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                                <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 mx-auto">
                                    <span className="material-symbols-outlined">psychology</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">AI 코치</h3>
                                <p className="text-sm text-slate-400">사주 기반 전문가 조언과 전략을 제공합니다</p>
                            </div>
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-xl">
                                <div className="size-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 mx-auto">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <h3 className="text-white font-bold mb-2">나 (사용자)</h3>
                                <p className="text-sm text-slate-400">언제든지 끼어들어 질문하고 의견을 나눕니다</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white/90">토론 주제를 선택하세요</h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                {[
                                    { id: 'vision', label: '비전 & 전략', icon: 'flag' },
                                    { id: 'mental', label: '멘탈 & 불안', icon: 'psychology' },
                                    { id: 'HR', label: '조직 & 리더십', icon: 'groups' },
                                    { id: 'market', label: '시장 & 경쟁', icon: 'trending_up' }
                                ].map((topic) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => startSession(topic.label)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-xl transition-all flex flex-col items-center gap-2 min-w-[120px]"
                                    >
                                        <span className="material-symbols-outlined text-purple-400">{topic.icon}</span>
                                        <span className="text-white font-bold">{topic.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-8">
                            * 세션이 시작되면 AI들이 자동으로 토론을 이어갑니다. <br />
                            듣고 계시다가 언제든 <b>"잠깐만요"</b> 하고 끼어드실 수 있습니다.
                        </p>
                    </motion.div>
                ) : (
                    // Chat Interface
                    <div className="space-y-6">
                        {/* Messages */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 h-[50vh] md:h-[600px] overflow-y-auto custom-scrollbar">
                            <AnimatePresence>
                                {messages.map((message) => {
                                    const speakerInfo = getSpeakerInfo(message.speaker);
                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mb-6 flex gap-3 md:gap-4 ${message.speaker === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`flex-shrink-0 size-10 md:size-12 rounded-xl bg-gradient-to-br ${speakerInfo.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                                                <span className="material-symbols-outlined text-white text-xl md:text-2xl">{speakerInfo.icon}</span>
                                            </div>
                                            <div className={`flex-1 min-w-0 ${message.speaker === 'user' ? 'text-right' : ''}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs md:text-sm font-bold ${speakerInfo.textColor}`}>{speakerInfo.name}</span>
                                                    <span className="text-[10px] md:text-xs text-slate-500">
                                                        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={`inline-block ${speakerInfo.bgColor} border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 max-w-[90%] md:max-w-2xl text-left shadow-inner`}>
                                                    <p className="text-sm md:text-base text-white leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 flex gap-4"
                                    >
                                        <div className="flex-shrink-0 size-12 rounded-xl bg-white/5 flex items-center justify-center animate-pulse">
                                            <span className="material-symbols-outlined text-white/20">more_horiz</span>
                                        </div>
                                        <div className="flex items-center items-center h-12 text-slate-500 text-sm">
                                            AI가 답변을 생성하고 있습니다...
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        {canInterrupt && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-emerald-400 animate-pulse text-xl">mic</span>
                                    <span className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-tighter">언제든지 끼어들어 질문하세요</span>
                                </div>
                                <div className="flex gap-2 md:gap-3">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                                        placeholder="질문 입력..."
                                        disabled={isFetching}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        onClick={handleUserMessage}
                                        disabled={!userInput.trim() || isFetching}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-xl">send</span>
                                        <span className="hidden md:inline">전송</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )
                }
            </main >
        </div >
    );
}
