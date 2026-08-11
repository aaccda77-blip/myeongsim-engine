'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, ShieldCheck, Zap, CreditCard, HeartHandshake, Copy, Check, Building2, UserCheck, Clock } from 'lucide-react';
import MyeongsimSunLogo from '../common/MyeongsimSunLogo';

interface MicroChatPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessPay?: () => void;
    userId?: string;
}

export default function MicroChatPassModal({
    isOpen,
    onClose,
    onSuccessPay,
    userId = 'guest-id'
}: MicroChatPassModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [depositorName, setDepositorName] = useState('');
    const [isRequested, setIsRequested] = useState(false);

    if (!isOpen) return null;

    const BANK_INFO = {
        bank: '토스뱅크',
        account: '1002-6847-4899',
        holder: '마인드플로우랩',
        price: 890,
    };

    const handleCopyAccount = () => {
        navigator.clipboard.writeText(`${BANK_INFO.bank} ${BANK_INFO.account} ${BANK_INFO.holder}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRequestApproval = async () => {
        if (!depositorName.trim()) {
            alert('입금자 성함 또는 연락처를 입력해 주세요!');
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: BANK_INFO.price,
                    depositorName: depositorName.trim(),
                    orderName: '명심코칭 수다 3회 충전권',
                    itemType: 'CHAT_3',
                    userId,
                })
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_pending_approval', 'true');
                localStorage.setItem('myeongsim_depositor_name', depositorName.trim());
            }

            setIsProcessing(false);
            setIsRequested(true);
        } catch (error) {
            console.error('Approval Request Error:', error);
            setIsProcessing(false);
            setIsRequested(true);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-[#0D1525] to-slate-950 border border-amber-400/40 shadow-2xl p-6 overflow-hidden text-center text-white"
                >
                    {/* Background Golden Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Sun Logo & Badge */}
                    <div className="flex flex-col items-center mt-1 mb-3">
                        <MyeongsimSunLogo size={52} className="mb-2" />
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-300" /> VVIP 마이크로 3회 이용권
                        </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="text-lg font-bold tracking-tight text-white mb-2 leading-snug">
                        🎁 첫 3회 무료 코칭 완료!<br />
                        <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy underline-offset-4">
                            890원에 1:1 맞춤 코칭 3회 이어가기
                        </span>
                    </h3>
                    <p className="text-xs text-gray-300 font-light leading-relaxed mb-4 px-2">
                        커피 한 잔보다 가벼운 890원으로 무통장 입금 후<br />
                        1:1 명심 코칭 3회 수다권을 즉시 충전하세요.
                    </p>

                    {/* 🏦 Bank Account Information Card */}
                    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 text-left relative shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-black text-amber-300">무통장 입금 계좌 안내</span>
                            </div>
                            <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full">
                                890원 (3회 수다권)
                            </span>
                        </div>

                        <div className="bg-black/40 border border-amber-400/20 rounded-xl p-3 mb-2 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-gray-400 block font-mono">토스뱅크 (예금주: 마인드플로우랩)</span>
                                <span className="text-sm font-black font-mono text-white tracking-wider">1002-6847-4899</span>
                            </div>
                            <button
                                onClick={handleCopyAccount}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold transition-all border border-amber-400/40 flex items-center gap-1 cursor-pointer"
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? '복사됨!' : '계좌 복사'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Approval Request / Input Section */}
                    {!isRequested ? (
                        <div className="space-y-3 mb-4">
                            <div className="text-left">
                                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                                    입금자 성함 또는 연락처 입력
                                </label>
                                <input
                                    type="text"
                                    value={depositorName}
                                    onChange={(e) => setDepositorName(e.target.value)}
                                    placeholder="예: 강미숙 (또는 010-XXXX-XXXX)"
                                    className="w-full bg-slate-900 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-center"
                                />
                            </div>

                            <button
                                onClick={handleRequestApproval}
                                disabled={isProcessing}
                                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-950 font-extrabold text-sm shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <CreditCard className="w-4 h-4 text-gray-950" />
                                <span>{isProcessing ? '신청 처리 중...' : '💳 890원 입금 완료 & 승인 신청하기'}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="mb-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mx-auto animate-pulse">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-bold text-emerald-300">입금 확인 승인 대기 중!</h4>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                입금자 <strong className="text-amber-300">[{depositorName || '고객님'}]</strong> 성함으로 승인 신청이 접수되었습니다.<br />
                                담당자가 입금 확인 후 <span className="text-emerald-300 font-bold">1~5분 이내 3회 수다권</span>을 자동 승인해 드립니다.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-2 w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 rounded-xl text-xs font-bold"
                            >
                                확인 및 닫기
                            </button>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>관리자 승인 즉시 3회 챗봇 & 컨텐츠 잠금 해제</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
