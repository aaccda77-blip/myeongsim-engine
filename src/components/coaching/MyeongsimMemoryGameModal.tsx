'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Brain, Zap, Target, Award, CheckCircle2, XCircle, 
    ChevronRight, ChevronLeft, RotateCcw, Sparkles, Volume2, 
    Flame, ArrowRight, Check, Share2, HelpCircle, Lock, X,
    Heart, Scissors, Activity, Pill, ShieldAlert, Sparkle, RefreshCw, Gamepad2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
    MEMORY_CARDS_DB, 
    MemoryCard, 
    UserGameProgress, 
    INITIAL_GAME_PROGRESS,
    PracticeStep,
    getCardCapsuleTheme,
    getCardSmasherData
} from '@/data/MyeongsimMemoryGameDB';
import { passAcademyExam, getAcademyState } from '@/lib/questUnlockManager';
import { ACADEMY_COURSES, ACADEMY_EXAMS } from '@/data/MyeongsimAcademyDB';
import MyeongsimGalagaGame from './MyeongsimGalagaGame';

interface MyeongsimMemoryGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialExamQuizId?: string;
}

// 🌐 4개 국어 UI 사전 (의료법 준수: 멘탈 피트니스 및 마음 자각 게임 메타포)
const GAME_I18N = {
    kr: {
        modalTitle: "명심 멘탈 피트니스 훈련소",
        modalSubtitle: "뇌과학 3단계 기억법으로 마주하는 마음 0점 리셋 자각 훈련",
        medicalDisclaimer: "본 시스템은 의료법상 질병의 치료를 위한 의약품이나 의료기기가 아니며, 인지과학 원리를 게임화한 '멘탈 피트니스 및 자기자각 코칭' 솔루션입니다.",
        tabCapsule: "✨ 3초 자각",
        tabSmasher: "⚔️ 패턴 슬라이서",
        tabGalaga: "👾 갤러그 잡념격퇴",
        tabPractice: "🧬 5-STEP 도장",
        tabCabinet: "🗄️ 마음 서재",
        levelLabel: "Lv.",
        levelTitle: ["자각의 입문자", "렌즈의 관찰자", "패턴 브레이커", "감정 연금술사", "제로포인트 마스터"],
        expLabel: "자각 EXP",
        streakLabel: "일 연속 실천",
        capsuleHoldGuide: "가슴에 손을 얹고 3초간 꾹 눌러 숨을 고르세요",
        capsuleInhaling: "숨을 천천히 들이쉬며 자각을 모읍니다... (1s)",
        capsuleHolding: "숨을 멈추고 내면의 공간을 관찰합니다... (2s)",
        capsuleExhaling: "후- 내쉬며 왜곡된 생각을 비워냅니다! (3s)",
        capsuleDissolvedTitle: "자각 훈련 완료! 마음 0점 리셋",
        amygdalaCoolDown: "편도체 진정도",
        prefrontalActive: "전두엽 메타인지 활성도",
        btnNextCapsule: "다음 자각 루틴 시작 ➔",
        btnSaveToCabinet: "✨ 완전 체화 & 도감 저장 (+20 EXP)",
        btnReviewCapsule: "🔄 다시 음미하기 (+5 EXP)",
        smasherTitle: "왜곡된 인지 사슬 싹둑 분쇄기",
        smasherSubtitle: "사건(Point)과 망상(Line)과 왜곡(Lens)을 1초 만에 분리 절단하세요",
        smasherSliceBtn: "✂️ 왜곡의 사슬 싹둑 자르기!",
        smasherShatterNotice: "💥 왜곡된 렌즈가 산산조각 나며 순수 사실로 정화되었습니다!",
        smasherFactHeader: "✨ 정화된 순수 사실 (Pure Fact)",
        practiceTitle: "5-STEP 실전 자각 워크시트",
        practiceIntro: "내 머릿속 소설에서 빠져나와 1초 만에 영점(Zero Point)으로 복귀하는 5단계",
        stepNext: "다음 단계로 ➔",
        stepPrev: "이전 단계",
        stepFinish: "🎉 5단계 완료 & 멘탈 피트니스 완주증 발급",
        practiceReset: "새로운 고민으로 다시 훈련하기",
        cabinetTitle: "내 디지털 마음 서재 (자각 도감)",
        cabinetSubtitle: "에빙하우스 망각곡선에 맞서 일상에서 실시간으로 떠올릴 내면의 방패",
        masteredBadge: "완전 체화",
        learningBadge: "훈련 중",
        closeBtn: "닫기",
        loadExampleBtn: "💡 뇌과학 예시 답변 채우기",
        congratsLevelUp: "축하합니다! 의식 레벨이 올랐습니다! 🎊",
        certificateTitle: "명심 멘탈 피트니스 공인 완주 증명서",
        certificateSubtitle: "본 학습자는 POINT-LINE-LENS 인지 해체 프로토콜을 성실히 이수하여 마인드 0점 리셋 역량을 입증하였습니다."
    },
    en: {
        modalTitle: "Mind Fitness Dojo & Awareness Routine",
        modalSubtitle: "Reset your mind to Zero Point with 3-Stage Neuro-Habit Training",
        medicalDisclaimer: "This service is a mental fitness & self-coaching tool, not a medical drug or medical device.",
        tabCapsule: "✨ 3-Sec Focus",
        tabSmasher: "⚔️ Pattern Smasher",
        tabGalaga: "👾 Galaga Buster",
        tabPractice: "🧬 5-STEP Dojo",
        tabCabinet: "🗄️ Mind Library",
        levelLabel: "Lv.",
        levelTitle: ["Awareness Novice", "Lens Observer", "Pattern Breaker", "Emotional Alchemist", "Zero Point Master"],
        expLabel: "Awareness EXP",
        streakLabel: "Day Streak",
        capsuleHoldGuide: "Place hand on chest and press & hold for 3s to breathe",
        capsuleInhaling: "Inhale deeply, gathering raw awareness... (1s)",
        capsuleHolding: "Hold breath, observing the inner space... (2s)",
        capsuleExhaling: "Exhale gently, clearing distorted thoughts! (3s)",
        capsuleDissolvedTitle: "Capsule Dissolved! Reset to Zero Point",
        amygdalaCoolDown: "Amygdala Cool-down",
        prefrontalActive: "Prefrontal Meta-Cognition",
        btnNextCapsule: "Take Next Capsule ➔",
        btnSaveToCabinet: "✨ Mastered & Save (+20 EXP)",
        btnReviewCapsule: "🔄 Review Later (+5 EXP)",
        smasherTitle: "Cognitive Chain Smasher",
        smasherSubtitle: "Slice the drama line between Point and Lens in seconds",
        smasherSliceBtn: "✂️ Slice the Distorted Chain!",
        smasherShatterNotice: "💥 Distorted lens shattered into crystal clarity!",
        smasherFactHeader: "✨ Purified Reality (Pure Fact)",
        practiceTitle: "5-STEP Real-Life Awareness Worksheet",
        practiceIntro: "5 steps to escape cognitive drama and recalibrate to Zero Point in seconds.",
        stepNext: "Next Step ➔",
        stepPrev: "Previous",
        stepFinish: "🎉 Complete & Issue Certificate",
        practiceReset: "Start New Practice",
        cabinetTitle: "My Digital Vitamin Cabinet",
        cabinetSubtitle: "Your inner cognitive shields anchored against the forgetting curve.",
        masteredBadge: "Mastered",
        learningBadge: "Training",
        closeBtn: "Close",
        loadExampleBtn: "💡 Load Example Answer",
        congratsLevelUp: "Level Up! Consciousness Expanded! 🎊",
        certificateTitle: "Mind Fitness Completion Certificate",
        certificateSubtitle: "Successfully accomplished the POINT-LINE-LENS cognitive deconstruction protocol."
    },
    jp: {
        modalTitle: "明心 メンタルフィットネス訓練所",
        modalSubtitle: "脳科学3段階記憶法で飲むマインドゼロポイントデジタルカプセル",
        medicalDisclaimer: "本サービスは医療機器や医薬品ではなく、認知科学に基づくメンタルフィットネス・コーチングゲームです。",
        tabCapsule: "✨ 3秒自覚",
        tabSmasher: "⚔️ パターンスライサー",
        tabGalaga: "👾 ギャラガ雑念撃退",
        tabPractice: "🧬 5-STEP 道場",
        tabCabinet: "🗄️ 心の書斎",
        levelLabel: "Lv.",
        levelTitle: ["自覚の初心者", "レンズの観察者", "パターンブレイカー", "感情の錬金術師", "ゼロポイントマスター"],
        expLabel: "自覚EXP",
        streakLabel: "日連続実践",
        capsuleHoldGuide: "胸に手を当てて3秒間長押しし、呼吸を整えてください",
        capsuleInhaling: "深く息を吸い込み、意識を集中させます... (1秒)",
        capsuleHolding: "息を止め、内なる空間を静かに見つめます... (2秒)",
        capsuleExhaling: "ふーっと吐き出し、歪んだ思考を空っぽにします！ (3秒)",
        capsuleDissolvedTitle: "自覚訓練完了！ゼロポイントへ帰還",
        amygdalaCoolDown: "扁桃体クールダウン",
        prefrontalActive: "前頭葉メタ認知活性度",
        btnNextCapsule: "次の自覚ルーティン ➔",
        btnSaveToCabinet: "✨ 完全体得＆保存 (+20 EXP)",
        btnReviewCapsule: "🔄 もう一度 (+5 EXP)",
        smasherTitle: "認知の歪み連鎖スライサー",
        smasherSubtitle: "出来事(点)と妄想(線)とレンズを1秒で切り離します",
        smasherSliceBtn: "✂️ 歪みの鎖を一刀両断！",
        smasherShatterNotice: "💥 歪んだレンズが砕け散り、純粋な事実へと浄化されました！",
        smasherFactHeader: "✨ 浄化された純粋な事実",
        practiceTitle: "5-STEP 実践ワークシート",
        practiceIntro: "脳内ドラマから脱出し、一瞬でゼロポイントへ立ち返る5段階",
        stepNext: "次のステップ ➔",
        stepPrev: "前のステップ",
        stepFinish: "🎉 5段階完了＆修了証発行",
        practiceReset: "新しい悩みで再訓練",
        cabinetTitle: "デジタル心の書斎 (自覚図鑑)",
        cabinetSubtitle: "忘却曲線に抗い、日常で即座に発動する心の盾",
        masteredBadge: "完全体得",
        learningBadge: "訓練中",
        closeBtn: "閉じる",
        loadExampleBtn: "💡 模範例を入力",
        congratsLevelUp: "レベルアップ！意識が拡張しました！ 🎊",
        certificateTitle: "メンタルフィットネス修了証明書",
        certificateSubtitle: "POINT-LINE-LENS認知解体プロトコルを修了し、ゼロリセット能力を証明します。"
    },
    cn: {
        modalTitle: "明心心智健身训练所",
        modalSubtitle: "基于脑科学三阶段记忆法的心理归零觉察工坊",
        medicalDisclaimer: "本系统并非用于医疗诊疗的药品或器械，属于基于认知科学的心智健身与自我觉察教练游戏。",
        tabCapsule: "✨ 3秒觉察",
        tabSmasher: "⚔️ 模式粉碎机",
        tabGalaga: "👾 大蜜蜂消消乐",
        tabPractice: "🧬 5步工坊",
        tabCabinet: "🗄️ 心智书斋",
        levelLabel: "Lv.",
        levelTitle: ["自知入门者", "滤镜观察者", "模式粉碎者", "情绪炼金师", "零点宗师"],
        expLabel: "觉察EXP",
        streakLabel: "天连续打卡",
        capsuleHoldGuide: "手抚胸口长按3秒，跟随指引调整呼吸",
        capsuleInhaling: "缓慢深吸气，汇聚纯净觉知... (1秒)",
        capsuleHolding: "屏住呼吸，静观内在空间... (2秒)",
        capsuleExhaling: "长呼一口气，彻底清空执念！ (3秒)",
        capsuleDissolvedTitle: "胶囊服用完毕！心智瞬间归零",
        amygdalaCoolDown: "杏仁核快速降温",
        prefrontalActive: "前额叶元认知激活度",
        btnNextCapsule: "服用下一粒胶囊 ➔",
        btnSaveToCabinet: "✨ 完全掌握并入柜 (+20 EXP)",
        btnReviewCapsule: "🔄 稍后复习 (+5 EXP)",
        smasherTitle: "认知扭曲锁链粉碎机",
        smasherSubtitle: "1秒斩断事件(点)、脑补(线)与歪曲滤镜(面)",
        smasherSliceBtn: "✂️ 瞬间斩断扭曲锁链！",
        smasherShatterNotice: "💥 歪曲滤镜应声碎裂，还原纯净现实！",
        smasherFactHeader: "✨ 净化后的纯净事实",
        practiceTitle: "5步实战觉察工坊",
        practiceIntro: "跳脱思想剧场、瞬间校准回归零点的5个关键步骤",
        stepNext: "下一步 ➔",
        stepPrev: "上一步",
        stepFinish: "🎉 完成5步觉察并生成证书",
        practiceReset: "载入新困惑再次演练",
        cabinetTitle: "我的数字心灵药箱 (图鉴)",
        cabinetSubtitle: "对抗艾宾浩斯遗忘曲线、日常生活中即时唤醒的心灵之盾",
        masteredBadge: "完全掌握",
        learningBadge: "演练中",
        closeBtn: "关闭",
        loadExampleBtn: "💡 一键填入范例答案",
        congratsLevelUp: "升级啦！心智意识进一步拓展！ 🎊",
        certificateTitle: "心智健身结业证明书",
        certificateSubtitle: "圆满完成POINT-LINE-LENS认知解构，具备瞬间心理归零能力。"
    }
};

export default function MyeongsimMemoryGameModal({
    isOpen,
    onClose
}: MyeongsimMemoryGameModalProps) {
    const { language } = useLanguage();
    const t = GAME_I18N[language as keyof typeof GAME_I18N] || GAME_I18N.kr;
    const langKey = (language as 'kr' | 'en' | 'jp' | 'cn') || 'kr';

    // ── 1. 5대 탭 상태 (capsule, smasher, galaga, practice, cabinet) ──
    const [activeTab, setActiveTab] = useState<'capsule' | 'smasher' | 'galaga' | 'practice' | 'cabinet'>('capsule');

    // ── 2. 게임 진행 상황 ──
    const [progress, setProgress] = useState<UserGameProgress>(INITIAL_GAME_PROGRESS);
    const [comboCount, setComboCount] = useState<number>(0);

    // ── 3. [모드 1] 3초 바이오 캡슐 상태 ──
    const [capsuleIndex, setCapsuleIndex] = useState<number>(0);
    const [isHolding, setIsHolding] = useState<boolean>(false);
    const [holdProgress, setHoldProgress] = useState<number>(0);
    const [isCapsuleDissolved, setIsCapsuleDissolved] = useState<boolean>(false);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ── 4. [모드 2] ⚔️ 패턴 슬라이서 상태 ──
    const [smasherIndex, setSmasherIndex] = useState<number>(0);
    const [isSliced, setIsSliced] = useState<boolean>(false);
    const [isShattered, setIsShattered] = useState<boolean>(false);

    // ── 5. [모드 4] 🧬 5-STEP 실전 자각 도장 상태 ──
    const [practiceStepIndex, setPracticeStepIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<{ [step: number]: string }>({});
    const [isPracticeComplete, setIsPracticeComplete] = useState<boolean>(false);

    // [NEW] 자격 승급 알림
    const [unlockedNotice, setUnlockedNotice] = useState<{ level: number; skills: string[] } | null>(null);

    // ── 6. 🔊 Web Audio API 사운드 신디사이저 ──
    const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.15, gainVal: number = 0.12) => {
        try {
            if (typeof window === 'undefined') return;
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    };

    const playCapsulePop = () => {
        playTone(320, 'sine', 0.08, 0.2);
        setTimeout(() => playTone(528, 'triangle', 0.45, 0.15), 60);
        setTimeout(() => playTone(660, 'sine', 0.5, 0.12), 120);
        setTimeout(() => playTone(792, 'sine', 0.6, 0.1), 180);
    };

    const playSliceSound = () => {
        playTone(900, 'sawtooth', 0.07, 0.18);
        setTimeout(() => playTone(450, 'triangle', 0.12, 0.15), 40);
    };

    const playShatterSound = () => {
        [880, 1100, 1320, 1760, 2200].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.25, 0.1 - i * 0.015), i * 35);
        });
    };

    const playLevelUpFanfare = () => {
        [440, 554, 659, 880, 1108].forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 'triangle', 0.35, 0.15), idx * 100);
        });
    };

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
            }

            return updated;
        });
    };

    const currentCard = MEMORY_CARDS_DB[capsuleIndex % MEMORY_CARDS_DB.length];
    const capsuleTheme = getCardCapsuleTheme(currentCard);

    const currentSmasherCard = MEMORY_CARDS_DB[smasherIndex % MEMORY_CARDS_DB.length];
    const smasherData = getCardSmasherData(currentSmasherCard);

    const practiceCard = MEMORY_CARDS_DB.find(c => c.id === 'card_02') || MEMORY_CARDS_DB[1];
    const steps = practiceCard.practiceSteps || [];

    // 3초 캡슐 홀드
    const startHold = () => {
        if (isCapsuleDissolved) return;
        setIsHolding(true);
        const startTime = Date.now();
        const duration = 2400;

        holdTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / duration) * 100);
            setHoldProgress(pct);

            if (pct >= 100) {
                if (holdTimerRef.current) clearInterval(holdTimerRef.current);
                setIsHolding(false);
                setIsCapsuleDissolved(true);
                playCapsulePop();
                addExp(20, currentCard.id);
                setComboCount(prev => prev + 1);
            }
        }, 30);
    };

    const cancelHold = () => {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setIsHolding(false);
        setHoldProgress(0);
    };

    const handleNextCapsule = () => {
        setIsCapsuleDissolved(false);
        setHoldProgress(0);
        setCapsuleIndex(prev => (prev + 1) % MEMORY_CARDS_DB.length);
    };

    // 패턴 슬라이서
    const handleSliceAction = () => {
        if (isSliced) return;
        playSliceSound();
        setIsSliced(true);

        setTimeout(() => {
            playShatterSound();
            setIsShattered(true);
            addExp(25, currentSmasherCard.id);
            setComboCount(prev => prev + 1);

            const targetExamLevel = Math.min(5, Math.floor(smasherIndex / 2) + 1);
            const examId = `quiz_lvl${targetExamLevel}`;
            const examResult = passAcademyExam(examId, targetExamLevel);
            if (examResult.leveledUp) {
                setUnlockedNotice({ level: examResult.newLevel, skills: examResult.newlyUnlockedSkills });
            }
        }, 400);
    };

    const handleNextSmasher = () => {
        setIsSliced(false);
        setIsShattered(false);
        setSmasherIndex(prev => (prev + 1) % MEMORY_CARDS_DB.length);
    };

    // 5-STEP 실습
    const handleStepAnswerChange = (text: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [practiceStepIndex]: text
        }));
    };

    const handleLoadExample = () => {
        const currentStep = steps[practiceStepIndex];
        if (currentStep) {
            handleStepAnswerChange(currentStep.exampleAnswer[langKey] || currentStep.exampleAnswer.kr);
            playTone(660, 'triangle', 0.1);
        }
    };

    const handlePracticeNext = () => {
        if (practiceStepIndex < steps.length - 1) {
            setPracticeStepIndex(prev => prev + 1);
            playTone(550, 'sine', 0.1);
        } else {
            setIsPracticeComplete(true);
            addExp(50, practiceCard.id);
            playLevelUpFanfare();
        }
    };

    const handlePracticeReset = () => {
        setPracticeStepIndex(0);
        setUserAnswers({});
        setIsPracticeComplete(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto select-none">
            {/* ── 메인 모달 프레임 ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="relative w-full max-w-2xl bg-gradient-to-b from-[#11162d] via-[#0c1021] to-[#070914] border-2 border-cyan-400/40 rounded-3xl shadow-[0_20px_80px_rgba(6,182,212,0.28)] flex flex-col max-h-[92vh] overflow-hidden text-left"
            >
                {/* ── 1. 상단 헤더: 타이틀 & 뇌파 펄스 & 닫기 ── */}
                <div className="relative z-10 px-5 pt-4 pb-3.5 border-b border-white/10 bg-[#151b36]/95 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
                            <Activity size={22} className="animate-pulse text-cyan-200" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                                    {t.modalTitle}
                                </h2>
                                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                                    <Flame size={11} className="text-amber-400 fill-amber-400" />
                                    <span>{progress.streakDays}{t.streakLabel}</span>
                                </span>
                            </div>
                            <p className="text-[11px] text-cyan-300/85 line-clamp-1">
                                {t.modalSubtitle}
                            </p>
                        </div>
                    </div>

                    {/* 우측 닫기 & 콤보 */}
                    <div className="flex items-center gap-2.5">
                        {comboCount > 1 && (
                            <motion.div 
                                initial={{ scale: 0.8 }} 
                                animate={{ scale: [1, 1.12, 1] }} 
                                transition={{ repeat: Infinity, duration: 0.9 }}
                                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1"
                            >
                                <Zap size={11} className="fill-slate-950" />
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
                <div className="px-5 py-2 bg-[#090c19] border-b border-white/5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-cyan-300 font-mono">
                            {t.levelLabel}{progress.level}
                        </span>
                        <span className="text-xs font-bold text-white">
                            {t.levelTitle[progress.level - 1] || t.levelTitle[0]}
                        </span>
                    </div>

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

                {/* ── 3. 5대 아케이드 탭 (반응형 칩 바) ── */}
                <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#0e1226] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
                    <button
                        onClick={() => setActiveTab('capsule')}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                            activeTab === 'capsule'
                                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                                : 'text-gray-400 hover:text-white bg-white/5'
                        }`}
                    >
                        <Sparkles size={13} className="text-cyan-400" />
                        <span>{t.tabCapsule}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('smasher')}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                            activeTab === 'smasher'
                                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                : 'text-gray-400 hover:text-white bg-white/5'
                        }`}
                    >
                        <Scissors size={13} className="text-amber-400" />
                        <span>{t.tabSmasher}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('galaga')}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                            activeTab === 'galaga'
                                ? 'bg-rose-500/25 text-rose-300 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                                : 'text-gray-400 hover:text-white bg-white/5'
                        }`}
                    >
                        <Gamepad2 size={13} className="text-rose-400" />
                        <span>{t.tabGalaga}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                            activeTab === 'practice'
                                ? 'bg-purple-500/25 text-purple-300 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                                : 'text-gray-400 hover:text-white bg-white/5'
                        }`}
                    >
                        <Brain size={13} className="text-purple-400" />
                        <span>{t.tabPractice}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('cabinet')}
                        className={`py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                            activeTab === 'cabinet'
                                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                                : 'text-gray-400 hover:text-white bg-white/5'
                        }`}
                    >
                        <Award size={13} className="text-emerald-400" />
                        <span>{t.tabCabinet}</span>
                    </button>
                </div>

                {/* ── 4. 탭별 컨텐츠 바디 ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    
                    {/* [모드 1: 💊 3초 마인드 캡슐] */}
                    {activeTab === 'capsule' && (
                        <div className="max-w-md mx-auto space-y-5 text-center">
                            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                                <span>No. {capsuleIndex + 1} / {MEMORY_CARDS_DB.length}</span>
                                <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                                    {capsuleTheme.vitaminName[langKey] || capsuleTheme.vitaminName.kr}
                                </span>
                            </div>

                            <div className="relative py-4 select-none">
                                <AnimatePresence mode="wait">
                                    {!isCapsuleDissolved ? (
                                        <motion.div
                                            key="capsule-active"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.05, opacity: 0 }}
                                            onMouseDown={startHold}
                                            onMouseUp={cancelHold}
                                            onMouseLeave={cancelHold}
                                            onTouchStart={startHold}
                                            onTouchEnd={cancelHold}
                                            className="cursor-pointer group flex flex-col items-center"
                                        >
                                            <div className="relative size-44 sm:size-48 rounded-full flex items-center justify-center bg-gradient-to-b from-white/5 to-white/0 border border-white/10 shadow-2xl">
                                                <svg className="absolute inset-0 size-full -rotate-90">
                                                    <circle
                                                        cx="50%"
                                                        cy="50%"
                                                        r="45%"
                                                        className="stroke-white/10 fill-none"
                                                        strokeWidth="6"
                                                    />
                                                    <circle
                                                        cx="50%"
                                                        cy="50%"
                                                        r="45%"
                                                        className="stroke-cyan-400 fill-none transition-all duration-75"
                                                        strokeWidth="6"
                                                        strokeDasharray="280"
                                                        strokeDashoffset={280 - (280 * holdProgress) / 100}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>

                                                <motion.div 
                                                    animate={{ 
                                                        scale: isHolding ? [1, 1.08, 1] : [1, 1.02, 1],
                                                        rotate: isHolding ? [0, 2, -2, 0] : 0
                                                    }}
                                                    transition={{ repeat: Infinity, duration: isHolding ? 0.6 : 3 }}
                                                    className={`w-20 h-28 rounded-full bg-gradient-to-b ${capsuleTheme.gradient} shadow-[0_0_35px_${capsuleTheme.glowColor}] flex flex-col items-center justify-between p-2 border-2 border-white/60 relative overflow-hidden`}
                                                >
                                                    <div className="w-12 h-5 rounded-full bg-white/40 blur-[1px]" />
                                                    <span className="text-2xl drop-shadow-md">
                                                        {currentCard.icon}
                                                    </span>
                                                    <span className="text-[9px] font-mono font-black text-slate-950 uppercase tracking-tighter">
                                                        ZERO-PT
                                                    </span>
                                                </motion.div>
                                            </div>

                                            <div className="mt-4 space-y-1">
                                                <p className="text-xs sm:text-sm font-black text-white">
                                                    {isHolding ? (
                                                        holdProgress < 33 
                                                            ? t.capsuleInhaling 
                                                            : holdProgress < 66 
                                                                ? t.capsuleHolding 
                                                                : t.capsuleExhaling
                                                    ) : (
                                                        `👆 ${t.capsuleHoldGuide}`
                                                    )}
                                                </p>
                                                <p className="text-[11px] text-cyan-300/70">
                                                    타깃: {capsuleTheme.symptomTarget[langKey] || capsuleTheme.symptomTarget.kr}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="capsule-dissolved"
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#18203c] via-[#10162a] to-[#0a0f1e] border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.3)] space-y-4 text-left"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5">
                                                    <Sparkles size={14} className="text-amber-400" />
                                                    <span>{t.capsuleDissolvedTitle}</span>
                                                </span>
                                                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                    528Hz Solfeggio Tuned
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 py-1">
                                                <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                                                    {currentCard.subCode}
                                                </span>
                                                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                                                    {currentCard.keyword[langKey] || currentCard.keyword.kr}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium bg-black/40 p-3.5 rounded-2xl border border-white/5">
                                                    {currentCard.coreInsight[langKey] || currentCard.coreInsight.kr}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-black/30 border border-white/5 text-xs">
                                                <div>
                                                    <div className="flex justify-between text-[11px] font-bold text-rose-300">
                                                        <span>{t.amygdalaCoolDown}</span>
                                                        <span className="font-mono">88% ➔ {100 - capsuleTheme.coolDownScore}% ❄️</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${100 - capsuleTheme.coolDownScore}%` }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[11px] font-bold text-emerald-300">
                                                        <span>{t.prefrontalActive}</span>
                                                        <span className="font-mono">{capsuleTheme.coolDownScore}% 💡</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${capsuleTheme.coolDownScore}%` }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-cyan-200/80 italic font-mono bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-400/20">
                                                {capsuleTheme.funSideEffect[langKey] || capsuleTheme.funSideEffect.kr}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setIsCapsuleDissolved(false);
                                                        setHoldProgress(0);
                                                    }}
                                                    className="py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                                                >
                                                    <RotateCcw size={14} />
                                                    <span>{t.btnReviewCapsule}</span>
                                                </button>

                                                <button
                                                    onClick={handleNextCapsule}
                                                    className="py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 cursor-pointer active:scale-98 transition-all"
                                                >
                                                    <span>{t.btnNextCapsule}</span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* [모드 2: ⚔️ 패턴 슬라이서 미니게임] */}
                    {activeTab === 'smasher' && (
                        <div className="max-w-lg mx-auto space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/15 px-3 py-0.5 rounded-full border border-amber-400/30">
                                    {t.smasherTitle} ({smasherIndex + 1}/{MEMORY_CARDS_DB.length})
                                </span>
                                <span className="text-[11px] font-mono text-gray-400">
                                    {currentSmasherCard.subCode}
                                </span>
                            </div>

                            <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#191e36] via-[#121526] to-[#0a0d1a] border border-amber-400/40 shadow-xl overflow-hidden space-y-4">
                                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 flex items-center gap-3">
                                    <span className="size-7 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                                        POINT
                                    </span>
                                    <p className="text-xs sm:text-sm font-bold text-cyan-100">
                                        {smasherData.pointText[langKey] || smasherData.pointText.kr}
                                    </p>
                                </div>

                                <div className="relative my-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/40 text-center">
                                    {!isSliced ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-2 text-rose-300 text-xs font-black">
                                                <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                                                <span>{smasherData.lineText[langKey] || smasherData.lineText.kr}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-300">
                                                사건을 왜곡된 소설로 엮어버린 자동반응의 사슬입니다!
                                            </p>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={handleSliceAction}
                                                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
                                            >
                                                <Scissors size={18} className="animate-bounce" />
                                                <span>{t.smasherSliceBtn}</span>
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <motion.div 
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="space-y-2 py-1"
                                        >
                                            <div className="text-xs font-black text-emerald-300 flex items-center justify-center gap-2">
                                                <CheckCircle2 size={16} />
                                                <span>{t.smasherShatterNotice}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 transition-all">
                                    {!isShattered ? (
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <span className="size-7 rounded-xl bg-white/10 text-gray-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                                                LENS
                                            </span>
                                            <p className="text-xs sm:text-sm font-medium line-through decoration-rose-500 decoration-2 text-gray-400">
                                                {smasherData.lensText[langKey] || smasherData.lensText.kr}
                                            </p>
                                        </div>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center gap-2 text-emerald-300 text-xs font-black">
                                                <Sparkle size={16} className="text-emerald-400" />
                                                <span>{t.smasherFactHeader}</span>
                                            </div>
                                            <p className="text-xs sm:text-sm font-bold text-white bg-emerald-950/40 p-3 rounded-xl border border-emerald-400/30 leading-relaxed">
                                                {smasherData.cleanFactText[langKey] || smasherData.cleanFactText.kr}
                                            </p>
                                            <p className="text-[11px] text-cyan-300 font-mono">
                                                💡 사건(Point)은 그대로 두되, 머릿속 소설(Line)을 0으로 완전히 리셋했습니다!
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {isShattered && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleNextSmasher}
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-98 transition-all"
                                    >
                                        <span>다음 왜곡 사슬 분쇄 도전 ➔</span>
                                        <ChevronRight size={16} />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* [모드 3: 👾 갤러그 잡념격퇴 아케이드 (NEW!)] */}
                    {activeTab === 'galaga' && (
                        <div className="max-w-lg mx-auto py-1">
                            <MyeongsimGalagaGame
                                language={langKey}
                                onExpEarned={(amt) => addExp(amt)}
                                onExamClear={(lvl) => {
                                    setUnlockedNotice({ level: lvl, skills: ['Galaga Master'] });
                                }}
                            />
                        </div>
                    )}

                    {/* [모드 4: 🧬 5-STEP 실전 자각 도장] */}
                    {activeTab === 'practice' && (
                        <div className="max-w-lg mx-auto space-y-4">
                            {!isPracticeComplete ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        {steps.map((st, sIdx) => {
                                            const isActive = sIdx === practiceStepIndex;
                                            const isDone = sIdx < practiceStepIndex;
                                            return (
                                                <div key={st.stepCode} className="flex items-center gap-1.5">
                                                    <div className={`size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                                                        isActive 
                                                            ? 'bg-purple-500 border-purple-300 text-white ring-2 ring-purple-400/40 shadow-lg'
                                                            : isDone
                                                                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                                                                : 'bg-white/5 border-white/20 text-gray-500'
                                                    }`}>
                                                        {isDone ? '✓' : sIdx + 1}
                                                    </div>
                                                    <span className={`text-[10px] hidden sm:inline font-mono ${isActive ? 'text-purple-300 font-bold' : 'text-gray-500'}`}>
                                                        {st.stepCode}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {steps[practiceStepIndex] && (
                                        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1a1733] to-[#120f26] border border-purple-400/40 shadow-xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-400/15 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                                                    STEP {practiceStepIndex + 1}: {steps[practiceStepIndex].stepCode}
                                                </span>
                                                <button
                                                    onClick={handleLoadExample}
                                                    className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20"
                                                >
                                                    <Sparkles size={12} />
                                                    <span>{t.loadExampleBtn}</span>
                                                </button>
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="text-sm sm:text-base font-black text-white">
                                                    {steps[practiceStepIndex].title[langKey] || steps[practiceStepIndex].title.kr}
                                                </h4>
                                                <p className="text-xs text-purple-200/80 leading-relaxed">
                                                    {steps[practiceStepIndex].prompt[langKey] || steps[practiceStepIndex].prompt.kr}
                                                </p>
                                            </div>

                                            <textarea
                                                rows={3}
                                                value={userAnswers[practiceStepIndex] || ''}
                                                onChange={(e) => handleStepAnswerChange(e.target.value)}
                                                placeholder={steps[practiceStepIndex].placeholder[langKey] || steps[practiceStepIndex].placeholder.kr}
                                                className="w-full p-3.5 rounded-2xl bg-black/40 border border-purple-400/30 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all resize-none"
                                            />

                                            <div className="flex items-center justify-between gap-3 pt-2">
                                                <button
                                                    onClick={() => setPracticeStepIndex(prev => Math.max(0, prev - 1))}
                                                    disabled={practiceStepIndex === 0}
                                                    className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    {t.stepPrev}
                                                </button>

                                                <button
                                                    onClick={handlePracticeNext}
                                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25 cursor-pointer active:scale-98 transition-all"
                                                >
                                                    <span>{practiceStepIndex === steps.length - 1 ? t.stepFinish : t.stepNext}</span>
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c183b] to-[#120f26] border-2 border-purple-400/50 shadow-2xl space-y-4 text-center animate-fade-in">
                                    <div className="size-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 mx-auto">
                                        <Award size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base sm:text-lg font-black text-white">
                                            {t.certificateTitle}
                                        </h3>
                                        <p className="text-xs text-purple-200/80 max-w-sm mx-auto">
                                            {t.certificateSubtitle}
                                        </p>
                                    </div>

                                    <div className="text-left space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
                                        {steps.map((st, i) => (
                                            <div key={st.stepCode} className="flex items-start gap-2">
                                                <span className="text-purple-400 font-mono font-bold shrink-0">[{st.stepCode}]</span>
                                                <span className="text-gray-300 line-clamp-1">{userAnswers[i] || st.exampleAnswer.kr}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handlePracticeReset}
                                        className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    >
                                        <RotateCcw size={14} />
                                        <span>{t.practiceReset}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* [모드 5: 🗄️ 마음 비타민 도감] */}
                    {activeTab === 'cabinet' && (
                        <div className="max-w-xl mx-auto space-y-4">
                            <div className="flex items-center justify-between text-xs px-1">
                                <h4 className="font-bold text-white">{t.cabinetTitle}</h4>
                                <span className="text-cyan-300 font-mono">
                                    수집률: {Math.round((progress.masteredCardIds.length / MEMORY_CARDS_DB.length) * 100)}%
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {MEMORY_CARDS_DB.map((card, cIdx) => {
                                    const isMastered = progress.masteredCardIds.includes(card.id);
                                    const theme = getCardCapsuleTheme(card);

                                    return (
                                        <div
                                            key={card.id}
                                            onClick={() => {
                                                setCapsuleIndex(cIdx);
                                                setActiveTab('capsule');
                                                setIsCapsuleDissolved(false);
                                                setHoldProgress(0);
                                            }}
                                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[135px] cursor-pointer transition-all hover:scale-102 ${
                                                isMastered
                                                    ? 'bg-gradient-to-b from-[#18203c] to-[#0f1426] border-cyan-400/40 shadow-lg shadow-cyan-500/10'
                                                    : 'bg-[#0f1326] border-white/5 opacity-75 hover:opacity-100'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl">{card.icon}</span>
                                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                                                    isMastered ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-gray-400'
                                                }`}>
                                                    {isMastered ? '보유중' : '미복용'}
                                                </span>
                                            </div>

                                            <div className="space-y-0.5 my-1">
                                                <span className="text-[9px] font-mono font-bold text-cyan-300 block truncate">
                                                    {theme.vitaminName[langKey] || theme.vitaminName.kr}
                                                </span>
                                                <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                                                    {card.keyword[langKey] || card.keyword.kr}
                                                </p>
                                            </div>

                                            <div className="text-[9px] font-mono text-gray-400 truncate">
                                                쿨다운: {theme.coolDownScore}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── 5. 하단 바: 의료법 준수 안심 면책 안내 & 닫기 ── */}
                <div className="px-5 py-3 bg-[#080b17] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1.5 text-center sm:text-left">
                        <ShieldAlert size={13} className="text-amber-400/80 shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none text-gray-400">
                            {t.medicalDisclaimer}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold transition-all cursor-pointer shrink-0"
                    >
                        {t.closeBtn}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
