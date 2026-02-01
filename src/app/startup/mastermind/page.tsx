'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    speaker: 'facilitator' | 'neuro' | 'psycho' | 'ux' | 'tech' | 'marketer' | 'user';
    content: string;
    timestamp: Date;
}

import { useReportStore } from '@/store/useReportStore';

export default function MastermindPage() {
    const router = useRouter();
    const { reportData } = useReportStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [canInterrupt, setCanInterrupt] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        await generateOpeningRemarks();
    };

    const generateOpeningRemarks = async () => {
        setIsLoading(true);
        try {
            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const systemPrompt = `
                [Role Definition]
                You are simulating a "Mastermind Group Consultation" (World-Class Expert Panel) for a startup founder (${userName}).
                
                The Panel (6 Personas):
                1. [FACILITATOR] (The Mirror): Coordinates, asks reflective questions. GOAL: Self-awareness.
                2. [NEURO] (Dr. Brain): Neuroscientist. Analyzes Saju as "Brain Structure/Dopamine".
                3. [PSYCHO] (Prof. Mind): Psychologist. Analyzes "Unconscious/Shadow".
                4. [UX] (Creative): UX Designer. Analyzes "Experience/Flow/Aesthetics".
                5. [TECH] (Tech Lead): Engineer. Analyzes "System/Structure/Logic".
                6. [MARKETER] (CMO): Marketer. Analyzes "Market/Expansion/Influence".

                [Goal]
                The User has just entered the room.
                [FACILITATOR] welcomes the user.
                The experts (Pick 2-3 suitable ones) immediately discuss the user's "Founding Energy" (Saju) among themselves.
                e.g., NEURO: "His Fire energy shows high impulse control issues but great creativity." -> MARKETER: "That's exactly why he needs a fandom strategy."

                [Format]
                :::FACILITATOR::: (Welcome)
                :::[ROLE]::: (Expert 1 Analysis)
                :::[ROLE]::: (Expert 2 Analysis)
                ...
                
                * Do NOT output JSON or ':::DATA_SEPARATOR:::'. Only Dialogue.
                * [ROLE] can be: NEURO, PSYCHO, UX, TECH, MARKETER.
            `;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: reportData?.userName ? `mastermind-${reportData.userName}` : 'mastermind-guest',
                    userName: userName,
                    message: `[SYSTEM_TRIGGER]: Start the Mastermind Session. Analyze my Saju.`,
                    messages: [{ role: 'system', content: systemPrompt }],
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

            parseAndAddMessages(fullContent);

        } catch (e) {
            console.error(e);
            setMessages([
                {
                    id: '1',
                    speaker: 'facilitator',
                    content: '전문가 패널을 연결하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    timestamp: new Date()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

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
            const systemPrompt = `
                [Role Definition]
                Simulating "Mastermind Group Consultation".
                
                Protocol (Socratic Method):
                1. [FACILITATOR] usually starts. Ask a "Maieutic Question" (Sanpasul) to raise the user's perspective (Meta-cognition).
                   - e.g., "Do you want to win a competition, or create a category?"
                2. [EXPERTS] (Pick 1-2 relevant to the user's question):
                   - [NEURO]: Biological/Brain perspective.
                   - [PSYCHO]: Emotional/Unconscious perspective.
                   - [UX]: Aesthetic/Experience perspective.
                   - [TECH]: Engineering/Structural perspective.
                   - [MARKETER]: Social/Market perspective.
                
                * Interpret Saju as "Energy Resources" for Free Will.
                * NEVER output JSON.

                [Format]
                :::FACILITATOR::: (Reflective Question)
                :::[ROLE]::: (Expert Insight)
                ...
            `;

            const previousMessages = messages.map(m => ({
                role: m.speaker === 'user' ? 'user' : 'assistant',
                content: `${m.speaker === 'user' ? '' : `[${m.speaker.toUpperCase()}]: `}${m.content}`
            }));

            const userName = reportData?.userName || '대표님';
            const userSaju = reportData?.saju || null;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: reportData?.userName ? `mastermind-${reportData.userName}` : 'mastermind-guest',
                    userName: userName,
                    message: `[SYSTEM_INSTRUCTION]: ${systemPrompt}\n\n[USER_INPUT]: ${userMsgContent}`,
                    messages: previousMessages,
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

            parseAndAddMessages(fullContent);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                speaker: 'facilitator',
                content: '잠시 통신 장애가 발생했습니다. 다시 말씀해 주시겠습니까?',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const parseAndAddMessages = (fullContent: string) => {
        const cleanContent = fullContent.split(':::DATA_SEPARATOR:::')[0];

        // Regex to split by :::ROLE:::
        const parts = cleanContent.split(/(:::[A-Z]+:::)/g).filter(p => p.trim());

        let delayedMs = 0;

        for (let i = 0; i < parts.length; i += 2) {
            const roleTag = parts[i];
            const content = parts[i + 1];

            if (!roleTag || !content) continue;

            const roleMap: Record<string, Message['speaker']> = {
                ':::FACILITATOR:::': 'facilitator',
                ':::NEURO:::': 'neuro',
                ':::PSYCHO:::': 'psycho',
                ':::UX:::': 'ux',
                ':::TECH:::': 'tech',
                ':::MARKETER:::': 'marketer'
            };

            const speaker = roleMap[roleTag] || 'facilitator';

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + Math.random(),
                    speaker,
                    content: content.trim(),
                    timestamp: new Date()
                }]);
            }, delayedMs);

            delayedMs += 1500; // Stagger messages
        }
    };

    const getSpeakerInfo = (speaker: Message['speaker']) => {
        switch (speaker) {
            case 'facilitator':
                return { name: '진행자 (Mirror)', icon: 'record_voice_over', color: 'from-slate-500 to-slate-700', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400' };
            case 'neuro':
                return { name: 'Dr. Brain (뇌과학)', icon: 'neurology', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-500/10', textColor: 'text-pink-400' };
            case 'psycho':
                return { name: 'Prof. Mind (심리)', icon: 'psychology_alt', color: 'from-indigo-500 to-violet-500', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-400' };
            case 'ux':
                return { name: 'Creative (UX)', icon: 'palette', color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-500/10', textColor: 'text-orange-400' };
            case 'tech':
                return { name: 'Tech Lead (구조)', icon: 'terminal', color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-500/10', textColor: 'text-cyan-400' };
            case 'marketer':
                return { name: 'CMO (확장)', icon: 'campaign', color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' };
            case 'user':
                return { name: '나', icon: 'person', color: 'from-white to-slate-200', bgColor: 'bg-white/10', textColor: 'text-white' };
            default:
                return { name: 'Unknown', icon: 'help', color: 'from-gray-500 to-gray-700', bgColor: 'bg-gray-500/10', textColor: 'text-gray-400' };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => router.push('/startup')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">대시보드</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-white text-2xl">diversity_3</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-white">Mastermind Group <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-2">PREMIUM</span></h1>
                            <p className="text-[10px] uppercase text-slate-400 font-bold">World-Class Expert Panel</p>
                        </div>
                    </div>
                    <div className="w-24"></div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {!isSessionActive ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
                        <div className="inline-flex items-center justify-center size-32 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                            <span className="material-symbols-outlined text-7xl text-indigo-400">diversity_3</span>
                        </div>
                        <h2 className="text-4xl font-black text-white">마스터마인드 그룹 코칭</h2>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                            뇌과학, 심리, 디자인, 기술, 마케팅 분야의 세계적 석학들이<br />
                            당신의 사주 에너지를 다각도로 분석하고 토론합니다.
                        </p>
                        <button onClick={startSession} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-12 py-5 rounded-xl font-bold text-xl shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-3 mx-auto">
                            <span className="material-symbols-outlined text-3xl">play_circle</span>
                            전문가 패널 입장하기
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[650px] overflow-y-auto">
                            <AnimatePresence>
                                {messages.map((message) => {
                                    const info = getSpeakerInfo(message.speaker);
                                    return (
                                        <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 flex gap-4 ${message.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`flex-shrink-0 size-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}>
                                                <span className="material-symbols-outlined text-white text-xl">{info.icon}</span>
                                            </div>
                                            <div className={`flex-1 ${message.speaker === 'user' ? 'text-right' : ''}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-sm font-bold ${info.textColor}`}>{info.name}</span>
                                                    <span className="text-xs text-slate-500">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`inline-block ${info.bgColor} border border-white/10 rounded-2xl px-6 py-4 max-w-2xl text-left`}>
                                                    <p className="text-white leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {isLoading && (
                                    <div className="text-center py-4 text-slate-500 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                        <span className="text-xs">전문가들이 토론 중입니다...</span>
                                    </div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                        {canInterrupt && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-3">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
                                    placeholder="토론에 끼어들어 질문하기..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                                    disabled={isLoading}
                                />
                                <button onClick={handleUserMessage} disabled={!userInput.trim() || isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-bold transition-all">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
