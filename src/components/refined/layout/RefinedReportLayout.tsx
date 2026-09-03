'use client';

import React from 'react';
import { useReportStore } from '@/store/useReportStore';
import { ViewModeSwitcher } from '@/components/simple/ViewModeSwitcher';
import { ChevronLeft, ChevronRight, Home, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RefinedReportLayoutProps {
    children: React.ReactNode;
    onReturnToDashboard: () => void;
}

export function RefinedReportLayout({ children, onReturnToDashboard }: RefinedReportLayoutProps) {
    const { currentStep, totalSteps, nextStep, prevStep, setStep } = useReportStore();

    const progressPercentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

    // 단계별 명칭 매핑
    const stepTitles: Record<number, string> = {
        1: '기질 정보 입력',
        2: '사이언스 인트로',
        3: '사주 4주8자 원국',
        4: '아이덴티티 분석',
        5: '오행 레이더 차트',
        6: '십신 탤런트 분석',
        7: '기질 플립 카드',
        8: '관계 에너지 버블',
        9: '재물 그릇 게이지',
        10: '인생 라이프 웨이브',
        11: '생애 타임라인',
        12: '핵심 실천 과제',
        13: '에필로그 & 자각',
        14: '양자 마스터 코어'
    };

    return (
        <div className="relative min-h-screen w-full bg-[#182333] text-[#F4F6F8] font-sans flex flex-col items-center justify-between select-none">
            
            {/* 1. 상단 컴팩트 헤더 (56px) */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#101B2E]/95 border-b border-white/[0.08] backdrop-blur-md h-14 px-4 flex items-center justify-between max-w-xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onReturnToDashboard}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-gray-200 transition-all border border-white/10 cursor-pointer active:scale-95"
                        title="대시보드로 돌아가기"
                    >
                        <Home size={13} className="text-[#FFAA00]" />
                        <span>대시보드</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                            {stepTitles[currentStep] || `Step ${currentStep}`}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-400/20">
                            {currentStep}/{totalSteps}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ViewModeSwitcher />
                </div>
            </header>

            {/* 2. 메인 콘텐츠 래퍼 (상단 56px, 하단 72px 여백 확보로 겹침 0%) */}
            <main className="flex-1 w-full max-w-xl mx-auto pt-16 pb-24 px-4 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="w-full min-h-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* 3. 하단 컴팩트 네비게이션 바 (56px + Safe Area) */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#101B2E]/95 border-t border-white/[0.08] backdrop-blur-md max-w-xl mx-auto w-full pb-[env(safe-area-inset-bottom)]">
                {/* 슬림 프로그레스 바 */}
                <div className="w-full h-0.5 bg-white/10 overflow-hidden">
                    <div
                        className="h-full bg-[#FFAA00] transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <div className="h-14 px-4 flex items-center justify-between">
                    {/* 이전 버튼 */}
                    <button
                        onClick={prevStep}
                        disabled={currentStep <= 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 active:scale-95"
                    >
                        <ChevronLeft size={16} />
                        <span>이전</span>
                    </button>

                    {/* 중앙 대시보드 복귀 버튼 */}
                    <button
                        onClick={onReturnToDashboard}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                        <span>대시보드 홈</span>
                    </button>

                    {/* 다음 버튼 */}
                    <button
                        onClick={nextStep}
                        disabled={currentStep >= totalSteps}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#FFAA00] hover:bg-[#ffb71a] text-slate-950 shadow-sm active:scale-95 cursor-pointer"
                    >
                        <span>다음</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </footer>
        </div>
    );
}
