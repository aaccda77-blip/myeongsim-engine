/**
 * /bio-care/page.tsx
 * 바이오 밸런서 메인 허브
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
    color: string;
    route: string;
}

const MENU_CARDS: MenuCard[] = [
    {
        id: 'med-literacy',
        title: '약물 리터러시',
        subtitle: 'Med-Literacy',
        description: '내 약을 제대로 이해하고 안전하게 복용하는 법',
        icon: 'medication',
        color: '#3b82f6',
        route: '/bio-care/med-literacy'
    },
    {
        id: 'nutri-synergy',
        title: '시너지 영양학',
        subtitle: 'Nutri-Synergy',
        description: '보충제와 음식, 약물 간의 조화로운 조합',
        icon: 'nutrition',
        color: '#10b981',
        route: '/bio-care/nutri-synergy'
    },
    {
        id: 'body-log',
        title: '신체 알아차림 로그',
        subtitle: 'Body Awareness',
        description: '내 몸의 변화를 기록하고 패턴 파악하기',
        icon: 'monitor_heart',
        color: '#f59e0b',
        route: '/bio-care/body-log'
    },
    {
        id: 'educator-note',
        title: '전문가의 한마디',
        subtitle: "Educator's Note",
        description: '보건교육사의 전문 지식과 바이오해킹 인사이트',
        icon: 'school',
        color: '#8b5cf6',
        route: '/bio-care/educator-note'
    }
];

export default function BioCarePage() {
    const router = useRouter();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.push('/')}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    바이오 밸런서
                </h2>
            </header>

            {/* Hero Section */}
            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-20 h-20 bg-gradient-to-br from-[#658c42] to-[#4a6b2f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="material-symbols-outlined text-white text-4xl">balance</span>
                </div>
                <h1 className="text-white text-2xl font-bold mb-2 font-serif">
                    바이오 밸런서
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                    약물, 영양, 신체의 균형을 찾아가는<br />
                    당신만의 건강 관리 파트너
                </p>
            </div>

            {/* Menu Cards */}
            <main className="flex-1 p-6 space-y-4 pb-8">
                {MENU_CARDS.map((card, index) => (
                    <motion.button
                        key={card.id}
                        onClick={() => router.push(card.route)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] group"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: `${card.color}20`, border: `1px solid ${card.color}40` }}
                            >
                                <span className="material-symbols-outlined text-2xl" style={{ color: card.color }}>
                                    {card.icon}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1 font-serif">
                                    {card.title}
                                </h3>
                                <p className="text-gray-500 text-xs mb-2 font-mono">
                                    {card.subtitle}
                                </p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-gray-600 group-hover:text-[#658c42] transition-colors">
                                chevron_right
                            </span>
                        </div>
                    </motion.button>
                ))}
            </main>

            {/* Footer Notice */}
            <div className="p-4 bg-white/5 border-t border-white/10">
                <p className="text-center text-xs text-gray-500 leading-relaxed">
                    💡 본 서비스는 보건교육 목적이며,<br />
                    의학적 진단이나 처방을 대신할 수 없습니다.
                </p>
            </div>
        </div>
    );
}
