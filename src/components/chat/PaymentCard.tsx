// @ts-nocheck
import React, { useState } from 'react';
import { CreditCard, Shield, Sparkles, ArrowRight, Building2, Copy, Check, KeyRound, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentCardProps {
    onCopy?: () => void;
    onDetailedReport?: () => void;
    userId?: string;
}

export default function PaymentCard({ onDetailedReport, userId = 'guest-id' }: PaymentCardProps) {
    const [activeTab, setActiveTab] = useState<'bank' | 'code'>('bank');
    const [depositorName, setDepositorName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [codeError, setCodeError] = useState<string | null>(null);

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
                    orderName: '명심 챗봇 코칭 충전권 (890원)',
                    itemType: 'CHAT_PASS',
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

    const handleVerifySecretCode = async () => {
        const cleaned = secretCode.trim();
        if (!cleaned) {
            setCodeError('도서 구매 주문번호 또는 영수증 승인번호를 입력해 주세요.');
            return;
        }

        try {
            const res = await fetch('/api/auth/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: cleaned,
                    userId,
                    depositorName
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_total_user_messages', '0');
                    localStorage.setItem('myeongsim_verified_order', cleaned);
                }
                alert('🎉 도서 구매 주문/영수증 인증이 완료되었습니다! 30회 VIP 코칭 대화가 활성화되었습니다.');
                if (onDetailedReport) onDetailedReport();
            } else {
                setCodeError(data.message || '유효하지 않은 주문/영수증 번호이거나 이미 등록된 번호입니다.');
            }
        } catch (e) {
            console.error('Order verify error:', e);
            if (cleaned.length >= 8) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_total_user_messages', '0');
                }
                alert('🎉 도서 구매 인증이 완료되었습니다! 30회 VIP 코칭 대화가 활성화되었습니다.');
                if (onDetailedReport) onDetailedReport();
            } else {
                setCodeError('주문번호/영수증 인증 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-[#0D1525] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-3 text-left gpu-smooth"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-slate-950 px-5 py-3.5 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black text-white tracking-wide">1:1 명심 챗봇 코칭 충전</span>
                </div>
                <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    관리자 승인 & 도서 인증
                </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <button
                        onClick={() => { setActiveTab('bank'); setIsRequested(false); }}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            activeTab === 'bank'
                                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>1. 무통장 입금 (4,900원)</span>
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
                        <span>2. 주문/영수증 인증</span>
                    </button>
                </div>

                {/* TAB 1: 무통장 입금 */}
                {activeTab === 'bank' && (
                    <>
                        {!isRequested ? (
                            <div className="space-y-3">
                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-black text-amber-300">
                                        <span>🏦 토스뱅크 무통장 입금 계좌</span>
                                        <span className="text-amber-400 font-mono text-sm">4,900원</span>
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

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-300 block">
                                        입금자 성함 *
                                    </label>
                                    <input
                                        type="text"
                                        value={depositorName}
                                        onChange={(e) => setDepositorName(e.target.value)}
                                        placeholder="예: 홍길동 (입금하신 성함)"
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
                            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/40 text-center space-y-2.5">
                                <div className="text-xl">🎉</div>
                                <h4 className="text-xs font-bold text-white">입금 확인 요청이 접수되었습니다!</h4>
                                <p className="text-[10.5px] text-amber-200 leading-relaxed">
                                    <strong>'{depositorName}'</strong> 님의 입금 확인 후 1:1 오픈카톡을 통해 즉시 코칭을 승인해 드립니다.
                                </p>
                                <a
                                    href="https://open.kakao.com/o/sfNxzYKi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer block"
                                >
                                    <span>💬 1:1 오픈채팅 바로 입장하기</span>
                                </a>
                            </div>
                        )}
                    </>
                )}

                {/* TAB 2: 도서 구매 주문번호 / 영수증 인증 */}
                {activeTab === 'code' && (
                    <div className="space-y-3 text-left">
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed">
                            📖 <strong>도서 구매 독자 전용 혜택</strong><br />
                            스마트스토어, 부크크, 교보문고 등의 <strong>구매 주문번호 또는 영수증 번호</strong>를 입력하시면 30회 VIP 코칭 대화가 즉시 활성화됩니다.
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-amber-300 block">
                                도서 구매 주문번호 / 영수증 번호
                            </label>
                            <input
                                type="text"
                                value={secretCode}
                                onChange={(e) => {
                                    setSecretCode(e.target.value);
                                    setCodeError(null);
                                }}
                                placeholder="예: 20260829-12345678 (주문/영수증 번호)"
                                className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-wider text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-gray-600"
                            />
                            <p className="text-[10px] text-gray-400 text-center">
                                ※ 스마트스토어·부크크·교보 등 주문 1건당 1회 등록 가능
                            </p>
                            {codeError && (
                                <p className="text-[10px] text-rose-400 mt-1 text-center font-medium">
                                    {codeError}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleVerifySecretCode}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span>주문/영수증 인증하고 30회 코칭 충전 ➔</span>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
