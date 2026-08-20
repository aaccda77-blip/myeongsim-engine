'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, ChevronDown, ChevronUp, Sparkles, X, BookOpen, Quote } from 'lucide-react';

interface FounderWelcomeLetterBannerProps {
    userName?: string;
}

export default function FounderWelcomeLetterBanner({ userName = '명심가' }: FounderWelcomeLetterBannerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Top Collapsible Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1e1b2e] via-[#16192b] to-[#1a2332] border border-purple-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden text-left"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-inner">
                            💌
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                                    창립자의 편지
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    [버전 2: 감성 편지글형]
                                </span>
                            </div>
                            <h3 
                                onClick={() => setIsModalOpen(true)}
                                className="text-sm sm:text-base font-black text-white hover:text-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                <span>나다운 삶을 시작하는 {userName}님에게</span>
                                <span className="text-[11px] text-purple-400 font-normal underline decoration-purple-400/50">
                                    (전문 읽기 ↗)
                                </span>
                            </h3>
                            <p className="text-xs text-gray-300 leading-relaxed font-sans">
                                &quot;쉼 없이 달려온 당신에게 가장 필요한 건 더 많은 노력이 아닌, <strong>‘나를 이해하는 시간’</strong>입니다. 무엇을 더 채우려 애쓰지 마세요...&quot;
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                            title="요약 펼치기/접기"
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>

                {/* Collapsible Sub-Letter */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-purple-500/20 text-xs text-gray-300 space-y-2 leading-relaxed font-sans"
                        >
                            <p>
                                우리는 세상을 살아가며 남들의 기준에 맞추기 위해 스스로를 몰아세우곤 합니다. 
                                하지만 사주와 심신학이 전하는 진정한 지혜는 <strong>&apos;결핍을 증명하는 삶&apos;</strong>에서 벗어나 <strong>&apos;이미 온전한 나의 본연(Being)&apos;</strong>을 마주하는 것입니다.
                            </p>
                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-[11px] font-bold text-purple-300 hover:text-purple-100 flex items-center gap-1 cursor-pointer"
                                >
                                    <BookOpen size={13} />
                                    <span>편지 전문 보기</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Full Letter Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans animate-fade-in text-left">
                        <div className="bg-[#0f1322] border border-purple-500/40 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.25)] relative text-white space-y-5 custom-scrollbar">
                            
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">💌</span>
                                    <h3 className="text-base font-black text-white">
                                        나다운 삶을 시작하는 {userName}님에게
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-purple-200 italic font-serif">
                                    &quot;쉼 없이 달려온 당신에게 가장 필요한 건<br />
                                    더 많은 노력이 아닌, <strong>&apos;나를 이해하는 시간&apos;</strong>입니다.&quot;
                                </div>

                                <p>
                                    세상은 끊임없이 무언가를 더 배우고, 더 채우고, 더 나은 사람이 되라고 다그칩니다.
                                    하지만 우리가 지치고 번아웃에 빠지는 이유는 노력이 부족해서가 아닙니다.
                                    <strong>&apos;나의 고유한 에너지 메커니즘&apos;</strong>을 모른 채 남의 속도에 나를 맞추었기 때문입니다.
                                </p>

                                <p>
                                    명심코칭의 리포트는 당신을 평가하거나 미래를 단정 짓는 점괘가 아닙니다.
                                    타고난 기질과 신경망의 흐름을 객관적으로 이해하여, 
                                    불필요한 자책을 멈추고 당신만의 가장 자연스러운 리듬을 되찾아드리기 위한 지도입니다.
                                </p>

                                <p>
                                    무엇을 억지로 바꾸려 하지 마세요. 
                                    내 안의 빛과 그림자를 있는 그대로 알아차리는 순간, 
                                    진정한 내면의 평온과 강력한 실행력이 동시에 피어납니다.
                                </p>

                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
                                    <span>명심코칭 창립자 & 웰니스 팀 드림</span>
                                    <span className="text-purple-300 font-bold flex items-center gap-1">
                                        <Heart size={13} className="fill-purple-400 text-purple-400" />
                                        <span>온전한 당신을 응원합니다</span>
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                            >
                                따뜻한 마음으로 리포트 이어보기
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
