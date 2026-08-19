import { useReportStore } from '@/store/useReportStore';
import ExperimentAnalyticsWidget from '../analytics/ExperimentAnalyticsWidget';
import PushAbOptimizerWidget from '../analytics/PushAbOptimizerWidget';
import PushComparisonDashboard from '../analytics/PushComparisonDashboard';
import OneMinuteCompassionBreathing from './OneMinuteCompassionBreathing';
import { calculateArchetypeAndStrengths, TransmutedSuperpower } from '@/lib/alchemy/archetypeEngine';
import { calculateSajuAlchemyFusion, FusionResult } from '@/lib/engine/sajuAlchemyFusion';
import { generatePersonalizedSajuGreeting } from '@/lib/engine/sajuDiagnosisGenerator';
import { calculatePersonalizedSajuRarity } from '@/lib/engine/sajuRarityEngine';
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Activity, Layers, Droplets, Brain, Clock, 
    Play, Pause, RotateCcw, ShieldCheck, ArrowRight, Heart, 
    CheckCircle2, Compass, Waves, Flame, Eye, RefreshCw,
    Volume2, Target, Check, AlertCircle, FileText, Sparkle,
    Trophy, Zap, Edit3, Award, Moon, BarChart3, Share2, 
    Anchor, Bookmark, LayoutDashboard, Sliders, CheckCircle,
    Download, Copy
} from 'lucide-react';

interface ZeroPoint3SMatrixModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile?: any;
}

type MainTabType = 'coaching_room' | 'dashboard' | 'focus_lab' | 'archive';

interface SessionLog {
    id: string;
    task: string;
    durationMin: number;
    date: string;
    reclaimedScore: number;
    note?: string;
}


    // Helper to parse interactive choice chips from chatbot text
    
// -------------------------------------------------------------
// [Helper Functions for Saju 1:1 & Interactive 1-Tap Chips]
// -------------------------------------------------------------
const playHarmonicTone = (durationSec = 10) => {
    try {
        if (typeof window === 'undefined') return;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationSec);
    } catch (e) {
        console.error('Audio play error:', e);
    }
};

const extractChoiceChips = (text: string, dayMasterChar: string = '甲'): Array<{ key: string; label: string }> => {
    if (!text) return [];
    const lines = text.split('\n');
    const results: Array<{ key: string; label: string }> = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Skip any header titles (e.g. **[1-Tap 추천 선택지]**, 1-Tap 선택지 터치 등)
        if (
            trimmed.includes('선택지') ||
            trimmed.includes('추천') ||
            trimmed.includes('1-Tap') ||
            trimmed.includes('Tap') ||
            trimmed.includes('B-minus') ||
            trimmed.startsWith('**[')
        ) {
            continue;
        }

        // Matches: * [A] ..., - [A] ..., [A] ..., * A. ..., A) ..., 1. [A] ..., 1) ...
        const match = trimmed.match(/^(?:[\*\-\•\d\.]+\s*)?\[?([A-Da-d1-4])\]?[.:\)\s\-]+(.+)$/);
        if (match) {
            const rawKey = match[1].toUpperCase();
            const keyMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
            const key = keyMap[rawKey] || rawKey;
            let label = match[2].trim();
            
            // Strip any remaining brackets like [A] at start of label
            label = label.replace(/^\[[A-Da-d1-4]\]\s*/, '').trim();

            if (label && !results.some(r => r.key === key)) {
                results.push({ key, label });
            }
        }
    }

    // If AI failed to output choices, provide dynamic context-aware smart choices based on text keywords
    if (results.length < 2) {
        if (text.includes('흙') || text.includes('뿌리') || text.includes('부목') || text.includes('거목') || dayMasterChar === '甲') {
            return [
                { key: 'A', label: '뿌리(환경)가 부족해 흔들렸음을 인정합니다 🌲' },
                { key: 'B', label: '거목이라는 이상과 현실의 간극을 내려놓겠습니다 💡' },
                { key: 'C', label: '10분 물리적 환경 루틴을 즉시 가동하겠습니다 ⏱️' }
            ];
        } else if (text.includes('보석') || text.includes('메스') || text.includes('정밀') || dayMasterChar === '辛') {
            return [
                { key: 'A', label: '완벽주의의 채찍질을 내려놓고 30점 초안 깔기 💎' },
                { key: 'B', label: '남의 위기 대신 내 1순위 본진 지키기 🛡️' },
                { key: 'C', label: '10초 이완 후 내 과제 10분 마이크로 시동 ⏱️' }
            ];
        } else {
            return [
                { key: 'A', label: '명리적 원인을 깊이 이해하고 인정합니다 💡' },
                { key: 'B', label: '내면의 자기 불일치를 내려놓고 중심 잡기 🌿' },
                { key: 'C', label: '10분 마이크로 루틴으로 지금 즉시 착수 ⏱️' }
            ];
        }
    }

    return results;
};

const getCleanChatText = (text: string): string => {
    if (!text) return '';
    const lines = text.split('\n');
    const cleanLines: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            cleanLines.push(line);
            continue;
        }

        // 1. Header titles filtering (B-minus, 1-Tap, 선택지 헤더 등 모든 내부 기획 태그 완벽 제거)
        if (
            trimmed.includes('1-Tap 선택지') ||
            trimmed.includes('1-Tap 추천') ||
            trimmed.includes('B-minus') ||
            trimmed.includes('minus 1-Tap') ||
            trimmed.includes('추천 선택지') ||
            trimmed.includes('선택지 터치') ||
            trimmed.includes('선택지]') ||
            trimmed.startsWith('**[') && trimmed.includes('선택지')
        ) {
            continue;
        }

        // 2. Choice bullets filtering (* [A], - [A], [A], * [B], [C] etc.)
        const isChoiceItem = /^(?:[\*\-\•\d\.]+\s*)?\[?[A-Da-d1-4]\]?[.:\)\s\-]+.+$/.test(trimmed) &&
            (trimmed.includes('[A]') || trimmed.includes('[B]') || trimmed.includes('[C]') || trimmed.includes('[D]') ||
             trimmed.startsWith('* [') || trimmed.startsWith('- [') || trimmed.startsWith('[A') || trimmed.startsWith('[B') || trimmed.startsWith('[C') || trimmed.startsWith('[D'));

        if (isChoiceItem) {
            continue;
        }

        cleanLines.push(line);
    }
    const result = cleanLines.join('\n').trim();
    return result || text;
};



function extractSajuChar(val: any): string {
    if (!val) return '';
    if (typeof val === 'string') {
        if (val.includes('[object Object]')) return '';
        return val.trim();
    }
    if (typeof val === 'object') {
        const found = val.char || val.gan || val.ji || val.kor || val.ganKor || val.jiKor || val.name || val.value || '';
        return typeof found === 'string' ? found.trim() : '';
    }
    return String(val).trim();
}


export default function ZeroPoint3SMatrixModal({ isOpen, onClose, userProfile }: ZeroPoint3SMatrixModalProps) {

    const [activeTab, setActiveTab] = useState<MainTabType>('coaching_room');
    const [dashboardPeriod, setDashboardPeriod] = useState<'weekly' | 'monthly'>('weekly');
    const [dashboardMode, setDashboardMode] = useState<'energy_flow' | 'ab_push_analytics'>('energy_flow');

    // -------------------------------------------------------------
    // [Global Persistent Wellness State]
    // -------------------------------------------------------------
    const [totalReclaimedMins, setTotalReclaimedMins] = useState<number>(40);
    const [darkCodeBlocksCount, setDarkCodeBlocksCount] = useState<number>(3);
    const [sovereignScore, setSovereignScore] = useState<number>(84);
    const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([
        { id: '1', task: '미뤄둔 프로젝트 기획서 1단락 작성', durationMin: 10, date: '오늘 오전', reclaimedScore: 84, note: '완벽주의 내려놓고 3문장 시동 완료' },
        { id: '2', task: '타인 위기 개입 멈추고 내 본업 착수', durationMin: 10, date: '어제', reclaimedScore: 80, note: '남 일 대신 내 코어 작업 지켜냄' },
        { id: '3', task: '미루던 재정 검토 10분 마이크로 스타트', durationMin: 20, date: '2일 전', reclaimedScore: 88, note: '막상 시작하니 10분이 금방 지나감' }
    ]);
    const [savedNotes, setSavedNotes] = useState<string[]>([
        '기획서 1단락의 핵심 메시지는 단순함으로 잡자.',
        '남의 불을 끄지 않아도 세상은 스스로 잘 돌아간다.'
    ]);

    // -------------------------------------------------------------
    // [Tab 1: Coaching Room State]
    // -------------------------------------------------------------
    const [chatMessages, setChatMessages] = useState<Array<{
        role: 'user' | 'assistant';
        text: string;
        time: string;
        widgetType?: 'breathing' | 'timer' | 'cbt_chips' | 'stamp';
    }>>([
        {
            role: 'assistant',
            text: '안녕하세요. 명심 제로포인트 3S 1:1 맞춤형 코치입니다.\n\n당신이 오랫동안 마주하기 두려워 방치해 두었던 **"진짜 본진 1순위 과제"**는 무엇인가요? 거대한 부담과 불안을 말씀해 주시면, 뇌의 과열을 끄고 즉시 [10분 마이크로 시동]을 켤 수 있도록 지휘해 드리겠습니다.\n\n**[B-minus 1-Tap 선택지]**\n* [A] 완벽하게 못 할 바엔 다 때려치우고 싶어요 ⚡\n* [B] 전 역시 의지박약인가 봐요 (자책감) 🌿\n* [C] 남 일 돕느라 내 본업이 방치됐어요 (구원자 트랩) 💡',
            time: '방금 전'
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Inline Widget States
    const [inlineBreathingActive, setInlineBreathingActive] = useState<boolean>(false);
    const [inlineBreathingSecs, setInlineBreathingSecs] = useState<number>(10);
    const [inlineBreathPhase, setInlineBreathPhase] = useState<string>('들숨: 가슴 가득 들이마십니다 (4초)');
    const [inlineBreathingCompleted, setInlineBreathingCompleted] = useState<boolean>(false);
    const inlineBreathIntervalRef = useRef<any>(null);

    // -------------------------------------------------------------
    // [Tab 3: Focus Lab & Sleep Coach State]
    // -------------------------------------------------------------
    const [focusSubTab, setFocusSubTab] = useState<'micro_focus' | 'compassion_breath' | 'delta_sleep'>('micro_focus');

    // 1. Micro-Focus Synthesizer
    const [focusDuration, setFocusDuration] = useState<number>(600);
    const [focusTimeLeft, setFocusTimeLeft] = useState<number>(600);
    const [isFocusRunning, setIsFocusRunning] = useState<boolean>(false);
    const [focusAudio, setFocusAudio] = useState<string>('Brown Noise');
    const [focusVolume, setFocusVolume] = useState<number>(0.3);
    const [audioVolume, setAudioVolume] = useState<number>(0.3);
    const [activeTaskInput, setActiveTaskInput] = useState<string>('');
    const [focusSessions, setFocusSessions] = useState<number>(3);

    // Audio Context Refs
    const audioCtxRef = useRef<any>(null);
    const noiseNodeRef = useRef<any>(null);
    const gainNodeRef = useRef<any>(null);
    const binauralOsc1Ref = useRef<any>(null);
    const binauralOsc2Ref = useRef<any>(null);
    const osc1Ref = useRef<any>(null);
    const osc2Ref = useRef<any>(null);

    // 2. Compassion Breathing State
    const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [breathTimeLeft, setBreathTimeLeft] = useState<number>(60);
    const [isBreathRunning, setIsBreathRunning] = useState<boolean>(false);
    const [breathCycleCount, setBreathCycleCount] = useState<number>(0);
    const breathAudioRef = useRef<any>(null);

    // 3. Sleep Coach State
    const [sleepTimerOption, setSleepTimerOption] = useState<string>('20분');
    const [sleepRemainingSecs, setSleepRemainingSecs] = useState<number | null>(1200);
    const [isSleepRunning, setIsSleepRunning] = useState<boolean>(false);
    const [sleepVolume, setSleepVolume] = useState<number>(0.2);
    const [brownNoiseEnabled, setBrownNoiseEnabled] = useState<boolean>(true);
    const [dimScreen, setDimScreen] = useState<boolean>(false);
    const [sleepPhase, setSleepPhase] = useState<string>('서파 수면 유도 (432Hz)');
    const [showSleepCompletionPopup, setShowSleepCompletionPopup] = useState<boolean>(false);
    const sleepAudioCtxRef = useRef<any>(null);
    const sleepMasterGainRef = useRef<any>(null);
    const sleepBrownGainRef = useRef<any>(null);
    const sleepNodesRef = useRef<any[]>([]);

    // Modals
    const [showReflectionModal, setShowReflectionModal] = useState<boolean>(false);
    const [realityChoice, setRealityChoice] = useState<string | null>(null);
    const [showOneLineInput, setShowOneLineInput] = useState<boolean>(false);
    const [oneLineIdea, setOneLineIdea] = useState<string>('');
    const [copiedAlert, setCopiedAlert] = useState<string | boolean | null>(null);
    const [showNoiseGuideModal, setShowNoiseGuideModal] = useState<boolean>(false);
    const [showPushCenterModal, setShowPushCenterModal] = useState<boolean>(false);
    const [pushModalTab, setPushModalTab] = useState<'templates' | 'analytics'>('templates');
    const [showRarityModal, setShowRarityModal] = useState<boolean>(false);
    const [showDeclineTemplateModal, setShowDeclineTemplateModal] = useState<boolean>(false);
    const [showAlchemyReportModal, setShowAlchemyReportModal] = useState<boolean>(false);
    const [currentDarkCodeStep, setCurrentDarkCodeStep] = useState<number>(1);

    const startInlineBreathing = () => {
        if (inlineBreathingActive) return;
        setInlineBreathingActive(true);
        setInlineBreathingCompleted(false);
        setInlineBreathingSecs(10);
        setInlineBreathPhase('들숨: 가슴 가득 들이마십니다 (4초)');
        playHarmonicTone(10);

        if (inlineBreathIntervalRef.current) clearInterval(inlineBreathIntervalRef.current);

        let currentSec = 10;
        inlineBreathIntervalRef.current = setInterval(() => {
            currentSec -= 1;
            setInlineBreathingSecs(currentSec);

            if (currentSec > 6) {
                setInlineBreathPhase('들숨: 맑은 에너지를 채웁니다 (4초)');
            } else if (currentSec > 0) {
                setInlineBreathPhase('날숨: 타인을 향한 긴장을 내려놓습니다 (6초)');
            } else {
                clearInterval(inlineBreathIntervalRef.current);
                setInlineBreathingActive(false);
                setInlineBreathingCompleted(true);
                setInlineBreathPhase('완료: 중심이 안정되었습니다 ✨');
                setTotalReclaimedMins(prev => prev + 1);
                setDarkCodeBlocksCount(prev => prev + 1);
            }
        }, 1000);
    };

    // Helper functions for saving wellness state
    const saveWellnessData = (newScore: number, newBlocks: number, newMins: number, newLogs: SessionLog[], newNotes: string[]) => {
        try {
            localStorage.setItem('myeongsim_zero_point_wellness', JSON.stringify({
                mins: newMins,
                blocks: newBlocks,
                score: newScore,
                logs: newLogs,
                notes: newNotes
            }));
        } catch (e) {}
    };

    // -------------------------------------------------------------
    // [Live Sync: Main Page Saju Profile Connection (Object-Safe)]
    // -------------------------------------------------------------
    const storeReportData = useReportStore((state) => state.reportData);

    const userSajuGanji = useMemo(() => {
        if (userProfile?.saju && typeof userProfile.saju === 'string' && !userProfile.saju.includes('[object')) {
            return userProfile.saju;
        }

        if (storeReportData?.saju?.fourPillars) {
            const p = storeReportData.saju.fourPillars;
            const yG = extractSajuChar(p.year?.gan);
            const yJ = extractSajuChar(p.year?.ji);
            const mG = extractSajuChar(p.month?.gan);
            const mJ = extractSajuChar(p.month?.ji);
            const dG = extractSajuChar(p.day?.gan);
            const dJ = extractSajuChar(p.day?.ji);
            const tG = extractSajuChar(p.time?.gan);
            const tJ = extractSajuChar(p.time?.ji);

            const y = yG || yJ ? `${yG}${yJ}년` : '';
            const m = mG || mJ ? `${mG}${mJ}월` : '';
            const d = dG || dJ ? `${dG}${dJ}일` : '';
            const t = tG || tJ ? `${tG}${tJ}시` : '';

            const combined = `${y} ${m} ${d} ${t}`.trim();
            if (combined && !combined.includes('[object')) return combined;
        }

        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('myeongsim_user_profile') || localStorage.getItem('report-storage');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    const state = parsed.state || parsed;
                    if (state?.reportData?.saju?.fourPillars) {
                        const p = state.reportData.saju.fourPillars;
                        const yG = extractSajuChar(p.year?.gan);
                        const yJ = extractSajuChar(p.year?.ji);
                        const mG = extractSajuChar(p.month?.gan);
                        const mJ = extractSajuChar(p.month?.ji);
                        const dG = extractSajuChar(p.day?.gan);
                        const dJ = extractSajuChar(p.day?.ji);
                        const tG = extractSajuChar(p.time?.gan);
                        const tJ = extractSajuChar(p.time?.ji);
                        const combined = `${yG}${yJ}년 ${mG}${mJ}월 ${dG}${dJ}일 ${tG}${tJ ? tG + tJ + '시' : ''}`.trim();
                        if (combined && !combined.includes('[object')) return combined;
                    }
                    if (typeof state?.saju === 'string' && !state.saju.includes('[object')) return state.saju;
                    if (typeof state?.ganji === 'string' && !state.ganji.includes('[object')) return state.ganji;
                }
            }
        } catch (e) {}

        return '경신(庚申)년 계미(癸未)월 신사(辛巳)일 을미(乙未)시';
    }, [userProfile, storeReportData]);

    const userDayMaster = useMemo(() => {
        if (storeReportData?.saju?.dayMaster) {
            const dm = extractSajuChar(storeReportData.saju.dayMaster);
            if (dm) return dm.charAt(0);
        }
        if (storeReportData?.saju?.fourPillars?.day?.gan) {
            const dg = extractSajuChar(storeReportData.saju.fourPillars.day.gan);
            if (dg) return dg.charAt(0);
        }
        if (userSajuGanji) {
            const parts = userSajuGanji.split('일')[0]?.trim().split(' ');
            const dayPart = parts ? parts[parts.length - 1] : '';
            if (dayPart && dayPart.length >= 1) {
                return dayPart.charAt(0);
            }
        }
        return '辛';
    }, [storeReportData, userSajuGanji]);

    const userArchetypeName = useMemo(() => {
        if (storeReportData?.psychology?.shadowTitle && typeof storeReportData.psychology.shadowTitle === 'string') {
            return storeReportData.psychology.shadowTitle;
        }
        const dm = userDayMaster;
        if (dm === '辛' || dm === '신') return '생명 소생자 아키타입 (보석/정밀메스 × 단비)';
        if (dm === '庚' || dm === '경') return '강건한 수호자 아키타입 (단단한 무쇠 × 결단)';
        if (dm === '甲' || dm === '갑') return '선구적 리더 아키타입 (거목 × 개척)';
        if (dm === '乙' || dm === '을') return '유연한 적응자 아키타입 (생명초 × 연결)';
        if (dm === '丙' || dm === '병') return '열정적 점화자 아키타입 (태양 × 비전)';
        if (dm === '丁' || dm === '정') return '따뜻한 등불 아키타입 (모닥불 × 세심한 치유)';
        if (dm === '戊' || dm === '무') return '웅장한 포용자 아키타입 (태산 × 신뢰)';
        if (dm === '己' || dm === '기') return '풍요로운 양육자 아키타입 (옥토 × 조화)';
        if (dm === '壬' || dm === '임') return '심해의 지혜자 아키타입 (대양 × 수용)';
        if (dm === '癸' || dm === '계') return '맑은 치유자 아키타입 (이슬비 × 직관)';
        return '주권적 창조자 아키타입';
    }, [storeReportData, userDayMaster]);

    // Alchemy Transmuted Superpower calculation based on Saju & user profile
    const alchemyResult = useMemo<TransmutedSuperpower>(() => {
        let goldVal: any = "val_sovereignty";
        if (userArchetypeName.includes("보석") || userArchetypeName.includes("정밀") || userDayMaster === "辛" || userDayMaster === "庚") goldVal = "val_excellence";
        else if (userArchetypeName.includes("혁신") || userDayMaster === "壬" || userDayMaster === "癸") goldVal = "val_essence";
        else if (userArchetypeName.includes("공감") || userDayMaster === "乙" || userDayMaster === "丁") goldVal = "val_connection";
        else if (userDayMaster === "戊" || userDayMaster === "己") goldVal = "val_risk_prevention";

        return calculateArchetypeAndStrengths({
            step1_fear: "fear_loss_of_control",
            step2_persona: "inner_teen",
            step3_goldValue: goldVal,
            step4_acceptance: "acc_courageous",
            step5_action: "act_boundary_nvc"
        });
    }, [userArchetypeName, userDayMaster]);

    // Saju Ten-Gods & Cognitive Alchemy Fusion Calculation dynamically based on full 8-Character Saju Ganji
    const sajuFusionResult = useMemo<FusionResult>(() => {
        return calculateSajuAlchemyFusion({
            sajuGanji: userSajuGanji,
            dayMaster: userDayMaster
        });
    }, [userDayMaster, userSajuGanji]);

    // Calculate combinatorial Saju rarity & neuro-psychology metrics dynamically based on full 8-Character Saju Ganji
    const sajuRarityInfo = useMemo(() => {
        return calculatePersonalizedSajuRarity({
            sajuGanji: userSajuGanji,
            dayMaster: userDayMaster,
            archetypeName: userArchetypeName
        });
    }, [userDayMaster, userSajuGanji, userArchetypeName]);

    // Dynamically initialize initial greeting and choices based on user's full Saju 8 Ganji & Bottle-Neck dynamics
    useEffect(() => {
        const personalized = generatePersonalizedSajuGreeting({
            sajuGanji: userSajuGanji,
            dayMaster: userDayMaster,
            archetypeName: userArchetypeName
        });

        const fullGreeting = `${personalized.greetingText}\n\n**[1-Tap 추천 선택지]**\n* [A] ${personalized.options[0]}\n* [B] ${personalized.options[1]}\n* [C] ${personalized.options[2]}`;

        setChatMessages([{
            role: 'assistant',
            text: fullGreeting,
            time: '방금 전'
        }]);
    }, [userDayMaster, userArchetypeName, userSajuGanji]);


    // Chatbot send handler with Dynamic Widget Triggering
    const handleSendChatMessage = async (msgText?: string) => {
        const textToSend = msgText || chatInput.trim();
        if (!textToSend || isChatLoading) return;

        const newMsg = { role: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        const updatedHistory = [...chatMessages, newMsg];
        setChatMessages(updatedHistory);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const res = await fetch('/api/coaching/zero-point', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedHistory.map(m => ({ role: m.role, content: m.text })),
                    userProfile: { saju: userSajuGanji, dayMaster: userDayMaster, archetype: userArchetypeName }
                })
            });
            const data = await res.json();
            if (data.success && data.reply) {
                // Auto-detect widget need
                let detectedWidget: 'breathing' | 'timer' | 'cbt_chips' | undefined = undefined;
                if (data.reply.includes('10초 자비') || data.reply.includes('신체 접지') || data.reply.includes('호흡')) {
                    detectedWidget = 'breathing';
                } else if (data.reply.includes('10분') || data.reply.includes('타이머') || data.reply.includes('시동')) {
                    detectedWidget = 'timer';
                }

                setChatMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        text: data.reply,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        widgetType: detectedWidget
                    }
                ]);
            }
        } catch (e) {
            console.error('Chat error:', e);
        } finally {
            setIsChatLoading(false);
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // Synthesizer Audio Functions
    const startSynthesizer = () => {
        try {
            if (focusAudio === 'None') return;
            if (!audioCtxRef.current) {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            stopSynthesizer();

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime((focusVolume / 100) * 0.15, ctx.currentTime);
            masterGain.connect(ctx.destination);
            gainNodeRef.current = masterGain;

            if (focusAudio === 'Brown Noise') {
                const bufferSize = ctx.sampleRate * 2;
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                let lastOut = 0.0;
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5;
                }
                const whiteNoise = ctx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;
                whiteNoise.connect(masterGain);
                whiteNoise.start();
                noiseNodeRef.current = whiteNoise;
            } else if (focusAudio === 'White Noise') {
                const bufferSize = ctx.sampleRate * 2;
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = (Math.random() * 2 - 1) * 0.4;
                }
                const whiteNoise = ctx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;
                whiteNoise.connect(masterGain);
                whiteNoise.start();
                noiseNodeRef.current = whiteNoise;
            } else if (focusAudio === 'Pink Noise') {
                const bufferSize = ctx.sampleRate * 2;
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                    b6 = white * 0.115926;
                }
                const pinkNoise = ctx.createBufferSource();
                pinkNoise.buffer = noiseBuffer;
                pinkNoise.loop = true;
                pinkNoise.connect(masterGain);
                pinkNoise.start();
                noiseNodeRef.current = pinkNoise;
            } else if (focusAudio === '10Hz Alpha Waves') {
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(200, ctx.currentTime);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(210, ctx.currentTime);
                osc1.connect(masterGain);
                osc2.connect(masterGain);
                osc1.start();
                osc2.start();
                osc1Ref.current = osc1;
                osc2Ref.current = osc2;
            }
        } catch (err) {
            console.error('Synthesizer Start Error:', err);
        }
    };

    const stopSynthesizer = () => {
        try {
            if (noiseNodeRef.current) {
                (noiseNodeRef.current as any).stop?.();
                noiseNodeRef.current.disconnect();
                noiseNodeRef.current = null;
            }
            if (osc1Ref.current) { osc1Ref.current.stop(); osc1Ref.current.disconnect(); osc1Ref.current = null; }
            if (osc2Ref.current) { osc2Ref.current.stop(); osc2Ref.current.disconnect(); osc2Ref.current = null; }
        } catch (e) {}
    };

    const toggleFocusTimer = () => {
        if (!isFocusRunning) {
            setIsFocusRunning(true);
            startSynthesizer();
        } else {
            setIsFocusRunning(false);
            stopSynthesizer();
        }
    };

    const resetFocusTimer = () => {
        setIsFocusRunning(false);
        stopSynthesizer();
        setFocusTimeLeft(focusDuration);
    };

    // Focus Timer Countdown Tick & Auto Logging
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isFocusRunning && focusTimeLeft > 0) {
            interval = setInterval(() => {
                setFocusTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (focusTimeLeft === 0 && isFocusRunning) {
            setIsFocusRunning(false);
            stopSynthesizer();
            setFocusSessions(prev => prev + 1);

            // Update Global State
            const newMins = totalReclaimedMins + 10;
            const newBlocks = darkCodeBlocksCount + 1;
            const newScore = Math.min(100, sovereignScore + 2);
            const newLog: SessionLog = {
                id: Date.now().toString(),
                task: '10분 마이크로 몰입 완수',
                durationMin: 10,
                date: '방금 전',
                reclaimedScore: newScore,
                note: '회피 루프 차단 및 자기 주권 시간 환류'
            };
            const updatedLogs = [newLog, ...sessionLogs];
            setTotalReclaimedMins(newMins);
            setDarkCodeBlocksCount(newBlocks);
            setSovereignScore(newScore);
            setSessionLogs(updatedLogs);
            saveWellnessData(newMins, newBlocks, newScore, updatedLogs, savedNotes);

            setShowReflectionModal(true);
        }
        return () => clearInterval(interval);
    }, [isFocusRunning, focusTimeLeft]);

    // Sleep Coach Sound Logic
    const startSleepCoachSound = () => {
        try {
            if (!sleepAudioCtxRef.current) {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                sleepAudioCtxRef.current = new AudioCtx();
            }
            const ctx = sleepAudioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            stopSleepCoachSound();

            const master = ctx.createGain();
            master.gain.setValueAtTime(sleepVolume * 0.2, ctx.currentTime);
            master.connect(ctx.destination);
            sleepMasterGainRef.current = master;

            const oscL = ctx.createOscillator();
            const oscR = ctx.createOscillator();
            oscL.type = 'sine';
            oscL.frequency.setValueAtTime(432, ctx.currentTime);
            oscR.type = 'sine';
            oscR.frequency.setValueAtTime(434, ctx.currentTime);

            const deltaGain = ctx.createGain();
            deltaGain.gain.setValueAtTime(0.04, ctx.currentTime);
            oscL.connect(deltaGain);
            oscR.connect(deltaGain);
            deltaGain.connect(master);
            oscL.start();
            oscR.start();

            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 2.5;
            }
            const brownSrc = ctx.createBufferSource();
            brownSrc.buffer = noiseBuffer;
            brownSrc.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(320, ctx.currentTime);

            const brownGain = ctx.createGain();
            brownGain.gain.setValueAtTime(brownNoiseEnabled ? 0.06 : 0, ctx.currentTime);
            sleepBrownGainRef.current = brownGain;

            brownSrc.connect(filter);
            filter.connect(brownGain);
            brownGain.connect(master);
            brownSrc.start();

            sleepNodesRef.current = [oscL, oscR, deltaGain, brownSrc, filter, brownGain, master];
        } catch (e) {
            console.error('Sleep coach audio error:', e);
        }
    };

    const stopSleepCoachSound = () => {
        try {
            sleepNodesRef.current.forEach(n => {
                (n as any).stop?.();
                n.disconnect();
            });
            sleepNodesRef.current = [];
        } catch (e) {}
    };

    const toggleSleepTimerStart = () => {
        if (!isSleepRunning) {
            setIsSleepRunning(true);
            setShowSleepCompletionPopup(false);
            let initSecs = 60;
            if (sleepTimerOption === '15m') initSecs = 15 * 60;
            else if (sleepTimerOption === '30m') initSecs = 30 * 60;
            else if (sleepTimerOption === '45m') initSecs = 45 * 60;
            else if (sleepTimerOption === '60m') initSecs = 60 * 60;
            else if (sleepTimerOption === 'Unlimited') initSecs = 0;
            
            setSleepRemainingSecs(sleepTimerOption === 'Unlimited' ? null : initSecs);
            startSleepCoachSound();
        } else {
            setIsSleepRunning(false);
            stopSleepCoachSound();
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSleepRunning) {
            interval = setInterval(() => {
                if (sleepRemainingSecs !== null) {
                    setSleepRemainingSecs(prev => {
                        if (prev === null) return null;
                        if (prev <= 1) {
                            setIsSleepRunning(false);
                            setShowSleepCompletionPopup(true);
                            return 0;
                        }
                        const nextSec = prev - 1;
                        if (nextSec === 45) setSleepPhase('생리적 한숨 & 심박수 냉각');
                        else if (nextSec === 25) setSleepPhase('제로포인트 환류');
                        else if (nextSec === 10) setSleepPhase('무중력 수면 진입');
                        return nextSec;
                    });
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSleepRunning, sleepRemainingSecs]);

    const formatMinutesSeconds = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    const progress = focusDuration > 0 ? (focusDuration - focusTimeLeft) / focusDuration : 0;
    const strokeDashoffset = 440 - (440 * progress);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 font-sans text-left overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.96 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-[#0e121a] border-2 border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-[0_0_90px_rgba(16,185,129,0.25)] relative custom-scrollbar text-white flex flex-col my-auto"
                >
                    {/* Top Header */}
                    <div className="sticky top-0 right-0 p-4 sm:p-6 flex justify-between items-center z-30 bg-[#0e121a]/95 backdrop-blur-md border-b border-emerald-500/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                <Sparkles className="w-5 h-5 stroke-[2.5]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg sm:text-xl font-black text-white">
                                        명심 제로포인트 3S 하이브리드 모듈
                                    </h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                        HYBRID MODULAR
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-300/80 mt-0.5">
                                    AI 오케스트레이터 챗봇 ➔ 에너지 대시보드 ➔ 포커스 랩 ➔ 소버린 아카이브
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowPushCenterModal(true)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                title="저녁 9시 웰니스 마감 푸시 알림 센터"
                            >
                                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                                <span>🔔 저녁 9시 푸시 알림</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="bg-gray-800/80 p-2 rounded-full text-gray-400 hover:text-white border border-gray-700/60 backdrop-blur-sm transition-colors cursor-pointer"
                                aria-label="닫기"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 4-Tab Main Navigation (User Standard Architecture) */}
                    <div className="grid grid-cols-4 p-2 sm:px-6 bg-slate-950/80 border-b border-slate-800 gap-1 sm:gap-2">
                        <button
                            onClick={() => setActiveTab('coaching_room')}
                            className={`py-2.5 px-2 sm:px-4 rounded-2xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
                                activeTab === 'coaching_room'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-900/80 text-gray-400 hover:text-white border border-slate-800'
                            }`}
                        >
                            <Brain className="w-4 h-4 shrink-0" />
                            <span className="truncate">Tab 1. 코칭 룸</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`py-2.5 px-2 sm:px-4 rounded-2xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
                                activeTab === 'dashboard'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-900/80 text-gray-400 hover:text-white border border-slate-800'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4 shrink-0" />
                            <span className="truncate">Tab 2. 대시보드</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('focus_lab')}
                            className={`py-2.5 px-2 sm:px-4 rounded-2xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
                                activeTab === 'focus_lab'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-900/80 text-gray-400 hover:text-white border border-slate-800'
                            }`}
                        >
                            <Clock className="w-4 h-4 shrink-0" />
                            <span className="truncate">Tab 3. 포커스 랩</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('archive')}
                            className={`py-2.5 px-2 sm:px-4 rounded-2xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
                                activeTab === 'archive'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-900/80 text-gray-400 hover:text-white border border-slate-800'
                            }`}
                        >
                            <Award className="w-4 h-4 shrink-0" />
                            <span className="truncate">Tab 4. 아카이브</span>
                        </button>
                    </div>

                    {/* ========================================================= */}
                    {/* [TAB 1] 코칭 룸 (AI Core & Orchestrator)                   */}
                    {/* ========================================================= */}
                    {activeTab === 'coaching_room' && (
                        <div className="flex flex-col h-[560px] p-3 sm:p-6 animate-fade-in font-sans">
                            
                            {/* Saju 1:1 Personalized Banner (Dynamically Synced with Main Page) */}
                            <div className="mb-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/70 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 shadow-lg">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center text-xs font-black font-mono shadow-md">
                                        {userDayMaster}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-black text-emerald-300">사주 1:1 맞춤 연동: </span>
                                        <span className="text-white font-bold">{userSajuGanji}</span>
                                        <span className="text-emerald-300 font-bold text-[10px] ml-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-sm">
                                            {userArchetypeName}
                                        </span>
                                        <button
                                            onClick={() => setShowRarityModal(true)}
                                            className="ml-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-amber-500/25 hover:from-amber-500/40 hover:to-emerald-500/40 text-amber-300 hover:text-amber-200 text-[10px] font-black border border-amber-400/50 transition-all cursor-pointer inline-flex items-center gap-1 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:scale-105 group"
                                            title="518,400개 사주 조합 중 통계학적 희소성 분석 보기"
                                        >
                                            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                                            <span>👑 상위 {sajuRarityInfo.percent}% 희소 명식</span>
                                            <ArrowRight className="w-2.5 h-2.5 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono self-end sm:self-auto flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>{userDayMaster} 일간 × 실시간 신경망 동기화</span>
                                </div>
                            </div>

                            {/* 5-Step Dark Code Release Mobile Progress Bar */}
                            <div className="mb-3 px-3 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-[10px] font-mono shrink-0 shadow-inner overflow-x-auto gap-1.5 custom-scrollbar">
                                {[
                                    { step: 1, label: '1.보호자(IFS)', icon: '🛡️' },
                                    { step: 2, label: '2.관찰자(ACT)', icon: '🎬' },
                                    { step: 3, label: '3.뉴럴코드(융)', icon: '🌟' },
                                    { step: 4, label: '4.10초수용(CBT)', icon: '⚓' },
                                    { step: 5, label: '5.주권회복(CTA)', icon: '👑' }
                                ].map((s) => (
                                    <div
                                        key={s.step}
                                        onClick={() => setCurrentDarkCodeStep(s.step)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                                            currentDarkCodeStep === s.step
                                                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-emerald-300 border border-emerald-400/50 font-bold shadow-sm scale-105'
                                                : currentDarkCodeStep > s.step
                                                ? 'bg-slate-900 text-gray-500 border border-slate-800'
                                                : 'bg-slate-900/60 text-gray-400 border border-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <span>{s.icon}</span>
                                        <span>{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Messages Container */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 custom-scrollbar">
                                {chatMessages.map((msg, idx) => {
                                    const rawText = msg.text;
                                    const cleanText = getCleanChatText(rawText);
                                    const isLatestAssistant = msg.role === 'assistant' && (
                                        idx === chatMessages.length - 1 || 
                                        !chatMessages.slice(idx + 1).some(m => m.role === 'assistant')
                                    );
                                    const choiceChips = isLatestAssistant ? extractChoiceChips(rawText, userDayMaster) : [];

                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`flex gap-2.5 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                                {msg.role === 'assistant' && (
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shrink-0 mt-0.5 shadow-md">
                                                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[92%] sm:max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed break-keep whitespace-pre-line shadow-md space-y-3 ${
                                                        msg.role === 'user'
                                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                                                            : 'bg-slate-900/95 border border-emerald-500/30 text-gray-200 rounded-tl-none font-sans'
                                                    }`}
                                                >
                                                    {/* Clean Main Chat Text */}
                                                    <div className="whitespace-pre-line leading-relaxed text-gray-100 font-sans">
                                                        {cleanText}
                                                    </div>

                                                    <div className={`text-[9px] pt-1 font-mono ${msg.role === 'user' ? 'text-emerald-200' : 'text-gray-500'}`}>
                                                        {msg.time}
                                                    </div>

                                                    {/* 1-Tap Interactive Selection Chips (ONLY ON LATEST ASSISTANT MESSAGE) */}
                                                    {isLatestAssistant && choiceChips.length > 0 && (
                                                        <div className="pt-3 border-t border-emerald-500/20 space-y-2 animate-fade-in text-left">
                                                            <div className="flex items-center justify-between text-[11px] font-black">
                                                                <span className="text-emerald-400 flex items-center gap-1.5">
                                                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                                                    <span>
                                                                        {currentDarkCodeStep === 1 && '🛡️ 1단계 [보호자 프레이밍] 1-Tap 공감 선택:'}
                                                                        {currentDarkCodeStep === 2 && '🎬 2단계 [관찰자 분리] 비주얼 아이콘 선택:'}
                                                                        {currentDarkCodeStep === 3 && '🌟 3단계 [뉴럴 코드 가치] 골드 앰버 선택:'}
                                                                        {currentDarkCodeStep === 4 && '⚓ 4단계 [역설적 수용] 현실 검증 선택:'}
                                                                        {currentDarkCodeStep >= 5 && '👑 5단계 [주권 회복] 실행 선택:'}
                                                                    </span>
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 font-mono">
                                                                    Step {currentDarkCodeStep} / 5
                                                                </span>
                                                            </div>

                                                            {/* Step 1: Horizontal Scroll Pill Chips / Step 2~5: Adaptive Stack */}
                                                            <div className={
                                                                currentDarkCodeStep === 1
                                                                    ? "flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar"
                                                                    : "grid grid-cols-1 gap-2"
                                                            }>
                                                                {choiceChips.map((choice, cIdx) => (
                                                                    <button
                                                                        key={cIdx}
                                                                        onClick={() => {
                                                                            setCurrentDarkCodeStep(prev => Math.min(5, prev + 1));
                                                                            if (choice.label.includes('10분') && choice.label.includes('타이머')) {
                                                                                setActiveTab('focus_lab');
                                                                                setFocusSubTab('micro_focus');
                                                                                setIsFocusRunning(true);
                                                                                startSynthesizer();
                                                                            } else if (choice.label.includes('10초') || choice.label.includes('호흡') || choice.label.includes('자비 호흡')) {
                                                                                startInlineBreathing();
                                                                            } else {
                                                                                handleSendChatMessage(choice.label);
                                                                            }
                                                                        }}
                                                                        className={`p-2.5 sm:p-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer flex items-center gap-2.5 shadow-sm active:scale-[0.98] group shrink-0 ${
                                                                            currentDarkCodeStep === 1
                                                                                ? 'min-w-[200px] sm:min-w-0 flex-1 bg-slate-950 hover:bg-emerald-950/80 border border-emerald-500/40 hover:border-emerald-300 text-emerald-200 hover:text-white rounded-full px-4 py-2.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                                                                                : currentDarkCodeStep === 2
                                                                                ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border border-indigo-500/40 hover:border-indigo-300 text-indigo-200 hover:text-white shadow-md'
                                                                                : currentDarkCodeStep === 3
                                                                                ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/20'
                                                                                : 'bg-gradient-to-r from-slate-950 to-slate-900 hover:from-emerald-950/90 hover:to-teal-950/90 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white'
                                                                        }`}
                                                                    >
                                                                        <span className={`w-5 h-5 rounded-lg text-[11px] font-black flex items-center justify-center font-mono shrink-0 transition-all border ${
                                                                            currentDarkCodeStep === 3
                                                                                ? 'bg-amber-500/20 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-300 border-amber-400/40'
                                                                                : currentDarkCodeStep === 2
                                                                                ? 'bg-indigo-500/20 group-hover:bg-indigo-400 group-hover:text-slate-950 text-indigo-300 border-indigo-400/40'
                                                                                : 'bg-emerald-500/20 group-hover:bg-emerald-400 group-hover:text-slate-950 text-emerald-300 border-emerald-400/30'
                                                                        }`}>
                                                                            {choice.key}
                                                                        </span>
                                                                        <span className="flex-1 leading-snug break-keep">{choice.label}</span>
                                                                        <ArrowRight className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                                                                            currentDarkCodeStep === 3 ? 'text-amber-400' : currentDarkCodeStep === 2 ? 'text-indigo-400' : 'text-emerald-400'
                                                                        }`} />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Step 5: 🔮 [명심코칭 사주-연금술 융합 진단 인라인 카드 & 주권 액션 3종] */}
                                                    {msg.role === 'assistant' && idx === chatMessages.length - 1 && currentDarkCodeStep >= 5 && (
                                                        <div className="pt-3 border-t border-indigo-500/30 space-y-3 animate-fade-in text-left">
                                                            {/* 🔮 사주-연금술 융합 진단 카드 */}
                                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border-2 border-amber-400/50 space-y-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                                                <div className="flex items-center justify-between border-b border-amber-400/20 pb-2.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-base">🔮</span>
                                                                        <span className="text-xs font-black text-amber-300 font-mono">명심코칭 사주-연금술 융합 진단</span>
                                                                    </div>
                                                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                                                        {sajuFusionResult.sajuDominantGod} 주도
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <div className="text-[10px] font-bold text-amber-400 font-mono">👑 최종 칭호:</div>
                                                                    <div className="text-sm font-black text-white">{sajuFusionResult.archetypeTitle}</div>
                                                                </div>

                                                                <div className="space-y-1 text-xs">
                                                                    <div className="text-[10px] font-bold text-gray-400 font-mono">• 사주 기질 분석 & 그림자의 승화:</div>
                                                                    <p className="text-gray-200 leading-relaxed break-keep bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                                                                        {sajuFusionResult.personalizedDiagnosis}
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-1 text-xs">
                                                                    <div className="text-[10px] font-bold text-emerald-400 font-mono">👉 오늘의 주권 발현 행동 규칙:</div>
                                                                    <div className="text-xs font-bold text-emerald-200 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40 leading-snug">
                                                                        "{sajuFusionResult.actionProtocol}"
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            setActiveTab('focus_lab');
                                                                            setFocusSubTab('micro_focus');
                                                                            setIsFocusRunning(true);
                                                                            startSynthesizer();
                                                                        }}
                                                                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                                    >
                                                                        <span>⏱️ 내 1순위 과제 10분 몰입하기</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setActiveTab('archive');
                                                                        }}
                                                                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-400/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                                                    >
                                                                        <span>🏆 아카이브 영구 각인</span>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* 3대 액션 버튼 & 연금술 리포트 모달 버튼 */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                <button
                                                                    onClick={() => setShowDeclineTemplateModal(true)}
                                                                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950 to-orange-950 hover:from-amber-900 hover:to-orange-900 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                                                >
                                                                    <span>🛡️ 거절 템플릿 복사</span>
                                                                    <span className="text-[9px] text-gray-400 font-mono">(구원자 트랩 방어)</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowAlchemyReportModal(true)}
                                                                    className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-950 to-slate-900 hover:from-indigo-900 hover:to-slate-800 border border-indigo-400/50 text-indigo-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                                                >
                                                                    <span>📜 상세 연금술 리포트 열람</span>
                                                                    <span className="text-[9px] text-emerald-400 font-mono">({alchemyResult.sovereigntyScore}점)</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Dynamic Inline Widget: 10-Sec Breathing (Working Somatic Reset) */}
                                            {msg.widgetType === 'breathing' && (
                                                <div className="ml-0 sm:ml-11 max-w-sm w-full p-4.5 rounded-3xl bg-gradient-to-br from-cyan-950/90 via-slate-950 to-teal-950/90 border-2 border-cyan-400/50 space-y-3.5 animate-fade-in-up shadow-2xl">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-cyan-300 text-xs font-black">
                                                            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                                                                🌿
                                                            </div>
                                                            <span>10초 자비 신경계 이완 (Somatic Reset)</span>
                                                        </div>
                                                        <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                                                            {inlineBreathingSecs}s
                                                        </span>
                                                    </div>

                                                    {/* Visual Breathing Sphere */}
                                                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-1000 shadow-xl ${
                                                            inlineBreathingActive
                                                                ? inlineBreathingSecs > 6
                                                                    ? 'scale-125 bg-cyan-500/30 border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                                                                    : 'scale-90 bg-teal-500/20 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                                                                : 'scale-100 bg-slate-900 border-cyan-500/30'
                                                        }`}>
                                                            <span className="text-xl font-black font-mono text-cyan-200">
                                                                {inlineBreathingSecs}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs font-bold text-center text-cyan-200 font-sans animate-pulse">
                                                            {inlineBreathPhase}
                                                        </div>
                                                    </div>

                                                    {/* Breathing Start/Progress Button */}
                                                    {!inlineBreathingCompleted ? (
                                                        <button
                                                            onClick={startInlineBreathing}
                                                            disabled={inlineBreathingActive}
                                                            className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                                                                inlineBreathingActive
                                                                    ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 animate-pulse cursor-default'
                                                                    : 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950'
                                                            }`}
                                                        >
                                                            {inlineBreathingActive ? (
                                                                <>
                                                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                                                    <span>432Hz 자비 호흡 진행 중 ({inlineBreathingSecs}초)...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play className="w-4 h-4 fill-slate-950" />
                                                                    <span>▶ 10초 자비 호흡 지금 시작 (432Hz 사운드)</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <div className="space-y-2.5 animate-fade-in font-sans">
                                                            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                                <span>10초 신경계 이완 완료! (+1회 방어 스탬프 적재)</span>
                                                            </div>
                                                            <div className="space-y-1.5 pt-1 text-left">
                                                                <div className="text-[10px] font-bold text-cyan-300 font-mono">
                                                                    ⚓ 4단계 현실 검증 선택:
                                                                </div>
                                                                <div className="grid grid-cols-1 gap-1.5">
                                                                    <button
                                                                        onClick={() => {
                                                                            setCurrentDarkCodeStep(5);
                                                                            handleSendChatMessage("불안하지만 내 삶이 파괴되진 않았음을 신체로 확인했습니다. 5단계 주권 회복을 시작합니다.");
                                                                        }}
                                                                        className="w-full p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-200 text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                                                                    >
                                                                        <span>🛡️ [A] 불안하지만 내 삶이 파괴되진 않았음</span>
                                                                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setCurrentDarkCodeStep(5);
                                                                            handleSendChatMessage("10초 호흡으로 몸의 중심을 완전히 회복했습니다. 5단계 주권 회복을 시작합니다.");
                                                                        }}
                                                                        className="w-full p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-500/40 text-teal-200 text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                                                                    >
                                                                        <span>🌿 [B] 10초 접지로 몸의 중심을 완전히 회복했음</span>
                                                                        <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Dynamic Inline Widget: 10-Min Micro Timer */}
                                            {msg.widgetType === 'timer' && (
                                                <div className="ml-0 sm:ml-11 max-w-sm w-full p-4.5 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-950 to-teal-950/90 border-2 border-emerald-500/50 space-y-3 animate-fade-in-up shadow-2xl">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                                                            <Clock className="w-4 h-4 text-emerald-400" />
                                                            <span>10분 마이크로 몰입 타이머 (포커스 랩)</span>
                                                        </span>
                                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                                            {formatMinutesSeconds(focusTimeLeft)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                                                        완벽함이 아닌 10분의 시동을 켭니다. 브라운 노이즈 사운드와 함께 즉시 몰입하세요.
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setActiveTab('focus_lab');
                                                            setFocusSubTab('micro_focus');
                                                            setIsFocusRunning(true);
                                                            startSynthesizer();
                                                        }}
                                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                                                    >
                                                        <Play className="w-4 h-4 fill-slate-950" />
                                                        <span>⏱️ 포커스 랩에서 10분 타이머 바로 켜기 →</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {isChatLoading && (
                                    <div className="flex gap-3 justify-start items-center">
                                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                                            <Brain className="w-4 h-4" />
                                        </div>
                                        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-bold flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                            <span>3대 코드 오케스트레이션 & 사주 1:1 진단 중...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Form Input */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendChatMessage();
                                }}
                                className="flex gap-2 pt-2 border-t border-slate-800 shrink-0"
                            >
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="방치했던 1순위 과제나 내면의 자책/불안을 말씀해 주세요..."
                                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-white text-xs font-medium placeholder-gray-500 focus:outline-none focus:border-emerald-400"
                                    disabled={isChatLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isChatLoading || !chatInput.trim()}
                                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 transition-all cursor-pointer"
                                >
                                    전송
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [TAB 2] 에너지 대시보드 (Energy Dashboard)                */}
                    {/* ========================================================= */}
                    {activeTab === 'dashboard' && (
                        <div className="p-5 sm:p-8 space-y-6 animate-fade-in">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4.5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/70 border-2 border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
                                        {alchemyResult.emblemIcon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                                                👑 뉴럴 코드 승급 완료 (Level-Up)
                                            </span>
                                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                                주권 점수 {sovereignScore}점
                                            </span>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-2">
                                            <span>{alchemyResult.title}</span>
                                        </h3>
                                        <p className="text-xs text-amber-200/90 font-medium">
                                            "소진형 해결사" ➔ <strong>"{alchemyResult.title.split('(')[0]}"</strong>로 승화 발현 중
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAlchemyReportModal(true)}
                                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                                >
                                    <span>📜 리포트 카드 전문 보기</span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                        <span>에너지 환류 & 자기 주권 대시보드</span>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                                            LIVE SYNC
                                        </span>
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        챗봇과 타이머 세션을 통해 외부에서 회수한 내 삶의 온전한 주권 데이터
                                    </p>
                                </div>
                            </div>

                            {/* 3 Core Metric Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1 relative overflow-hidden">
                                    <div className="text-[10px] text-gray-400 font-mono font-bold uppercase">
                                        회수한 자기 주권 시간
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                                        +{totalReclaimedMins} <span className="text-xs font-sans text-gray-400">MIN</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-300/80">
                                        남의 위기에서 내 본진으로 환류된 시간
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-1 relative overflow-hidden">
                                    <div className="text-[10px] text-gray-400 font-mono font-bold uppercase">
                                        다크코드 방어 횟수
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                                        {darkCodeBlocksCount} <span className="text-xs font-sans text-gray-400">회</span>
                                    </div>
                                    <p className="text-[10px] text-cyan-300/80">
                                        회피 및 충동 개입 유혹 선제 차단
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1 relative overflow-hidden">
                                    <div className="text-[10px] text-gray-400 font-mono font-bold uppercase">
                                        자기 주권 점수 (Sovereign)
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                                        {sovereignScore} <span className="text-xs font-sans text-gray-400">/ 100점</span>
                                    </div>
                                    <p className="text-[10px] text-amber-300/80">
                                        안정 궤도 진입 (상위 5% 에너지 보존)
                                    </p>
                                </div>
                            </div>

                            {/* Recent Session Logs */}
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                                <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                                    <span>📋 최근 환류 세션 타임라인</span>
                                    <span className="text-[10px] text-gray-500 font-mono">자동 저장됨</span>
                                </div>

                                <div className="space-y-2">
                                    {sessionLogs.map((log) => (
                                        <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                                            <div className="space-y-0.5">
                                                <div className="font-bold text-gray-200">{log.task}</div>
                                                <div className="text-[10px] text-gray-400 italic">{log.note}</div>
                                            </div>
                                            <div className="text-right shrink-0 font-mono">
                                                <div className="text-emerald-400 font-bold">+{log.durationMin} MIN</div>
                                                <div className="text-[10px] text-gray-500">{log.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* [NEW] 📊 야간 9시 웰니스 푸시 타겟팅 성과 분석 대시보드 */}
                            <div className="pt-2">
                                <PushComparisonDashboard />
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [TAB 3] 포커스 랩 (Focus Studio & Sleep Coach)             */}
                    {/* ========================================================= */}
                    {activeTab === 'focus_lab' && (
                        <div className="p-5 sm:p-8 space-y-6 animate-fade-in">
                            {/* Focus Lab Sub-nav */}
                            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto">
                                <button
                                    onClick={() => setFocusSubTab('micro_focus')}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        focusSubTab === 'micro_focus'
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    ⏱️ 10분 몰입
                                </button>
                                <button
                                    onClick={() => setFocusSubTab('compassion_breath')}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        focusSubTab === 'compassion_breath'
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    🌿 1분 자비 호흡
                                </button>
                                <button
                                    onClick={() => setFocusSubTab('delta_sleep')}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        focusSubTab === 'delta_sleep'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    🌙 델타파 수면
                                </button>
                            </div>

                            {/* Sub 1: Micro-Focus Synthesizer */}
                            {focusSubTab === 'micro_focus' && (
                                <div className="flex flex-col items-center justify-center space-y-7 max-w-2xl mx-auto w-full">
                                    <div className="w-full flex items-center justify-between">
                                        <h2 className="text-xl sm:text-2xl font-light tracking-wide text-gray-100">
                                            Micro-Focus Timer & Synthesizer
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={toggleFocusTimer}
                                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-200 flex items-center justify-center transition-all cursor-pointer border border-slate-700 shadow-md"
                                            >
                                                {isFocusRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                                            </button>
                                            <button
                                                onClick={resetFocusTimer}
                                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-200 flex items-center justify-center transition-all cursor-pointer border border-slate-700 shadow-md"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
                                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="70" className="text-slate-800/80 stroke-current" strokeWidth="8" fill="transparent" />
                                            <circle cx="80" cy="80" r="70" className="text-blue-300 stroke-current transition-all duration-1000 ease-linear" strokeWidth="8" strokeDasharray="440" strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center text-center px-4">
                                            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
                                                {formatMinutesSeconds(focusTimeLeft)}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 font-medium">완벽함이 아닌 10분의 시동</p>
                                        </div>
                                    </div>

                                    <div className="w-full grid grid-cols-2 text-center py-2 border-y border-slate-800/80 max-w-md">
                                        <div className="border-r border-slate-800">
                                            <div className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold">REMAINING</div>
                                            <div className="text-base font-black text-white mt-0.5">{formatMinutesSeconds(focusTimeLeft)}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold">SESSIONS</div>
                                            <div className="text-base font-black text-white mt-0.5">{focusSessions}</div>
                                        </div>
                                    </div>

                                    <div className="w-full max-w-lg space-y-3 text-xs font-medium">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                            <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                                                <span className="text-gray-400 text-xs font-bold">Duration</span>
                                                <input
                                                    type="number"
                                                    value={focusDuration}
                                                    onChange={(e) => {
                                                        const v = parseInt(e.target.value) || 600;
                                                        setFocusDuration(v);
                                                        if (!isFocusRunning) setFocusTimeLeft(v);
                                                    }}
                                                    disabled={isFocusRunning}
                                                    className="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-right text-white font-mono font-bold text-xs"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-gray-400 text-xs font-bold">Audio</span>
                                                    <button onClick={() => setShowNoiseGuideModal(true)} className="p-1 rounded bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                                                        <span>ℹ️ 해설</span>
                                                    </button>
                                                </div>
                                                <select
                                                    value={focusAudio}
                                                    onChange={(e) => setFocusAudio(e.target.value as any)}
                                                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs"
                                                >
                                                    <option value="Brown Noise">Brown Noise</option>
                                                    <option value="White Noise">White Noise</option>
                                                    <option value="Pink Noise">Pink Noise</option>
                                                    <option value="10Hz Alpha Waves">10Hz Alpha Waves</option>
                                                    <option value="None">None</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                                            <span className="text-gray-400 text-xs font-bold shrink-0">Volume</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={focusVolume}
                                                onChange={(e) => setFocusVolume(parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                                            />
                                            <span className="w-10 text-right font-mono font-bold text-white text-xs shrink-0">{focusVolume}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            
                            {/* Sub 1.5: One-Minute Compassion Breathing (Group B) */}
                            {focusSubTab === 'compassion_breath' && (
                                <OneMinuteCompassionBreathing
                                    onCompleteToSleep={() => {
                                        setFocusSubTab('delta_sleep');
                                        setSleepTimerOption('Unlimited');
                                        setSleepRemainingSecs(null);
                                        setIsSleepRunning(true);
                                        startSleepCoachSound();
                                    }}
                                    onDismiss={() => {
                                        setActiveTab('dashboard');
                                    }}
                                />
                            )}


                            {/* Sub 2: Delta Wave Sleep Coach */}
                            {focusSubTab === 'delta_sleep' && (
                                <div className={`flex flex-col items-center justify-center space-y-7 max-w-2xl mx-auto w-full transition-all duration-700 ${dimScreen ? 'opacity-20 brightness-50' : 'opacity-100'}`}>
                                    <div className="w-full flex items-center justify-between">
                                        <h2 className="text-xl sm:text-2xl font-light tracking-wide text-gray-100 font-sans">
                                            Delta Wave Sleep Coach
                                        </h2>
                                        <button
                                            onClick={toggleSleepTimerStart}
                                            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-200 flex items-center justify-center transition-all cursor-pointer border border-slate-700 shadow-lg"
                                        >
                                            {isSleepRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                                        </button>
                                    </div>

                                    <div className="w-full min-h-[260px] rounded-3xl bg-[#06080d] border border-slate-900 shadow-inner flex flex-col items-center justify-center p-6 relative overflow-hidden space-y-3">
                                        <motion.div
                                            animate={{ scale: isSleepRunning ? [1, 1.25, 1] : 1 }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-[0_0_40px_rgba(59,130,246,0.5)] z-10"
                                        />
                                        <div className="z-10 text-center text-xs text-gray-300 max-w-md break-keep">
                                            {sleepRemainingSecs === null || sleepRemainingSecs > 45 ? '"화면을 내려두고, 침대 위에 몸의 무게를 완전히 맡깁니다."' :
                                             sleepRemainingSecs <= 45 && sleepRemainingSecs > 25 ? '"코로 깊게 들이마시고... 짧게 한 번 더 채운 뒤, 입으로 길게 뿜어냅니다."' :
                                             sleepRemainingSecs <= 25 && sleepRemainingSecs > 10 ? '"오늘 밤 당신이 지탱하지 않아도 세상은 스스로 잘 돌아갑니다."' :
                                             '"깊은 중력 속으로 몸을 놓아줍니다. 편안하게 깊은 잠에 빠져듭니다."'}
                                        </div>
                                    </div>

                                    <div className="w-full grid grid-cols-2 text-center py-2 border-y border-slate-800/80 max-w-lg">
                                        <div className="border-r border-slate-800 pr-2">
                                            <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">CURRENT PHASE</div>
                                            <div className="text-sm font-black text-white mt-0.5 truncate">{sleepPhase}</div>
                                        </div>
                                        <div className="pl-2">
                                            <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">TIMER</div>
                                            <div className="text-sm font-black text-white mt-0.5 font-mono">{sleepRemainingSecs === null ? '∞' : formatMinutesSeconds(sleepRemainingSecs)}</div>
                                        </div>
                                    </div>

                                    <div className="w-full max-w-lg space-y-3 text-xs font-medium">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                            <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                                                <span className="text-gray-300 text-xs font-bold">Volume</span>
                                                <input type="range" min="0" max="1" step="0.05" value={sleepVolume} onChange={(e) => setSleepVolume(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-white" />
                                                <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs">{sleepVolume.toFixed(1)}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                                                <span className="text-gray-300 text-xs font-bold">Brown Noise</span>
                                                <button onClick={() => setBrownNoiseEnabled(!brownNoiseEnabled)} className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${brownNoiseEnabled ? 'bg-white' : 'bg-slate-700'}`}>
                                                    <div className={`bg-slate-950 w-4 h-4 rounded-full shadow transform transition-transform ${brownNoiseEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                            <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                                                <span className="text-gray-300 text-xs font-bold">Timer</span>
                                                <select value={sleepTimerOption} onChange={(e) => setSleepTimerOption(e.target.value)} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs">
                                                    <option value="Unlimited">Unlimited</option>
                                                    <option value="15m">15m</option>
                                                    <option value="30m">30m</option>
                                                    <option value="45m">45m</option>
                                                    <option value="60m">60m</option>
                                                    <option value="1m">1m (Guide)</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                                                <span className="text-gray-300 text-xs font-bold">Dim Screen</span>
                                                <button onClick={() => setDimScreen(!dimScreen)} className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${dimScreen ? 'bg-white' : 'bg-slate-700'}`}>
                                                    <div className={`bg-slate-950 w-4 h-4 rounded-full shadow transform transition-transform ${dimScreen ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [TAB 4] 소버린 아카이브 & 9:16 쉐어 (Archive & Badges)    */}
                    {/* ========================================================= */}
                    {activeTab === 'archive' && (
                        <div className="p-5 sm:p-8 space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                    <span>소버린 아카이브 & 3D 뱃지 갤러리</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                                        PRO ARCHIVE
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    자기 주권을 회수한 증표인 연금술 리포트 카드, 3대 마스터 뱃지 및 9:16 소버린 쉐어 카드
                                </p>
                            </div>

                            {/* [HERO] 🔮 그림자 연금술 리포트 카드 (Shadow Alchemy Report Card - 심리적 안전 앵커) */}
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c101d] via-slate-950 to-[#0c131a] border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-5 text-white relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
                                            {alchemyResult.emblemIcon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                                                    SHADOW ALCHEMY REPORT · 2026
                                                </span>
                                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                                    주권 점수: {sovereignScore}점
                                                </span>
                                            </div>
                                            <h4 className="text-base sm:text-lg font-black text-white mt-1">
                                                {alchemyResult.title}
                                            </h4>
                                            <p className="text-xs text-amber-200/90 font-medium">
                                                "당신의 그림자는 길을 잃은 거대한 에너지였습니다."
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const shareText = `🔮 [명심코칭 그림자 연금술 리포트]\n\n👑 칭호: ${alchemyResult.title}\n• 왜곡된 다크코드: ${alchemyResult.shadowPattern.fromDarkCode}\n• 승화된 뉴럴 코드: ${alchemyResult.shadowPattern.transmutedGift}\n• 오늘의 행동 규칙: ${alchemyResult.activationProtocol}\n\n👉 주권 점수: ${sovereignScore}점 (상위 5% 진입)`;
                                                navigator.clipboard.writeText(shareText);
                                                setCopiedAlert(true);
                                                setTimeout(() => setCopiedAlert(false), 2500);
                                            }}
                                            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-xs font-bold border border-amber-400/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>{copiedAlert ? '복사 완료!' : '📸 9:16 카드 복사'}</span>
                                        </button>
                                        <span className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                                            🏆 아카이브 영구 보관됨
                                        </span>
                                    </div>
                                </div>

                                {/* 4-Block Alchemy Breakdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    {/* 1. 다크코드 해체 */}
                                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-1.5">
                                        <div className="text-[10px] font-bold text-rose-400 font-mono flex items-center gap-1">
                                            <span>1. 다크코드 해체 (Shadow Scan)</span>
                                        </div>
                                        <p className="text-gray-200 leading-snug">
                                            <strong>기존 패턴: </strong>{alchemyResult.shadowPattern.fromDarkCode}
                                        </p>
                                        <p className="text-[11px] text-gray-400 italic">
                                            • 낡은 의도: {alchemyResult.shadowPattern.underlyingIntention}
                                        </p>
                                    </div>

                                    {/* 2. 뉴럴 코드 추출 */}
                                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-1.5">
                                        <div className="text-[10px] font-bold text-emerald-400 font-mono flex items-center gap-1">
                                            <span>2. 뉴럴 코드 추출 (Neural Essence)</span>
                                        </div>
                                        <p className="text-emerald-200 font-bold leading-snug">
                                            {alchemyResult.shadowPattern.transmutedGift}
                                        </p>
                                        <p className="text-[11px] text-emerald-400/80">
                                            • 진실: {alchemyResult.superpowerAnalysis.coreAbility}
                                        </p>
                                    </div>
                                </div>

                                {/* 3 & 4. 승화된 천부적 재능 & 주권 발현 행동 규칙 */}
                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-amber-300 font-mono">
                                            3. 뇌신경학적 실무 초격차 강점 (Superpower)
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">
                                            사주 {sajuFusionResult.sajuDominantGod} 융합
                                        </span>
                                    </div>
                                    <p className="text-gray-200 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                                        {alchemyResult.superpowerAnalysis.workplaceAdvantage}
                                    </p>
                                    <div className="pt-1">
                                        <div className="text-[10px] font-bold text-emerald-400 font-mono mb-1">
                                            4. 주권 발현 행동 규칙 (Activation Protocol):
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 font-bold text-xs">
                                            👉 "{alchemyResult.activationProtocol}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3 Master Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 rounded-3xl bg-slate-950 border-2 border-emerald-500/40 text-center space-y-2 relative overflow-hidden shadow-lg">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 mx-auto">
                                        <Anchor className="w-7 h-7" />
                                    </div>
                                    <div className="text-xs font-black text-white">주권의 닻 (The Anchor)</div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        타인의 위기 충동을 멈추고 내 본진에 10분 마이크로 시동을 성공적으로 안착시킨 증표
                                    </p>
                                    <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">UNLOCKED ✅</span>
                                </div>

                                <div className="p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 text-center space-y-2 relative overflow-hidden shadow-lg">
                                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mx-auto">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <div className="text-xs font-black text-white">바운더리 아키텍트 (Architect)</div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        완벽주의 흑백논리를 깨고 30점짜리 엉성한 시도를 자비롭게 허용한 마스터에게 수여
                                    </p>
                                    <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">UNLOCKED ✅</span>
                                </div>

                                <div className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-500/40 text-center space-y-2 relative overflow-hidden shadow-lg">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto">
                                        <Sparkles className="w-7 h-7" />
                                    </div>
                                    <div className="text-xs font-black text-white">지천태 (Tai · 地天泰)</div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        생각 이전의 텅 빈 백지(0)에서 현실을 창조하는 제로포인트 현존 최고 등급 뱃지
                                    </p>
                                    <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">UNLOCKED ✅</span>
                                </div>
                            </div>

                            {/* 9:16 Share Card Studio */}
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-bold text-white flex items-center gap-2">
                                        <Share2 className="w-4 h-4 text-emerald-400" />
                                        <span>인스타그램 / 링크드인용 9:16 소버린 쉐어 카드</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setCopiedAlert(true);
                                            setTimeout(() => setCopiedAlert(false), 2500);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-[11px] hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                                    >
                                        <Copy className="w-3 h-3" />
                                        <span>{copiedAlert ? '텍스트 복사됨!' : '카드 텍스트 복사'}</span>
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 text-xs font-mono leading-relaxed text-gray-300 space-y-2">
                                    <div className="text-emerald-400 font-bold">✨ [MYONGSIM SOVEREIGN PASS]</div>
                                    <div>• 회수한 자기 주권 시간 : +{totalReclaimedMins} MIN</div>
                                    <div>• 다크코드 방어 지수     : {darkCodeBlocksCount}회 완전 차단</div>
                                    <div>• 자기 주권 에너지 점수 : {sovereignScore}점 (안정 궤도)</div>
                                    <div>• 획득 뱃지             : 주권의 닻 ⚓ / 바운더리 아키텍트 🛡️</div>
                                    <div className="text-gray-500 text-[10px] pt-1">
                                        "남의 불을 끄지 않아도 세상은 잘 돌아가며, 오늘 내 삶은 분명히 전진했다."
                                    </div>
                                </div>
                            </div>

                            {/* Saved 1-Line Insight Notes */}
                            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                                <div className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                    <Bookmark className="w-4 h-4 text-amber-400" />
                                    <span>나만의 통찰 메모 보관함</span>
                                </div>
                                <div className="space-y-2">
                                    {savedNotes.map((note, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-gray-300">
                                            • {note}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [NEW] 🏆 30초 메타인지 회고 대화 & RECLAIMED STAMP 팝업     */}
                    {/* ========================================================= */}
                    {showReflectionModal && (
                        <div className="fixed inset-0 z-[4500] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in font-sans">
                            <div className="bg-[#0b0f19] border-2 border-emerald-400/60 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-[0_0_90px_rgba(16,185,129,0.4)] relative text-white space-y-5 custom-scrollbar">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md">
                                            <Trophy className="w-5 h-5 fill-slate-950" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-white">
                                                ⏱️ 10분 몰입 완수! (Micro-Focus Completed)
                                            </h3>
                                            <p className="text-[10px] text-emerald-300 font-mono">
                                                30초 메타인지 현실 검증 & 에너지 회수
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowReflectionModal(false)} className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                        <span>🔔 1단계 | 즉각적 신경학적 보상 및 신체 접지</span>
                                    </div>
                                    <p className="text-xs text-gray-200 leading-relaxed break-keep">
                                        "10분의 마이크로 몰입을 성공적으로 완수하셨습니다. 외부의 위기나 남의 문제로 흩어지던 에너지를 차단하고, 오롯이 내 본진(1순위 과제)에 10분의 생명력을 환류시켰습니다. <strong>지금 깊게 숨을 들이마시고, 내쉬면서 턱과 어깨의 긴장을 툭 내려놓으세요.</strong>"
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="text-xs font-bold text-cyan-300">
                                        💡 2단계 | 메타인지 현실 검증 (Reality Testing):
                                    </div>
                                    <p className="text-xs text-gray-300 italic">
                                        "시작 전 편도체가 속삭였던 '막막함과 거대한 부담'을 떠올려 보세요. 막상 10분을 마친 지금, 당신의 뇌와 감각은 무엇을 말하고 있나요?"
                                    </p>

                                    <div className="space-y-2">
                                        {[
                                            { id: 'A', text: '시작 전엔 막막했는데, 막상 하니 별거 아니었네요. 💡' },
                                            { id: 'B', text: '10분이 순식간에 지나갔어요. 제대로 탄력이 붙었습니다. 🔥' },
                                            { id: 'C', text: '집중이 좀 흩어졌지만, 10분을 지켜냈다는 사실이 후련합니다. 🌿' }
                                        ].map((chip) => (
                                            <button
                                                key={chip.id}
                                                onClick={() => setRealityChoice(chip.id)}
                                                className={`w-full p-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                                    realityChoice === chip.id
                                                        ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                                        : 'bg-slate-900 border border-slate-800 text-gray-300 hover:border-slate-700'
                                                }`}
                                            >
                                                <span>• {chip.text}</span>
                                                {realityChoice === chip.id && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {realityChoice && (
                                    <div className="p-4.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-400/50 space-y-2.5 animate-fade-in-up shadow-lg">
                                        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                                            <span className="text-xs font-black text-amber-300 font-mono flex items-center gap-1.5">
                                                <Award className="w-4 h-4 text-amber-400" />
                                                <span>⚡ [에너지 환류 완료 인증: RECLAIMED STAMP]</span>
                                            </span>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                                                VERIFIED
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-gray-300">
                                            "보이시나요? <strong className="text-amber-200">'시작 전의 공포는 100이었지만, 실제 행동의 마찰은 10도 되지 않았습니다.'</strong> 뇌가 만들어낸 완벽주의 환상을 깨뜨리셨습니다."
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                                                <div className="text-[9px] text-gray-400">회수 주권 시간</div>
                                                <div className="text-xs font-black text-emerald-400 mt-0.5">+{totalReclaimedMins} MIN</div>
                                            </div>
                                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                                                <div className="text-[9px] text-gray-400">다크코드 방어</div>
                                                <div className="text-xs font-black text-cyan-400 mt-0.5">{darkCodeBlocksCount}회 차단</div>
                                            </div>
                                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                                                <div className="text-[9px] text-gray-400">자기 주권 지수</div>
                                                <div className="text-xs font-black text-amber-400 mt-0.5">{sovereignScore}점 (안정)</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {realityChoice && (
                                    <div className="space-y-2.5 pt-1 animate-fade-in-up">
                                        <div className="text-[11px] text-gray-400 text-center font-medium">
                                            "오늘의 마이크로 시동은 여기서 기분 좋게 멈추셔도 100점 만점입니다. 지금 어떻게 마무리하시겠습니까?"
                                        </div>

                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    alert('🏆 세션이 성공적으로 기록되었습니다. 대시보드와 아카이브에 영구 보관되었습니다!');
                                                    setShowReflectionModal(false);
                                                    setRealityChoice(null);
                                                }}
                                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                                                <span>[ 🏆 세션 저장하고 기분 좋게 일상 복귀하기 ]</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setShowReflectionModal(false);
                                                    setRealityChoice(null);
                                                    setFocusTimeLeft(600);
                                                    setIsFocusRunning(true);
                                                    startSynthesizer();
                                                }}
                                                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                                <span>[ ⚡ 탄력받은 김에 10분 더 몰입하기 ]</span>
                                            </button>

                                            {!showOneLineInput ? (
                                                <button
                                                    onClick={() => setShowOneLineInput(true)}
                                                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>[ 📝 머릿속에 번뜩인 핵심 아이디어 1줄 기록하기 ]</span>
                                                </button>
                                            ) : (
                                                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 animate-fade-in">
                                                    <input
                                                        type="text"
                                                        value={oneLineIdea}
                                                        onChange={(e) => setOneLineIdea(e.target.value)}
                                                        placeholder="예: 기획서 1단락의 핵심 메시지는 '단순함'으로 잡자."
                                                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-400"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            if (oneLineIdea.trim()) {
                                                                const updated = [oneLineIdea.trim(), ...savedNotes];
                                                                setSavedNotes(updated);
                                                                saveWellnessData(totalReclaimedMins, darkCodeBlocksCount, sovereignScore, sessionLogs, updated);
                                                                alert('소버린 아카이브에 1줄 아이디어가 안전하게 보관되었습니다! ✨');
                                                            }
                                                            setShowReflectionModal(false);
                                                            setRealityChoice(null);
                                                            setShowOneLineInput(false);
                                                        }}
                                                        className="w-full py-2 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
                                                    >
                                                        💾 소버린 아카이브에 저장
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Noise Spectrum Guide Modal */}
                    {showNoiseGuideModal && (
                        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-sans">
                            <div className="bg-[#0b0f19] border-2 border-blue-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-[0_0_80px_rgba(59,130,246,0.3)] relative text-white space-y-6 custom-scrollbar">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                            <Waves className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                                <span>신경음향학 노이즈 & 주파수 스펙트럼 가이드</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">Neuro-Acoustics</span>
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                뇌파 동조와 청각 마스킹의 과학적 메커니즘
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowNoiseGuideModal(false)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4 text-xs">
                                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-1.5">
                                        <div className="text-amber-300 font-black font-mono">1. Brown Noise (1/f² 감쇄율 -6dB/Octave) ★추천</div>
                                        <p className="text-gray-300">심해의 파도 소리·거친 빗소리 질감으로 편도체와 DMN 잡념을 즉각 진정시키고 10분 몰입을 유도합니다.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-1.5">
                                        <div className="text-rose-300 font-black font-mono">2. Pink Noise (1/f 황금비 소음)</div>
                                        <p className="text-gray-300">나뭇잎 스치는 소리 패턴으로 서파 뇌파를 유도하여 장시간 독서와 기억 공고화에 탁월합니다.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1.5">
                                        <div className="text-slate-200 font-black font-mono">3. White Noise (f⁰ 전 대역 평탄 소음)</div>
                                        <p className="text-gray-300">청각 차폐 능력이 가장 뛰어나 카페나 사무실의 돌발 주변 소음을 차단합니다.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-1.5">
                                        <div className="text-indigo-300 font-black font-mono">4. 10Hz Binaural Alpha Waves (바이노럴 알파파)</div>
                                        <p className="text-gray-300">뇌파를 긴장이 풀린 각성 상태로 유도하여 도파민 소진 없이 창의적 아이디어를 돕습니다.</p>
                                    </div>
                                </div>

                                <button onClick={() => setShowNoiseGuideModal(false)} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-xs shadow-lg">
                                    가이드 확인 완료 및 타이머로 돌아가기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [NEW] 🔔 저녁 9시 웰니스 마감 푸시 알림 3종 센터           */}
                    {/* ========================================================= */}
                    {showPushCenterModal && (
                        <div className="fixed inset-0 z-[4200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-sans">
                            <div className="bg-[#0b0f19] border-2 border-indigo-500/40 rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-[0_0_80px_rgba(99,102,241,0.3)] relative text-white space-y-5 custom-scrollbar">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                            <Moon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                                <span>저녁 9시 웰니스 마감 푸시 알림</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold">21:00 PM</span>
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                낮 동안 지켜낸 에너지를 회수하고 수면으로 이끄는 쿨다운 알림
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPushCenterModal(false)}
                                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Push Modal Sub-nav Tabs */}
                                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                                    <button
                                        onClick={() => setPushModalTab('templates')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            pushModalTab === 'templates'
                                                ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 shadow-sm'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        📜 3대 마감 알림 템플릿
                                    </button>
                                    <button
                                        onClick={() => setPushModalTab('analytics')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            pushModalTab === 'analytics'
                                                ? 'bg-teal-500/30 text-teal-200 border border-teal-500/50 shadow-sm'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        📊 A/B 타겟팅 성과 분석 (Recharts)
                                    </button>
                                </div>

                                {pushModalTab === 'templates' ? (
                                    <>
                                        {/* 3 Push Notification Cards */}
                                        <div className="space-y-3.5 animate-fade-in">
                                            {/* Option 1 */}
                                            <div
                                                onClick={() => {
                                                    setShowPushCenterModal(false);
                                                    setActiveTab('dashboard');
                                                }}
                                                className="p-4.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/90 transition-all cursor-pointer space-y-2 shadow-md group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        <h4 className="text-xs sm:text-sm font-black text-emerald-300 font-sans">
                                                            옵션 1. 🌿 오늘 당신이 회수한 10분의 온기
                                                        </h4>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-emerald-300 transition-colors">
                                                        대시보드 연결 →
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed break-keep">
                                                    "남의 불을 끄러 달려가지 않고, 온전히 나 자신에게 돌려준 10분이 있었습니다. 세상은 무너지지 않았고 당신의 중심은 더 단단해졌습니다. 이제 마음 편히 깊은 쉼에 드세요."
                                                </p>
                                                <div className="text-[10px] text-emerald-400/80 font-mono pt-1">
                                                    👉 탭 시: [에너지 대시보드 (+10분 회수 스탬프 확인)]으로 즉시 이동
                                                </div>
                                            </div>

                                            {/* Option 2 */}
                                            <div
                                                onClick={() => {
                                                    setShowPushCenterModal(false);
                                                    setActiveTab('focus_lab');
                                                    setFocusSubTab('compassion_breath');
                                                }}
                                                className="p-4.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800/90 transition-all cursor-pointer space-y-2 shadow-md group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                                                        <h4 className="text-xs sm:text-sm font-black text-cyan-300 font-sans">
                                                            옵션 2. 🌙 세상을 구하지 않아도 괜찮았던 하루
                                                        </h4>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-cyan-300 transition-colors">
                                                        1분 수면 가이드 →
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed break-keep">
                                                    "완벽한 하루가 아니었어도, 뇌의 저항을 뚫고 10분의 시동을 켜낸 당신은 충분히 훌륭했습니다. 뇌의 과열된 스위치를 끄고, 오늘 밤은 온전한 무중력(Zero-Point)의 평온을 누리세요."
                                                </p>
                                                <div className="text-[10px] text-cyan-400/80 font-mono pt-1">
                                                    👉 탭 시: [수면 전 1분 마인드풀 호흡 가이드] 자동 실행
                                                </div>
                                            </div>

                                            {/* Option 3 */}
                                            <div
                                                onClick={() => {
                                                    setShowPushCenterModal(false);
                                                    setActiveTab('focus_lab');
                                                    setFocusSubTab('delta_sleep');
                                                    setSleepTimerOption('Unlimited');
                                                    setSleepRemainingSecs(null);
                                                    setIsSleepRunning(true);
                                                    startSleepCoachSound();
                                                }}
                                                className="p-4.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-800/90 transition-all cursor-pointer space-y-2 shadow-md group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                                                        <h4 className="text-xs sm:text-sm font-black text-purple-300 font-sans">
                                                            옵션 3. 🛡️ 오늘 밤, 당신의 엔진을 완전히 꺼주세요
                                                        </h4>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-purple-300 transition-colors">
                                                        432Hz 델타파 시작 →
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-relaxed break-keep">
                                                    "낮 동안 확보한 10분의 자기 주권이 대시보드에 안전하게 보관되었습니다. 외부의 모든 요청과 생각은 문밖에 두고, 당신만의 불가침 영역으로 입장할 시간입니다."
                                                </p>
                                                <div className="text-[10px] text-purple-400/80 font-mono pt-1">
                                                    👉 탭 시: [432Hz 델타파 숙면 바이노럴 비트 플레이어] 즉시 재생
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Policy Notice */}
                                        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-gray-400 leading-relaxed text-center">
                                            💡 <strong>발송 원칙:</strong> 행동 강요가 아닌 <em>'오늘 지켜낸 주권을 축하하고 이완하는 허용'</em>을 통해 심리적 피로도를 0으로 유지합니다.
                                        </div>
                                    </>
                                ) : (
                                    <div className="animate-fade-in pt-1">
                                        <PushComparisonDashboard />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [NEW] 🔬 518,400 사주 통계학 & 신경심리 희소성 메트릭스 모달   */}
                    {/* ========================================================= */}
                    {showRarityModal && (
                        <div className="fixed inset-0 z-[4300] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-sans">
                            <div className="bg-[#0b0f19] border-2 border-amber-500/50 rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.3)] relative text-white space-y-5 custom-scrollbar">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg text-lg">
                                            👑
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                                <span>사주 조합 통계학적 희소성 인덱스</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                                                    Top {sajuRarityInfo.percent}%
                                                </span>
                                            </h3>
                                            <p className="text-xs text-gray-400 font-mono">
                                                전체 518,400가지 시공간 명식 매트릭스 정밀 통계
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowRarityModal(false)}
                                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Main Highlight Card */}
                                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/40 space-y-2.5 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-amber-300 font-bold">
                                            ✨ {sajuRarityInfo.tierName}
                                        </span>
                                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                                            희소 표본: 약 {sajuRarityInfo.countInTotal.toLocaleString()}개 / 518,400개
                                        </span>
                                    </div>
                                    <div className="text-sm font-black text-white leading-relaxed">
                                        "{userSajuGanji}" 명식은 60갑자 연월일시의 518,400가지 조합 중 <strong className="text-amber-300 underline decoration-amber-400 decoration-2 underline-offset-4">상위 {sajuRarityInfo.percent}%</strong>에 해당하는 독보적 잠재력의 사주입니다.
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed break-keep">
                                        {sajuRarityInfo.specialtyDesc}
                                    </p>
                                </div>

                                {/* 4-Dimension Metric Bars */}
                                <div className="space-y-3 pt-1 text-xs">
                                    <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span>4대 신경심리 & 역학 메트릭스 정밀 지수</span>
                                    </h4>

                                    {/* Metric 1 */}
                                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                        <div className="flex justify-between font-mono text-[11px]">
                                            <span className="text-gray-300">1. 시공간 조합 희소성 (Combinatorial Rarity)</span>
                                            <span className="text-amber-400 font-bold">상위 {sajuRarityInfo.percent}% (518,400개 중)</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: `${100 - sajuRarityInfo.percent}%` }} />
                                        </div>
                                    </div>

                                    {/* Metric 2 */}
                                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                        <div className="flex justify-between font-mono text-[11px]">
                                            <span className="text-gray-300">2. 오행 에너지 순환 완결도 (Five-Element Synergy)</span>
                                            <span className="text-emerald-400 font-bold">{sajuRarityInfo.synergyScore}% (전체 평균 64.2%)</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${sajuRarityInfo.synergyScore}%` }} />
                                        </div>
                                    </div>

                                    {/* Metric 3 */}
                                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                        <div className="flex justify-between font-mono text-[11px]">
                                            <span className="text-gray-300">3. 전두엽 개척 및 집행력 (Executive Function)</span>
                                            <span className="text-cyan-400 font-bold">상위 {sajuRarityInfo.executivePercent}%</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" style={{ width: `${100 - sajuRarityInfo.executivePercent}%` }} />
                                        </div>
                                    </div>

                                    {/* Metric 4 */}
                                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                                        <div className="flex justify-between font-mono text-[11px]">
                                            <span className="text-gray-300">4. 시스템 혁신 및 사회적 임팩트 (Impact Potential)</span>
                                            <span className="text-purple-400 font-bold">상위 {sajuRarityInfo.impactPercent}%</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: `${100 - sajuRarityInfo.impactPercent}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Scientific Footnote */}
                                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-gray-400 leading-relaxed text-center font-sans">
                                    💡 <strong>산출 공식:</strong> 60갑자 사주 4주 순열(60 × 12 × 60 × 12 = 518,400) × 일간 오행 통근 계수 × 관인상생 격국 가중치를 신경과학적 집행 기능 지표와 결합하여 산출되었습니다.
                                </div>

                                <button
                                    onClick={() => setShowRarityModal(false)}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
                                >
                                    확인 완료 및 1:1 맞춤 코칭 계속하기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [NEW] 🛡️ 구원자 트랩 차단: 3대 정중한 거절 템플릿 모달         */}
                    {/* ========================================================= */}
                    {showDeclineTemplateModal && (
                        <div className="fixed inset-0 z-[4400] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-sans">
                            <div className="bg-[#0b0f19] border-2 border-amber-500/50 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-[0_0_80px_rgba(245,158,11,0.25)] relative text-white space-y-4 custom-scrollbar">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                                            🛡️
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-white">
                                                구원자 트랩 방어: 3대 정중한 거절 템플릿
                                            </h3>
                                            <p className="text-[11px] text-gray-400">
                                                감정 낭비 없이 1-Tap으로 복사하여 경계선을 지키세요.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDeclineTemplateModal(false)}
                                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Template 1 */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-amber-300">1. [업무/회의 요청 정중한 거절]</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText("현재 진행 중인 1순위 핵심 과제에 집중하고 있어, 이번 건은 부득이하게 참여가 어렵습니다. 다음 기회에 더 좋은 상태로 함께하겠습니다.");
                                                setCopiedAlert('템플릿 1이 복사되었습니다!');
                                                setTimeout(() => setCopiedAlert(null), 2000);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/40 transition-all cursor-pointer"
                                        >
                                            📋 1-Tap 복사
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed break-keep bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-sans">
                                        "현재 진행 중인 1순위 핵심 과제에 집중하고 있어, 이번 건은 부득이하게 참여가 어렵습니다. 다음 기회에 더 좋은 상태로 함께하겠습니다."
                                    </p>
                                </div>

                                {/* Template 2 */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-amber-300">2. [개인적 부탁/자문 완곡한 거절]</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText("제안 주신 내용은 매우 뜻깊으나, 현재 가용 에너지 한계로 충분한 도움을 드리기 어렵습니다. 상황이 정돈되면 먼저 연락드리겠습니다.");
                                                setCopiedAlert('템플릿 2가 복사되었습니다!');
                                                setTimeout(() => setCopiedAlert(null), 2000);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/40 transition-all cursor-pointer"
                                        >
                                            📋 1-Tap 복사
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed break-keep bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-sans">
                                        "제안 주신 내용은 매우 뜻깊으나, 현재 가용 에너지 한계로 충분한 도움을 드리기 어렵습니다. 상황이 정돈되면 먼저 연락드리겠습니다."
                                    </p>
                                </div>

                                {/* Template 3 */}
                                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-amber-300">3. [즉답 보류 & 마감 시간 유예]</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText("완성도 높은 검토를 위해 일정을 내일 오후 3시까지 재검토한 후 명확한 방향과 함께 회신드리겠습니다.");
                                                setCopiedAlert('템플릿 3이 복사되었습니다!');
                                                setTimeout(() => setCopiedAlert(null), 2000);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/40 transition-all cursor-pointer"
                                        >
                                            📋 1-Tap 복사
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed break-keep bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-sans">
                                        "완성도 높은 검토를 위해 일정을 내일 오후 3시까지 재검토한 후 명확한 방향과 함께 회신드리겠습니다."
                                    </p>
                                </div>

                                {copiedAlert && (
                                    <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 text-xs font-bold text-center animate-fade-in">
                                        ✨ {copiedAlert}
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowDeclineTemplateModal(false)}
                                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* [NEW] 🏆 그림자 ➔ 뉴럴 슈퍼파워 연금술 리포트 카드 모달         */}
                    {/* ========================================================= */}
                    {showAlchemyReportModal && (
                        <div className="fixed inset-0 z-[4500] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in font-sans">
                            <div className="bg-[#090d16] border-2 border-amber-400/60 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.35)] relative text-white space-y-4 custom-scrollbar">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center text-xl font-black shadow-lg">
                                            {alchemyResult.emblemIcon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                                                    👑 연금술 판정 엔진 최종 인증
                                                </span>
                                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                                    주권 점수: {alchemyResult.sovereigntyScore}점
                                                </span>
                                            </div>
                                            <h3 className="text-base sm:text-lg font-black text-white mt-1">
                                                {alchemyResult.title}
                                            </h3>
                                            <p className="text-xs text-amber-300/90 font-medium">
                                                ✨ {alchemyResult.subTitle}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAlchemyReportModal(false)}
                                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Shadow Transmutation Formula */}
                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                    <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 font-mono">
                                        <span>🔄 그림자 ➔ 황금 승화 공식 (Shadow Transmutation)</span>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 space-y-1">
                                            <div className="text-[10px] font-bold text-rose-400 font-mono">과거의 다크코드 (Dark Code)</div>
                                            <div className="text-gray-300 leading-snug break-keep">{alchemyResult.shadowPattern.fromDarkCode}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
                                            <div className="text-[10px] font-bold text-emerald-400 font-mono">승화된 황금 선물 (Transmuted Gift)</div>
                                            <div className="text-emerald-200 leading-snug break-keep font-bold">{alchemyResult.shadowPattern.transmutedGift}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Neural Superpower Mechanism */}
                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                                    <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5 font-mono">
                                        <Brain className="w-4 h-4 text-emerald-400" />
                                        <span>뇌신경학적 메커니즘 & 직장 내 초격차 강점</span>
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-gray-300 leading-relaxed break-keep">
                                            <strong className="text-cyan-300">🧠 신경 기제: </strong>{alchemyResult.superpowerAnalysis.neuroMechanism}
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-gray-300 leading-relaxed break-keep">
                                            <strong className="text-amber-300">💼 실무 강점: </strong>{alchemyResult.superpowerAnalysis.workplaceAdvantage}
                                        </div>
                                    </div>
                                </div>

                                {/* Saju Ten-Gods & Cognitive Alchemy Fusion Insight */}
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-2.5">
                                    <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5 font-mono">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <span>🔮 사주 십신(十神) 격국 × 인지신경과학 융합 분석</span>
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300 bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/30">
                                            <span className="font-bold">주도 십신: {sajuFusionResult.sajuDominantGod}</span>
                                            <span className="font-bold text-white">{sajuFusionResult.archetypeTitle}</span>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed break-keep bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans">
                                            {sajuFusionResult.personalizedDiagnosis}
                                        </p>
                                    </div>
                                </div>

                                {/* Activation Protocol & Mantra */}
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 space-y-2.5">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-emerald-400 font-mono">🎯 1순위 행동 발현 프로토콜:</div>
                                        <div className="text-xs text-white font-bold leading-snug">{alchemyResult.activationProtocol}</div>
                                    </div>
                                    <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                                        <div className="text-[10px] font-bold text-amber-400 font-mono">🧘 제로포인트 해방 만트라:</div>
                                        <div className="text-xs text-amber-200 font-bold italic leading-snug">"{alchemyResult.zeroPointMantra}"</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowAlchemyReportModal(false)}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
                                >
                                    확인 완료 및 주권 회복하기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* Footer */}
                    <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>특허출원 제10-2025-0166877호 제로포인트 하이브리드 신경망 시스템</span>
                        </div>
                        <button onClick={onClose} className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
                            닫기
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
