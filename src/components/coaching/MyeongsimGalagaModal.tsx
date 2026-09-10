'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import MyeongsimGalagaGame from './MyeongsimGalagaGame';

interface MyeongsimGalagaModalProps {
    isOpen: boolean;
    onClose: () => void;
    language?: 'kr' | 'en' | 'jp' | 'cn';
    onExpEarned?: (amount: number) => void;
    onExamClear?: (level: number) => void;
}

export default function MyeongsimGalagaModal({
    isOpen,
    onClose,
    language = 'kr',
    onExpEarned,
    onExamClear
}: MyeongsimGalagaModalProps) {
    // ESC 키로 창 닫기 및 스크롤 락
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        try {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        } catch (err) {}

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            try {
                if (document.fullscreenElement && document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                }
            } catch (err) {}
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-[#04060f] flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-hidden"
            >
                {/* 🎮 상단 전용 타이틀 & 닫기 헤더 바 */}
                <div className="w-full max-w-lg flex items-center justify-between px-3 py-1.5 bg-[#0b1026] rounded-2xl border border-cyan-500/30 text-xs shadow-lg shrink-0 mb-1">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-black text-xs sm:text-sm">
                        <span className="text-base sm:text-lg animate-pulse">👾</span>
                        <span>네오 명심 갤러그 [전체화면 모드 창]</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="py-1 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 active:bg-rose-500/40 border border-rose-400/40 text-rose-300 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                        title="전체화면 창 닫기 (Esc)"
                    >
                        <X size={13} />
                        <span>창 닫기</span>
                    </button>
                </div>

                {/* 🚀 갤러그 게임 본체 (전체화면 모드 가동) */}
                <div className="flex-1 w-full flex flex-col items-center justify-between overflow-hidden">
                    <MyeongsimGalagaGame
                        language={language}
                        onExpEarned={onExpEarned}
                        onExamClear={onExamClear}
                        defaultExpanded={true}
                        onCloseModal={onClose}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
