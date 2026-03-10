/**
 * HealthQAView.tsx
 * 오늘의 건강상식 메인 화면
 * 
 * 디자인: Deep Tech Dark Theme (#1f2937, #658c42)
 * 기능: Q&A 표시, 공유 버튼
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareInsightModal from './ShareInsightModal';
import type { HealthQATemplate } from '@/data/HealthKnowledgeDB';

interface HealthQAViewProps {
    qaData: HealthQATemplate;
    onClose?: () => void;
}

export default function HealthQAView({ qaData, onClose }: HealthQAViewProps) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // 북마크 상태 확인
    useEffect(() => {
        // TODO: API 호출로 북마크 상태 확인
    }, [qaData.id]);

    // 북마크 토글
    const handleBookmark = async () => {
        try {
            // TODO: API 호출
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('북마크 실패:', error);
        }
    };

    // 읽기 기록 저장
    useEffect(() => {
        const startTime = Date.now();
        return () => {
            // const duration = Math.floor((Date.now() - startTime) / 1000);
            // TODO: API 호출로 읽기 기록 저장
        };
    }, [qaData.id]);

    return (
        <>
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                    <button
                        onClick={onClose}
                        className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                        오늘의 건강상식
                    </h2>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pb-32">
                    {/* Question Card */}
                    <div className="px-5 pt-8 pb-4">
                        <div className="bg-[#658c42]/10 rounded-[2rem_1rem_2.5rem_1.5rem] p-6 border border-[#658c42]/30 relative overflow-hidden shadow-lg backdrop-blur-sm">
                            <span className="material-symbols-outlined absolute -top-2 -right-2 opacity-20 text-6xl text-[#658c42] pointer-events-none">
                                eco
                            </span>

                            {/* User Avatar */}
                            <div className="flex w-full flex-row items-center justify-start gap-3 mb-4 relative z-10">
                                <div className="bg-[#658c42]/20 rounded-full w-12 h-12 shrink-0 border border-[#658c42]/50 shadow-sm flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#658c42]">person</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-white text-sm font-bold">건강을 생각하는 회원님</p>
                                    <p className="text-[#658c42] text-xs font-medium">오늘의 질문</p>
                                </div>
                            </div>

                            {/* Question */}
                            <h3 className="text-white text-lg font-medium leading-relaxed relative z-10 font-serif">
                                <span className="text-[#658c42] font-black text-xl mr-2">Q.</span>
                                {qaData.question}
                            </h3>
                        </div>
                    </div>

                    {/* Answer Section */}
                    <div className="px-6 pt-6 pb-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center justify-center size-9 rounded-full bg-[#658c42]/20 text-[#658c42]">
                                <span className="material-symbols-outlined text-xl">psychology</span>
                            </div>
                            <h3 className="text-white tracking-tight text-xl font-bold font-serif">
                                명심 코칭의 따뜻한 조언
                            </h3>
                        </div>

                        {/* Greeting */}
                        <div className="prose max-w-none mb-4">
                            <p className="text-gray-300 text-[1.05rem] font-normal leading-relaxed">
                                {qaData.answer.greeting}
                            </p>
                        </div>

                        {/* Core Message */}
                        <div className="prose max-w-none mb-6">
                            <p className="text-gray-200 text-[1.05rem] font-medium leading-relaxed">
                                {qaData.answer.core_message}
                            </p>
                        </div>
                    </div>

                    {/* Advice Cards */}
                    <div className="px-5 pt-6 flex flex-col gap-4">
                        {qaData.answer.advice_cards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 p-5 relative overflow-hidden transition-all duration-300 hover:bg-white/10 rounded-2xl"
                            >
                                <div className="flex gap-x-4 items-start">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#658c42]/20 text-[#658c42] shadow-inner border border-[#658c42]/30">
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-white text-lg font-bold leading-tight mb-2">
                                            {card.title}
                                        </h4>
                                        <p className="text-gray-400 text-[0.95rem] font-normal leading-relaxed">
                                            {card.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Closing Message */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="bg-[#658c42]/10 rounded-2xl p-4 border border-[#658c42]/30">
                            <p className="text-[#658c42] text-sm leading-relaxed font-medium">
                                {qaData.answer.closing}
                            </p>
                        </div>
                    </div>

                    <div className="h-10"></div>
                </main>

                {/* Footer - Share Buttons */}
                <footer className="absolute bottom-0 w-full bg-[#1f2937]/90 backdrop-blur-xl border-t border-gray-800 p-6 pb-8 rounded-t-[2.5rem] shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.3)]">
                    <h4 className="text-center text-gray-400 text-sm font-bold mb-5">
                        이 따뜻한 조언을 소중한 분께 전해보세요
                    </h4>
                    <div className="flex justify-around items-center max-w-xs mx-auto">
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="size-14 rounded-2xl bg-[#FEE500] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                <span className="material-symbols-outlined text-[#3C1E1E] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    chat_bubble
                                </span>
                            </div>
                            <span className="text-[0.7rem] text-gray-400 font-bold group-hover:text-white transition-colors">카카오톡</span>
                        </button>

                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="size-14 rounded-2xl bg-[#658c42] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    send
                                </span>
                            </div>
                            <span className="text-[0.7rem] text-gray-400 font-bold group-hover:text-white transition-colors">문자공유</span>
                        </button>

                        <button
                            onClick={handleBookmark}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="size-14 rounded-2xl bg-gray-700 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-gray-600">
                                <span
                                    className={`material-symbols-outlined text-white text-2xl ${isBookmarked ? 'filled text-[#658c42]' : ''}`}
                                    style={isBookmarked ? { fontVariationSettings: "'FILL' 1", color: '#658c42' } : {}}
                                >
                                    bookmark
                                </span>
                            </div>
                            <span className="text-[0.7rem] text-gray-400 font-bold group-hover:text-white transition-colors">북마크</span>
                        </button>
                    </div>
                </footer>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <ShareInsightModal
                        qaData={qaData}
                        onClose={() => setShowShareModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
