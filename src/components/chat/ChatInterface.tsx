'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, Loader2, Lock, FileText, Check, Trash2, ArrowUp, Zap, Volume2, CircleStop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GateKeeperModule } from '@/modules/GateKeeperModule';
import { QuestionModule } from '@/modules/QuestionModule';
import { InterruptQuestionModule } from '@/modules/InterruptQuestionModule';
import InterruptGauge from '@/components/gap/InterruptGauge';
import { GapAnalysisService } from '@/modules/GapAnalysisService';
import { useReportStore } from '@/store/useReportStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PaymentCard from './PaymentCard';
import LevelUpModal from './LevelUpModal';
import { AccountabilityModal } from '../coaching/AccountabilityModal'; // [Expert] Accountability
import ConsciousnessCard from './ConsciousnessCard';
import LevelGaugeCard from './LevelGaugeCard'; // [Added]
import BioSyncDashboard from '../dashboard/BioSyncDashboard'; // [Added] Bio-Sync Module
import { MindSyncStatusBar } from '../gamification/MindSyncStatusBar'; // [Fixed] Unified HUD Import
import { SajuMatrixCard } from './SajuMatrixCard';      // [Added] Visual Saju Matrix
import NeuralProfileCard from '../NeuralProfileCard'; // [Added] Neural Profile Visualizer
import { CalculateNeuralProfile } from '@/utils/NeuralProfileCalculator'; // [Added] Client-side Calc
// import MindTotemButton from './MindTotemButton'; // [Removed] Replaced with AI Image Gen
import ActionPlanCard from './ActionPlanCard'; // [Added] Visual Action Plan
// [Removed] GrowthMapIndicator integrated into StatusBar
import PatentLoadingTerminal from '../PatentLoadingTerminal'; // [Added] Visual Loading State
import { generateUUID } from '@/utils/uuid'; // [Added] Safe UUID
import { messaging } from "@/lib/firebase"; // [Added]
import { getToken } from "firebase/messaging"; // [Added]
import { TimeCapsule } from '@/components/ui/TimeCapsule'; // [Added] Pass Timer
import { UrgentNoticeModal } from '@/components/ui/UrgentNoticeModal'; // [Added] Urgent Notice
import { useAuthGuard } from '@/hooks/useAuthGuard'; // [Added] Auth Guard
import UserStatusHUD from '@/components/UserStatusHUD'; // [Added] User Status HUD
import { useFcmToken } from '@/hooks/useFcmToken'; // [Added] Hook Import
import { useBioData } from '@/hooks/useBioData'; // [Phase 2]
import { useVoice } from '@/hooks/useVoice'; // [Feature] Supertone Voice
// import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'; // [Feature] STT (Removed by User Request)
import { supabase } from '@/lib/supabaseClient'; // [Auth]
import { DeepScanQuestions } from '@/modules/DeepScanData'; // [Feature] 30 Qs
import PhoneAuthModal from '../auth/PhoneAuthModal'; // [Module] Auth UI
import { AuthService } from '@/modules/AuthService'; // [Module] Auth Logic
import { calculateSaju, calculateSajuStats } from '@/lib/saju/SajuEngine'; // [NEW] Unified Engine with Stats
import DrillDownIconMenu from './DrillDownIconMenu'; // [NEW] 3D Icon Menu
import SmartContextCard from '../features/SmartContextCard'; // [NEW] Smart Context Card
import BreathingGuideModal from '../bio/BreathingGuideModal'; // [NEW] SOS Breathing Guide
import { ETHICAL_GUIDELINES } from '@/constants/CodeOfEthics'; // [NEW] Safety Protocol
import { TalentAnalysisModule } from '@/modules/TalentAnalysisModule'; // [NEW] Talent Analysis
import TalentReportCard from './TalentReportCard'; // [NEW] Talent Card UI
import { searchPexelsImage, optimizePexelsQuery } from '@/utils/pexelsClient'; // [NEW] Pexels API (replaces Pollinations)
import { PexelsImage } from './PexelsImage'; // [NEW] Pexels Image Component
import BioEnergyBlueprintModal from '../modals/BioEnergyBlueprintModal'; // [NEW] Bio-Energy Blueprint Modal

// [Helper] Saju Keywords for Restoration
const getKeywords = (dm: string) => {
    if (dm.includes('갑') || dm.includes('을')) return ["성장", "창의성", "유연함"];
    if (dm.includes('병') || dm.includes('정')) return ["열정", "표현력", "활기"];
    if (dm.includes('무') || dm.includes('기')) return ["포용력", "신뢰", "안정"];
    if (dm.includes('경') || dm.includes('신')) return ["결단력", "정확성", "의리"];
    if (dm.includes('임') || dm.includes('계')) return ["지혜", "유동성", "통찰"];
    return ["다재다능", "밸런스"];
};

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
    initialIntent?: string | null; // [New] Auto-start Intent
}

export default function ChatInterface({ onClose, currentStage = 1, initialIntent }: ChatInterfaceProps) {
    const { reportData } = useReportStore();
    // [Wearable] Bio Data Hook
    const { bpm, isConnected, isConnecting, connect, disconnect, simulate, deviceName, simulateRecovery } = useBioData();
    const { speak, speakScript, isPlaying: isVoicePlaying, stop: stopVoice } = useVoice(); // [Feature] Voice
    // const { isListening, transcript, startListening, stopListening, error: sttError } = useSpeechRecognition(); // [Removed]
    const [isVoiceMode, setIsVoiceMode] = useState(false); // Flag for Auto-TTS

    // [Fix] STT Alert Replaced with Friendly Modal
    // [Removed] STT Error Handling

    // [Voice Logic] Sync Transcript to Input & Auto-Send
    // [Removed] Auto-Mic Stop Logic
    // [Removed] Mic Handler

    const [showBioSync, setShowBioSync] = useState(false); // [New Menu]
    const [emdrActive, setEmdrActive] = useState(false); // [New] EMDR Mode State
    const [showCrisisMode, setShowCrisisMode] = useState(false); // [Safety] Crisis Intervention Screen
    const [crisisPhase, setCrisisPhase] = useState<'breathing' | 'hope' | 'action'>('breathing'); // [Safety] Recovery Phase
    const [showSmartContext, setShowSmartContext] = useState(false); // [Smart Context] Energy Analysis Card
    const [showBreathingGuideFromChat, setShowBreathingGuideFromChat] = useState(false); // [NEW] SOS from chat crisis keywords
    const [showBlueprintModal, setShowBlueprintModal] = useState(false); // [NEW] Bio Blueprint Modal
    const [blueprintType, setBlueprintType] = useState<'HEAT' | 'COOL'>('HEAT'); // [NEW] Dynamic Type

    // [Auth] Login Modal State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedPaymentTier, setSelectedPaymentTier] = useState<'TRIAL' | 'PASS' | 'VIP'>('TRIAL');


    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "반갑습니다. **당신의 생체 리듬과 운명을 연결하는 명심 AI**입니다. ⌚✨\n\n지금 당신의 심장 박동에서 **변화의 신호**가 감지되고 있네요.\n겉으로 드러난 고민 뒤에 숨겨진 **진짜 마음의 소리**를 들려주세요. 제가 그 길을 밝혀드리겠습니다.\n\n🔒 *이 대화는 저장되지 않습니다. 창을 닫으면 즉시 삭제되며, 오직 당신만 알 수 있습니다.*"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // [New] Auto-Start Intent Logic (Updated for Natural Language Prompts)
    const hasStartedRef = useRef(false);
    useEffect(() => {
        if (initialIntent && !hasStartedRef.current && !isLoading) {
            hasStartedRef.current = true;
            console.log("🚀 [Auto-Start] Intent detected:", initialIntent);

            // Decode URI component just in case, though usually handled by frameworks
            const decodedIntent = decodeURIComponent(initialIntent);

            // 약간의 딜레이 후 실행 (초기화 안정성)
            setTimeout(() => {
                // Check if it's a known System Code (starts with 'ms_') or a Natural Language Prompt
                const isSystemCode = decodedIntent.startsWith('ms_') || decodedIntent === 'facilitation';

                if (isSystemCode) {
                    handleSend(decodedIntent, "SYSTEM_TRIGGER"); // Hidden System Trigger
                } else {
                    handleSend(decodedIntent); // Visible User Prompt
                }
            }, 800);
        }
    }, [initialIntent]);

    // [Feature] TTS Text Cleaner (Markdown Stripper)
    const cleanTextForTTS = (text: string) => {
        if (!text) return "";
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove Bold
            .replace(/\[INTENT:.*?\]/g, '') // Remove Hidden Intents
            .replace(/\[.*?\]/g, '') // Remove System Tags like [공명 현상]
            .replace(/#{1,6}\s?/g, '') // Remove Headers
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove Images
            .replace(/`{1,3}/g, '') // Remove Code ticks
            .replace(/📈|✨|🔒|🎵|🗣️|❓|🚨|📉/g, '') // Remove Common Emojis (Optional, but often preferred for clean reading)
            .trim();
    };

    // [Voice Logic] Auto-Play TTS when AI Responds in Voice Mode
    useEffect(() => {
        if (!isVoiceMode || isLoading) return;

        const lastMsg = messages[messages.length - 1];
        // If last message is from Assistant and it's a new message (simple check)
        // Ideally we compare IDs, here we rely on the effect trigger
        if (lastMsg && lastMsg.role === 'assistant' && !isVoicePlaying) {
            // Delay slightly to ensure UI catchup
            setTimeout(() => speak(cleanTextForTTS(lastMsg.content)), 500);
        }
    }, [messages, isLoading, isVoiceMode]);

    // [Auto-scroll] Refs for scrolling to latest message
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // [Gamification] Mind Sync State
    const [syncLevel, setSyncLevel] = useState(1);
    const [syncXP, setSyncXP] = useState(0);
    const [isLevelUp, setIsLevelUp] = useState(false);
    const [currentGrowthStage, setCurrentGrowthStage] = useState<number>(1); // [Growth Map]

    // [Sonic Feedback] Voice Actor Audio Engine (Replaced TTS)
    const playVoiceAudio = (type: 'levelup' | 'welcome' | 'high_bpm' | 'mission') => {
        if (typeof window === 'undefined') return;

        const audioMap: Record<string, string> = {
            'levelup': '/sounds/Take1-14_레벨업_2026-01-09.wav',
            'welcome': '/sounds/voice_welcome.wav',
            'high_bpm': '/sounds/voice_high_bpm.wav',
            'mission': '/sounds/voice_mission_start.wav'
        };

        const audioFile = audioMap[type];
        if (audioFile) {
            const audio = new Audio(audioFile);
            audio.volume = 0.8;
            audio.play().catch(() => { });
        }
    };

    // [Legacy Wrapper] For backward compatibility
    const playGameSound = (type: 'levelup' | 'down' | 'cheer' | 'normal') => {
        if (type === 'levelup') {
            playVoiceAudio('levelup');
        }
        // down, cheer, normal - silent or can add more voice files later
    };

    // [Gamification] XP Trigger Logic
    const awardXP = (amount: number, reason: string) => {
        setSyncXP(prev => {
            const nextXP = prev + amount;
            if (nextXP >= 100) {
                // Level Up Event
                setSyncLevel(lvl => {
                    const newLvl = Math.min(lvl + 1, 10);
                    playGameSound('levelup');
                    setIsLevelUp(true);
                    setTimeout(() => setIsLevelUp(false), 3000); // Reset animation
                    return newLvl;
                });
                return 0; // Reset XP
            }
            return nextXP;
        });
    };

    // [Expert Feature] Accountability XP Handler
    const handleAddXP = (amount: number, reason: string) => {
        awardXP(amount, reason);
    };

    // [State Mapping] Lv -> Title
    const getSyncStateLabel = (lvl: number) => {
        if (lvl >= 8) return "✨ 최적화 상태 (FLOW)";
        if (lvl >= 4) return "⚡ 동기화 진행 (SYNC)";
        return "🌱 의식 각성 (AWAKE)";
    };
    const [currentLevel, setCurrentLevel] = useState(1);
    const [showModal, setShowModal] = useState(false);

    // [Premium & Payment]
    const [selectedPaymentTier, setSelectedPaymentTier] = useState<'TRIAL' | 'PASS' | 'VIP'>('TRIAL'); // [New] User's selection
    const [premiumReport, setPremiumReport] = useState<string | null>(null);
    const [isPremiumLoading, setIsPremiumLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS'>('IDLE');

    const [gapMetrics, setGapMetrics] = useState({ gapLevel: 10, matchingScore: 90 }); // Initial: Stable
    const [interruptQuestion, setInterruptQuestion] = useState<any | null>(null);
    const [isInterrupted, setIsInterrupted] = useState(false);
    const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);


    // [Auth Module]
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [userId, setUserId] = useState<string>(''); // Dynamic ID
    const [isPremiumMember, setIsPremiumMember] = useState(false); // Premium status
    const [userExpiryDate, setUserExpiryDate] = useState<string | null>(null); // Ticket expiry

    // [Security] Calculate if membership is expired
    const isExpired = userExpiryDate ? new Date(userExpiryDate) < new Date() : false;

    // [Focus Mode - Cognitive Load Reduction]
    const [isFocusMode, setIsFocusMode] = useState(false);

    // [Auth Guard - Session Management]
    const { userStatus, shouldShowPaymentModal } = useAuthGuard();

    // [Free Trial System]
    const [freeTurns, setFreeTurns] = useState(0);
    const [isTrialMode, setIsTrialMode] = useState(true);
    const FREE_TRIAL_LIMIT = 3;

    // [Init] UUID for Guest, but replaceable by Auth + Free Trial Counter
    // [Init] UUID for Guest, Persistence, and Auth Listener
    useEffect(() => {
        // 1. Guest mode init
        if (!userId) {
            setUserId(generateUUID());
        }

        // 2. Load free trial turns & Restore Session
        if (typeof window !== 'undefined') {
            const savedTurns = sessionStorage.getItem('freeTurns');
            if (savedTurns) {
                setFreeTurns(parseInt(savedTurns, 10));
            }

            // [Persistence] Restore User Session
            const savedUserId = localStorage.getItem('myeongsim_user_id');
            const savedScanStatus = localStorage.getItem('myeongsim_deep_scan_completed');

            if (savedUserId && savedUserId !== 'undefined') {
                console.log("♻️ [Session] Restoring persistent session:", savedUserId);
                setUserId(savedUserId);

                // [Optimization] Immediate Skip if cached
                if (savedScanStatus === 'true') {
                    setIsSurveyCompleted(true);
                }
            }
        }

        // 3. Auth Listener (Required for cleanup)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            // Optional: Log auth changes
            if (event === 'SIGNED_IN') console.log("🔐 Auth State: Signed In");
        });

        // Cleanup subscription on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // [New] Auto-Restore on Mount (Support Refresh/F5)
    useEffect(() => {
        const restoreSessionData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const { reportData, updateUserData } = useReportStore.getState();

            // Restore if session exists but local store is missing critical data
            if (session?.user?.user_metadata?.saju_data && (!reportData?.saju?.dayMaster)) {
                console.log("🔄 [Persistence] Auto-restoring User Data from Cloud...");
                const meta = session.user.user_metadata;

                try {
                    // [NEW] Use unified SajuEngine
                    const result = calculateSaju(meta.birth_date, meta.birth_time || '12:00', meta.calendar_type || 'solar', meta.gender || 'male');

                    if (!result.success) {
                        console.warn("Saju Restoration Error:", result.error);
                        return;
                    }

                    const p = result.fourPillars;
                    const dayMaster = result.dayMaster;
                    const stats = calculateSajuStats(p, result.dayMasterChar); // [Fix] Use Kanji Char for lookup

                    updateUserData({
                        userName: meta.user_name || "회원",
                        birthDate: meta.birth_date,
                        birthTime: meta.birth_time,
                        gender: meta.gender,
                        saju: {
                            elements: stats.ohaeng, // Map ohaeng to elements
                            ohaeng: stats.ohaeng,   // [Fix] Add ohaeng for ScoreCalculator
                            tenGods: stats.tenGods, // [Fix] Add tenGods for ScoreCalculator
                            dayMaster: dayMaster,
                            dayMasterTrait: "분석 완료",
                            keywords: getKeywords(dayMaster),
                            fourPillars: {
                                year: { gan: p.year.ganKor, ji: p.year.jiKor, ganElement: p.year.ganElement, jiElement: p.year.jiElement, ganColor: p.year.ganColor, jiColor: p.year.jiColor },
                                month: { gan: p.month.ganKor, ji: p.month.jiKor, ganElement: p.month.ganElement, jiElement: p.month.jiElement, ganColor: p.month.ganColor, jiColor: p.month.jiColor },
                                day: { gan: p.day.ganKor, ji: p.day.jiKor, ganElement: p.day.ganElement, jiElement: p.day.jiElement, ganColor: p.day.ganColor, jiColor: p.day.jiColor },
                                time: meta.birth_time === 'unknown' ? { gan: '?', ji: '?', ganElement: '?', jiElement: '?', ganColor: '#888', jiColor: '#888' } : { gan: p.time.ganKor, ji: p.time.jiKor, ganElement: p.time.ganElement, jiElement: p.time.jiElement, ganColor: p.time.ganColor, jiColor: p.time.jiColor },
                            },
                            current_luck_cycle: { name: result.currentDaewoon || "로딩 중", season: "-", direction: "-", is_transition: false, mission_summary: "" },
                            current_yearly_luck: { year: new Date().getFullYear().toString(), element: "-", ten_god_type: "-", action_guide: "-", interaction: "-" }
                        } as any
                    });
                } catch (e) {
                    console.warn("Auto-restore failed:", e);
                }
            }
        };
        restoreSessionData();
    }, []);

    // [Persistence] Load XP/Level from Cloud Metadata
    useEffect(() => {
        const loadGamificationState = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata) {
                const meta = session.user.user_metadata;
                if (meta.xp !== undefined && meta.level !== undefined) {
                    setSyncXP(meta.xp);
                    setSyncLevel(meta.level);
                    console.log(`🎮 [Game] Loaded State: Lv.${meta.level} XP:${meta.xp}`);
                }
            }
        };
        loadGamificationState();
    }, [userId]);

    // [Persistence] Auto-Save XP/Level to Cloud Metadata (Debounced)
    useEffect(() => {
        if (!userId || userId.includes('0000')) return;

        const timer = setTimeout(async () => {
            const { error } = await supabase.auth.updateUser({
                data: { xp: syncXP, level: syncLevel }
            });
            if (error) console.error("❌ [Game] Save Failed:", error.message);
            else console.log(`💾 [Game] Progress Saved: Lv.${syncLevel} XP:${syncXP}`);
        }, 2000); // 2s Debounce

        return () => clearTimeout(timer);
    }, [syncXP, syncLevel, userId]);

    // [Check Premium Status] on userId change
    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (!userId || userId.includes('-0000-')) return; // Skip for guest/demo IDs

            const { data, error } = await supabase
                .from('users')
                .select('membership_tier, expires_at, deep_scan_completed')
                .eq('id', userId)
                .single();

            if (data) {
                // [Feature] Skip Deep Scan if already completed
                if (data.deep_scan_completed) {
                    setIsSurveyCompleted(true);
                    localStorage.setItem('myeongsim_deep_scan_completed', 'true');
                    console.log("✅ [Check] Deep Scan previously completed. Skipping.");
                }

                // [Security Fix] Strict Expiration Check
                // If expires_at is null, they are NOT active (pending approval)
                const isActive = data.expires_at && new Date(data.expires_at) > new Date();
                const hasPremium = data.membership_tier && data.membership_tier !== 'FREE' && isActive;
                setIsPremiumMember(hasPremium);

                // [TimeCapsule] Set expiry date for timer display
                if (data.expires_at) {
                    setUserExpiryDate(data.expires_at);
                    localStorage.setItem('myeongsim_expiry_date', data.expires_at);
                    console.log('✅ Expiry date synced:', data.expires_at);
                }

                // Disable trial mode for premium members OR expired members (prevent free loop)
                if (data.membership_tier !== 'FREE' || data.expires_at) {
                    setIsTrialMode(false);
                }

                if (hasPremium) {
                    // setIsTrialMode(false); // Already covered above
                }
            }
        };
        checkPremiumStatus();
    }, [userId]);

    // [NEW] Realtime Subscription - 관리자 승인 시 즉시 잠금 해제
    useEffect(() => {
        if (!userId || userId.includes('-0000-')) return;

        // Supabase Realtime 채널 구독
        const channel = supabase
            .channel(`user-tier-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${userId}`
                },
                (payload: any) => {
                    console.log('🔔 [Realtime] User data updated:', payload);

                    const newData = payload.new;
                    if (newData) {
                        // 즉시 상태 업데이트
                        const isActive = newData.expires_at && new Date(newData.expires_at) > new Date();
                        const hasPremium = newData.membership_tier && newData.membership_tier !== 'FREE' && isActive;

                        setIsPremiumMember(hasPremium);

                        if (newData.expires_at) {
                            setUserExpiryDate(newData.expires_at);
                            localStorage.setItem('myeongsim_expiry_date', newData.expires_at);
                        }

                        if (newData.membership_tier !== 'FREE' || newData.expires_at) {
                            setIsTrialMode(false);
                        }

                        if (hasPremium) {
                            alert('🎉 이용권이 활성화되었습니다! 모든 기능을 사용하실 수 있습니다.');
                        }

                        console.log('✅ [Realtime] Premium status updated:', hasPremium);
                    }
                }
            )
            .subscribe((status: string) => {
                console.log('📡 [Realtime] Subscription status:', status);
            });

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // [Auto-scroll] Smart Scroll Logic
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMsg = messages[messages.length - 1];

        if (lastMsg.role === 'user') {
            // If user sent a message, scroll to bottom to see their message
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else if (!isLoading) {
            // [Critical UX] Scroll to TOP of AI message ONLY after generation is complete
            // This allows users to read from the top without manual scrolling
            setTimeout(() => {
                const msgElement = document.getElementById(`msg-${lastMsg.id}`);
                if (msgElement) {
                    msgElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [messages, isLoading]);

    // [Handler] Auth Success
    const handleLoginSuccess = async (authId: string, isNewUser: boolean) => {
        console.log(`🔐 [Auth] User Logged In: ${authId} (New: ${isNewUser})`);

        // [Persistence] Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('myeongsim_user_id', authId);
            localStorage.setItem('myeongsim_login_at', new Date().toISOString());
        }

        setUserId(authId); // ✨ Identity Switch: Guest -> Member

        // [Fix] Restore Saju Data from Supabase Metadata (Long-term Memory)
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.saju_data) {
                const meta = user.user_metadata;
                // Only restore if local store is empty or needs refresh
                const { updateUserData } = useReportStore.getState(); // Access store actions directly via getState() when outside component context or to be safe

                console.log("📥 [Cloud] Restoring Saju Data from Metadata...");

                // [NEW] Use unified SajuEngine
                const result = calculateSaju(meta.birth_date, meta.birth_time || '12:00', meta.calendar_type || 'solar', meta.gender || 'male');

                if (!result.success) {
                    console.warn("Saju Restoration Error:", result.error);
                    return;
                }

                const p = result.fourPillars;
                const dayMaster = result.dayMaster;
                const stats = calculateSajuStats(p, result.dayMasterChar); // [Fix] Use Kanji Char for lookup

                updateUserData({
                    userName: meta.user_name || "회원",
                    birthDate: meta.birth_date,
                    birthTime: meta.birth_time,
                    gender: meta.gender,
                    saju: {
                        elements: stats.ohaeng, // Map ohaeng to elements
                        ohaeng: stats.ohaeng,   // [Fix] Add ohaeng for ScoreCalculator
                        tenGods: stats.tenGods, // [Fix] Add tenGods for ScoreCalculator
                        dayMaster: dayMaster,
                        dayMasterTrait: "분석 완료",
                        keywords: getKeywords(dayMaster),
                        fourPillars: {
                            year: { gan: p.year.ganKor, ji: p.year.jiKor, ganElement: p.year.ganElement, jiElement: p.year.jiElement, ganColor: p.year.ganColor, jiColor: p.year.jiColor },
                            month: { gan: p.month.ganKor, ji: p.month.jiKor, ganElement: p.month.ganElement, jiElement: p.month.jiElement, ganColor: p.month.ganColor, jiColor: p.month.jiColor },
                            day: { gan: p.day.ganKor, ji: p.day.jiKor, ganElement: p.day.ganElement, jiElement: p.day.jiElement, ganColor: p.day.ganColor, jiColor: p.day.jiColor },
                            time: meta.birth_time === 'unknown' ? { gan: '?', ji: '?', ganElement: '?', jiElement: '?', ganColor: '#888', jiColor: '#888' } : { gan: p.time.ganKor, ji: p.time.jiKor, ganElement: p.time.ganElement, jiElement: p.time.jiElement, ganColor: p.time.ganColor, jiColor: p.time.jiColor },
                        },
                        current_luck_cycle: { name: result.currentDaewoon || "로딩 중", season: "-", direction: "-", is_transition: false, mission_summary: "" },
                        current_yearly_luck: { year: new Date().getFullYear().toString(), element: "-", ten_god_type: "-", action_guide: "-", interaction: "-" }
                    } as any
                });
            }
        } catch (e) {
            console.warn("Required Data Restore Failed:", e);
        }

        // [UX] Notify User
        const welcomeMsg = isNewUser
            ? "반갑습니다! 번호가 등록되었습니다. 이제부터 대화 내용이 기억됩니다."
            : "어서오세요! 지난 대화 기억을 불러옵니다...";

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `✅ **[인증 성공]**\n\n${welcomeMsg}`
        }]);
    };

    // [Restored State]
    const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);
    const [surveyIndex, setSurveyIndex] = useState(0);
    const [acquiredVector, setAcquiredVector] = useState<number[]>([0, 0, 0, 0, 0]);
    const [showBridgeFeedback, setShowBridgeFeedback] = useState<string | null>(null);
    const [audioMenuMsgId, setAudioMenuMsgId] = useState<string | null>(null); // [New] Audio Menu State


    const pendingMessage = useRef<string | null>(null);
    const loadingCount = useRef(0); // [UX] Track load count for simplified animation
    const [isCompactGauge, setIsCompactGauge] = useState(false); // [UX] Gauge Size Control

    // [Logic] Check for triggers on input change or before send
    const handleInterruptCheck = (text: string) => {
        // [Feedback] Disabled Interrupt Logic by User Request
        /*
        const question = InterruptQuestionModule.checkInterrupt(text);
        if (question && !isInterrupted && !isSurveyCompleted) {
            setInterruptQuestion(question);
            return true; // Triggered
        }
        */
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
                    // [Persistence] Save completion status to localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('deepScanCompleted', 'true');
                        console.log('✅ Deep Scan Protocol: Completion saved to localStorage');
                    }
                    setInterruptQuestion(null);

                    // Add Clean Completion Message
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: `🔬 **Deep Scan Protocol 완료**\n\n당신의 뉴럴 코드 분석이 완료되었습니다.\n특허출원된 **[Neural Sync 알고리즘]**으로 통합 리포트를 생성합니다...`,
                        options: ["리포트 확인하기", "다른 고민 말하기"]
                    }]);

                    // Proceed with original message (Send gap data to backend only, not visible to user)
                    if (pendingMessage.current) {
                        // Backend receives structured data via gapData prop, not as visible text
                        handleSend(pendingMessage.current);
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

                // [Fix] Fetch Persistent Memory (Cross-Session)
                const res = await fetch(`/api/memory/history?userId=${userId}&limit=50`);
                if (!res.ok) return;

                const data = await res.json();
                if (data.history && data.history.length > 0) {
                    const formattedMsgs = data.history.map((m: any) => ({
                        id: m.id?.toString() || Date.now().toString(),
                        role: m.role,
                        content: m.message || "",
                    }))
                        .filter((m: any) => m.content && m.content.trim().length > 0);

                    // [Fix] If filtering removed all messages (all were empty), show welcome instead of blank
                    if (formattedMsgs.length > 0) {
                        setMessages(formattedMsgs);
                    } else {
                        // Inherit Welcome Logic
                        setMessages([{
                            id: 'welcome',
                            role: 'assistant',
                            content: "반갑습니다. **당신의 생체 리듬과 운명을 연결하는 명심 AI**입니다. ⌚✨\n\n지금 당신의 심장 박동에서 **변화의 신호**가 감지되고 있네요.\n겉으로 드러난 고민 뒤에 숨겨진 **진짜 마음의 소리**를 들려주세요. 제가 그 길을 밝혀드리겠습니다."
                        }]);
                    }
                } else {
                    // Start fresh if no history
                    setMessages([
                        {
                            id: 'welcome',
                            role: 'assistant',
                            content: "반갑습니다. **당신의 생체 리듬과 운명을 연결하는 명심 AI**입니다. ⌚✨\n\n지금 당신의 심장 박동에서 **변화의 신호**가 감지되고 있네요.\n겉으로 드러난 고민 뒤에 숨겨진 **진짜 마음의 소리**를 들려주세요. 제가 그 길을 밝혀드리겠습니다."
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
    const { connect: connectBio, disconnect: disconnectBio, isConnected: isBioConnected, isConnecting: isBioConnecting, error: bioError } = useBioData();

    // [Auto-Trigger] High BPM detection - Tiered Response
    const bpmTriggerRef = useRef<number>(0); // Debounce to prevent repeated triggers
    useEffect(() => {
        if (isLoading) return;

        const now = Date.now();
        const DEBOUNCE_MS = 30000; // 30 seconds between triggers

        // Tier 2: BPM 120+ → 자동 그라운딩 화면 (최우선)
        if (bpm >= 120 && (now - bpmTriggerRef.current > DEBOUNCE_MS)) {
            bpmTriggerRef.current = now;
            // [NEW] Play high BPM voice before crisis mode
            playVoiceAudio('high_bpm');

            setShowCrisisMode(true);
            setCrisisPhase('breathing');
            // Add system message
            setMessages(prev => [...prev, {
                id: `bpm-alert-${now}`,
                role: 'assistant',
                content: `🚨 **[생체 신호 감지]** BPM ${bpm}\n\n심박수가 많이 높습니다. 잠시 멈추고 함께 호흡해볼까요?`
            }]);
            return;
        }

        // Tier 1: BPM 110-119 → 알림 메시지만
        if (bpm > 110 && bpm < 120 && (now - bpmTriggerRef.current > DEBOUNCE_MS)) {
            bpmTriggerRef.current = now;
            handleSend("심장이 조금 빨리 뛰고 있어요... (BPM: " + bpm + ") 지금 기분이 어때요?");
        }
    }, [bpm]);

    // [SAFETY] Crisis Breathing Audio Guide - Voice Actor Files
    useEffect(() => {
        if (!showCrisisMode || crisisPhase !== 'breathing') return;

        let isCancelled = false;
        const audioSequence = [
            { file: '/sounds/voice_inhale.mp3', delay: 0 },
            { file: '/sounds/voice_hold.mp3', delay: 4000 },
            { file: '/sounds/voice_exhale.mp3', delay: 6000 }
        ];

        const playSequence = () => {
            audioSequence.forEach(({ file, delay }) => {
                setTimeout(() => {
                    if (isCancelled) return;
                    const audio = new Audio(file);
                    audio.volume = 0.8;
                    audio.play().catch(() => { });
                }, delay);
            });
        };

        // Play immediately and then loop every 10 seconds
        playSequence();
        const loopInterval = setInterval(() => {
            if (!isCancelled) playSequence();
        }, 10000);

        return () => {
            isCancelled = true;
            clearInterval(loopInterval);
        };
    }, [showCrisisMode, crisisPhase]);

    const handleSend = async (overrideInput?: string, hiddenPayload?: string) => {
        const msgToSend = overrideInput || input;
        if (!msgToSend.trim() || isLoading) return;

        // [Feature] Radio Mode Intervention (Simple Type)
        // If voice is playing, treat text input as a "listener comment" intervention
        let effectiveHiddenPayload = hiddenPayload;

        if (isVoicePlaying && !overrideInput && !hiddenPayload) {
            console.log("📻 [Radio] User Intervention Detected!");
            stopVoice(); // Stop current broadcast immediately
            playGameSound('cheer'); // Sound effect for entry

            // Inject context so AI knows this is an interruption
            effectiveHiddenPayload = `[청취자 실시간 참여] (방송 중 청취자가 실시간으로 의견을 남겼습니다): "${msgToSend}"\n(DJ처럼 자연스럽게 "아, 청취자분이 이런 의견을 주셨네요!" 하고 받아서 반응해주세요)`;
        }

        // [SAFETY] 1. Emergency Crisis Intervention (SOS Modal)
        const lowerMsg = msgToSend.toLowerCase();

        // Expanded Crisis Keywords
        if (ETHICAL_GUIDELINES.CRISIS_KEYWORDS.some(k => lowerMsg.includes(k))) {
            setShowBreathingGuideFromChat(true);
            setInput('');
            return;
        }

        // [SAFETY] 2. Ethical Refusal & Safety Warning
        if (ETHICAL_GUIDELINES.PROHIBITED_KEYWORDS.some(k => lowerMsg.includes(k))) {
            setMessages(prev => [...prev, {
                id: `refusal-${Date.now()}`,
                role: 'assistant',
                content: ETHICAL_GUIDELINES.REFUSAL_MESSAGE.content,
                type: 'text'
            }]);

            // Show Hotline Info below
            setTimeout(() => {
                const hotlineInfo = ETHICAL_GUIDELINES.EMERGENCY_CONTACTS.map(c => `- ${c.name}: **${c.number}**`).join('\n');
                setMessages(prev => [...prev, {
                    id: `hotline-${Date.now()}`,
                    role: 'assistant',
                    content: `🚨 **긴급 도움 기관 안내**\n\n${hotlineInfo}`
                }]);
            }, 500);

            setInput('');
            return;
        }



        // [Premium Check] Block Deep Scan for free trial users
        // [DISABLED] GateKeeper logic - Now always proceed to real AI
        if (false && !isSurveyCompleted && !msgToSend.includes(":::") && !msgToSend.startsWith("/")) {
            if (!isPremiumMember) {
                // Free trial users: block Deep Scan and show payment card
                const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msgToSend };
                setMessages(prev => [...prev, userMsg]);
                setInput('');

                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: `premium-required-${Date.now()}`,
                        role: 'assistant',
                        content: '🔬 **Deep Scan Protocol은 프리미엄 전용입니다.**\n\n깊이 있는 분석을 원하시면 이용권을 구매해주세요!',
                        type: 'payment'
                    }]);
                }, 500);
                return;
            }

            // Premium users: proceed with GateKeeper (Deep Scan)
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
                const isLocalCompleted = typeof window !== 'undefined' && localStorage.getItem('myeongsim_deep_scan_completed') === 'true';
                const hasUserId = typeof window !== 'undefined' && !!localStorage.getItem('myeongsim_user_id');

                // [CRITICAL FIX] Skip if already completed OR if existing user (has ID)
                // EMERGENCY DISABLE: if (false && ...)
                if (false && !isSurveyCompleted && !isLocalCompleted && !hasUserId && DeepScanQuestions && DeepScanQuestions.length > 0) {
                    setSurveyQuestions(DeepScanQuestions);
                    setSurveyIndex(0);
                    setInterruptQuestion(DeepScanQuestions[0]);
                    pendingMessage.current = msgToSend;
                }
            }, 1000);
            return;
        }

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msgToSend };

        if (hiddenPayload !== "SYSTEM_TRIGGER") {
            setMessages(prev => [...prev, userMsg]);
        }
        setInput('');

        // [Memory] Save User Message Immediately
        const MEMORY_USER_ID = '00000000-0000-0000-0000-000000000000';
        fetch('/api/memory/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: MEMORY_USER_ID, role: 'user', message: msgToSend })
        }).catch(err => console.error("Memory Save Error (User):", err));

        // [Free Trial System] Increment turn counter (trial mode only)
        if (isTrialMode && !isPremiumMember) {
            const newTurns = freeTurns + 1;
            setFreeTurns(newTurns);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('freeTurns', newTurns.toString());
            }

            // Check if limit reached
            if (newTurns >= FREE_TRIAL_LIMIT) {
                // Trigger payment card after AI response
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: `payment-${Date.now()}`,
                        role: 'assistant',
                        content: '🎁 **무료 체험이 종료되었습니다.**\n\n더 깊은 대화와 기억 기능을 원하시면 이용권을 구매해주세요!',
                        type: 'payment'
                    }]);
                }, 1000);
                return; // Block further messages
            }
        }

        // [Gamification] Award XP for Interaction
        const xpAmount = msgToSend.length > 20 ? 15 : 10;
        awardXP(xpAmount, 'User Turn');

        // [Sonic Trigger] Check Sentiment (Simple Keyword Shim)
        if (msgToSend.includes('감사') || msgToSend.includes('좋아') || msgToSend.includes('신기')) {
            playGameSound('cheer');
            awardXP(10, 'Positive Bonus');
        }

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
        // Supports: 1980-07-07, 1980.07.07, 1980년 7월 7일, optional 13:40, 13시 40분
        const dateMatch = msgToSend.match(/(\d{4})[-.년]\s*(\d{1,2})[-.월]\s*(\d{1,2})[-.일]?\s*(?:(\d{1,2})[:시]\s*(\d{1,2})?)?/);

        if (dateMatch) {
            try {
                const year = parseInt(dateMatch[1]);
                const month = parseInt(dateMatch[2]);
                const day = parseInt(dateMatch[3]);
                const hour = dateMatch[4] ? parseInt(dateMatch[4]) : 12; // Default to noon if no time
                const minute = dateMatch[5] ? parseInt(dateMatch[5]) : 0;

                const date = new Date(year, month - 1, day, hour, minute);
                const profile = CalculateNeuralProfile(date);

                // Inject visual command immediately
                const uiCommand = `::: UI_COMMAND : ${JSON.stringify({ ui_type: 'neural_profile', profile })} :::`;

                // Add immediate bot response with the card
                setTimeout(() => {
                    const timeStr = dateMatch[4] ? ` ${hour}시 ${minute}분` : '';
                    setMessages(prev => [...prev, {
                        id: `neural-${Date.now()}`,
                        role: 'assistant',
                        content: `🧬 **Neural Code Detected.**\n\n[System] ${year}년 ${month}월 ${day}일${timeStr} 생년월일을 기반으로 고유 설계를 분석했습니다.\n${uiCommand}`
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

            // [Gamification] Start Neural Sync
            awardXP(10, "Sync Initialized");

            // [Optimization] Payload Reduction Strategy
            // 1. Truncate History: Send only last 10 messages to keep request small
            const fullHistory = [...messages, userMsg];
            const optimizedHistory = fullHistory.slice(-10).map(m => ({
                role: m.role,
                content: m.content
                // Omit metadata, options, id to save space
            }));

            // 2. Minimal Saju Data: Send only inputs required for server-side recalc
            // The server already recalculates based on birth info
            const minimalSajuData = effectiveReportData?.saju ? {
                dayMaster: effectiveReportData.saju.dayMaster,
                // Only include if indispensable. Server logic uses birthDate primarily.
            } : {};

            // [API] Call Next.js API Route (Corrected from Edge Function)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName: effectiveReportData?.userName || "회원",
                    // [FIX] Use effectiveHiddenPayload if provided (for Intents/Intervention), otherwise use visible msg
                    message: effectiveHiddenPayload || hiddenPayload || msgToSend,
                    messages: optimizedHistory, // [Fix] Send optimized history
                    stage,
                    birthDate: effectiveReportData?.birthDate,
                    birthTime: effectiveReportData?.birthTime,
                    gender: effectiveReportData?.gender,
                    // [Optimization] Redundant Saju Object Removed/Minimized
                    sajuData: minimalSajuData,
                    gapData: {
                        acquiredVector: acquiredVector,
                        gapLevel: gapMetrics.gapLevel,
                        matchingScore: gapMetrics.matchingScore
                    },
                    sessionId: sessionIdRef.current,
                    lastBotMessage: messages.length > 0 && messages[messages.length - 1].role === 'assistant' ? messages[messages.length - 1].content : null,
                    clientTimestamp: new Date().toISOString() // [Context] Real Client Time
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Server Error: ${errText}`);
            }

            // [Safety] Check for crisis detection header
            const crisisDetected = response.headers.get('X-Crisis-Detected') === 'true';
            if (crisisDetected) {
                console.log('🚨 [Crisis] Detected from API - Showing breathing guide');
                setShowBreathingGuideFromChat(true);
            }

            if (!response.body) throw new Error('No response stream');

            // [Stream Handling]
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                botContent += chunk;

                // [Growth Map] Real-time Stage Parsing
                const stageMatch = (botContent || "").match(/:::GROWTH_STAGE:(\d+):::/);
                if (stageMatch) {
                    const newStage = parseInt(stageMatch[1], 10);
                    setCurrentGrowthStage(newStage);
                    // Remove metadata from visible text
                    botContent = botContent.replace(stageMatch[0], '');
                }
            }

            // [Tiki-Taka Protocol] Message Splitting
            // 1. Separate JSON Logic
            const parts = botContent.split(":::DATA_SEPARATOR:::");
            const textPart = parts[0];
            const jsonPart = parts[1];

            // 2. Split messages by :::BREAK::: for Tiki-Taka effect
            const messagesToQueue = textPart.split(":::BREAK:::").map(s => s.trim()).filter(s => s.length > 0);

            // 3. Remove Loading State & Queue Messages
            setIsLoading(false); // Stop the main spinner

            // Generate FIRST message ID upfront (before loop) for reliable scrolling
            const firstMessageId = `ai-response-${Date.now()}`;

            // Helper to add message with delay
            const queueMessage = (content: string, delay: number, msgId: string) => {
                return new Promise<void>(resolve => {
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            id: msgId,
                            role: 'assistant',
                            content: content
                        }]);
                        resolve();
                    }, delay);
                });
            };

            // 4. Sequential Delivery Loop
            for (let i = 0; i < messagesToQueue.length; i++) {
                // First message: Immediate (0ms), use pre-generated ID
                // Subsequent: 800ms typing delay
                const delay = i === 0 ? 0 : 800;
                const msgId = i === 0 ? firstMessageId : `ai-response-${Date.now()}-${i}`;
                await queueMessage(messagesToQueue[i], delay, msgId);
            }

            // 5. Scroll to FIRST message after all messages delivered (longer delay for DOM update)
            setTimeout(() => {
                const firstMsgElement = document.getElementById(`msg-${firstMessageId}`);
                if (firstMsgElement) {
                    firstMsgElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);

            // 5. Handle JSON Data (Update Gauges/Analysis)
            if (jsonPart) {
                try {
                    // We need to parse this to update analysisData state if possible
                    // Currently checking if we have logic to update state from this JSON
                    // The existing code relied on re-parsing in the render or elsewhere.
                    // We should verify if we need to explicitly setAnalysisData here.
                    // Based on previous code, parsing happened in render. 
                    // To be safe, we append a hidden message or just let the last bubble carry the data?
                    // Better: Attach JSON to the LAST message's metadata or hidden content so render logic picks it up.
                    // Or, just append it to the last message content hiddenly as before.

                    setMessages(prev => {
                        const newArr = [...prev];
                        const lastMsg = newArr[newArr.length - 1];
                        if (lastMsg) {
                            lastMsg.content += `:::DATA_SEPARATOR:::${jsonPart}`;
                        }
                        return newArr;
                    });

                } catch (e) { console.error("JSON Merge Error", e); }

                // [Gamification] Deep Dive Bonus if analysis exists
                if (jsonPart.includes('gaugeData')) {
                    awardXP(30, "Deep Analysis Synced");
                }
            }

            // [Gamification] Response Complete
            awardXP(15, "Sync Complete");

            // [Memory] Save AI Message (Full Content)
            const MEMORY_USER_ID = '00000000-0000-0000-0000-000000000000';
            fetch('/api/memory/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: MEMORY_USER_ID, role: 'assistant', message: botContent })
            }).catch(err => console.error("Memory Save Error (AI):", err));


            // [Post-Processing] Check for special UI data parsing if embedded in text
            // (Current route.ts streams raw text, so no JSON parsing of full body)

        } catch (error: any) {
            console.error("Chat Error:", error);

            // [Expiration Check] Handle 403 expired error
            if (error.message?.includes('403') || error.status === 403) {
                setMessages(prev => [...prev, {
                    id: `expired-${Date.now()}`,
                    role: 'assistant',
                    content: '⏰ **이용권이 만료되었습니다.**\n\n더 깊은 대화를 원하시면 새로운 이용권을 구매해주세요!',
                    type: 'payment'
                }]);
            } else {
                const fallbackMessage = `...(잠시 깊은 침묵)... \n\n[System Debug] ${error.message || 'Unknown Error'}\n\n우주의 파동이 잠시 고르지 못했습니다. 님의 마음을 다시 한 번 들려주시겠습니까?`;
                setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: fallbackMessage }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlockReport = (tier?: 'TRIAL' | 'PASS' | 'VIP') => {
        // [Auth Module] Trigger Phone Login instead of direct payment modal
        if (tier) setSelectedPaymentTier(tier);
        setIsAuthModalOpen(true);
    };

    // [Auto-Save] Save to Supabase on close (Premium only)
    const handleChatClose = async () => {
        if (isPremiumMember && messages.length > 1) {
            try {
                // Save messages to Supabase
                await fetch('/api/chat/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        sessionId: sessionIdRef.current,
                        messages: messages.map(m => ({
                            role: m.role,
                            content: m.content,
                            metadata: { options: m.options }
                        }))
                    })
                });
                console.log('✅ [Premium] Chat history saved to Supabase');
            } catch (error) {
                console.error('❌ [Premium] Failed to save chat history:', error);
            }
        }

        // Call original onClose
        onClose();
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-gray-900 border-l border-gray-800 relative z-50">
            {/* [Module] Phone Auth Modal */}
            <PhoneAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
                selectedTier={selectedPaymentTier}
            />

            {/* [Gamification] Mind Sync Status Bar (Unified HUD) - Hidden in Focus Mode */}
            {!isFocusMode && (
                <MindSyncStatusBar
                    level={syncLevel}
                    xp={syncXP}
                    stateLabel={getSyncStateLabel(syncLevel)}
                    isLevelUp={isLevelUp}
                />
            )}

            {/* [Free Trial] Badge - Hidden in Focus Mode */}
            {!isFocusMode && isTrialMode && !isPremiumMember && (
                <div className="absolute top-16 right-4 z-40 bg-yellow-500/20 border border-yellow-500/50 px-3 py-1 rounded-full text-xs text-yellow-300 font-bold">
                    🎁 무료 체험 중 ({freeTurns}/{FREE_TRIAL_LIMIT})
                </div>
            )}

            {/* [TimeCapsule] Pass Timer - Hidden in Focus Mode */}
            {!isFocusMode && userExpiryDate && (
                <div className="absolute top-16 left-4 z-40">
                    <TimeCapsule
                        expiryDate={userExpiryDate}
                        onExpire={() => {
                            console.log("⏰ Timer Expired!");
                            setIsPremiumMember(false);
                            setIsTrialMode(false);
                            // Show expiration notice
                            setMessages(prev => [...prev, {
                                id: `expired-${Date.now()}`,
                                role: 'assistant',
                                content: '⏰ **이용 시간이 종료되었습니다.**\n\n연결을 유지하려면 이용권을 갱신해주세요.',
                                type: 'payment'
                            }]);
                            // Open Auth/Payment Flow
                            setSelectedPaymentTier('PASS');
                            setIsAuthModalOpen(true);
                        }}
                    />
                </div>
            )}

            {/* [UserStatusHUD] User Status Display - Hidden in Focus Mode */}
            {!isFocusMode && (
                <UserStatusHUD userStatus={userStatus} />
            )}

            {/* [UrgentNoticeModal] 5-Minute Warning - Always Active */}
            {userExpiryDate && (
                <UrgentNoticeModal
                    expiryDate={userExpiryDate}
                    onExtend={() => {
                        // [FIX] Navigate to login page for payment/extension
                        window.location.href = '/login?action=extend';
                    }}
                />
            )}

            {/* [Removed] Duplicate GrowthMapIndicator */}

            {/* Close Button Overlay */}

            {/* Close Button Overlay */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                {/* Focus Mode Toggle */}
                <button
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className={`p-2 rounded-full transition-all ${isFocusMode
                        ? 'bg-primary-gold/20 text-primary-gold border border-primary-gold/50'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    title={isFocusMode ? "UI 표시" : "집중 모드"}
                >
                    {isFocusMode ? '📊' : '🎯'}
                </button>

                <button
                    onClick={handleChatClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>



            {/* [Feature] Real-time Gap Gauge - MOVED TO BOTTOM */}

            {/* [Expert Feature] Accountability Check-in Modal */}
            <AccountabilityModal onReward={(xp) => handleAddXP(xp, "Coaching Check-in Reward")} />

            {/* [Smart Context] Energy Analysis Card */}
            {showSmartContext && (
                <SmartContextCard
                    bpm={bpm}
                    birthDate={reportData?.birthDate}
                    onChatTopic={(message) => handleSend(message)}
                    onClose={() => setShowSmartContext(false)}
                />
            )}

            {/* [NEW] SOS Breathing Guide from Chat Crisis Detection */}
            {showBreathingGuideFromChat && (
                <BreathingGuideModal
                    isOpen={showBreathingGuideFromChat}
                    onClose={() => setShowBreathingGuideFromChat(false)}
                    onComplete={() => {
                        // 1. Send supportive closing
                        setMessages(prev => [...prev, {
                            id: `sos-complete-${Date.now()}`,
                            role: 'assistant',
                            content: "✅ **잘하셨습니다.**\n\n호흡이 조금 차분해지셨나요? 당신은 혼자가 아닙니다."
                        }]);

                        // 2. Distraction Technique (Choice Architecture) after 2 seconds
                        setTimeout(() => {
                            const option = ETHICAL_GUIDELINES.DISTRACTION_OPTIONS[Math.floor(Math.random() * ETHICAL_GUIDELINES.DISTRACTION_OPTIONS.length)];

                            setMessages(prev => [...prev, {
                                id: `distraction-${Date.now()}`,
                                role: 'assistant',
                                content: `🧠 **잠시 주의를 돌려볼까요?**\n\n${option.label}`,
                                options: ["미션 완료", "다른 미션 줘"]
                            }]);
                        }, 2000);
                    }}
                />
            )}

            {/* [SAFETY] Crisis Intervention Full-Screen Modal - Multi-Phase Recovery */}
            {showCrisisMode && (
                <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 overflow-y-auto">

                    {/* PHASE 1: Breathing - Synced with Voice Audio */}
                    {crisisPhase === 'breathing' && (() => {
                        // 10초 주기: 들이쉬기(0-4초) → 멈추기(4-6초) → 내쉬기(6-10초)
                        const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
                        const [cycleProgress, setCycleProgress] = useState(0);

                        useEffect(() => {
                            const startTime = Date.now();
                            const cycleDuration = 10000; // 10초

                            const updatePhase = () => {
                                const elapsed = (Date.now() - startTime) % cycleDuration;
                                const progress = elapsed / cycleDuration;
                                setCycleProgress(progress);

                                if (elapsed < 4000) {
                                    setBreathPhase('inhale');
                                } else if (elapsed < 6000) {
                                    setBreathPhase('hold');
                                } else {
                                    setBreathPhase('exhale');
                                }
                            };

                            const interval = setInterval(updatePhase, 50);
                            return () => clearInterval(interval);
                        }, []);

                        // 호흡 단계별 원 크기 (1.0 ~ 1.5)
                        const getScale = () => {
                            if (breathPhase === 'inhale') {
                                // 0-4초: 1.0 → 1.5 (커지기)
                                return 1 + (cycleProgress / 0.4) * 0.5;
                            } else if (breathPhase === 'hold') {
                                // 4-6초: 1.5 유지
                                return 1.5;
                            } else {
                                // 6-10초: 1.5 → 1.0 (작아지기)
                                return 1.5 - ((cycleProgress - 0.6) / 0.4) * 0.5;
                            }
                        };

                        const phaseText = {
                            inhale: '깊게 들이쉬세요',
                            hold: '잠시 멈추세요',
                            exhale: '천천히 내쉬세요'
                        };

                        const phaseEmoji = {
                            inhale: '🌬️',
                            hold: '⏸️',
                            exhale: '💨'
                        };

                        return (
                            <>
                                {/* Premium Breathing Circle */}
                                <div className="relative mb-10">
                                    {/* 외곽 글로우 효과 */}
                                    <div
                                        className="absolute inset-0 rounded-full blur-2xl opacity-50"
                                        style={{
                                            background: `radial-gradient(circle, ${breathPhase === 'inhale' ? 'rgba(34, 211, 238, 0.4)' : breathPhase === 'hold' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(56, 189, 248, 0.4)'}, transparent)`,
                                            transform: `scale(${getScale() * 1.2})`,
                                            transition: 'transform 0.1s ease-out, background 0.5s ease'
                                        }}
                                    />

                                    {/* 메인 원 */}
                                    <div
                                        className="w-52 h-52 rounded-full flex items-center justify-center relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, 
                                                ${breathPhase === 'inhale' ? 'rgba(34, 211, 238, 0.3)' :
                                                    breathPhase === 'hold' ? 'rgba(168, 85, 247, 0.3)' :
                                                        'rgba(56, 189, 248, 0.3)'} 0%, 
                                                rgba(99, 102, 241, 0.2) 100%)`,
                                            transform: `scale(${getScale()})`,
                                            transition: 'transform 0.1s ease-out, background 0.5s ease',
                                            boxShadow: `0 0 60px ${breathPhase === 'inhale' ? 'rgba(34, 211, 238, 0.3)' :
                                                breathPhase === 'hold' ? 'rgba(168, 85, 247, 0.3)' :
                                                    'rgba(56, 189, 248, 0.3)'}`,
                                            border: '2px solid rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        {/* 내부 링 */}
                                        <div
                                            className="absolute w-40 h-40 rounded-full border-2 border-white/20"
                                            style={{
                                                transform: `scale(${breathPhase === 'hold' ? 1.1 : 1})`,
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />

                                        {/* 텍스트 */}
                                        <div className="text-center z-10">
                                            <span className="text-4xl mb-2 block">{phaseEmoji[breathPhase]}</span>
                                            <span className="text-white text-xl font-medium tracking-wide">
                                                {phaseText[breathPhase]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 진행률 링 */}
                                    <svg className="absolute inset-0 w-52 h-52" style={{ transform: `scale(${getScale()})` }}>
                                        <circle
                                            cx="104"
                                            cy="104"
                                            r="100"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="4"
                                        />
                                        <circle
                                            cx="104"
                                            cy="104"
                                            r="100"
                                            fill="none"
                                            stroke={breathPhase === 'inhale' ? '#22d3ee' : breathPhase === 'hold' ? '#a855f7' : '#38bdf8'}
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeDasharray={`${cycleProgress * 628} 628`}
                                            style={{ transition: 'stroke 0.5s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                        />
                                    </svg>
                                </div>

                                <div className="text-center max-w-md mb-10">
                                    <h2 className="text-white text-2xl font-semibold mb-4">
                                        지금 이 순간, 당신은 혼자가 아닙니다.
                                    </h2>
                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        {breathPhase === 'inhale' && '코로 깊게 숨을 들이마시세요...'}
                                        {breathPhase === 'hold' && '잠시 숨을 참으세요...'}
                                        {breathPhase === 'exhale' && '입으로 천천히 내쉬세요...'}
                                        <br />
                                        지금 느끼는 감정은 영원하지 않습니다.
                                    </p>
                                </div>

                                {/* Emergency Contact */}
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 mb-8">
                                    <p className="text-slate-300 text-sm mb-2">24시간 자살예방상담전화</p>
                                    <a href="tel:1393" className="text-3xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                        📞 1393
                                    </a>
                                </div>

                                <button
                                    onClick={() => setCrisisPhase('hope')}
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                                >
                                    조금 나아졌어요
                                </button>
                            </>
                        );
                    })()}

                    {/* PHASE 2: Hope Message (Saju-based) */}
                    {crisisPhase === 'hope' && (
                        <>
                            <div className="text-6xl mb-6">🌅</div>
                            <div className="text-center max-w-lg mb-10">
                                <h2 className="text-white text-2xl font-semibold mb-6">
                                    당신의 사주를 살펴봤어요.
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                                    지금은 힘들지만, <span className="text-cyan-400 font-semibold">조만간 좋은 소식</span>이 기다리고 있어요.
                                </p>
                                <p className="text-slate-400 text-base leading-relaxed mb-4">
                                    새로운 인연, 새로운 기회, 작은 행운들이<br />
                                    당신을 향해 다가오고 있습니다.
                                </p>
                                <p className="text-white text-lg font-medium">
                                    조금만 더 견뎌주세요. 🌱<br />
                                    <span className="text-cyan-400">제가 항상 곁에서 당신의 패턴을 살피며</span><br />
                                    좋은 방향으로 갈 수 있도록 도울게요.
                                </p>
                            </div>

                            <button
                                onClick={() => setCrisisPhase('action')}
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                            >
                                작은 씨앗 하나 뿌려볼래요 🌱
                            </button>
                        </>
                    )}

                    {/* PHASE 3: Action / Self-Awareness Question */}
                    {crisisPhase === 'action' && (
                        <>
                            <div className="text-6xl mb-6">💭</div>
                            <div className="text-center max-w-lg mb-8">
                                <h2 className="text-white text-2xl font-semibold mb-6">
                                    자각의 질문
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                    지금 바로 할 수 있는<br />
                                    <span className="text-cyan-400 font-semibold">아주 작은 한 가지</span>가 있다면 뭘까요?
                                </p>
                                <div className="grid grid-cols-1 gap-3 w-full max-w-sm mx-auto">
                                    {[
                                        "🚶 잠깐 밖에 나가서 걷기",
                                        "💧 물 한 잔 마시기",
                                        "📱 좋아하는 사람에게 연락하기",
                                        "🎵 좋아하는 노래 듣기",
                                        "📝 지금 느낌 한 줄로 적기"
                                    ].map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                // Add recovery message to chat
                                                setMessages(prev => [...prev, {
                                                    id: `recovery-${Date.now()}`,
                                                    role: 'assistant',
                                                    content: `🌱 **좋아요!** "${action}"을 선택하셨군요.\n\n작은 행동 하나가 큰 변화의 시작입니다. 당신은 이미 한 발짝 나아갔어요. 언제든 이야기 나누고 싶으면 말씀해주세요. 제가 항상 곁에 있을게요. 💚`
                                                }]);
                                                setShowCrisisMode(false);
                                                setCrisisPhase('breathing'); // Reset for next time
                                            }}
                                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-xl text-left transition-all hover:translate-x-1"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowCrisisMode(false);
                                    setCrisisPhase('breathing'); // Reset
                                }}
                                className="text-slate-400 hover:text-white transition-colors text-sm underline mt-4"
                            >
                                지금은 그냥 대화하고 싶어요
                            </button>
                        </>
                    )}

                    {/* Breathing Animation Keyframes */}
                    <style>{`
                        @keyframes breathe {
                            0%, 100% { transform: scale(1); opacity: 0.6; }
                            50% { transform: scale(1.2); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

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






                <AnimatePresence>
                    {!reportData && (
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
                        <div key={msg.id} id={`msg-${msg.id}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'} flex-col scroll-mt-[30vh]`}>
                            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
                                <div className={`flex gap-3 min-w-0 max-w-full md:max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-primary-olive text-white' : 'bg-primary-gold/20 text-primary-gold border border-primary-gold/30'
                                        }`}>
                                        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        {/* [New] Consciousness Gauge Bar */}
                                        {/* [New] Consciousness Gauge Bar (Refined) */}
                                        {gaugeData && (
                                            <div className="mb-4 animate-fade-in-up">
                                                <LevelGaugeCard
                                                    innateLevel={(gaugeData as any).innate_level || 120}
                                                    currentLevel={gaugeData.score || 150}
                                                    framework="기본 분석"
                                                    tip={gaugeData.advice}
                                                />
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
                                            w-fit max-w-full md:max-w-[85%] px-5 py-4 min-w-[200px] ${!isUser ? 'pr-12' : ''}
                                        `}>
                                            {isPayment ? (
                                                <PaymentCard
                                                    onDetailedReport={handleUnlockReport}
                                                />
                                            ) : (
                                                <div className="relative">
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
                                                                a: ({ node, ...props }) => <a className="text-primary-gold underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                                            }}
                                                        >
                                                            {displayContent}
                                                        </ReactMarkdown>
                                                    </div>
                                                    {/* [Feature] Message Speaker Button */}
                                                    {/* [Feature] Message Speaker Button (Dual Mode) */}
                                                    {/* [Feature] Message Speaker Button (Top-Right Integrated) */}
                                                    {!isUser && (
                                                        <div className="absolute top-2 right-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAudioMenuMsgId(audioMenuMsgId === msg.id ? null : msg.id);
                                                                }}
                                                                className="p-2 text-gray-500 hover:text-primary-gold transition-colors opacity-80 hover:opacity-100 z-50 cursor-pointer"
                                                                title="듣기 옵션"
                                                            >
                                                                {isVoicePlaying ? (
                                                                    <Volume2 className="w-5 h-5 animate-pulse text-primary-gold" />
                                                                ) : (
                                                                    <Volume2 className="w-5 h-5" />
                                                                )}
                                                            </button>

                                                            {/* [Menu] Popover */}
                                                            {audioMenuMsgId === msg.id && (
                                                                <div className="absolute bottom-full right-0 mb-2 bg-slate-900 border border-primary-gold/30 rounded-xl shadow-xl p-1 w-40 z-[100] animate-fade-in-up flex flex-col gap-1 backdrop-blur-md">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            speak(displayContent);
                                                                            setAudioMenuMsgId(null);
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-gray-200 flex items-center gap-2 transition-colors"
                                                                    >
                                                                        <span>📖</span> 낭독 듣기
                                                                    </button>
                                                                    {/* [Removed] Talk Session Button by User Request */}
                                                                    {/* 
                                                                    <button
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            setAudioMenuMsgId(null);
                                                                            if (!displayContent) return;

                                                                            // [Radio Logic]
                                                                            try {
                                                                                console.log("Generating Radio Script...");
                                                                                const res = await fetch('/api/tts/script', {
                                                                                    method: 'POST',
                                                                                    body: JSON.stringify({ text: displayContent })
                                                                                });
                                                                                const data = await res.json();

                                                                                if (data.script) {
                                                                                    speakScript(data.script);
                                                                                } else {
                                                                                    alert(`스크립트 생성 실패: ${data.error || 'Unknown Error'}`);
                                                                                }
                                                                            } catch (err: any) {
                                                                                console.error(err);
                                                                                alert(`라디오 모드 오류: ${err.message}`);
                                                                            }
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-primary-gold font-medium flex items-center gap-2 transition-colors"
                                                                    >
                                                                        <span>📻</span> 명심 토크 세션
                                                                    </button>
                                                                    */}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* [Image Widget Renderer] */}
                                            {/* [Image Widget Renderer] */}
                                            {imageGenMatch && (
                                                <div className="mt-4 mb-2 overflow-hidden rounded-lg border border-primary-gold/50 bg-black shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                                    <div className="h-48 relative group">
                                                        {/* Real Image Rendering via Pollinations AI (Generative) */}
                                                        <img
                                                            src={`https://images.unsplash.com/photo-${['1620641782983-5acd79044472', '1635070041078-e363dbe005cb', '1677442120370-9831d044733e', '1451187580459-43490279c0fa'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=800&q=80`}
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

                                            {/* [Myeongsim Talk Session - Interrupt Button] */}
                                            {/* Appears only when Voice is Playing (Talk Session Mode) */}


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
                            {
                                (() => {
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
                                            // [Fix] Extract action_plan and ensure analysisData exists
                                            if (parsedData.action_plan) {
                                                if (!analysisData) analysisData = {};
                                                analysisData.action_plan = parsedData.action_plan;
                                            }
                                            // [Fix] Extract talent_report
                                            if (parsedData.talent_report) {
                                                if (!analysisData) analysisData = {};
                                                analysisData.talent_report = parsedData.talent_report;
                                            }
                                            // [Fix] Extract gaugeData (uiData) and map to analysisData for LevelGaugeCard
                                            if (parsedData.gaugeData) {
                                                if (!analysisData) analysisData = {};
                                                // Map gaugeData fields to analysisData for LevelGaugeCard compatibility
                                                analysisData.innate_level = parsedData.gaugeData.innate_level || 300;
                                                analysisData.current_level = parsedData.gaugeData.current_level || parsedData.gaugeData.score || 400;
                                            }
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
                                            // [Fix] Regex Fallback for action_plan
                                            const actionPlanMatch = jsonPart.match(/"action_plan":\s*(\[[\s\S]*?\])(?:,\s*"|}$)/);
                                            if (actionPlanMatch) {
                                                try {
                                                    const plan = JSON.parse(actionPlanMatch[1]);
                                                    if (!analysisData) analysisData = {};
                                                    analysisData.action_plan = plan;
                                                } catch (e) { }
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
                                                    <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-4 mb-6 animate-fade-in-up">
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

                                            {/* [AI Image Gen] Auto-generated consultation image */}
                                            {msg.role === 'assistant' && displayText && displayText.length > 50 && (() => {
                                                // 상담 주제 키워드 추출
                                                const topicKeywords: Record<string, string> = {
                                                    '연애|사랑|이별|결혼|배우자|짝|소개팅': 'romantic love couple heart connection pink sunset',
                                                    '직장|회사|상사|동료|이직|취업|승진': 'professional career success mountain peak sunrise triumph',
                                                    '돈|재물|재정|투자|부자|재산': 'golden prosperity wealth coins treasure abundance light',
                                                    '건강|몸|스트레스|불안|피곤|잠': 'peaceful healing calm nature zen meditation water',
                                                    '가족|부모|자녀|아이|형제|집안': 'warm family home tree roots nurturing embrace',
                                                    '미래|운세|앞으로|목표|꿈': 'mystical cosmic future stars universe destiny path',
                                                    '힘들|고통|슬픔|우울|외로': 'hope healing light emerging from darkness comfort warmth'
                                                };

                                                // 텍스트에서 주제 찾기
                                                const lowerText = displayText.toLowerCase();
                                                let imageTheme = 'spiritual coaching healing warm light mystical';

                                                for (const [pattern, theme] of Object.entries(topicKeywords)) {
                                                    const regex = new RegExp(pattern);
                                                    if (regex.test(lowerText)) {
                                                        imageTheme = theme;
                                                        break;
                                                    }
                                                }

                                                // 핵심 문구 추출 (첫 30자 + 주제)
                                                const cleanText = displayText
                                                    .replace(/\*\*/g, '')
                                                    .replace(/\n/g, ' ')
                                                    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
                                                    .slice(0, 30);

                                                // [FIX] Use stable style based on message index, not random
                                                const healingStyles = [
                                                    'ethereal nature photography',
                                                    'soft morning sunlight',
                                                    'zen garden minimalism',
                                                    'misty forest landscape',
                                                    'calm ocean horizon',
                                                    'warm cinematic lighting',
                                                    'blooming flowers macro',
                                                    'peaceful clouds and sky'
                                                ];
                                                // Use message index for stable style selection
                                                const selectedStyle = healingStyles[idx % healingStyles.length];

                                                // Create stable prompt for Pexels
                                                const imagePrompt = `beautiful healing nature, ${selectedStyle}, ${cleanText}, soft colors, peaceful atmosphere`;

                                                // [FIX] Add key prop to prevent re-render on typing
                                                return <PexelsImage key={`pexels-${idx}`} prompt={imagePrompt} />;
                                            })()}

                                            {/* [Action Plan Card] (New) */}
                                            {analysisData && analysisData.action_plan && Array.isArray(analysisData.action_plan) && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-md mt-4 mb-6 animate-fade-in-up">
                                                    <ActionPlanCard plan={analysisData.action_plan} />
                                                </div>
                                            )}

                                            {/* [Talent Report Card] (New) */}
                                            {analysisData && analysisData.talent_report && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-md mt-4 mb-6 animate-fade-in-up">
                                                    <TalentReportCard data={analysisData.talent_report} />
                                                </div>
                                            )}

                                            {/* [Dynamic Suggestions Rendered from JSON] */}
                                            {suggestions && Array.isArray(suggestions) && suggestions.length > 0 && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-4 mb-6 flex flex-col gap-2 animate-fade-in-up">
                                                    {suggestions.map((opt: any, idx: number) => {
                                                        const label = typeof opt === 'string' ? opt : opt.label || JSON.stringify(opt);
                                                        const value = typeof opt === 'string' ? opt : opt.value || label;
                                                        // Icons based on position/intent
                                                        const icons = ["💡", "🌿", "⚡"];
                                                        const icon = icons[idx % 3];
                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleSend(value)}
                                                                disabled={isLoading}
                                                                className="w-full text-left p-3 rounded-xl bg-gray-800/50 border border-white/10 hover:border-primary-gold/50 hover:bg-gray-800 transition-all flex items-center gap-3 group disabled:opacity-50 backdrop-blur-sm"
                                                            >
                                                                <div className="w-8 h-8 min-w-[32px] rounded-full bg-gray-900/80 flex items-center justify-center border border-gray-700 group-hover:border-primary-gold group-hover:bg-primary-gold/10 transition-colors shadow-sm">
                                                                    <span className="text-sm">{icon}</span>
                                                                </div>
                                                                <span className="text-gray-200 text-sm font-medium leading-tight">{label}</span>
                                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <span className="text-primary-gold/50 text-xs">select →</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* [NEW] Message Options (Safety Distraction & Standard Choices) */}
                                            {msg.options && msg.options.length > 0 && (
                                                <div className="pl-4 md:pl-12 pr-4 w-full max-w-[95%] md:max-w-[85%] mt-4 mb-6 flex flex-col gap-2 animate-fade-in-up">
                                                    {msg.options.map((option, idx) => (
                                                        <button
                                                            key={`opt-${idx}`}
                                                            onClick={() => handleSend(option)}
                                                            disabled={isLoading}
                                                            className="w-full text-left p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30 hover:bg-indigo-900/50 hover:border-indigo-400 transition-all flex items-center gap-3 group"
                                                        >
                                                            <div className="w-8 h-8 min-w-[32px] rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50 text-indigo-300 group-hover:bg-indigo-500/40">
                                                                <span className="text-sm">{idx + 1}</span>
                                                            </div>
                                                            <span className="text-gray-100 text-sm font-medium">{option}</span>
                                                            <ArrowUp className="w-4 h-4 ml-auto text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform rotate-90" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()
                            }
                        </div >
                    );
                })}
                {/* [Patent Loading Terminal] Visual Wait State */}
                {isLoading && (
                    <div className="px-4 py-4 animate-fade-in-up">
                        <PatentLoadingTerminal />
                    </div>
                )}
                {/* [Auto-scroll] Invisible div at the end of messages */}
                <div ref={messagesEndRef} />
            </div>


            {/* [Neural Flow Input] Dynamic Inline Input */}
            {
                !isLoading && (
                    <div className="p-4 animate-fade-in-up max-w-[95%] md:max-w-[85%] mx-auto w-full mt-4">

                        {/* [NEW] Quick Suggestion Chips (질문 가이드) */}
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 px-1 scrollbar-hide">
                            {/* [Wearable] BioSync Button */}
                            <button
                                onClick={() => setShowBioSync(true)}
                                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isConnected
                                    ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                                    : 'bg-gray-800/80 border-purple-500/30 text-purple-300 hover:bg-gray-700'
                                    }`}
                            >
                                {isConnecting ? (
                                    <span>⏳ ...</span>
                                ) : isConnected ? (
                                    <>
                                        <span>❤️ {bpm}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>⌚ 바이오싱크</span>
                                    </>
                                )}
                            </button>

                            {[
                                "오늘 운세 어때? 🌞",
                                "내 재물운 알려줘 💰",
                                "심리 치유가 필요해 🧠",
                                "나의 타고난 강점은? ✨",
                                "올해 연애운 궁금해 ❤️"
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="bg-gray-800/80 hover:bg-gray-700 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300 whitespace-nowrap transition-colors flex-shrink-0 backdrop-blur-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* [NEW] DrillDown 3D Icon Menu */}
                        <DrillDownIconMenu
                            userProfile={reportData}
                            hideTodayEnergy={true}
                            onSelectIntent={(intent, prompt) => {
                                // [New] Bio-Sync Dashboard View
                                if (intent === 'bio_sync_dashboard_view') {
                                    setShowBioSync(true); // Open Dashboard
                                    return;
                                }

                                // [New] Bio Rhythm Meditation
                                if (intent === 'bio_rhythm_meditation') {
                                    setShowBioSync(true);
                                    simulateRecovery(); // Start decreasing BPM simulation
                                    setTimeout(() => {
                                        handleSend("🧘 **[생체 리듬 명상 시작]**\n\n현재 심박수와 호흡을 동기화합니다.\n화면의 원이 커질 때 숨을 들이마시고, 작아질 때 내쉬세요.\n(Bio-Feedback Loop 활성화)");
                                    }, 1000);
                                    return;
                                }

                                // [New] Patent 1: Neuro-Saju Resonance
                                if (intent === 'bio_patent_1') {
                                    setShowBioSync(true);
                                    simulate();
                                    setTimeout(() => {
                                        handleSend("🧬 **[뉴로-사주 공명 분석]**\n\n고객님의 사주 오행(Wood/Fire) 에너지와 현재 생체 리듬의 공명도를 측정합니다.\n\n...데이터 동기화 중...\n\n✅ 공명 지수: 87% (매우 높음)\n현재 직관력이 극대화된 상태입니다. 중요한 결정을 내리기 좋은 타이밍입니다.");
                                    }, 1500);
                                    return;
                                }

                                // [New] Patent 2: Subconscious Truth Detector
                                if (intent === 'bio_patent_2') {
                                    setShowBioSync(true);
                                    simulate();
                                    setTimeout(() => {
                                        handleSend("🕵️ **[무의식 진실 탐지기]**\n\n표면적 대답이 아닌, 미세한 생체 신호 변동(GSR/HRV)을 통해 무의식의 진실을 포착합니다.\n\n질문을 던져보세요. 몸이 반응하는 그 순간이 진짜 정답입니다.");
                                    }, 1500);
                                    return;
                                }

                                // [New] Smart Context Card - 오늘의 에너지 분석
                                if (intent === 'smart_context_card') {
                                    setShowSmartContext(true);
                                    return;
                                }

                                // [New] Golden Time Analysis - 골든타임 알림
                                if (intent === 'golden_time_analysis') {
                                    const hour = new Date().getHours();
                                    let goldenMsg = '';
                                    if (hour >= 9 && hour < 12) {
                                        goldenMsg = '🌅 **[골든타임 분석]**\n\n지금은 **오전 집중 구간**입니다!\n\n당신의 사주와 현재 바이오리듬을 분석한 결과:\n- 🧠 창의적 작업에 최적\n- 💡 중요한 아이디어 정리\n- ❌ 단순 반복 업무는 피하세요\n\n**지금 가장 집중해야 할 한 가지는 뭔가요?**';
                                    } else if (hour >= 14 && hour < 17) {
                                        goldenMsg = '☀️ **[골든타임 분석]**\n\n지금은 **오후 결정 구간**입니다!\n\n당신의 사주와 현재 바이오리듬을 분석한 결과:\n- ⚖️ 중요한 결정 내리기에 최적\n- 🤝 미팅/협상에 유리\n- ❌ 새로운 학습은 비효율적\n\n**미루고 있던 결정이 있다면 지금이 타이밍이에요!**';
                                    } else {
                                        goldenMsg = '🌙 **[골든타임 분석]**\n\n지금은 **휴식 & 정리 구간**입니다.\n\n당신의 사주와 현재 바이오리듬을 분석한 결과:\n- 📝 하루 정리/회고에 최적\n- 🧘 명상/산책 추천\n- ❌ 중요한 결정은 내일로\n\n**오늘 하루 중 가장 잘한 일은 뭐였나요?**';
                                    }
                                    handleSend(goldenMsg);
                                    return;
                                }

                                // [New] Neural Profile Analysis Breakdown
                                if (intent === 'neural_profile_analysis') {
                                    // Explicitly request the detailed fusion analysis
                                    handleSend("나의 **Gene Keys(황금 경로)**와 **사주(Self)**를 융합하여, **Life's Work 부터 Purpose 까지** 상세하게 분석해줘. 각 Gate의 그림자(Shadow), 선물(Gift), 시디(Siddhi)에 대한 설명도 포함해줘.");
                                    return;
                                }

                                // ============================================
                                // [NEW] 중독 회복 & SOS 긴급 - 심리치료 기반
                                // ============================================

                                // [ACT] 금연 알아차림 - 수용전념치료
                                if (intent === 'quit_smoking_act') {
                                    const actMsg = `🚭 **[금연 알아차림 - ACT 기반]**

**지금 이 순간, 흡연 욕구를 느끼고 계신가요?**

✨ **알아차림의 알아차림:**
> "욕구가 있다"는 것을 알아차린 당신은
> 이미 욕구에 지배당하지 않는 상태입니다.

🌊 **파도 타기 기법 (Urge Surfing):**
욕구는 파도처럼 밀려왔다가 반드시 사라집니다.
지금부터 3분만 함께 파도를 타볼까요?

1. 👃 깊게 숨을 들이쉬세요 (4초)
2. 🫁 천천히 내쉬세요 (6초)
3. 🧠 "이 욕구도 지나갈 것이다"라고 관찰하세요

**지금 무엇이 당신을 담배로 이끌고 있나요?**`;
                                    handleSend(actMsg);
                                    return;
                                }

                                // [CBT] 금주 알아차림 - 인지행동치료
                                if (intent === 'quit_drinking_cbt') {
                                    const cbtMsg = `🍺 **[금주 알아차림 - CBT 기반]**

**음주 충동이 느껴지시나요?**

🧠 **인지 재구성 질문:**
> "술을 마시면 정말 기분이 나아질까요?"
> "내일 아침의 나는 어떤 기분일까요?"

📝 **생각-감정-행동 연결:**
| 상황 | 자동적 생각 | 감정 | 대안적 생각 |
|---|---|---|---|
| 스트레스 | "한 잔만..." | 충동 | "이건 착각이다" |

⚡ **즉각 대처 행동:**
1. 🚶 장소를 바꾸세요 (5분만)
2. 📞 지인에게 전화하세요
3. 💧 물을 크게 한 잔 마시세요

**지금 술을 마시고 싶게 만드는 상황이 뭔가요?**`;
                                    handleSend(cbtMsg);
                                    return;
                                }

                                // [DBT] 중독 탈출 - 변증법적행동치료
                                if (intent === 'addiction_escape_dbt') {
                                    const dbtMsg = `🎮 **[중독 탈출 - DBT 기반]**

**디지털/도박/쇼핑... 멈출 수 없는 느낌인가요?**

🔥 **고통 감내 기술 (Distress Tolerance):**

**TIPP 기법으로 즉시 진정:**
- **T**emperature: 찬물로 세수하기 🧊
- **I**ntense Exercise: 10초 제자리 뛰기 🏃
- **P**aced Breathing: 4-7-8 호흡 🫁
- **P**aired Relaxation: 근육 이완 💆

🛡️ **STOP 기술:**
- **S**top: 멈춰!
- **T**ake a step back: 한 발 물러나
- **O**bserve: 관찰해
- **P**roceed mindfully: 현명하게 행동해

**지금 가장 하고 싶은 충동적 행동은 뭔가요?**`;
                                    handleSend(dbtMsg);
                                    return;
                                }

                                // [MBCT] SOS 긴급 - 마음챙김인지치료 + 위기개입
                                if (intent === 'sos_crisis_mbct') {
                                    // 직접 위기 개입 화면 활성화
                                    setShowCrisisMode(true);
                                    setCrisisPhase('breathing');
                                    return;
                                }
                                if (intent === 'demo_patent_features') {
                                    setShowBioSync(true); // 1. 모달 열기
                                    simulate(); // 2. 가상 연결 시작 (BPM 시뮬레이션)

                                    // 3. 특허 기능 시나리오 연출 (타임라인)
                                    setTimeout(() => {
                                        // 사용자 입장에서 감지 메시지 자동 발송 (시스템 로그처럼)
                                        handleSend("⚠️ [System Alert] 생체 신호 이상 패턴 감지 (BPM 115 구간 진입)");
                                    }, 3000);

                                    setTimeout(() => {
                                        // AI의 능동적 개입 (Active Intervention)
                                        const interventionMsg: Message = {
                                            id: Date.now().toString(),
                                            role: 'assistant',
                                            content: "🚨 **[긴급 생체 반응 감지]**\n\n고객님, 현재 심박수가 급격히 상승하여 '불안/스트레스' 패턴(Red Zone)에 진입했습니다.\n\n이는 단순한 감정 변화가 아닌, 신경계의 과부하 신호일 수 있습니다.\n\n**특허 기반 능동 처방:**\n즉시 하던 일을 멈추고 심호흡을 3회 실시하세요. 제가 진정 주파수(432Hz)를 재생하겠습니다. (특허 제 10-2025-0166877 구현 예시)"
                                        };
                                        setMessages((prev) => [...prev, interventionMsg]);
                                        playGameSound('levelup'); // 알림음 대용
                                    }, 5500);
                                    return;
                                }

                                // [New] Patent Demo 2: 선제적 예방 (Preventive Care)
                                if (intent === 'demo_preventive_care') {
                                    setShowBioSync(true);
                                    simulate();

                                    setTimeout(() => {
                                        handleSend("🔎 [Pattern Analysis] 지난 2주간 데이터와 대조 중... 미세 변동 감지");
                                    }, 2000);

                                    setTimeout(() => {
                                        const preventiveMsg: Message = {
                                            id: Date.now().toString(),
                                            role: 'assistant',
                                            content: "🛡️ **[선제적 스트레스 예방 알림]**\n\n고객님, 현재 심박수는 정상이지만 '심박 변이도(HRV)'가 급격히 낮아지고 있습니다.\n\n이는 통계적으로 30분 내에 스트레스성 긴장이 올 확률이 85%임을 시사합니다.\n\n**AI 추천 예방책:**\n지금 하시는 업무를 잠시 멈추고 5분간 창밖을 보거나 따뜻한 차를 마시는 것이 효율을 20% 높여줄 것입니다."
                                        };
                                        setMessages((prev) => [...prev, preventiveMsg]);
                                        playGameSound('normal');
                                    }, 4500);
                                    return;
                                }

                                // [New] Patent Demo 3: 통합 치유 프로토콜 (Integrated Therapy)
                                if (intent === 'demo_integrated_therapy') {
                                    setShowBioSync(true);
                                    simulate();

                                    setTimeout(() => {
                                        handleSend("🧠 [Protocol Start] 통합 심리 치유 시퀀스 가동 (CBT + DBT + ACT)");
                                    }, 2000);

                                    // Step 1: 알아차림 (Mindfulness)
                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_1",
                                            role: 'assistant',
                                            content: "1️⃣ **[알아차림]**: 지금 심장이 조금 빠르게 뛰는 것을 느끼시나요? 그것을 '나쁜 것'으로 판단하지 말고, 단지 '몸의 감각'으로만 바라봐주세요. (메타인지 활성화)"
                                        }]);
                                    }, 4000);

                                    // Step 2: 수용 (DBT)
                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_2",
                                            role: 'assistant',
                                            content: "2️⃣ **[수용]**: 불안해도 괜찮습니다. 이 감정은 지나가는 파도와 같습니다. 억지로 없애려 하지 말고 파도 타듯이 맡겨보세요. (감정 조절)"
                                        }]);
                                    }, 8000);

                                    // Step 3: 인지 재구성 (CBT)
                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_3",
                                            role: 'assistant',
                                            content: "3️⃣ **[인지 재구성]**: 지금 드는 걱정이 '팩트'인가요, 아니면 두려움이 만들어낸 '상상'인가요? 최악의 상황이 실제로 일어날 확률은 얼마나 될까요? (현실 검증)"
                                        }]);
                                    }, 12000);

                                    // Step 4: 행동 활성화 (ACT)
                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_4",
                                            role: 'assistant',
                                            content: "4️⃣ **[가치 전념 행동]**: 지금 당장, 내가 추구하는 가치를 위해 할 수 있는 가장 작은 행동 하나는 무엇인가요? 그것을 지금 실행합시다. (실행력 회복)"
                                        }]);
                                        playGameSound('cheer');
                                    }, 16000);

                                    return;
                                }

                                // [New] Patent Demo 4: 실시간 진정 효과 (Real-time Recovery)
                                if (intent === 'demo_realtime_recovery') {
                                    setShowBioSync(true);
                                    setEmdrActive(false);
                                    simulateRecovery();

                                    handleSend("📉 [Bio-Feedback] 실시간 진정 프로토콜 시작. 화면의 박동에 맞춰 호흡하세요.");

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString(),
                                            role: 'assistant',
                                            content: "🌬️ **[호흡 동기화 가이드]**\n\n현재 심박수: **118 BPM** (과각성)\n\n제 신호에 맞춰주세요:\n1. 들이마시고... (4초)\n2. 멈추고... (4초)\n3. 내쉬세요... (4초)\n\n(이 과정을 반복하면 심박수가 안정됩니다)"
                                        }]);
                                    }, 1000);

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_complete",
                                            role: 'assistant',
                                            content: "✅ **[안정화 완료]**\n\n심박수가 정상 범위(**72 BPM**)로 돌아왔습니다. 미주신경 활성화가 확인되었습니다."
                                        }]);
                                        playGameSound('levelup');
                                    }, 22000);
                                    return;
                                }

                                // [New] Patent Demo 5: EMDR 트라우마 케어
                                if (intent === 'demo_emdr_session') {
                                    setShowBioSync(true);
                                    setEmdrActive(true); // Enable EMDR Mode
                                    simulateRecovery();

                                    handleSend("👁️ [EMDR Protocol] 안구 운동 정보처리 모드 활성화. 트라우마 네트워크 재처리 시작.");

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString(),
                                            role: 'assistant',
                                            content: "🧠 **[EMDR 가이드]**\n\n1. 고개를 고정한 채, **눈동자만** 움직여 화면의 불빛을 따라가세요.\n2. 지금 느끼는 불안한 감정을 떠올리세요.\n3. 불빛을 따라 좌우로 눈을 움직이며 그 감정이 어떻게 변하는지 관찰하세요."
                                        }]);
                                    }, 1500);

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_emdr_end",
                                            role: 'assistant',
                                            content: "✅ **[세션 완료]**\n\n뇌의 정보 처리 시스템이 활성화되어 부정적 감정의 강도가 감소했습니다. (BPM 118 -> 72 안정화)"
                                        }]);
                                        setEmdrActive(false); // Stop Animation
                                    }, 25000);
                                    return;
                                }

                                // [World Class Idea 1] Neuro-Saju Resonance
                                if (intent === 'demo_neuro_saju') {
                                    setShowBioSync(true);
                                    handleSend("🧬 [Neuro-Saju Test] 사주 데이터를 신경계와 대조합니다. '화(火)' 기운에 대한 반응을 측정하겠습니다.");
                                    simulate(); // Start Normal

                                    setTimeout(() => {
                                        // Trigger Spike
                                        simulateRecovery(); // Reset
                                        handleSend("⚠️ 시각 자극: [丙火 - 병화] (귀하의 기신)");
                                    }, 3000);

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString(),
                                            role: 'assistant',
                                            content: "📈 **[공명 현상 감지]**\n\n'불(Fire)'의 기운을 마주하자 심박수가 15% 급상승(98 BPM ↗ 115 BPM)했습니다.\n\n이는 귀하의 세포가 과거의 '화(火)'와 관련된 트라우마를 기억하고 있다는 생물학적 증거입니다. 이 운명을 피하지 않고 다룰 수 있도록 뇌신경 훈련을 제안합니다."
                                        }]);
                                        playGameSound('levelup');
                                    }, 6000);
                                    return;
                                }

                                // [World Class Idea 2] Subconscious Truth Detector
                                if (intent === 'demo_subconscious_check') {
                                    setShowBioSync(true);
                                    handleSend("🎭 [Deep Mind] 무의식 정합성 테스트를 시작합니다. 제가 묻는 말에 마음속으로 대답하세요.");
                                    simulate();

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_q",
                                            role: 'assistant',
                                            content: "❓ **질문**: 당신은 지금 하고 있는 일에서 진정한 의미를 찾고 있습니까?"
                                        }]);
                                    }, 2500);

                                    setTimeout(() => {
                                        // Spike BPM
                                        handleSend("🗣️ 사용자 답변(가정): \"네, 그렇습니다.\"");
                                    }, 5000);

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_a",
                                            role: 'assistant',
                                            content: "🚨 **[부조화 경고]**\n\n언어적 답변은 긍정이었으나, 자율신경계는 '거부 반응(Stress Spike)'을 보였습니다.\n\n이것은 **'착한 아이 콤플렉스'**로 인한 무의식적 거짓말일 가능성이 92%입니다. 솔직한 내면을 마주하는 '그림자 작업(Shadow Work)' 챕터로 이동하시겠습니까?"
                                        }]);
                                        playGameSound('normal');
                                    }, 7500);
                                    return;
                                }

                                // [World Class Idea 3] Frequency Tuning
                                if (intent === 'demo_frequency_tuning') {
                                    setShowBioSync(true);
                                    simulate(); // Low Hz simulation implicitly
                                    handleSend("🌌 [Bio-Quantum] 현재 생체 에너지의 '의식 주파수(Hz)'를 측정합니다...");

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_hz_1",
                                            role: 'assistant',
                                            content: "📉 **현재 상태: 75 Hz (슬픔/후회)**\n현재 에너지가 무겁게 가라앉아 있습니다. 상위 차원으로 튜닝을 시도합니다."
                                        }]);
                                    }, 3000);

                                    setTimeout(() => {
                                        handleSend("🎵 [Tuning] 528Hz 솔페지오 주파수(DNA 복구) 재생 중...");
                                        simulateRecovery(); // Calm down
                                    }, 5000);

                                    setTimeout(() => {
                                        setMessages(prev => [...prev, {
                                            id: Date.now().toString() + "_hz_done",
                                            role: 'assistant',
                                            content: "✨ **[튜닝 완료]**\n\n**현재 상태: 350 Hz (수용/용기)**\n\n심박 변이도가 안정화되었으며, 뇌파가 '알파파' 대역에 진입했습니다. 이제 중요한 결정을 내리셔도 좋습니다."
                                        }]);
                                        playGameSound('cheer');
                                    }, 9000);
                                    return;
                                }

                                // [New] Bio-Energy Blueprint Modal Trigger
                                if (intent === 'deep_health_weakness' || intent === 'bio_energy_scan') {
                                    // Determine type based on Saju (Simple Logic for Demo)
                                    // If Fire/Wood is strong -> Heat, If Water/Metal is strong -> Cool
                                    const dm = reportData?.saju?.dayMaster || '';
                                    const isCool = dm.includes('임') || dm.includes('계') || dm.includes('경') || dm.includes('신');
                                    setBlueprintType(isCool ? 'COOL' : 'HEAT');
                                    setShowBlueprintModal(true);
                                    return;
                                }

                                // [FIX] Self-Coaching & Awakening Logic Integration
                                // Intents starting with 'p_' (108 items) or specific keys utilize the Hidden Intent mechanism
                                if (intent.startsWith('p_') || intent === 'hour_pillar_desire' || intent === 'year_pillar_roots' || intent.startsWith('saju_') || intent.startsWith('assess_') || intent.startsWith('deep_') || intent === 'gongmang_deep_analysis' || intent === 'ohaeng_balance_report') {
                                    setInput(prompt);
                                    // Send Visible Prompt + Hidden Intent ID
                                    setTimeout(() => handleSend(prompt, `[INTENT:${intent}]`), 100);
                                    return;
                                }

                                // Default Handler for DrillDown Intents (Mindflow System etc.)
                                // Sending prompt as HIDDEN payload to keep chat clean
                                const friendlyMessages: Record<string, string> = {
                                    'wealth_reading': '💰 저의 재물운 흐름을 분석해주세요.',
                                    'love_tarot': '❤️ 저의 연애운 흐름을 분석해주세요.',
                                    'career_path': '💼 저의 직업운 흐름을 분석해주세요.',
                                    'saju_basic_analysis': '📜 상세 사주 원국을 분석해주세요.',
                                    'today_fortune': '🌞 오늘의 운세를 알려주세요.',
                                    'iching_code_search': '📖 64코드 사색을 실행합니다.', // [Added]
                                    // Add more mappings as needed, default fallback below
                                };

                                const userVisibleMessage = friendlyMessages[intent] || `🔮 ${prompt.substring(0, 20)}... (상세 분석 요청)`;

                                // Send: (Visible Message, Hidden System Prompt)
                                handleSend(userVisibleMessage, prompt);
                            }}
                        />

                        {/* [NEW] Bio-Energy Blueprint Modal (Medical Engineering UI) */}
                        <BioEnergyBlueprintModal
                            isOpen={showBlueprintModal}
                            onClose={() => setShowBlueprintModal(false)}
                            dayMaster={reportData?.saju?.dayMaster || '갑목'}
                            energyType={blueprintType}
                        />

                        {/* [NEW] Bio-Sync Modal (Wearable Connection Interface) */}
                        {showBioSync && (
                            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" style={{ zIndex: 2000 }}>

                                <div className="bg-[#1A1F2B] w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl relative">
                                    <button
                                        onClick={() => setShowBioSync(false)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-full bg-white/5"
                                    >✕</button>

                                    <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                        <span className="text-purple-400">⚡</span> Bio-Sync
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-6">생체 데이터를 AI에 실시간 동기화합니다</p>

                                    <div className="flex flex-col items-center justify-center py-6">
                                        {/* Heart Animation */}
                                        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isConnected ? 'bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-gray-800/50'}`}>
                                            {isConnected ? (
                                                <div className="text-center">
                                                    <span className="block text-5xl font-black text-red-500 animate-pulse tracking-tighter">{bpm > 0 ? bpm : '--'}</span>
                                                    <span className="text-[10px] text-red-300 font-bold tracking-[0.2em] uppercase mt-1 block">BPM</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 text-4xl font-thin">--</span>
                                            )}
                                        </div>

                                        <div className="text-center mb-8">
                                            <p className="text-sm font-bold text-white mb-1">
                                                {isConnecting ? "연결 시도 중..." : isConnected ? (deviceName || "Galaxy Watch") : "기기 연결 대기 중"}
                                            </p>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                                                <span className="text-xs text-gray-500">{isConnected ? "실시간 데이터 전송 중" : "연결 안 됨"}</span>
                                            </div>
                                        </div>

                                        <div className="w-full flex flex-col gap-3">
                                            {!isConnected ? (
                                                <>
                                                    <button
                                                        onClick={connect}
                                                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                                                    >
                                                        <span>📡</span> 블루투스 기기 찾기
                                                    </button>
                                                    <button
                                                        onClick={simulate}
                                                        className="w-full py-3.5 bg-gray-700 hover:bg-gray-600 rounded-xl text-gray-300 font-medium transition-all text-sm flex items-center justify-center gap-2 border border-white/5"
                                                    >
                                                        <span>🧪</span> 가상 시뮬레이션 모드
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={disconnect}
                                                    className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-bold transition-all"
                                                >
                                                    연결 해제
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ghost Bubble Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="relative group w-full"
                        >
                            <div className="absolute inset-0 bg-primary-gold/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isExpired ? "🔒 이용권이 만료되었습니다. 충전 후 이용해주세요." : "이곳을 터치해서 대화를 시작하세요..."}
                                className={`w-full bg-[#1A1F2B] backdrop-blur-xl border rounded-2xl pl-6 pr-14 py-5 text-white placeholder-gray-400 focus:outline-none transition-all relative z-10 text-lg shadow-inner ${isExpired ? 'border-red-500/50 cursor-not-allowed opacity-60' : 'border-white/20 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/50'}`}
                                autoFocus
                                disabled={isExpired}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                                {/* [Removed] Mic Button */}

                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className={`p-2 rounded-xl transition-all flex items-center justify-center
                                        ${input.trim()
                                            ? 'bg-primary-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95'
                                            : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                                >
                                    <Send className={`w-5 h-5 ${input.trim() ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-500 text-[10px] mt-3 leading-tight opacity-70">
                            본 서비스는 의학적 진단이 아니며, 건강 증진을 위한 가이드입니다. <br />
                            정확한 진단과 치료는 반드시 전문의와 상담하십시오.
                        </p>
                    </div>
                )
            }



            {/* [Neural Flow Input] Dynamic Input End */}

            {/* Level Up Modal */}
            <AnimatePresence>
                {showModal && (
                    <LevelUpModal
                        level={2}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Payment Modal - Removed (component missing) */}

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

            {/* [Safety] SOS Breathing Guide Modal */}
            <BreathingGuideModal
                isOpen={showBreathingGuideFromChat}
                onClose={() => setShowBreathingGuideFromChat(false)}
                onComplete={() => {
                    console.log('🧘 [Breathing] User completed breathing exercise');
                    // Continue conversation after breathing
                }}
            />

            {/* [Removed] Mic Permission Guide */}
        </div >
    );
}
