'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, Zap, Target, BookMarked, Award, CheckCircle2, XCircle, 
    ChevronRight, ChevronLeft, RotateCcw, Sparkles, Volume2, 
    Flame, ArrowRight, Check, Share2, HelpCircle, Lock, X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
    MEMORY_CARDS_DB, 
    MemoryCard, 
    UserGameProgress, 
    INITIAL_GAME_PROGRESS,
    PracticeStep 
} from '@/data/MyeongsimMemoryGameDB';
import { passAcademyExam, getAcademyState } from '@/lib/questUnlockManager';
import { ACADEMY_COURSES, ACADEMY_EXAMS } from '@/data/MyeongsimAcademyDB';

interface MyeongsimMemoryGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialExamQuizId?: string;
}

// 🌐 4개 국어 UI 사전
const GAME_I18N = {
    kr: {
        modalTitle: "명심 자각 기억 훈련소",
        modalSubtitle: "뇌과학 3단계 기억법(단기·중기·장기)으로 체화하는 실습 게임",
        tabShort: "⚡ 3초 스냅 플래시 (단기)",
        tabMid: "🎯 패턴 브레이커 (중기)",
        tabLong: "🥋 5-STEP 자각 도장 (장기)",
        tabDeck: "🏆 마스터리 도감",
        levelLabel: "Lv.",
        levelTitle: ["자각의 입문자", "렌즈의 관찰자", "패턴 브레이커", "감정 연금술사", "제로포인트 마스터"],
        expLabel: "자각 EXP",
        streakLabel: "일 연속 달성",
        cardFlipHint: "💡 카드를 클릭하면 통찰 해설이 뒤집힙니다!",
        btnKnown: "✨ 마스터했어요 (+20 EXP)",
        btnReview: "🔄 다시 볼래요 (+5 EXP)",
        quizTitle: "상황 시나리오 퀴즈",
        quizNext: "다음 퀘스트 도전 ➔",
        practiceTitle: "POINT → LINE → LENS 5단계 실전 워크시트",
        practiceIntro: "내 머릿속 소설에서 빠져나와 1초 만에 영점(Zero Point)으로 복귀하는 5단계",
        stepNext: "다음 단계로 ➔",
        stepPrev: "이전 단계",
        stepFinish: "🎉 5단계 자각 훈련 완료 & 리포트 발급",
        practiceReset: "새로운 고민으로 다시 훈련하기",
        deckTitle: "내가 수집한 골든 앵커 카드",
        deckSubtitle: "에빙하우스 망각곡선에 따라 일상에서 실시간으로 떠올릴 내면의 방패",
        masteredBadge: "완전 체화",
        learningBadge: "훈련 중",
        closeBtn: "닫기",
        loadExampleBtn: "💡 예시 답변 채우기",
        congratsLevelUp: "축하합니다! 의식 레벨이 올랐습니다! 🎊",
        audioNotice: "사운드 효과 켜짐"
    },
    en: {
        modalTitle: "Zero Point Memory Dojo",
        modalSubtitle: "Gamified 3-Stage Neuro-Memory Training (Short, Mid, Long-Term)",
        tabShort: "⚡ 3-Sec Flash (Short)",
        tabMid: "🎯 Pattern Breaker (Mid)",
        tabLong: "🥋 5-STEP Practice (Long)",
        tabDeck: "🏆 Mastery Deck",
        levelLabel: "Lv.",
        levelTitle: ["Awareness Novice", "Lens Observer", "Pattern Breaker", "Emotional Alchemist", "Zero Point Master"],
        expLabel: "Awareness EXP",
        streakLabel: "Day Streak",
        cardFlipHint: "💡 Click card to flip for core insights!",
        btnKnown: "✨ Mastered (+20 EXP)",
        btnReview: "🔄 Review Later (+5 EXP)",
        quizTitle: "Real-Life Scenario Quiz",
        quizNext: "Next Quest ➔",
        practiceTitle: "POINT → LINE → LENS 5-Step Worksheet",
        practiceIntro: "5 steps to escape cognitive drama and recalibrate to Zero Point in seconds.",
        stepNext: "Next Step ➔",
        stepPrev: "Previous",
        stepFinish: "🎉 Complete Training & Issue Report",
        practiceReset: "Start New Practice",
        deckTitle: "My Golden Anchor Collection",
        deckSubtitle: "Your inner cognitive shields anchored against the forgetting curve.",
        masteredBadge: "Mastered",
        learningBadge: "Training",
        closeBtn: "Close",
        loadExampleBtn: "💡 Load Example Answer",
        congratsLevelUp: "Level Up! Consciousness Expanded! 🎊",
        audioNotice: "Audio Enabled"
    },
    jp: {
        modalTitle: "明心 自覚記憶トレーニング道場",
        modalSubtitle: "脳科学3段階記憶法(短期・中期・長期)で体得する実践ゲーム",
        tabShort: "⚡ 3秒フラッシュ (短期)",
        tabMid: "🎯 パターンブレイカー (中期)",
        tabLong: "🥋 5-STEP 自覚道場 (長期)",
        tabDeck: "🏆 マスター図鑑",
        levelLabel: "Lv.",
        levelTitle: ["自覚の初心者", "レンズの観察者", "パターンブレイカー", "感情の錬金術師", "ゼロポイントマスター"],
        expLabel: "自覚EXP",
        streakLabel: "日連続達成",
        cardFlipHint: "💡 カードをクリックすると解説が裏返ります！",
        btnKnown: "✨ 覚えました (+20 EXP)",
        btnReview: "🔄 もう一度 (+5 EXP)",
        quizTitle: "状況シナリオクイズ",
        quizNext: "次のクエストへ ➔",
        practiceTitle: "POINT → LINE → LENS 5段階実践ワークシート",
        practiceIntro: "脳内ドラマから脱出し、一瞬でゼロポイントへ立ち返る5段階",
        stepNext: "次のステップ ➔",
        stepPrev: "前のステップ",
        stepFinish: "🎉 5段階完了＆処方箋発行",
        practiceReset: "新しい悩みで再訓練",
        deckTitle: "獲得したゴールデンアンカー図鑑",
        deckSubtitle: "忘却曲線に抗い、日常で即座に発動する心の盾",
        masteredBadge: "完全体得",
        learningBadge: "訓練中",
        closeBtn: "閉じる",
        loadExampleBtn: "💡 模範例を入力",
        congratsLevelUp: "レベルアップ！意識が拡張しました！ 🎊",
        audioNotice: "サウンド効果ON"
    },
    cn: {
        modalTitle: "明心自知记忆演练所",
        modalSubtitle: "基于脑科学三阶段记忆法（短期·中期·长期）的游戏化心智实操",
        tabShort: "⚡ 3秒闪记卡 (短期)",
        tabMid: "🎯 模式粉碎者 (中期)",
        tabLong: "🥋 5步自知工坊 (长期)",
        tabDeck: "🏆 掌握图鉴",
        levelLabel: "Lv.",
        levelTitle: ["自知入门者", "滤镜观察者", "模式粉碎者", "情绪炼金师", "零点宗师"],
        expLabel: "觉察EXP",
        streakLabel: "天连续打卡",
        cardFlipHint: "💡 点击卡片翻转查看深层洞见！",
        btnKnown: "✨ 已熟练掌握 (+20 EXP)",
        btnReview: "🔄 稍后复习 (+5 EXP)",
        quizTitle: "现实情境测验",
        quizNext: "进入下一关 ➔",
        practiceTitle: "POINT → LINE → LENS 5步实战工坊",
        practiceIntro: "跳脱思想剧场、瞬间校准回归零点的5个关键步骤",
        stepNext: "下一步 ➔",
        stepPrev: "上一步",
        stepFinish: "🎉 完成5步觉察并生成报告",
        practiceReset: "载入新困惑再次演练",
        deckTitle: "已解锁的黄金心锚图鉴",
        deckSubtitle: "对抗艾宾浩斯遗忘曲线、日常生活中即时唤醒的心灵之盾",
        masteredBadge: "完全掌握",
        learningBadge: "演练中",
        closeBtn: "关闭",
        loadExampleBtn: "💡 一键填入范例答案",
        congratsLevelUp: "升级啦！心智意识进一步拓展！ 🎊",
        audioNotice: "音效已开启"
    }
};

export default function MyeongsimMemoryGameModal({
    isOpen,
    onClose
}: MyeongsimMemoryGameModalProps) {
    const { language } = useLanguage();
    const t = GAME_I18N[language as keyof typeof GAME_I18N] || GAME_I18N.kr;
    const langKey = (language as 'kr' | 'en' | 'jp' | 'cn') || 'kr';

    // ── 1. 탭 상태 (short, mid, long, deck) ──
    const [activeTab, setActiveTab] = useState<'short' | 'mid' | 'long' | 'deck'>('short');

    // ── 2. 게임 진행 상황 (로컬 스토리지 연동) ──
    const [progress, setProgress] = useState<UserGameProgress>(INITIAL_GAME_PROGRESS);
    const [comboCount, setComboCount] = useState<number>(0);

    // ── 3. 단기 플래시카드 상태 ──
    const [flashIndex, setFlashIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    // ── 4. 중기 퀴즈 상태 ──
    const [quizCardIndex, setQuizCardIndex] = useState<number>(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

    // ── 5. 장기 5-STEP 실습 상태 ──
    const [practiceStepIndex, setPracticeStepIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<{ [step: number]: string }>({});
    const [isPracticeComplete, setIsPracticeComplete] = useState<boolean>(false);
    // [NEW] 평생교육원 공인 자격 승급 알림
    const [unlockedNotice, setUnlockedNotice] = useState<{ level: number; skills: string[] } | null>(null);

    // ── 6. 사운드 효과 (Web Audio API) ──
    const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.15) => {
        try {
            if (typeof window === 'undefined') return;
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio policy mute fallback
        }
    };

    const playSuccessChime = () => {
        playTone(528, 'triangle', 0.18);
        setTimeout(() => playTone(660, 'sine', 0.25), 100);
    };

    const playLevelUpFanfare = () => {
        [440, 554, 659, 880].forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 'triangle', 0.3), idx * 120);
        });
    };

    // 로컬 스토리지 불러오기
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('myeongsim_memory_game_progress');
            if (saved) {
                try {
                    setProgress(JSON.parse(saved));
                } catch (e) {
                    setProgress(INITIAL_GAME_PROGRESS);
                }
            }
        }
    }, []);

    // EXP 증가 및 레벨업 함수
    const addExp = (amount: number, cardId?: string) => {
        setProgress(prev => {
            const newExp = prev.exp + amount;
            const newLevel = Math.min(5, Math.floor(newExp / 100) + 1);
            const isLevelUp = newLevel > prev.level;
            
            const newMastered = cardId && !prev.masteredCardIds.includes(cardId)
                ? [...prev.masteredCardIds, cardId]
                : prev.masteredCardIds;

            const updated: UserGameProgress = {
                ...prev,
                exp: newExp,
                level: newLevel,
                masteredCardIds: newMastered,
                todayCompletedCount: prev.todayCompletedCount + 1,
                lastPlayedDate: new Date().toISOString().split('T')[0]
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_memory_game_progress', JSON.stringify(updated));
            }

            if (isLevelUp) {
                playLevelUpFanfare();
            } else {
                playSuccessChime();
            }

            return updated;
        });
    };

    const currentFlashCard = MEMORY_CARDS_DB[flashIndex % MEMORY_CARDS_DB.length];
    const quizCards = useMemo(() => MEMORY_CARDS_DB.filter(c => c.quiz), []);
    const currentQuizCard = quizCards[quizCardIndex % quizCards.length];
    const practiceCard = MEMORY_CARDS_DB.find(c => c.id === 'card_02') || MEMORY_CARDS_DB[1];
    const steps = practiceCard.practiceSteps || [];

    // 단기 플래시 카드 다음으로
    const handleFlashNext = (mastered: boolean) => {
        if (mastered) {
            setComboCount(prev => prev + 1);
            addExp(20, currentFlashCard.id);
        } else {
            setComboCount(0);
            addExp(5);
        }
        setIsFlipped(false);
        setFlashIndex(prev => (prev + 1) % MEMORY_CARDS_DB.length);
    };

    // 퀴즈 옵션 선택
    const handleSelectOption = (optId: string) => {
        if (isAnswerSubmitted) return;
        setSelectedOptionId(optId);
        setIsAnswerSubmitted(true);

        const currentOpt = currentQuizCard.quiz?.options.find(o => o.id === optId);
        if (currentOpt?.isCorrect) {
            setComboCount(prev => prev + 1);
            addExp(30, currentQuizCard.id);

            // [NEW] 🏛️ 평생교육원 공인 자격 승급 시험 자동 연동 (레벨업 & 스킬 해금)
            const targetExamLevel = Math.min(5, Math.floor(quizCardIndex / 2) + 1);
            const examId = `quiz_lvl${targetExamLevel}`;
            const examResult = passAcademyExam(examId, targetExamLevel);
            if (examResult.leveledUp) {
                setUnlockedNotice({
                    level: examResult.newLevel,
                    skills: examResult.newlyUnlockedSkills
                });
            }
        } else {
            setComboCount(0);
            playTone(220, 'sawtooth', 0.2);
        }
    };

    const handleQuizNext = () => {
        setSelectedOptionId(null);
        setIsAnswerSubmitted(false);
        setQuizCardIndex(prev => (prev + 1) % quizCards.length);
    };

    // 5-STEP 실습 단계 이동
    const handleStepAnswerChange = (val: string) => {
        setUserAnswers(prev => ({ ...prev, [practiceStepIndex]: val }));
    };

    const handleLoadExample = () => {
        const curr = steps[practiceStepIndex];
        if (curr) {
            setUserAnswers(prev => ({
                ...prev,
                [practiceStepIndex]: curr.exampleAnswer[langKey] || curr.exampleAnswer.kr
            }));
        }
    };

    const handleNextStep = () => {
        if (practiceStepIndex < steps.length - 1) {
            playTone(480, 'sine', 0.1);
            setPracticeStepIndex(prev => prev + 1);
        } else {
            // 5단계 완료
            setIsPracticeComplete(true);
            addExp(50, 'card_02');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-gradient-to-b from-[#101428] via-[#0d1020] to-[#070913] border-2 border-cyan-400/40 rounded-3xl shadow-[0_20px_70px_rgba(6,182,212,0.25)] flex flex-col max-h-[92vh] overflow-hidden text-left"
            >
                {/* ── 1. 상단 바: 타이틀 & 레벨 & EXP ── */}
                <div className="relative z-10 px-5 py-4 border-b border-white/10 bg-[#141a33]/90 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                            <Brain size={22} className="animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm sm:text-base font-black text-white">
                                    {t.modalTitle}
                                </h2>
                                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                                    <Flame size={11} className="text-amber-400 fill-amber-400" />
                                    <span>{progress.streakDays}{t.streakLabel}</span>
                                </span>
                            </div>
                            <p className="text-[11px] text-cyan-300/80 line-clamp-1">
                                {t.modalSubtitle}
                            </p>
                        </div>
                    </div>

                    {/* 우측 닫기 & 콤보 */}
                    <div className="flex items-center gap-3">
                        {comboCount > 1 && (
                            <motion.div 
                                initial={{ scale: 0.7 }} 
                                animate={{ scale: [1, 1.15, 1] }} 
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1"
                            >
                                <Zap size={12} className="fill-slate-950" />
                                <span>COMBO x{comboCount}</span>
                            </motion.div>
                        )}
                        <button
                            onClick={onClose}
                            className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* ── 2. 의식 레벨 & EXP 진행 바 ── */}
                <div className="px-5 py-2.5 bg-[#0a0d1a] border-b border-white/5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-cyan-300 font-mono">
                            {t.levelLabel}{progress.level}
                        </span>
                        <span className="text-xs font-bold text-white">
                            {t.levelTitle[progress.level - 1] || t.levelTitle[0]}
                        </span>
                    </div>

                    {/* EXP 바 */}
                    <div className="flex-1 max-w-xs flex items-center gap-2">
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
                                style={{ width: `${(progress.exp % 100)}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">
                            {progress.exp % 100}/100 EXP
                        </span>
                    </div>
                </div>

                {/* ── 3. 4대 모드 탭 ── */}
                <div className="px-3 pt-2 bg-[#0d1022] border-b border-white/10 flex items-center gap-1 overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setActiveTab('short')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            activeTab === 'short'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Zap size={14} />
                        <span>{t.tabShort}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('mid')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            activeTab === 'mid'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Target size={14} />
                        <span>{t.tabMid}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('long')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            activeTab === 'long'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Brain size={14} />
                        <span>{t.tabLong}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('deck')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            activeTab === 'deck'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Award size={14} />
                        <span>{t.tabDeck} ({progress.masteredCardIds.length}/{MEMORY_CARDS_DB.length})</span>
                    </button>
                </div>

                {/* ── 4. 탭별 컨텐츠 바디 ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {/* [탭 1: ⚡ 3초 스냅 플래시 카드] */}
                    {activeTab === 'short' && (
                        <div className="max-w-md mx-auto space-y-5">
                            <p className="text-center text-[11px] text-cyan-200/70 font-mono">
                                {t.cardFlipHint} ({flashIndex + 1} / {MEMORY_CARDS_DB.length})
                            </p>

                            {/* 회전 플래시 카드 */}
                            <div 
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="cursor-pointer perspective-1000 group select-none"
                            >
                                <motion.div
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    className="relative w-full min-h-[260px] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between border-2 transition-all bg-gradient-to-br from-[#161f38] via-[#10172c] to-[#0a0f1d] border-cyan-400/40 group-hover:border-cyan-300/70"
                                >
                                    {!isFlipped ? (
                                        /* 🎴 카드 앞면: 핵심 키워드 & 3초 인지 */
                                        <div className="space-y-4 text-center my-auto">
                                            <div className="size-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-cyan-500/20">
                                                {currentFlashCard.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/20">
                                                    {currentFlashCard.subCode}
                                                </span>
                                                <h3 className="text-lg sm:text-xl font-black text-white pt-1">
                                                    {currentFlashCard.keyword[langKey] || currentFlashCard.keyword.kr}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xs mx-auto">
                                                {currentFlashCard.oneLiner[langKey] || currentFlashCard.oneLiner.kr}
                                            </p>
                                        </div>
                                    ) : (
                                        /* 🎴 카드 뒷면: 뇌과학 심층 원리 해설 */
                                        <div 
                                            style={{ transform: 'rotateY(180deg)' }} 
                                            className="space-y-4 text-left my-auto bg-black/40 p-5 rounded-2xl border border-amber-400/30"
                                        >
                                            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                                                <Sparkles size={16} />
                                                <span>ZERO-POINT 뇌과학 핵심 원리</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                                                {currentFlashCard.coreInsight[langKey] || currentFlashCard.coreInsight.kr}
                                            </p>
                                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                                                <span>카테고리: {currentFlashCard.category}</span>
                                                <span className="text-cyan-300">클릭하여 다시 덮기</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 하단 플립 힌트 바 */}
                                    <div className="text-center pt-2">
                                        <span className="text-[10px] font-mono text-gray-400">
                                            {isFlipped ? '🔄 탭하여 앞면 보기' : '👆 탭하여 해설 확인'}
                                        </span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* 액션 버튼 2종 */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => handleFlashNext(false)}
                                    className="py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                    <RotateCcw size={14} />
                                    <span>{t.btnReview}</span>
                                </button>

                                <button
                                    onClick={() => handleFlashNext(true)}
                                    className="py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-98"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>{t.btnKnown}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* [탭 2: 🎯 패턴 브레이커 퀴즈 (중기 기억)] */}
                    {activeTab === 'mid' && currentQuizCard.quiz && (
                        <div className="max-w-lg mx-auto space-y-5">
                            {/* 상황 시나리오 카드 */}
                            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#1a1c33] to-[#121424] border border-amber-400/40 shadow-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                                        {t.quizTitle} ({quizCardIndex + 1}/{quizCards.length})
                                    </span>
                                    <span className="text-xs font-mono text-gray-400">
                                        {currentQuizCard.subCode}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-white leading-relaxed font-medium bg-black/30 p-3.5 rounded-2xl border border-white/5">
                                    {currentQuizCard.quiz.scenario[langKey] || currentQuizCard.quiz.scenario.kr}
                                </p>
                                <h4 className="text-xs sm:text-sm font-black text-amber-200">
                                    Q. {currentQuizCard.quiz.question[langKey] || currentQuizCard.quiz.question.kr}
                                </h4>
                            </div>

                            {/* 객관식 선택지들 */}
                            <div className="space-y-2.5">
                                {currentQuizCard.quiz.options.map((opt, oIdx) => {
                                    const isSelected = selectedOptionId === opt.id;
                                    let btnStyle = "bg-[#111628] border-white/10 text-gray-200 hover:border-white/30";
                                    if (isAnswerSubmitted) {
                                        if (opt.isCorrect) {
                                            btnStyle = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-md";
                                        } else if (isSelected && !opt.isCorrect) {
                                            btnStyle = "bg-rose-950/60 border-rose-400 text-rose-200";
                                        }
                                    }

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelectOption(opt.id)}
                                            disabled={isAnswerSubmitted}
                                            className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                                        >
                                            <span className="size-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                                                {oIdx + 1}
                                            </span>
                                            <div className="space-y-1 flex-1">
                                                <p className="leading-snug">{opt.text[langKey] || opt.text.kr}</p>
                                                {isAnswerSubmitted && (isSelected || opt.isCorrect) && (
                                                    <p className={`text-xs font-bold pt-1 ${opt.isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                        {opt.feedback[langKey] || opt.feedback.kr}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 다음 퀴즈 버튼 */}
                            {isAnswerSubmitted && (
                                <button
                                    onClick={handleQuizNext}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-98 animate-fade-in"
                                >
                                    <span>{t.quizNext}</span>
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* [탭 3: 🥋 5-STEP 실전 자각 도장 (POINT → LINE → LENS)] */}
                    {activeTab === 'long' && (
                        <div className="max-w-lg mx-auto space-y-4">
                            {!isPracticeComplete ? (
                                <div className="space-y-4">
                                    {/* 상단 5단계 진행 도트 */}
                                    <div className="flex items-center justify-between px-2">
                                        {steps.map((st, sIdx) => {
                                            const isActive = sIdx === practiceStepIndex;
                                            const isDone = sIdx < practiceStepIndex;
                                            return (
                                                <div key={st.stepCode} className="flex items-center gap-1.5">
                                                    <div className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                                                        isActive 
                                                            ? 'bg-purple-500 border-purple-300 text-white ring-2 ring-purple-400/40'
                                                            : isDone
                                                                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                                                                : 'bg-white/5 border-white/10 text-gray-500'
                                                    }`}>
                                                        {isDone ? '✓' : sIdx + 1}
                                                    </div>
                                                    <span className={`text-[10px] font-mono hidden sm:inline ${isActive ? 'text-purple-300 font-bold' : 'text-gray-500'}`}>
                                                        {st.stepCode}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 현재 스텝 카드 */}
                                    <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1a142e] to-[#0f0c1c] border border-purple-500/40 shadow-xl space-y-3.5 text-left">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                                                {steps[practiceStepIndex]?.title[langKey] || steps[practiceStepIndex]?.title.kr}
                                            </span>
                                            <button
                                                onClick={handleLoadExample}
                                                className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer"
                                            >
                                                {t.loadExampleBtn}
                                            </button>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-200 font-bold leading-relaxed">
                                            {steps[practiceStepIndex]?.prompt[langKey] || steps[practiceStepIndex]?.prompt.kr}
                                        </p>

                                        {/* 입력 textarea */}
                                        <textarea
                                            value={userAnswers[practiceStepIndex] || ''}
                                            onChange={(e) => handleStepAnswerChange(e.target.value)}
                                            placeholder={steps[practiceStepIndex]?.placeholder[langKey] || steps[practiceStepIndex]?.placeholder.kr}
                                            rows={3}
                                            className="w-full p-3.5 rounded-2xl bg-[#090712] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 resize-none font-medium leading-relaxed"
                                        />
                                    </div>

                                    {/* 하단 스텝 이동 버튼 */}
                                    <div className="flex items-center justify-between gap-3 pt-1">
                                        <button
                                            onClick={() => setPracticeStepIndex(prev => Math.max(0, prev - 1))}
                                            disabled={practiceStepIndex === 0}
                                            className="px-4 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs font-bold disabled:opacity-30 cursor-pointer"
                                        >
                                            {t.stepPrev}
                                        </button>

                                        <button
                                            onClick={handleNextStep}
                                            disabled={!userAnswers[practiceStepIndex]?.trim()}
                                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-98"
                                        >
                                            <span>{practiceStepIndex === steps.length - 1 ? t.stepFinish : t.stepNext}</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* 5단계 완료 리포트 화면 */
                                <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1236] to-[#0f0a1f] border-2 border-purple-400/50 text-center space-y-4 animate-fade-in shadow-2xl">
                                    <div className="size-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-3xl mx-auto text-purple-300">
                                        🎉
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base sm:text-lg font-black text-white">
                                            5단계 자각 퀘스트 클리어!
                                        </h3>
                                        <p className="text-xs text-purple-200">
                                            사건(POINT)에서 소설(LINE)을 떼어내고 온전한 영점으로 돌아왔습니다.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2 text-xs">
                                        <p><strong className="text-cyan-300">• POINT (사실):</strong> {userAnswers[0]}</p>
                                        <p><strong className="text-rose-300">• LINE (소설):</strong> {userAnswers[1]}</p>
                                        <p><strong className="text-amber-300">• GAP (반증):</strong> {userAnswers[3]}</p>
                                        <p><strong className="text-emerald-300">• TODAY (행동):</strong> {userAnswers[4]}</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsPracticeComplete(false);
                                            setPracticeStepIndex(0);
                                            setUserAnswers({});
                                        }}
                                        className="w-full py-3 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 text-xs font-bold border border-purple-400/30 cursor-pointer"
                                    >
                                        {t.practiceReset}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* [탭 4: 🏆 마스터리 도감 (기억 보관함)] */}
                    {activeTab === 'deck' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-black text-white">{t.deckTitle}</h3>
                                    <p className="text-[11px] text-gray-400">{t.deckSubtitle}</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-400/30">
                                    {progress.masteredCardIds.length} / {MEMORY_CARDS_DB.length} 완료
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {MEMORY_CARDS_DB.map((c) => {
                                    const isMastered = progress.masteredCardIds.includes(c.id);
                                    return (
                                        <div
                                            key={c.id}
                                            className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${
                                                isMastered
                                                    ? 'bg-[#101b2a] border-emerald-400/40 shadow-sm'
                                                    : 'bg-[#0e1220] border-white/10 opacity-70'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{c.icon}</span>
                                                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                                                        {c.subCode}
                                                    </span>
                                                </div>
                                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                                    isMastered
                                                        ? 'bg-emerald-400/15 border-emerald-400/40 text-emerald-300'
                                                        : 'bg-white/5 border-white/10 text-gray-500'
                                                }`}>
                                                    {isMastered ? t.masteredBadge : t.learningBadge}
                                                </span>
                                            </div>

                                            <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                                                {c.keyword[langKey] || c.keyword.kr}
                                            </h4>
                                            <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed font-medium">
                                                {c.oneLiner[langKey] || c.oneLiner.kr}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── 5. 하단 닫기 바 ── */}
                <div className="px-5 py-3 border-t border-white/10 bg-[#0d1020] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-500 font-mono">
                        🧠 Ebbinghaus Spaced Repetition Protocol Applied
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold transition-all cursor-pointer"
                    >
                        {t.closeBtn}
                    </button>
                </div>

                {/* [NEW] 🏛️ 평생교육원 공인 자격 승급 & 스킬 해금 축하 팝업 */}
                {unlockedNotice && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-full max-w-sm bg-slate-950 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl text-center space-y-4 relative overflow-hidden">
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl mx-auto text-slate-950 shadow-xl shadow-amber-400/40 animate-bounce">
                                🏆
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                    공인 자격 승급 성공!
                                </span>
                                <h3 className="text-lg font-black text-white mt-1">
                                    {ACADEMY_COURSES.find(c => c.levelNumber === unlockedNotice.level)?.title.kr || `Level ${unlockedNotice.level} 자격`}
                                </h3>
                                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                    축하합니다! 시험을 통과하여 평생교육원 <strong className="text-amber-300">{ACADEMY_COURSES.find(c => c.levelNumber === unlockedNotice.level)?.badge}</strong> 자격을 취득하셨습니다.
                                </p>
                                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-left font-bold">
                                    ✨ 드릴메뉴의 새로운 고급 코칭 도구들이 즉시 잠금 해제되었습니다!
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setUnlockedNotice(null)}
                                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-400/30 cursor-pointer"
                            >
                                <span>멋져요! 계속 훈련하기</span>
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
