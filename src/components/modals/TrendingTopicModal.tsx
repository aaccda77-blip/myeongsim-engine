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
        title: '💰 사주 기반 재물·사업 스케일업 파이프라인',
        desc: '내 사주팔자 8글자로 돈을 버는 체급과 890원 마이크로 퍼널 ➔ B2B 30만원 고단가 연결 구조',
        prompt: '내 사주로 돈 벌 수 있어? 890원 퍼널 ➔ B2C/B2B 30만원 고단가 연결 구조 정밀 분석해줘'
    },
    {
        icon: Moon,
        color: 'from-sky-950/80 via-[#071624]/90 to-[#020912] border-sky-500/50 text-sky-300 shadow-[0_0_25px_rgba(14,165,233,0.2)] hover:border-sky-400 hover:shadow-[0_0_35px_rgba(14,165,233,0.4)]',
        badge: '🌙 몰입 듀얼트랙',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-[0_0_10px_rgba(14,165,233,0.3)]',
        btnBg: 'bg-sky-500/20 text-sky-300 border-sky-400/50 group-hover:bg-sky-400 group-hover:text-slate-950',
        title: '🌙 낮 vs 밤 맞춤 작업 시간대 (Dual-Track Protocol)',
        desc: '사주에 수(水) 냉각수가 비어있을 때 밤/새벽 딥워크 쿨링과 낮 실행의 최적 분업 법칙',
        prompt: '밤/새벽에 일해야 해, 낮에 해야 해? 내 명식 맞춤 딥워크 시간대 듀얼트랙 알려줘'
    },
    {
        icon: Brain,
        color: 'from-purple-950/80 via-[#190c24]/90 to-[#0a0412] border-purple-500/50 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]',
        badge: '🧠 뇌 신경망',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
        btnBg: 'bg-purple-500/20 text-purple-300 border-purple-400/50 group-hover:bg-purple-500 group-hover:text-white',
        title: '🧠 뇌 신경가소성 & 64괘 기질 뇌회로 재배선',
        desc: '반복되는 자책과 조급한 마음의 습관을 다정한 메타인지 질문으로 재배선하는 3세대 뇌과학 처방',
        prompt: '내 사주 8글자와 뇌 신경망을 연결해서 불필요한 생각 습관을 재배선해줘'
    },
    {
        icon: Compass,
        color: 'from-emerald-950/80 via-[#061e1b]/90 to-[#020e0d] border-emerald-500/50 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.4)]',
        badge: '📜 특허출원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
        btnBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 group-hover:bg-emerald-400 group-hover:text-slate-950',
        title: '📜 특허출원 명심코칭 3S (Scan·Sync·Shift) 1분 처방',
        desc: '현장에서 즉시 적용하는 다크코드 수용 ➔ 뇌회로 재배선 ➔ 영점 각성 3단계 실천 루틴',
        prompt: '오늘 당장 실천할 수 있는 명심 3S 코칭 1분 보살핌 루틴 알려줘'
    },
    {
        icon: Sparkles,
        color: 'from-rose-950/80 via-[#1c0d18]/90 to-[#0c050d] border-rose-500/50 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.2)] hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.4)]',
        badge: '💎 80% 미학',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
        btnBg: 'bg-rose-500/20 text-rose-300 border-rose-400/50 group-hover:bg-rose-500 group-hover:text-white',
        title: '💎 60갑자 일간별 완벽주의 내려놓기 (80% 미학)',
        desc: '100점 무결점에 갇혀 실천을 미루는 완벽주의 마비를 깨뜨리는 80% 미학 감동 에세이',
        prompt: '내 일간(본인 기운)에 맞는 완벽주의 해제 80% 미학 1:1 감동 에세이 전해줘'
    },
    {
        icon: Building2,
        color: 'from-amber-900/90 via-[#261d06]/95 to-[#0f0a02] border-amber-400/60 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:border-amber-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]',
        badge: '🏢 B2B 스케일업',
        badgeColor: 'bg-amber-400/20 text-amber-200 border-amber-300/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
        btnBg: 'bg-amber-400/20 text-amber-200 border-amber-300/50 group-hover:bg-amber-400 group-hover:text-slate-950',
        title: '🏢 B2B 기업 HR & 개인 1:1 브랜드 포지셔닝 전략',
        desc: '나만의 분석 역량을 B2B 기업 계약 30만원 / 개인 리포트로 안착시키는 주권자 포지셔닝',
        prompt: 'B2B 30만원 기업 워크숍 및 개인 1:1 브랜드 포지셔닝 전략 알려줘'
    },
    {
        icon: Heart,
        color: 'from-pink-950/80 via-[#210917]/90 to-[#0d0208] border-pink-500/50 text-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.2)] hover:border-pink-400 hover:shadow-[0_0_35px_rgba(236,72,153,0.4)]',
        badge: '💖 내면 자비',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/40 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
        btnBg: 'bg-pink-500/20 text-pink-300 border-pink-400/50 group-hover:bg-pink-500 group-hover:text-white',
        title: '💖 자책 멈춤 & 내면가족체계(IFS) 생존 보호자 수용',
        desc: '불안과 조급함이 사실 나를 지켜주려던 따뜻한 생존 보호자(Protector)였음을 안아주기',
        prompt: '나를 옥죄던 자책감과 불안을 생존 보호자로 자비롭게 안아주는 코칭'
    },
    {
        icon: Crown,
        color: 'from-indigo-950/80 via-[#180a2b]/90 to-[#090312] border-2 border-amber-300 text-amber-200 shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:border-amber-200 hover:shadow-[0_0_50px_rgba(245,158,11,0.6)]',
        badge: '👑 영점 각성',
        badgeColor: 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        btnBg: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 text-slate-950 font-black shadow-lg',
        title: '👑 432Hz 힐링 주파수 & 제로포인트 영점 각성',
        desc: '내 삶의 모든 풍랑을 한 걸음 물러서서 고요히 바라보는 우주의 중심 순수 자각',
        prompt: '내 마음의 소음을 끄는 432Hz 메타코드 제로포인트 명상 가이드'
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
                    className="relative w-full max-w-2xl rounded-[32px] bg-gradient-to-b from-[#0a0f24] via-[#060a19] to-black border-2 border-indigo-500/50 shadow-[0_0_80px_rgba(99,102,241,0.3)] p-5 sm:p-7 overflow-hidden text-left text-white my-auto max-h-[92vh] flex flex-col"
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
