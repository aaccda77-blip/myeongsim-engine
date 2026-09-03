'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Sparkles, Compass, Flame, Moon, Sun, ArrowLeft, Volume2, VolumeX, 
    CheckCircle2, RefreshCw, MessageSquare, Shield, Award, Heart, 
    Zap, Eye, Droplets, Layers, ChevronRight, BookmarkCheck, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ── 1. 핵심 자각 퀘스트 20일 데이터 (도서 《제로 포인트》 100% 연동) ──
const QUEST_DAYS = [
    {
        day: 1,
        title: "스크린은 영화 뒤에 언제나 있었다",
        subtitle: "모든 생각의 소음이 피어나는 본래의 바탕",
        metaphor: "화려한 액션 영화 속 불길과 빗줄기도 하얀 스크린을 단 1mm도 적시거나 태우지 못합니다. 당신의 마음도 불안과 걱정에 단 한 번도 오염된 적이 없습니다.",
        inquiry: "지금 일어나는 슬픔과 불안을 가만히 바라보고 있는 '진짜 나'는 어디에 있는가?",
        action: "눈을 1초 감고, 생각의 내용이 아닌 '생각이 상영되는 하얀 스크린'을 느껴보세요.",
        element: "Void (공/空)",
        color: "from-indigo-500/20 to-purple-500/20 border-indigo-400/40 text-indigo-300"
    },
    {
        day: 2,
        title: "숨과 숨 사이, 그 거룩한 틈새",
        subtitle: "과거도 미래도 멈춘 0(Zero)의 좌표",
        metaphor: "숨을 완전히 내쉬고 다시 들이쉬기 직전의 0.1초. 그 완벽한 진공의 틈새에서 우주는 속삭입니다. '너는 아무것도 하지 않아도 이미 완전하다.'",
        inquiry: "숨이 오가지 않는 그 짧은 정적 속에서 나를 지탱하고 있는 것은 무엇인가?",
        action: "숨을 천천히 내쉬고, 다음 숨이 들어오기 전 1초간 고요의 틈새에 머물러 보세요.",
        element: "Air (풍/風)",
        color: "from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-300"
    },
    {
        day: 3,
        title: "붓을 쥐기 전, 하얀 도화지의 자유",
        subtitle: "어떤 색을 칠해도 본질은 변치 않는다",
        metaphor: "어떤 날은 검은색 슬픔을, 어떤 날은 붉은색 분노를 칠합니다. 하지만 당신은 칠해진 색깔이 아니라 그 색을 받아들이는 하얀 도화지 그 자체입니다.",
        inquiry: "내 마음에 칠해진 상처의 물감을 지우려 하지 않고, 도화지 자체로 돌아갈 수 있는가?",
        action: "가슴에 손을 얹고 '나는 지나가는 감정이 아니라 하얀 도화지다'라고 나직이 읊조려보세요.",
        element: "Light (명/明)",
        color: "from-amber-500/20 to-yellow-500/20 border-amber-400/40 text-amber-300"
    },
    {
        day: 4,
        title: "100미터 바다 아래의 압도적인 고요",
        subtitle: "표면의 파도에 속지 않는 심해의 평화",
        metaphor: "바다 표면에 거센 폭풍이 불어도 수심 100미터 아래 심해는 단 1밀리미터도 흔들리지 않습니다. 당신은 흔들리는 파도가 아니라 거대한 바다 전체입니다.",
        inquiry: "요동치는 일상의 걱정 아래에 언제나 흐르고 있는 깊고 투명한 평화를 느끼는가?",
        action: "주의의 무게중심을 머리에서 아랫배 심해 밑바닥으로 스르륵 내려놓으세요.",
        element: "Water (수/水)",
        color: "from-blue-500/20 to-indigo-500/20 border-blue-400/40 text-blue-300"
    },
    {
        day: 5,
        title: "어떤 무게도 기억하지 않는 0의 저울",
        subtitle: "지나간 짐을 즉시 리셋하는 완벽한 영점",
        metaphor: "저울 위에 무거운 황금이 올라왔다 내려가도, 저울은 바늘 하나 떨림 없이 0으로 돌아옵니다. 어떤 과거의 상처가 지나가도 당신의 본질은 즉시 0으로 리셋됩니다.",
        inquiry: "지나간 일의 무게를 아직도 붙잡고 있는가, 아니면 저울처럼 0으로 놓아줄 것인가?",
        action: "어깨의 긴장을 툭 풀며 '모든 것을 0(Zero)으로 리셋한다'고 선언해 보세요.",
        element: "Ether (영점/零)",
        color: "from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-300"
    }
];

// ── 2. 감정 연금술 4대 원소 변환 데이터 ──
const ALCHEMY_ELEMENTS = [
    {
        id: 'anger',
        name: '분노 & 억울함',
        icon: '🔥',
        desc: '치밀어 오르는 화와 인정받지 못한 억울함',
        rawElement: '과열된 화(火) 에너지',
        transformed: '결단력 & 혁신 추진력 (Courage)',
        cure: '분노를 억누르지 않고, 세상을 바꿀 강력한 창조적 불꽃으로 전환합니다.',
        color: 'from-rose-500/30 to-amber-500/20 border-rose-500/40 text-rose-300'
    },
    {
        id: 'anxiety',
        name: '불안 & 통제욕',
        icon: '🌊',
        desc: '미래에 대한 걱정과 끊임없는 계산 노이즈',
        rawElement: '격랑의 수(水) 에너지',
        transformed: '깊은 통찰력 & 유연한 수용 (Wisdom)',
        cure: '불안의 에너지를 멈춤의 닻으로 삼아, 직관적 지혜의 바다로 환원합니다.',
        color: 'from-blue-500/30 to-cyan-500/20 border-blue-500/40 text-blue-300'
    },
    {
        id: 'lethargy',
        name: '무기력 & 번아웃',
        icon: '🪨',
        desc: '모든 의욕이 꺼지고 방전된 상태',
        rawElement: '굳어버린 토(土) 에너지',
        transformed: '단단한 대지의 재생력 (Restoration)',
        cure: '억지로 힘내려 하지 않고, 대지 깊은 곳에서 새봄의 싹을 틔우는 충전기로 삼습니다.',
        color: 'from-amber-600/30 to-yellow-600/20 border-amber-500/40 text-amber-200'
    },
    {
        id: 'guilt',
        name: '자책감 & 수치심',
        icon: '🌪️',
        desc: '스스로를 가혹하게 검열하고 채찍질하는 마음',
        rawElement: '날카로운 금(金) 에너지',
        transformed: '스스로를 품는 위대한 자비 (Self-Compassion)',
        cure: '스스로를 향하던 칼날을 거두고, 나라는 존재를 무조건적으로 품는 MSC 자비로 승화합니다.',
        color: 'from-purple-500/30 to-pink-500/20 border-purple-500/40 text-purple-300'
    }
];

// ── 3. 그림자 작업 4대 원형 데이터 (융의 분석심리학 & IFS) ──
const SHADOW_ARCHETYPES = [
    {
        id: 'critic',
        title: '가혹한 내부 비판가',
        subtitle: '완벽하지 않으면 사랑받지 못한다는 두려움',
        message: '“너는 항상 부족해. 더 잘해야 해.”',
        gift: '탁월한 완성도와 섬세한 감각 (Perfection ➔ Mastery)',
        integration: '비판가의 마이크를 뺏고, 그 뒤에 숨은 나약한 아이를 따뜻한 포옹으로 안아줍니다.',
        badge: '수석 검열자',
        icon: '⚖️'
    },
    {
        id: 'defender',
        title: '냉소적인 방어벽',
        subtitle: '다시는 상처받지 않으려 문을 닫아건 파수꾼',
        message: '“아무도 믿지 마. 결국 다 떠나버릴 거야.”',
        gift: '독립적인 자립심과 명확한 경계선 (Defense ➔ Sanctuary)',
        integration: '“그동안 나를 지켜주느라 참 애썼어”라고 수고를 인정하고 안전한 휴식을 선물합니다.',
        badge: '철벽의 파수꾼',
        icon: '🛡️'
    },
    {
        id: 'exile',
        title: '외로운 추방자 (내면 아이)',
        subtitle: '인정받지 못해 무의식 깊은 방에 갇힌 아이',
        message: '“나를 제발 혼자 버려두지 마.”',
        gift: '순수한 창조성과 무한한 감수성 (Pain ➔ Creative Spring)',
        integration: '빛의 거실로 아이를 데려와 무조건적인 수용과 헌정 힐링송의 온기를 건넵니다.',
        badge: '순수 영혼',
        icon: '🧸'
    },
    {
        id: 'pleaser',
        title: '착한 아이 가면',
        subtitle: '남의 기분을 맞추느라 정작 내 마음을 버린 역할극',
        message: '“내가 참으면 모두가 평화로울 거야.”',
        gift: '공감 능력과 조화로운 리더십 (Sacrifice ➔ True Harmony)',
        integration: '타인의 시선을 내려놓고, 내 삶의 주권자로서 당당히 ‘NO’를 말할 권리를 되찾습니다.',
        badge: '희생의 가면',
        icon: '🎭'
    }
];

function QuantumAwakeningContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'quest';

    const [activeTab, setActiveTab] = useState<'quest' | 'alchemy' | 'shadow'>(
        initialTab === 'alchemy' ? 'alchemy' : initialTab === 'shadow' ? 'shadow' : 'quest'
    );

    // Audio frequency state (528Hz Solfeggio / 432Hz Sound)
    const [isPlayingSound, setIsPlayingSound] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);

    // Quest state
    const [selectedQuestDay, setSelectedQuestDay] = useState<number>(1);
    const [completedQuests, setCompletedQuests] = useState<number[]>([1]);
    const [awakeningLevel, setAwakeningLevel] = useState<number>(33);

    // Alchemy state
    const [selectedAlchemy, setSelectedAlchemy] = useState<any>(ALCHEMY_ELEMENTS[0]);
    const [isTransmuted, setIsTransmuted] = useState(false);

    // Shadow state
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
                gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 2);

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
        confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6']
        });
    };

    const handleConsultAI = (prompt: string) => {
        router.push(`/myeongsim-chat?intent=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#080612] max-w-md mx-auto shadow-2xl overflow-hidden font-sans pb-24 text-white">
            
            {/* Background Glows & Cosmic Nebulas */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* ── Top Header Navigation ── */}
            <header className="relative z-20 flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10 bg-[#0c091f]/80 backdrop-blur-md">
                <button
                    onClick={() => router.push('/report')}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs font-bold transition-all p-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>명심 리포트</span>
                </button>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-amber-200">
                        양자 각성 히든 룸
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        Zero Point
                    </span>
                </div>

                <button
                    onClick={toggleFrequency}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isPlayingSound 
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse' 
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/15'
                    }`}
                    title="528Hz 변환 주파수 사운드"
                >
                    {isPlayingSound ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span className="text-[10px] font-mono">{isPlayingSound ? '528Hz ON' : '528Hz'}</span>
                </button>
            </header>

            {/* ── Official Patent Authority Banner ── */}
            <div className="relative z-10 px-4 pt-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-950/80 border border-purple-400/30 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                            <Sparkles size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-amber-300 font-mono">
                                🔬 대한민국 특허출원 제10-2025-0166877호
                            </p>
                            <p className="text-[11px] text-gray-200 font-black">
                                심리·생체데이터 기반 스트레스 관리 솔루션
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
                            Lv.{Math.max(1, Math.floor(awakeningLevel / 20))} 각성
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 3대 핵심 챔버 탭 스위처 ── */}
            <div className="relative z-10 px-4 pt-3">
                <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-950/90 border border-white/10 shadow-inner text-xs">
                    <button
                        onClick={() => setActiveTab('quest')}
                        className={`py-2 rounded-xl font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                            activeTab === 'quest'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-xs">🧘 0-1. 자각 퀘스트</span>
                        <span className="text-[9px] opacity-80">108 질문</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('alchemy')}
                        className={`py-2 rounded-xl font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                            activeTab === 'alchemy'
                                ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-xs">⚗️ 0-2. 감정 연금술</span>
                        <span className="text-[9px] opacity-80">에너지 전환</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('shadow')}
                        className={`py-2 rounded-xl font-black transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                            activeTab === 'shadow'
                                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white border border-purple-400/40 shadow-md'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-xs">🌑 0-3. 그림자 작업</span>
                        <span className="text-[9px] opacity-80">내면 통합</span>
                    </button>
                </div>
            </div>

            {/* ── Main Chamber Content ── */}
            <main className="relative z-10 px-4 pt-4 space-y-4">

                {/* ══════════════════════════════════════════════════════
                    CHAMBER 1: 0-1. 핵심 자각 퀘스트 (Quantum Quest)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'quest' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Progress Bar Card */}
                        <div className="p-4 rounded-3xl bg-[#130f28] border border-indigo-500/30 shadow-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-black text-indigo-300 flex items-center gap-1">
                                    <Sparkles size={14} className="text-amber-400" />
                                    <span>양자 의식 영점(0) 도달률</span>
                                </span>
                                <span className="font-mono font-bold text-amber-300">{awakeningLevel}% 완성</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${awakeningLevel}%` }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 leading-tight">
                                도서 《제로 포인트》 20일 자각 수련과 100% 동기화된 일일 실전 퀘스트입니다.
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
                                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                                                : isDone
                                                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <span>Day {q.day}</span>
                                        {isDone && <CheckCircle2 size={12} className={isSelected ? 'text-slate-950' : 'text-emerald-400'} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Quest Card View */}
                        {(() => {
                            const current = QUEST_DAYS.find(d => d.day === selectedQuestDay) || QUEST_DAYS[0];
                            const isDone = completedQuests.includes(current.day);

                            return (
                                <div className="p-5 rounded-3xl bg-gradient-to-b from-[#181432] via-[#120f26] to-[#0d0a1c] border border-indigo-400/30 shadow-2xl space-y-4 text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                            {current.element}
                                        </span>
                                        <span className="text-[11px] font-mono text-amber-300">
                                            퀘스트 {current.day} / {QUEST_DAYS.length}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-black text-white leading-snug">
                                            {current.title}
                                        </h3>
                                        <p className="text-xs text-indigo-200/80 font-medium mt-0.5">
                                            {current.subtitle}
                                        </p>
                                    </div>

                                    {/* Metaphor Box */}
                                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                                        <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                                            📖 책 속의 거룩한 메타포
                                        </p>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            {current.metaphor}
                                        </p>
                                    </div>

                                    {/* Inquiry Box */}
                                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
                                        <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Eye size={12} />
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
                                            className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                                                isDone
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]'
                                            }`}
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>{isDone ? '✅ 자각 퀘스트 완료됨' : '⚡ 오늘의 자각 퀘스트 완료하기'}</span>
                                        </button>

                                        <button
                                            onClick={() => handleConsultAI(`도서 《제로 포인트》 Day ${current.day} [${current.title}] 챕터의 자각 질문 '${current.inquiry}'에 대해 제 사주 기질과 연결해서 심도 있는 1:1 맞춤 코칭을 해주세요.`)}
                                            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-indigo-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                    CHAMBER 2: 0-2. 감정 연금술 (Emotional Alchemy)
                   ══════════════════════════════════════════════════════ */}
                {activeTab === 'alchemy' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        {/* Alchemy Intro Card */}
                        <div className="p-4 rounded-3xl bg-[#1a0f28] border border-rose-500/30 shadow-xl space-y-2">
                            <div className="flex items-center gap-2 text-rose-300 font-black text-xs">
                                <Flame size={16} className="text-rose-400 animate-pulse" />
                                <span>고통의 납을 지혜의 황금으로 바꾸는 연금술 챔버</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                감정은 억누르는 쓰레기가 아닙니다. 4단계 연금술 프로세스를 통해 <strong>거친 감정을 순수한 창조적 생명력</strong>으로 승화시킵니다.
                            </p>
                        </div>

                        {/* Emotion Category Buttons */}
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
                                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-purple-900/60 to-rose-900/40 border-rose-400 shadow-lg shadow-rose-500/20 scale-[1.02]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xl">{elem.icon}</span>
                                            {isSelected && <Sparkles size={14} className="text-amber-300" />}
                                        </div>
                                        <h4 className="text-xs font-black text-white">{elem.name}</h4>
                                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{elem.desc}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Alchemy Crucible Card */}
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1a112e] via-[#130b22] to-[#0b0616] border border-purple-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{selectedAlchemy.icon}</span>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{selectedAlchemy.name} 연금 변환기</h3>
                                        <p className="text-[10px] text-rose-300 font-mono">{selectedAlchemy.rawElement}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                                    {isTransmuted ? '✨ 변환 완료' : '🧪 연금 대기'}
                                </span>
                            </div>

                            {/* Transformation Path */}
                            <div className="space-y-2">
                                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                                    <span className="text-gray-400 font-bold">1단계: 날것의 감정 상태</span>
                                    <span className="text-rose-300 font-bold">{selectedAlchemy.rawElement}</span>
                                </div>
                                <div className="text-center py-0.5">
                                    <span className="text-amber-400 text-xs font-bold">⬇️ 528Hz 솔페지오 사랑의 불꽃 정화</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs">
                                    <span className="text-amber-200 font-bold">2단계: 황금 승화 에너지</span>
                                    <span className="text-amber-300 font-black">{selectedAlchemy.transformed}</span>
                                </div>
                            </div>

                            {/* Philosophy Prescription */}
                            <p className="text-xs text-indigo-200/90 bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-500/30 leading-relaxed font-medium">
                                💡 <strong>연금술 처방:</strong> {selectedAlchemy.cure}
                            </p>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={handleTransmute}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 hover:from-amber-500 hover:to-purple-600 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                >
                                    <Sparkles size={16} />
                                    <span>{isTransmuted ? '✨ 연금 변환 재점화하기' : '⚡ 이 감정을 황금 에너지로 즉시 변환하기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`제가 지금 겪고 있는 [${selectedAlchemy.name}]의 고통스러운 에너지를 인지행동(CBT)과 제 사주 기질 데이터를 결합하여 [${selectedAlchemy.transformed}]의 지혜로 완전히 승화시키는 1:1 감정 연금술 코칭을 해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-rose-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <MessageSquare size={14} className="text-rose-400" />
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
                        <div className="p-4 rounded-3xl bg-[#110d22] border border-purple-500/30 shadow-xl space-y-2">
                            <div className="flex items-center gap-2 text-purple-300 font-black text-xs">
                                <Moon size={16} className="text-purple-400 animate-pulse" />
                                <span>칼 융의 그림자 & 내면 아이(IFS) 자비 통합 챔버</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-relaxed">
                                내 안에서 부끄러워 숨겨둔 그림자는 나쁜 악마가 아닙니다. <strong>나를 지키기 위해 어둠 속에서 외롭게 울고 있던 소중한 내 자아의 조각</strong>입니다.
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
                                                ? 'bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xl">{arch.icon}</span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
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
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#151028] via-[#0f0b1e] to-[#080512] border border-indigo-400/40 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{selectedShadow.icon}</span>
                                    <div>
                                        <h3 className="text-sm font-black text-white">{selectedShadow.title}</h3>
                                        <p className="text-[10px] text-purple-300">{selectedShadow.subtitle}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/30">
                                    {isIntegrated ? '💖 통합 완료' : '🌑 탐색 중'}
                                </span>
                            </div>

                            {/* Shadow's Hidden Voice */}
                            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                                    🗣️ 그림자가 내게 숨겨온 속삭임
                                </p>
                                <p className="text-xs text-gray-200 font-bold italic leading-relaxed">
                                    {selectedShadow.message}
                                </p>
                            </div>

                            {/* Hidden Gift & Talent */}
                            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1">
                                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Star size={12} />
                                    <span>어둠 뒤에 숨겨진 천재적 달란트 (Gift)</span>
                                </p>
                                <p className="text-xs text-amber-100 font-bold leading-relaxed">
                                    {selectedShadow.gift}
                                </p>
                            </div>

                            {/* Integration Method */}
                            <p className="text-xs text-indigo-200 bg-indigo-950/40 p-3.5 rounded-2xl border border-indigo-500/30 leading-relaxed font-medium">
                                🤝 <strong>자비 통합 처방:</strong> {selectedShadow.integration}
                            </p>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setIsIntegrated(true);
                                        confetti({
                                            particleCount: 60,
                                            spread: 80,
                                            origin: { y: 0.7 }
                                        });
                                    }}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                >
                                    <Heart size={16} className="fill-current text-slate-950" />
                                    <span>{isIntegrated ? '💖 그림자와 자비의 포옹 완료' : '🤝 이 그림자 조각을 온전히 내 품에 안아주기'}</span>
                                </button>

                                <button
                                    onClick={() => handleConsultAI(`내면가족체계(IFS)와 칼 융의 분석심리학에 기반하여, 제 안의 [${selectedShadow.title}] 그림자 조각과 깊은 화해와 자비로운 대화를 나눌 수 있도록 1:1 심층 코칭을 진행해주세요.`)}
                                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-purple-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

export default function QuantumAwakeningPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#080612] flex items-center justify-center text-indigo-300 font-mono text-xs">
                <span>🌌 양자 의식 챔버 동기화 중...</span>
            </div>
        }>
            <QuantumAwakeningContent />
        </Suspense>
    );
}
