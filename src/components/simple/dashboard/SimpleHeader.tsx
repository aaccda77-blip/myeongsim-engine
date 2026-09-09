'use client';

import React, { useState } from 'react';
import { ViewModeSwitcher } from '../ViewModeSwitcher';
import { User, Calendar, ChevronRight, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/store/useReportStore';
import { useViewMode } from '@/hooks/useViewMode';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ProfileModal = dynamic(() => import('@/components/user/ProfileModal'), { ssr: false });

interface SimpleHeaderProps {
    userName: string;
    onOpenProfile?: () => void;
}

export function SimpleHeader({ userName, onOpenProfile }: SimpleHeaderProps) {
    const router = useRouter();
    const { setViewMode } = useViewMode();
    const [showBirthMenu, setShowBirthMenu] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // 1. 생년월일 메인 커버 페이지 이동 (사주 만세력 4주 8자 및 오행 전체 분석 페이지)
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
        if (onOpenProfile) {
            onOpenProfile();
        } else {
            setIsProfileModalOpen(true);
        }
    };

    return (
        <>
            <header className="space-y-2 pb-2.5 pt-1 border-b border-white/[0.06]">
                {/* 1열: 상단 타이틀 & 뷰모드 스위처 */}
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate flex items-center gap-1.5">
                            <span>안녕하세요, {userName}님</span>
                            <span className="text-sm">👋</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <ViewModeSwitcher />
                        <button
                            type="button"
                            onClick={() => router.push('/settings')}
                            className="p-1.5 sm:p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-all border border-white/10 cursor-pointer"
                            title="프로필 및 설정"
                        >
                            <User size={15} />
                        </button>
                    </div>
                </div>

                {/* 2열: 서브 안내 문구 & 사주 원국·생년월일 메뉴 칩 */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                    <p className="text-xs text-gray-400 font-medium truncate">
                        오늘의 나를 차분히 확인해보세요.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowBirthMenu(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer group"
                        title="사주 원국 및 생년월일 메뉴"
                    >
                        <Calendar size={12} className="text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>사주 원국·생년월일</span>
                        <ChevronRight size={11} className="text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
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
