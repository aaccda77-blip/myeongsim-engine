'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MyeongsimChatProps {
    userId?: string;
}

export default function MyeongsimChat({ userId = 'guest-id' }: MyeongsimChatProps) {
    // Vercel AI SDK 연동 (앞선 /api/myeongsim-chat 백엔드 사용)
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/myeongsim-chat',
        body: { userId } // 백엔드로 사용자 ID 전송 (컨텍스트 주입 용도)
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 자동 스크롤
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!input.trim() || isLoading) return;
        handleSubmit(e);
    };

    return (
        <div className="flex flex-col h-[600px] max-h-[85vh] w-full max-w-2xl bg-[#0d131a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-sans relative">
            {/* Header */}
            <header className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-olive/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-olive" />
                </div>
                <div>
                    <h2 className="text-white font-bold text-lg tracking-tight">명심코칭 AI</h2>
                    <p className="text-gray-400 text-xs">나만의 기질과 현재 상태를 반영한 맞춤 코칭</p>
                </div>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar relative min-h-0">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                        <Sparkles className="w-8 h-8 text-primary-olive mb-2" />
                        <p className="text-sm text-gray-300">
                            안녕하세요!<br />
                            온보딩에서 남겨주신 소중한 데이터를 바탕으로<br />
                            당신만을 위한 맞춤형 대화를 준비했습니다.
                        </p>
                        <p className="text-xs text-gray-500">아래 입력창에 첫 고민을 남겨주세요.</p>
                    </div>
                )}

                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-blue-500/20' : 'bg-primary-olive/20'}`}>
                            {m.role === 'user' ? <User className="w-4 h-4 text-blue-400" /> : <Sparkles className="w-4 h-4 text-primary-olive" />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                            ? 'bg-[#1e40af] text-white rounded-tr-sm'
                            : 'bg-white/10 border border-white/5 text-gray-200 rounded-tl-sm'
                            }`}>
                            {m.content.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 shrink-0 rounded-full bg-primary-olive/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary-olive animate-pulse" />
                        </div>
                        <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="p-4 border-t border-white/10 bg-[#0a0f14] shrink-0">
                <div className="relative flex items-end">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                // Trigger form submit programmatically
                                if (input.trim() && !isLoading) {
                                    e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            }
                        }}
                        placeholder="메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-gray-600 outline-none focus:border-primary-olive/50 transition-colors resize-none overflow-y-auto no-scrollbar"
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-2 w-8 h-8 bg-primary-olive hover:bg-[#6e944b] text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-olive"
                    >
                        <Send className="w-4 h-4 -ml-0.5 mt-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
