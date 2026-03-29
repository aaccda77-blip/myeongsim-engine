'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saju60Data, GapjaModule, detectUserState, injectMyeongsimPlugin } from '@/modules/saju60Modules';

type SystemState = 'DARK' | 'NEURAL' | 'META' | 'IDLE';

interface Message {
    id: string;
    sender: 'user' | 'master';
    text: string;
    state?: SystemState;
    isSystemPrompt?: boolean;
}

export default function MasterCoreChatTester() {
    // Default to first item in saju60Data
    const [selectedGapjaId, setSelectedGapjaId] = useState<string>(saju60Data[0].id);
    const [currentState, setCurrentState] = useState<SystemState>('IDLE');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'master', text: '환영합니다. 명심(明心) 마스터 네트워크에 연결되었습니다.\n현재 당신의 신경망 베이스(기질)를 선택하고 대화를 시작해 보십시오.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showPromptPanel, setShowPromptPanel] = useState(false);
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
        setCurrentState('IDLE'); // Reset slightly to show transition

        // Mock Server Delay Processing
        setTimeout(() => {
            // 1. 상태 판별기 (Node A) 호출
            const detectedState = detectUserState(userMsg.text);
            setCurrentState(detectedState);
            
            // 2. 프롬프트 인젝터 (Node B) 호출
            const generatedSystemPrompt = injectMyeongsimPlugin(userMsg.text, selectedGapjaId);
            
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
            setShowPromptPanel(true); // 강조 효과를 위해
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const selectedModule = saju60Data.find(d => d.id === selectedGapjaId) || saju60Data[0];

    // State Indicator Colors
    const stateColors = {
        DARK: 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/50 bg-red-950/20',
        NEURAL: 'text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-500/50 bg-blue-950/20',
        META: 'text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-500/50 bg-emerald-950/20',
        IDLE: 'text-gray-500 border-gray-700/50 bg-gray-900/20'
    };

    return (
        <div className="flex flex-col h-screen bg-[#070A12] text-gray-200 font-sans mx-auto border-x border-gray-800/50 shadow-2xl relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>

            {/* --- Top Header & Config --- */}
            <header className="relative z-10 flex flex-col gap-3 p-4 border-b border-blue-900/40 bg-black/40 backdrop-blur-md">
                <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🌐</span>
                        <div>
                            <h1 className="text-sm font-bold text-blue-200">명심 마스터 라운지</h1>
                            <p className="text-[10px] text-blue-500/70 font-mono">Mock LLM Simulator v2.0</p>
                        </div>
                    </div>
                    {/* State Indicator */}
                    <div className={`transition-all duration-500 px-3 py-1.5 rounded-full border text-[10px] font-black font-mono tracking-widest flex items-center gap-2 ${stateColors[currentState]}`}>
                        <div className={`w-2 h-2 rounded-full ${currentState !== 'IDLE' ? 'animate-pulse' : ''} bg-current`}></div>
                        {currentState} STATE
                    </div>
                </div>

                {/* Gapja Selector */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 max-w-5xl mx-auto w-full">
                    {saju60Data.map(gapja => (
                        <button
                            key={gapja.id}
                            onClick={() => setSelectedGapjaId(gapja.id)}
                            className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                                selectedGapjaId === gapja.id 
                                ? 'bg-blue-900/40 border-blue-500/50 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                : 'bg-gray-900/30 border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <span className="font-bold">{gapja.name}</span>
                            <span className="text-[9px] opacity-70 mt-0.5">{gapja.id}</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* --- Chat Messages Area --- */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar-hide">
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
                                                msg.state === 'DARK' ? 'border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                                msg.state === 'META' ? 'border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                                'border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
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
                                        <div className={`text-[10px] mb-1 px-1 ${msg.sender === 'user' ? 'text-right text-gray-500' : 'text-left text-blue-400/70 font-mono'}`}>
                                            {msg.sender === 'user' ? 'USER' : `SOVEREIGN_MASTER // ${msg.state || 'SYSTEM'}`}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl break-keep text-[13px] leading-relaxed whitespace-pre-line ${
                                            msg.sender === 'user' 
                                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 border border-gray-700/50 rounded-tr-sm'
                                                : msg.state === 'DARK'
                                                    ? 'bg-[#1a0f12]/80 border border-red-900/40 text-red-200 rounded-tl-sm'
                                                    : msg.state === 'META'
                                                        ? 'bg-[#0f1a14]/80 border border-emerald-900/40 text-emerald-100 rounded-tl-sm'
                                                        : 'bg-[#0b101f]/80 border border-blue-900/30 text-blue-100 rounded-tl-sm'
                                        }`}>
                                            {msg.isSystemPrompt ? (
                                                <div className="font-mono text-xs opacity-90">
                                                    {msg.text.split('\n').map((line, i) => {
                                                        if(line.includes('[Mode:')) return <div key={i} className="text-yellow-400 font-bold mt-2">{line}</div>;
                                                        if(line.includes('[Target Protocol]')) return <div key={i} className="text-purple-400 font-bold mb-2">{line}</div>;
                                                        return <div key={i} className={line.startsWith('-') || line.startsWith('*') ? "pl-2" : ""}>{line}</div>;
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
                                    <div className="w-8 h-8 rounded-lg border border-blue-500/30 bg-black/50 flex items-center justify-center shrink-0">
                                        <span className="text-[10px] text-blue-400 font-bold">AI</span>
                                    </div>
                                    <div className="bg-[#0b101f]/80 border border-blue-900/30 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-11">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
                    <div className="flex items-end gap-2 bg-black/40 border border-gray-700 focus-within:border-blue-500/50 rounded-2xl p-2 transition-colors">
                        <textarea 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="메시지를 입력하여 노드 A 라우팅 반응 및 노드 B 프롬프트 렌더링을 테스트하세요."
                            className="flex-1 bg-transparent text-sm text-gray-200 resize-none outline-none max-h-32 min-h-[44px] px-2 py-3 scrollbar-hide"
                            rows={1}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white flex items-center justify-center transition-colors mb-0.5"
                        >
                            <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-center mt-3 flex justify-center gap-4">
                        <span className="text-[10px] text-red-500/70 border border-red-500/20 px-2 rounded opacity-50">DARK 트리거: 짜증, 화나</span>
                        <span className="text-[10px] text-blue-500/70 border border-blue-500/20 px-2 rounded opacity-50">NEURAL 트리거: 어떻게, 질문</span>
                        <span className="text-[10px] text-emerald-500/70 border border-emerald-500/20 px-2 rounded opacity-50">META 트리거: 좋아, 할수있</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
