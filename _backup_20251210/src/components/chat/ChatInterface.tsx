'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    onClose: () => void;
    currentStage?: number;
}

export default function ChatInterface({ onClose, currentStage = 1 }: ChatInterfaceProps) {
    const { reportData } = useReportStore();
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', role: 'assistant', content: `안녕하세요. ${currentStage}단계 코칭을 시작합니다. 어떤 이야기가 하고 싶으신가요?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Temporary User ID for demo
            const userId = '00000000-0000-0000-0000-000000000000';
            const stage = currentStage;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    message: userMsg.content,
                    stage,
                    sajuData: reportData?.saju
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Error: ${response.status} ${errText}`);
            }
            if (!response.body) throw new Error('No response body');

            // Streaming setup
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const botMsgId = (Date.now() + 1).toString();

            setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: '' }]);

            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                accumulatedText += text;

                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId ? { ...msg, content: accumulatedText } : msg
                ));
            }

        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
            setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: `[오류 발생] ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 w-[90vw] md:w-[400px] h-[600px] bg-gray-900 border border-primary-olive/30 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-md"
        >
            {/* Header */}
            <div className="p-4 bg-primary-olive/10 border-b border-primary-olive/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary-olive" />
                    <span className="font-bold text-white text-sm">명심코칭 AI</span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-primary-olive text-white rounded-tr-none'
                            : 'bg-white/10 text-gray-200 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-xl rounded-tl-none">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-primary-olive/20 flex flex-col gap-3">

                {/* End Session Button (Visible only if there are messages) */}
                {messages.length > 2 && (
                    <button
                        onClick={handleEndSession}
                        disabled={isLoading}
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg border border-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>✨ 상담 마무리 및 기억 저장하기</span>
                    </button>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-olive border border-gray-700 placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-primary-olive text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    async function handleEndSession() {
        if (!confirm('현재 상담 내용을 저장하고 마무리하시겠습니까?\nAI가 이 내용을 기억하여 다음 상담에 활용합니다.')) return;

        setIsLoading(true);
        try {
            // Temporary User (Demo)
            const userId = '00000000-0000-0000-0000-000000000000';
            const stage = currentStage;

            const res = await fetch('/api/chat/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, stage })
            });

            if (!res.ok) throw new Error('저장 실패');

            const data = await res.json();

            setMessages(prev => [...prev, {
                id: 'sys_end',
                role: 'assistant',
                content: `✅ 상담이 성공적으로 저장되었습니다.\n\n[AI 요약]\n${data.summary}\n\n이제 언제든 다시 오시면 이 내용을 기억하고 있을게요!`
            }]);

        } catch (e: any) {
            alert('저장 중 오류가 발생했습니다: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    }
}
