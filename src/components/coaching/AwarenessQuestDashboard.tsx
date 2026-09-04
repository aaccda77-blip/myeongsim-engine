'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, X, CheckCircle2, Circle, Search, Volume2, VolumeX, 
    ArrowRight, Compass, Brain, Zap, Shield, Award, RotateCcw, 
    BookOpen, MessageSquare, Star, Filter, ChevronRight, Layers, Eye, Heart, Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AWARENESS_PHASES, ALL_AWARENESS_QUESTS, AwarenessQuestItem, AwarenessPhase } from '@/data/awarenessQuests108';
import { saju108Matrix } from '@/data/saju108Matrix';
import { useReportStore } from '@/store/useReportStore';

interface AwarenessQuestDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    onStartChatCoaching?: (prompt: string, intent?: string) => void;
    initialPhaseId?: string;
}

export default function AwarenessQuestDashboard({
    isOpen,
    onClose,
    onStartChatCoaching,
    initialPhaseId = 'all'
}: AwarenessQuestDashboardProps) {
    const { reportData } = useReportStore();
    const [activePhase, setActivePhase] = useState<string>(initialPhaseId);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [onlyCompleted, setOnlyCompleted] = useState<boolean>(false);
    const [isLargeText, setIsLargeText] = useState<boolean>(false);
    const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
    const [selectedQuest, setSelectedQuest] = useState<AwarenessQuestItem | null>(null);
    const [isPlayingBgm, setIsPlayingBgm] = useState<boolean>(false);
    const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

    // 1. 로컬스토리지에서 완료 기록 불러오기
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('myeongsim_awareness_108_completed');
                if (saved) {
                    setCompletedMap(JSON.parse(saved));
                }
                const savedLarge = localStorage.getItem('myeongsim_large_text') === 'true';
                setIsLargeText(savedLarge);
            } catch (e) {
                console.warn('Failed to load completed quests:', e);
            }
        }
    }, []);

    // 2. 완료 퀘스트 토글
    const toggleComplete = (questId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20);
        }

        const next = { ...completedMap, [questId]: !completedMap[questId] };
        setCompletedMap(next);

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('myeongsim_awareness_108_completed', JSON.stringify(next));
            } catch (err) {}
        }

        // 축하 팡파레 이펙트 (완료 체크 시)
        if (!completedMap[questId]) {
            try {
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.8 },
                    colors: ['#ec4899', '#a855f7', '#06b6d4', '#f59e0b']
                });
            } catch (err) {}
        }
    };

    // 3. 치유 음원 BGM 토글
    const toggleBgm = () => {
        if (!bgmAudioRef.current) {
            bgmAudioRef.current = new Audio('/528hz_healing_bgm.mp3');
            bgmAudioRef.current.loop = true;
            bgmAudioRef.current.volume = 0.35;
        }

        if (isPlayingBgm) {
            bgmAudioRef.current.pause();
            setIsPlayingBgm(false);
        } else {
            bgmAudioRef.current.play().catch(() => {
                bgmAudioRef.current = new Audio('/zero_point_meditation.mp3');
                bgmAudioRef.current.loop = true;
                bgmAudioRef.current.volume = 0.35;
                bgmAudioRef.current.play().catch(() => {});
            });
            setIsPlayingBgm(true);
        }
    };

    // 컴포넌트 언마운트 시 BGM 정지
    useEffect(() => {
        return () => {
            if (bgmAudioRef.current) {
                bgmAudioRef.current.pause();
                bgmAudioRef.current = null;
            }
        };
    }, []);

    // 4. 통계 계산
    const totalCount = ALL_AWARENESS_QUESTS.length; // 108
    const completedCount = useMemo(() => {
        return Object.values(completedMap).filter(Boolean).length;
    }, [completedMap]);
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    // 각성 레벨 티어
    const awarenessLevel = useMemo(() => {
        if (completedCount >= 91) return { title: '자유의지 마스터 (Cosmic Master)', tier: 'Phase 5', color: 'text-pink-400', badge: '👑 초월 완성' };
        if (completedCount >= 55) return { title: '메타 뷰 관찰자 (Meta-View Observer)', tier: 'Phase 4', color: 'text-purple-400', badge: '👁️ 관찰자 획득' };
        if (completedCount >= 37) return { title: '운명 연금술사 (Destiny Alchemist)', tier: 'Phase 3', color: 'text-amber-400', badge: '🔥 궤도 수정' };
        if (completedCount >= 19) return { title: '에너지 스캐너 (Real-Time Sensor)', tier: 'Phase 2', color: 'text-emerald-400', badge: '⚡ 에너지 분석' };
        return { title: '뉴럴 프로파일러 (Awakening Seeker)', tier: 'Phase 1', color: 'text-cyan-400', badge: '🌱 자각 시작' };
    }, [completedCount]);

    // 5. 오늘의 일진 동기화 퀘스트
    const dailyQuest = useMemo(() => {
        const today = new Date();
        const daySeed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 50 + today.getDate();
        const index = daySeed % ALL_AWARENESS_QUESTS.length;
        return ALL_AWARENESS_QUESTS[index];
    }, []);

    // 6. 필터링된 퀘스트 리스트
    const filteredQuests = useMemo(() => {
        return ALL_AWARENESS_QUESTS.filter(q => {
            if (activePhase !== 'all' && q.phaseId !== activePhase) return false;
            if (onlyCompleted && !completedMap[q.id]) return false;

            if (searchQuery.trim()) {
                const query = searchQuery.trim().toLowerCase();
                const matchTitle = q.label.toLowerCase().includes(query) || q.cleanTitle.toLowerCase().includes(query);
                const matchDesc = q.desc.toLowerCase().includes(query);
                const matchNum = String(q.num).includes(query);
                if (!matchTitle && !matchDesc && !matchNum) return false;
            }

            return true;
        });
    }, [activePhase, onlyCompleted, searchQuery, completedMap]);

    // 7. AI 코칭 시작
    const handleLaunchCoaching = (quest: AwarenessQuestItem) => {
        const matrixInfo = saju108Matrix[quest.pKey];
        const prompt = `[핵심 자각 퀘스트 ${quest.num}번: ${quest.cleanTitle}]\n- 자각 주제: ${quest.desc}\n- 뇌과학적 자각 포인트: ${matrixInfo?.desc || quest.desc}\n- 자각 질문: ${matrixInfo?.socratic || '내 무의식 속 생각 회로는 어떻게 작동하고 있는가?'}\n\n내 사주 기질과 뇌 회로 패턴에 비추어, 이 자각 퀘스트를 온전히 통과할 수 있도록 깊이 있는 1:1 명심 코칭을 진행해줘.`;

        if (onStartChatCoaching) {
            onStartChatCoaching(prompt, quest.intent);
            onClose();
        } else {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('myeongsim_pending_prompt', prompt);
                window.location.href = '/report';
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-start overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
            
            {/* 1. 최상단 플로팅 헤더 HUD */}
            <header className="w-full max-w-6xl px-4 py-3 sm:py-4 border-b border-purple-500/20 bg-slate-950/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="size-11 sm:size-12 rounded-2xl bg-gradient-to-br from-pink-500/30 via-purple-600/30 to-indigo-700/30 border border-pink-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.35)] shrink-0">
                        <span className="text-2xl sm:text-3xl animate-pulse">🧠</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className={`font-black text-white tracking-tight flex items-center gap-1.5 ${isLargeText ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
                                <span>핵심 자각 퀘스트</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono font-bold border border-pink-400/30">108 AWARENESS</span>
                            </h1>
                        </div>
                        <p className="text-[11px] sm:text-xs text-purple-200/80 font-medium">
                            무의식의 뇌 회로 패턴 및 명심 자각 퀘스트
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleBgm}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${isPlayingBgm ? 'bg-pink-500/20 border-pink-400/50 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.4)]' : 'bg-slate-900 border-slate-700 text-gray-400 hover:text-white'}`}
                        title="528Hz 뇌파 치유 음파"
                    >
                        {isPlayingBgm ? <Volume2 size={16} className="animate-bounce" /> : <VolumeX size={16} />}
                    </button>

                    <button
                        onClick={() => {
                            const next = !isLargeText;
                            setIsLargeText(next);
                            if (typeof window !== 'undefined') localStorage.setItem('myeongsim_large_text', String(next));
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isLargeText ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20' : 'bg-slate-900 border-slate-700 text-gray-300 hover:text-white'}`}
                    >
                        Aa 큰글씨
                    </button>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
            </header>

            {/* 메인 스크롤 영역 */}
            <div className="w-full max-w-6xl flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-5 pb-24">
                
                {/* 2. 상단 뇌 회로 자각 메트릭스 & KPI 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-[#120d26] to-[#1c1538] border border-pink-500/30 rounded-2xl p-4 shadow-lg shadow-purple-950/30 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                <Brain size={14} className="text-pink-400" />
                                <span>108 뇌 회로 각성도</span>
                            </span>
                            <span className="text-xs font-mono font-black text-pink-300">
                                {completedCount} / {totalCount} ({progressPercent}%)
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">현재 자각 칭호</span>
                            <span className={`font-bold ${awarenessLevel.color}`}>{awarenessLevel.title}</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0c142b] to-[#131c3a] border border-cyan-500/30 rounded-2xl p-4 shadow-lg shadow-cyan-950/30">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                <Zap size={14} className="text-cyan-400" />
                                <span>신경가소성 바이오 싱크</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                                <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
                                <span>SYNC ON</span>
                            </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1">
                            주파수 432Hz · 528Hz 세타파 활성
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                            억압된 무의식 패턴을 자유의지 신경망으로 재배선합니다.
                        </p>
                    </div>

                    <div 
                        onClick={() => setSelectedQuest(dailyQuest)}
                        className="bg-gradient-to-br from-[#241a0b] to-[#1c1208] border border-amber-400/40 rounded-2xl p-4 shadow-lg shadow-amber-950/30 cursor-pointer hover:border-amber-300 transition-all hover:scale-[1.01]"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span>오늘의 일진 동기화 퀘스트</span>
                            </span>
                            <span className="text-[10px] text-amber-400/80 font-mono">#{dailyQuest.num}</span>
                        </div>
                        <div className="text-sm font-black text-white truncate mt-1">
                            {dailyQuest.label}
                        </div>
                        <p className="text-[11px] text-amber-200/80 truncate mt-0.5">
                            {dailyQuest.desc}
                        </p>
                    </div>
                </div>

                {/* 3. 5대 페이즈 네비게이터 탭 (Phase 1 ~ 5) */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                            <Layers size={13} className="text-purple-400" />
                            <span>5-PHASE PROTOCOL SELECTOR</span>
                        </span>
                        
                        <button
                            onClick={() => setOnlyCompleted(!onlyCompleted)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-all cursor-pointer ${onlyCompleted ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-slate-900 border-slate-700 text-gray-400 hover:text-gray-200'}`}
                        >
                            <CheckCircle2 size={12} />
                            <span>자각 완료만 보기</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        <button
                            onClick={() => setActivePhase('all')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer shrink-0 ${activePhase === 'all' ? 'bg-white text-slate-950 border-white shadow-md shadow-white/20 scale-[1.02]' : 'bg-slate-900/80 text-gray-400 border-white/10 hover:text-white'}`}
                        >
                            전체 108 퀘스트 ({totalCount})
                        </button>

                        {AWARENESS_PHASES.map((phase) => {
                            const isActive = activePhase === phase.id;
                            const phaseCompleted = phase.quests.filter(q => completedMap[q.id]).length;
                            
                            return (
                                <button
                                    key={phase.id}
                                    onClick={() => setActivePhase(phase.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer shrink-0 flex items-center gap-1.5 ${isActive ? `bg-gradient-to-r ${phase.bgGradient} ${phase.textColor} ${phase.borderColor} shadow-lg scale-[1.02]` : 'bg-slate-900/80 text-gray-400 border-white/10 hover:text-white'}`}
                                >
                                    <span>{phase.label.split(':')[0]}</span>
                                    <span className="text-[10px] opacity-70">({phaseCompleted}/{phase.count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. 검색창 & 현재 선택된 페이즈 헤더 배너 */}
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                    {activePhase !== 'all' ? (() => {
                        const cur = AWARENESS_PHASES.find(p => p.id === activePhase);
                        if (!cur) return null;
                        return (
                            <div className={`flex-1 p-3 rounded-xl bg-gradient-to-r ${cur.bgGradient} border ${cur.borderColor} flex items-center justify-between`}>
                                <div>
                                    <div className={`text-xs font-black ${cur.textColor}`}>
                                        {cur.label}
                                    </div>
                                    <div className="text-[11px] text-gray-300 mt-0.5">
                                        {cur.desc} · <span className="font-mono text-white/90">{cur.frequency}</span>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cur.badgeBg}`}>
                                    {cur.stateName}
                                </span>
                            </div>
                        );
                    })() : (
                        <div className="flex-1 p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 text-xs text-gray-300 flex items-center gap-2">
                            <Sparkles size={14} className="text-pink-400" />
                            <span>108개 무의식 회로 전면 스캔 · 원하는 퀘스트를 선택해 자각을 시작하세요.</span>
                        </div>
                    )}

                    <div className="relative w-full sm:w-64 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="퀘스트 번호, 제목 검색..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-all font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* 5. 108 퀘스트 인터랙티브 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <AnimatePresence>
                        {filteredQuests.map((quest) => {
                            const isDone = Boolean(completedMap[quest.id]);
                            const matrixInfo = saju108Matrix[quest.pKey];
                            const curPhase = AWARENESS_PHASES.find(p => p.id === quest.phaseId);

                            return (
                                <motion.div
                                    key={quest.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => setSelectedQuest(quest)}
                                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                        isDone 
                                            ? 'bg-[#150f29]/90 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]' 
                                            : 'bg-slate-900/70 border-white/10 hover:border-purple-500/40 hover:bg-slate-900/95 hover:shadow-lg'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${curPhase?.badgeBg || 'bg-white/10 text-gray-300'}`}>
                                                    #{String(quest.num).padStart(2, '0')}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {quest.phaseLabel.split(':')[0]}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => toggleComplete(quest.id, e)}
                                                className={`size-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                                    isDone 
                                                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40 scale-110' 
                                                        : 'bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10'
                                                }`}
                                                title={isDone ? '자각 완료 취소' : '자각 완료 체크'}
                                            >
                                                {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                            </button>
                                        </div>

                                        <h3 className={`font-black text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5 ${isLargeText ? 'text-base sm:text-lg' : 'text-sm'}`}>
                                            <span className="text-base">{quest.icon}</span>
                                            <span className="truncate">{quest.cleanTitle}</span>
                                        </h3>

                                        <p className={`text-gray-400 line-clamp-2 mt-1.5 leading-relaxed ${isLargeText ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                                            {quest.desc}
                                        </p>
                                    </div>

                                    <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                                        <span className="text-gray-500 font-mono text-[10px]">
                                            {quest.frequency}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLaunchCoaching(quest);
                                                }}
                                                className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-bold flex items-center gap-1 transition-all cursor-pointer"
                                            >
                                                <MessageSquare size={11} />
                                                <span>AI 코칭</span>
                                            </button>

                                            <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">
                                                <ChevronRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredQuests.length === 0 && (
                    <div className="py-16 text-center text-gray-500">
                        <Search size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">검색 조건에 맞는 퀘스트가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 6. 퀘스트 심층 자각 모달 */}
            <AnimatePresence>
                {selectedQuest && (() => {
                    const matrixInfo = saju108Matrix[selectedQuest.pKey];
                    const isDone = Boolean(completedMap[selectedQuest.id]);
                    const curPhase = AWARENESS_PHASES.find(p => p.id === selectedQuest.phaseId);

                    return (
                        <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-2xl bg-[#0e0a1f] border-2 border-pink-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(236,72,153,0.3)] max-h-[90vh] overflow-y-auto relative font-sans"
                            >
                                <button
                                    onClick={() => setSelectedQuest(null)}
                                    className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
                                >
                                    <X size={18} />
                                </button>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-lg ${curPhase?.badgeBg || 'bg-pink-500/20 text-pink-300'}`}>
                                        QUEST #{selectedQuest.num}
                                    </span>
                                    <span className="text-xs text-gray-400 font-bold">
                                        {selectedQuest.phaseLabel}
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                                    <span>{selectedQuest.icon}</span>
                                    <span>{selectedQuest.cleanTitle}</span>
                                </h2>

                                <p className="text-sm text-pink-300 font-medium mt-1">
                                    {selectedQuest.desc}
                                </p>

                                <div className="mt-5 p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                                    <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                        <Brain size={14} className="text-pink-400" />
                                        <span>무의식 뇌 회로 패턴 분석</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed break-keep">
                                        {matrixInfo?.desc || selectedQuest.desc}
                                    </p>
                                </div>

                                <div className="mt-3.5 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                        <Compass size={14} className="text-purple-400" />
                                        <span>소크라테스식 본질 자각 질문 (Inquiry)</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed italic break-keep">
                                        "{matrixInfo?.socratic || '지금 일어나는 생각과 감정을 고요히 지켜보고 있는 진짜 나는 어디에 있는가?'}"
                                    </p>
                                </div>

                                <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 to-indigo-950/40 border border-pink-400/30 space-y-1.5">
                                    <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-pink-400" />
                                        <span>메타 인지 선언문 (Meta Awareness)</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white font-bold leading-relaxed break-keep">
                                        "{matrixInfo?.recursive || '지나가는 생각과 감정의 파도에 속지 않고, 고요한 본래의 바탕으로 깨어있음을 자각합니다.'}"
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                                    <button
                                        onClick={() => toggleComplete(selectedQuest.id)}
                                        className={`flex-1 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            isDone 
                                                ? 'bg-white/10 text-pink-300 border border-pink-500/40' 
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:scale-[1.02]'
                                        }`}
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>{isDone ? '✅ 자각 완료됨 (취소하려면 클릭)' : '🌟 자각 완료 체크하기'}</span>
                                    </button>

                                    <button
                                        onClick={() => handleLaunchCoaching(selectedQuest)}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                                    >
                                        <MessageSquare size={16} />
                                        <span>💬 1:1 AI 명심 심층 코칭 시작</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>

        </div>
    );
}
