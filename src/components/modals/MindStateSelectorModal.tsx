'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Shield, Flame, CloudRain, Moon, HelpCircle, Crown, Users, ArrowRight, Zap } from 'lucide-react';

interface MindStateSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectState: (moodLabel: string, promptText: string) => void;
}

export const MIND_STATE_DETAILS = [
    {
        icon: Shield,
        color: 'from-rose-500/25 via-pink-950/40 to-slate-950 border-rose-400/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
        title: '🛡️ 완벽주의·마비',
        desc: '100점이 아니면 시작조차 미루게 되는 내면의 엄격한 자책과 긴장감',
        prompt: '내 안의 완벽주의 다크코드를 80% 미학으로 뇌 쿨링(ACT) 해줘'
    },
    {
        icon: Flame,
        color: 'from-amber-500/25 via-orange-950/40 to-slate-950 border-amber-400/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
        title: '🔥 번아웃·엔진 과열',
        desc: '생각의 속도가 몸을 앞질러 멈추지 못하고 가슴이 달아오르는 내면 과열',
        prompt: '엔진 과열로 가슴이 답답하고 번아웃 오는데 메타인지로 정밀 교정해줘'
    },
    {
        icon: Sparkles,
        color: 'from-yellow-500/25 via-amber-950/40 to-slate-950 border-yellow-400/50 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.15)]',
        badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
        title: '💰 재물 조급함·사업 불안',
        desc: '미래 매출이나 현금 흐름에 대한 무의식적 조급함과 불확실성',
        prompt: '내 사주 8자로 2026년 대박 날 재물·사업운 정밀 분석해줘'
    },
    {
        icon: CloudRain,
        color: 'from-indigo-500/25 via-blue-950/40 to-slate-950 border-indigo-400/50 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
        title: '🌧️ 무기력·목적 상실',
        desc: '에너지가 바닥나고 아무것도 하기 싫은 내면의 무거운 진공 상태',
        prompt: '무기력한 내 영혼에 2026년 병오년 활력 기운을 재배선해줘'
    },
    {
        icon: Users,
        color: 'from-purple-500/25 via-pink-950/40 to-slate-950 border-purple-400/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
        title: '👥 인간관계·상처·오해',
        desc: '타인의 시선이나 거절, 오해로 인해 마음의 울타리가 좁아질 때',
        prompt: '남들의 평가에 흔들리지 않는 내 영혼의 군주 주권 회복 코칭'
    },
    {
        icon: Moon,
        color: 'from-sky-500/25 via-cyan-950/40 to-slate-950 border-sky-400/50 text-sky-300 shadow-[0_0_20px_rgba(14,165,233,0.15)]',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
        title: '🌙 수면 장애·야간 고독',
        desc: '밤만 되면 꼬리를 무는 생각과 야간 고독감으로 잠 못 들 때',
        prompt: '밤/새벽의 고요한 수(水) 기운으로 깊은 수면 명상 가이드해줘'
    },
    {
        icon: HelpCircle,
        color: 'from-teal-500/25 via-emerald-950/40 to-slate-950 border-teal-400/50 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.15)]',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
        title: '⚡ 결정 마비·우유부단',
        desc: '이 길인가 저 길인가 갈림길에서 망설이고 선택을 미룰 때',
        prompt: 'DBT 현명한 마음(Wise Mind)으로 최고의 결단 1가지 내려줘'
    },
    {
        icon: Crown,
        color: 'from-amber-400/25 via-yellow-950/40 to-slate-950 border-amber-300/60 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        badgeColor: 'bg-amber-400/20 text-amber-200 border-amber-300/50',
        title: '👑 영점 자각·평온 각성',
        desc: '내 삶의 모든 풍랑을 한 걸음 물러서서 고요히 바라보고 싶을 때',
        prompt: '오늘의 432Hz 제로포인트 순수 자각 명상 가이드 알려줘'
    }
];

export default function MindStateSelectorModal({
    isOpen,
    onClose,
    onSelectState
}: MindStateSelectorModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-2xl rounded-[32px] bg-[#080d1a] border-2 border-amber-400/50 shadow-[0_0_80px_rgba(245,158,11,0.3)] p-5 sm:p-7 overflow-hidden text-left text-white my-auto max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                    <span>😊 마음 상태 8대 세밀 조율</span>
                                    <span className="text-[10px] font-mono bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black shadow-sm">
                                        1:1 핑퐁 스위치
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-300 mt-1 font-medium">
                                    원하시는 내면 카드를 터치하시면 명심 AI 코치가 1:1 맞춤 대화를 즉시 주입합니다.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Grid of 8 Emotion Categories */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 overflow-y-auto pr-1 flex-1 no-scrollbar">
                        {MIND_STATE_DETAILS.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelectState(item.title.replace(/^[^\s]+\s*/, ''), item.prompt);
                                        onClose();
                                    }}
                                    className={`p-4.5 rounded-2xl bg-gradient-to-br ${item.color} border hover:border-amber-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all text-left group active:scale-[0.98] cursor-pointer relative overflow-hidden flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                                                {item.title}
                                            </span>
                                            <IconComponent size={18} className="opacity-80 group-hover:scale-125 transition-transform" />
                                        </div>
                                        <p className="text-xs text-gray-200 font-medium leading-relaxed mb-3.5">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-bold border-t border-white/15 pt-2.5 mt-auto">
                                        <span className="truncate text-amber-200 font-mono">"{item.prompt}"</span>
                                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black shrink-0 ml-1.5 flex items-center gap-1 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                                            <Zap size={10} />
                                            <span>1:1 주입</span>
                                            <ArrowRight size={10} />
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer note */}
                    <div className="pt-3 border-t border-white/10 text-center shrink-0">
                        <p className="text-[11px] text-amber-300/90 font-medium">
                            💡 선택하신 내면 상태에 맞춰 명심 AI 코치가 3단계(알아차림 ➔ 뇌 회로 재배선 ➔ 영점 각성) 흐름으로 다정하게 1:1 보살펴 드립니다.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
