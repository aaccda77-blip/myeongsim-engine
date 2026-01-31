/**
 * /health-qa/custom/page.tsx
 * 맞춤 질문하기 페이지
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import HealthQAView from '@/components/health-qa/HealthQAView';
import { searchHealthQA, type HealthQATemplate } from '@/data/HealthKnowledgeDB';
import { motion } from 'framer-motion';

export default function CustomHealthQAPage() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<HealthQATemplate | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsLoading(true);

        // 로딩 연출 (AI가 생각하는 척)
        setTimeout(() => {
            const answer = searchHealthQA(input);
            setResult(answer);
            setIsLoading(false);
        }, 1500);
    };

    const reset = () => {
        setResult(null);
        setInput('');
    };

    // 결과 화면
    if (result) {
        return (
            <HealthQAView
                qaData={result}
                onClose={reset}
            />
        );
    }

    // 입력 화면
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
                    맞춤 질문하기
                </h2>
            </header>

            <main className="flex-1 p-6 flex flex-col">
                <div className="text-center mb-8 mt-4">
                    <div className="w-16 h-16 bg-[#658c42]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#658c42]/30">
                        <span className="material-symbols-outlined text-[#658c42] text-3xl">search_check</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2 font-serif">
                        건강 고민이 있으신가요?
                    </h3>
                    <p className="text-gray-400 text-sm">
                        명심 AI 코치에게 물어보세요.<br />친절하고 따뜻하게 답변해 드릴게요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="relative flex-1 mb-6">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="예: 허리가 아픈데 윗몸일으키기 해도 되나요?"
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#658c42] focus:ring-1 focus:ring-[#658c42] resize-none shadow-inner transition-all"
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                            {input.length}자
                        </div>
                    </div>

                    <div className="mt-auto pb-8">
                        {isLoading ? (
                            <div className="w-full h-14 bg-[#658c42]/20 text-[#658c42] rounded-2xl flex items-center justify-center font-bold gap-2 cursor-wait border border-[#658c42]/30">
                                <span className="animate-spin material-symbols-outlined">sync</span>
                                분석 중입니다...
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-full h-14 bg-[#658c42] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#537337] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">send</span>
                                질문하기
                            </button>
                        )}
                        <p className="text-center text-[11px] text-gray-600 mt-4">
                            본 서비스는 의학적 진단이 아닌 건강 정보 제공을 목적으로 합니다.
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
