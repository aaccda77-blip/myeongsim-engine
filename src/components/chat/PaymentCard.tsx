// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { 
    Sparkles, ArrowRight, Copy, Check, 
    ExternalLink, BookOpen, Heart, Mail, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentCardProps {
    onCopy?: () => void;
    onDetailedReport?: () => void;
    userId?: string;
}

export default function PaymentCard({ onDetailedReport, userId = 'guest-id' }: PaymentCardProps) {
    const [isCopiedAccount, setIsCopiedAccount] = useState(false);
    const [isCopiedEmail, setIsCopiedEmail] = useState(false);

    const BANK_INFO = {
        bank: '토스뱅크',
        account: '1002-6847-4899',
        holder: '마인드플로우랩',
    };

    const FEEDBACK_EMAIL = 'admin@mindflowlab.co.kr';

    const handleCopyAccount = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(`${BANK_INFO.bank} ${BANK_INFO.account} ${BANK_INFO.holder}`);
            setIsCopiedAccount(true);
            setTimeout(() => setIsCopiedAccount(false), 2000);
        }
    };

    const handleCopyEmail = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(FEEDBACK_EMAIL);
            setIsCopiedEmail(true);
            setTimeout(() => setIsCopiedEmail(false), 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-gradient-to-br from-[#0c101c] via-[#111827] to-[#0a0e1a] rounded-3xl border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.25)] overflow-hidden my-3 text-left select-none"
        >
            {/* Header: 오픈기념 전면 무료 개방 배너 */}
            <div className="bg-gradient-to-r from-emerald-950/90 via-emerald-900/50 to-slate-950 px-5 py-4 border-b border-emerald-500/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span className="text-sm font-black text-white tracking-wide">명심코칭 오픈기념 전면 무료</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        전면 무료 혜택
                    </span>
                </div>

                {/* 무료 앵커링 */}
                <div className="mt-3 p-3 rounded-xl bg-black/60 border border-emerald-400/30 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-400 line-through block font-mono">정가 월 289,000원</span>
                        <span className="text-[11px] text-emerald-400 font-bold">오픈 축하 특별 프로모션</span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-2xl font-black text-emerald-300 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                                0
                            </span>
                            <span className="text-xs font-bold text-white">원 (100% 무료)</span>
                        </div>
                        <span className="text-[9.5px] text-emerald-400/80 font-mono">전체 결제 시스템 해제</span>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                {/* 1. 알림 메시지 (무료 & 제한 안내) */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200 leading-relaxed space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        오픈기념 전면 무료 개방 & 안내
                    </div>
                    <p className="text-gray-300 text-[11.5px] leading-relaxed">
                        모든 결제 시스템을 해제하고 무료로 개방했습니다. 부담 없이 편안하게 이용해 보세요!
                    </p>
                    <p className="text-amber-400/90 text-[11px] font-medium pt-1 border-t border-amber-500/20">
                        ⚠️ 일부 서비스는 무료 기간 동안 서버 안정화 및 점검으로 인해 작동이 제한될 수 있습니다.
                    </p>
                </div>

                {/* 2. 자율후원 안내 박스 */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                            <span>연구개발비용 자율후원</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                            자율후원
                        </span>
                    </div>
                    <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                        무료로 보시고, 마인드플로우랩 연구개발비용을 자율후원 해주시면 앱개발에 큰 도움이 됩니다.
                    </p>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between gap-2">
                        <div className="text-[11.5px] font-mono text-white">
                            <span className="text-emerald-400 font-semibold">{BANK_INFO.bank} </span>
                            <span>{BANK_INFO.account} </span>
                            <span className="text-[10px] text-gray-400 font-sans">({BANK_INFO.holder})</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyAccount}
                            className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                            {isCopiedAccount ? <Check size={12} /> : <Copy size={12} />}
                            <span>{isCopiedAccount ? '복사됨' : '계좌복사'}</span>
                        </button>
                    </div>
                </div>

                {/* 3. 피드백 및 기능 제안 */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-500/30 text-[11px] text-gray-300 space-y-1.5">
                    <div className="flex items-center justify-between text-indigo-300 font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-indigo-400" />
                            앱 추가 내용 및 피드백 환영
                        </span>
                    </div>
                    <p className="text-gray-300 text-[10.5px] leading-relaxed">
                        추가하고 싶으신 내용이나 피드백을 주시면 연구개발에 적극 반영하겠습니다.
                    </p>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-indigo-500/20 text-[11px] font-mono">
                        <span className="text-indigo-200">{FEEDBACK_EMAIL}</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className="text-gray-400 hover:text-white text-[10px] underline underline-offset-2 cursor-pointer"
                            >
                                {isCopiedEmail ? '복사됨' : '복사'}
                            </button>
                            <a
                                href={`mailto:${FEEDBACK_EMAIL}?subject=[명심앱 피드백 및 제안]`}
                                className="text-indigo-400 hover:text-indigo-300 text-[10px] underline underline-offset-2 cursor-pointer"
                            >
                                메일쓰기
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4. YES24 도서 바로가기 버튼 */}
                <a
                    href="https://www.yes24.com/Product/Goods/195946431"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-between hover:brightness-110 active:scale-[0.98] transition-all shadow-md border border-indigo-400/30 cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-200" />
                        <span>📖 명심(明心) 공식 도서 자세히 보기</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
                </a>

                {/* 5. 무료 리포트 바로보기 버튼 */}
                {onDetailedReport && (
                    <button
                        onClick={onDetailedReport}
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                        <span>🎉 무료 리포트 전체 즉시 열람하기</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-black/80 border-t border-white/5 text-center">
                <p className="text-[9.5px] text-gray-500 font-mono">
                    ⚡ 오픈기념 기간 동안 모든 콘텐츠를 무료로 이용하실 수 있습니다. 감사합니다.
                </p>
            </div>
        </motion.div>
    );
}
