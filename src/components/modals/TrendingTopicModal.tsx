'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, DollarSign, Moon, Brain, Sparkles, Compass, Building2, Heart, ArrowRight, Zap, CheckCircle2, Crown } from 'lucide-react';

interface TrendingTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTopic: (promptText: string) => void;
}

export const TRENDING_TOPICS = [
    {
        icon: DollarSign,
        color: 'from-amber-950/80 via-[#211a09]/90 to-[#0e0a02] border-yellow-400/60 text-yellow-200 shadow-[0_0_25px_rgba(234,179,8,0.25)] hover:border-yellow-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.5)]',
        badge: '🔥 인기 1위',
        badgeColor: 'bg-yellow-400/20 text-yellow-200 border-yellow-300/50 shadow-[0_0_10px_rgba(234,179,8,0.4)]',
        btnBg: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-md',
        title: '💰 2026 타고난 사주 재물운 & 부자 체급 정밀 분석',
        desc: '내 사주팔자 8글자에 숨겨진 타고난 재물 그릇의 크기와 2026년 병오년(丙午年)에 큰돈이 모이는 핵심 타이밍과 재물 비법',
        prompt: '내 사주의 타고난 재물 체급과 2026년에 큰돈이 들어오는 확실한 타이밍과 재물운 관리법 알려줘'
    },
    {
        icon: Moon,
        color: 'from-sky-950/80 via-[#071624]/90 to-[#020912] border-sky-500/50 text-sky-300 shadow-[0_0_25px_rgba(14,165,233,0.2)] hover:border-sky-400 hover:shadow-[0_0_35px_rgba(14,165,233,0.4)]',
        badge: '🌙 몰입 듀얼트랙',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-[0_0_10px_rgba(14,165,233,0.3)]',
        btnBg: 'bg-sky-500/20 text-sky-300 border-sky-400/50 group-hover:bg-sky-400 group-hover:text-slate-950',
        title: '🌙 낮 vs 밤 나만의 황금 작업 몰입 시간대',
        desc: '내 사주 기운에 따라 에너지가 가장 맑아지고 집중력이 폭발하는 최고의 몰입 시간대(낮 vs 밤/새벽) 찾기',
        prompt: '내가 밤/새벽에 일해야 할까, 낮에 일해야 할까? 내 사주에 맞는 최고 집중력 시간대 알려줘'
    },
    {
        icon: Brain,
        color: 'from-purple-950/80 via-[#190c24]/90 to-[#0a0412] border-purple-500/50 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]',
        badge: '🧠 뇌 신경망',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
        btnBg: 'bg-purple-500/20 text-purple-300 border-purple-400/50 group-hover:bg-purple-500 group-hover:text-white',
        title: '🧠 반복되는 불안·생각 습관 뇌 쿨링 재배선',
        desc: '꼬리를 무는 자책과 조급한 생각의 굴레를 멈추고 마음을 편안하게 정돈하는 뇌 쿨링 메타인지 솔루션',
        prompt: '내 사주 기운과 연결해서 자꾸 반복되는 쓸데없는 생각 습관과 불안을 말끔히 씻어내줘'
    },
    {
        icon: Compass,
        color: 'from-emerald-950/80 via-[#061e1b]/90 to-[#020e0d] border-emerald-500/50 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.4)]',
        badge: '📜 특허출원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        btnBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 group-hover:bg-emerald-400 group-hover:text-slate-950',
        title: '📜 특허출원 명심코칭 3S (스캔·동기화·전환) 1분 보살핌',
        desc: '일상에서 마음이 답답할 때 즉시 평온을 되찾아주는 1분 마음 스캔과 뇌 쿨링 3단계 실천 루틴',
        prompt: '오늘 당장 마음이 답답할 때 실천할 수 있는 명심 3S 1분 마음 보살핌 루틴 알려줘'
    },
    {
        icon: Sparkles,
        color: 'from-rose-950/80 via-[#1c0d18]/90 to-[#0c050d] border-rose-500/50 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.2)] hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.4)]',
        badge: '💎 80% 미학',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
        btnBg: 'bg-rose-500/20 text-rose-300 border-rose-400/50 group-hover:bg-rose-500 group-hover:text-white',
        title: '💎 완벽주의 내려놓기 (80% 미학 실천법)',
        desc: '100점이 아니면 시작을 미루게 되는 완벽주의 마음의 짐을 내려놓고 가볍게 시도하는 80% 미학 감동 에세이',
        prompt: '내 사주 일간 기운에 맞춰 완벽주의를 내려놓고 가볍게 시작할 수 있는 80% 미학 조언 전해줘'
    },
    {
        icon: Building2,
        color: 'from-amber-900/90 via-[#261d06]/95 to-[#0f0a02] border-amber-400/60 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]',
        badge: '🏢 커리어 브랜딩',
        badgeColor: 'bg-amber-400/20 text-amber-200 border-amber-300/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
        btnBg: 'bg-amber-400/20 text-amber-200 border-amber-300/50 group-hover:bg-amber-400 group-hover:text-slate-950',
        title: '🏢 나만의 독보적 가치 & 커리어 1:1 브랜딩 전략',
        desc: '남들과 차별화되는 내 사주의 타고난 강점과 직업적 가치를 세상에 당당히 돋보이게 만드는 커리어 성장 전략',
        prompt: '내 사주 강점을 살려서 내 몸값을 올리고 세상에서 내 가치를 돋보이게 만드는 커리어 브랜딩 알려줘'
    },
    {
        icon: Heart,
        color: 'from-pink-950/80 via-[#210917]/90 to-[#0d0208] border-pink-500/50 text-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.2)] hover:border-pink-400 hover:shadow-[0_0_35px_rgba(236,72,153,0.4)]',
        badge: '💖 내면 자비',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
        btnBg: 'bg-pink-500/20 text-pink-300 border-pink-400/50 group-hover:bg-pink-500 group-hover:text-white',
        title: '💖 자책 멈춤 & 내면 불안 자비 수용',
        desc: '나를 괴롭히던 불안과 조급함이 사실은 나를 지켜주려던 내면의 다정한 보호자였음을 알아차리고 안아주기',
        prompt: '나를 옥죄던 자책감과 불안을 따뜻하게 다독이고 가슴속 마음을 안아주는 자비 코칭 해줘'
    },
    {
        icon: Crown,
        color: 'from-indigo-950/80 via-[#180a2b]/90 to-[#090312] border-2 border-amber-300 text-amber-200 shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:border-amber-200 hover:shadow-[0_0_50px_rgba(245,158,11,0.6)]',
        badge: '👑 영점 각성',
        badgeColor: 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        btnBg: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-slate-950 font-black shadow-lg',
        title: '👑 432Hz 힐링 주파수 & 마음의 평온 각성',
        desc: '내 삶의 모든 풍랑에서 한 걸음 물러서서 고요하고 자유로운 내면의 평온을 되찾는 432Hz 자각 명상',
        prompt: '내 마음의 소음을 끄고 깊은 평온과 안식을 선사하는 432Hz 제로포인트 명상 가이드 알려줘'
    }
];

export default function TrendingTopicModal({
    isOpen,
    onClose,
    onSelectTopic
}: TrendingTopicModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-2xl rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#0a0f24] via-[#060a19] to-black border-2 border-indigo-500/50 shadow-[0_0_80px_rgba(99,102,241,0.3)] p-4 sm:p-6 text-left text-white my-auto max-h-[90vh] flex flex-col overflow-hidden"
                >
                    {/* Background Indigo Radial Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.4)] animate-pulse">
                                <Flame size={24} className="text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                    <span>🔥 2026 트렌딩 탐구 주제 8선</span>
                                    <span className="text-[10px] font-mono bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-0.5 rounded-full font-black shadow-md">
                                        인기 TOP 8
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
                                    원하시는 주제 카드를 터치하시면 명심 AI 코치가 1:1 맞춤 감동 에세이를 즉시 직조해 드립니다.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Grid of 8 Trending Topics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 overflow-y-auto pr-1 flex-1 no-scrollbar relative z-10">
                        {TRENDING_TOPICS.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelectTopic(item.prompt);
                                        onClose();
                                    }}
                                    className={`p-4.5 rounded-2xl bg-gradient-to-br ${item.color} border transition-all duration-300 text-left group active:scale-[0.97] cursor-pointer relative overflow-hidden flex flex-col justify-between`}
                                >
                                    <div>
                                        {/* Card Header & Badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                                                {item.badge}
                                            </span>
                                            <IconComponent size={18} className="opacity-90 group-hover:scale-125 transition-transform duration-300 text-amber-300" />
                                        </div>

                                        {/* Card Title */}
                                        <h4 className="text-xs font-black text-white mb-2 leading-snug">
                                            {item.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-xs text-gray-200 font-medium leading-relaxed mb-4">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Bottom Prompt Bar & CTA Button */}
                                    <div className="pt-3 border-t border-white/15 mt-auto flex flex-col gap-2">
                                        <div className="text-[11px] text-amber-200/90 font-mono truncate italic bg-white/5 p-2 rounded-xl border border-white/5">
                                            "{item.prompt}"
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                <CheckCircle2 size={12} className="text-emerald-400" />
                                                <span>1:1 에세이 직조 준비</span>
                                            </span>
                                            <span className={`px-3 py-1 rounded-full border text-[11px] font-black shrink-0 flex items-center gap-1 transition-all duration-300 shadow-md ${item.btnBg}`}>
                                                <Zap size={11} />
                                                <span>질문 주입</span>
                                                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer note */}
                    <div className="pt-3 border-t border-white/10 text-center shrink-0 relative z-10">
                        <p className="text-[11px] text-indigo-300/90 font-medium">
                            💡 원하시는 주제 카드를 터치하시면 명심 AI 코치가 3단계(Scan ➔ Sync ➔ Shift) 1:1 맞춤 감동 에세이를 즉시 전해 드립니다.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
