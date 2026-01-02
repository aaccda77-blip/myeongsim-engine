'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, Play, Pause, Camera, Check,
    Feather, Sparkles, Wind, Sun, Moon, Star
} from 'lucide-react';

interface PremiumActionGuideProps {
    content?: any;
    profile?: any;
    onNext: () => void;
    onPrev: () => void;
}

// === Aurora Background Effect ===
function AuroraBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Deep space base */}
            <div className="absolute inset-0 bg-[#050505]" />

            {/* Aurora layers */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(88, 28, 135, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 80% 50% at 80% 60%, rgba(49, 46, 129, 0.15) 0%, transparent 50%)',
                        'radial-gradient(ellipse 80% 50% at 40% 30%, rgba(88, 28, 135, 0.15) 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        'radial-gradient(ellipse 60% 40% at 70% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
                        'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                        'radial-gradient(ellipse 60% 40% at 60% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03]" />
        </div>
    );
}

// === Star Particles ===
function StarParticles() {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

// === Breathing Circle Animation ===
function BreathingCircle({ isActive, onClose }: { isActive: boolean; onClose: () => void }) {
    const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
            if (phase === 'exhale') {
                setCount(prev => prev + 1);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [isActive, phase]);

    // Haptic feedback simulation (vibration API)
    useEffect(() => {
        if (isActive && typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, [phase, isActive]);

    if (!isActive) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-2xl z-20"
            onClick={onClose}
        >
            <motion.div
                className="relative"
                animate={{
                    scale: phase === 'inhale' ? 1.5 : 1,
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
            >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border border-white/20 flex items-center justify-center">
                    <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400/40 to-indigo-400/40 flex items-center justify-center"
                        animate={{ scale: phase === 'inhale' ? 1.2 : 0.8 }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300/50 to-indigo-300/50 flex items-center justify-center"
                            animate={{ scale: phase === 'inhale' ? 1.3 : 0.7 }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                        >
                            <Wind className="w-8 h-8 text-white/70" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.p
                className="mt-8 text-xl font-medium text-white"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                {phase === 'inhale' ? '들이쉬세요...' : '내쉬세요...'}
            </motion.p>

            <p className="mt-4 text-sm text-gray-400">호흡 횟수: {count}/3</p>

            {count >= 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full"
                >
                    <span className="text-green-400 font-bold">✓ 완료!</span>
                </motion.div>
            )}
        </motion.div>
    );
}

// === Glass Card Component ===
function GlassCard({
    children,
    isCompleted,
    isExpanded,
    onClick,
    className = ""
}: {
    children: React.ReactNode;
    isCompleted: boolean;
    isExpanded?: boolean;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <motion.div
            layout
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-2xl cursor-pointer
                bg-white/5 backdrop-blur-xl border
                ${isCompleted
                    ? 'border-amber-400/50 shadow-lg shadow-amber-400/10'
                    : 'border-white/10 hover:border-white/20'
                }
                ${className}
            `}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            {/* Glow effect when completed */}
            {isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-transparent to-amber-400/5" />
            )}
            {children}
        </motion.div>
    );
}

// === Main Component ===
export default function PremiumActionGuide({ content, profile, onNext, onPrev }: PremiumActionGuideProps) {
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [breathingActive, setBreathingActive] = useState(false);
    const [journalText, setJournalText] = useState('');

    const questions = [
        "오늘 가장 뜻밖이었던 행운은 무엇인가요?",
        "당신을 미소 짓게 만든 작은 일은?",
        "감사함을 느낀 순간이 있었나요?",
        "오늘 나 자신이 자랑스러웠던 순간은?",
    ];
    const [randomQuestion] = useState(() => questions[Math.floor(Math.random() * questions.length)]);

    // Get dynamic message from profile
    const dynamicMessage = profile?.nativity?.dayMaster
        ? `회원님의 [${getDayMasterElement(profile.nativity.dayMaster)}] 기운을 다스리기 위한 맞춤 처방입니다.`
        : "당신의 에너지 균형을 위한 맞춤 처방입니다.";

    function getDayMasterElement(dm: string): string {
        if (dm.includes('갑') || dm.includes('을')) return '성장하는 목(木)';
        if (dm.includes('병') || dm.includes('정')) return '불안한 화(火)';
        if (dm.includes('무') || dm.includes('기')) return '안정적인 토(土)';
        if (dm.includes('경') || dm.includes('신')) return '날카로운 금(金)';
        if (dm.includes('임') || dm.includes('계')) return '흐르는 수(水)';
        return '균형 잡힌';
    }

    const toggleMission = (missionId: string) => {
        const newCompleted = new Set(completedMissions);
        if (newCompleted.has(missionId)) {
            newCompleted.delete(missionId);
        } else {
            newCompleted.add(missionId);
        }
        setCompletedMissions(newCompleted);
    };

    const canProceed = completedMissions.size > 0;

    return (
        <div className="relative min-h-screen w-full">
            <AuroraBackground />
            <StarParticles />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-purple-300 tracking-widest">ACTION PROTOCOL</span>
                    </motion.div>

                    <h1 className="text-3xl font-serif font-bold text-white">
                        2. 실천 가이드
                    </h1>

                    <p className="text-sm text-purple-200/70 italic">
                        {dynamicMessage}
                    </p>
                </div>

                {/* The 3 Rituals */}
                <div className="space-y-4">

                    {/* === NOW Card: Breathing === */}
                    <GlassCard
                        isCompleted={completedMissions.has('now')}
                        isExpanded={expandedCard === 'now'}
                        onClick={() => {
                            if (!breathingActive) {
                                setExpandedCard(expandedCard === 'now' ? null : 'now');
                            }
                        }}
                    >
                        <div className="p-5 relative">
                            <AnimatePresence>
                                {expandedCard === 'now' && (
                                    <BreathingCircle
                                        isActive={breathingActive}
                                        onClose={() => {
                                            setBreathingActive(false);
                                            toggleMission('now');
                                            setExpandedCard(null);
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex flex-col items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                    <span className="text-[10px] font-bold">NOW</span>
                                    <span className="text-[8px] opacity-80">30초</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-bold">즉각적인 정화</h3>
                                        {completedMissions.has('now') ? (
                                            <Check className="w-5 h-5 text-amber-400" />
                                        ) : (
                                            <Play className="w-5 h-5 text-white/50" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {content?.action_now || "심호흡 3번으로 마음을 정화하세요"}
                                    </p>
                                </div>
                            </div>

                            {expandedCard === 'now' && !breathingActive && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-white/10"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBreathingActive(true);
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                    >
                                        <Wind className="w-5 h-5" />
                                        호흡 시작하기
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </GlassCard>

                    {/* === TODAY Card: Sky Photo === */}
                    <GlassCard
                        isCompleted={completedMissions.has('today')}
                        onClick={() => setExpandedCard(expandedCard === 'today' ? null : 'today')}
                    >
                        <div className="p-5 relative overflow-hidden">
                            {/* Sky background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10" />

                            <div className="relative flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex flex-col items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                                    <span className="text-[10px] font-bold">TODAY</span>
                                    <span className="text-[8px] opacity-80">하루</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-bold">시야 확장</h3>
                                        {completedMissions.has('today') ? (
                                            <Check className="w-5 h-5 text-amber-400" />
                                        ) : (
                                            <Sun className="w-5 h-5 text-white/50" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {content?.action_today || "오늘 하늘을 한 번 올려다보세요"}
                                    </p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedCard === 'today' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-white/10"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMission('today');
                                                setExpandedCard(null);
                                            }}
                                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <Camera className="w-5 h-5" />
                                            하늘 봤어요! (인증)
                                        </button>
                                        <p className="text-center text-xs text-gray-500 mt-2">
                                            * 하늘 사진을 찍어 인증하세요
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </GlassCard>

                    {/* === WEEK Card: Gratitude Journal === */}
                    <GlassCard
                        isCompleted={completedMissions.has('week')}
                        onClick={() => setExpandedCard(expandedCard === 'week' ? null : 'week')}
                    >
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                    <span className="text-[10px] font-bold">WEEK</span>
                                    <span className="text-[8px] opacity-80">루틴</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-bold">긍정의 기록</h3>
                                        {completedMissions.has('week') ? (
                                            <Check className="w-5 h-5 text-amber-400" />
                                        ) : (
                                            <Feather className="w-5 h-5 text-white/50" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {content?.action_week || "감사 일기 한 줄 쓰기"}
                                    </p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedCard === 'week' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-white/10 space-y-3"
                                    >
                                        <p className="text-purple-300 text-sm italic">
                                            "{randomQuestion}"
                                        </p>
                                        <textarea
                                            value={journalText}
                                            onChange={(e) => setJournalText(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="여기에 작성하세요..."
                                            className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-purple-500/50"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (journalText.trim()) {
                                                    toggleMission('week');
                                                    setExpandedCard(null);
                                                }
                                            }}
                                            disabled={!journalText.trim()}
                                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Feather className="w-5 h-5" />
                                            기록 완료
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </GlassCard>
                </div>

                {/* Progress Indicator */}
                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        <span className="text-amber-400 font-bold">{completedMissions.size}</span>/3 미션 완료
                    </p>
                    <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                            animate={{ width: `${(completedMissions.size / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onPrev}
                        className="flex-1 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" /> 이전
                    </button>

                    <motion.button
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`
                            flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                            ${canProceed
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-400/20'
                                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                            }
                        `}
                        animate={canProceed ? {
                            boxShadow: ['0 0 0 rgba(251, 191, 36, 0)', '0 0 20px rgba(251, 191, 36, 0.3)', '0 0 0 rgba(251, 191, 36, 0)']
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        마지막 장으로 <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </div>

                {!canProceed && (
                    <p className="text-center text-xs text-gray-500">
                        * 최소 1개의 미션을 완료해야 다음으로 진행할 수 있습니다
                    </p>
                )}
            </motion.div>
        </div>
    );
}
