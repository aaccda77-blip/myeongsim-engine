'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Sparkles, Compass, Flame, Moon, Sun, ArrowLeft, Volume2, VolumeX, 
    CheckCircle2, RefreshCw, MessageSquare, Shield, Award, Heart, 
    Zap, Eye, Droplets, Layers, ChevronRight, BookmarkCheck, Star,
    ArrowDown, Activity, Atom, Orbit
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ── 1. 핵심 자각 퀘스트 20일 데이터 (도서 《제로 포인트》 100% 연동) ──
const QUEST_DAYS = [
    {
        day: 1,
        title: "스크린은 영화 뒤에 언제나 있었다",
        subtitle: "모든 생각의 소음이 피어나는 본래의 바탕",
        metaphor: "화려한 영화 속 불길과 빗줄기도 하얀 스크린을 단 1mm도 태우거나 적시지 못합니다. 당신의 마음도 일상의 불안에 결코 오염된 적이 없습니다.",
        inquiry: "지금 일어나는 슬픔과 불안을 가만히 바라보고 있는 '진짜 나'는 어디에 있는가?",
        action: "눈을 1초 감고, 생각의 내용이 아닌 '생각이 상영되는 하얀 스크린'을 느껴보세요.",
        element: "Void (공/空)",
        color: "indigo"
    },
    {
        day: 2,
        title: "숨과 숨 사이, 그 거룩한 틈새",
        subtitle: "과거도 미래도 멈춘 0(Zero)의 좌표",
        metaphor: "숨을 완전히 내쉬고 다시 들이쉬기 직전의 0.1초. 그 완벽한 진공의 틈새에서 우주는 속삭입니다. '너는 아무것도 증명하지 않아도 이미 완전하다.'",
        inquiry: "숨이 오가지 않는 그 짧은 정적 속에서 나를 지탱하고 있는 것은 무엇인가?",
        action: "숨을 천천히 내쉬고, 다음 숨이 들어오기 전 1초간 고요의 틈새에 머물러 보세요.",
        element: "Air (풍/風)",
        color: "cyan"
    },
    {
        day: 3,
        title: "붓을 쥐기 전, 하얀 도화지의 자유",
        subtitle: "어떤 색을 칠해도 본질은 변치 않는다",
        metaphor: "어떤 날은 검은 슬픔을, 어떤 날은 붉은 분노를 칠합니다. 하지만 당신은 칠해진 물감이 아니라 그 색을 품어주는 하얀 도화지 그 자체입니다.",
        inquiry: "내 마음에 칠해진 상처의 물감을 지우려 하지 않고, 도화지 자체로 돌아갈 수 있는가?",
        action: "가슴에 손을 얹고 '나는 지나가는 감정이 아니라 하얀 도화지다'라고 나직이 읊조려보세요.",
        element: "Light (명/明)",
        color: "amber"
    },
    {
        day: 4,
        title: "100미터 바다 아래의 압도적인 고요",
        subtitle: "표면의 파도에 속지 않는 심해의 평화",
        metaphor: "바다 표면에 거센 폭풍이 몰아쳐도 수심 100미터 아래 심해는 단 1밀리미터도 흔들리지 않습니다. 당신은 파도가 아니라 거대한 바다 전체입니다.",
        inquiry: "요동치는 일상의 걱정 아래에 언제나 흐르고 있는 깊고 투명한 평화를 느끼는가?",
        action: "주의의 무게중심을 머리에서 아랫배 심해 밑바닥으로 스르륵 내려놓으세요.",
        element: "Water (수/水)",
        color: "blue"
    },
    {
        day: 5,
        title: "어떤 무게도 기억하지 않는 0의 저울",
        subtitle: "지나간 짐을 즉시 리셋하는 완벽한 영점",
        metaphor: "저울 위에 무거운 짐이 올라왔다 내려가도, 저울은 바늘 하나 떨림 없이 0으로 돌아옵니다. 어떤 과거가 지나가도 당신의 본질은 즉시 0으로 리셋됩니다.",
        inquiry: "지나간 일의 무게를 아직도 붙잡고 있는가, 아니면 저울처럼 0으로 놓아줄 것인가?",
        action: "어깨의 긴장을 툭 풀며 '모든 것을 0(Zero)으로 리셋한다'고 선언해 보세요.",
        element: "Ether (영점/零)",
        color: "emerald"
    }
];

// ── 2. 감정 연금술 4대 원소 변환 데이터 (완벽한 구조화) ──
const ALCHEMY_ELEMENTS = [
    {
        id: 'anger',
        name: '분노 & 억울함',
        icon: '🔥',
        keyword: '과열된 화(火) 에너지',
        rawState: '억압된 분노와 인정받지 못한 억울함',
        transformedState: '불굴의 결단력 & 혁신 추진력',
        transformedEn: 'Courage & Breakthrough',
        crucibleGlow: 'from-rose-500/30 via-amber-500/20 to-orange-500/30',
        borderColor: 'border-rose-500/40',
        tagBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        cure: '분노를 억누르지 않고, 삶의 부조리를 돌파하는 강력한 창조적 혁신 엔진으로 승화합니다.'
    },
    {
        id: 'anxiety',
        name: '불안 & 통제욕',
        icon: '🌊',
        keyword: '격랑의 수(水) 에너지',
        rawState: '미래에 대한 과도한 계산과 통제 강박',
        transformedState: '깊은 통찰력 & 유연한 수용 지혜',
        transformedEn: 'Wisdom & Inner Trust',
        crucibleGlow: 'from-blue-500/30 via-cyan-500/20 to-indigo-500/30',
        borderColor: 'border-blue-500/40',
        tagBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        cure: '불안의 에너지를 멈춤의 닻으로 삼아, 우주의 흐름을 신뢰하는 직관적 평화로 환원합니다.'
    },
    {
        id: 'lethargy',
        name: '무기력 & 번아웃',
        icon: '🪨',
        keyword: '굳어버린 토(土) 에너지',
        rawState: '에너지 고갈과 삶의 의욕 저하',
        transformedState: '단단한 대지의 재생력 & 충전',
        transformedEn: 'Restoration & Grounding',
        crucibleGlow: 'from-amber-600/30 via-yellow-600/20 to-stone-500/30',
        borderColor: 'border-amber-500/40',
        tagBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        cure: '억지로 애쓰지 않고, 대지 깊은 곳에서 새싹을 틔우기 위한 거룩한 휴식의 충전기로 삼습니다.'
    },
    {
        id: 'guilt',
        name: '자책감 & 수치심',
        icon: '🌪️',
        keyword: '날카로운 금(金) 에너지',
        rawState: '스스로를 향한 가혹한 내면 검열과 비난',
        transformedState: '스스로를 품는 위대한 자비심',
        transformedEn: 'Self-Compassion & Grace',
        crucibleGlow: 'from-purple-500/30 via-pink-500/20 to-violet-500/30',
        borderColor: 'border-purple-500/40',
        tagBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        cure: '스스로를 겨누던 칼날을 거두고, 나라는 존재를 조건 없이 온전히 안아주는 거룩한 사랑으로 변환합니다.'
    }
];

// ── 3. 그림자 작업 4대 원형 데이터 (융 & IFS 통합) ──
const SHADOW_ARCHETYPES = [
    {
        id: 'critic',
        title: '가혹한 내부 비판가',
        subtitle: '완벽하지 않으면 사랑받지 못한다는 공포',
        badge: '수석 검열자',
        icon: '⚖️',
        message: '“너는 항상 부족해. 더 증명해야만 해.”',
        gift: '탁월한 디테일 감각과 장인 정신 (Mastery)',
        integration: '비판가의 마이크를 내려놓고, 그 뒤에서 떨고 있는 어린 자아를 따뜻하게 품어줍니다.',
        glow: 'from-indigo-900/50 to-purple-900/40 border-indigo-400/30'
    },
    {
        id: 'defender',
        title: '냉소적인 철벽 파수꾼',
        subtitle: '다시는 상처받지 않으려 문을 닫아건 자아',
        badge: '철벽의 경계',
        icon: '🛡️',
        message: '“아무도 믿지 마. 결국 다 너를 떠날 거야.”',
        gift: '독립적인 주체성과 건강한 바운더리 (Sanctuary)',
        integration: '“그동안 나를 지키느라 고생 많았어”라고 진심으로 감사를 전하고 안전한 안식을 선물합니다.',
        glow: 'from-slate-900/60 to-blue-950/40 border-blue-400/30'
    },
    {
        id: 'exile',
        title: '외로운 추방자 (내면 아이)',
        subtitle: '버림받을까 두려워 무의식 방에 갇힌 아이',
        badge: '순수 영혼',
        icon: '🧸',
        message: '“나를 제발 혼자 어둠 속에 버려두지 마.”',
        gift: '순수한 창조적 영감과 무한한 감수성 (Creativity)',
        integration: '빛의 거실로 아이를 데려와 헌정 힐링송의 따뜻한 품에서 무조건적인 사랑을 전합니다.',
        glow: 'from-purple-950/60 to-rose-950/40 border-purple-400/30'
    },
    {
        id: 'pleaser',
        title: '착한 아이 가면',
        subtitle: '인정받기 위해 내 마음을 버린 희생자',
        badge: '타인 중심 가면',
        icon: '🎭',
        message: '“내가 참아야 모두가 나를 좋아해 줄 거야.”',
        gift: '깊은 공감 능력과 진정한 조화의 리더십 (Harmony)',
        integration: '타인의 시선을 내려놓고, 내 삶의 진정한 주권자로서 당당히 ‘NO’를 선언할 자유를 되찾습니다.',
        glow: 'from-amber-950/50 to-orange-950/40 border-amber-400/30'
    }
];

function QuantumAwakeningContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'alchemy';

    const [activeTab, setActiveTab] = useState<'quest' | 'alchemy' | 'shadow'>(
        initialTab === 'quest' ? 'quest' : initialTab === 'shadow' ? 'shadow' : 'alchemy'
    );

    // 528Hz 솔페지오 주파수 사운드 스테이트
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // 0-1 퀘스트 스테이트
    const [selectedQuestDay, setSelectedQuestDay] = useState<number>(1);
    const [completedQuests, setCompletedQuests] = useState<number[]>([1]);
    const [awakeningLevel, setAwakeningLevel] = useState<number>(35);

    // 0-2 감정 연금술 스테이트
    const [selectedAlchemy, setSelectedAlchemy] = useState<any>(ALCHEMY_ELEMENTS[3]); // 자책감 기본 선택
    const [isTransmuted, setIsTransmuted] = useState(false);

    // 0-3 그림자 작업 스테이트
    const [selectedShadow, setSelectedShadow] = useState<any>(SHADOW_ARCHETYPES[0]);
    const [isIntegrated, setIsIntegrated] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('myeongsim_completed_quests');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setCompletedQuests(parsed);
                    setAwakeningLevel(Math.min(100, Math.max(20, parsed.length * 20)));
                } catch (e) {}
            }
        }
    }, []);

    // 528Hz 솔페지오 사랑·변환 주파수 사운드 토글
    const toggleFrequency = () => {
        if (isPlayingSound) {
            if (oscRef.current) {
                try { oscRef.current.stop(); } catch (e) {}
            }
            setIsPlayingSound(false);
        } else {
            try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioCtx();
                audioCtxRef.current = ctx;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(528, ctx.currentTime);

                gain.gain.setValueAtTime(0.001, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.5);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                oscRef.current = osc;
                setIsPlayingSound(true);
            } catch (e) {
                console.error('Audio frequency error:', e);
                setIsPlayingSound(false);
            }
        }
    };

    const handleCompleteQuest = (day: number) => {
        if (!completedQuests.includes(day)) {
            const updated = [...completedQuests, day];
            setCompletedQuests(updated);
            const newLevel = Math.min(100, updated.length * 20);
            setAwakeningLevel(newLevel);
            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_completed_quests', JSON.stringify(updated));
            }
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const handleTransmute = () => {
        setIsTransmuted(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
        }
        confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#ec4899', '#a855f7', '#38bdf8']
        });
    };

    const handleConsultAI = (prompt: string) => {
        router.push(`/myeongsim-chat?intent=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#05030a] max-w-md mx-auto shadow-2xl overflow-hidden font-sans pb-28 text-white">
            
            {/* 🌌 Deep Space Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[350px] bg-gradient-to-b from-purple-700/20 via-indigo-700/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 right-[-50px] w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-20 left-[-50px] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* ── 1. Top Header Navigation (Clean & Refined) ── */}
            <header className="relative z-30 flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.08] bg-[#090514]/80 backdrop-blur-xl">
                <button
                    onClick={() => router.push('/report')}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-bold transition-all px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    <span>명심 리포트</span>
                </button>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-amber-200">
                        양자 각성 히든 룸
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        Zero Point
                    </span>
                </div>

                <button
                    onClick={toggleFrequency}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isPlayingSound 
                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse' 
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 border-white/[0.08]'
                    }`}
                    title="528Hz 솔페지오 사랑·변환 주파수"
                >
                    {isPlayingSound ? <VolumeX size={14} className="text-slate-950" /> : <Volume2 size={14} className="text-amber-400" />}
                    <span className="text-[10px] font-mono font-bold">{isPlayingSound ? '528Hz ON' : '528Hz'}</span>
                </button>
            </header>

            {/* ── 2. Official Patent Authority Badge Bar (Luxury Metallic Finish) ── */}
            <div className="relative z-20 px-4 pt-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#160d2e] to-slate-950/90 border border-amber-400/30 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-amber-300 font-mono tracking-wide flex items-center gap-1">
                                <span>🔬 대한민국 특허출원 제10-2025-0166877호</span>
                            </p>
                            <p className="text-[11px] text-gray-200 font-black">
                                심리·생체데이터 기반 스트레스 관리 솔루션
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/30">
                            Lv.1 각성
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 3. Tab Switcher (Refined Glass Capsule Design) ── */}
            <div className="relative z-20 px-4 pt-3">
                <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#0e0a1c]/90 border border-white/[0.08] shadow-inner">
                    <button
                        onClick={() => setActiveTab('quest')}
                        className={`py-2 px-1 rounded-xl font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                            activeTab === 'quest'
                                ? 'bg-gradient-to-b from-indigo-500/90 to-purple-600/90 text-white shadow-lg border border-indigo-300/30'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-[11px] flex items-center gap-1">
                            <span>🧘</span>
                            <span>자각 퀘스트</span>
                        </span>
                        <span className="text-[9px] font-mono opacity-80">108 질문</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('alchemy')}
                        className={`py-2 px-1 rounded-xl font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                            activeTab === 'alchemy'
                                ? 'bg-gradient-to-b from-purple-600/90 to-amber-500/90 text-white shadow-lg border border-amber-300/40'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-[11px] flex items-center gap-1">
                            <span>⚗️</span>
                            <span>감정 연금술</span>
                        </span>
                        <span className="text-[9px] font-mono opacity-80">에너지 전환</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('shadow')}
                        className={`py-2 px-1 rounded-xl font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                            activeTab === 'shadow'
                                ? 'bg-gradient-to-b from-slate-700 to-slate-900 text-white shadow-lg border border-purple-400/40'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-[11px] flex items-center gap-1">
                            <span>🌑</span>
                            <span>그림자 작업</span>
                        </span>
                        <span className="text-[9px] font-mono opacity-80">내면 통합</span>
                    </button>
                </div>
            </div>

            {/* ── 4. Main Chamber Interactive Body ── */}
            <main className="relative z-20 px-4 pt-3.5 space-y-4">

                {/* ══════════════════════════════════════════════════════
                    CHAMBER 1: 0-1. 자각 퀘스트 (Self-Inquiry Quest)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'quest' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        {/* Progress Bar Card */}
                        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#120c2b] to-[#0d091e] border border-indigo-500/30 shadow-xl space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-black text-indigo-300 flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-400" />
                                    <span>양자 의식 영점(0) 도달률</span>
                                </span>
                                <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                                    {awakeningLevel}% 완성
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${awakeningLevel}%` }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 leading-tight">
                                도서 《제로 포인트》 20일 자각 수련과 100% 연동된 일일 실천 퀘스트입니다.
                            </p>
                        </div>

                        {/* Day Selector Chips */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                            {QUEST_DAYS.map((q) => {
                                const isDone = completedQuests.includes(q.day);
                                const isSelected = selectedQuestDay === q.day;
                                return (
                                    <button
                                        key={q.day}
                                        onClick={() => setSelectedQuestDay(q.day)}
                                        className={`px-3.5 py-2 rounded-2xl font-mono text-xs font-black transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-lg scale-105'
                                                : isDone
                                                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                                                : 'bg-white/[0.04] text-gray-400 border-white/[0.08] hover:bg-white/[0.08]'
                                        }`}
                                    >
                                        <span>Day {q.day}</span>
                                        {isDone && <CheckCircle2 size={13} className={isSelected ? 'text-slate-950' : 'text-emerald-400'} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Quest Card View */}
                        {(() => {
                            const current = QUEST_DAYS.find(d => d.day === selectedQuestDay) || QUEST_DAYS[0];
                            const isDone = completedQuests.includes(current.day);

                            return (
                                <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181138] via-[#110b24] to-[#090514] border border-indigo-400/30 shadow-2xl space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                            {current.element}
                                        </span>
                                        <span className="text-[11px] font-mono text-amber-300 font-bold">
                                            자각 퀘스트 {current.day} / {QUEST_DAYS.length}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-black text-white leading-snug">
                                            {current.title}
                                        </h3>
                                        <p className="text-xs text-indigo-200/80 font-medium mt-1">
                                            {current.subtitle}
                                        </p>
                                    </div>

                                    {/* Metaphor Box */}
                                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-1">
                                        <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <span>📖</span>
                                            <span>도서 《제로 포인트》 메타포</span>
                                        </p>
                                        <p className="text-xs text-gray-300 leading-relaxed font-normal">
                                            {current.metaphor}
                                        </p>
                                    </div>

                                    {/* Inquiry Box */}
                                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                                        <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Eye size={13} />
                                            <span>오늘의 자각 질문 (Self-Inquiry)</span>
                                        </p>
                                        <p className="text-xs text-indigo-100 font-bold leading-relaxed">
                                            "{current.inquiry}"
                                        </p>
                                    </div>

                                    {/* Action Practice */}
                                    <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                                        <Zap size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                                            {current.action}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex flex-col gap-2">
                                        <button
                                            onClick={() => handleCompleteQuest(current.day)}
                                            className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98 ${
                                                isDone
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-amber-500/30 hover:scale-[1.01]'
                                            }`}
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>{isDone ? '✅ 오늘의 자각 수련 완료됨' : '⚡ 오늘의 자각 퀘스트 완료하기'}</span>
                                        </button>

                                        <button
                                            onClick={() => handleConsultAI(`도서 《제로 포인트》 Day ${current.day} [${current.title}] 챕터의 자각 질문 '${current.inquiry}'에 대해 제 사주 기질과 연결하여 1:1 맞춤 자각 코칭을 진행해주세요.`)}
                                            className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-indigo-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <MessageSquare size={14} className="text-indigo-400" />
                                            <span>이 질문으로 AI 코치와 1:1 심층 대화하기 ➔</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}


                {/* ══════════════════════════════════════════════════════
                    CHAMBER 2: 0-2. 감정 연금술 (Emotional Alchemy) - 럭셔리 리디자인
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'alchemy' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        
                        {/* 🌟 Intro Banner */}
                        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1c0f2a] via-[#140b20] to-[#0d0617] border border-amber-400/30 shadow-xl space-y-1.5">
                            <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                                <Flame size={16} className="text-amber-400 animate-pulse" />
                                <span>고통의 납(Lead)을 지혜의 황금(Gold)으로 변환</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                감정은 억누르는 독이 아닙니다. 528Hz 사랑의 주파수를 통해 <strong>날것의 감정을 순수한 창조적 생명력</strong>으로 승화시킵니다.
                            </p>
                        </div>

                        {/* 🌟 4대 감정 선택 그리드 (텍스트 잘림 100% 해결된 카드 룩) */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {ALCHEMY_ELEMENTS.map((elem) => {
                                const isSelected = selectedAlchemy.id === elem.id;
                                return (
                                    <button
                                        key={elem.id}
                                        onClick={() => {
                                            setSelectedAlchemy(elem);
                                            setIsTransmuted(false);
                                        }}
                                        className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-purple-950/90 to-[#220d33] border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]'
                                                : 'bg-[#0f0b1c]/80 border-white/[0.08] hover:bg-white/[0.06] text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-2xl">{elem.icon}</span>
                                            {isSelected ? (
                                                <span className="size-2 rounded-full bg-amber-400 animate-ping" />
                                            ) : null}
                                        </div>
                                        <h4 className="text-xs font-black text-white tracking-tight">{elem.name}</h4>
                                        <p className="text-[10px] text-amber-300/80 font-mono mt-0.5">{elem.keyword}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 🌟 인터랙티브 연금술 도가니 챔버 (텍스트 깨짐 완벽 박멸 & 시각화 강화) */}
                        <div className={`p-5 rounded-3xl bg-gradient-to-b from-[#1c1236] via-[#120a24] to-[#080412] border ${selectedAlchemy.borderColor} shadow-2xl space-y-4 transition-all`}>
                            
                            {/* 챔버 상단 헤더 */}
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-10 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                                        {selectedAlchemy.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{selectedAlchemy.name} 변환기</h3>
                                        <p className="text-[10px] text-rose-300 font-mono">{selectedAlchemy.keyword}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                                    isTransmuted
                                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                                        : 'bg-white/[0.05] text-gray-400 border-white/10'
                                }`}>
                                    {isTransmuted ? '✨ 변환 완료' : '🧪 연금 대기'}
                                </span>
                            </div>

                            {/* 🌟 2단계 변환 플로우 (글자 겹침 100% 해결: 수직 스택 카드 구조) */}
                            <div className="space-y-2">
                                
                                {/* 1단계: 날것의 상태 */}
                                <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/20 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            1단계: 날것의 고통 에너지
                                        </span>
                                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                            RAW
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-200 font-bold leading-relaxed">
                                        {selectedAlchemy.rawState}
                                    </p>
                                </div>

                                {/* 중간 정화 인디케이터 */}
                                <div className="flex items-center justify-center gap-2 py-1 text-center">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-300">
                                        <Sparkles size={11} className="text-amber-400" />
                                        <span>528Hz 솔페지오 사랑의 불꽃 정화</span>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
                                </div>

                                {/* 2단계: 황금 승화 상태 (여백과 줄바꿈이 완벽하게 정리됨) */}
                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-400/40 space-y-1 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                                            <Crown size={12} className="text-amber-400 inline" />
                                            <span>2단계: 황금 승화 에너지</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/40 font-bold">
                                            GOLDEN
                                        </span>
                                    </div>
                                    <p className="text-xs text-amber-100 font-black leading-relaxed">
                                        {selectedAlchemy.transformedState}
                                    </p>
                                    <p className="text-[10px] text-amber-300/70 font-mono">
                                        {selectedAlchemy.transformedEn}
                                    </p>
                                </div>
                            </div>

                            {/* 💡 연금술 지혜 처방전 */}
                            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span>💡</span>
                                    <span>연금술 처방 (Alchemy Prescription)</span>
                                </p>
                                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                    {selectedAlchemy.cure}
                                </p>
                            </div>

                            {/* 액션 버튼 2종 */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleTransmute}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Sparkles size={16} />
                                    <span>{isTransmuted ? '✨ 연금 변환 재점화하기' : '⚡ 이 감정을 황금 에너지로 즉시 변환하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`제가 지금 겪고 있는 [${selectedAlchemy.name}]의 감정 고통을 인지행동(CBT)과 사주 기질 데이터를 결합하여 [${selectedAlchemy.transformedState}]의 지혜로 승화시키는 1:1 감정 연금술 심층 코칭을 진행해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-indigo-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-indigo-400" />
                                    <span>AI 코치와 감정 연금술 실시간 치유하기 ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* ══════════════════════════════════════════════════════
                    CHAMBER 3: 0-3. 그림자 작업 (Shadow Work Sanctuary)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'shadow' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        {/* Shadow Intro Card */}
                        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#140c26] to-[#0b0617] border border-purple-500/30 shadow-xl space-y-1.5">
                            <div className="flex items-center gap-2 text-purple-300 font-black text-xs">
                                <Moon size={16} className="text-purple-400 animate-pulse" />
                                <span>칼 융의 그림자 & 내면 아이(IFS) 자비 통합</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                내 안의 그림자는 부끄러운 악마가 아닙니다. <strong>나를 지키기 위해 어둠 속에서 외롭게 울고 있던 소중한 자아의 조각</strong>입니다.
                            </p>
                        </div>

                        {/* Shadow Archetype Selector */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {SHADOW_ARCHETYPES.map((arch) => {
                                const isSelected = selectedShadow.id === arch.id;
                                return (
                                    <button
                                        key={arch.id}
                                        onClick={() => {
                                            setSelectedShadow(arch);
                                            setIsIntegrated(false);
                                        }}
                                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] scale-[1.02]'
                                                : 'bg-[#0e0a1a] border-white/[0.08] hover:bg-white/[0.06] text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-2xl">{arch.icon}</span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/20">
                                                {arch.badge}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-black text-white">{arch.title}</h4>
                                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{arch.subtitle}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Shadow Sanctuary Card */}
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181033] via-[#100924] to-[#070412] border border-indigo-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-10 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                                        {selectedShadow.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{selectedShadow.title}</h3>
                                        <p className="text-[10px] text-purple-300 font-medium">{selectedShadow.subtitle}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                                    isIntegrated
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                                        : 'bg-white/[0.05] text-gray-400 border-white/10'
                                }`}>
                                    {isIntegrated ? '💖 통합 완료' : '🌑 탐색 중'}
                                </span>
                            </div>

                            {/* Shadow's Hidden Voice */}
                            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.08] space-y-1">
                                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span>🗣️</span>
                                    <span>그림자가 내게 숨겨온 속삭임</span>
                                </p>
                                <p className="text-xs text-gray-200 font-bold italic leading-relaxed">
                                    {selectedShadow.message}
                                </p>
                            </div>

                            {/* Hidden Gift & Talent */}
                            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1">
                                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Star size={13} />
                                    <span>어둠 뒤에 숨겨진 천재적 달란트 (Gift)</span>
                                </p>
                                <p className="text-xs text-amber-100 font-bold leading-relaxed">
                                    {selectedShadow.gift}
                                </p>
                            </div>

                            {/* Integration Method */}
                            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span>🤝</span>
                                    <span>자비 통합 처방전</span>
                                </p>
                                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                                    {selectedShadow.integration}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setIsIntegrated(true);
                                        confetti({
                                            particleCount: 70,
                                            spread: 80,
                                            origin: { y: 0.7 }
                                        });
                                    }}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Heart size={16} className="fill-current text-slate-950" />
                                    <span>{isIntegrated ? '💖 그림자와 자비의 포옹 완료' : '🤝 이 그림자 조각을 온전히 내 품에 안아주기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`내면가족체계(IFS)와 칼 융의 분석심리학에 기반하여, 제 안의 [${selectedShadow.title}] 그림자 조각과 깊은 화해와 자비로운 대화를 나눌 수 있도록 1:1 심층 코칭을 진행해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-purple-200 hover:text-white border border-white/[0.08] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-purple-400" />
                                    <span>이 그림자와 AI 코치 앞에서 1:1 대화하기 ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

// Helper Crown icon component
function Crown(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
            <path d="M5 21h14" />
        </svg>
    );
}

export default function QuantumAwakeningPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#05030a] flex items-center justify-center text-indigo-300 font-mono text-xs">
                <span>🌌 양자 의식 챔버 동기화 중...</span>
            </div>
        }>
            <QuantumAwakeningContent />
        </Suspense>
    );
}
