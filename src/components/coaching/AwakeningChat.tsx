'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { generateQuestions, CoachingQuestion, getSocialQuestion } from '@/utils/questionGenerator';
import { analyzeEmotion } from '@/utils/emotionAnalyzer';
import { createConsultationPrompt } from '@/utils/promptBuilder';
import { Send, ArrowRight, User } from 'lucide-react';
import { SOCIAL_ROLES } from '@/data/socialRoleData';

interface AwakeningChatProps {
    onComplete: (prompt: string) => void;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    type?: 'question' | 'answer';
}

export default function AwakeningChat({ onComplete, onClose }: AwakeningChatProps) {
    const { reportData } = useReportStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<CoachingQuestion[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // History for Handoff
    const chatHistoryRef = useRef<{ question: string; answer: string }[]>([]);
    const emotionsRef = useRef<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Initialize Questions on Mount
    useEffect(() => {
        if (reportData) {
            // Generate dynamic questions or fallback to Social Role
            // For this demo, let's FORCE the Social Role question first as per User Request
            // We need to find the TenGod code for the Month Pillar. 
            // In a real app we parse reportData.saju.month.tenGod. 
            // Here, let's just pick one or Mock it if missing for demo.

            // MOCK: Taking the first social role for demo if real mapping missing
            // Ideally: const tenGod = reportData.saju.month.tenGodCode;
            const generated = generateQuestions(reportData);

            // If generator didn't yield enough (e.g. no clash), force add Social Role
            // Let's assume 'pyun_gwan' (The Solver) for testing as per prompt example
            const socialQ = getSocialQuestion('pyun_gwan');

            const initialQuestions = socialQ ? [socialQ, ...generated] : generated;

            // Fallback if empty
            if (initialQuestions.length === 0) {
                initialQuestions.push({
                    id: 'fallback',
                    type: 'social',
                    text: "당신의 사주를 보니 참 열심히 살아오셨군요. 요즘 가장 힘든 점은 무엇인가요?",
                    options: ['일이 너무 많아요', '사람 관계가 힘들어요']
                });
            }

            setQuestions(initialQuestions);

            // Start first question
            addBotMessage(initialQuestions[0].text);
        } else {
            addBotMessage("사용자 데이터를 불러오는 중 오류가 발생했습니다.");
        }
    }, [reportData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const addBotMessage = (text: string) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text }]);
            setIsTyping(false);
        }, 1000); // Simulate network delay
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const answerText = input.trim();
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
            // Simple Emotion Reaction Logic
            let reaction = "";
            if (emotion === 'negative') reaction = "저런, 많이 힘드셨겠어요. ";
            if (emotion === 'positive') reaction = "정말 긍정적이시네요! ";
            if (emotion === 'anxious') reaction = "불안해하지 마세요. ";
            if (emotion === 'angry') reaction = "화가 나시는 게 당연합니다. ";

            // Check if more questions exist
            if (currentQuestionIndex < questions.length - 1) {
                const nextQ = questions[currentQuestionIndex + 1];
                addBotMessage(`${reaction}${nextQ.text}`);
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // End of Stage 1
                setIsCompleted(true);
                addBotMessage(`${reaction}이제 당신의 마음을 충분히 알겠습니다. 더 깊은 해결책을 드리기 위해 마스터에게 이 내용을 전달할까요?`);
            }
        }, 800);
    };

    const handleHandoff = () => {
        if (!reportData) return;

        const prompt = createConsultationPrompt({
            userProfile: reportData,
            chatHistory: chatHistoryRef.current,
            detectedEmotions: emotionsRef.current,
            awakeningScore: 80 // Mock score
        });

        onComplete(prompt);
    };

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] text-white overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="bg-[#111] p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-serif text-lg text-gray-200">Deep Awakening</span>
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
                            }`}>
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
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111] border-t border-white/10">
                {!isCompleted ? (
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="답변을 입력하세요..."
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
                ) : (
                    <button
                        onClick={handleHandoff}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        <span>마스터와 심층 상담 시작하기</span>
                        <ArrowRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
