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

export default function FacilitationPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [canInterrupt, setCanInterrupt] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startSession = () => {
        setIsSessionActive(true);
        setMessages([
            {
                id: '1',
                speaker: 'facilitator',
                content: '안녕하세요! 오늘 창업 전략 토론 세션을 시작하겠습니다. 저는 진행자 역할을 맡은 AI입니다.',
                timestamp: new Date()
            },
            {
                id: '2',
                speaker: 'coach',
                content: '반갑습니다. 저는 사주 기반 창업 전문 코치입니다. 오늘은 회원님의 창업 아이템과 전략에 대해 심도 있게 논의하겠습니다.',
                timestamp: new Date()
            },
            {
                id: '3',
                speaker: 'facilitator',
                content: '먼저, 회원님의 사주 분석 결과를 바탕으로 AI 코치님께서 초기 진단을 해주시겠습니다. 언제든지 궁금한 점이나 의견이 있으시면 아래 입력창으로 끼어드실 수 있습니다.',
                timestamp: new Date()
            }
        ]);
        setCanInterrupt(true);
    };

    const handleUserMessage = () => {
        if (!userInput.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            speaker: 'user',
            content: userInput,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');

        // AI 응답 시뮬레이션
        setTimeout(() => {
            const facilitatorResponse: Message = {
                id: (Date.now() + 1).toString(),
                speaker: 'facilitator',
                content: '좋은 질문입니다. AI 코치님, 이 부분에 대해 설명해 주시겠습니까?',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, facilitatorResponse]);
        }, 1000);

        setTimeout(() => {
            const coachResponse: Message = {
                id: (Date.now() + 2).toString(),
                speaker: 'coach',
                content: `"${userInput}"에 대해 말씀드리겠습니다. 회원님의 사주를 보면, 이 부분은 매우 중요한 포인트입니다. 구체적으로...`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, coachResponse]);
        }, 3000);
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
                            <h1 className="text-lg font-extrabold tracking-tight text-white">팀 퍼실리테이션</h1>
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
                                                <div className={`inline-block ${speakerInfo.bgColor} border border-white/10 rounded-2xl px-6 py-4 max-w-2xl`}>
                                                    <p className="text-white leading-relaxed">{message.content}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
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
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                    <button
                                        onClick={handleUserMessage}
                                        disabled={!userInput.trim()}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
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
