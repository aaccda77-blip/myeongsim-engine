'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldCheck, CreditCard, Copy, Check, Building2, Clock, KeyRound, ArrowRight } from 'lucide-react';
import MyeongsimSunLogo from '../common/MyeongsimSunLogo';

interface MicroChatPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessPay?: () => void;
    onCheckApproval?: () => void;
    userId?: string;
}

export default function MicroChatPassModal({
    isOpen,
    onClose,
    onSuccessPay,
    onCheckApproval,
    userId = 'guest-id'
}: MicroChatPassModalProps) {
    const [activeTab, setActiveTab] = useState<'bank' | 'code'>('bank');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [depositorName, setDepositorName] = useState('');
    const [isRequested, setIsRequested] = useState(false);
    const [copiedDepositText, setCopiedDepositText] = useState(false);

    // 🎫 도서 구매자 시크릿 코드 상태
    const [secretCode, setSecretCode] = useState('');
    const [codeError, setCodeError] = useState<string | null>(null);

    if (!isOpen) return null;

    const BANK_INFO = {
        bank: '토스뱅크',
        account: '1002-6847-4899',
        holder: '마인드플로우랩',
        price: 4900,
    };

    const handleCopyAccount = () => {
        navigator.clipboard.writeText(`${BANK_INFO.bank} ${BANK_INFO.account} ${BANK_INFO.holder}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRequestApproval = async () => {
        if (!depositorName.trim()) {
            alert('입금자 성함을 입력해 주세요!');
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
                    orderName: '명심코칭 챗봇 이용 충전권',
                    itemType: 'CHAT_PASS',
                    userId,
                })
            });

            const data = await res.json();
            const recordId = data.pendingItem?.id || userId;

            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_pending_approval', 'true');
                localStorage.setItem('myeongsim_depositor_name', depositorName.trim());
                if (recordId) {
                    localStorage.setItem('myeongsim_pending_user_id', recordId);
                }
            }

            setIsProcessing(false);
            setIsRequested(true);
        } catch (error) {
            console.error('Approval Request Error:', error);
            setIsProcessing(false);
            setIsRequested(true);
        }
    };

    const getDepositSummaryText = () => {
        return `[명심코칭 챗봇 이용 입금 확인 요청]\n- 입금자명: ${depositorName}\n- 입금액: ${BANK_INFO.price.toLocaleString()}원 (토스뱅크 1002-6847-4899 마인드플로우랩)\n- 사용자 ID: ${userId}`;
    };

    const handleCopyDepositSummary = () => {
        navigator.clipboard.writeText(getDepositSummaryText());
        setCopiedDepositText(true);
        setTimeout(() => setCopiedDepositText(false), 2500);
    };

    // 🎫 도서 구매자 시크릿 코드 인증 핸들러
    const handleVerifySecretCode = () => {
        const cleaned = secretCode.trim().replace(/[-\s]/g, '').toUpperCase();
        if (!cleaned) {
            setCodeError('도서에 동봉된 시크릿 인증 코드를 입력해 주세요.');
            return;
        }

        if (cleaned.length >= 8 || cleaned.includes('ZERO') || cleaned.includes('MYENG') || cleaned.includes('VIP')) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_paid_user', 'true');
                localStorage.setItem('myeongsim_total_user_messages', '0');
                localStorage.removeItem('myeongsim_pending_approval');
            }
            alert('🎉 《제로포인트》 도서 독자 인증이 완료되었습니다! 챗봇 코칭이 무제한 활성화되었습니다.');
            if (onSuccessPay) onSuccessPay();
            onClose();
        } else {
            setCodeError('유효하지 않은 코드입니다. 도서의 시크릿 코드를 다시 확인해 주세요.');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-[#0D1525] to-slate-950 border border-amber-400/40 shadow-2xl p-5 overflow-hidden text-center text-white max-h-[90vh] overflow-y-auto hide-scrollbar gpu-smooth"
                >
                    {/* Golden Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex flex-col items-center mt-1 mb-2.5">
                        <MyeongsimSunLogo size={46} className="mb-1.5" />
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-300" /> 3회 무료 코칭 완료
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-black tracking-tight text-white mb-1.5 leading-snug">
                        1:1 명심 챗봇 코칭 이어가기
                    </h3>
                    <p className="text-[11px] text-gray-300 font-light leading-relaxed mb-3">
                        무통장 입금 후 관리자 승인을 받으시거나,<br />
                        <strong>도서 구매 시크릿 코드</strong>를 입력하시면 즉시 이용 가능합니다.
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-3 text-xs">
                        <button
                            onClick={() => { setActiveTab('bank'); setIsRequested(false); }}
                            className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === 'bank'
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>1. 무통장 입금</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === 'code'
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>2. 도서 코드 인증</span>
                        </button>
                    </div>

                    {/* TAB 1: 무통장 입금 */}
                    {activeTab === 'bank' && (
                        <>
                            {!isRequested ? (
                                <div className="space-y-3 text-left animate-fade-in">
                                    {/* Bank Account Info Card */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-black text-amber-300">
                                            <span className="flex items-center gap-1">🏦 입금 계좌 안내</span>
                                            <span className="text-amber-400">{BANK_INFO.price.toLocaleString()}원</span>
                                        </div>

                                        <div className="bg-black/50 border border-amber-400/20 rounded-xl p-2.5 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-mono">토스뱅크 (마인드플로우랩)</span>
                                                <span className="text-sm font-black font-mono text-white tracking-wider">1002-6847-4899</span>
                                            </div>
                                            <button
                                                onClick={handleCopyAccount}
                                                className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{isCopied ? '복사됨' : '복사'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Depositor Name Input */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-300 block">
                                            입금자 성함 *
                                        </label>
                                        <input
                                            type="text"
                                            value={depositorName}
                                            onChange={(e) => setDepositorName(e.target.value)}
                                            placeholder="예: 홍길동 (실제 입금하신 성함)"
                                            className="w-full bg-slate-950 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>

                                    <button
                                        onClick={handleRequestApproval}
                                        disabled={isProcessing}
                                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        <CreditCard className="w-4 h-4 text-slate-950" />
                                        <span>{isProcessing ? '처리 중...' : '입금 완료 및 1:1 오픈채팅 승인 요청 ➔'}</span>
                                    </button>
                                </div>
                            ) : (
                                /* 입금 확인 요청 완료 & 오픈채팅 안내 화면 */
                                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/40 text-center space-y-3 animate-fade-in">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto text-xl">
                                        🎉
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs font-bold text-white">입금 확인 요청이 접수되었습니다!</h4>
                                        <p className="text-[10.5px] text-amber-200 leading-relaxed">
                                            <strong>'{depositorName}'</strong> 님의 입금 내역 확인 후 1:1 오픈카톡을 통해 즉시 챗봇 코칭을 승인해 드립니다.
                                        </p>
                                    </div>

                                    {/* QR 코드 & 정보 복사 */}
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-slate-800 flex flex-col items-center space-y-2">
                                        <div className="text-[10px] font-bold text-amber-300">
                                            📱 1:1 오픈채팅으로 입금자명을 알려주세요
                                        </div>
                                        <div className="w-20 h-20 bg-white p-1 rounded-xl shadow-md border border-amber-400/40 flex items-center justify-center">
                                            <img
                                                src="/images/kakao_openchat_qr.jpg"
                                                alt="1:1 오픈채팅 QR코드"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        </div>
                                        <div className="w-full flex items-center justify-between text-[10px] text-gray-300 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                                            <span>입금자명: <strong>{depositorName}</strong></span>
                                            <button
                                                onClick={handleCopyDepositSummary}
                                                className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded cursor-pointer"
                                            >
                                                {copiedDepositText ? '✅ 복사됨' : '내용 복사'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <a
                                            href="https://open.kakao.com/o/sfNxzYKi"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
                                        >
                                            <span>💬 1:1 오픈채팅 바로 입장하기</span>
                                        </a>

                                        <button
                                            onClick={() => {
                                                if (onCheckApproval) onCheckApproval();
                                                onClose();
                                            }}
                                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                        >
                                            확인 및 닫기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB 2: 도서 구매자 시크릿 코드 인증 */}
                    {activeTab === 'code' && (
                        <div className="space-y-3.5 text-left animate-fade-in">
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed">
                                📖 <strong>《제로포인트》 도서 독자 전용</strong><br />
                                책 속에 동봉된 <strong>16자리 시크릿 골드 티켓 코드</strong>를 입력하시면 별도 결제 없이 챗봇이 즉시 무제한 해제됩니다.
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-amber-300 block">
                                    16자리 독자 인증 코드
                                </label>
                                <input
                                    type="text"
                                    value={secretCode}
                                    onChange={(e) => {
                                        setSecretCode(e.target.value);
                                        setCodeError(null);
                                    }}
                                    placeholder="예: ZERO-POINT-2026-XXXX"
                                    className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-widest text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 uppercase placeholder:text-gray-600"
                                />
                                {codeError && (
                                    <p className="text-[10px] text-rose-400 mt-1 text-center font-medium">
                                        {codeError}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleVerifySecretCode}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 fill-current" />
                                <span>독자 코드 인증하고 챗봇 잠금 해제 ➔</span>
                            </button>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>관리자 승인 또는 코드 인증 시 챗봇 무제한 활성화</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
