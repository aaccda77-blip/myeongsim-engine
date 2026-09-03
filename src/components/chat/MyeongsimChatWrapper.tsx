'use client';

/**
 * MyeongsimChatWrapper — 기존 MyeongsimChat을 감싸는 클라이언트 래퍼
 *
 * [역할 분리 및 고도화]
 * - 《ZERO POINT》 공식 출판 도서관 1:1 북 도슨트 코칭 모드 장착
 * - 독자 VIP 20회 대화권 및 정품 배지 표시
 * - 대시보드 / 도서관 쾌속 복귀 네비게이션
 * - MyeongsimChat 원본 비즈니스 로직 100% 무수정 보존
 */

import React, { useState, useEffect } from 'react';
import { useAuthUser } from '@/hooks/useAuthUser';
import MyeongsimChat from '@/components/chat/MyeongsimChat';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, ArrowLeft, Home, HelpCircle, Check, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ViewModeSwitcher } from '@/components/simple/ViewModeSwitcher';

export default function MyeongsimChatWrapper() {
    const router = useRouter();
    const { id: userId, isLoading, isAuthenticated } = useAuthUser();
    const [isBookVerified, setIsBookVerified] = useState(false);
    const [buyerName, setBuyerName] = useState('');
    const [copiedChip, setCopiedChip] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const verified = localStorage.getItem('myeongsim_book_verified') === 'true';
            const name = localStorage.getItem('myeongsim_book_buyer') || localStorage.getItem('user_name') || '';
            setIsBookVerified(verified);
            setBuyerName(name);
        }
    }, []);

    // 추천 질문 칩 복사
    const handleCopyChip = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedChip(text);
        setTimeout(() => setCopiedChip(null), 2000);
    };

    // ── 로딩 중: 스켈레톤 UI
    if (isLoading) {
        return (
            <div className="flex flex-col h-[600px] max-h-[85vh] w-full max-w-2xl bg-[#0d131a]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-pulse select-none">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-48 bg-white/5 rounded" />
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <Sparkles className="w-6 h-6 text-primary-olive/50" />
                    </motion.div>
                </div>
            </div>
        );
    }

    // ── 인증 완료: 실제 userId 주입 / 미인증: 게스트 ID
    const effectiveUserId = isAuthenticated && userId
        ? userId
        : `guest-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <div className="w-full max-w-2xl space-y-3 select-none">
            {/* 상단 쾌속 네비게이션 헤더 */}
            <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/report')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-gray-300 border border-white/10 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={13} />
                        <span>대시보드로</span>
                    </button>
                    <button
                        onClick={() => router.push('/library')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-xs font-bold text-purple-300 border border-purple-400/20 transition-all cursor-pointer"
                    >
                        <BookOpen size={13} />
                        <span>📖 도서관</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <ViewModeSwitcher />
                </div>
            </div>

            {/* 🌟 《ZERO POINT》 전용 북 도슨트 AI 코칭 배너 🌟 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#141d2e] via-[#101b2a] to-[#141d2e] border border-cyan-400/30 text-left space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
                            <BookOpen size={14} />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-xs sm:text-sm font-bold text-white">
                                    《ZERO POINT》 1:1 북 도슨트 코칭
                                </h3>
                                {isBookVerified && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[9px] font-bold">
                                        독자 VIP
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400">
                                책 309페이지의 핵심 철학과 사주 기질을 결합해 AI가 1:1로 해석해 드립니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 추천 질문 칩 리스트 */}
                <div className="space-y-1">
                    <span className="text-[10px] text-cyan-300/80 font-mono flex items-center gap-1">
                        <Sparkles size={10} />
                        <span>추천 질문 클릭 시 자동 복사 ➔ 채팅창에 붙여넣어 물어보세요!</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { id: 'c1', text: '공적영지(알아차림을 알아차림)를 일상에서 실천하려면?' },
                            { id: 'c2', text: '달리는 자전거 위에서 멈춘다는 것의 구체적 의미는?' },
                            { id: 'c3', text: '내 안의 소음과 번아웃을 식히는 제로포인트 호흡법은?' },
                            { id: 'c4', text: '내 사주 오행 기질과 제로포인트의 상관관계는?' }
                        ].map((chip) => (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => handleCopyChip(chip.text)}
                                className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/30 text-[11px] text-gray-300 hover:text-white transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                            >
                                <span>{chip.text}</span>
                                {copiedChip === chip.text ? (
                                    <Check size={11} className="text-emerald-400" />
                                ) : (
                                    <Copy size={10} className="text-gray-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 인증 상태 배지 (개발 환경) */}
            {process.env.NODE_ENV === 'development' && (
                <div className={`px-3 py-1 rounded-full text-[10px] font-mono text-center w-fit mx-auto
                    ${isAuthenticated
                        ? 'bg-green-950/40 text-green-400 border border-green-500/30'
                        : 'bg-yellow-950/40 text-yellow-400 border border-yellow-500/30'
                    }`}>
                    {isAuthenticated ? `✅ 인증됨 · ${userId?.slice(0, 8)}...` : '⚠️ 게스트 모드'}
                </div>
            )}

            {/* 기존 MyeongsimChat — 100% 무수정 보존 */}
            <MyeongsimChat userId={effectiveUserId} />
        </div>
    );
}
