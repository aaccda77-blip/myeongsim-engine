'use client';
import DrillDownIconMenu from './DrillDownIconMenu';
import { TextSanitizer } from '@/modules/TextSanitizer';
import dynamic from 'next/dynamic';
const DarkCodeCompassionTransformerModal = dynamic(() => import('@/components/coaching/DarkCodeCompassionTransformerModal'), { ssr: false });

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useChat } from 'ai/react';
import { Send, User, Sparkles, CheckCircle2, Zap, Shield, BrainCircuit, Crown, MessageCircleHeart, Lock, Home, ArrowLeft, MessageSquarePlus, Volume2, VolumeX, Copy, Check, Heart, Smile, Mic, MicOff, Music, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { getMindArchitectureTitle, getMotivationEngineTitle, getDiscProtocolTitle, getBig5MatrixTitle } from '@/constants/mindArchitecture';
import Footer from '@/components/Footer';
import CompanyInfoModal from '../modals/CompanyInfoModal';
import MicroChatPassModal from '../modals/MicroChatPassModal';
import MindStateSelectorModal from '../modals/MindStateSelectorModal';
import TrendingTopicModal from '../modals/TrendingTopicModal';
import ChatMessageList from './modules/ChatMessageList';
import ChatMoodSwitchBar from './modules/ChatMoodSwitchBar';
import ChatTrendingChipsBar from './modules/ChatTrendingChipsBar';
import { CoinShowerEffect, CoinShowerRef } from '@/components/effects/CoinShowerEffect';


const PSYCH_PROTOCOLS = [
    { code: 'MBCT', name: '마음챙김 인지코칭', desc: 'Mindfulness-Based Cognitive Therapy: 뇌 편도체 반응 진정 및 자각의 알아차림 (Zero-Point)', badge: 'bg-sky-500/20 text-sky-300 border-sky-400/50' },
    { code: 'CFT', name: '자비중심코칭', desc: 'Compassion-Focused Therapy: 자기 자비 및 위협 계통 진정, 다정한 내면 수용 (제3세대 뇌과학)', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50' },
    { code: 'ACT', name: '수용전념코칭', desc: 'Acceptance & Commitment Therapy: 생각을 사실과 분리하는 인지 탈융합 (Cognitive Defusion)', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' },
    { code: 'DBT', name: '변증법적 행동코칭', desc: 'Dialectical Behavior Therapy: 극단적 감정 폭주 차단, 중용의 지혜 및 현명한 마음(Wise Mind) 조율', badge: 'bg-amber-500/20 text-amber-300 border-amber-400/50' },
    { code: 'MBSR', name: '스트레스 감세', desc: 'Mindfulness-Based Stress Reduction: 자율신경계 밸런싱 및 뇌 신경가소성(Neuroplasticity) 재배선', badge: 'bg-purple-500/20 text-purple-300 border-purple-400/50' },
    { code: 'IFS/IFT', name: '내면가족체계', desc: 'Internal Family Systems Therapy: 불안과 완벽주의(다크코드)를 생존 보호자(Protector)로 자비롭게 수용', badge: 'bg-pink-500/20 text-pink-300 border-pink-400/50' },
    { code: 'MSC', name: '마음챙김 자기자비', desc: 'Mindful Self-Compassion: 자기 비판 멈춤 및 내면의 다정한 수용 온기 주입', badge: 'bg-rose-500/20 text-rose-300 border-rose-400/50' },
    { code: 'IFP', name: '통합 자각 심리코칭', desc: 'Integral Focus Psychotherapy: 사주 에너지 흐름과 대뇌피질 역량의 1:1 싱크로 재배선', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' },
];

const renderFormattedText = (text: string) => {
    let clean = TextSanitizer.ensureTwoStepStructure(text).replace(/^---$/gm, '').trim();
    if (!clean) return null;

    const parts = clean.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={idx} className="text-amber-300 font-extrabold px-0.5">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
};

interface MyeongsimChatProps {
    userId?: string;
}

export default function MyeongsimChat({ userId = 'guest-id' }: MyeongsimChatProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [selectedProtocol, setSelectedProtocol] = useState<typeof PSYCH_PROTOCOLS[0] | null>(null);
    const [selectedMood, setSelectedMood] = useState<string>('불안·완벽주의');
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [sttError, setSttError] = useState<string | null>(null);
    const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
    const [reactions, setReactions] = useState<Record<string, string>>({});
    const [showCardModal, setShowCardModal] = useState<boolean>(false);
    const [showCompanyModal, setShowCompanyModal] = useState<boolean>(false);
    const [showMicroPassModal, setShowMicroPassModal] = useState<boolean>(false);
    const [showMindStateModal, setShowMindStateModal] = useState<boolean>(false);
    const [showDarkCodeModal, setShowDarkCodeModal] = useState<boolean>(false);
    const [showTrendingTopicModal, setShowTrendingTopicModal] = useState<boolean>(false);
    const [isPaidUser, setIsPaidUser] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('myeongsim_paid_user') === 'true';
        }
        return false;
    });
    const [isPendingApproval, setIsPendingApproval] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('myeongsim_pending_approval') === 'true';
        }
        return false;
    });
    const [depositorName, setDepositorName] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('myeongsim_depositor_name') || '';
        }
        return '';
    });
    const [cumulativeCount, setCumulativeCount] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('myeongsim_total_user_messages');
            return saved ? parseInt(saved, 10) : 0;
        }
        return 0;
    });
    const [isCheckingApproval, setIsCheckingApproval] = useState<boolean>(false);
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);
    const reportData = useReportStore((s) => s.reportData);
    const coinShowerRef = useRef<CoinShowerRef>(null);

    const clientSajuData = useMemo(() => {
        let metaData: any = {};
        let psychData: any = {};

        if (reportData) {
            metaData = reportData.meta || {};
            psychData = (reportData as any).psych || {};
        }

        if (typeof window !== 'undefined') {
            try {
                const rawOnboarding = localStorage.getItem('user_onboarding_data');
                if (rawOnboarding) {
                    const parsed = JSON.parse(rawOnboarding);
                    metaData = { ...metaData, ...parsed, ...(parsed.meta || {}) };
                    psychData = { ...psychData, ...parsed, ...(parsed.psych || {}) };
                }
                const storeRaw = localStorage.getItem('myeongsim_report_store');
                if (storeRaw) {
                    const parsed = JSON.parse(storeRaw);
                    const stateData = parsed.state?.reportData || parsed;
                    metaData = { ...metaData, ...(stateData.meta || {}) };
                    psychData = { ...psychData, ...(stateData.psych || {}) };
                }
                const rawSaju = localStorage.getItem('user_saju_info');
                if (rawSaju) {
                    const parsed = JSON.parse(rawSaju);
                    metaData = { ...metaData, ...parsed };
                }
            } catch (e) {}
        }

        return {
            userName: reportData?.userName || (reportData as any)?.name || metaData?.userName || '명심가',
            birthDate: reportData?.birthDate || (reportData as any)?.birth_date || metaData?.birthDate || '',
            birthTime: reportData?.birthTime || (reportData as any)?.birth_time || metaData?.birthTime || '12:00',
            calendarType: (reportData as any)?.calendarType || (reportData as any)?.calendar_type || metaData?.calendarType || 'solar',
            gender: reportData?.gender || metaData?.gender || 'female',
            dayMaster: reportData?.saju?.dayMaster || metaData?.dayMaster || '辛',
            fourPillars: reportData?.saju?.fourPillars,
            meta: metaData,
            psych: psychData,
            mbti: metaData?.mbti || psychData?.mbti || metaData?.personalityType || '',
            enneagram: metaData?.enneagram || psychData?.enneagram || '',
            big5: metaData?.big5 || metaData?.bigFive || psychData?.big5 || '',
            disc: metaData?.disc || psychData?.disc || '',
            stressFactors: metaData?.stressFactors || metaData?.current_stressors || [],
            sleepQuality: metaData?.sleepQuality || metaData?.sleep_quality || 3,
            energyLevel: metaData?.energyLevel || metaData?.energy_level || 50,
        };
    }, [reportData]);

    const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, isLoading, append } = useChat({
        api: '/api/myeongsim-chat',
        body: { userId, sessionId, sajuData: clientSajuData },
        onError: (err) => {
            console.error('[Myeongsim Chat UI Error]', err);
        }
    });

    const sessionUserCount = useMemo(() => {
        return (messages || []).filter(m => m.role === 'user').length;
    }, [messages]);

    const userMessageCount = useMemo(() => {
        return Math.max(sessionUserCount, cumulativeCount);
    }, [sessionUserCount, cumulativeCount]);

    // Update cumulative count in localStorage when user sends a message
    useEffect(() => {
        if (sessionUserCount > 0 && typeof window !== 'undefined') {
            const currentTotal = Math.max(sessionUserCount, cumulativeCount);
            localStorage.setItem('myeongsim_total_user_messages', currentTotal.toString());
        }
    }, [sessionUserCount, cumulativeCount]);

    // Function to check approval status from server
    const checkApprovalStatus = async () => {
        if (typeof window === 'undefined') return;
        setIsCheckingApproval(true);
        try {
            const savedName = localStorage.getItem('myeongsim_depositor_name') || depositorName;
            const res = await fetch(`/api/payment/check-approval?name=${encodeURIComponent(savedName)}&userId=${encodeURIComponent(userId)}`);
            const data = await res.json();
            
            if (data.approved) {
                localStorage.setItem('myeongsim_paid_user', 'true');
                localStorage.removeItem('myeongsim_pending_approval');
                localStorage.setItem('myeongsim_total_user_messages', '0');
                setIsPaidUser(true);
                setIsPendingApproval(false);
                setCumulativeCount(0);
                alert('🎉 무통장 입금 승인이 확인되었습니다! 1:1 맞춤 챗봇 코칭 3회가 충전되었습니다.');
            } else if (data.isPending) {
                alert('⏳ 아직 입금 확인 중입니다. 담당자가 1~5분 이내 입금 확인 후 승인해 드립니다.');
            } else {
                alert('승인 내역을 확인하지 못했습니다. 입금자 성함을 다시 확인해 주세요.');
            }
        } catch (e) {
            console.error('Check approval error:', e);
        } finally {
            setIsCheckingApproval(false);
        }
    };

    
    const MOOD_CHIP_MAP: Record<string, string[]> = {
        '불안·완벽주의': [
            '💰 "내 사주로 돈 벌 수 있어? 2026년 사업·재물운 정밀 분석"',
            '🧠 "완벽주의와 조급증 다크코드 뇌 쿨링(ACT) 해줘"',
            '🌙 "밤/새벽에 일해야 해, 낮에 해야 해? 내 맞춤 시간대"',
            '🔮 "올해 대박 날 3S 마이크로 실천 지침 알려줘"'
        ],
        '조바심·스트레스': [
            '🔥 "속도만 내다 번아웃 올 것 같은데 메타인지로 정밀 교정해줘"',
            '⚡ "890원 마이크로 퍼널 ➔ B2C/B2B 수익화 구조 사주 풀이해줘"',
            '🧘 "조급함이 솟구칠 때 뇌 편도체 리셋 1분 3S 스위치 알려줘"',
            '📜 "내 사주에 수(水) 냉각수 부족한지 4D 풀 스캔해줘"'
        ],
        '무기력·혼란': [
            '🌧️ "에너지가 고갈되었는데 2026년 병오년 활력 기운 재배선해줘"',
            '🌱 "내 가슴속 창의적 영감을 재물(木)로 바꾸는 방법 풀이해줘"',
            '🛡️ "자책과 무기력감 생존 보호자(IFS) 자비 수용 에세이 부탁해"',
            '👑 "흔들리는 내 영혼의 군주 통치권 회복하는 명상 가이드"'
        ],
        '평온·영점 각성': [
            '✨ "오늘 432Hz 제로포인트 순수 자각 명상 가이드 알려줘"',
            '💎 "60갑자 중 내 일간 기질에 맞는 80% 미학 실천법"',
            '🚀 "2026년 정식 특허 출원 후 B2B 30만원 스케일업 운세"',
            '💖 "내 영혼을 따뜻하게 안아주는 3S 감동 에세이 리포트"'
        ]
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 과거 대화 내역 불러오기
    useEffect(() => {
        if (userId && !userId.startsWith('guest-')) {
            fetch(`/api/myeongsim-chat/history?userId=${userId}${sessionId ? `&sessionId=${sessionId}` : ''}`)
                .then(res => res.json())
                .then(data => {
                    if (data.sessionId) {
                        setSessionId(data.sessionId);
                    }
                    if (data.messages && data.messages.length > 0) {
                        setMessages(data.messages);
                    }
                })
                .catch(err => console.error('[Myeongsim Chat] Failed to load history:', err));
        }
    }, [userId, setMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        if (userMessageCount >= 3 && !isPaidUser) {
            setShowMicroPassModal(true);
            return;
        }
        handleSubmit(e);
        coinShowerRef.current?.triggerCoinShower();
    };

    const handleChipClick = (chipText: string) => {
        if (isLoading) return;
        if (userMessageCount >= 3 && !isPaidUser) {
            setShowMicroPassModal(true);
            return;
        } 
        const parts = chipText.split('"');
        const cleanPrompt = parts.length >= 2 ? parts[1] : chipText;
        append({
            role: 'user',
            content: cleanPrompt
        });
        coinShowerRef.current?.triggerCoinShower();
    };

    const handlePrescriptionClick = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/report';
        }
    };

    const handleGoHome = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    const handleNewChat = () => {
        if (isLoading) return;
        setMessages([]);
        setSessionId(crypto.randomUUID());
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setSpeakingMessageId(null);
    };

    const handleSpeak = async (messageId: string, text: string) => {
        if (speakingMessageId === messageId) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            setSpeakingMessageId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        setSpeakingMessageId(messageId);
        const cleanText = text.replace(/[*#_~`[\]()]/g, '');

        // 1. 고품질 구글 Neural2 서버 사이드 명상 나레이션 TTS 우선 호출
        try {
            const res = await fetch('/api/tts/supertone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: cleanText.slice(0, 350),
                    voiceId: 'psycho', // 딥 감성 수용 나레이터 (ko-KR-Neural2-B)
                    voice_settings: {
                        pitch: -1.0,  // 따뜻하고 깊은 나레이션 톤
                        rate: 0.88    // 마음을 가다듬는 평온한 호흡 속도
                    }
                }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);
                audioRef.current = audio;
                audio.onended = () => {
                    setSpeakingMessageId(null);
                    audioRef.current = null;
                };
                audio.onerror = () => {
                    fallbackBrowserTTS(messageId, cleanText);
                };
                await audio.play();
                return;
            }
        } catch (e) {
            console.warn('[Server Neural2 TTS Failed, falling back to Browser Neural Voice]', e);
        }

        // 2. 서버 TTS 실패 시 브라우저 최상급 Neural/Natural 보이스로 튜닝 폴백
        fallbackBrowserTTS(messageId, cleanText);
    };

    const fallbackBrowserTTS = (messageId: string, cleanText: string) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            setSpeakingMessageId(null);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ko-KR';
        utterance.pitch = 0.9;  // 고주파 기계음 제거: 온기 있는 저음역대
        utterance.rate = 0.88;  // 명상 가이드 템포

        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(v => 
            v.lang.includes('ko') && (
                v.name.includes('Natural') || 
                v.name.includes('Neural') || 
                v.name.includes('Google') || 
                v.name.includes('SunHi') || 
                v.name.includes('Yuna') || 
                v.name.includes('Heami')
            )
        ) || voices.find(v => v.lang.includes('ko'));

        if (naturalVoice) {
            utterance.voice = naturalVoice;
        }

        utterance.onend = () => setSpeakingMessageId(null);
        utterance.onerror = () => setSpeakingMessageId(null);
        window.speechSynthesis.speak(utterance);
    };

    const handleCopy = (messageId: string, text: string) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            const cleanText = text.replace(/[*#_~`[\]()]/g, '');
            navigator.clipboard.writeText(cleanText);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        }
    };

    const handleReaction = (messageId: string, emoji: string) => {
        setReactions(prev => ({
            ...prev,
            [messageId]: prev[messageId] === emoji ? '' : emoji
        }));
    };

    const toggle432HzBgm = () => {
        if (typeof window === 'undefined') return;
        if (isBgmPlaying) {
            if (oscRef.current) {
                try { oscRef.current.stop(); } catch (e) {}
                oscRef.current = null;
            }
            if (audioCtxRef.current) {
                try { audioCtxRef.current.close(); } catch (e) {}
                audioCtxRef.current = null;
            }
            setIsBgmPlaying(false);
            return;
        }

        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioCtx();
            audioCtxRef.current = ctx;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(432, ctx.currentTime);
            gain.gain.setValueAtTime(0.035, ctx.currentTime);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            oscRef.current = osc;
            setIsBgmPlaying(true);
        } catch (e) {
            console.error('[432Hz Audio Error]', e);
            setIsBgmPlaying(false);
        }
    };

    const toggleListening = async () => {
        if (typeof window === 'undefined') return;
        setSttError(null);

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSttError('사용 중이신 브라우저에서는 음성 인식을 지원하지 않습니다. Chrome/Safari/Edge 브라우저를 이용해 주세요.');
            return;
        }

        if (isListening) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
            }
            setIsListening(false);
            return;
        }

        // 데스크톱 브라우저 마이크 접근 권한 팝업 강제 유도
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach((track) => track.stop());
            }
        } catch (mediaErr: any) {
            console.error('[Microphone Permission Error]', mediaErr);
            setSttError('🎙️ 마이크 권한이 차단되어 있습니다. 브라우저 주소창 좌측 🔒 아이콘(또는 마이크 아이콘)을 눌러 [마이크 허용]으로 변경해 주세요.');
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'ko-KR';
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => {
                setIsListening(true);
                setSttError(null);
            };

            recognition.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (transcript.trim()) {
                    setInput((prev: string) => {
                        const cleanPrev = prev ? prev.trim() + ' ' : '';
                        return cleanPrev + transcript;
                    });
                }
            };

            recognition.onerror = (err: any) => {
                console.error('[STT Error]', err);
                setIsListening(false);
                if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
                    setSttError('🎙️ 마이크 권한이 거부되었습니다. 주소창 좌측 마이크 아이콘을 눌러 허용으로 변경해 주세요.');
                } else if (err.error !== 'no-speech') {
                    setSttError(`🎙️ 음성 인식 오류 (${err.error || '알 수 없는 오류'}). 다시 시도해 주세요.`);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (e: any) {
            console.error('[STT Launch Error]', e);
            setIsListening(false);
            setSttError('🎙️ 음성 인식 시작에 실패했습니다. Chrome 또는 Edge 브라우저에서 실행해 주세요.');
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] sm:h-[780px] sm:max-h-[92vh] w-full max-w-4xl bg-[#040714] sm:bg-[#040714]/95 backdrop-blur-3xl border-0 sm:border border-white/15 rounded-none sm:rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(15,23,42,0.8)] font-sans relative text-left">
            
            {/* ── 1. 세계 최고 수준 웰니스 헤더 (모바일 초강력 콤팩트 최적화) ── */}
            <header className="p-3 sm:p-5 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/80 flex flex-col gap-2.5 shrink-0 relative z-20">
                <div className="flex items-center justify-between gap-2">
                    {/* 브랜딩 & 아바타 */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <button
                            onClick={handleGoHome}
                            title="메인으로 돌아가기"
                            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 active:scale-95 flex items-center justify-center shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 text-amber-300" />
                        </button>

                        <div className="relative group shrink-0">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400/30 via-purple-600/30 to-indigo-600/30 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-nowrap">
                                <h2 className="text-white font-black text-sm sm:text-lg tracking-tight whitespace-nowrap">명심 AI 코치</h2>
                                <span className="text-[9px] sm:text-[10px] text-amber-300 font-mono font-extrabold bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-400/30 shadow-inner whitespace-nowrap">
                                    📜 특허출원중
                                </span>
                            </div>
                            <p className="text-gray-400 text-[11px] mt-0.5 hidden sm:flex items-center gap-1.5">
                                <span>세계 최고 수준 3세대 최신 심리 과학적 도구 & 사주 명리 융합 코칭</span>
                            </p>
                        </div>
                    </div>

                    {/* 컨트롤 버튼들 (모바일 반응형 콤팩트) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* 432Hz Ambient Healing Sound Toggle */}
                        <button
                            type="button"
                            onClick={toggle432HzBgm}
                            title={isBgmPlaying ? '432Hz 힐링 음원 끄기' : '432Hz 평온 명상 음원 켜기'}
                            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 border cursor-pointer whitespace-nowrap ${
                                isBgmPlaying
                                    ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                                    : 'bg-white/5 hover:bg-white/15 text-amber-300 border-amber-400/30'
                            }`}
                        >
                            <Music size={13} className={isBgmPlaying ? 'animate-spin' : ''} />
                            <span className="text-[11px] sm:text-xs">{isBgmPlaying ? '432Hz 켜짐' : '432Hz'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowDarkCodeModal(true)}
                            title="책 3장 연동 다크코드 자비 변환기 & 음성 안식 스캔"
                            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-400/50 text-purple-200 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                        >
                            <Shield className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                            <span>🛡️ 다크코드 변환</span>
                        </button>

                        <button
                            onClick={handleNewChat}
                            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 whitespace-nowrap"
                        >
                            <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-300" />
                            <span className="hidden sm:inline">새 대화</span>
                        </button>
                    </div>
                </div>

                {/* ── 3세대 최신 심리 과학적 도구 8대 라이브 오라 바 (모바일 콤팩트) ── */}
                <div className="bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2 shadow-inner overflow-hidden">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                        <span className="text-[10px] sm:text-xs font-black text-cyan-300 font-mono tracking-tight whitespace-nowrap">
                            🧠 3세대 최신 심리 과학적 도구:
                        </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar py-0.5">
                        {PSYCH_PROTOCOLS.map((p) => (
                            <button
                                key={p.code}
                                type="button"
                                onClick={() => setSelectedProtocol(p)}
                                title={p.desc}
                                className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black font-mono transition-all border ${p.badge} hover:scale-105 active:scale-95 cursor-pointer shadow-sm whitespace-nowrap`}
                            >
                                {p.code}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── 실시간 3S 코칭 진도율 & 뇌파 공명 바 ── */}
                <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold">
                        <span className="text-amber-300 flex items-center gap-1.5 truncate">
                            <Activity size={12} className="text-amber-400 animate-pulse shrink-0" />
                            <span className="truncate">3S 진도: {messages.length <= 2 ? '🛡️ SCAN (33%)' : messages.length <= 6 ? '🧠 SYNC (66%)' : '👑 SHIFT (100%)'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            {isPaidUser ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-black shadow-sm">
                                    👑 VVIP 무제한
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => userMessageCount >= 3 && setShowMicroPassModal(true)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border transition-all ${
                                        userMessageCount >= 3
                                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/50 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)] cursor-pointer'
                                            : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                    }`}
                                >
                                    {userMessageCount >= 3 ? '🔒 무료 코칭 완료 (3/3회 - 잠금)' : `🎯 무료 코칭 [${userMessageCount}/3회 완료]`}
                                </button>
                            )}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-white/10 flex">
                        <div
                            className="h-full bg-gradient-to-r from-rose-500 via-blue-400 to-amber-400 transition-all duration-500 rounded-full"
                            style={{
                                width: messages.length === 0 ? '15%' : `${Math.min(100, Math.max(33, (messages.length / 8) * 100))}%`
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* ── [ONBOARDING SYNC CONFIRMATION BANNER] 4단계 온보딩 데이터(MBTI, 애니어그램, 수면, 에너지, 스트레스) 100% 연동 확인 배너 ── */}
            <div className="bg-gradient-to-r from-amber-950/90 via-purple-950/80 to-slate-950 border-b border-amber-400/40 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 shrink-0 z-10 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 min-w-0 overflow-x-auto no-scrollbar py-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs shrink-0 shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={12} className="fill-slate-950 text-amber-400 shrink-0" />
                        <span>기질·심리지표 동기화 완료</span>
                    </span>
                    <div className="text-[11px] sm:text-xs text-amber-200 font-medium whitespace-nowrap flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-white">{clientSajuData?.userName || '회원'}님</span>
                        <span className="text-amber-400/60">|</span>
                        <span className="text-yellow-300 font-bold">{clientSajuData?.dayMaster ? `${clientSajuData.dayMaster}일간` : '사주 분석'}</span>
                        {clientSajuData?.mbti && (
                            <>
                                <span className="text-amber-400/60">|</span>
                                <span className="text-emerald-300 font-bold">16대 마인드: {getMindArchitectureTitle(clientSajuData.mbti)}</span>
                            </>
                        )}
                        {clientSajuData?.enneagram && (
                            <>
                                <span className="text-amber-400/60">|</span>
                                <span className="text-purple-300 font-bold">코어 엔진: {getMotivationEngineTitle(clientSajuData.enneagram)}</span>
                            </>
                        )}
                        {clientSajuData?.disc && (
                            <>
                                <span className="text-amber-400/60">|</span>
                                <span className="text-cyan-300 font-bold">행동: {getDiscProtocolTitle(clientSajuData.disc)}</span>
                            </>
                        )}
                        {clientSajuData?.big5 && (
                            <>
                                <span className="text-amber-400/60">|</span>
                                <span className="text-sky-300 font-bold">멘탈: {getBig5MatrixTitle(clientSajuData.big5)}</span>
                            </>
                        )}
                        {clientSajuData?.energyLevel && (
                            <>
                                <span className="text-amber-400/60">|</span>
                                <span className="text-amber-300">에너지 {clientSajuData.energyLevel}%</span>
                            </>
                        )}
                        {clientSajuData?.sleepQuality && (
                            <>
                                <span className="text-amber-400/60">|</span>
                                <span className="text-sky-300">수면 {clientSajuData.sleepQuality}점</span>
                            </>
                        )}
                    </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 hidden md:inline-flex items-center gap-1">
                    <span>⚡ AI 1:1 맞춤 연결됨</span>
                </span>
            </div>

            {/* ── 2. 메시지 영역 ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar relative min-h-0">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-5 py-8">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative">
                            <Sparkles className="w-10 h-10 text-amber-300 animate-pulse" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-lg font-black text-white">안녕하세요! 영혼의 AI 코치입니다 ✨</h3>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-keep font-medium">
                                연동된 생년월일과 사주팔자를 바탕으로<br />
                                <strong>3세대 현장 코칭심리학(ACT·CFT·MBCT·IFS) 8대 과학적 도구</strong>를 가동하여 1:1 핑퐁 코칭을 진행합니다.
                            </p>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2 justify-center max-w-md">
                            <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
                                🛡️ Step 1. SCAN (다크코드 수용)
                            </span>
                            <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full font-bold">
                                🧠 Step 2. SYNC (뇌회로 재배선)
                            </span>
                            <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                                👑 Step 3. SHIFT (영점 각성)
                            </span>
                        </div>
                    </div>
                )}

                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 sm:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} ${
                            userMessageCount >= 3 && !isPaidUser && messages.indexOf(m) >= 6
                                ? 'blur-sm opacity-40 select-none pointer-events-none'
                                : ''
                        }`}
                    >
                        {/* 아바타 */}
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-2xl flex items-center justify-center shadow-lg ${
                            m.role === 'user'
                                ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 border border-indigo-400/40 text-white'
                                : 'bg-gradient-to-br from-amber-500/20 to-purple-600/30 border border-amber-400/40 text-amber-300'
                        }`}>
                            {m.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        </div>

                        {/* 메시지 말풍선 */}
                        <div className={`max-w-[85%] sm:max-w-[80%] px-5 py-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                            m.role === 'user'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs shadow-lg font-medium'
                                : 'bg-[#0b1329]/95 border border-white/15 text-gray-200 rounded-tl-xs shadow-2xl space-y-3'
                        }`}>
                            {m.role === 'user' ? (
                                <span>{m.content}</span>
                            ) : (
                                <div className="space-y-3">
                                    {(() => {
    let scanDone = false;
    let syncDone = false;
    let shiftDone = false;
    return m.content.split('\n\n').map((paragraph, i) => {
        const formatted = renderFormattedText(paragraph);
        if (!formatted) return null;

        if (!scanDone && (paragraph.includes('Scan') || paragraph.includes('다크코드') || paragraph.includes('보호막'))) {
            scanDone = true;
            return (
                <div key={i} className="bg-rose-950/40 border-l-4 border-rose-500 p-3 rounded-r-2xl shadow-inner">
                    <span className="text-xs text-rose-400 font-black block mb-1">🛡️ Step 1. SCAN (다크코드 자비 수용)</span>
                    <div className="text-rose-100/90 leading-relaxed">{formatted}</div>
                </div>
            );
        }
        if (!syncDone && (paragraph.includes('Sync') || paragraph.includes('뉴럴코드') || paragraph.includes('재배선'))) {
            syncDone = true;
            return (
                <div key={i} className="bg-blue-950/40 border-l-4 border-blue-400 p-3 rounded-r-2xl shadow-inner">
                    <span className="text-xs text-blue-400 font-black block mb-1">🧠 Step 2. SYNC (뉴럴코드 역량 재배선)</span>
                    <div className="text-blue-100/90 leading-relaxed">{formatted}</div>
                </div>
            );
        }
        if (!shiftDone && (paragraph.includes('Shift') || paragraph.includes('메타코드') || paragraph.includes('제로포인트'))) {
            shiftDone = true;
            return (
                <div key={i} className="bg-amber-950/40 border-l-4 border-amber-500 p-3 rounded-r-2xl shadow-inner">
                    <span className="text-xs text-amber-400 font-black block mb-1">👑 Step 3. SHIFT (메타코드 영점 각성)</span>
                    <div className="text-amber-100/90 leading-relaxed">{formatted}</div>
                </div>
            );
        }
        return <p key={i} className="leading-relaxed">{formatted}</p>;
    });
})()}

                                    {/* 이모지 성찰 공감 칩 */}
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[
                                            { emoji: '💖', label: '울림' },
                                            { emoji: '✨', label: '자각' },
                                            { emoji: '🧘', label: '평온' }
                                        ].map((rec) => (
                                            <button
                                                key={rec.emoji}
                                                type="button"
                                                onClick={() => handleReaction(m.id, rec.emoji)}
                                                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                                    reactions[m.id] === rec.emoji
                                                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black scale-105'
                                                        : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
                                                }`}
                                            >
                                                {rec.emoji} {rec.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 3세대 현장 코칭심리학 메커니즘 & 음성/복사 인터랙션 툴바 */}
                                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono pt-3 border-t border-white/10 mt-3 flex-wrap">
                                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                                            <span>🔬 3세대 현장 코칭심리학 메커니즘 (ACT · CFT · MBCT · IFS)</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 ml-auto">
                                            {/* TTS 음성 청취 버튼 */}
                                            <button
                                                type="button"
                                                onClick={() => handleSpeak(m.id, m.content)}
                                                className={`px-2.5 py-1 rounded-xl font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                                                    speakingMessageId === m.id
                                                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                                                        : 'bg-white/5 hover:bg-white/15 text-amber-300 border-amber-400/30'
                                                }`}
                                            >
                                                {speakingMessageId === m.id ? (
                                                    <>
                                                        <VolumeX size={12} />
                                                        <span>음성 정지</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Volume2 size={12} />
                                                        <span>🔊 음성 힐링</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* 1:1 영혼 가이드 카드 보기 버튼 */}
                                            <button
                                                type="button"
                                                onClick={() => setShowCardModal(true)}
                                                className="px-3 py-1.5 rounded-xl font-bold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer text-xs min-h-[36px] shadow-sm"
                                            >
                                                <FileText size={12} />
                                                <span>📜 1:1 가이드 카드</span>
                                            </button>

                                            {/* 복사 버튼 */}
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(m.id, m.content)}
                                                className="px-3 py-1.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer text-xs min-h-[36px] shadow-sm"
                                            >
                                                {copiedMessageId === m.id ? (
                                                    <>
                                                        <Check size={12} className="text-emerald-400" />
                                                        <span className="text-emerald-400 font-bold">복사됨!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>복사</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                        </div>
                        <div className="bg-[#0b1329]/95 border border-white/15 px-5 py-4 rounded-3xl rounded-tl-xs flex items-center gap-3 shadow-xl">
                            <span className="text-xs sm:text-sm text-amber-300 font-extrabold animate-pulse">
                                명심 AI 코치가 함께 호흡하며 영혼의 응답을 직조하고 있습니다...
                            </span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* ── 3회 무료 완료 후 또는 승인 대기 중 챗봇 내 890원 블러 잠금 마케팅 카드 ── */}
                {(userMessageCount >= 3 || isPendingApproval) && !isPaidUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-[#0c1427]/95 to-slate-950 border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] relative overflow-hidden text-center text-white z-30"
                    >
                        {/* Glow & Backdrop */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Lock Icon & Badge */}
                        <div className="flex flex-col items-center mb-3">
                            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
                                <Lock className="w-7 h-7" />
                            </div>
                            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-sm font-mono">
                                🔒 첫 3회 무료 코칭 완료 (서비스 잠금)
                            </span>
                        </div>

                        {/* Main Title */}
                        {isPendingApproval ? (
                            <div className="space-y-3 mb-4">
                                <h3 className="text-lg sm:text-xl font-black text-emerald-300 mb-1 leading-snug break-keep">
                                    ⏳ 무통장 입금 승인 확인 중입니다
                                </h3>
                                <p className="text-xs text-gray-200 leading-relaxed">
                                    입금자 <strong className="text-amber-300">[{depositorName || '고객님'}]</strong> 성함으로 890원 입금 승인이 신청되었습니다.<br />
                                    담당자 확인 후 <span className="text-emerald-300 font-bold">1~5분 이내 3회 수다권</span>이 자동 개방됩니다.
                                </p>
                                <button
                                    onClick={checkApprovalStatus}
                                    disabled={isCheckingApproval}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <span>{isCheckingApproval ? '승인 상태 확인 중...' : '🔄 1초 입금 승인 상태 확인하기'}</span>
                                </button>
                            </div>
                        ) : (
                            <h3 className="text-lg sm:text-xl font-black text-white mb-2 leading-snug break-keep">
                                ☕ 890원으로<br />
                                <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy underline-offset-4 font-black">
                                    1:1 맞춤 영혼 코칭 3회 더 이어가기
                                </span>
                            </h3>
                        )}

                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto mb-4 font-medium break-keep">
                            커피 한 잔보다 가벼운 금액으로,<br />
                            내 안의 고민을 명심 멘토와 끊김 없이 해결해 보세요.
                        </p>

                        {/* Patent Notice Box */}
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-left mb-6 max-w-md mx-auto space-y-1">
                            <p className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                                <span>📜 [명심코칭 오픈 & 특허 출원 한정 혜택]</span>
                            </p>
                            <p className="text-[11px] text-gray-200 font-medium leading-[1.65]">
                                특허 정식 출원 승인 시까지 특별 혜택가 <strong className="text-amber-300 font-black">890원</strong>에 제공되며, 정식 등록 완료 후 <span className="text-amber-200 font-bold">B2C 99,000원</span> / <span className="text-amber-200 font-bold">B2B 기업용 300,000원(30만원)</span>으로 정상 인상될 예정입니다.
                            </p>
                        </div>

                        {/* 890원 Payment Button */}
                        <button
                            type="button"
                            onClick={() => setShowMicroPassModal(true)}
                            className="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                        >
                            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
                            <span>💳 890원에 3회 즉시 충전하기 ➔</span>
                        </button>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
                
                {/* ── 회사 정보 및 고객센터 하단 푸터 ── */}
                <Footer />
            </div>

            {/* ── 3. 상용화 결제 퍼널 브릿지 (CTA Banner - 모바일 최적화) ── */}
            {messages.length > 0 && (
                <div className="px-3 sm:px-5 py-2 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-950 border-t border-amber-500/30 flex items-center justify-between text-xs gap-2 shrink-0">
                    <span className="text-gray-200 font-bold flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
                        <Sparkles size={13} className="text-amber-400 shrink-0" />
                        <span className="truncate">{userMessageCount < 3 ? `🎁 첫 3회 1:1 영혼 코칭 무료 체험 중 (${userMessageCount}/3회)` : `🔒 3회 무료 완료! [특허 출원 한정 890원 / 추후 B2C 9만9천원, B2B 30만원 인상 예정]` }</span>
                    </span>
                    <button
                        onClick={() => setShowMicroPassModal(true)}
                        className="py-1 px-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black shadow-md transition-all active:scale-95 flex items-center gap-1 text-[11px] sm:text-xs shrink-0 whitespace-nowrap"
                    >
                        ⚡ 890원 소장하기
                    </button>
                </div>
            )}

            {/* ── 4. 실시간 감정 스위치 & 추천 대화 칩 (세밀 팝업창 100% 연동) ── */}
            <div className="p-2 sm:p-3 border-t border-white/10 bg-slate-950/90 flex flex-col gap-2 shrink-0">
                {/* 1) 마음 상태 행: 팝업 트리거 버튼 & 4대 대표 감정 칩 */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                        type="button"
                        onClick={() => setShowMindStateModal(true)}
                        className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-[10px] sm:text-[11px] font-black shrink-0 flex items-center gap-1 shadow-md active:scale-95 cursor-pointer whitespace-nowrap animate-pulse"
                    >
                        <Smile size={12} className="text-slate-950 fill-slate-950" />
                        <span>🎯 8대 세밀 감정 팝업창</span>
                    </button>
                    
                    {[
                        { label: '🛡️ 완벽주의·마비', prompt: '내 안의 완벽주의 다크코드를 80% 미학으로 뇌 쿨링(ACT) 해줘' },
                        { label: '🔥 번아웃·조바심', prompt: '엔진 과열로 가슴이 답답하고 번아웃 오는데 메타인지로 정밀 교정해줘' },
                        { label: '🌧️ 무기력·고갈', prompt: '에너지가 완전히 고갈되어 아무것도 못하겠는데 2026년 활력 기운 재배선해줘' },
                        { label: '👑 평온·영점 각성', prompt: '오늘의 432Hz 제로포인트 순수 자각 명상 가이드를 알려줘' },
                    ].map((emo, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                setSelectedMood(emo.label);
                                setShowMindStateModal(true);
                            }}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-400/20 border border-white/15 hover:border-amber-400/60 text-gray-200 hover:text-amber-200 text-[10px] sm:text-[11px] font-bold transition-all shrink-0 active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                            <span>{emo.label}</span>
                            <span className="text-[9px] text-amber-300/80 font-mono">✨팝업</span>
                        </button>
                    ))}
                </div>

                {/* 2) 2026 트렌딩 핫이슈 주제 행: 팝업 트리거 버튼 & 8대 주제 칩 */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setShowTrendingTopicModal(true)}
                        className="px-3 py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-[10px] sm:text-xs font-black shadow-lg shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                        <Sparkles size={13} className="text-yellow-300 animate-spin" />
                        <span>🔥 2026 핫이슈 주제 8선 팝업창</span>
                    </button>

                    {[
                        '💰 "사주 기반 재물·사업 890원 ➔ B2B 30만원 스케일업 정밀 분석"',
                        '🌙 "밤/새벽 집중형 vs 낮 활동형 듀얼트랙 시간대 처방"',
                        '🧠 "64괘 뇌 신경망 3S 1분 리셋 알고리즘"',
                        '🔮 "내 일간 기질에 맞는 80% 미학 실천 가이드"'
                    ].map((chip, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setShowTrendingTopicModal(true)}
                            className="text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/40 text-indigo-200 hover:text-white transition-all whitespace-nowrap shrink-0 shadow-md active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                            <span>{chip}</span>
                            <span className="text-[9px] text-cyan-300 font-mono">🔍팝업</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── 5. 메시지 입력 폼 ── */}
            <form onSubmit={onSubmit} className="p-3 sm:p-4 border-t border-white/10 bg-[#040714] shrink-0 relative">
                <div className="relative flex items-end">
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (input.trim() && !isLoading) {
                                    e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }
                            }
                        }}
                        placeholder="마음속 고민이나 질문을 편하게 남겨주세요... (Enter 전송)"
                        className="w-full bg-black/70 border border-white/15 focus:border-amber-400/60 rounded-2xl py-3.5 pl-4 pr-13 text-white placeholder:text-gray-500 outline-none transition-all resize-none overflow-y-auto no-scrollbar text-xs sm:text-sm font-medium"
                        rows={1}
                        style={{ minHeight: '50px', maxHeight: '130px' }}
                    />

                    {/* 전송 버튼 */}
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-2 w-9 h-9 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg active:scale-95 cursor-pointer"
                    >
                        <Send className="w-4.5 h-4.5" />
                    </button>
                </div>
            </form>

            {/* ── 회사 정보 및 고객센터 (1줄 스림 디자인) ── */}
            <div className="py-2 bg-[#040714] border-t border-white/5 shrink-0 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium">
                <button
                    type="button"
                    onClick={() => setShowCompanyModal(true)}
                    className="hover:text-gray-300 transition-colors underline cursor-pointer flex items-center gap-1"
                >
                    🏢 마인드플로우랩 사업자 정보 및 고객센터
                </button>
                <span>|</span>
                <a href="/terms" className="hover:text-gray-300 transition-colors cursor-pointer">이용약관</a>
                <span>|</span>
                <a href="/privacy" className="hover:text-gray-300 transition-colors font-bold cursor-pointer">개인정보처리방침</a>
            </div>

                        {/* 회사 정보 팝업 모달 */}
            <CompanyInfoModal 
                isOpen={showCompanyModal} 
                onClose={() => setShowCompanyModal(false)} 
            />

            {/* 890원 수다 3회 충전 팝업 모달 */}
            <MicroChatPassModal
                isOpen={showMicroPassModal}
                onClose={() => setShowMicroPassModal(false)}
                onSuccessPay={() => {
                    setIsPaidUser(true);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('myeongsim_paid_user', 'true');
                    }
                    setShowMicroPassModal(false);
                }}
            />

            {/* 8대 마음상태 세밀 조율 모달 */}
            <MindStateSelectorModal
                isOpen={showMindStateModal}
                onClose={() => setShowMindStateModal(false)}
                onSelectState={(moodLabel, promptText) => {
                    if (userMessageCount >= 3 && !isPaidUser) {
                        setShowMicroPassModal(true);
                        return;
                    }
                    setSelectedMood(moodLabel);
                    handleChipClick(promptText);
                    setShowMindStateModal(false);
                }}
            />

            {/* 2026 트렌딩 핫이슈 주제 8선 모달 */}
            <TrendingTopicModal
                isOpen={showTrendingTopicModal}
                onClose={() => setShowTrendingTopicModal(false)}
                onSelectTopic={(topicPrompt) => {
                    if (userMessageCount >= 3 && !isPaidUser) {
                        setShowMicroPassModal(true);
                        return;
                    }
                    handleChipClick(topicPrompt);
                    setShowTrendingTopicModal(false);
                }}
            />

            {/* ── 6. 3세대 현장 코칭심리학 8대 과학적 도구 상세 모달 ── */}
            {selectedProtocol && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4" onClick={() => setSelectedProtocol(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0b1329] border border-cyan-500/40 p-6 rounded-3xl max-w-lg w-full shadow-2xl space-y-4 relative text-left"
                    >
                        <button
                            onClick={() => setSelectedProtocol(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                        >
                            ✕ 닫기
                        </button>
                        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                            <BrainCircuit className="w-6 h-6 text-cyan-400" />
                            <div>
                                <h3 className="text-white font-black text-base sm:text-lg">제3세대 현장 코칭심리학 8대 과학적 엔진</h3>
                                <p className="text-gray-400 text-xs">명심 AI 코치 실시간 가동 근거중심 심리코칭 프로토콜</p>
                            </div>
                        </div>

                        <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                                <span className={`px-2.5 py-0.5 rounded text-xs font-black font-mono border ${selectedProtocol.badge}`}>
                                    {selectedProtocol.code}
                                </span>
                                <span className="text-cyan-300 font-extrabold text-xs">{selectedProtocol.name}</span>
                            </div>
                            <p className="text-xs text-cyan-100 leading-relaxed">{selectedProtocol.desc}</p>
                        </div>

                        <div className="text-[11px] text-gray-300 space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                            <p className="font-bold text-amber-300 flex items-center gap-1.5">
                                <Sparkles size={14} /> AI 실시간 융합 작동 메커니즘
                            </p>
                            <p className="leading-relaxed">
                                명심 AI 코치는 사용자와 대화하는 도중 사고 왜곡, 불안, 완벽주의를 실시간 감지하여 <strong>{selectedProtocol.name}({selectedProtocol.code})</strong>의 실전 코칭적 도구를 타고난 사주 오행 기운과 1:1로 맞물려 가동합니다.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* ── 7. 1:1 영혼 가이드 카드 팝업 모달 ── */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={() => setShowCardModal(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-b from-[#0b1329] via-[#080d1f] to-black border-2 border-amber-400/50 p-6 sm:p-7 rounded-[32px] max-w-md w-full shadow-[0_0_80px_rgba(245,158,11,0.3)] space-y-5 relative text-left"
                    >
                        <button
                            onClick={() => setShowCardModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                        >
                            ✕ 닫기
                        </button>

                        <div className="flex items-center gap-3 border-b border-amber-400/20 pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-amber-300" />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                                    📜 2026 丙午年 1:1 웰니스 영혼 가이드전
                                </span>
                                <h3 className="text-white font-black text-lg sm:text-xl mt-1">
                                    {clientSajuData?.userName || '경윤'}님의 영점 자각 카드
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-gray-200 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-center text-amber-300 font-bold border-b border-white/10 pb-2">
                                <span>🔮 타고난 사주 일간:</span>
                                <span className="font-mono text-sm font-extrabold">{clientSajuData?.dayMaster || '辛金 (신금)'}</span>
                            </div>
                            <div className="flex justify-between items-center text-cyan-300 font-bold border-b border-white/10 pb-2">
                                <span>🧠 3세대 현장 코칭 심리 도구:</span>
                                <span>ACT 인지탈융합 & MBSR</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-300 font-bold">
                                <span>🎵 뇌파 공명 주파수:</span>
                                <span className="font-mono">432Hz Alpha Waves</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-400/30 text-xs text-amber-100 leading-relaxed font-medium">
                            <p className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                                <Sparkles size={14} /> 오늘의 영점 각성 주문 (Affirmation):
                            </p>
                            "내 안의 불안은 살아있음을 증명하는 다정한 파수꾼이다. 생각은 흘려보내고, 2026년 오롯이 빛나는 본래의 나로 귀환한다."
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={handlePrescriptionClick}
                                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black shadow-lg transition-all active:scale-95 text-xs text-center"
                            >
                                ⚡ 890원 정밀 가이드 리포트 발급
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            <CoinShowerEffect ref={coinShowerRef} />
        <DarkCodeCompassionTransformerModal
                isOpen={showDarkCodeModal}
                onClose={() => setShowDarkCodeModal(false)}
                userName={clientSajuData?.userName || '명심가'}
            />
        </div>
    );
}
