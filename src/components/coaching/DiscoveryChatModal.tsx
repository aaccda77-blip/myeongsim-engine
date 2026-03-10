import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { useReportStore } from '@/store/useReportStore';
import { DAY_MASTER_SCENARIOS } from '../../data/SajuContentDB';
// import { getDayMasterContent } from '../../data/myeongsimData'; // Optional helper if needed

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    text: string;
    choices?: string[];
}

interface DiscoveryChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    // userProfile prop is OPTIONAL now, we prefer the Store
    userProfile?: any;
    initialIntent?: string;
    title?: string;
    onConvertToMainChat?: (summary: string) => void;
}

export default function DiscoveryChatModal({
    isOpen,
    onClose,
    userProfile: propProfile,
    initialIntent = '108_awareness',
    title = '내면의 빛 탐구',
    onConvertToMainChat
}: DiscoveryChatModalProps) {
    // [Architecture Change] Use Store as Primary Source
    const { reportData: storeProfile } = useReportStore();
    const activeProfile = propProfile || storeProfile;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // [Data Diagnosis]
    const hasData = !!activeProfile;

    // [Logic] Extract Day Master cleanly
    const getDayMasterChar = (profile: any): string | null => {
        if (!profile?.saju) return null;

        let extracted = null;

        // Priority 1: Direct Character (e.g. '甲')
        if (profile.saju.dayMasterChar) extracted = profile.saju.dayMasterChar;

        // Priority 2: Nested Saju Structure
        else {
            const gan = profile.saju.fourPillars?.day?.gan || profile.saju.day?.gan;
            if (gan && typeof gan === 'string') extracted = gan;
            else if (gan && typeof gan === 'object' && gan.char) extracted = gan.char;
        }

        // Priority 3: Parse from string "Gap (甲)"
        if (!extracted && typeof profile.saju.dayMaster === 'string') {
            const match = profile.saju.dayMaster.match(/[\u4e00-\u9fa5]/);
            if (match) extracted = match[0];
            else extracted = profile.saju.dayMaster.charAt(0);
        }

        if (!extracted) return null;

        // [Normalization] Convert Hangul to Hanja strictly for DB Lookup
        const MAP: Record<string, string> = {
            '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
            '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
        };

        return MAP[extracted] || extracted; // Return Hanja if mapped, else original
    };

    const dayMasterChar = getDayMasterChar(activeProfile);

    // [Init]
    useEffect(() => {
        if (isOpen) {
            setMessages([]);
            setStep(0);

            console.log('[DiscoveryChat] Init. Profile:', !!activeProfile, 'DayMaster:', dayMasterChar);

            if (!activeProfile) {
                setMessages([{
                    id: 'error',
                    role: 'bot',
                    text: '⚠️ 사용자 데이터가 없습니다. 먼저 사주 정보를 입력해주세요.'
                }]);
                return;
            }

            if (!dayMasterChar) {
                setMessages([{
                    id: 'error_dm',
                    role: 'bot',
                    text: '⚠️ 코어 에너지(Core Energy) 데이터를 확인할 수 없습니다. 데이터를 다시 확인해주세요.'
                }]);
                return;
            }

            // [Success Path] Trigger Scenario
            loadScenario(dayMasterChar);
        }
    }, [isOpen, activeProfile]);

    const loadScenario = (dm: string) => {
        const scenario = DAY_MASTER_SCENARIOS[dm];

        if (scenario) {
            // Step 0: Intro (Step 1 Text)
            simulateBotResponse(`반갑습니다. 당신은 **${scenario.keyword}**의 기운을 가지고 태어나셨군요.\n\n${scenario.step1_text}`,
                ['네, 맞습니다', '잘 모르겠어요']);
        } else {
            simulateBotResponse(`반갑습니다. 당신의 코어 에너지(본질)는 '${dm}' 입니다.\n\n하지만 심층 프로필을 불러오는 데 실패했습니다.`, ['종료']);
        }
    };

    const simulateBotResponse = (text: string, choices: string[] = []) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'bot',
                text,
                choices
            }]);
            setIsTyping(false);
        }, 800);
    };

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // [Flow Logic based on DayMaster]
        if (!dayMasterChar) return;
        const scenario = DAY_MASTER_SCENARIOS[dayMasterChar];

        // Simple Step Logic (Aligned with DB fields)
        setTimeout(() => {
            if (step === 0) {
                // Intro -> Shadow Question (Step 2 Text)
                simulateBotResponse(scenario.step2_text, ['네, 정확해요', '비슷한 경험이 있어요', '아니요, 저랑은 달라요']);
                setStep(1);
            } else if (step === 1) {
                // Shadow -> Mission (Step 3 Text)
                simulateBotResponse(scenario.step3_text, ['네, 해볼게요!', '다른 미션 주세요', '지금 바로 할게요']);
                setStep(2);
            } else if (step === 2) {
                // Final -> Handoff
                simulateBotResponse("훌륭합니다. 실천 후 느낌을 상담실에 공유해주시면, 더 깊은 분석을 이어가겠습니다.", ['상담실로 이동', '대화 종료']);
                setStep(3);
            } else if ((text.includes('상담실') || text.includes('이동')) && onConvertToMainChat) {
                onConvertToMainChat(`사용자 일간: ${dayMasterChar}\n주제: ${scenario.keyword}\n진행 단계: 미션(${scenario.mission}) 수락`);
                onClose();
            } else if (text.includes('종료')) {
                onClose();
            } else {
                // Default fallback for free chat within modal
                simulateBotResponse("네, 당신의 이야기를 더 들려주세요. (상담실로 이동하면 AI와 깊은 대화가 가능합니다.)", ['상담실로 이동']);
            }
        }, 1000);
    };

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1f2e] w-full max-w-md h-[600px] rounded-2xl flex flex-col border border-purple-500/20 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-black/20">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span className="font-bold text-gray-100">{title}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-purple-600 text-white rounded-br-none'
                                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                                }`}>
                                {msg.text}
                            </div>

                            {/* Choices */}
                            {msg.role === 'bot' && msg.choices && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {msg.choices.map((choice, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(choice)}
                                            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 transition-colors"
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs pl-2">
                            <span className="animate-bounce">●</span>
                            <span className="animate-bounce delay-100">●</span>
                            <span className="animate-bounce delay-200">●</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-2 relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                            placeholder={hasData ? "메시지를 입력하세요..." : "데이터가 없습니다"}
                            disabled={!hasData}
                            className="flex-1 bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                        />
                        <button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim() || !hasData}
                            className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
