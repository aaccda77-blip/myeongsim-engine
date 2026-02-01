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

export default function FacilitationPage() {
    const router = useRouter();
    const { reportData } = useReportStore(); // [Store]
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [canInterrupt, setCanInterrupt] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // [Restored] Loading State
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const startSession = async () => {
        setIsSessionActive(true);
        setCanInterrupt(true);
        // [Auto-Trigger] Start with AI Analysis immediately
        await generateOpeningRemarks();
    };

    const generateOpeningRemarks = async () => {
        setIsLoading(true);
        try {
            const systemPrompt = `
                [Role Definition]
                You are simulating a "3-Way Facilitation Session".
                Roles:
                1. [FACILITATOR]: Warm leader. 
                2. [COACH]: Sharp, Saju-based (Bazi) strategist.

                [Goal]
                The User has just started the session. 
                [FACILITATOR] must welcome the user and immediately ask [COACH] to analyze the user's "Startup Luck" based on their Bazi.
                [COACH] must then give a detailed, preemptive analysis of their current startup luck and suggest a strategic direction using the provided Saju data.

                [Format]
                :::FACILITATOR:::
                (Welcome & Request to Coach)
                :::COACH:::
                (Preemptive Saju Analysis & Strategy)
            `;

            // [Data Prep]
            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: reportData?.userName ? `facility-${reportData.userName}` : 'facility-guest',
                    userName: userName,
                    message: `[SYSTEM_TRIGGER]: Start the session. Analyze my Saju for startup success.`,
                    messages: [{ role: 'system', content: systemPrompt }], // Context
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

            // Parsing Logic (Reuse or Refactor to shared function ideally, but keeping inline for safety)
            const facilitatorMatch = fullContent.split(':::FACILITATOR:::')[1]?.split(':::COACH:::')[0]?.trim();
            const coachMatch = fullContent.split(':::COACH:::')[1]?.trim();

            if (facilitatorMatch) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    speaker: 'facilitator',
                    content: facilitatorMatch,
                    timestamp: new Date()
                }]);
            }

            if (coachMatch) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        speaker: 'coach',
                        content: coachMatch!,
                        timestamp: new Date()
                    }]);
                }, 1500);
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
        setIsLoading(true);

        try {
            // [System Prompt] 3-Way Facilitation Persona
            const systemPrompt = `
                [Role Definition]
                You are simulating a "3-Way Facilitation Session" for a startup founder.
                You must act as TWO distinct personas:
                1. [FACILITATOR]: Coordinates the discussion, asks clarifying questions, and ensures the user feels heard. Warm and professional tone.
                2. [COACH]: Provides sharp, Saju-based (bazi), and strategic business advice. Analytical, authoritative, but supportive tone.

                [Output Format]
                You MUST format your response as a script using these exact headers:
                :::FACILITATOR:::
                (Content for facilitator)
                :::COACH:::
                (Content for coach)
                
                [Instructions]
                - If the user asks a question, [FACILITATOR] should acknowledge it and pass it to [COACH].
                - [COACH] should give a detailed answer based on business strategy + Saju principles (simulated if no data).
                - Sometimes [FACILITATOR] can summarize or ask the user a follow-up question after [COACH] speaks.
                - Keep the conversation dynamic and engaging.
            `;

            // Prepare context
            const previousMessages = messages.map(m => ({
                role: m.speaker === 'user' ? 'user' : 'assistant',
                content: `${m.speaker === 'facilitator' ? '[FACILITATOR]: ' : m.speaker === 'coach' ? '[COACH]: ' : ''}${m.content}`
            }));

            // [Data Prep]
            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: reportData?.userName ? `facility-${reportData.userName}` : 'facility-guest',
                    userName: userName,
                    message: `[SYSTEM_INSTRUCTION]: ${systemPrompt}\n\n[USER_INPUT]: ${userMsgContent}`,
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

            const facilitatorMatch = fullContent.split(':::FACILITATOR:::')[1]?.split(':::COACH:::')[0]?.trim();
            const coachMatch = fullContent.split(':::COACH:::')[1]?.trim();

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

            // [Display Logic] Sequential Display
            if (facilitatorText) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    speaker: 'facilitator',
                    content: facilitatorText!,
                    timestamp: new Date()
                }]);
            }

            if (coachText) {
                // Delay for Coach to simulate thinking/listening to facilitator
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        speaker: 'coach',
                        content: coachText!,
                        timestamp: new Date()
                    }]);
                }, facilitatorText ? 1500 : 0); // Short delay if Facilitator spoke first
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

            <main className="max-w-5xl mx-auto px-6 py-10">
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

                        <button
                            onClick={startSession}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-12 py-5 rounded-xl font-bold text-xl shadow-xl shadow-purple-500/20 transition-all flex items-center gap-3 mx-auto"
                        >
                            <span className="material-symbols-outlined text-3xl">play_arrow</span>
                            세션 시작하기
                        </button>
                    </motion.div>
                ) : (
                    // Chat Interface
                    <div className="space-y-6">
                        {/* Messages */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] overflow-y-auto">
                            <AnimatePresence>
                                {messages.map((message) => {
                                    const speakerInfo = getSpeakerInfo(message.speaker);
                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mb-6 flex gap-4 ${message.speaker === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`flex-shrink-0 size-12 rounded-xl bg-gradient-to-br ${speakerInfo.color} flex items-center justify-center shadow-lg`}>
                                                <span className="material-symbols-outlined text-white">{speakerInfo.icon}</span>
                                            </div>
                                            <div className={`flex-1 ${message.speaker === 'user' ? 'text-right' : ''}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-sm font-bold ${speakerInfo.textColor}`}>{speakerInfo.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={`inline-block ${speakerInfo.bgColor} border border-white/10 rounded-2xl px-6 py-4 max-w-2xl text-left`}>
                                                    <p className="text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
                                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-emerald-400 animate-pulse">mic</span>
                                    <span className="text-sm font-bold text-emerald-400">언제든지 끼어들어 질문하세요</span>
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                                        placeholder="질문이나 의견을 입력하세요..."
                                        disabled={isLoading}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        onClick={handleUserMessage}
                                        disabled={!userInput.trim() || isLoading}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                        전송
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
