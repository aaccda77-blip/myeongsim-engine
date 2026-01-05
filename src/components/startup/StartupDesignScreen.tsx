"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { StartupCoachingEngine, PersonalizedRoadmap } from '@/services/StartupCoachingEngine';
import { ChevronDown, ChevronUp, Check, Rocket, Brain, Shield, TrendingUp, Users } from 'lucide-react';

// Step Icons
const STEP_ICONS = [Brain, Rocket, Shield, TrendingUp, Users];
const STEP_COLORS = ['#A78BFA', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];

interface StartupDesignScreenProps {
    onClose: () => void;
    onChatIntent?: (intent: string, prompt: string) => void;
    userProfile?: any;
}

export default function StartupDesignScreen({ onClose, onChatIntent, userProfile }: StartupDesignScreenProps) {
    const { reportData } = useReportStore();
    const [expandedStep, setExpandedStep] = useState<number | null>(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    // 사용자 데이터로 개인화된 로드맵 생성
    const roadmap = useMemo<PersonalizedRoadmap>(() => {
        // reportData 또는 userProfile에서 데이터 추출
        const effectiveData = userProfile || reportData;

        // 강점 리포트 데이터 변환
        const profile = {
            powerbase: effectiveData?.stats ? {
                communication: effectiveData.stats.empathy || 50,
                innovation: effectiveData.stats.creativity || 50,
                management: effectiveData.stats.execution || 50,
                marketSuccess: effectiveData.stats.wealth || 50,
                sustainability: effectiveData.stats.leadership || 50,
                structure: effectiveData.stats.execution || 50
            } : undefined,
            saju: effectiveData?.saju,
            teamRole: effectiveData?.teamRole
        };

        return StartupCoachingEngine.getPersonalizedRoadmap(profile);
    }, [userProfile, reportData]);

    const toggleStep = (step: number) => {
        setExpandedStep(expandedStep === step ? null : step);
    };

    const markComplete = (step: number) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(step)) {
            newCompleted.delete(step);
        } else {
            newCompleted.add(step);
        }
        setCompletedSteps(newCompleted);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0F] z-[2000] overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 bg-[#0A0A0F]/90 backdrop-blur-xl z-50 border-b border-white/5">
                <div className="flex justify-between items-center p-4">
                    <h1 className="text-lg font-bold text-white">
                        🚀 무실패 스타트업 설계
                    </h1>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="p-4 pb-32">
                {/* CEO DNA 카드 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 border border-purple-500/30 rounded-2xl p-5 mb-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                            👤
                        </div>
                        <div>
                            <p className="text-purple-400 text-xs font-bold uppercase">나의 CEO 유형</p>
                            <h2 className="text-xl font-black text-white">{roadmap.ceoType}</h2>
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{roadmap.ceoDescription}</p>

                    {/* 비즈니스 유형 */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-gray-500 text-xs mb-2">추천 비즈니스 유형</p>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold border border-amber-500/30">
                                {roadmap.businessType.title}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* 강점 하이라이트 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
                >
                    <h3 className="text-white font-bold text-sm mb-3">💪 나의 강점</h3>
                    {roadmap.strengthsHighlight.map((item, idx) => (
                        <p key={idx} className="text-green-400 text-sm mb-1">{item}</p>
                    ))}
                </motion.div>

                {/* 5단계 로드맵 */}
                <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 px-1">5단계 실전 로드맵</h3>

                <div className="space-y-3">
                    {roadmap.roadmapSteps.map((step, idx) => {
                        const Icon = STEP_ICONS[idx];
                        const isExpanded = expandedStep === idx;
                        const isCompleted = completedSteps.has(idx);
                        const color = STEP_COLORS[idx];

                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`
                                    rounded-xl border overflow-hidden transition-all
                                    ${isCompleted ? 'bg-green-900/20 border-green-500/30' : 'bg-white/5 border-white/10'}
                                `}
                            >
                                {/* Step Header */}
                                <button
                                    onClick={() => toggleStep(idx)}
                                    className="w-full p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${color}20` }}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Icon className="w-5 h-5" style={{ color }} />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-gray-500 uppercase">Step {step.step}</p>
                                            <p className="text-white font-bold text-sm">{step.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs">{step.estimated_time}</span>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </button>

                                {/* Step Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 border-t border-white/5 pt-4">
                                                <p className="text-gray-400 text-sm mb-4">{step.description}</p>

                                                {/* Actions */}
                                                <div className="space-y-2 mb-4">
                                                    {step.actions.map((action, aIdx) => (
                                                        <div key={aIdx} className="flex items-start gap-2">
                                                            <span className="text-gray-600 mt-0.5">•</span>
                                                            <p className="text-white text-sm">{action}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Tools */}
                                                {step.tools && step.tools.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {step.tools.map((tool, tIdx) => (
                                                            <span key={tIdx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                                                {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Complete Button */}
                                                <button
                                                    onClick={() => markComplete(idx)}
                                                    className={`
                                                        w-full py-3 rounded-xl font-bold text-sm transition-all
                                                        ${isCompleted
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}
                                                    `}
                                                >
                                                    {isCompleted ? '✅ 완료됨' : '미션 완료하기'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 주의사항 & 팁 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-amber-900/20 rounded-xl p-4 border border-amber-500/30"
                >
                    <h3 className="text-amber-400 font-bold text-sm mb-3">⚠️ 주의사항 & 팁</h3>
                    {roadmap.warningsAndTips.map((item, idx) => (
                        <p key={idx} className="text-white text-sm mb-1">{item}</p>
                    ))}
                </motion.div>

                {/* 추천 공식 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6"
                >
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-3 px-1">나를 위한 천재적 사고 공식</h3>
                    <div className="space-y-3">
                        {roadmap.primaryFormulas.slice(0, 3).map((formula, idx) => (
                            <div key={formula.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">💡</span>
                                    <h4 className="text-white font-bold text-sm">{formula.name}</h4>
                                </div>
                                <p className="text-purple-400 text-sm font-mono mb-2">{formula.formula_text}</p>
                                <p className="text-gray-400 text-xs">{formula.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 챗봇 상담 버튼 */}
                {onChatIntent && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={() => {
                            onChatIntent(
                                'STARTUP_COACHING',
                                `저는 '${roadmap.ceoType}' 유형이고, '${roadmap.businessType.title}' 비즈니스에 적합하다고 나왔어요. ${roadmap.recommendedStrategy.name} 전략을 더 자세히 알고 싶어요. 제 상황에 맞게 구체적으로 코칭해주세요.`
                            );
                            onClose();
                        }}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                    >
                        💬 나만의 창업 전략 상담하기
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
