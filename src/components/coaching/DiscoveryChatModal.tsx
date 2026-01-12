import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Bot, Sparkles } from 'lucide-react';
import { DAY_MASTER_SCENARIOS, DEFAULT_SCENARIO } from '../../data/SajuContentDB';

interface DiscoveryChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: any;
    initialIntent: string; // e.g. 'day_master_deep'
    title?: string;
    onConvertToMainChat?: (historySummary: string) => void;
}

interface ChatMessage {
    id: string;
    role: 'bot' | 'user';
    text: string;
    choices?: string[];
}

// [Simulation] 3-Step Flow Logic
const getNextBotResponse = (step: number, userText: string, userProfile: any, intent: string, title?: string) => {
    const name = userProfile?.name || '사용자';
    // [Fix] Robust DayMaster Extraction (Handle Object vs String)
    const getChar = (val: any) => (typeof val === 'object' && val?.char) ? val.char : val;

    const dayMasterRaw = userProfile?.saju?.dayMasterChar
        || userProfile?.saju?.fourPillars?.day?.gan
        || userProfile?.saju?.day?.gan // [Fix] Support flat structure
        || (typeof userProfile?.saju?.dayMaster === 'string' ? userProfile?.saju?.dayMaster.charAt(0) : '본질');

    const dayMaster = getChar(dayMasterRaw);



    // [Scenario A] 일간 심층 분석 (Day Master) - Dynamic Content Loading
    if (intent === 'day_master_deep') {
        const scenario = DAY_MASTER_SCENARIOS[dayMaster] || DEFAULT_SCENARIO;

        if (step === 0) {
            return {
                text: scenario.step1_text.replace(/\$\{name\}/g, name).replace(/\$\{dayMaster\}/g, dayMaster),
                choices: [
                    '네, 그런 것 같아요',
                    '나만의 특별한 점이라고 생각했어요',
                    '잘 모르겠어요, 더 알려주세요'
                ]
            };
        }
        if (step === 1) {
            return {
                text: scenario.step2_text.replace(/\$\{name\}/g, name),
                choices: ['맞아요, 공감됩니다', '비슷한 경험이 있어요', '어떻게 고쳐야 할까요?', '아니요, 저는 좀 다른 것 같아요']
            };
        }
        if (step === 2) {
            return {
                text: scenario.step3_text.replace(/\$\{name\}/g, name),
                choices: ['재미있겠네요, 해볼게요!', '오늘 바로 시도해볼게요', '혼자서는 힘들 것 같아요']
            };
        }
    }
    // [Scenario B] 일반적인 자각 탐구 (Generic Fallback)
    const topic = title || '이 주제';
    if (step === 0) {
        return {
            text: `반갑습니다, ${name}님. **'${topic}'**에 대해 더 깊이 알아보고 싶으시군요. 이 주제와 관련해서 평소 가장 고민되거나 궁금했던 점은 무엇인가요?`,
            choices: [
                '내 타고난 장점을 더 잘 쓰고 싶어요',
                '자꾸 반복되는 문제를 해결하고 싶어요',
                '나의 잠재력이 궁금해요'
            ]
        };
    }
    if (step === 1) {
        return {
            text: `이해합니다. ${name}님의 사주 구조를 보면, 이 부분에서 특별한 에너지가 흐르고 있습니다. 하지만 그 힘이 제대로 쓰이지 못하면 답답함을 느낄 수 있죠. 혹시 최근에 이 문제로 인해 감정적으로 힘들었던 순간이 있으셨나요?`,
            choices: ['네, 자주 답답함을 느껴요', '가끔 불안할 때가 있어요', '특별히 힘들진 않지만 더 잘하고 싶어요']
        };
    }
    if (step === 2) {
        return {
            text: `솔직한 답변 감사합니다. 지금 느끼는 그 감정이 바로 변화의 시작점입니다. ${name}님의 사주에 숨겨진 **반전의 열쇠**가 있습니다. 이제 이 단서를 가지고 더 깊은 본질을 탐구해볼까요?`,
            choices: ['네, 궁금해요 (더 알아보기)']
        };
    }

    // [Common Ending]
    return {
        text: `좋습니다. ${name}님의 이야기는 모두 확인했습니다. 이제 이 문제를 **${name}님의 전체 사주(오행/십성)**와 연결하여 근본적인 해법을 찾으러 가볼까요? 제가 상담실에서 기다리고 있겠습니다.`,
        choices: ['네, 상담실로 이동할게요 (Deep Talk)']
    };
};

export default function DiscoveryChatModal({ isOpen, onClose, userProfile, initialIntent, title, onConvertToMainChat }: DiscoveryChatModalProps) {
    // ... (state remains same) ...
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [step, setStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ... (Initial Greeting & Scroll remain same) ...
    // Initial Greeting & Session Reset logic
    useEffect(() => {
        if (!isOpen) return;

        // [Fix] Reset chat if user context changes
        // Check if the chat is empty OR if we need to restart for a new user
        // Ideally we should track a 'sessionId' based on user, but for now assuming
        // if modal opens and it's empty, OR if we force reset (not implemented yet).

        // BETTER: If isOpen becomes true, we should check if the current messages match the current user?
        // Simple approach requested by user: "User change -> Content change".
        // Let's reset messages whenever the modal opens IF the user is different?
        // Since we don't store session ID, let's just reset if empty. 
        // BUT user said "it is FIXED to previous content".
        // This means the component is NOT unmounting.
        // So we MUST clear messages when `userProfile` changes.
    }, [isOpen]);

    // [Fix] Reset Session when User Profile Changes
    useEffect(() => {
        if (isOpen) {
            console.log("User Profile Changed or Modal Opened - Resetting Chat for:", userProfile?.name);
            setMessages([]);
            setStep(0);
            simulateBotResponse(0, '', initialIntent); // Start fresh
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile?.name, userProfile?.birthDate, initialIntent]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);


    const simulateBotResponse = (currentStep: number, userLastMsg: string, intent: string = initialIntent) => {
        setIsTyping(true);
        setTimeout(() => {
            const response = getNextBotResponse(currentStep, userLastMsg, userProfile, intent, title);
            const newMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'bot',
                text: response.text,
                choices: response.choices || undefined
            };
            setMessages(prev => [...prev, newMsg]);
            setIsTyping(false);
            setStep(currentStep + 1);
        }, 1500);
    };

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // [Hand-off Logic] 메인 채팅으로 이동
        if ((text.includes('상담실') || text.includes('Deep Talk')) && onConvertToMainChat) {
            // 대화 요약 생성 (간단히)
            const summary = messages.map(m => `[${m.role}] ${m.text}`).join('\n');
            onConvertToMainChat(summary);
            onClose();
            return;
        }

        // User Message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: text
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Trigger Bot Response
        simulateBotResponse(step, text, initialIntent);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1a1a2e] w-full max-w-lg h-full sm:h-[80vh] sm:rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-purple-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg transform rotate-3">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                AI 명심 코치
                                <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">Beta</span>
                            </h2>
                            <p className="text-xs text-purple-300">내면의 빛을 찾는 여정 • {title || '일간 심층 분석'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#1a1a2e] to-[#121220]">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* Bubble */}
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-tr-none'
                                    : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                    }`}
                            >
                                {msg.role === 'bot' && <Sparkles size={14} className="inline-block text-yellow-400 mr-1 mb-1" />}
                                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br />') }} />
                            </div>

                            {/* Choices (Bot Only) */}
                            {msg.role === 'bot' && msg.choices && (
                                <div className="mt-3 flex flex-wrap gap-2 animate-fadeIn">
                                    {msg.choices.map((choice, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(choice)}
                                            className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            코치가 생각하고 있습니다...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-[#1a1a2e]">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                            placeholder="내용을 입력하세요..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <div className="absolute left-3 text-gray-500">
                            <User size={16} />
                        </div>
                        <button
                            onClick={() => handleSendMessage(inputText)}
                            disabled={!inputText.trim()}
                            className={`p-3 rounded-xl transition-all ${inputText.trim()
                                ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-500'
                                : 'bg-white/10 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
