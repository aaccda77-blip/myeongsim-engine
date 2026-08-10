import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Search, Activity, RefreshCw, CheckCircle2, ArrowRight, Loader2, Star } from 'lucide-react';
import { Saju3SScenario } from '@/data/Saju3SScenarios';

type Step = 'TRIGGER' | 'SCAN' | 'SYNC' | 'SHIFT';

interface Props {
    scenario: Saju3SScenario;
    selectedTag?: string;
    onClose: () => void;
    onComplete: (quest: string, logId?: string) => void;
}

export default function Saju3SScenarioModal({ scenario, selectedTag, onClose, onComplete }: Props) {
    const [step, setStep] = useState<Step>('TRIGGER');
    const [isSaving, setIsSaving] = useState(false);

    // [SYNC-CUSTOM] 태그별 맞춤 문구 추출 로직
    const tagDetail = selectedTag ? scenario.tagDetails?.[selectedTag] : undefined;
    
    const displayData = {
        scan: tagDetail?.scan || scenario.scan.description,
        sync: tagDetail?.sync || scenario.sync.description,
        shift: tagDetail?.shift || scenario.shift.description
    };

    // Auto-advance Trigger to Scan after a simulated delay
    useEffect(() => {
        if (step === 'TRIGGER') {
            const timer = setTimeout(() => {
                setStep('SCAN');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleNext = async () => {
        if (step === 'SCAN') setStep('SYNC');
        else if (step === 'SYNC') setStep('SHIFT');
        else if (step === 'SHIFT') {
            setIsSaving(true);
            try {
                // Determine emotion tag from scenario tags
                const emotionTag = scenario.tags[0] || 'Unknown';

                const res = await fetch('/api/coaching/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        scenarioId: scenario.id,
                        emotionTag: emotionTag,
                        questTitle: scenario.shift.quest,
                        userId: 'local-user' // Replace with real auth ID if available
                    })
                });

                if (res.ok) {
                    const json = await res.json();
                    onComplete(scenario.shift.quest, json.data?.id);
                } else {
                    console.error('Failed to log coaching state');
                    onComplete(scenario.shift.quest); // Fallback even if DB fails
                }
            } catch (err) {
                console.error('Error saving coaching state', err);
                onComplete(scenario.shift.quest);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, scale: 1.05, y: -50, filter: "blur(10px)", transition: { duration: 0.5, ease: "easeIn" } }
    };

    const contentVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.2 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-900 border border-primary-gold/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col relative min-h-[500px]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-amber-300 font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                            ✨ 명심코칭 3S 시나리오
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            🏛️ 특허출원중 제10-2025-0166877호
                        </span>
                        <span className="text-xs text-gray-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 font-mono">{scenario.stem}</span>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-center relative min-h-[350px]">
                    <AnimatePresence mode="wait">
                        {step === 'TRIGGER' && (
                            <motion.div
                                key="trigger"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="text-4xl animate-pulse">
                                    <Activity className="w-12 h-12 text-blue-400" />
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-gray-300">
                                    "{scenario.trigger.userInputPlaceholder}"
                                </div>
                                <div className="text-sm text-gray-400">
                                    <p className="font-bold text-gray-300 mb-2">현재 상태 분석 중...</p>
                                    <p>{scenario.trigger.analysisText}</p>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden mt-8">
                                    <div className="bg-blue-500 h-full w-full animate-[loading_3s_ease-in-out_forwards]" style={{ transformOrigin: "left" }} />
                                </div>
                            </motion.div>
                        )}

                        {step === 'SCAN' && (
                            <motion.div
                                key="scan"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 text-2xl font-black text-white mb-6">
                                    <Search className="w-8 h-8 text-cyan-400" />
                                    <h2>1. 상태 자각 (Scan)</h2>
                                </div>
                                <div className="bg-cyan-900/20 border border-cyan-500/30 p-5 rounded-2xl flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-cyan-200 font-medium mb-4 text-lg">{scenario.scan.uiMessage}</p>
                                        <p className="text-gray-300 leading-relaxed text-base">{displayData.scan}</p>
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        <p className="text-xs text-amber-300 font-bold mb-2">Q. 지금 당신도 내면에서 일어나는 이런 상태를 자각하시나요?</p>
                                        <button onClick={handleNext} className="w-full text-left p-4 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 to-slate-900 hover:border-cyan-400 text-white font-semibold transition-all flex items-center justify-between group shadow-lg active:scale-[0.98]">
                                            <span className="text-xs sm:text-sm text-cyan-100">✨ 네, 정확히 내면에서 그런 압박감을 자각하고 있습니다.</span>
                                            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button onClick={handleNext} className="w-full text-left p-4 rounded-2xl border border-white/10 bg-slate-950/40 hover:bg-white/5 text-gray-300 hover:text-white transition-all flex items-center justify-between group active:scale-[0.98]">
                                            <span className="text-xs sm:text-sm text-gray-300">🌿 현재는 평온하지만 내면의 숨겨진 코드를 알아차려 보겠습니다.</span>
                                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'SYNC' && (
                            <motion.div
                                key="sync"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 text-2xl font-black text-white mb-6">
                                    <RefreshCw className="w-8 h-8 text-purple-400" />
                                    <h2>2. 본성 수용 (Sync)</h2>
                                </div>
                                <div className="bg-purple-900/20 border border-purple-500/30 p-5 rounded-2xl flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-purple-200 font-medium mb-4 text-lg">{scenario.sync.uiMessage}</p>
                                        <p className="text-gray-300 leading-relaxed text-base">{displayData.sync}</p>
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        <p className="text-xs text-gray-400 mb-2">Q. 이것이 단점이 아니라 당신의 위대한 본능임을 수용하십니까?</p>
                                        <button onClick={handleNext} className="w-full text-left p-4 rounded-xl border border-purple-500/30 bg-purple-900/30 hover:bg-purple-800/50 text-white font-medium transition-colors flex items-center justify-between group">
                                            <span>네, 나를 괴롭히던 감정의 진짜 원리를 이해했습니다.</span>
                                            <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'SHIFT' && (
                            <motion.div
                                key="shift"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 text-2xl font-black text-white mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-primary-gold" />
                                    <h2>3. 에너지 전환 (Shift)</h2>
                                </div>
                                <div className="bg-primary-gold/10 border border-primary-gold/30 p-5 rounded-2xl flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-primary-gold font-medium mb-4 text-lg">{scenario.shift.uiMessage}</p>
                                        <p className="text-gray-300 leading-relaxed text-base mb-6">{displayData.shift}</p>

                                        <div className="bg-black/40 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-gold/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                            <p className="text-xs text-primary-gold/70 font-bold tracking-widest mb-2 flex items-center gap-1">
                                                <Star className="w-3 h-3" /> TODAY'S QUEST
                                            </p>
                                            <p className="text-white font-bold text-lg mb-3">{scenario.shift.quest}</p>
                                            <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
                                                <span className="text-xs text-gray-400">{scenario.shift.questAction}</span>
                                                <span className="text-primary-gold font-bold italic">"{scenario.shift.questMantra}"</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <button
                                            onClick={handleNext}
                                            disabled={isSaving}
                                            className="w-full py-4 rounded-2xl font-black text-xs sm:text-sm transition-all bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(245,158,11,0.35)] border border-amber-400/40 flex justify-center items-center gap-2 active:scale-[0.98] cursor-pointer"
                                        >
                                            {isSaving ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> 뇌신경 퀘스트 연산 중...</>
                                            ) : (
                                                <><CheckCircle2 className="w-5 h-5 text-amber-300" /> ✨ 뇌신경 퀘스트 수락하고 수용 완료하기 ➔</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <style>{`
                    @keyframes loading {
                        0% { transform: scaleX(0); }
                        100% { transform: scaleX(1); }
                    }
                `}</style>
            </motion.div>
        </div>
    );
}
