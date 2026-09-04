// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { 
    CreditCard, Shield, Sparkles, ArrowRight, Building2, Copy, Check, 
    KeyRound, ExternalLink, RefreshCw, BookOpen, Award, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentCardProps {
    onCopy?: () => void;
    onDetailedReport?: () => void;
    userId?: string;
}

export default function PaymentCard({ onDetailedReport, userId = 'guest-id' }: PaymentCardProps) {
    const [activeTab, setActiveTab] = useState<'smartstore' | 'bank' | 'book'>('smartstore');
    const [depositorName, setDepositorName] = useState('');
    const [phone, setPhone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [codeError, setCodeError] = useState<string | null>(null);
    const [isCheckingApproval, setIsCheckingApproval] = useState(false);

    const BANK_INFO = {
        bank: '카카오뱅크',
        account: '3333-01-2345678',
        holder: '청류 (이경윤)',
        price: 98000,
    };

    const handleCopyAccount = () => {
        navigator.clipboard.writeText(`${BANK_INFO.bank} ${BANK_INFO.account} ${BANK_INFO.holder}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // 1. 무통장 입금 신청 (입력만으로 자동 해제 금지! 관리자 승인 대기열에 등록)
    const handleRequestApproval = async () => {
        if (!depositorName.trim()) {
            alert('입금자 성함을 입력해 주세요!');
            return;
        }

        setIsProcessing(true);
        try {
            const finalUserId = phone.trim() || userId || depositorName.trim();
            const res = await fetch('/api/payment/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: BANK_INFO.price,
                    depositorName: depositorName.trim(),
                    phone: phone.trim(),
                    orderName: '특허출원 월정액 98,000원 ALL-PASS VIP',
                    itemType: 'MONTHLY_98K',
                    userId: finalUserId,
                })
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem('myeongsim_pending_approval', 'true');
                localStorage.setItem('myeongsim_depositor_name', depositorName.trim());
                if (phone.trim()) localStorage.setItem('myeongsim_phone', phone.trim());
                localStorage.setItem('myeongsim_user_id', finalUserId);
            }

            setIsProcessing(false);
            setIsRequested(true);
        } catch (error) {
            console.error('Approval Request Error:', error);
            setIsProcessing(false);
            setIsRequested(true);
        }
    };

    // 2. 관리자 승인 상태 실시간 확인 (새로고침 버튼)
    const handleCheckApprovalStatus = async () => {
        setIsCheckingApproval(true);
        try {
            const storedUserId = localStorage.getItem('myeongsim_user_id') || phone.trim() || userId;
            const storedName = localStorage.getItem('myeongsim_depositor_name') || depositorName.trim();

            const params = new URLSearchParams();
            if (storedUserId) params.set('userId', storedUserId);
            if (storedName) params.set('name', storedName);

            const res = await fetch(`/api/payment/check-approval?${params.toString()}&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.approved) {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('myeongsim_server_approved', 'true');
                        localStorage.setItem('myeongsim_monthly_vip', 'true');
                        localStorage.setItem('myeongsim_paid_user', 'true');
                        window.dispatchEvent(new Event('myeongsim_auth_change'));
                    }
                    alert('🎉 [승인 완료] 관리자의 입금 확인이 완료되었습니다! 124개 전 VIP 서비스가 활성화되었습니다.');
                    if (onDetailedReport) onDetailedReport();
                } else {
                    alert('⏳ 아직 관리자 확인 중입니다. 잠시 후 다시 [승인 확인]을 눌러주세요.\n(평균 1~3분 내 승인 완료)');
                }
            } else {
                alert('⏳ 관리자 확인 중입니다. 잠시 후 다시 시도해 주세요.');
            }
        } catch (e) {
            alert('확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsCheckingApproval(false);
        }
    };

    // 3. 도서 구매 주문/영수증 인증 (관리자 확인 연동)
    const handleVerifySecretCode = async () => {
        const cleaned = secretCode.trim();
        if (!cleaned) {
            setCodeError('스마트스토어 또는 서점 주문번호를 입력해 주세요.');
            return;
        }

        setIsProcessing(true);
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
                    localStorage.setItem('myeongsim_server_approved', 'true');
                    localStorage.setItem('myeongsim_smartstore_vip', 'true');
                    localStorage.setItem('myeongsim_book_verified', 'true');
                    localStorage.setItem('myeongsim_paid_user', 'true');
                    localStorage.setItem('myeongsim_verified_order', cleaned);
                    window.dispatchEvent(new Event('myeongsim_auth_change'));
                }
                alert('🎉 도서 구매 인증이 확인되었습니다! 제로포인트 기본 콘텐츠 및 30회 코칭이 활성화되었습니다.');
                if (onDetailedReport) onDetailedReport();
            } else {
                setCodeError(data.message || '유효하지 않은 주문번호이거나 관리자 승인 대기 중입니다.');
            }
        } catch (e) {
            console.error('Order verify error:', e);
            setCodeError('주문번호 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-gradient-to-br from-[#0c101c] via-[#111827] to-[#0a0e1a] rounded-3xl border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.2)] overflow-hidden my-3 text-left gpu-smooth select-none"
        >
            {/* Header: 특허출원 66% 파격 할인 배너 */}
            <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-slate-950 px-5 py-3.5 border-b border-amber-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-black text-white tracking-wide">명심코칭 VIP 올패스 멤버십</span>
                    </div>
                    <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        특허출원 66% OFF
                    </span>
                </div>

                {/* 가격 앵커링 */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-black/60 border border-amber-400/30 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-400 line-through block font-mono">정가 월 289,000원</span>
                        <span className="text-[11px] text-amber-400 font-bold">얼리액세스 한정 지원가</span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-xl font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                                98,000
                            </span>
                            <span className="text-xs font-bold text-white">원 / 월</span>
                        </div>
                        <span className="text-[9.5px] text-gray-400 font-mono">하루 약 3,200원대</span>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                {/* Tab Switcher (3대 창구) */}
                <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <button
                        onClick={() => { setActiveTab('smartstore'); setIsRequested(false); }}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            activeTab === 'smartstore'
                                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>1. 스마트스토어</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('bank'); setIsRequested(false); }}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            activeTab === 'bank'
                                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>2. 무통장 입금</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('book')}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            activeTab === 'book'
                                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>3. 도서 인증</span>
                    </button>
                </div>

                {/* TAB 1: 스마트스토어 결제 */}
                {activeTab === 'smartstore' && (
                    <div className="space-y-3">
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200 leading-relaxed">
                            🛒 <strong>청류 네이버 스마트스토어 공식 결제</strong><br />
                            네이버페이, 신용카드, 계좌이체 등 원하시는 결제 수단으로 <strong>월 98,000원</strong>에 VIP 올패스를 이용하실 수 있습니다.
                        </div>

                        <a
                            href="https://smartstore.naver.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                        >
                            <span>네이버 스마트스토어에서 98,000원 결제하기</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                        <p className="text-[10px] text-gray-400 text-center">
                            ※ 결제 후 주문번호를 [3. 도서 인증] 탭에 입력하시거나 관리자에게 전달해 주시면 즉시 열어드립니다.
                        </p>
                    </div>
                )}

                {/* TAB 2: 무통장 입금 신청 */}
                {activeTab === 'bank' && (
                    <>
                        {!isRequested ? (
                            <div className="space-y-3">
                                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-black text-amber-300">
                                        <span>🏦 공식 입금 전용 계좌</span>
                                        <span className="text-amber-400 font-mono text-sm">98,000원</span>
                                    </div>
                                    <div className="bg-black/60 border border-amber-400/25 rounded-xl p-2.5 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10.5px] text-gray-400 block font-mono">카카오뱅크 (예금주: 청류 이경윤)</span>
                                            <span className="text-sm font-black font-mono text-amber-300 tracking-wider">3333-01-2345678</span>
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

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-300 block">
                                            입금자 성함 *
                                        </label>
                                        <input
                                            type="text"
                                            value={depositorName}
                                            onChange={(e) => setDepositorName(e.target.value)}
                                            placeholder="예: 홍길동"
                                            className="w-full bg-slate-950 border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-300 block">
                                            연락처 (휴대폰) *
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="010-1234-5678"
                                            className="w-full bg-slate-950 border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequestApproval}
                                    disabled={isProcessing}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    <CreditCard className="w-4 h-4 text-slate-950" />
                                    <span>{isProcessing ? '신청 처리 중...' : '98,000원 입금 완료 및 관리자 승인 신청 ➔'}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-white">무통장 입금 신청이 접수되었습니다!</h4>
                                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                                    <strong className="text-white">'{depositorName}'</strong> 님의 입금 내역을 관리자가 확인 후<br />
                                    수분 내에 <strong className="text-amber-300">[열어주기 (승인)]</strong>를 완료합니다.
                                </p>
                                <div className="p-2.5 bg-black/60 rounded-xl border border-white/10 text-[10.5px] text-gray-400 font-mono">
                                    카카오뱅크 3333-01-2345678 (예금주: 청류 이경윤) / 98,000원
                                </div>

                                <button
                                    onClick={handleCheckApprovalStatus}
                                    disabled={isCheckingApproval}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApproval ? 'animate-spin' : ''}`} />
                                    <span>{isCheckingApproval ? '승인 상태 확인 중...' : '⚡ 관리자 승인 완료 확인 (새로고침)'}</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* TAB 3: 도서 구매 주문번호 인증 */}
                {activeTab === 'book' && (
                    <div className="space-y-3 text-left">
                        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-[11px] text-cyan-200 leading-relaxed">
                            📖 <strong>도서 《제로 포인트》 구매 독자 혜택</strong><br />
                            네이버 스마트스토어 또는 서점에서 구매하신 <strong>주문번호</strong>를 등록하시면 책 연계 제로포인트 콘텐츠 및 30회 코칭이 해금됩니다.
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
                                placeholder="예: 20260905-12345678 (주문번호)"
                                className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-wider text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-gray-600"
                            />
                            {codeError && (
                                <p className="text-[10.5px] text-rose-400 mt-1 text-center font-medium">
                                    {codeError}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleVerifySecretCode}
                            disabled={isProcessing}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span>{isProcessing ? '주문번호 확인 중...' : '도서 주문번호 인증하기 ➔'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-black/80 border-t border-white/5 text-center">
                <p className="text-[9.5px] text-gray-500 font-mono">
                    ⚡ 관리자 확인 및 승인 즉시 모든 잠금이 해제되며 영구 안전하게 관리됩니다.
                </p>
            </div>
        </motion.div>
    );
}

