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
        price: 98000,
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
                    orderName: '명심코칭 1달 무제한 프리패스 (98,000원)',
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

    // 🎫 네이버 스마트스토어 주문번호 인증 핸들러 (1건당 1회 30회 충전)
    // 🎫 도서 구매 주문번호 / 영수증 인증 핸들러 (1건당 1회 20회 충전 & 스마트스토어 올인원 패키지)
    const handleVerifySecretCode = async () => {
        const cleaned = secretCode.trim();
        if (!cleaned) {
            setCodeError('도서 구매 주문번호 또는 영수증 승인번호를 입력해 주세요.');
            return;
        }

        try {
            const isSmart = /^\d{16}$/.test(cleaned.replace(/-/g, ''));
            const res = await fetch('/api/auth/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: cleaned,
                    userId,
                    depositorName,
                    channel: isSmart ? 'smartstore' : 'general'
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_total_user_messages', '0');
                    localStorage.setItem('myeongsim_verified_order', cleaned);
                    localStorage.setItem('myeongsim_startup_unlocked', 'true');
                    localStorage.setItem('myeongsim_dark_code_unlocked', 'true');
                    localStorage.setItem('myeongsim_bio_care_unlocked', 'true');
                    if (isSmart) {
                        localStorage.setItem('myeongsim_smartstore_vip', 'true');
                    }
                }
                alert(data.message || '🎉 도서 구매 인증이 완료되었습니다! 20회 VIP 코칭 대화가 활성화되었습니다.');
                if (onSuccessPay) onSuccessPay();
                onClose();
            } else {
                setCodeError(data.message || '유효하지 않은 주문/영수증 번호이거나 이미 등록된 번호입니다.');
            }
        } catch (e) {
            console.error('Order verify error:', e);
            setCodeError('인증 처리 중 네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
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
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-3 h-3 fill-amber-300" /> 3회 무료 코칭 완료
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                🔬 특허출원 제10-2025-0166877호
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-black tracking-tight text-white mb-1.5 leading-snug">
                        1:1 명심 AI 특허 웰니스 코칭 충전
                    </h3>
                    <p className="text-[11px] text-gray-300 font-light leading-relaxed mb-3">
                        특허 출원된 [심리·생체 4단계 웰니스 솔루션] 1달 무제한 패스를 이용하시거나,<br />
                        <strong>도서 구매 주문/영수증 번호</strong>를 입력하시면 20회 코칭이 즉시 활성화됩니다.
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
                            <span>1. 1달 무제한 패스</span>
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

                    {/* TAB 2: 도서 구매 주문번호 / 영수증 인증 */}
                    {activeTab === 'code' && (
                        <div className="space-y-3.5 text-left animate-fade-in">
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 leading-relaxed space-y-1">
                                <p className="font-bold text-amber-300">👑 청류스토어 vs 📖 일반 서점 독자 혜택</p>
                                <p>• <strong>청류스마트스토어 주문번호(16자리)</strong>: ➔ <span className="text-white font-bold">20회 코칭 + 힐링송 + 스타트업 리포트 + 다크코드 + 바이오케어</span> 슈퍼패키지 전면 무료 해금!</p>
                                <p>• <strong>교보/예스24/부크크 영수증 번호</strong>: ➔ <span className="text-white font-bold">1:1 맞춤 힐링송 + 20회 코칭 대화권</span> 즉시 충전!</p>
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
                                    placeholder="예: 20260829-12345678 또는 네이버 주문번호 16자리"
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
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 fill-current" />
                                <span>주문/영수증 인증하고 혜택 해금 ➔</span>
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
