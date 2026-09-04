/**
 * /bio-care/page.tsx
 * 바이오 밸런서 메인 허브 (Premium Design)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import UnifiedSubscriptionModal from '@/components/modals/UnifiedSubscriptionModal';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface MenuCard {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    gradient: string;
    glowColor: string;
    route: string;
}

const MENU_CARDS: MenuCard[] = [
    {
        id: 'med-literacy',
        title: '라이프 영양 리터러시',
        subtitle: 'Nutri-Literacy',
        description: '나의 섭취 영양소와 라이프 밸런스 가이드',
        icon: 'nutrition',
        gradient: 'from-emerald-900/40 to-slate-900',
        glowColor: 'bg-emerald-500/10',
        route: '/bio-care/med-literacy'
    },
    {
        id: 'nutri-synergy',
        title: '영양소 타이밍 스케줄러',
        subtitle: 'Nutri-Timing',
        description: '흡수율 최적화를 위한 섭취 시간표',
        icon: 'schedule',
        gradient: 'from-blue-900/40 to-slate-900',
        glowColor: 'bg-blue-500/10',
        route: '/bio-care/nutri-scheduler'
    },
    {
        id: 'body-log',
        title: '신체 알아차림 로그',
        subtitle: 'Body Awareness',
        description: '내 몸 컨디션 반응을 기록하고 패턴 파악하기',
        icon: 'monitor_heart',
        gradient: 'from-orange-900/40 to-slate-900',
        glowColor: 'bg-orange-500/10',
        route: '/bio-care/body-log'
    },
    {
        id: 'educator-note',
        title: '전문가의 한마디',
        subtitle: "Educator's Note",
        description: '보건교육사의 영양·건강 전문 지식 칼럼',
        icon: 'school',
        gradient: 'from-purple-900/40 to-slate-900',
        glowColor: 'bg-purple-500/10',
        route: '/bio-care/educator-note'
    }
];

export default function BioCarePage() {
    const router = useRouter();

    // 🔒 잠금 상태 (월정액 98K 또는 관리자 승인 시 해금)
    const [isLocked, setIsLocked] = useState(true);
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isMonthlyVip = localStorage.getItem('myeongsim_monthly_vip') === 'true';
            const isBioUnlocked = localStorage.getItem('myeongsim_bio_care_unlocked') === 'true';
            const isSmartVip = localStorage.getItem('myeongsim_smartstore_vip') === 'true';
            const isPaidUser = localStorage.getItem('myeongsim_paid_user') === 'true';
            if (isMonthlyVip || isBioUnlocked || isSmartVip || isPaidUser) {
                setIsLocked(false);
            }
        }
    }, []);

    // 🔒 잠금 화면 렌더링
    if (isLocked) {
        return (
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-sm w-full bg-[#181526] border border-amber-400/30 rounded-3xl p-7 text-center space-y-4 shadow-2xl"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-500/10 rounded-2xl flex items-center justify-center mx-auto border border-amber-400/20">
                        <span className="material-symbols-outlined text-amber-400 text-4xl">lock</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[11px] font-mono font-black text-amber-400 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                            특허출원 기념 얼리액세스 한정
                        </span>
                        <h2 className="text-xl font-black text-white">바이오케어 밸런서</h2>
                    </div>
                    
                    <p className="text-xs text-gray-300 leading-relaxed">
                        간·심·비·폐·신 5대 장기 맞춤형 영양 시너지와 생체 리듬을 실시간 조율하는 VIP 전용 모듈입니다.
                    </p>

                    <div className="p-3 rounded-2xl bg-black/60 border border-amber-400/30 text-center">
                        <span className="text-[11px] text-gray-500 line-through font-mono block">
                            정가 월 289,000원
                        </span>
                        <div className="text-base font-black text-amber-300">
                            월 98,000원 <span className="text-xs text-amber-200 font-normal">(66% 파격 특별가)</span>
                        </div>
                    </div>

                    {/* 2대 결제 창구 (월정액 무통장입금 / 스마트스토어 도서구매) */}
                    <div className="flex flex-col gap-2 pt-1">
                        <button
                            onClick={() => setIsSubModalOpen(true)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                        >
                            <Sparkles size={16} />
                            <span>월 98,000원 무통장 입금 신청 / 해금</span>
                        </button>

                        <a
                            href="https://smartstore.naver.com/cheongryubooks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                        >
                            <ShoppingBag size={14} />
                            <span>네이버 스마트스토어에서 도서 구입</span>
                        </a>

                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold transition-all"
                        >
                            ← 홈으로 가기
                        </button>
                    </div>
                </motion.div>

                <UnifiedSubscriptionModal
                    isOpen={isSubModalOpen}
                    onClose={() => setIsSubModalOpen(false)}
                    featureName="바이오케어 5종 밸런서"
                />
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-white/5">
                <button
                    onClick={() => router.push('/')}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10">
                    바이오 밸런서
                </h2>
            </header>

            {/* Hero Section with Wave Background */}
            <div className="relative p-6 text-center border-b border-white/5 overflow-hidden">
                {/* Wave Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#1f2937]"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[60%] opacity-40">
                        <svg className="w-full h-full fill-[#658c42] block align-bottom" preserveAspectRatio="none" viewBox="0 0 1440 320">
                            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fillOpacity="1"></path>
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#658c42] to-[#4a6b2f] rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#658c42]/20">
                        <span className="material-symbols-outlined text-white text-4xl">balance</span>
                    </div>
                    <h1 className="text-white text-2xl font-bold mb-2">
                        바이오 밸런서
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        영양, 자율신경, 신체의 균형을 찾아가는<br />
                        당신만의 건강 관리 파트너
                    </p>
                </div>
            </div>

            {/* Menu Cards */}
            <main className="flex-1 p-6 space-y-4 pb-8 overflow-y-auto">
                {MENU_CARDS.map((card, index) => (
                    <motion.button
                        key={card.id}
                        onClick={() => router.push(card.route)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-full p-6 rounded-[2rem] bg-gradient-to-br ${card.gradient} border border-white/5 relative overflow-hidden group hover:border-[#658c42]/30 transition-all cursor-pointer active:scale-[0.98]`}
                    >
                        {/* Glow Effect */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${card.glowColor} rounded-full blur-3xl -mr-10 -mt-10`}></div>

                        <div className="relative flex items-start justify-between">
                            <div className="flex items-start gap-4 text-left flex-1">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10">
                                    <span className="material-symbols-outlined text-[#658c42] text-2xl">
                                        {card.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs mb-2 font-mono">
                                        {card.subtitle}
                                    </p>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-[#658c42] transition-colors">
                                arrow_forward_ios
                            </span>
                        </div>
                    </motion.button>
                ))}

                {/* Info Tip Card */}
                <div className="p-6 rounded-[2rem] bg-gradient-to-r from-blue-900/40 to-slate-900 border border-white/5 relative overflow-hidden mt-6">
                    <div className="flex gap-4">
                        <div className="shrink-0 text-yellow-400 mt-1">
                            <span className="material-symbols-outlined text-[24px]">lightbulb</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-white font-semibold">알고 계셨나요?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                약물 복용만큼 중요한 것이 생활 습관 관리입니다.
                                규칙적인 식사, 충분한 수분 섭취, 적절한 운동이 약의 효과를 높입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Notice */}
            <div className="p-4 bg-[#1f2937]/90 backdrop-blur-md border-t border-white/5">
                <p className="text-center text-xs text-slate-500 leading-relaxed">
                    💡 본 서비스는 보건교육 목적이며,<br />
                    의학적 분석이나 가이드을 대신할 수 없습니다.
                </p>
            </div>
        </div>
    );
}
