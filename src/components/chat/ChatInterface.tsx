'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, Loader2, Lock, FileText, Check, Trash2, ArrowUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GateKeeperModule } from '@/modules/GateKeeperModule';
import { QuestionModule } from '@/modules/QuestionModule';
import { InterruptQuestionModule } from '@/modules/InterruptQuestionModule';
import InterruptGauge from '@/components/gap/InterruptGauge';
import { GapAnalysisService } from '@/modules/GapAnalysisService';
import { MBTIMapper } from '@/modules/MBTIMapper';
import { useReportStore } from '@/store/useReportStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PaymentModal from '../payment/PaymentModal';
import PaymentCard from './PaymentCard';
import LevelUpModal from './LevelUpModal';
import ConsciousnessCard from './ConsciousnessCard';
import LevelGaugeCard from './LevelGaugeCard'; // [Added]
import BioSyncDashboard from '../dashboard/BioSyncDashboard'; // [Added] Bio-Sync Module
import { SajuMatrixCard } from './SajuMatrixCard';      // [Added] Visual Saju Matrix
import NeuralProfileCard from '../NeuralProfileCard'; // [Added] Neural Profile Visualizer
import { CalculateNeuralProfile } from '@/utils/NeuralProfileCalculator'; // [Added] Client-side Calc
import MindTotemButton from './MindTotemButton'; // [Added] Mind Totem Button
import PatentLoadingTerminal from '../PatentLoadingTerminal'; // [Added] Visual Loading State
import { generateUUID } from '@/utils/uuid'; // [Added] Safe UUID
import { messaging } from "@/lib/firebase"; // [Added]
import { getToken } from "firebase/messaging"; // [Added]
import { useFcmToken } from '@/hooks/useFcmToken'; // [Added] Hook Import
import { useBioData } from '@/hooks/useBioData'; // [Phase 2]
import { supabase } from '@/lib/supabaseClient'; // [Auth]
import { DeepScanQuestions } from '@/modules/DeepScanData'; // [Feature] 30 Qs

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'payment';
    cardData?: { level: string; advice: string }; // [Added] For Sudden Card
    options?: string[]; // [Added] Selectable Options
}

interface ChatInterfaceProps {
    onClose: () => void;
    currentStage?: number;
}

export default function ChatInterface({ onClose, currentStage = 1 }: ChatInterfaceProps) {
    const { reportData } = useReportStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "안녕하세요. 마스터 H입니다. 당신의 운명을 읽어드릴 준비가 되었습니다. 어떤 고민이 있으신가요?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // [Gamification] Level System
    const [currentLevel, setCurrentLevel] = useState(1);
    const [showModal, setShowModal] = useState(false);

    // [Premium & Payment]
    const [premiumReport, setPremiumReport] = useState<string | null>(null);
    const [isPremiumLoading, setIsPremiumLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS'>('IDLE');

    const [gapMetrics, setGapMetrics] = useState({ gapLevel: 10, matchingScore: 90 }); // Initial: Stable
    const [interruptQuestion, setInterruptQuestion] = useState<any | null>(null);
    const [isInterrupted, setIsInterrupted] = useState(false);
    const [isSurveyCompleted, setIsSurveyCompleted] = useState(false); // [Feature] GateKeeper default false
    const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]); // Queue for Survey
    const [surveyIndex, setSurveyIndex] = useState(0);
    const [acquiredVector, setAcquiredVector] = useState<number[]>([0, 0, 0, 0, 0]); // [Feature] Vector Accumulation
    const [showBridgeFeedback, setShowBridgeFeedback] = useState<string | null>(null); // [Feature] Bridge Msg
    // const [showBridgeFeedback, setShowBridgeFeedback] = useState<string | null>(null); // Re-enabled below if needed or just use logic

    const pendingMessage = useRef<string | null>(null);
    const loadingCount = useRef(0); // [UX] Track load count for simplified animation
    const [isCompactGauge, setIsCompactGauge] = useState(false); // [UX] Gauge Size Control

    // [Logic] Check for triggers on input change or before send
    const handleInterruptCheck = (text: string) => {
        const question = InterruptQuestionModule.checkInterrupt(text);
        if (question && !isInterrupted) {
            setInterruptQuestion(question);
            return true; // Triggered
        }
        return false;
    };

    // [Logic] Handle Interrupt Answer
    const handleOptionSelect = (opt: any) => {
        const { value, label, type, gap } = opt;

        // 1. Accumulate Vector
        setAcquiredVector(prev => prev.map((v, i) => v + (value[i] || 0)));

        // 2. Visual Ripple: Gap Change based on Type
        // NEURAL -> Shrink Gap (Stabilize)
        // DARK -> Grow Gap (Warning)
        const gapDelta = type === 'NEURAL' ? - (gap * 5) : (gap * 8);

        setGapMetrics(prev => ({
            gapLevel: Math.min(100, Math.max(5, prev.gapLevel + gapDelta)),
            matchingScore: Math.max(0, Math.min(95, prev.matchingScore - gapDelta))
        }));

        // [Feature] GateKeeper Survey Progression
        if (!isSurveyCompleted && surveyQuestions.length > 0) {

            // [Bridge Feedback]
            const feedbackMsgs = [
                "좋은 통찰입니다...",
                "당신의 깊은 무의식을 스캔 중입니다...",
                "솔직한 답변이 뉴럴 코드를 깨웁니다...",
                "에너지가 공명하고 있습니다...",
                "조금 더 깊이 들어가 보겠습니다..."
            ];
            const randomFeedback = feedbackMsgs[Math.floor(Math.random() * feedbackMsgs.length)];
            setShowBridgeFeedback(randomFeedback);
            setInterruptQuestion(null); // Hide question during bridge

            setTimeout(() => {
                setShowBridgeFeedback(null);

                if (surveyIndex < surveyQuestions.length - 1) {
                    // Next Question
                    setSurveyIndex(prev => prev + 1);
                    setInterruptQuestion(surveyQuestions[surveyIndex + 1]);
                } else {
                    // Survey Complete
                    setIsSurveyCompleted(true);
                    setInterruptQuestion(null);

                    // Add Completion Message with Quick Replies
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: `📊 **Deep Scan 완료.**\n\n당신의 영혼(Innate)과 현실(Acquired)의 간극을 완벽하게 분석했습니다.\n이제 마스터 H가 **[통합 뉴럴 리포트]**를 생성합니다.`,
                        options: ["리포트 확인하기", "다른 고민 말하기"] // [UX] Quick Replies
                    }]);

                    // Proceed with original message if any + Inject Deep Scan Data
                    if (pendingMessage.current) {
                        const contextMsg = `${pendingMessage.current} :::GAP_SURVEY_COMPLETE: TotalQuestions=${surveyQuestions.length}, FinalGap=${gapMetrics.gapLevel}, Matching=${gapMetrics.matchingScore}, Vector=[${acquiredVector.join(',')}] ::: :::OPTIONS:리포트 확인하기|조금 더 대화하기:::`;
                        handleSend(contextMsg);
                        pendingMessage.current = null;
                    }
                }
            }, 1200); // 1.2s Bridge Delay
            return;
        }

        // 2. Resume Chat (Interrupt Mode - Single Trigger)
        setInterruptQuestion(null);
        setIsInterrupted(false);

        // 3. Send Context
        if (pendingMessage.current) {
            const contextMsg = `${pendingMessage.current} :::GAP_UPDATE:User chose '${label}' (Type: ${type}, Gap ${gap}):::`;
            handleSend(contextMsg);
            pendingMessage.current = null;
        }
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    // [Push] Hook Integration (Demo ID)
    const demoUserId = '00000000-0000-0000-0000-000000000000';
    const { token: fcmToken } = useFcmToken(demoUserId);

    // [Persistence] Load Chat History
    const sessionIdRef = useRef<string>("");

    useEffect(() => {
        // 1. Generate New Session ID on Mount (Refresh = New Session)
        const newSessionId = generateUUID(); // [Fix] Use safe generator
        sessionIdRef.current = newSessionId;
        console.log("🆕 Check-in: New Session Created:", newSessionId);

        const loadHistory = async () => {
            try {
                // Demo User ID (Fixed)
                const userId = '00000000-0000-0000-0000-000000000000';

                // [Fix] Filter by Session ID (Fetch specific session only)
                const res = await fetch(`/api/chat/history?userId=${userId}&sessionId=${newSessionId}`);
                if (!res.ok) return;

                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    const formattedMsgs = data.messages.map((m: any) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        options: m.metadata?.options,
                        // Restore special cards if possible (simplified for now)
                    }));
                    setMessages(formattedMsgs);
                } else {
                    // Start fresh if no history for this session
                    setMessages([
                        {
                            id: 'welcome',
                            role: 'assistant',
                            content: "안녕하세요. 마스터 H입니다. 당신의 운명을 읽어드릴 준비가 되었습니다. 어떤 고민이 있으신가요?"
                        }
                    ]);
                }
            } catch (e) {
                console.error("History Load Error:", e);
            }
        };
        loadHistory();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);



    // [Feature] Bio Data Hook
    const { connect: connectBio, disconnect: disconnectBio, bpm, isConnected: isBioConnected, isConnecting: isBioConnecting, error: bioError } = useBioData();

    // [Auto-Trigger] High BPM detection
    useEffect(() => {
        if (bpm > 110 && !isLoading) {
            // Automatic trigger when heart rate is high
            handleSend("심장이 너무 빨리 뛰어요... (BPM: " + bpm + ")");
        }
    }, [bpm]);

    const handleSend = async (overrideInput?: string) => {
        const msgToSend = overrideInput || input;
        if (!msgToSend.trim() || isLoading) return;

        // [Feature] GateKeeper Check (unchanged logic)
        if (!isSurveyCompleted && !msgToSend.includes(":::") && !msgToSend.startsWith("/")) {
            // ... (Existing GateKeeper Logic - Keep as is, just wrapped for brevity in this replace block if needed, but here we focus on the API part)
            // For safety in this replace block, I will assume the original GateKeeper logic was here. 
            // However, to keep this "replace" clean, I should probably target the specific API call block instead of the whole function if possible, 
            // OR re-implement the whole handleSend. 
            // Given the complexity, I will aim to replace the API call section specifically effectively.
            // BUT, the instruction is to REPLACE the API call. 
            // Let's rewrite handleSend to include the new logic.

            // 1. Add User Message to UI
            const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msgToSend };
            setMessages(prev => [...prev, userMsg]);
            setInput('');

            // 2. Trigger Scenario (Fake Assistant Response)
            setIsLoading(true);
            loadingCount.current += 1;
            const scenarioText = GateKeeperModule.getScenario();

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: scenarioText
                }]);
                setIsLoading(false);

                // 3. Trigger 30 Questions (Deep Scan)
                if (DeepScanQuestions && DeepScanQuestions.length > 0) {
                    setSurveyQuestions(DeepScanQuestions);
                    setSurveyIndex(0);
                    setInterruptQuestion(DeepScanQuestions[0]);
                    pendingMessage.current = msgToSend;
                }
            }, 1000);
            return;
        }

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msgToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // [Payment Card Trigger]
        if (msgToSend.trim() === '/신청' || msgToSend.includes('Beta 신청')) {
            setIsLoading(true);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: 'Beta 멤버십 신청을 안내해 드립니다.',
                    type: 'payment'
                }]);
                setIsLoading(false);
            }, 600);
            return;
        }


        // [Universal Engine] Date Detection & Immediate Visualization
        const dateMatch = msgToSend.match(/(\d{4})[-.년]\s*(\d{1,2})[-.월]\s*(\d{1,2})/);
        if (dateMatch) {
            try {
                const year = parseInt(dateMatch[1]);
                const month = parseInt(dateMatch[2]);
                const day = parseInt(dateMatch[3]);
                const date = new Date(year, month - 1, day);
                const profile = CalculateNeuralProfile(date);

                // Inject visual command immediately
                const uiCommand = `::: UI_COMMAND : ${JSON.stringify({ ui_type: 'neural_profile', profile })} :::`;

                // Add immediate bot response with the card
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: `neural-${Date.now()}`,
                        role: 'assistant',
                        content: `🧬 **Neural Code Detected.**\n\n[System] ${year}년 ${month}월 ${day}일 생년월일을 기반으로 고유 설계를 분석했습니다.\n${uiCommand}`
                    }]);
                }, 100); // 100ms slight delay for natural feel
            } catch (e) {
                console.error("Neural Calc Error:", e);
            }
        }

        setIsLoading(true);
        loadingCount.current += 1;

        try {
            // [Auth Integration] Get Real User ID
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || '00000000-0000-0000-0000-000000000000';
            const stage = currentStage;

            // [Persistence Recovery]
            let effectiveReportData = reportData;
            if (!effectiveReportData?.birthDate && typeof window !== 'undefined') {
                try {
                    const storageStr = sessionStorage.getItem('myeongsim-report-storage');
                    if (storageStr) {
                        const parsed = JSON.parse(storageStr);
                        if (parsed.state && parsed.state.reportData) {
                            effectiveReportData = parsed.state.reportData;
                        }
                    }
                } catch (e) { console.warn(e); }
            }

            // [API] Call Next.js API Route (Corrected from Edge Function)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName: effectiveReportData?.userName || "회원",
                    message: msgToSend,
                    messages: [...messages, userMsg],
                    stage,
                    birthDate: effectiveReportData?.birthDate,
                    birthTime: effectiveReportData?.birthTime,
                    gender: effectiveReportData?.gender,
                    userSaju: {
                        birthDate: effectiveReportData?.birthDate,
                        birthTime: effectiveReportData?.birthTime,
                        gender: effectiveReportData?.gender
                    },
                    sajuData: effectiveReportData?.saju,
                    gapData: {
                        acquiredVector: acquiredVector,
                        gapLevel: gapMetrics.gapLevel,
                        matchingScore: gapMetrics.matchingScore
                    },
                    sessionId: sessionIdRef.current,
                    lastBotMessage: messages.length > 0 && messages[messages.length - 1].role === 'assistant' ? messages[messages.length - 1].content : null
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Server Error: ${errText}`);
            }

            if (!response.body) throw new Error('No response stream');

            // [Stream Handling]
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botContent = '';

            // Create specific message ID for streaming
            const botMsgId = (Date.now() + 1).toString();

            // Initial placeholder
            setMessages(prev => [...prev, {
                id: botMsgId,
                role: 'assistant',
                content: ''
            }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botContent += chunk;

                // Live Update
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId
                        ? { ...msg, content: botContent }
                        : msg
                ));
            }

            // [Post-Processing] Check for special UI data parsing if embedded in text
            // (Current route.ts streams raw text, so no JSON parsing of full body)

        } catch (error: any) {
            console.error("Chat Error:", error);
            const fallbackMessage = `...(잠시 깊은 침묵)... \n\n[System Debug] ${error.message || 'Unknown Error'}\n\n우주의 파동이 잠시 고르지 못했습니다. 리님의 마음을 다시 한 번 들려주시겠습니까?`;
            setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: fallbackMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlockReport = () => {
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-gray-900 border-l border-gray-800 relative z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm z-50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-gold/20 to-primary-olive/20 flex items-center justify-center border border-primary-gold/30">
                            <Bot className="w-5 h-5 text-primary-gold" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                            <span className="text-[10px] text-primary-gold font-bold">{currentLevel}</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            Master H
                            <span className="px-2 py-0.5 rounded-full bg-primary-gold/10 text-[10px] text-primary-gold border border-primary-gold/20">
                                {currentLevel === 1 ? 'Wanderer' : 'Gardener'}
                            </span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">Myeongsim Coaching AI</p>
                            {/* [Debug] Name Verification */}
                            <span className="text-[10px] text-gray-600 bg-gray-800 px-1 rounded">
                                To: {reportData?.userName || '회원'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* [Dev] Clear History Button */}
                    <button
                        onClick={async () => {
                            if (!window.confirm("⚠️ 모든 대화 기록을 삭제하시겠습니까? (복구 불가)")) return;
                            try {
                                const userId = '00000000-0000-0000-0000-000000000000';
                                const res = await fetch(`/api/chat/clear?userId=${userId}`, { method: 'DELETE' });
                                if (res.ok) {
                                    setMessages([{
                                        id: 'welcome',
                                        role: 'assistant',
                                        content: "🧹 대화 기록이 초기화되었습니다. 새로운 마음으로 시작해보세요."
                                    }]);
                                    // Reset Session ID for good measure
                                    const newSessionId = generateUUID();
                                    sessionIdRef.current = newSessionId;
                                } else {
                                    alert("초기화 실패");
                                }
                            } catch (e) {
                                console.error(e);
                                alert("오류 발생");
                            }
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                        title="대화 기록 초기화"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>



            {/* [Feature] Real-time Gap Gauge - MOVED TO BOTTOM */}

            {/* Chat Area */}
            <div
                className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent relative"
                ref={scrollRef}
                onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollTop > 50) {
                        setIsCompactGauge(true);
                    } else {
                        setIsCompactGauge(false);
                    }
                }}
            >
                {/* [UX] Hypnotic Loader (Breathing Circle) */}
                {isLoading && loadingCount.current > 1 && (
                    <div className="flex justify-center py-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-primary-gold/30 animate-[spin_3s_linear_infinite]" />
                            <div className="absolute inset-0 w-12 h-12 rounded-full border-t-2 border-primary-gold animate-[spin_2s_linear_infinite_reverse]" />
                            <div className="absolute inset-2 w-8 h-8 rounded-full bg-primary-gold/10 animate-pulse backdrop-blur-sm" />
                        </div>
                    </div>
                )}
                {/* No Static Welcome Message Here - handled by initial state */}

                {/* Interrupt Overlay (30 Questions Deep Scan Mode) */}
                <AnimatePresence>
                    {(interruptQuestion || showBridgeFeedback) && (
                        <div className="fixed bottom-32 left-0 right-0 z-50 flex flex-col items-center justify-center p-4">
                            {/* Bridge Feedback */}
                            {showBridgeFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-primary-gold/50 shadow-2xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 text-primary-gold animate-spin" />
                                        <span className="text-lg font-medium text-white">{showBridgeFeedback}</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Question Card */}
                            {!showBridgeFeedback && interruptQuestion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="w-full max-w-2xl"
                                >
                                    <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-primary-gold/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">

                                        {/* Progress Bar */}
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-500 to-primary-gold transition-all duration-500"
                                                style={{ width: `${((surveyIndex + 1) / surveyQuestions.length) * 100}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between mb-6 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Zap className="w-5 h-5 text-primary-gold animate-pulse" />
                                                <h3 className="text-primary-gold font-bold text-lg">
                                                    Deep Scan Protocol
                                                </h3>
                                            </div>
                                            <div className="text-slate-400 text-sm font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                                Question <span className="text-white font-bold">{surveyIndex + 1}</span> / {surveyQuestions.length}
                                            </div>
                                        </div>

                                        <p className="text-white text-xl font-medium mb-8 leading-relaxed">
                                            {interruptQuestion.text}
                                        </p>

                                        <div className="grid gap-3">
                                            {interruptQuestion.options.map((opt: any, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionSelect(opt)}
                                                    className="w-full text-left p-5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-primary-gold/50 transition-all active:scale-[0.98] flex justify-between group"
                                                >
                                                    <span className="text-slate-200 group-hover:text-white font-medium">{opt.label}</span>
                                                    <ArrowUp className="w-5 h-5 text-slate-500 group-hover:text-primary-gold opacity-0 group-hover:opacity-100 transition-all transform rotate-90" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>

                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isPayment = msg.type === 'payment';

                    // [Image Detection]
                    const imageMatch = msg.content.match(/!\[(.*?)\]\((.*?)\)/);
                    const imageName = imageMatch ? imageMatch[1] : null;

                    // [Image Gen Trigger Detection] (Multiline Fix)
                    const imageGenMatch = msg.content.match(/:::IMAGE_GEN:([\s\S]*?):::/);
                    const imageGenPrompt = imageGenMatch ? imageGenMatch[1].trim() : null;

                    // [Level Gauge Trigger Detection] (Legacy)
                    const levelGaugeMatch = msg.content.match(/:::LEVEL_GAUGE:\s*(\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*:::/);
                    const gaugeData = levelGaugeMatch ? {
                        score: parseInt(levelGaugeMatch[1], 10),
                        emotion: levelGaugeMatch[2].trim(),
                        advice: levelGaugeMatch[3].trim()
                    } : null;

                    // [Silent Analysis UI Detection] (New/Bottom)
                    // Allows spaces around keys: ::: UI_COMMAND : { ... } :::
                    const uiCommandMatch = msg.content.match(/:::\s*UI_COMMAND\s*:([\s\S]*?):::/);
                    let uiData = null;
                    if (uiCommandMatch) {
                        try {
                            uiData = JSON.parse(uiCommandMatch[1].trim());
                        } catch (e) {
                            console.error("UI Command Parse Error:", e);
                        }
                    }

                    // [JSON Protocol Handler]
                    // Try to Parse as JSON first
                    let parsedContent: any = null;
                    try {
                        parsedContent = JSON.parse(msg.content);
                    } catch (e) {
                        // Streaming fallback: Try to regex extract "reply"
                        // [Fix] Removed /s flag for ES target compatibility. Used [\s\S] instead of .
                        const replyMatch = msg.content.match(/"reply":\s*"([\s\S]*?)(?:")?(?:,|$)/);
                        if (replyMatch) {
                            parsedContent = { reply: replyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') };
                        }
                    }

                    // Clean content for display (hide the tags)
                    // [Fix] Handle Separator Protocol
                    let rawText = msg.content;
                    const separatorParts = msg.content.split(':::DATA_SEPARATOR:::');

                    if (separatorParts.length > 1) {
                        // New Protocol: Text | Separator | JSON
                        rawText = separatorParts[0].trim();
                        // Try to parse the second part to populate analysis data if not already done
                        if (!parsedContent) {
                            try {
                                const jsonPart = separatorParts[1].trim();
                                const parsed = JSON.parse(jsonPart);
                                // Merge into parsedContent/analysisData logic if needed
                                // For now, we rely on the bottom block to re-parse, but we MUST clean the text here.
                            } catch (e) { }
                        }
                    } else {
                        // Legacy Protocol: JSON-only or Text-only
                        rawText = parsedContent?.reply || msg.content;
                    }

                    const displayContent = rawText
                        .replace(/:::OPTIONS:([\s\S]*?):::/g, '')
                        .replace(/:::IMAGE_GEN:([\s\S]*?):::/g, '')
                        .replace(/:::LEVEL_GAUGE:[\s\S]*?:::/g, '')
                        .replace(/:::DATA_SEPARATOR:::[\s\S]*/g, '') // Extra safety: Remove separator and everything after
                        .replace(/:::\s*UI_COMMAND\s*:[\s\S]*?:::/g, '');

                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} flex-col`}>
                            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
                                <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-primary-olive text-white' : 'bg-primary-gold/20 text-primary-gold border border-primary-gold/30'
                                        }`}>
                                        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        {/* [New] Consciousness Gauge Bar */}
                                        {gaugeData && (
                                            <div className="mb-1 p-3 bg-gray-900/80 border border-gray-700 rounded-xl shadow-lg animate-fade-in-up">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-400">📡 의식 레벨 측정</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${gaugeData.score >= 200 ? 'bg-green-500/20 text-green-400' :
                                                            gaugeData.score >= 100 ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            Level {gaugeData.score}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{gaugeData.emotion}</span>
                                                </div>

                                                {/* Bar Graph */}
                                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2 relative">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${gaugeData.score >= 400 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                                            gaugeData.score >= 200 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                                                'bg-gradient-to-r from-red-500 to-orange-400'
                                                            }`}
                                                        style={{ width: `${Math.min((gaugeData.score / 600) * 100, 100)}%` }}
                                                    />
                                                    {/* Threshold Marker (200 - Courage) */}
                                                    <div className="absolute top-0 bottom-0 w-0.5 bg-white/30 left-[33%]" title="Level 200 (분기점)" />
                                                </div>

                                                <p className="text-[11px] text-gray-400 italic">
                                                    💡 {gaugeData.advice}
                                                </p>
                                            </div>
                                        )}

                                        <div className={`
                                            relative group backdrop-blur-md border shadow-lg transition-all duration-300
                                            ${isPayment
                                                ? 'bg-transparent p-0 shadow-none border-none'
                                                : msg.role === 'user'
                                                    ? 'bg-primary-gold/10 border-primary-gold/30 rounded-2xl rounded-tr-sm text-gray-100 ml-auto'
                                                    : 'bg-white/5 border-white/10 rounded-2xl rounded-tl-sm text-gray-200'
                                            }
                                            max-w-[85%] md:max-w-[75%] px-5 py-4
                                        `}>
                                            {isPayment ? (
                                                <PaymentCard
                                                    onDetailedReport={handleUnlockReport}
                                                />
                                            ) : (
                                                <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            strong: ({ node, ...props }) => <strong className="text-primary-gold font-bold" {...props} />,
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                                                            code: ({ node, ...props }) => <code className="bg-black/30 rounded px-1 py-0.5 text-primary-gold font-mono text-xs" {...props} />,
                                                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 flex items-center gap-2" {...props} />,
                                                        }}
                                                    >
                                                        {displayContent}
                                                    </ReactMarkdown>
                                                </div>
                                            )}

                                            {/* [Image Widget Renderer] */}
                                            {imageGenMatch && (
                                                <div className="mt-4 mb-2 overflow-hidden rounded-lg border border-primary-gold/50 bg-black shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                                    <div className="h-48 relative group">
                                                        {/* Real Image Rendering via Unsplash Source */}
                                                        {/* Real Image Rendering via Pollinations AI (Generative) */}
                                                        <img
                                                            src={`https://image.pollinations.ai/prompt/${encodeURIComponent(imageGenPrompt || 'mystical nature landscape')}?width=800&height=600&nologo=true`}
                                                            alt={imageGenPrompt || "Visualizing..."}
                                                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?auto=format&fit=crop&w=800&q=80"; // Fallback to generic zen image
                                                            }}
                                                        />
                                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                            <p className="text-[10px] text-primary-gold/70 italic truncate px-2">
                                                                🖼️ {imageGenPrompt}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {imageMatch && (
                                                <div className="mt-4 mb-2 overflow-hidden rounded-lg border border-primary-gold/30 bg-black/50">
                                                    <div className="h-32 flex items-center justify-center bg-gray-800 text-gray-500 text-xs flex-col gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <span>[Image: {imageName}]</span>
                                                    </div>
                                                    <div className="px-3 py-2 bg-primary-gold/10 text-[10px] text-primary-gold border-t border-primary-gold/20">
                                                        💡 시각 자료: {imageName}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* [Silent Analysis UI Renderer] (New) */}
                            {(() => {
                                // [JSON Protocol Handler]
                                // Try to Parse as JSON first
                                let parsed: any = null;
                                let displayText = displayContent; // Initialize with the already processed displayContent
                                let analysisData = null;
                                let suggestions = null;

                                // [Emergency Fix] Separator Logic
                                // Format: Text ... :::DATA_SEPARATOR::: ... JSON
                                const parts = msg.content.split(':::DATA_SEPARATOR:::');
                                if (parts.length > 1) {
                                    displayText = parts[0].trim(); // Show text only
                                    const jsonPart = parts[1].trim();
                                    try {
                                        const parsedData = JSON.parse(jsonPart);
                                        if (parsedData.analysis_data) analysisData = parsedData.analysis_data;
                                        if (parsedData.suggestions) suggestions = parsedData.suggestions;
                                    } catch (e) {
                                        // Fallback: Regex extraction on the JSON part
                                        const analysisMatch = jsonPart.match(/"analysis_data":\s*({[\s\S]*?})(?:,\s*"|}$)/);
                                        if (analysisMatch) {
                                            try { analysisData = JSON.parse(analysisMatch[1]); } catch (e) { }
                                        }
                                        const suggestionsMatch = jsonPart.match(/"suggestions":\s*(\[[\s\S]*?\])(?:,\s*"|}$)/);
                                        if (suggestionsMatch) {
                                            try { suggestions = JSON.parse(suggestionsMatch[1]); } catch (e) { }
                                        }
                                    }
                                } else {
                                    // Fallback for legacy JSON-only format (just in case)
                                    // Or if the separator is missing but JSON might still be present in the whole content
                                    try {
                                        const parsedFullContent = JSON.parse(msg.content);
                                        if (parsedFullContent.reply) displayText = parsedFullContent.reply;
                                        if (parsedFullContent.analysis_data) analysisData = parsedFullContent.analysis_data;
                                        if (parsedFullContent.suggestions) suggestions = parsedFullContent.suggestions;
                                    } catch (e) {
                                        // If strict JSON parse fails, try regex on the whole content as last resort
                                        // (This covers the case where separator is missing but JSON exists)
                                        const replyMatch = msg.content.match(/"reply":\s*"([\s\S]*?)(?:")?(?:,|$)/);
                                        if (replyMatch) displayText = replyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');

                                        const analysisMatch = msg.content.match(/"analysis_data":\s*({[\s\S]*?})(?:,\s*"|}$)/);
                                        if (analysisMatch) {
                                            try { analysisData = JSON.parse(analysisMatch[1]); } catch (e) { }
                                        }

                                        const suggestionsMatch = msg.content.match(/"suggestions":\s*(\[[\s\S]*?\])(?:,\s*"|}$)/);
                                        if (suggestionsMatch) {
                                            try { suggestions = JSON.parse(suggestionsMatch[1]); } catch (e) { }
                                        }
                                    }
                                }





                                // Define a unique ID for this message's content to capture
                                const captureTargetId = `mind-totem-target-${msg.id}`;

                                return (
                                    <>
                                        {/* [Mind Totem Target Area] Wrap all visual cards */}
                                        <div id={captureTargetId} className="w-full">
                                            {/* [Saju Matrix Card] */}
                                            {analysisData?.saju_pillars && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-2 mb-2 animate-fade-in-up">
                                                    <SajuMatrixCard pillars={analysisData.saju_pillars} />
                                                </div>
                                            )}

                                            {/* [Level Gauge Card] */}
                                            {analysisData && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-2 mb-4 animate-fade-in-up">
                                                    <LevelGaugeCard
                                                        innateLevel={analysisData.innate_level}
                                                        currentLevel={analysisData.current_level}
                                                        framework={analysisData.framework?.replace(/_/g, " ").toUpperCase()}
                                                        tip={analysisData.comment}
                                                    />
                                                </div>
                                            )}

                                            {uiData && uiData.ui_type === 'consciousness_gauge' && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-2 animate-fade-in-up">
                                                    <ConsciousnessCard
                                                        level={uiData.level}
                                                        advice={uiData.comment}
                                                    />
                                                </div>
                                            )}
                                            {uiData && uiData.ui_type === 'gap_analysis' && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-2 animate-fade-in-up">
                                                    <BioSyncDashboard data={uiData} />
                                                </div>
                                            )}
                                            {/* [Neural Profile Card] Universal Engine Visualizer */}
                                            {uiData && uiData.ui_type === 'neural_profile' && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-4 mb-6 animate-fade-in-up">
                                                    <NeuralProfileCard profile={uiData.profile} />
                                                </div>
                                            )}
                                        </div>

                                        {/* [Mind Totem Save Button] Show only if visual data exists */}
                                        {(analysisData || uiData) && (
                                            <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mb-4 animate-fade-in-up">
                                                <MindTotemButton targetId={captureTargetId} />
                                            </div>
                                        )}

                                        {/* [Options Rendering] Streamed Options (:::OPTIONS:::) */}
                                        {msg.options && Array.isArray(msg.options) && (
                                            <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-3 flex flex-col gap-2">
                                                {msg.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSend(opt)}
                                                        disabled={isLoading}
                                                        className="w-full text-left p-4 rounded-xl bg-gray-900/80 border border-white/10 hover:border-primary-gold/50 hover:bg-gray-800 transition-all flex items-center gap-3 group disabled:opacity-50"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-primary-gold group-hover:scale-125 transition-transform" />
                                                        <span className="text-gray-300 text-sm font-medium">
                                                            {opt}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}


                                        {/* [Emotional Suggestion Chips] JSON Suggestions */}
                                        {suggestions && Array.isArray(suggestions) && (
                                            <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-3 flex flex-col gap-2">
                                                {suggestions.map((chip: any, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSend(chip.label)}
                                                        disabled={isLoading}
                                                        className="w-full text-left p-4 rounded-xl bg-gray-900/80 border border-white/10 hover:border-primary-gold/50 hover:bg-gray-800 transition-all flex items-center gap-3 group disabled:opacity-50"
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${chip.type === 'empathy' ? 'bg-pink-400' : chip.type === 'logic' ? 'bg-blue-400' : 'bg-purple-400'} group-hover:scale-125 transition-transform`} />
                                                        <span className="text-gray-300 text-sm font-medium">
                                                            {chip.label}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    );
                })}
            </div>
            {/* [Patent Loading Terminal] Visual Wait State */}
            {isLoading && (
                <div className="px-4 py-2 animate-fade-in-up">
                    {/* [UX] Simplified Loading for subsequent turns */}
                    {loadingCount.current > 1 ? (
                        <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-white/5">
                            <Loader2 className="w-5 h-5 text-primary-gold animate-spin" />
                            <span className="text-sm text-gray-400 animate-pulse">Master H가 분석 중입니다...</span>
                        </div>
                    ) : (
                        <PatentLoadingTerminal />
                    )}
                </div>
            )}


            {/* [Feature] Real-time Gap Gauge - MOVED TO BOTTOM */}

            {/* [Feature] Real-time Gap Gauge - MOVED TO BOTTOM */}

            {/* [Feature] Real-time Gap Gauge - MOVED HERE (Bottom) */}
            {/* [Feature] Real-time Gap Gauge - MOVED HERE (Bottom) */}
            <div className="bg-slate-900 border-t border-gray-800 p-2">
                <InterruptGauge gapLevel={gapMetrics.gapLevel} matchingScore={gapMetrics.matchingScore} isActive={true} compact={true} />
            </div>

            {/* Input Area with Quick Chips */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-md flex flex-col gap-3">

                {/* [UX] Quick Chips (Suggestion Buttons) */}
                {!isLoading && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade-sides">
                        {[
                            { label: "💰 재물운", query: "나의 타고난 재물운과 돈을 버는 방법을 핵심만 알려줘" },
                            { label: "❤️ 연애운", query: "나의 연애 스타일과 잘 맞는 배우자상은?" },
                            { label: "🚀 올해 목표", query: "올해 내가 가장 집중해야 할 성취 목표는?" },
                            { label: "🩸 건강운", query: "주의해야 할 건강 문제와 관리법은?" },
                            { label: "🔑 핵심 재능", query: "내가 타고난 가장 강력한 무기(재능)는 뭐야?" }
                        ].map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setMsgToSend(chip.query);
                                    // Optional: Auto-send or just fill? Let's just fill for safety, or auto-send.
                                    // User usually expects auto-fill + focus, or auto-send.
                                    // Let's Auto-Fill for now so they can edit.
                                }}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-primary-gold/20 hover:border-primary-gold/50 hover:text-primary-gold transition-all active:scale-95 flex-shrink-0 backdrop-blur-sm"
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2 relative"
                >

                    <input
                        type="text"
                        value={input} onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsCompactGauge(true)} // [UX] Shrink on Focus
                        onBlur={() => setIsCompactGauge(false)} // Expand on Blur (Optional, maybe keep it small?)
                        placeholder="고민을 입력하세요..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-gold/50 focus:ring-1 focus:ring-primary-gold/50 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-primary-gold text-black rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>

            {/* Level Up Modal */}
            <AnimatePresence>
                {showModal && (
                    <LevelUpModal
                        level={2}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Payment Modal (Reconnected) */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentRequested={(depositorName) => {
                    setPaymentStatus('SUCCESS');
                    setIsPaymentModalOpen(false);
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: `:::LEVEL_UP:2::: '${depositorName}'님, 입금 요청이 접수되었습니다. 확인 후 정밀 분석 리포트가 해금됩니다! 🎉`
                    }]);
                }}
            />

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-800 border border-primary-gold/30 rounded-full shadow-2xl flex items-center gap-3 z-[100]"
                    >
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">결제 요청이 전송되었습니다.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
