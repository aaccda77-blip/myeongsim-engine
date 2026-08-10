'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, DollarSign, Moon, Brain, Sparkles, Compass, Building2, Heart, ArrowRight } from 'lucide-react';

interface TrendingTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTopic: (promptText: string) => void;
}

export const TRENDING_TOPICS = [
    {
        icon: DollarSign,
        color: 'from-amber-500/20 via-yellow-600/20 to-slate-900 border-amber-400/50 text-amber-300',
        badge: '🔥 인기 1위',
        badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
        title: '💰 사주 기반 재물·사업 스케일업 파이프라인',
        desc: '내 사주팔자 8글자로 돈을 버는 체급과 890원 마이크로 퍼널 ➔ B2B 30만원 고단가 연결 구조',
        prompt: '내 사주로 돈 벌 수 있어? 890원 퍼널 ➔ B2C/B2B 30만원 고단가 연결 구조 정밀 분석해줘'
    },
    {
        icon: Moon,
        color: 'from-sky-500/20 via-indigo-600/20 to-slate-900 border-sky-400/50 text-sky-300',
        badge: '🌙 몰입 듀얼트랙',
        badgeColor: 'bg-sky-400/20 text-sky-300 border-sky-400/40',
        title: '🌙 낮 vs 밤 맞춤 작업 시간대 (Dual-Track Protocol)',
        desc: '사주에 수(水) 냉각수가 비어있을 때 밤/새벽 딥워크 쿨링과 낮 실행의 최적 분업 법칙',
        prompt: '밤/새벽에 일해야 해, 낮에 해야 해? 내 명식 맞춤 딥워크 시간대 듀얼트랙 알려줘'
    },
    {
        icon: Brain,
        color: 'from-purple-500/20 via-pink-600/20 to-slate-900 border-purple-400/50 text-purple-300',
        badge: '🧠 뇌 신경망',
        badgeColor: 'bg-purple-400/20 text-purple-300 border-purple-400/40',
        title: '🧠 뇌 신경가소성 & 64괘 기질 뇌회로 재배선',
        desc: '반복되는 자책과 조급증 버그를 메타인지 질문으로 재배선하는 3세대 인지뇌과학 처방',
        prompt: '내 사주 8글자와 뇌 신경망을 연결해서 불필요한 생각 버그를 재배선해줘'
    },
    {
        icon: Compass,
        color: 'from-emerald-500/20 via-teal-600/20 to-slate-900 border-emerald-400/50 text-emerald-300',
        badge: '📜 특허출원',
        badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
        title: '📜 특허출원 명심코칭 3S (Scan·Sync·Shift) 1분 처방',
        desc: '현장에서 즉시 적용하는 다크코드 수용 ➔ 뇌회로 재배선 ➔ 영점 각성 3단계 실천 알고리즘',
        prompt: '오늘 당장 실천할 수 있는 명심 3S 코칭 1분 디버깅 루틴 알려줘'
    },
    {
        icon: Sparkles,
        color: 'from-rose-500/20 via-pink-600/20 to-slate-900 border-rose-400/50 text-rose-300',
        badge: '💎 80% 미학',
        badgeColor: 'bg-rose-400/20 text-rose-300 border-rose-400/40',
        title: '💎 60갑자 일간별 완벽주의 내려놓기 (80% 미학)',
        desc: '100점 무결점에 갇혀 배포를 미루는 완벽주의 마비를 깨뜨리는 80% 미학 감동 에세이',
        prompt: '내 일간(본인 기운)에 맞는 완벽주의 해제 80% 미학 1:1 감동 에세이 전해줘'
    },
    {
        icon: Building2,
        color: 'from-yellow-500/20 via-amber-600/20 to-slate-900 border-yellow-400/50 text-yellow-300',
        badge: '🏢 B2B 스케일업',
        badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
        title: '🏢 B2B 기업 HR & 개인 1:1 브랜드 포지셔닝 전략',
        desc: '나만의 분석 역량을 B2B 기업 계약 30만원 / 개인 리포트로 안착시키는 주권자 포지셔닝',
        prompt: 'B2B 30만원 기업 워크숍 및 개인 1:1 브랜드 포지셔닝 전략 알려줘'
    },
    {
        icon: Heart,
        color: 'from-pink-500/20 via-rose-600/20 to-slate-900 border-pink-400/50 text-pink-300',
        badge: '💖 내면 자비',
        badgeColor: 'bg-pink-400/20 text-pink-300 border-pink-400/40',
        title: '💖 자책 멈춤 & 내면가족체계(IFS) 생존 보호자 수용',
        desc: '불안과 조급함이 사실 나를 지켜주려던 따뜻한 생존 보호자(Protector)였음을 안아주기',
        prompt: '나를 옥죄던 자책감과 불안을 생존 보호자로 자비롭게 안아주는 코칭'
    },
    {
        icon: Flame,
        color: 'from-indigo-500/20 via-purple-600/20 to-slate-900 border-indigo-400/50 text-indigo-300',
        badge: '👑 영점 각성',
        badgeColor: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40',
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
                    className="relative w-full max-w-2xl rounded-3xl bg-[#080d1a] border border-indigo-400/40 shadow-[0_0_60px_rgba(99,102,241,0.25)] p-5 sm:p-7 overflow-hidden text-left text-white my-auto max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-md">
                                <Flame size={20} className="text-amber-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                    <span>🔥 2026 트렌딩 탐구 주제 8선</span>
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-full font-mono">
                                        인기 TOP 8
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    최근 사용자들이 가장 뜨겁게 질문하는 핵심 실전 주제를 원클릭으로 탐구해 보세요.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Grid of 8 Trending Topics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 overflow-y-auto pr-1 flex-1 no-scrollbar">
                        {TRENDING_TOPICS.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onSelectTopic(item.prompt);
                                        onClose();
                                    }}
                                    className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border hover:border-amber-300 transition-all text-left group active:scale-[0.98] cursor-pointer relative overflow-hidden flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                                                {item.badge}
                                            </span>
                                            <IconComponent size={16} className="opacity-80 group-hover:scale-110 transition-transform text-amber-300" />
                                        </div>
                                        <h4 className="text-xs font-black text-white mb-1.5 leading-snug">
                                            {item.title}
                                        </h4>
                                        <p className="text-[11px] text-gray-300 font-medium leading-relaxed mb-3">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold border-t border-white/10 pt-2.5 mt-auto">
                                        <span className="truncate">"{item.prompt}"</span>
                                        <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer note */}
                    <div className="pt-3 border-t border-white/10 text-center shrink-0">
                        <p className="text-[11px] text-gray-400">
                            💡 클릭 시 제미나이 4D 신경망 분석 엔진이 1:1 맞춤 감동 코칭을 즉각 직조합니다.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
