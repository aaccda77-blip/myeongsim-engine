import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DeepDiveStep = 'SOCRATIC' | 'RECURSIVE' | 'META' | 'QUEST_ASSIGNED';

interface MyeongsimProps {
    initialData: {
        sajuCode: string;
        darkCode: string;
        firstQuestion: string;
    };
    onComplete: (summaryData: any) => void;
    onClose: () => void;
}

export default function MyeongsimSecretRoom({ initialData, onComplete, onClose }: MyeongsimProps) {
    const [currentStep, setCurrentStep] = useState<DeepDiveStep>('SOCRATIC');
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [internalChat, setInternalChat] = useState<{ role: string, content: string }[]>([
        { role: 'assistant', content: initialData.firstQuestion || "어떤 감정이 당신을 이곳으로 이끌었나요?" }
    ]);

    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // Auto-scroll inside chat
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [internalChat]);

    const handleUserSubmit = async () => {
        if (!inputValue.trim() || isTyping) return;

        const newHistory = [...internalChat, { role: 'user', content: inputValue }];
        setInternalChat(newHistory);
        setInputValue('');
        setIsTyping(true);

        try {
            let nextStep: DeepDiveStep;
            if (currentStep === 'SOCRATIC') nextStep = 'RECURSIVE';
            else if (currentStep === 'RECURSIVE') nextStep = 'META';
            else if (currentStep === 'META') nextStep = 'QUEST_ASSIGNED';
            else return;

            const response = await fetch('/api/myeongsim-coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetStep: nextStep,
                    history: newHistory,
                    sajuCode: initialData.sajuCode,
                    darkCode: initialData.darkCode
                }),
            });

            const data = await response.json();

            setInternalChat(prev => [...prev, { role: 'assistant', content: data.reply }]);
            setCurrentStep(nextStep);

        } catch (error) {
            console.error('명심코칭 엔진 오류:', error);
            setInternalChat(prev => [...prev, { role: 'assistant', content: "심해의 기류가 불안정합니다. 당신의 고통이 너무 강렬합니다. 잠시 후 다시 시도해주세요." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFinish = () => {
        onComplete({
            type: 'myeongsim_summary',
            text: `[명심코칭 완료] 사용자가 다크 코드(${initialData.darkCode}) 연금술을 통해 새로운 Shift 퀘스트를 수락했습니다.`
        });
    };

    // 1/3, 2/3, 3/3 Text
    const getDepthText = () => {
        if (currentStep === 'SOCRATIC') return '1/3 - 표면 분리';
        if (currentStep === 'RECURSIVE') return '2/3 - 심연 탐색';
        if (currentStep === 'META') return '3/3 - 메타 인지';
        return 'COMPLETE - 수면 부상';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <div className="flex flex-col w-full max-w-lg h-[600px] bg-[#0A0F1A] text-[#E2E8F0] rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.1)] border border-cyan-900/50 relative overflow-hidden">

                {/* Background Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900 via-transparent to-transparent" />

                {/* Header */}
                <div className="z-10 flex justify-between items-center p-5 border-b border-cyan-900/30">
                    <span className="font-semibold tracking-wider text-sm text-cyan-200/80">
                        명심코칭 3S 비밀 상담실
                    </span>
                    <span className="font-mono text-cyan-400 text-xs">
                        DEPTH: {getDepthText()}
                    </span>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>

                {/* Chat Area */}
                <div className="z-10 flex-1 overflow-y-auto flex flex-col gap-4 p-5 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                    <AnimatePresence>
                        {internalChat.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed ${msg.role === 'user'
                                        ? 'bg-cyan-950/60 self-end text-cyan-50'
                                        : 'bg-[#131B2B] self-start border border-cyan-900/30 text-slate-300'
                                    }`}
                            >
                                {msg.content}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-cyan-500/50 text-sm italic py-2"
                        >
                            다크 코드를 분석하고 있습니다...
                        </motion.div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Quest Assigned Action */}
                <AnimatePresence>
                    {currentStep === 'QUEST_ASSIGNED' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 border-t border-cyan-900/30 bg-[#0A0F1A]"
                        >
                            <button onClick={handleFinish} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-cyan-500/20">
                                수면 위로 부상하기 (퀘스트 수락)
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Area */}
                {currentStep !== 'QUEST_ASSIGNED' && (
                    <div className="z-10 flex gap-3 p-4 bg-[#0A0F1A] border-t border-cyan-900/30">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
                            placeholder="내면의 관찰자가 되어 적어보세요..."
                            className="flex-1 bg-[#131B2B] border border-cyan-900/50 rounded-xl px-5 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                        />
                        <button
                            onClick={handleUserSubmit}
                            disabled={isTyping || !inputValue.trim()}
                            className="bg-cyan-700/80 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-bold transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
