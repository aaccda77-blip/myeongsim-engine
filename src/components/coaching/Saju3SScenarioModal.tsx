import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Search, Activity, RefreshCw, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Saju3SScenario } from '@/data/Saju3SScenarios';

type Step = 'TRIGGER' | 'SCAN' | 'SYNC' | 'SHIFT';

interface Props {
    scenario: Saju3SScenario;
    onClose: () => void;
    onComplete: (quest: string, logId?: string) => void;
}

export default function Saju3SScenarioModal({ scenario, onClose, onComplete }: Props) {
    const [step, setStep] = useState<Step>('TRIGGER');
    const [isSaving, setIsSaving] = useState(false);

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
                <div className="flex justify-between items-center p-4 border-b border-white/5 bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <span className="text-primary-gold font-bold">명심코칭 3S 시나리오</span>
                        <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-full">{scenario.sajuCode}</span>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-center relative">
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
                                    <p className="font-bold text-gray-300 mb-2">현재 상태 진단 중...</p>
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
                                className="flex flex-col space-y-6"
                            >
                                <div className="flex items-center gap-3 text-2xl font-black text-white">
                                    <Search className="w-8 h-8 text-cyan-400" />
                                    <h2>Scan. 상태 자각</h2>
                                </div>
                                <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-2xl">
                                    <p className="text-cyan-200 font-medium mb-4">{scenario.scan.uiMessage}</p>
                                    <p className="text-gray-300 leading-relaxed text-sm">{scenario.scan.description}</p>
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
                                className="flex flex-col space-y-6"
                            >
                                <div className="flex items-center gap-3 text-2xl font-black text-white">
                                    <RefreshCw className="w-8 h-8 text-purple-400" />
                                    <h2>Sync. 본성 동기화</h2>
                                </div>
                                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-2xl">
                                    <p className="text-purple-200 font-medium mb-4">{scenario.sync.uiMessage}</p>
                                    <p className="text-gray-300 leading-relaxed text-sm">{scenario.sync.description}</p>
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
                                className="flex flex-col space-y-6"
                            >
                                <div className="flex items-center gap-3 text-2xl font-black text-white">
                                    <CheckCircle2 className="w-8 h-8 text-primary-gold" />
                                    <h2>Shift. 에너지 전환</h2>
                                </div>
                                <div className="bg-primary-gold/10 border border-primary-gold/30 p-4 rounded-2xl">
                                    <p className="text-primary-gold font-medium mb-4">{scenario.shift.uiMessage}</p>
                                    <p className="text-gray-300 leading-relaxed text-sm mb-6">{scenario.shift.description}</p>

                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">오늘의 Shift 퀘스트</p>
                                        <p className="text-white font-medium mb-3">{scenario.shift.quest}</p>
                                        <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
                                            <span className="text-xs text-gray-400">{scenario.shift.questAction}</span>
                                            <span className="text-primary-gold font-bold italic">"{scenario.shift.questMantra}"</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-white/5 bg-slate-800/30 flex justify-end">
                    {step !== 'TRIGGER' && (
                        <button
                            onClick={handleNext}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 'SHIFT'
                                ? 'bg-primary-gold text-black hover:bg-yellow-500 hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:hover:scale-100'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    {step === 'SHIFT' ? '퀘스트 수락하기' : '다음 단계로'}
                                    {step !== 'SHIFT' && <ArrowRight className="w-4 h-4" />}
                                </>
                            )}
                        </button>
                    )}
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
