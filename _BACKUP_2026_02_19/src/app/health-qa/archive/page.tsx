/**
 * /health-qa/archive/page.tsx
 * 건강상식 아카이브 페이지 (지난 상담 보기)
 * 
 * 디자인: Deep Tech Dark Theme (#1f2937)
 * 기능: 지난 질문 목록 표시
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HEALTH_KNOWLEDGE_DB, CATEGORY_LABELS } from '@/data/HealthKnowledgeDB';
import { motion } from 'framer-motion';

export default function HealthQAArchivePage() {
    const router = useRouter();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#1f2937] max-w-md mx-auto shadow-xl overflow-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-[#1f2937]/90 backdrop-blur-md p-4 border-b border-gray-800">
                <button
                    onClick={() => router.back()}
                    className="text-[#658c42] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <h2 className="text-white text-lg font-bold leading-tight flex-1 text-center pr-10 font-serif">
                    지난 상담 보기
                </h2>
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-20">
                <div className="mb-6">
                    <h3 className="text-white text-xl font-bold mb-2 font-serif">지식 아카이브</h3>
                    <p className="text-gray-400 text-sm">
                        명심 코칭이 제공했던 건강 지식을 모아봤어요.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {HEALTH_KNOWLEDGE_DB.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                                // TODO: 상세 보기로 이동 (현재는 alert)
                                alert(`'${item.question}' 상세 내용은 준비 중입니다.`);
                            }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10 transition-all active:scale-[0.98] group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="px-2 py-1 bg-[#658c42]/20 text-[#658c42] text-[10px] font-bold rounded-md">
                                    {CATEGORY_LABELS[item.category]}
                                </span>
                                <span className="material-symbols-outlined text-gray-600 group-hover:text-[#658c42] transition-colors text-lg">
                                    arrow_forward_ios
                                </span>
                            </div>
                            <h4 className="text-white font-bold leading-snug mb-2 font-serif">
                                {item.question}
                            </h4>
                            <p className="text-gray-400 text-xs line-clamp-2">
                                {item.answer.core_message}
                            </p>
                        </motion.button>
                    ))}
                </div>
            </main>
        </div>
    );
}
