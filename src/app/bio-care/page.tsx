/**
 * /bio-care/page.tsx
 * 바이오 밸런서 메인 허브 (Premium Design)
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
