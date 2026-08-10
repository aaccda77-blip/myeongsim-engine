'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Sparkles, Lightbulb, CheckCircle2, Heart, ArrowRight } from 'lucide-react';

interface ShiftStepDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    stepData: {
        step: string;
        title: string;
        desc: string;
        action: string;
        easyExample?: string;
        actionGuide?: string;
        touchingMessage?: string;
    } | null;
}

export const SHIFT_EASY_EXPLANATIONS: Record<string, { easyExample: string; actionGuide: string; touchingMessage: string }> = {
    '1단계': {
        easyExample: '🧭 마치 밤바다를 항해하는 배의 선장이 등대 불빛을 높이 켜서 선원들에게 "우리는 저 아름다운 섬으로 가는 중이야!"라고 다정하게 알려주는 것과 같습니다. 혼자 속도를 내어 달리다 보면 주변 사람이 외로워지거나 방향을 잃기 쉽습니다. 내가 꿈꾸는 생각의 그림을 주변 사람들에게 따뜻한 언어로 물들이듯 나누어 보세요.',
        actionGuide: '📌 [오늘 1분 실천]: "내가 오늘 이 일을 시작한 진짜 이유와 꿈"을 메모장에 3줄로 작성한 뒤, 함께 일하거나 곁에 있는 소중한 사람에게 "내가 생각하는 미래의 모습이야"라고 1분만 공유해 보세요.',
        touchingMessage: '💖 당신의 비전은 혼자 짊어져야 할 거대한 짐이 아닙니다. 사람들에게 불빛을 내어줄 때, 그 불빛은 타인의 마음에도 희망의 온기로 옮겨붙습니다.'
    },
    '2단계': {
        easyExample: '🌾 마치 가뭄 든 논밭에 맑은 우물물을 대어 주듯, 나에게 건네오는 주변 사람들의 다른 생각과 조언을 감사히 담아내는 마음의 그릇입니다. 나를 비판하는 소리가 아니라, 내가 미처 보지 못한 웅덩이를 알려주는 고마운 징검다리로 여겨보세요.',
        actionGuide: '📌 [오늘 1분 실천]: 상대방이 나에게 다른 의견을 말할 때, 3초 동안 숨을 크게 쉬며 미소 짓고 "그렇게 생각할 수도 있겠네요! 가르쳐주셔서 고맙습니다"라고 긍정으로 받아쳐 보세요.',
        touchingMessage: '💖 타인의 반대 의견은 당신의 비전을 가로막는 장애물이 아니라, 당신의 비전을 더 단단하고 안전하게 만들어주는 지혜의 버팀목입니다.'
    },
    '3단계': {
        easyExample: '🌳 사막 위에 단단한 정원을 가꾸듯, 내 머릿속 반짝이는 아이디어를 내가 잘 때도 자동으로 손님을 맞이하고 안내해 주는 예쁜 집(플랫폼 & 시스템)으로 만드는 단계입니다. 일회성 노력에 그치지 않고 지속 가능한 행복의 인프라로 안착합니다.',
        actionGuide: '📌 [오늘 1분 실천]: 내가 매일 반복해서 설명하는 안내글이나 업무 로직을 메모장에 표준 가이드 1장으로 만들어 AI나 팀원에게 전달할 준비를 마쳐보세요.',
        touchingMessage: '💖 당신은 평생 혼자 뛰어다녀야 할 고단한 노동자가 아닙니다. 우아하고 고요하게 시스템을 총지휘하는 영혼의 군주입니다.'
    }
};

export default function ShiftStepDetailModal({
    isOpen,
    onClose,
    stepData
}: ShiftStepDetailModalProps) {
    if (!isOpen || !stepData) return null;

    const detail = SHIFT_EASY_EXPLANATIONS[stepData.step] || SHIFT_EASY_EXPLANATIONS['1단계'];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 20 }}
                    className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0e172a] via-[#090e1a] to-black border-2 border-emerald-400/50 shadow-[0_0_70px_rgba(16,185,129,0.3)] p-6 sm:p-7 overflow-hidden text-left text-white my-auto max-h-[90vh] flex flex-col space-y-5"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
                                <Rocket className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/30 font-mono">
                                    💡 AI 코치 쉬운 예시 해설서 ({stepData.step})
                                </span>
                                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                                    {stepData.step} | {stepData.title}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content Scrollable Body */}
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 no-scrollbar text-xs text-gray-200">
                        {/* Summary & Easy Example */}
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                            <div className="flex items-center gap-1.5 text-emerald-300 font-black text-xs">
                                <Lightbulb size={16} />
                                <span>AI 코치의 초보자 맞춤 쉬운 비유 & 예시</span>
                            </div>
                            <p className="text-gray-200 leading-relaxed text-xs font-medium break-keep pt-1">
                                {detail.easyExample}
                            </p>
                        </div>

                        {/* Today Action Guide */}
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2">
                            <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs">
                                <CheckCircle2 size={16} />
                                <span>오늘 바로 실행하는 1분 뇌 스위치 루틴</span>
                            </div>
                            <p className="text-amber-100 leading-relaxed text-xs font-medium break-keep pt-1">
                                {detail.actionGuide}
                            </p>
                        </div>

                        {/* Touching Heart Message */}
                        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-400/30 space-y-2">
                            <div className="flex items-center gap-1.5 text-purple-300 font-black text-xs">
                                <Heart size={16} />
                                <span>영혼의 다정한 온기 한마디</span>
                            </div>
                            <p className="text-purple-200 leading-relaxed text-xs font-medium break-keep pt-1">
                                {detail.touchingMessage}
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="pt-2 border-t border-white/10 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer text-center"
                        >
                            확인했습니다 (마음 스위치 켜기) ✨
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
