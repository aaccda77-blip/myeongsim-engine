'use client';

import React, { useState } from 'react';
import { ViewModeSwitcher } from '@/components/simple/ViewModeSwitcher';
import { User, Shield, Sparkles, MessageCircle, Calendar, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/useReportStore';
import { useViewMode } from '@/hooks/useViewMode';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ProfileModal = dynamic(() => import('@/components/user/ProfileModal'), { ssr: false });

interface RefinedHeaderProps {
    userName: string;
    isVip: boolean;
}

export function RefinedHeader({ userName, isVip }: RefinedHeaderProps) {
    const router = useRouter();
    const { setViewMode } = useViewMode();
    const [showBirthMenu, setShowBirthMenu] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // 1. 생년월일 메인 커버 페이지 이동
    const handleGoToCoverPage = () => {
        setShowBirthMenu(false);
        useReportStore.getState().setStep(1);
        setViewMode('classic');
        router.push('/report');
    };

    // 2. 4단계 정밀 온보딩 페이지 이동
    const handleGoToOnboarding = () => {
        setShowBirthMenu(false);
        router.push('/onboarding');
    };

    // 3. 현재 화면에서 빠른 팝업 수정 열기
    const handleOpenQuickModal = () => {
        setShowBirthMenu(false);
        setIsProfileModalOpen(true);
    };

    return (
        <>
            <header className="flex items-center justify-between pb-3 pt-1 border-b border-white/[0.08]">
                <div className="space-y-1 text-left min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#F4F6F8] tracking-tight truncate">
                            {userName}님
                        </h1>
                        {/* Compact Level Badge */}
                        <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold flex-shrink-0">
                            Lv.10 마인드
                        </span>
                        {/* Small VIP Indicator */}
                        {isVip && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-black flex items-center gap-1 flex-shrink-0">
                                <Sparkles size={10} />
                                <span>VIP</span>
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#9AA7B7] truncate">
                        오늘의 상태를 확인하고 필요한 행동을 안내받으세요.
                    </p>
                    {/* 📅 생년월일 페이지 바로가기 메뉴 칩 */}
                    <div className="pt-0.5 flex items-center gap-2">
                        <button
                            onClick={() => setShowBirthMenu(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all shadow-sm active:scale-95 group cursor-pointer"
                            title="생년월일 및 사주 페이지 메뉴"
                        >
                            <Calendar size={13} className="text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>생년월일·사주 페이지</span>
                            <ChevronRight size={13} className="text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <ViewModeSwitcher />
                    <button
                        onClick={() => setShowBirthMenu(true)}
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                        title="생년월일 페이지 메뉴"
                    >
                        <Calendar size={16} className="text-amber-400" />
                        <span className="hidden sm:inline text-xs font-bold text-amber-200">생년월일</span>
                    </button>
                    <button
                        onClick={() => router.push('/myeongsim-chat')}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-all border border-white/10 cursor-pointer"
                        title="1:1 AI 상담"
                    >
                        <MessageCircle size={16} />
                    </button>
                    <button
                        onClick={() => router.push('/settings')}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-all border border-white/10 cursor-pointer"
                        title="설정"
                    >
                        <User size={16} />
                    </button>
                </div>
            </header>

            {/* 생년월일 이동 메뉴 모달 */}
            <AnimatePresence>
                {showBirthMenu && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 select-none">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            className="w-full max-w-md bg-[#111C2F] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 text-left space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">생년월일·사주 메뉴</h3>
                                        <p className="text-[11px] text-gray-400">원하시는 이동 및 수정 방식을 선택하세요</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBirthMenu(false)}
                                    className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-2.5 pt-1">
                                {/* 옵션 1: 생년월일 메인 커버 페이지 */}
                                <button
                                    onClick={handleGoToCoverPage}
                                    className="w-full p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left flex items-center justify-between group transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20 flex-shrink-0">
                                            📅
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-amber-200">생년월일 입력 페이지 (메인 커버)</span>
                                                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-black">추천</span>
                                            </div>
                                            <p className="text-[11px] text-gray-300 mt-0.5">만세력 4주 8자, 오행·십성 전체 분석 및 생년월일 재설정</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                                </button>

                                {/* 옵션 2: 4단계 정밀 온보딩 */}
                                <button
                                    onClick={handleGoToOnboarding}
                                    className="w-full p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left flex items-center justify-between group transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                            🧬
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white">4단계 정밀 온보딩 페이지</span>
                                            <p className="text-[11px] text-gray-400 mt-0.5">생년월시 + 스트레스 요인 + 심리지표 통합 설정</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                                </button>

                                {/* 옵션 3: 빠른 간편 팝업 수정 */}
                                <button
                                    onClick={handleOpenQuickModal}
                                    className="w-full p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left flex items-center justify-between group transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                            ⚡
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white">현재 화면에서 빠른 수정 (간편 팝업)</span>
                                            <p className="text-[11px] text-gray-400 mt-0.5">대시보드를 벗어나지 않고 팝업으로 생년월일 즉시 변경</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 빠른 간편 수정 모달 */}
            {isProfileModalOpen && (
                <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
            )}
        </>
    );
}
