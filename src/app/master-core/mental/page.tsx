'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validMentalModules, detectMentalState, injectMentalPlugin } from '@/modules/mental64Router';

type SystemState = 'DARK_MODE' | 'NEURAL_HACKING' | 'META_SELF' | 'IDLE';

interface Message {
    id: string;
    sender: 'user' | 'master';
    text: string;
    state?: SystemState;
    isSystemPrompt?: boolean;
}

export default function MentalCoreSimulator() {
    // Default to first item in validMentalModules
    const [selectedCodeId, setSelectedCodeId] = useState<string>(
        validMentalModules.length > 0 ? validMentalModules[0].id : ''
    );
    const [currentState, setCurrentState] = useState<SystemState>('IDLE');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'master', text: '환영합니다. [Mental OS 64 코어] 테스트 룸에 연결되었습니다.\n현재 당신의 신경망 베이스(멘탈 코드)를 선택하고 대화를 시작해 보십시오.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        setCurrentState('IDLE');

        // Mock Server Delay Processing
        setTimeout(() => {
            // 1. 상태 판별기 (Node A) 호출
            const detectedState = detectMentalState(userMsg.text);
            setCurrentState(detectedState);
            
            // 2. 프롬프트 인젝터 (Node B) 호출
            const generatedSystemPrompt = injectMentalPlugin(selectedCodeId, detectedState);
            
            // 시뮬레이터를 위해 System Prompt 생성 결과를 챗봇 대답으로 직접 보여줍니다.
            const masterMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                sender: 'master', 
                text: "✨ [프롬프트 엔진 (Node B) 결과]\n다음은 LLM에게 전송될 고도로 조립된 시스템 지시어입니다:\n\n" + generatedSystemPrompt,
                state: detectedState,
                isSystemPrompt: true
            };
            setMessages(prev => [...prev, masterMsg]);
            setIsTyping(false);
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // State Indicator Colors
    const stateColors = {
        DARK_MODE: 'text-red-400 border-red-500/30 bg-red-950/40 shadow-neon-red text-neon-red',
        NEURAL_HACKING: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40 shadow-neon-cyan text-neon-cyan',
        META_SELF: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
        IDLE: 'text-gray-400 border-gray-800 bg-gray-900/40'
    };

    return (
        <div className="flex flex-col h-screen bg-[#070A12] text-gray-200 font-sans mx-auto border-x border-gray-800/50 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-0 animate-aura-breath"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none z-0 animate-aura-breath" style={{ animationDelay: '4s' }}></div>
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>

            {/* --- Top Header & Config --- */}
            <header className="relative z-10 flex flex-col gap-3 p-4 border-b border-[#a855f7]/20 bg-black/50 backdrop-blur-md shadow-neon-violet/10">
                <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🧬</span>
                        <div>
                            <h1 className="text-sm font-bold text-purple-300 text-neon-violet">명심 64 코어 라운지</h1>
                            <p className="text-[10px] text-purple-500/70 font-mono">Mental OS Simulator v1.0</p>
                        </div>
                    </div>
                    {/* State Indicator */}
                    <div className={`transition-all duration-500 px-3 py-1.5 rounded-full border text-[10px] font-black font-mono tracking-widest flex items-center gap-2 ${stateColors[currentState]}`}>
                        <div className={`w-2 h-2 rounded-full ${currentState !== 'IDLE' ? 'animate-pulse' : ''} bg-current`}></div>
                        {currentState} STATE
                    </div>
                </div>

                {/* Module Selector */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 max-w-5xl mx-auto w-full">
                    {validMentalModules.map(module => {
                        // 추출된 타이틀이 길 경우 앞의 코드 이름만 렌더링
                        const shortName = module.name.split(']')[1]?.trim().split(' ')[0] || module.id;
                        
                        return (
                            <button
                                key={module.id}
                                onClick={() => setSelectedCodeId(module.id)}
                                className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                                    selectedCodeId === module.id 
                                    ? 'bg-purple-900/40 border-purple-500/50 text-purple-300 shadow-neon-violet text-neon-violet' 
                                    : 'bg-gray-900/30 border-gray-800 text-gray-500 hover:text-gray-300'
                                }`}
                                title={module.name}
                            >
                                <span className="font-bold">{shortName}</span>
                                <span className="text-[9px] opacity-70 mt-0.5">{module.id}</span>
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* --- Chat Messages Area --- */}
            <main className="flex-1 overflow-y-auto gpu-accelerated p-4 space-y-6 relative z-10 scrollbar-hide">
                <div className="max-w-5xl mx-auto space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] lg:max-w-[70%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    
                                    {/* Avatar */}
                                    <div className="shrink-0 mt-1">
                                        {msg.sender === 'master' ? (
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border bg-black/50 ${
                                                msg.state === 'DARK_MODE' ? 'border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                                msg.state === 'META_SELF' ? 'border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                                'border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                            }`}>
                                                <span className="text-[10px] font-bold">AI</span>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center justify-center">
                                                <span className="text-[12px]">👤</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className="flex-1">
                                        <div className={`text-[10px] mb-1 px-1 ${msg.sender === 'user' ? 'text-right text-gray-500' : 'text-left text-purple-400/70 font-mono'}`}>
                                            {msg.sender === 'user' ? 'USER' : `SOVEREIGN_MASTER // ${msg.state || 'SYSTEM'}`}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl break-keep text-[13px] leading-relaxed whitespace-pre-line ${
                                            msg.sender === 'user' 
                                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 border border-gray-700/50 rounded-tr-sm'
                                                : msg.state === 'DARK_MODE'
                                                    ? 'bg-[#1a0f12]/80 border border-red-900/40 text-red-200 rounded-tl-sm'
                                                    : msg.state === 'META_SELF'
                                                        ? 'bg-[#0f1a14]/80 border border-emerald-900/40 text-emerald-100 rounded-tl-sm'
                                                        : 'bg-[#130b1f]/80 border border-purple-900/30 text-purple-100 rounded-tl-sm'
                                        }`}>
                                            {msg.isSystemPrompt ? (
                                                <div className="font-mono text-xs opacity-90">
                                                    {msg.text.split('\n').map((line, i) => {
                                                        if(line.includes('[상태 판별:')) return <div key={i} className="text-yellow-400 font-bold mt-2">{line}</div>;
                                                        if(line.includes('지시:')) return <div key={i} className="text-purple-400 font-bold mb-2 mt-4">{line}</div>;
                                                        return <div key={i} className={(line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) ? "pl-2 opacity-80" : ""}>{line}</div>;
                                                    })}
                                                </div>
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg border border-purple-500/30 bg-black/50 flex items-center justify-center shrink-0">
                                        <span className="text-[10px] text-purple-400 font-bold">AI</span>
                                    </div>
                                    <div className="bg-[#130b1f]/80 border border-purple-900/30 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-11">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* --- Input Area --- */}
            <footer className="relative z-10 p-4 border-t border-gray-800 bg-[#070A12]/90 backdrop-blur-md">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-end gap-2 bg-black/40 border border-gray-700 focus-within:border-purple-500/50 rounded-2xl p-2 transition-colors">
                        <textarea 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="당신의 현재 고민이나 감정을 편안하게 이야기해 보세요."
                            className="flex-1 bg-transparent text-sm text-gray-200 resize-none outline-none max-h-32 min-h-[44px] px-2 py-3 scrollbar-hide"
                            rows={1}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            className="w-10 h-10 shrink-0 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 text-white flex items-center justify-center transition-colors mb-0.5"
                        >
                            <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-center mt-3 flex flex-wrap justify-center gap-4">
                        <span className="text-[10px] text-red-500/70 border border-red-500/20 px-2 py-0.5 rounded-full opacity-60">
                            💡 예시: "너무 우울하고 포기하고 싶어"
                        </span>
                        <span className="text-[10px] text-blue-500/70 border border-blue-500/20 px-2 py-0.5 rounded-full opacity-60">
                            💡 예시: "이 문제를 어떻게 해결할 수 있을까?"
                        </span>
                        <span className="text-[10px] text-emerald-500/70 border border-emerald-500/20 px-2 py-0.5 rounded-full opacity-60">
                            💡 예시: "이제 내 운명의 주인이 될 거야!"
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
