/**
 * HealthQAView.tsx
 * 오늘의 건강상식 메인 화면
 * 
 * 디자인: 자연스러운 힐링 테마 (녹색 계열)
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
        // const checkBookmark = async () => { ... }
    }, [qaData.id]);

    // 북마크 토글
    const handleBookmark = async () => {
        try {
            // TODO: API 호출
            // await fetch('/api/health-qa/bookmark', { method: 'POST', body: JSON.stringify({ qaId: qaData.id }) });
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('북마크 실패:', error);
        }
    };

    // 읽기 기록 저장
    useEffect(() => {
        const startTime = Date.now();

        return () => {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            // TODO: API 호출로 읽기 기록 저장
            // fetch('/api/health-qa/view', { method: 'POST', body: JSON.stringify({ qaId: qaData.id, duration }) });
        };
    }, [qaData.id]);

    return (
        <>
            <div className="relative flex h-full min-h-screen w-full flex-col bg-[#FDFCF8] max-w-md mx-auto shadow-xl overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center bg-[#FDFCF8]/90 backdrop-blur-md p-4 border-b border-[#E8EDDF]">
                    <button
                        onClick={onClose}
                        className="text-[#6B8E23] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[#E8EDDF] transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-[#583101] text-lg font-bold leading-tight flex-1 text-center pr-10">
                        매일의 마음 쉼
                    </h2>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pb-32">
                    {/* Question Card */}
                    <div className="px-5 pt-8 pb-4">
                        <div className="bg-[#E8EDDF]/40 rounded-[2rem_1rem_2.5rem_1.5rem] p-6 border border-[#E8EDDF] relative overflow-hidden shadow-sm">
                            <span className="material-symbols-outlined absolute -top-2 -right-2 opacity-10 text-6xl text-[#6B8E23] pointer-events-none">
                                eco
                            </span>

                            {/* User Avatar */}
                            <div className="flex w-full flex-row items-center justify-start gap-3 mb-4 relative z-10">
                                <div className="bg-[#6B8E23]/20 rounded-full w-12 h-12 shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#6B8E23]">person</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[#583101] text-sm font-bold">건강을 생각하는 회원님</p>
                                    <p className="text-[#6B8E23]/70 text-xs font-medium">오늘의 질문</p>
                                </div>
                            </div>

                            {/* Question */}
                            <h3 className="text-[#583101] text-lg font-medium leading-relaxed relative z-10">
                                <span className="text-[#6B8E23] font-black text-xl mr-1">Q.</span>
                                {qaData.question}
                            </h3>
                        </div>
                    </div>

                    {/* Answer Section */}
                    <div className="px-6 pt-6 pb-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center justify-center size-9 rounded-full bg-[#6B8E23]/10 text-[#6B8E23]">
                                <span className="material-symbols-outlined text-xl">psychology</span>
                            </div>
                            <h3 className="text-[#583101] tracking-tight text-xl font-black">
                                명심 코칭의 따뜻한 조언
                            </h3>
                        </div>

                        {/* Greeting */}
                        <div className="prose max-w-none mb-4">
                            <p className="text-[#583101]/80 text-[1.05rem] font-normal leading-relaxed">
                                {qaData.answer.greeting}
                            </p>
                        </div>

                        {/* Core Message */}
                        <div className="prose max-w-none mb-6">
                            <p className="text-[#583101]/80 text-[1.05rem] font-normal leading-relaxed">
                                {qaData.answer.core_message}
                            </p>
                        </div>
                    </div>

                    {/* Advice Cards */}
                    <div className="px-5 pt-6 flex flex-col gap-5">
                        {qaData.answer.advice_cards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/60 backdrop-blur-sm border border-[#E0E5D8] p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md"
                                style={{
                                    borderRadius: '1.5rem 1rem 2rem 1.2rem',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 35c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM54 80c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM66 66c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM80 46c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM20 54c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z' fill='%236B8E23' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
                                }}
                            >
                                <div className="flex gap-x-4 items-start">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8EDDF] text-[#6B8E23] shadow-inner">
                                        <span className="material-symbols-outlined">{card.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[#583101] text-lg font-bold leading-tight mb-2">
                                            {card.title}
                                        </h4>
                                        <p className="text-[#583101]/70 text-[0.95rem] font-normal leading-relaxed">
                                            {card.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Closing Message */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="bg-[#6B8E23]/5 rounded-2xl p-4 border border-[#6B8E23]/10">
                            <p className="text-[#583101]/80 text-sm leading-relaxed">
                                {qaData.answer.closing}
                            </p>
                        </div>
                    </div>

                    <div className="h-10"></div>
                </main>

                {/* Footer - Share Buttons */}
                <footer className="absolute bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-[#E8EDDF] p-6 pb-8 rounded-t-[2.5rem] shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.03)]">
                    <h4 className="text-center text-[#583101] text-sm font-bold mb-5">
                        이 따뜻한 조언을 소중한 분께 전해보세요
                    </h4>
                    <div className="flex justify-around items-center max-w-xs mx-auto">
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="size-14 rounded-2xl bg-[#FEE500] flex items-center justify-center shadow-md group-active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-[#3C1E1E] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    chat_bubble
                                </span>
                            </div>
                            <span className="text-[0.7rem] text-[#583101]/60 font-bold">카카오톡</span>
                        </button>

                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="size-14 rounded-2xl bg-[#6B8E23] flex items-center justify-center shadow-md group-active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    send
                                </span>
                            </div>
                            <span className="text-[0.7rem] text-[#583101]/60 font-bold">문자메시지</span>
                        </button>

                        <button
                            onClick={handleBookmark}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="size-14 rounded-2xl bg-[#E8EDDF] flex items-center justify-center shadow-md group-active:scale-95 transition-all">
                                <span
                                    className={`material-symbols-outlined text-[#583101] text-2xl ${isBookmarked ? 'filled' : ''}`}
                                    style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                                >
                                    bookmark
                                </span>
                            </div>
                            <span className="text-[0.7rem] text-[#583101]/60 font-bold">북마크</span>
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
