'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, BookOpen, Music, MessageCircle, ArrowRight } from 'lucide-react';

interface BookVerificationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    buyerName: string;
    serialKey: string;
    onStartReading: () => void;
    onOpenHealingSong: () => void;
}

export default function BookVerificationSuccessModal({
    isOpen,
    onClose,
    buyerName,
    serialKey,
    onStartReading,
    onOpenHealingSong
}: BookVerificationSuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-sm bg-gradient-to-b from-[#182338] via-[#111C2F] to-[#0d1524] border-2 border-amber-400/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
                {/* 상단 골드 글로우 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

                {/* 엠블럼 */}
                <div className="size-16 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/30 border border-amber-200">
                    <Sparkles size={32} />
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                        정품 인증 성공
                    </span>
                    <h3 className="text-xl font-black text-white">
                        축하합니다, {buyerName}님!
                    </h3>
                    <p className="text-xs text-gray-300 font-mono">
                        라이선스: <span className="text-amber-300">{serialKey}</span>
                    </p>
                </div>

                {/* 3대 해금 혜택 박스 */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                        <span>📖 <strong>《ZERO POINT》 309p 전자책</strong> 무제한 열람 해금</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                        <span>🎵 <strong>1:1 헌정 힐링송 작곡 무료 신청권</strong> 자동 지급</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                        <span>💬 <strong>명심 AI 수석 코치 20회 VIP 대화권</strong> 즉시 활성화</span>
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-2">
                    <button
                        onClick={() => {
                            onClose();
                            onStartReading();
                        }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                    >
                        <BookOpen size={16} />
                        <span>e-Book 바로 읽기 시작 ➔</span>
                    </button>

                    <button
                        onClick={() => {
                            onClose();
                            onOpenHealingSong();
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                        <Music size={13} />
                        <span>🎵 1:1 헌정 힐링송 작곡 무료 신청하기</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
