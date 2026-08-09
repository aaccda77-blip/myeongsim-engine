'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { generateQuestions, getDestinyChoice } from '@/utils/questionGenerator';
import { CoachingQuestion } from '@/types/report';
import { analyzeEmotion } from '@/utils/emotionAnalyzer';
import { createConsultationPrompt } from '@/utils/promptBuilder';
import { Send, ArrowRight, User } from 'lucide-react';

import { AWAKENING_108, getProtocolsByCategory } from '@/data/Awakening108DB';
import { useLanguage } from '@/contexts/LanguageContext'; // [Multi-Language]

interface AwakeningChatProps {
    onComplete: (prompt: string) => void;
    onClose: () => void;
    mode?: 'diagnosis' | '108'; // [NEW] Mode selection
}

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    type?: 'question' | 'answer';
}

const CATEGORIES = ['자아', '그림자', '관계', '목적', '초월', '연애', '재회', '금전', '직업', '명예', '상실'];

export default function AwakeningChat({ onComplete, onClose, mode = 'diagnosis' }: AwakeningChatProps) {
    const { reportData } = useReportStore();
    const { t, language } = useLanguage(); // [Multi-Language]
    
    // [이름 연동] 실제 사용자 성함 추출 (이경윤님)
    const rawUserName = reportData?.userName || (typeof window !== 'undefined' ? localStorage.getItem('saju_user_name') : null);
    const userName = (rawUserName && !rawUserName.toLowerCase().includes('the') && !rawUserName.toLowerCase().includes('te') && !rawUserName.includes('@')) 
      ? rawUserName 
      : '이경윤';

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<CoachingQuestion[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [roleAlias, setRoleAlias] = useState('');

    // [NEW] Flow state for 108 Protocol
    const [flowStep, setFlowStep] = useState<'category' | 'chatting'>('chatting');

    // History for Handoff
    const chatHistoryRef = useRef<{ question: string; answer: string }[]>([]);
    const emotionsRef = useRef<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Initialize Questions on Mount
    useEffect(() => {
        if (reportData) {
            if (mode === '108') {
                // [NEW] Category Selection Step
                setFlowStep('category');
                addBotMessage(language === 'kr' ? `오늘 ${userName}님의 내면을 비춰볼 자각의 거울입니다.\n지금 가장 마주하고 싶은 주제는 무엇입니까?` : t('awakening.intro'));
            } else {
                // [Mode: Diagnosis] Standard Flow (Unchanged)
                const generated = generateQuestions(reportData);
                const roleAlias = generated[0]?.text.includes("'") ? generated[0].text.split("'")[1] : userName;
                setRoleAlias(roleAlias);
                const finalChoice = getDestinyChoice(reportData);
                const fullCourse = [...generated, finalChoice];

                setQuestions(fullCourse);
                if (fullCourse.length > 0) {
                    addBotMessage(fullCourse[0].text.replace(/당신/g, `${userName}님`));
                }
            }
        } else {
            addBotMessage(t('errors.user_data_load_failed') || "사용자 데이터를 불러오는 중 오류가 발생했습니다.");
        }
    }, [reportData, mode, language, userName]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, flowStep]);

    const addBotMessage = (text: string) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text }]);
            setIsTyping(false);
        }, 1000);
    };

    // [NEW] Handle Category Selection
    const handleCategorySelect = (category: string) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: category }]);
        setFlowStep('chatting');

        // Pick random protocol from category
        const categoryProtocols = getProtocolsByCategory(category);
        const protocol = categoryProtocols[Math.floor(Math.random() * categoryProtocols.length)] || AWAKENING_108[0];

        // Define 3 Stages (Maieutics -> Recursive -> Meta)
        const rawQ1 = protocol.stage1_q || protocol.core_question;
        const q1Text = `[1단계: 직면 - ${category} 프로토콜]\n\n**${protocol.title}**\n"${protocol.subtitle}"\n\n${userName}님, ${rawQ1.replace(/당신/g, `${userName}님`)}`;
        const q2Text = (protocol.stage2_q || `[2단계: 심층] 방금 하신 대답의 이면에는 어떤 진짜 감정이 숨어있을까요?`).replace(/당신/g, `${userName}님`);
        const q3Text = (protocol.stage3_q || `[3단계: 객관화] 지금 그 마음을 3인칭 관찰자의 시선에서 조금 떨어져서 바라본다면, 자신에게 어떤 말을 해주고 싶나요?`).replace(/당신/g, `${userName}님`);

        const qs: CoachingQuestion[] = [
            { id: `${protocol.id}_s1`, type: 'hidden', text: q1Text, options: protocol.reflection_prompts },
            { id: `${protocol.id}_s2`, type: 'hidden', text: q2Text, options: ['오히려 편안합니다.', '조금 두려운 느낌입니다.', '억울하고 화가 납니다.', '잘 모르겠습니다.'] },
            { id: `${protocol.id}_s3`, type: 'hidden', text: q3Text, options: ['"괜찮아, 다 지나갈 거야."', '"조금 더 용기를 내보자."', '"지금 이대로도 충분해."'] }
        ];

        setQuestions(qs);
        setTimeout(() => addBotMessage(q1Text), 800);
    };

    const handleSend = () => {
        if (!input.trim() || flowStep === 'category') return;

        const answerText = input.trim();
        processUserAnswer(answerText);
    };

    const handleOptionClick = (optionText: string) => {
        if (flowStep === 'category') return;
        processUserAnswer(optionText);
    };

    const processUserAnswer = (answerText: string) => {
        const currentQ = questions[currentQuestionIndex];

        // 1. Add User Message
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: answerText }]);
        setInput('');

        // 2. Analyze Emotion
        const emotion = analyzeEmotion(answerText);
        emotionsRef.current.push(emotion);

        // 3. Save History
        if (currentQ) {
            chatHistoryRef.current.push({ question: currentQ.text, answer: answerText });
        }

        // 4. Respond & Next Step
        setTimeout(() => {
            let reaction = "";
            if (emotion === 'negative') reaction = "저런, 많이 힘드셨겠어요. ";
            if (emotion === 'positive') reaction = "정말 긍정적이시네요. ";
            if (emotion === 'anxious') reaction = "불안해하지 마세요. ";
            if (emotion === 'angry') reaction = "화가 나시는 게 당연합니다. ";

            // Check if more questions exist
            if (currentQuestionIndex < questions.length - 1) {
                const nextQ = questions[currentQuestionIndex + 1];
                addBotMessage(`${reaction}\n\n${nextQ.text}`);
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // End of Stage 3
                setIsCompleted(true);
                addBotMessage(`${reaction}이제 당신의 무의식적 패턴을 확인했습니다.\n더 깊은 원인 분석과 뉴럴 코드 기반 코칭 솔루션을 받기 위해 메인 코칭으로 넘어갈까요?`);
            }
        }, 800);
    }

    const handleHandoff = () => {
        if (!reportData) return;

        // Structured prompt to clearly show 3 stages
        const structuredHistoryStr = chatHistoryRef.current.map((item, idx) => `[Stage ${idx + 1}] Q: ${item.question}\nA: ${item.answer}`).join('\n\n');

        const prompt = `# System Prompt for 명심 AI 코치 (Myeongsim Coaching)
사용자가 108 자각 프로토콜의 3단계(직면->심층->객관화) 과정을 마쳤습니다. 

[3단계 진행 내역]
${structuredHistoryStr}

[기본 정보]
주요 감정 흐름: ${emotionsRef.current.join(' -> ')}

[지시사항]
1. 위 3단계 대화에서 가장 두드러지게 나타난 무의식적 방어기제나 그림자를 사용자의 사주기반(Day Master/Pillars)과 연결하여 따뜻하지만 명확하게 분석해주세요.
2. 메타인지(Stage 3)에서 사용자가 스스로에게 해준 말을 강화하거나 교정해주세요.`;

        onComplete(prompt);
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] text-white overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="bg-[#111] p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-serif text-lg text-gray-200">Deep Awakening Protocol</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-[#2a2a2a] text-gray-200 rounded-bl-none border border-white/5'
                            } whitespace-pre-wrap`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#2a2a2a] p-3 rounded-xl rounded-bl-none flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}

                {/* Topic Selection Buttons (Only show when flowStep is category and not typing) */}
                {flowStep === 'category' && !isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-2 mt-4 w-full"
                    >
                        {CATEGORIES.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCategorySelect(cat)}
                                className="px-4 py-3 bg-[#2a2a2a] border border-white/20 rounded-lg text-sm hover:bg-indigo-600 hover:border-indigo-500 transition-all text-gray-200 text-left w-full shadow-md flex justify-between items-center"
                            >
                                <span>{cat} 탐구하기</span>
                                <ArrowRight size={14} className="opacity-50" />
                            </button>
                        ))}
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input & Options Area */}
            {flowStep === 'chatting' && (
                <div className="p-4 bg-[#111] border-t border-white/10">
                    {!isCompleted ? (
                        <div className="flex flex-col gap-3">
                            {/* Render Options Buttons */}
                            {!isTyping && questions[currentQuestionIndex]?.options && (
                                <div className="flex flex-wrap gap-2 justify-end mb-2">
                                    {questions[currentQuestionIndex].options?.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionClick(opt)}
                                            className="px-4 py-2 bg-[#2a2a2a] border border-white/10 rounded-full text-sm hover:bg-indigo-600 hover:border-indigo-500 transition-all text-gray-200"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="직접 입력하거나 위 버튼을 선택하세요..."
                                    className="flex-1 bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleHandoff}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 animate-pulse"
                        >
                            <span>{t('awakening.start_coaching') || '심층 상담으로 이어가기'}</span>
                            <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
