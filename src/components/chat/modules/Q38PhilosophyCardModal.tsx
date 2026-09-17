'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Q38_CHATGPT_VS_MYEONGSIM } from '@/modules/MyeongsimAiPhilosophyModule';

interface Q38PhilosophyCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAskQuestion?: (prompt: string) => void;
}

export default function Q38PhilosophyCardModal({
    isOpen,
    onClose,
    onAskQuestion
}: Q38PhilosophyCardModalProps) {
    if (!isOpen) return null;

    const data = Q38_CHATGPT_VS_MYEONGSIM;

    const handleAsk = () => {
        if (onAskQuestion) {
            onAskQuestion('ChatGPT에 고민 말하면 되는데 굳이 명심AI가 왜 필요한가요? 범용 AI와 명심AI의 차별점을 사이다 한 줄 요약과 4대 시간 축으로 명쾌하게 알려줘');
        }
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-2xl rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-6 sm:p-8 text-left my-auto max-h-[90vh] flex flex-col overflow-hidden font-sans"
                >
                    {/* 상단 닫기 버튼 */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="닫기"
                    >
                        <X size={20} />
                    </button>

                    {/* 모달 스크롤 콘텐츠 */}
                    <div className="space-y-5 overflow-y-auto pr-1">
                        
                        {/* 상단 뱃지 및 타이틀 */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full border-2 border-emerald-500 text-emerald-600 font-black text-xs">
                                    {data.questionNumber}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px]">
                                    {data.categoryBadge}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px]">
                                    {data.subCategoryBadge}
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                                {data.questionTitle}
                            </h3>
                        </div>

                        {/* 사이다 한 줄 요약 박스 (이미지의 연두색 박스) */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-medium leading-relaxed shadow-sm">
                            <div className="flex items-start gap-2">
                                <span className="text-base">💡</span>
                                <div>
                                    <strong className="font-black text-emerald-800">사이다 한 줄 요약: </strong>
                                    <span>{data.oneLineSummary.replace(/^.*요약:\s*/, '')}</span>
                                </div>
                            </div>
                        </div>

                        {/* 본문 에세이 */}
                        <div className="space-y-3 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                            <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                {data.dailyProblem.map((line, i) => (
                                    <p key={i} className="text-slate-600 font-medium">
                                        • {line}
                                    </p>
                                ))}
                            </div>

                            <p className="font-semibold text-slate-800 pt-1">
                                {data.myeongsimSolution}
                            </p>

                            {/* 4대 시간 축 그리드 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                {data.timeAxisSteps.map((step) => (
                                    <div key={step.step} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                                                {step.step}
                                            </span>
                                            <span>{step.name}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-normal pl-5">
                                            {step.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 하단 강조 인용 박스 (녹색 세로선) */}
                        <div className="p-4 rounded-xl bg-slate-50/80 border-l-4 border-emerald-600 shadow-sm">
                            <p className="text-xs sm:text-sm font-black text-slate-900">
                                {data.coreIdentityQuote}
                            </p>
                        </div>
                    </div>

                    {/* 하단 질문 전송 액션 */}
                    <div className="pt-5 border-t border-slate-200 mt-4 flex items-center justify-between gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                            닫기
                        </button>
                        <button
                            type="button"
                            onClick={handleAsk}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer ml-auto"
                        >
                            <Sparkles size={16} className="text-yellow-300" />
                            <span>이 질문으로 AI 챗봇 대화 시작하기</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
